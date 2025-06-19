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

    // Get key metrics directly from the new schema
    const metricsQuery = `
      SELECT 
        avg_price,
        price_change_pct,
        total_sales,
        sales_change_pct,
        avg_days_on_market,
        days_change_pct,
        inventory_count,
        inventory_change_pct,
        data_date
      FROM key_metrics km
      WHERE km.region_id = ? 
        AND km.housing_type_id = ?
        AND km.data_date = (
          SELECT MAX(data_date) 
          FROM key_metrics 
          WHERE region_id = ? AND housing_type_id = ?
        )
    `;

    const result = await database.query(metricsQuery, [regionId, housingTypeId, regionId, housingTypeId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'No data found',
        message: `No market data available for region ${regionId} and housing type ${housingTypeId}`
      });
    }

    const metrics = result.rows[0];

    // Format the response to match frontend expectations
    const formattedMetrics = {
      avg_price: parseFloat(metrics.avg_price) || 0,
      price_change_pct: parseFloat(metrics.price_change_pct) || 0,
      total_sales: parseInt(metrics.total_sales) || 0,
      sales_change_pct: parseFloat(metrics.sales_change_pct) || 0,
      avg_days_on_market: parseInt(metrics.avg_days_on_market) || 0,
      days_change_pct: parseFloat(metrics.days_change_pct) || 0,
      active_listings: parseInt(metrics.inventory_count) || 0,
      inventory_change_pct: parseFloat(metrics.inventory_change_pct) || 0
    };

    res.json({
      success: true,
      data: formattedMetrics,
      metadata: {
        regionId: parseInt(regionId),
        housingTypeId: parseInt(housingTypeId),
        period,
        dataDate: metrics.data_date,
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

module.exports = router;
