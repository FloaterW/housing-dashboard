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

// Common validators
const regionValidator = param('regionId').isInt({ min: 1 }).withMessage('Region ID must be a positive integer');
const housingTypeValidator = param('housingTypeId').isInt({ min: 1 }).withMessage('Housing type ID must be a positive integer');
const paginationValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

/**
 * GET /api/airbnb/listings
 * Get AirBnB listings with filtering and pagination
 */
router.get('/listings', [
  ...paginationValidator,
  query('regionId').optional().isInt({ min: 1 }),
  query('housingTypeId').optional().isInt({ min: 1 }),
  query('minRate').optional().isFloat({ min: 0 }),
  query('maxRate').optional().isFloat({ min: 0 }),
  query('isSuperhost').optional().isBoolean(),
  query('isEntireHome').optional().isBoolean(),
  validateRequest
], async (req, res) => {
  try {
    const {
      regionId,
      housingTypeId,
      minRate,
      maxRate,
      isSuperhost,
      isEntireHome,
      page = 1,
      limit = 50
    } = req.query;

    let whereConditions = [];
    let queryParams = [];

    // Build WHERE conditions
    if (regionId) {
      whereConditions.push('abl.region_id = ?');
      queryParams.push(regionId);
    }

    if (housingTypeId) {
      whereConditions.push('abl.housing_type_id = ?');
      queryParams.push(housingTypeId);
    }

    if (minRate) {
      whereConditions.push('abl.nightly_rate >= ?');
      queryParams.push(minRate);
    }

    if (maxRate) {
      whereConditions.push('abl.nightly_rate <= ?');
      queryParams.push(maxRate);
    }

    if (isSuperhost !== undefined) {
      whereConditions.push('abl.is_superhost = ?');
      queryParams.push(isSuperhost === 'true' ? 1 : 0);
    }

    if (isEntireHome !== undefined) {
      whereConditions.push('abl.is_entire_home = ?');
      queryParams.push(isEntireHome === 'true' ? 1 : 0);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM airbnb_listings abl
      JOIN regions r ON abl.region_id = r.id
      JOIN housing_types ht ON abl.housing_type_id = ht.id
      ${whereClause}
    `;

    const { rows: countResult } = await database.query(countQuery, queryParams);
    const total = countResult[0].total;

    // Get paginated data
    const offset = (page - 1) * limit;
    const dataQuery = `
      SELECT 
        abl.id,
        abl.nightly_rate,
        abl.cleaning_fee,
        abl.service_fee_percent,
        abl.bedrooms,
        abl.bathrooms,
        abl.max_guests,
        abl.occupancy_rate,
        abl.monthly_revenue,
        abl.average_rating,
        abl.total_reviews,
        abl.is_entire_home,
        abl.is_superhost,
        abl.instant_book,
        abl.postal_code,
        r.name as region_name,
        r.code as region_code,
        ht.name as housing_type_name,
        ht.code as housing_type_code
      FROM airbnb_listings abl
      JOIN regions r ON abl.region_id = r.id
      JOIN housing_types ht ON abl.housing_type_id = ht.id
      ${whereClause}
      ORDER BY abl.monthly_revenue DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit), offset);
    const { rows: listings } = await database.query(dataQuery, queryParams);

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
    logger.error('Error fetching AirBnB listings:', error);
    res.status(500).json({
      error: 'Failed to fetch AirBnB listings',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/airbnb/metrics/:regionId/:housingTypeId
 * Get AirBnB market metrics for specific region and housing type
 */
router.get('/metrics/:regionId/:housingTypeId', [
  regionValidator,
  housingTypeValidator,
  validateRequest
], async (req, res) => {
  try {
    const { regionId, housingTypeId } = req.params;

    const query = `
      SELECT 
        r.name as region_name,
        ht.name as housing_type_name,
        COUNT(*) as total_listings,
        AVG(abl.nightly_rate) as avg_nightly_rate,
        AVG(abl.occupancy_rate) as avg_occupancy_rate,
        AVG(abl.monthly_revenue) as avg_monthly_revenue,
        AVG(abl.average_rating) as avg_rating,
        SUM(abl.total_reviews) as total_reviews,
        SUM(CASE WHEN abl.is_superhost = 1 THEN 1 ELSE 0 END) as superhost_count,
        SUM(CASE WHEN abl.is_entire_home = 1 THEN 1 ELSE 0 END) as entire_home_count,
        SUM(CASE WHEN abl.instant_book = 1 THEN 1 ELSE 0 END) as instant_book_count,
        MIN(abl.nightly_rate) as min_rate,
        MAX(abl.nightly_rate) as max_rate
      FROM airbnb_listings abl
      JOIN regions r ON abl.region_id = r.id
      JOIN housing_types ht ON abl.housing_type_id = ht.id
      WHERE abl.region_id = ? AND abl.housing_type_id = ?
      GROUP BY r.name, ht.name
    `;

    const { rows } = await database.query(query, [regionId, housingTypeId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'No AirBnB data found for specified region and housing type'
      });
    }

    // Calculate additional metrics
    const data = rows[0];
    data.superhost_percentage = ((data.superhost_count / data.total_listings) * 100).toFixed(1);
    data.entire_home_percentage = ((data.entire_home_count / data.total_listings) * 100).toFixed(1);
    data.instant_book_percentage = ((data.instant_book_count / data.total_listings) * 100).toFixed(1);

    res.json({
      success: true,
      data,
      metadata: {
        regionId: parseInt(regionId),
        housingTypeId: parseInt(housingTypeId),
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error fetching AirBnB metrics:', error);
    res.status(500).json({
      error: 'Failed to fetch AirBnB metrics',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/airbnb/performance-analysis/:regionId
 * Get comprehensive performance analysis for AirBnB market
 */
router.get('/performance-analysis/:regionId', [
  regionValidator,
  validateRequest
], async (req, res) => {
  try {
    const { regionId } = req.params;

    // Get overall regional performance
    const overallQuery = `
      SELECT 
        r.name as region_name,
        COUNT(*) as total_listings,
        AVG(abl.nightly_rate) as avg_nightly_rate,
        AVG(abl.occupancy_rate) as avg_occupancy_rate,
        AVG(abl.monthly_revenue) as avg_monthly_revenue,
        AVG(abl.average_rating) as avg_rating,
        SUM(abl.total_reviews) as total_reviews
      FROM airbnb_listings abl
      JOIN regions r ON abl.region_id = r.id
      WHERE abl.region_id = ?
      GROUP BY r.name
    `;

    // Get performance by housing type
    const byTypeQuery = `
      SELECT 
        ht.name as housing_type,
        COUNT(*) as listings_count,
        AVG(abl.nightly_rate) as avg_nightly_rate,
        AVG(abl.occupancy_rate) as avg_occupancy_rate,
        AVG(abl.monthly_revenue) as avg_monthly_revenue,
        AVG(abl.average_rating) as avg_rating
      FROM airbnb_listings abl
      JOIN housing_types ht ON abl.housing_type_id = ht.id
      WHERE abl.region_id = ?
      GROUP BY ht.name
      ORDER BY avg_monthly_revenue DESC
    `;

    // Get top performers
    const topPerformersQuery = `
      SELECT 
        abl.nightly_rate,
        abl.occupancy_rate,
        abl.monthly_revenue,
        abl.average_rating,
        abl.total_reviews,
        abl.is_superhost,
        ht.name as housing_type
      FROM airbnb_listings abl
      JOIN housing_types ht ON abl.housing_type_id = ht.id
      WHERE abl.region_id = ?
      ORDER BY abl.monthly_revenue DESC
      LIMIT 10
    `;

    const [overallResult, byTypeResult, topPerformersResult] = await Promise.all([
      database.query(overallQuery, [regionId]),
      database.query(byTypeQuery, [regionId]),
      database.query(topPerformersQuery, [regionId])
    ]);

    res.json({
      success: true,
      data: {
        overall: overallResult.rows[0] || null,
        byHousingType: byTypeResult.rows,
        topPerformers: topPerformersResult.rows
      },
      metadata: {
        regionId: parseInt(regionId),
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error fetching AirBnB performance analysis:', error);
    res.status(500).json({
      error: 'Failed to fetch AirBnB performance analysis',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;