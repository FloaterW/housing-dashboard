const express = require('express');
const database = require('../config/database');
const logger = require('../config/logger');

const router = express.Router();

/**
 * GET /api/health
 * Basic health check endpoint
 */
router.get('/', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Check database connectivity
    const dbHealth = await database.healthCheck();
    
    // Get basic system information
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };

    // Calculate response time
    const responseTime = Date.now() - startTime;

    const healthStatus = {
      status: dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: dbHealth,
      system: systemInfo
    };

    // Return appropriate status code
    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
    
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    logger.error('Health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`,
      error: 'Health check failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Service unavailable'
    });
  }
});

/**
 * GET /api/health/detailed
 * Detailed health check with database statistics
 */
router.get('/detailed', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Get database health and statistics
    const [dbHealth, dbStats] = await Promise.all([
      database.healthCheck(),
      database.getStats()
    ]);

    // Get process information
    const processInfo = {
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      env: process.env.NODE_ENV || 'development'
    };

    const responseTime = Date.now() - startTime;

    const detailedHealth = {
      status: dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '1.0.0',
      database: {
        ...dbHealth,
        statistics: dbStats
      },
      process: processInfo
    };

    const statusCode = detailedHealth.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(detailedHealth);
  } catch (error) {
    logger.error('Detailed health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`,
      error: 'Detailed health check failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Service unavailable'
    });
  }
});

/**
 * GET /api/health/readiness
 * Kubernetes readiness probe endpoint
 */
router.get('/readiness', async (req, res) => {
  try {
    const dbHealth = await database.healthCheck();
    
    if (dbHealth.status === 'healthy') {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        reason: 'Database not available',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      reason: 'Service check failed',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/health/liveness
 * Kubernetes liveness probe endpoint
 */
router.get('/liveness', (req, res) => {
  // Simple liveness check - just verify the process is running
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;