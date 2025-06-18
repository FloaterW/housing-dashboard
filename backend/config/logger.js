const winston = require('winston');
const path = require('path');

// Define log levels and colors
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue'
};

// Add colors to winston
winston.addColors(logColors);

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    let metaStr = '';
    if (Object.keys(meta).length > 0) {
      metaStr = '\n' + JSON.stringify(meta, null, 2);
    }
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create logger instance
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: fileFormat,
  defaultMeta: { 
    service: 'housing-dashboard-api',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Error log file - only errors
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      handleExceptions: true,
      handleRejections: true
    }),
    
    // Combined log file - all levels
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      handleExceptions: true,
      handleRejections: true
    })
  ],
  exitOnError: false
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    handleExceptions: true,
    handleRejections: true
  }));
}

// Production logging setup
if (process.env.NODE_ENV === 'production') {
  // Add additional production transports here
  // Examples: Elasticsearch, CloudWatch, etc.
  
  // Reduce log level for production
  logger.level = process.env.LOG_LEVEL || 'warn';
}

// Create HTTP request logger middleware
logger.httpLogger = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;
  
  res.send = function(data) {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      responseSize: data ? data.length : 0
    };
    
    // Log different levels based on status code
    if (res.statusCode >= 500) {
      logger.error('HTTP Request', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Database query logger
logger.queryLogger = (sql, params, duration, error) => {
  const logData = {
    sql: sql.substring(0, 200) + (sql.length > 200 ? '...' : ''),
    paramCount: params ? params.length : 0,
    duration: `${duration}ms`
  };
  
  if (error) {
    logger.error('Database Query Failed', { ...logData, error: error.message });
  } else if (duration > 1000) {
    logger.warn('Slow Database Query', logData);
  } else if (process.env.NODE_ENV === 'development') {
    logger.debug('Database Query', logData);
  }
};

// Performance monitoring
logger.performanceLogger = (operation, duration, metadata = {}) => {
  const logData = {
    operation,
    duration: `${duration}ms`,
    ...metadata
  };
  
  if (duration > 5000) {
    logger.warn('Slow Operation', logData);
  } else if (duration > 1000) {
    logger.info('Operation Completed', logData);
  } else if (process.env.NODE_ENV === 'development') {
    logger.debug('Operation Completed', logData);
  }
};

// Security event logger
logger.securityLogger = (event, details = {}) => {
  logger.warn('Security Event', {
    event,
    timestamp: new Date().toISOString(),
    ...details
  });
};

// Business metrics logger
logger.metricsLogger = (metric, value, tags = {}) => {
  logger.info('Metric', {
    metric,
    value,
    tags,
    timestamp: new Date().toISOString()
  });
};

module.exports = logger;