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
 * GET /api/rental/listings
 * Get rental listings with filtering and pagination
 */
router.get('/listings', [
  ...paginationValidator,
  query('regionId').optional().isInt({ min: 1 }),
  query('housingTypeId').optional().isInt({ min: 1 }),
  query('minRent').optional().isFloat({ min: 0 }),
  query('maxRent').optional().isFloat({ min: 0 }),
  query('bedrooms').optional().isInt({ min: 0 }),
  validateRequest
], async (req, res) => {
  try {
    const {
      regionId,
      housingTypeId,
      minRent,
      maxRent,
      bedrooms,
      page = 1,
      limit = 50
    } = req.query;

    let whereConditions = [];
    let queryParams = [];

    // Build WHERE conditions
    if (regionId) {
      whereConditions.push('rd.region_id = ?');
      queryParams.push(regionId);
    }

    if (housingTypeId) {
      whereConditions.push('rd.housing_type_id = ?');
      queryParams.push(housingTypeId);
    }

    if (minRent) {
      whereConditions.push('rd.monthly_rent >= ?');
      queryParams.push(minRent);
    }

    if (maxRent) {
      whereConditions.push('rd.monthly_rent <= ?');
      queryParams.push(maxRent);
    }

    if (bedrooms) {
      whereConditions.push('rd.bedrooms = ?');
      queryParams.push(bedrooms);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM rental_data rd
      JOIN regions r ON rd.region_id = r.id
      JOIN housing_types ht ON rd.housing_type_id = ht.id
      ${whereClause}
    `;

    const { rows: countResult } = await database.query(countQuery, queryParams);
    const total = countResult[0].total;

    // Get paginated data
    const offset = (page - 1) * limit;
    const dataQuery = `
      SELECT 
        rd.id,
        rd.monthly_rent,
        rd.rent_per_sqft,
        rd.size_sqft,
        rd.bedrooms,
        rd.bathrooms,
        rd.lease_start_date,
        rd.lease_term_months,
        rd.is_furnished,
        rd.includes_utilities,
        rd.listing_date,
        rd.rented_date,
        rd.days_to_rent,
        rd.postal_code,
        r.name as region_name,
        r.code as region_code,
        ht.name as housing_type_name,
        ht.code as housing_type_code
      FROM rental_data rd
      JOIN regions r ON rd.region_id = r.id
      JOIN housing_types ht ON rd.housing_type_id = ht.id
      ${whereClause}
      ORDER BY rd.listing_date DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit), offset);
    const { rows: rentals } = await database.query(dataQuery, queryParams);

    res.json({
      success: true,
      data: rentals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching rental listings:', error);
    res.status(500).json({
      error: 'Failed to fetch rental listings',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/rental/metrics/:regionId/:housingTypeId
 * Get rental market metrics for specific region and housing type
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
        COUNT(*) as total_rentals,
        AVG(rd.monthly_rent) as avg_monthly_rent,
        AVG(rd.rent_per_sqft) as avg_rent_per_sqft,
        AVG(rd.days_to_rent) as avg_days_to_rent,
        MIN(rd.monthly_rent) as min_rent,
        MAX(rd.monthly_rent) as max_rent,
        AVG(rd.size_sqft) as avg_size_sqft,
        SUM(CASE WHEN rd.is_furnished = 1 THEN 1 ELSE 0 END) as furnished_count,
        SUM(CASE WHEN rd.includes_utilities = 1 THEN 1 ELSE 0 END) as utilities_included_count
      FROM rental_data rd
      JOIN regions r ON rd.region_id = r.id
      JOIN housing_types ht ON rd.housing_type_id = ht.id
      WHERE rd.region_id = ? AND rd.housing_type_id = ?
        AND rd.rented_date IS NOT NULL
      GROUP BY r.name, ht.name
    `;

    const { rows } = await database.query(query, [regionId, housingTypeId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'No rental data found for specified region and housing type'
      });
    }

    res.json({
      success: true,
      data: rows[0],
      metadata: {
        regionId: parseInt(regionId),
        housingTypeId: parseInt(housingTypeId),
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error fetching rental metrics:', error);
    res.status(500).json({
      error: 'Failed to fetch rental metrics',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/rental/price-trends/:regionId
 * Get rental price trends for a region
 */
router.get('/price-trends/:regionId', [
  regionValidator,
  query('months').optional().isInt({ min: 1, max: 24 }).withMessage('Months must be between 1 and 24'),
  validateRequest
], async (req, res) => {
  try {
    const { regionId } = req.params;
    const { months = 12 } = req.query;

    const query = `
      SELECT 
        DATE_FORMAT(rd.listing_date, '%Y-%m') as month,
        ht.name as housing_type_name,
        COUNT(*) as rental_count,
        AVG(rd.monthly_rent) as avg_rent,
        AVG(rd.rent_per_sqft) as avg_rent_per_sqft,
        AVG(rd.days_to_rent) as avg_days_to_rent
      FROM rental_data rd
      JOIN housing_types ht ON rd.housing_type_id = ht.id
      WHERE rd.region_id = ?
        AND rd.listing_date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(rd.listing_date, '%Y-%m'), ht.name
      ORDER BY month, ht.name
    `;

    const { rows } = await database.query(query, [regionId, months]);

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
    logger.error('Error fetching rental price trends:', error);
    res.status(500).json({
      error: 'Failed to fetch rental price trends',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;