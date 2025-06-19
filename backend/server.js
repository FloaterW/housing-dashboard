const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const database = require('./config/database');
const logger = require('./config/logger');
const cache = require('./services/cache');

// Import middleware
const { optionalAuth, authenticateApiKey } = require('./middleware/auth');
const { sanitizeInput, handleValidationErrors } = require('./middleware/validation');

// Import routes
const housingRoutes = require('./routes/housing');
const rentalRoutes = require('./routes/rental');
const airbnbRoutes = require('./routes/airbnb');
const analyticsRoutes = require('./routes/analytics');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3001;

// ====================================================================
// MIDDLEWARE SETUP
// ====================================================================

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS setup with environment-based configuration
const allowedOrigins = process.env.CORS_ORIGINS ? 
  process.env.CORS_ORIGINS.split(',') : 
  ['http://localhost:3000', 'http://localhost:3001'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.) only in development
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      logger.warn('CORS violation detected', { 
        origin, 
        userAgent: 'Unknown',
        allowedOrigins 
      });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-API-Key'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.securityLogger('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

app.use(limiter);

// Compression middleware
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  threshold: 1024 // Only compress responses > 1KB
}));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// HTTP request logging
app.use(logger.httpLogger);

// Request ID middleware for tracing
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substr(2, 9);
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Add input sanitization middleware
app.use(sanitizeInput);

// ====================================================================
// ROUTES
// ====================================================================

// Health check (before authentication)
app.use('/api/health', healthRoutes);

// API routes with optional authentication and caching
app.use('/api/housing', optionalAuth, cache.middleware('housing', 300), housingRoutes);
app.use('/api/rental', optionalAuth, cache.middleware('rental', 300), rentalRoutes);
app.use('/api/airbnb', optionalAuth, cache.middleware('airbnb', 600), airbnbRoutes);
app.use('/api/analytics', optionalAuth, cache.middleware('analytics', 180), analyticsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Housing Dashboard API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Housing Dashboard API Documentation',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      housing: '/api/housing',
      rental: '/api/rental',
      airbnb: '/api/airbnb',
      analytics: '/api/analytics'
    },
    documentation: {
      swagger: '/api/docs',
      postman: '/api/postman'
    }
  });
});

// ====================================================================
// ERROR HANDLING
// ====================================================================

// 404 handler
app.use('*', (req, res) => {
  logger.warn('404 Not Found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.status(404).json({
    error: 'Endpoint not found',
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error, req, res, next) => {
  // Log error details
  logger.error('Unhandled Error', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.id
  });

  // Determine error status code
  let statusCode = 500;
  let message = 'Internal server error';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (error.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Duplicate entry';
  } else if (error.code && error.code.startsWith('ER_')) {
    statusCode = 500;
    message = 'Database error';
  }

  // Send error response
  const errorResponse = {
    error: message,
    timestamp: new Date().toISOString(),
    requestId: req.id
  };

  // Include error details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = error.message;
    errorResponse.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
});

// ====================================================================
// SERVER STARTUP
// ====================================================================

async function startServer() {
  try {
    // Connect to database
    await database.connect();
    logger.info('Database connection established');
    
    // Connect to cache (Redis) - optional, graceful degradation
    try {
      await cache.connect();
      logger.info('Cache service connected');
    } catch (error) {
      logger.warn('Cache service unavailable, continuing without caching', error);
    }

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`Housing Dashboard API server running on port ${PORT}`, {
        environment: process.env.NODE_ENV || 'development',
        port: PORT,
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage()
      });
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          await database.disconnect();
          logger.info('Database connection closed');
          
          await cache.disconnect();
          logger.info('Cache connection closed');
          
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', { promise, reason });
      gracefulShutdown('unhandledRejection');
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };