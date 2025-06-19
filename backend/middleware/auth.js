const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

// Basic API key authentication (for now)
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY || 'dev-api-key-change-in-production';

  if (!apiKey) {
    logger.warn('API request without API key', { 
      ip: req.ip, 
      url: req.originalUrl,
      userAgent: req.get('User-Agent')
    });
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key required'
    });
  }

  if (apiKey !== validApiKey) {
    logger.warn('Invalid API key attempt', { 
      ip: req.ip, 
      url: req.originalUrl,
      providedKey: apiKey.substring(0, 8) + '...',
      userAgent: req.get('User-Agent')
    });
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key'
    });
  }

  next();
};

// JWT authentication for user sessions
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    logger.warn('JWT request without token', { 
      ip: req.ip, 
      url: req.originalUrl 
    });
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn('Invalid JWT token', { 
        ip: req.ip, 
        url: req.originalUrl,
        error: err.message
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Invalid or expired token'
      });
    }

    req.user = user;
    next();
  });
};

// Optional authentication - continues if no auth provided
const optionalAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const authHeader = req.headers.authorization;
  
  if (!apiKey && !authHeader) {
    return next(); // No auth provided, continue
  }

  // If auth is provided, validate it
  if (apiKey) {
    return authenticateApiKey(req, res, next);
  } else {
    return authenticateJWT(req, res, next);
  }
};

// Rate limiting per user/API key
const createUserRateLimit = (windowMs, maxRequests) => {
  const attempts = new Map();

  return (req, res, next) => {
    const identifier = req.user?.id || req.headers['x-api-key'] || req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old attempts
    if (attempts.has(identifier)) {
      const userAttempts = attempts.get(identifier).filter(time => time > windowStart);
      attempts.set(identifier, userAttempts);
    }

    const currentAttempts = attempts.get(identifier) || [];
    
    if (currentAttempts.length >= maxRequests) {
      logger.warn('Rate limit exceeded', { 
        identifier, 
        attempts: currentAttempts.length,
        ip: req.ip,
        url: req.originalUrl
      });
      
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.`,
        retryAfter: Math.ceil((currentAttempts[0] + windowMs - now) / 1000)
      });
    }

    // Record this attempt
    currentAttempts.push(now);
    attempts.set(identifier, currentAttempts);
    
    next();
  };
};

module.exports = {
  authenticateApiKey,
  authenticateJWT,
  optionalAuth,
  createUserRateLimit
}; 