const express = require('express');
const { query, param, validationResult } = require('express-validator');
const database = require('../config/database');
const logger = require('../config/logger');

const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors:', { errors: errors.array(), url: req.originalUrl });
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

/**
 * GET /api/analytics/market-summary
 * Get key market metrics summary for specific region and housing type
 */
router.get('/market-summary', [
  query('regionId').isInt({ min: 1 }).withMessage('Region ID must be a positive integer'),
  query('housingTypeId').optional().isInt({ min: 1 }).withMessage('Housing type ID must be a positive integer'),
  query('period').optional().isIn(['monthly', 'quarterly', 'yearly']).withMessage('Period must be monthly, quarterly, or yearly'),
  validateRequest
], async (req, res) => {
  try {
    const { regionId, housingTypeId = 1, period = 'monthly' } = req.query;

    // Build housing type filter and query parameters
    const housingTypeFilter = housingTypeId === '1' ? '' : 'AND ps.housing_type_id = ?';
    
    // Parameters need to include regionId for subqueries
    let currentQueryParams, previousQueryParams;
    if (housingTypeId === '1') {
      currentQueryParams = [regionId, regionId]; // regionId for main query and subquery
      previousQueryParams = [regionId, regionId, regionId]; // regionId for main query and two subqueries
    } else {
      currentQueryParams = [regionId, housingTypeId, regionId]; // regionId, housingTypeId, regionId for subquery
      previousQueryParams = [regionId, housingTypeId, regionId, regionId]; // regionId, housingTypeId, and two regionIds for subqueries
    }

    // Get current period metrics (use last 3 months of available data)
    const currentQuery = `
      SELECT 
        COUNT(*) as total_sales,
        AVG(ps.sale_price) as avg_price,
        AVG(ps.days_on_market) as avg_days_on_market,
        SUM(ps.sale_price) as total_sales_value,
        MAX(ps.sale_date) as latest_sale_date,
        MIN(ps.sale_date) as earliest_sale_date
      FROM property_sales ps
      WHERE ps.region_id = ?
        ${housingTypeFilter}
        AND ps.sale_date >= (
          SELECT DATE_SUB(MAX(sale_date), INTERVAL 90 DAY) 
          FROM property_sales 
          WHERE region_id = ?
        )
    `;

    // Get previous period metrics for comparison (3 months before current period)
    const previousQuery = `
      SELECT 
        COUNT(*) as total_sales,
        AVG(ps.sale_price) as avg_price,
        AVG(ps.days_on_market) as avg_days_on_market
      FROM property_sales ps
      WHERE ps.region_id = ?
        ${housingTypeFilter}
        AND ps.sale_date >= (
          SELECT DATE_SUB(MAX(sale_date), INTERVAL 180 DAY) 
          FROM property_sales 
          WHERE region_id = ?
        )
        AND ps.sale_date < (
          SELECT DATE_SUB(MAX(sale_date), INTERVAL 90 DAY) 
          FROM property_sales 
          WHERE region_id = ?
        )
    `;

    // Get active listings count
    const inventoryQuery = `
      SELECT COUNT(*) as active_listings
      FROM active_listings al
      WHERE al.region_id = ?
        ${housingTypeId !== '1' ? 'AND al.housing_type_id = ?' : ''}
    `;

    const inventoryParams = housingTypeId === '1' ? [regionId] : [regionId, housingTypeId];

    const [currentResult, previousResult, inventoryResult] = await Promise.all([
      database.query(currentQuery, currentQueryParams),
      database.query(previousQuery, previousQueryParams),
      database.query(inventoryQuery, inventoryParams)
    ]);

    const current = currentResult.rows[0];
    const previous = previousResult.rows[0];
    const inventory = inventoryResult.rows[0];

    // Calculate percentage changes
    const calculateChange = (current, previous) => {
      if (!previous || previous === 0) return 0;
      return ((current - previous) / previous * 100);
    };

    const metrics = {
      avg_price: current.avg_price || 0,
      price_change_pct: calculateChange(current.avg_price, previous.avg_price),
      total_sales: current.total_sales || 0,
      sales_change_pct: calculateChange(current.total_sales, previous.total_sales),
      avg_days_on_market: current.avg_days_on_market || 0,
      days_change_pct: calculateChange(previous.avg_days_on_market, current.avg_days_on_market), // Inverted because lower is better
      active_listings: inventory.active_listings || 0,
      inventory_change_pct: 0, // Would need additional query for previous inventory
      total_sales_value: current.total_sales_value || 0
    };

    res.json({
      success: true,
      data: metrics,
      metadata: {
        regionId: parseInt(regionId),
        housingTypeId: parseInt(housingTypeId),
        period,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error fetching market summary:', error);
    res.status(500).json({
      error: 'Failed to fetch market summary',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/analytics/market-overview
 * Get comprehensive market overview across all regions
 */
router.get('/market-overview', async (req, res) => {
  try {
    // Get market health scores
    const { rows: marketHealth } = await database.query(`
      SELECT 
        r.name as region_name,
        mh.market_temperature,
        mh.overall_health_score,
        mh.market_status,
        mh.price_to_income_ratio,
        mh.months_of_inventory,
        mh.date
      FROM market_health mh
      JOIN regions r ON mh.region_id = r.id
      WHERE mh.date = (SELECT MAX(date) FROM market_health WHERE region_id = mh.region_id)
      ORDER BY r.name
    `);

    // Get housing distribution summary
    const { rows: housingDistribution } = await database.query(`
      SELECT 
        r.name as region_name,
        ht.name as housing_type,
        hd.total_stock_count,
        hd.market_share_pct,
        hd.avg_price
      FROM housing_distribution hd
      JOIN regions r ON hd.region_id = r.id
      JOIN housing_types ht ON hd.housing_type_id = ht.id
      WHERE ht.name != 'All Types'
      ORDER BY r.name, hd.market_share_pct DESC
    `);

    // Get recent price trends summary
    const { rows: priceTrends } = await database.query(`
      SELECT 
        r.name as region_name,
        ht.name as housing_type,
        pt.avg_price,
        pt.yoy_change_pct,
        pt.month
      FROM price_trends pt
      JOIN regions r ON pt.region_id = r.id
      JOIN housing_types ht ON pt.housing_type_id = ht.id
      WHERE pt.month = (SELECT MAX(month) FROM price_trends WHERE region_id = pt.region_id AND housing_type_id = pt.housing_type_id)
      ORDER BY r.name, pt.avg_price DESC
    `);

    res.json({
      success: true,
      data: {
        marketHealth,
        housingDistribution,
        priceTrends
      },
      metadata: {
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error fetching market overview:', error);
    res.status(500).json({
      error: 'Failed to fetch market overview',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/analytics/price-analysis/:regionId
 * Get detailed price analysis for a region
 */
router.get('/price-analysis/:regionId', [
  param('regionId').isInt({ min: 1 }).withMessage('Region ID must be a positive integer'),
  query('months').optional().isInt({ min: 1, max: 24 }).withMessage('Months must be between 1 and 24'),
  validateRequest
], async (req, res) => {
  try {
    const { regionId } = req.params;
    const { months = 12 } = req.query;

    // Price trends by housing type
    const trendsQuery = `
      SELECT 
        DATE_FORMAT(ps.sale_date, '%Y-%m') as month,
        ht.name as housing_type,
        COUNT(*) as sales_count,
        AVG(ps.sale_price) as avg_price,
        AVG(ps.price_per_sqft) as avg_price_per_sqft,
        MIN(ps.sale_price) as min_price,
        MAX(ps.sale_price) as max_price,
        STDDEV(ps.sale_price) as price_stddev
      FROM property_sales ps
      JOIN housing_types ht ON ps.housing_type_id = ht.id
      WHERE ps.region_id = ?
        AND ps.sale_date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(ps.sale_date, '%Y-%m'), ht.name
      ORDER BY month, ht.name
    `;

    // Price distribution analysis
    const distributionQuery = `
      SELECT 
        ht.name as housing_type,
        COUNT(*) as total_sales,
        AVG(ps.sale_price) as avg_price,
        MIN(ps.sale_price) as min_price,
        MAX(ps.sale_price) as max_price,
        STDDEV(ps.sale_price) as price_stddev,
        SUM(CASE WHEN ps.sale_price < 500000 THEN 1 ELSE 0 END) as under_500k,
        SUM(CASE WHEN ps.sale_price BETWEEN 500000 AND 999999 THEN 1 ELSE 0 END) as between_500k_1m,
        SUM(CASE WHEN ps.sale_price BETWEEN 1000000 AND 1499999 THEN 1 ELSE 0 END) as between_1m_1_5m,
        SUM(CASE WHEN ps.sale_price BETWEEN 1500000 AND 1999999 THEN 1 ELSE 0 END) as between_1_5m_2m,
        SUM(CASE WHEN ps.sale_price >= 2000000 THEN 1 ELSE 0 END) as over_2m
      FROM property_sales ps
      JOIN housing_types ht ON ps.housing_type_id = ht.id
      WHERE ps.region_id = ?
        AND ps.sale_date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      GROUP BY ht.name
      ORDER BY avg_price DESC
    `;

    const [trendsResult, distributionResult] = await Promise.all([
      database.query(trendsQuery, [regionId, months]),
      database.query(distributionQuery, [regionId, months])
    ]);

    res.json({
      success: true,
      data: {
        trends: trendsResult.rows,
        distribution: distributionResult.rows
      },
      metadata: {
        regionId: parseInt(regionId),
        months: parseInt(months),
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error fetching price analysis:', error);
    res.status(500).json({
      error: 'Failed to fetch price analysis',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/analytics/market-health/:regionId
 * Get market health indicators for a region
 */
router.get('/market-health/:regionId', [
  param('regionId').isInt({ min: 1 }).withMessage('Region ID must be a positive integer'),
  validateRequest
], async (req, res) => {
  try {
    const { regionId } = req.params;

    const query = `
      SELECT 
        r.name as region_name,
        COUNT(DISTINCT ps.id) as sales_last_30_days,
        COUNT(DISTINCT al.id) as active_listings,
        AVG(ps.sale_price) as avg_sale_price,
        AVG(al.list_price) as avg_list_price,
        AVG(ps.days_on_market) as avg_days_on_market_sales,
        AVG(al.days_on_market) as avg_days_on_market_listings,
        AVG(ps.sale_price / ps.list_price * 100) as avg_list_to_sale_ratio,
        
        -- Market velocity indicators
        SUM(CASE WHEN ps.days_on_market <= 7 THEN 1 ELSE 0 END) as sales_under_7_days,
        SUM(CASE WHEN ps.days_on_market BETWEEN 8 AND 14 THEN 1 ELSE 0 END) as sales_8_to_14_days,
        SUM(CASE WHEN ps.days_on_market BETWEEN 15 AND 30 THEN 1 ELSE 0 END) as sales_15_to_30_days,
        SUM(CASE WHEN ps.days_on_market > 30 THEN 1 ELSE 0 END) as sales_over_30_days,
        
        -- New vs resale
        SUM(CASE WHEN ps.is_new_construction = 1 THEN 1 ELSE 0 END) as new_construction_sales,
        SUM(CASE WHEN ps.is_new_construction = 0 THEN 1 ELSE 0 END) as resale_sales
        
      FROM regions r
      LEFT JOIN property_sales ps ON r.id = ps.region_id 
        AND ps.sale_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      LEFT JOIN active_listings al ON r.id = al.region_id
      WHERE r.id = ?
      GROUP BY r.id, r.name
    `;

    const { rows } = await database.query(query, [regionId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'No data found for specified region'
      });
    }

    const data = rows[0];
    
    // Calculate additional health metrics
    data.months_of_inventory = data.active_listings && data.sales_last_30_days 
      ? (data.active_listings / data.sales_last_30_days).toFixed(2)
      : null;
    
    data.market_temperature = data.avg_days_on_market_sales < 15 ? 'Hot' 
      : data.avg_days_on_market_sales < 30 ? 'Balanced' 
      : 'Cool';

    res.json({
      success: true,
      data,
      metadata: {
        regionId: parseInt(regionId),
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error fetching market health:', error);
    res.status(500).json({
      error: 'Failed to fetch market health',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/analytics/comparative-analysis
 * Get comparative analysis across all regions
 */
router.get('/comparative-analysis', [
  query('metric').optional().isIn(['price', 'volume', 'velocity', 'inventory']).withMessage('Invalid metric'),
  validateRequest
], async (req, res) => {
  try {
    const { metric = 'price' } = req.query;

    let selectClause;
    switch (metric) {
      case 'price':
        selectClause = `
          AVG(ps.sale_price) as avg_sale_price,
          AVG(ps.price_per_sqft) as avg_price_per_sqft
        `;
        break;
      case 'volume':
        selectClause = `
          COUNT(ps.id) as sales_volume,
          COUNT(al.id) as active_listings
        `;
        break;
      case 'velocity':
        selectClause = `
          AVG(ps.days_on_market) as avg_days_on_market,
          AVG(ps.sale_price / ps.list_price * 100) as avg_list_to_sale_ratio
        `;
        break;
      case 'inventory':
        selectClause = `
          COUNT(DISTINCT al.id) as total_inventory,
          COUNT(DISTINCT ps.id) as monthly_sales
        `;
        break;
      default:
        selectClause = `AVG(ps.sale_price) as avg_sale_price`;
    }

    const query = `
      SELECT 
        r.name as region_name,
        r.code as region_code,
        ht.name as housing_type,
        ${selectClause}
      FROM regions r
      CROSS JOIN housing_types ht
      LEFT JOIN property_sales ps ON r.id = ps.region_id 
        AND ht.id = ps.housing_type_id
        AND ps.sale_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      LEFT JOIN active_listings al ON r.id = al.region_id 
        AND ht.id = al.housing_type_id
      GROUP BY r.id, ht.id, r.name, r.code, ht.name
      ORDER BY r.name, ht.name
    `;

    const { rows } = await database.query(query);

    res.json({
      success: true,
      data: rows,
      metadata: {
        metric,
        regionCount: [...new Set(rows.map(r => r.region_name))].length,
        housingTypeCount: [...new Set(rows.map(r => r.housing_type))].length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error fetching comparative analysis:', error);
    res.status(500).json({
      error: 'Failed to fetch comparative analysis',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/analytics/affordability/:regionId
 * Get affordability analysis for a region
 */
router.get('/affordability/:regionId', [
  param('regionId').isInt({ min: 1 }).withMessage('Region ID must be a positive integer'),
  validateRequest
], async (req, res) => {
  try {
    const { regionId } = req.params;

    const query = `
      SELECT 
        r.name as region_name,
        ad.median_household_income,
        ad.avg_household_income,
        ad.housing_affordability_index,
        ad.price_to_income_ratio,
        ad.mortgage_payment_to_income,
        ad.first_time_buyer_index,
        ad.rental_affordability_index,
        ad.unemployment_rate,
        ad.population_growth_rate,
        AVG(ps.sale_price) as current_avg_price,
        AVG(rd.monthly_rent) as current_avg_rent
      FROM regions r
      LEFT JOIN affordability_data ad ON r.id = ad.region_id
      LEFT JOIN property_sales ps ON r.id = ps.region_id 
        AND ps.sale_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      LEFT JOIN rental_data rd ON r.id = rd.region_id
        AND rd.listing_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      WHERE r.id = ?
      GROUP BY r.id, r.name, ad.median_household_income, ad.avg_household_income,
               ad.housing_affordability_index, ad.price_to_income_ratio, 
               ad.mortgage_payment_to_income, ad.first_time_buyer_index,
               ad.rental_affordability_index, ad.unemployment_rate, ad.population_growth_rate
    `;

    const { rows } = await database.query(query, [regionId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'No affordability data found for specified region'
      });
    }

    res.json({
      success: true,
      data: rows[0],
      metadata: {
        regionId: parseInt(regionId),
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error fetching affordability analysis:', error);
    res.status(500).json({
      error: 'Failed to fetch affordability analysis',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/analytics/housing-distribution/:regionId
 * Get housing type distribution for a region
 */
router.get('/housing-distribution/:regionId', [
  param('regionId').isInt({ min: 1 }).withMessage('Region ID must be a positive integer'),
  validateRequest
], async (req, res) => {
  try {
    const { regionId } = req.params;

    const { rows } = await database.query(`
      SELECT 
        hd.region_id,
        r.name as region_name,
        ht.name as housing_type,
        ht.code as housing_type_code,
        hd.total_stock_count,
        hd.market_share_pct,
        hd.avg_price,
        hd.updated_at
      FROM housing_distribution hd
      JOIN regions r ON hd.region_id = r.id
      JOIN housing_types ht ON hd.housing_type_id = ht.id
      WHERE hd.region_id = ?
      ORDER BY hd.market_share_pct DESC
    `, [regionId]);

    res.json({
      success: true,
      data: rows,
      metadata: {
        regionId: parseInt(regionId),
        totalTypes: rows.length
      }
    });
  } catch (error) {
    logger.error('Error fetching housing distribution:', error);
    res.status(500).json({
      error: 'Failed to fetch housing distribution',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/analytics/new-vs-resale/:regionId
 * Get new vs resale market comparison
 */
router.get('/new-vs-resale/:regionId', [
  param('regionId').isInt({ min: 1 }).withMessage('Region ID must be a positive integer'),
  query('months').optional().isInt({ min: 1, max: 12 }).withMessage('Months must be between 1 and 12'),
  validateRequest
], async (req, res) => {
  try {
    const { regionId } = req.params;
    const { months = 3 } = req.query;

    const { rows } = await database.query(`
      SELECT 
        nvr.month,
        r.name as region_name,
        ht.name as housing_type,
        nvr.new_units_sold,
        nvr.resale_units_sold,
        nvr.new_avg_price,
        nvr.resale_avg_price,
        nvr.new_price_premium_pct,
        (nvr.new_units_sold + nvr.resale_units_sold) as total_units_sold
      FROM new_vs_resale nvr
      JOIN regions r ON nvr.region_id = r.id
      JOIN housing_types ht ON nvr.housing_type_id = ht.id
      WHERE nvr.region_id = ?
        AND nvr.month >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      ORDER BY nvr.month DESC, ht.name
    `, [regionId, months]);

    res.json({
      success: true,
      data: rows,
      metadata: {
        regionId: parseInt(regionId),
        months: parseInt(months),
        dataPoints: rows.length
      }
    });
  } catch (error) {
    logger.error('Error fetching new vs resale data:', error);
    res.status(500).json({
      error: 'Failed to fetch new vs resale data',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/analytics/rental-overview/:regionId
 * Get rental market overview
 */
router.get('/rental-overview/:regionId', [
  param('regionId').isInt({ min: 1 }).withMessage('Region ID must be a positive integer'),
  validateRequest
], async (req, res) => {
  try {
    const { regionId } = req.params;

    // Get latest rental metrics
    const { rows: rentalMetrics } = await database.query(`
      SELECT 
        r.name as region_name,
        bt.name as bedroom_type,
        rm.avg_rent,
        rm.median_rent,
        rm.vacancy_rate_pct,
        rm.yoy_growth_pct,
        rm.total_rental_units,
        rm.available_units,
        rm.month
      FROM rental_metrics rm
      JOIN regions r ON rm.region_id = r.id
      JOIN bedroom_types bt ON rm.bedroom_type_id = bt.id
      WHERE rm.region_id = ?
        AND rm.month = (SELECT MAX(month) FROM rental_metrics WHERE region_id = rm.region_id)
      ORDER BY bt.name
    `, [regionId]);

    // Get rental stock summary
    const { rows: stockSummary } = await database.query(`
      SELECT 
        r.name as region_name,
        rss.year,
        rss.overall_vacancy_pct,
        rss.total_pbr_units,
        rss.new_pbr_units,
        rss.rented_condos_count,
        rss.total_rental_stock
      FROM rental_stock_summary rss
      JOIN regions r ON rss.region_id = r.id
      WHERE rss.region_id = ?
        AND rss.year = (SELECT MAX(year) FROM rental_stock_summary WHERE region_id = rss.region_id)
    `, [regionId]);

    res.json({
      success: true,
      data: {
        rentalMetrics,
        stockSummary: stockSummary[0] || null
      },
      metadata: {
        regionId: parseInt(regionId),
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error fetching rental overview:', error);
    res.status(500).json({
      error: 'Failed to fetch rental overview',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/analytics/price-trends/:regionId/:housingTypeId
 * Get detailed price trends with historical data
 */
router.get('/price-trends/:regionId/:housingTypeId', [
  param('regionId').isInt({ min: 1 }).withMessage('Region ID must be a positive integer'),
  param('housingTypeId').isInt({ min: 1 }).withMessage('Housing type ID must be a positive integer'),
  query('months').optional().isInt({ min: 1, max: 24 }).withMessage('Months must be between 1 and 24'),
  validateRequest
], async (req, res) => {
  try {
    const { regionId, housingTypeId } = req.params;
    const { months = 12 } = req.query;

    const { rows } = await database.query(`
      SELECT 
        pt.month,
        pt.avg_price,
        pt.median_price,
        pt.min_price,
        pt.max_price,
        pt.sales_count,
        pt.mom_change_pct,
        pt.yoy_change_pct,
        pt.price_per_sqft,
        r.name as region_name,
        ht.name as housing_type_name
      FROM price_trends pt
      JOIN regions r ON pt.region_id = r.id
      JOIN housing_types ht ON pt.housing_type_id = ht.id
      WHERE pt.region_id = ? 
        AND pt.housing_type_id = ?
        AND pt.month >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      ORDER BY pt.month ASC
    `, [regionId, housingTypeId, months]);

    res.json({
      success: true,
      data: rows,
      metadata: {
        regionId: parseInt(regionId),
        housingTypeId: parseInt(housingTypeId),
        months: parseInt(months),
        dataPoints: rows.length
      }
    });
  } catch (error) {
    logger.error('Error fetching price trends:', error);
    res.status(500).json({
      error: 'Failed to fetch price trends',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;