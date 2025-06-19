const express = require('express');
const { query, param, validationResult } = require('express-validator');
const database = require('../config/database');
const logger = require('../config/logger');
const { optionalAuth } = require('../middleware/auth');
const { handleValidationErrors, validationSets } = require('../middleware/validation');

const router = express.Router();

// ====================================================================
// VALIDATION MIDDLEWARE
// ====================================================================

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

// Common validators
const regionValidator = param('regionId').isInt({ min: 1 }).withMessage('Region ID must be a positive integer');
const housingTypeValidator = param('housingTypeId').isInt({ min: 1 }).withMessage('Housing type ID must be a positive integer');
const dateRangeValidator = [
  query('startDate').optional().isISO8601().withMessage('Start date must be in ISO 8601 format'),
  query('endDate').optional().isISO8601().withMessage('End date must be in ISO 8601 format')
];
const paginationValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

// ====================================================================
// ROUTES
// ====================================================================

/**
 * GET /api/housing/regions
 * Get all available regions
 */
router.get('/regions', async (req, res) => {
  try {
    const { rows } = await database.query(`
      SELECT 
        r.id,
        r.name,
        r.code,
        r.population,
        r.area_km2,
        parent.name as parent_region_name,
        COUNT(DISTINCT ps.id) as total_sales_last_30_days,
        COUNT(DISTINCT al.id) as active_listings
      FROM regions r
      LEFT JOIN regions parent ON r.parent_region_id = parent.id
      LEFT JOIN property_sales ps ON r.id = ps.region_id 
        AND ps.sale_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      LEFT JOIN active_listings al ON r.id = al.region_id
      GROUP BY r.id, r.name, r.code, r.population, r.area_km2, parent.name
      ORDER BY r.name
    `);

    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    logger.error('Error fetching regions:', error);
    res.status(500).json({
      error: 'Failed to fetch regions',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/housing/types
 * Get all available housing types
 */
router.get('/types', async (req, res) => {
  try {
    const { rows } = await database.query(`
      SELECT 
        ht.id,
        ht.name,
        ht.code,
        ht.description,
        ht.typical_size_sqft_min,
        ht.typical_size_sqft_max,
        COUNT(DISTINCT ps.id) as total_sales_last_30_days,
        AVG(ps.sale_price) as avg_sale_price_last_30_days
      FROM housing_types ht
      LEFT JOIN property_sales ps ON ht.id = ps.housing_type_id 
        AND ps.sale_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY ht.id, ht.name, ht.code, ht.description, ht.typical_size_sqft_min, ht.typical_size_sqft_max
      ORDER BY ht.name
    `);

    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    logger.error('Error fetching housing types:', error);
    res.status(500).json({
      error: 'Failed to fetch housing types',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/housing/sales
 * Get property sales data with filtering
 */
router.get('/sales', [
  ...dateRangeValidator,
  ...paginationValidator,
  query('regionId').optional().isInt({ min: 1 }),
  query('housingTypeId').optional().isInt({ min: 1 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  validateRequest
], async (req, res) => {
  try {
    const {
      regionId,
      housingTypeId,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      page = 1,
      limit = 50
    } = req.query;

    let whereConditions = [];
    let queryParams = [];

    // Build WHERE conditions
    if (regionId) {
      whereConditions.push('ps.region_id = ?');
      queryParams.push(regionId);
    }

    if (housingTypeId) {
      whereConditions.push('ps.housing_type_id = ?');
      queryParams.push(housingTypeId);
    }

    if (startDate) {
      whereConditions.push('ps.sale_date >= ?');
      queryParams.push(startDate);
    }

    if (endDate) {
      whereConditions.push('ps.sale_date <= ?');
      queryParams.push(endDate);
    }

    if (minPrice) {
      whereConditions.push('ps.sale_price >= ?');
      queryParams.push(minPrice);
    }

    if (maxPrice) {
      whereConditions.push('ps.sale_price <= ?');
      queryParams.push(maxPrice);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM property_sales ps
      JOIN regions r ON ps.region_id = r.id
      JOIN housing_types ht ON ps.housing_type_id = ht.id
      ${whereClause}
    `;

    const { rows: countResult } = await database.query(countQuery, queryParams);
    const total = countResult[0].total;

    // Get paginated data
    const offset = (page - 1) * limit;
    const dataQuery = `
      SELECT 
        ps.id,
        ps.sale_date,
        ps.sale_price,
        ps.list_price,
        ps.price_per_sqft,
        ps.size_sqft,
        ps.bedrooms,
        ps.bathrooms,
        ps.days_on_market,
        ps.is_new_construction,
        ps.postal_code,
        r.name as region_name,
        r.code as region_code,
        ht.name as housing_type_name,
        ht.code as housing_type_code
      FROM property_sales ps
      JOIN regions r ON ps.region_id = r.id
      JOIN housing_types ht ON ps.housing_type_id = ht.id
      ${whereClause}
      ORDER BY ps.sale_date DESC
      LIMIT ? OFFSET ?
    `;

    // Clone the params array and add pagination params
    const dataQueryParams = [...queryParams, parseInt(limit), parseInt(offset)];
    const { rows: sales } = await database.query(dataQuery, dataQueryParams);

    res.json({
      success: true,
      data: sales,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching sales data:', error);
    res.status(500).json({
      error: 'Failed to fetch sales data',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/housing/listings
 * Get active listings with filtering
 */
router.get('/listings', [
  ...paginationValidator,
  query('regionId').optional().isInt({ min: 1 }),
  query('housingTypeId').optional().isInt({ min: 1 }),
  query('status').optional().isIn(['active', 'pending', 'sold', 'expired', 'withdrawn']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  validateRequest
], async (req, res) => {
  try {
    const {
      regionId,
      housingTypeId,
      status,
      minPrice,
      maxPrice,
      page = 1,
      limit = 50
    } = req.query;

    let whereConditions = [];
    let queryParams = [];

    // Build WHERE conditions
    if (regionId) {
      whereConditions.push('al.region_id = ?');
      queryParams.push(regionId);
    }

    if (housingTypeId) {
      whereConditions.push('al.housing_type_id = ?');
      queryParams.push(housingTypeId);
    }

    if (status) {
      whereConditions.push('ms.code = ?');
      queryParams.push(status.toUpperCase());
    }

    if (minPrice) {
      whereConditions.push('al.list_price >= ?');
      queryParams.push(minPrice);
    }

    if (maxPrice) {
      whereConditions.push('al.list_price <= ?');
      queryParams.push(maxPrice);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM active_listings al
      JOIN regions r ON al.region_id = r.id
      JOIN housing_types ht ON al.housing_type_id = ht.id
      JOIN market_status ms ON al.status_id = ms.id
      ${whereClause}
    `;

    const { rows: countResult } = await database.query(countQuery, queryParams);
    const total = countResult[0].total;

    // Get paginated data
    const offset = (page - 1) * limit;
    const dataQuery = `
      SELECT 
        al.id,
        al.list_price,
        al.price_per_sqft,
        al.size_sqft,
        al.bedrooms,
        al.bathrooms,
        al.list_date,
        al.days_on_market,
        al.is_new_construction,
        al.postal_code,
        r.name as region_name,
        r.code as region_code,
        ht.name as housing_type_name,
        ht.code as housing_type_code,
        ms.name as status_name,
        ms.code as status_code
      FROM active_listings al
      JOIN regions r ON al.region_id = r.id
      JOIN housing_types ht ON al.housing_type_id = ht.id
      JOIN market_status ms ON al.status_id = ms.id
      ${whereClause}
      ORDER BY al.list_date DESC
      LIMIT ? OFFSET ?
    `;

    const listingQueryParams = [...queryParams, parseInt(limit), offset];
    const { rows: listings } = await database.query(dataQuery, listingQueryParams);

    res.json({
      success: true,
      data: listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching listings data:', error);
    res.status(500).json({
      error: 'Failed to fetch listings data',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/housing/price-trends/:regionId/:housingTypeId
 * Get price trends for specific region and housing type
 */
router.get('/price-trends/:regionId/:housingTypeId', [
  regionValidator,
  housingTypeValidator,
  query('months').optional().isInt({ min: 1, max: 60 }).withMessage('Months must be between 1 and 60'),
  validateRequest
], async (req, res) => {
  try {
    const { regionId, housingTypeId } = req.params;
    const { months = 12 } = req.query;

    const query = `
      SELECT 
        DATE_FORMAT(ps.sale_date, '%Y-%m') as month,
        COUNT(*) as sales_count,
        AVG(ps.sale_price) as avg_price,
        AVG(ps.price_per_sqft) as avg_price_per_sqft,
        AVG(ps.days_on_market) as avg_days_on_market,
        MIN(ps.sale_price) as min_price,
        MAX(ps.sale_price) as max_price,
        r.name as region_name,
        ht.name as housing_type_name
      FROM property_sales ps
      JOIN regions r ON ps.region_id = r.id
      JOIN housing_types ht ON ps.housing_type_id = ht.id
      WHERE ps.region_id = ? 
        AND ps.housing_type_id = ?
        AND ps.sale_date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(ps.sale_date, '%Y-%m'), r.name, ht.name
      ORDER BY month
    `;

    const { rows } = await database.query(query, [regionId, housingTypeId, months]);

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

/**
 * GET /api/housing/market-summary/:regionId
 * Get market summary for a specific region
 */
router.get('/market-summary/:regionId', [
  regionValidator,
  validateRequest
], async (req, res) => {
  try {
    const { regionId } = req.params;

    const query = `
      SELECT 
        r.name as region_name,
        ht.name as housing_type,
        COUNT(ps.id) as total_sales_last_30_days,
        AVG(ps.sale_price) as avg_sale_price,
        AVG(ps.days_on_market) as avg_days_on_market,
        COUNT(al.id) as active_listings,
        AVG(al.list_price) as avg_list_price,
        AVG(al.days_on_market) as avg_listing_days_on_market
      FROM regions r
      CROSS JOIN housing_types ht
      LEFT JOIN property_sales ps ON r.id = ps.region_id 
        AND ht.id = ps.housing_type_id 
        AND ps.sale_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      LEFT JOIN active_listings al ON r.id = al.region_id 
        AND ht.id = al.housing_type_id
      WHERE r.id = ?
      GROUP BY r.id, ht.id, r.name, ht.name
      ORDER BY ht.name
    `;

    const { rows } = await database.query(query, [regionId]);

    res.json({
      success: true,
      data: rows,
      metadata: {
        regionId: parseInt(regionId),
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

module.exports = router;