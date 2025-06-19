const { body, query, param, validationResult } = require('express-validator');
const logger = require('../config/logger');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors detected', {
      errors: errors.array(),
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      body: req.body,
      query: req.query,
      params: req.params
    });

    return res.status(400).json({
      error: 'Validation Failed',
      message: 'One or more fields contain invalid data',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// SQL Injection protection
const sanitizeInput = (req, res, next) => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(;|\||\||&)/g,
    /('|('')|`)/g,
    /(--|\*|\/\*|\*\/)/g
  ];

  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      for (const pattern of sqlPatterns) {
        if (pattern.test(value)) {
          logger.warn('Potential SQL injection attempt detected', {
            value: value.substring(0, 100),
            ip: req.ip,
            url: req.originalUrl,
            userAgent: req.get('User-Agent')
          });
          throw new Error('Invalid input detected');
        }
      }
    }
    return value;
  };

  try {
    // Sanitize query parameters
    for (const key in req.query) {
      req.query[key] = sanitizeValue(req.query[key]);
    }

    // Sanitize body parameters
    for (const key in req.body) {
      req.body[key] = sanitizeValue(req.body[key]);
    }

    // Sanitize URL parameters
    for (const key in req.params) {
      req.params[key] = sanitizeValue(req.params[key]);
    }

    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid Input',
      message: 'Request contains potentially harmful content'
    });
  }
};

// Common validation rules
const commonValidations = {
  // Region validation
  regionId: param('regionId')
    .isInt({ min: 1, max: 999999 })
    .withMessage('Region ID must be a positive integer between 1 and 999999'),

  // Housing type validation  
  housingTypeId: param('housingTypeId')
    .isInt({ min: 1, max: 999999 })
    .withMessage('Housing type ID must be a positive integer between 1 and 999999'),

  // Date range validation
  dateRange: [
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be in ISO 8601 format (YYYY-MM-DD)')
      .custom(value => {
        const date = new Date(value);
        const now = new Date();
        const minDate = new Date('2000-01-01');
        if (date > now) {
          throw new Error('Start date cannot be in the future');
        }
        if (date < minDate) {
          throw new Error('Start date cannot be before year 2000');
        }
        return true;
      }),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be in ISO 8601 format (YYYY-MM-DD)')
      .custom((value, { req }) => {
        const endDate = new Date(value);
        const now = new Date();
        const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        
        if (endDate > now) {
          throw new Error('End date cannot be in the future');
        }
        if (startDate && endDate < startDate) {
          throw new Error('End date must be after start date');
        }
        return true;
      })
  ],

  // Pagination validation
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1, max: 10000 })
      .withMessage('Page must be between 1 and 10000'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage('Limit must be between 1 and 1000')
  ],

  // Price validation
  priceRange: [
    query('minPrice')
      .optional()
      .isFloat({ min: 0, max: 100000000 })
      .withMessage('Minimum price must be between 0 and 100,000,000'),
    query('maxPrice')
      .optional()
      .isFloat({ min: 0, max: 100000000 })
      .withMessage('Maximum price must be between 0 and 100,000,000')
      .custom((value, { req }) => {
        const minPrice = parseFloat(req.query.minPrice);
        const maxPrice = parseFloat(value);
        if (minPrice && maxPrice && maxPrice < minPrice) {
          throw new Error('Maximum price must be greater than minimum price');
        }
        return true;
      })
  ],

  // Text input validation
  searchQuery: query('q')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,!?]*$/)
    .withMessage('Search query contains invalid characters'),

  // Sort validation
  sort: [
    query('sortBy')
      .optional()
      .isIn(['price', 'date', 'size', 'bedrooms', 'bathrooms', 'id'])
      .withMessage('Sort field must be one of: price, date, size, bedrooms, bathrooms, id'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc', 'ASC', 'DESC'])
      .withMessage('Sort order must be asc or desc')
  ]
};

// Validation rule sets for different endpoints
const validationSets = {
  sales: [
    ...commonValidations.dateRange,
    ...commonValidations.pagination,
    ...commonValidations.priceRange,
    ...commonValidations.sort,
    query('regionId').optional().isInt({ min: 1 }),
    query('housingTypeId').optional().isInt({ min: 1 })
  ],

  listings: [
    ...commonValidations.dateRange,
    ...commonValidations.pagination,
    ...commonValidations.priceRange,
    ...commonValidations.sort,
    commonValidations.searchQuery,
    query('regionId').optional().isInt({ min: 1 }),
    query('housingTypeId').optional().isInt({ min: 1 }),
    query('bedrooms').optional().isInt({ min: 0, max: 20 }),
    query('bathrooms').optional().isFloat({ min: 0, max: 20 })
  ],

  analytics: [
    ...commonValidations.dateRange,
    query('metric')
      .optional()
      .isIn(['averagePrice', 'salesVolume', 'inventory', 'priceGrowth', 'affordability'])
      .withMessage('Invalid metric specified'),
    query('groupBy')
      .optional()
      .isIn(['day', 'week', 'month', 'quarter', 'year'])
      .withMessage('Group by must be one of: day, week, month, quarter, year')
  ]
};

module.exports = {
  handleValidationErrors,
  sanitizeInput,
  commonValidations,
  validationSets
}; 