const mysql = require('mysql2/promise');
const logger = require('./logger');

class Database {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'housing_dashboard',
        waitForConnections: true,
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
        queueLimit: 0,
        acquireTimeout: 60000,
        timeout: 60000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        // Handle connection errors
        reconnect: true,
        // Security settings
        ssl: process.env.DB_SSL === 'true' ? {
          rejectUnauthorized: false
        } : false,
        // Performance settings
        charset: 'utf8mb4',
        timezone: 'Z',
        dateStrings: false,
        supportBigNumbers: true,
        bigNumberStrings: false
      });

      // Test the connection
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      
      this.isConnected = true;
      logger.info('Database connected successfully');
      
      return this.pool;
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.pool) {
      try {
        await this.pool.end();
        this.isConnected = false;
        logger.info('Database disconnected successfully');
      } catch (error) {
        logger.error('Database disconnection failed:', error);
        throw error;
      }
    }
  }

  getPool() {
    if (!this.pool || !this.isConnected) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.pool;
  }

  // Execute a query with error handling and logging
  async query(sql, params = []) {
    const startTime = Date.now();
    try {
      const [rows, fields] = await this.pool.execute(sql, params);
      const duration = Date.now() - startTime;
      
      // Log slow queries (over 1 second)
      if (duration > 1000) {
        logger.warn(`Slow query detected (${duration}ms):`, { sql, params });
      } else if (process.env.NODE_ENV === 'development') {
        logger.debug(`Query executed (${duration}ms):`, { sql, params });
      }
      
      return { rows, fields, duration };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`Query failed (${duration}ms):`, { sql, params, error: error.message });
      throw error;
    }
  }

  // Execute multiple queries in a transaction
  async transaction(queries) {
    const connection = await this.pool.getConnection();
    const startTime = Date.now();
    
    try {
      await connection.beginTransaction();
      const results = [];
      
      for (const { sql, params } of queries) {
        const [rows] = await connection.execute(sql, params);
        results.push(rows);
      }
      
      await connection.commit();
      const duration = Date.now() - startTime;
      
      logger.info(`Transaction completed successfully (${duration}ms)`, { 
        queryCount: queries.length 
      });
      
      return results;
    } catch (error) {
      await connection.rollback();
      const duration = Date.now() - startTime;
      
      logger.error(`Transaction failed (${duration}ms):`, { 
        queryCount: queries.length,
        error: error.message 
      });
      
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get database statistics
  async getStats() {
    try {
      const [connectionStats] = await this.pool.execute(`
        SHOW STATUS WHERE Variable_name IN (
          'Connections', 'Threads_connected', 'Threads_running',
          'Queries', 'Slow_queries', 'Uptime'
        )
      `);
      
      const [processInfo] = await this.pool.execute('SHOW PROCESSLIST');
      
      return {
        connectionStats: connectionStats.reduce((acc, stat) => {
          acc[stat.Variable_name] = stat.Value;
          return acc;
        }, {}),
        activeConnections: processInfo.length,
        poolConfig: {
          connectionLimit: this.pool.config.connectionLimit,
          acquireTimeout: this.pool.config.acquireTimeout,
          timeout: this.pool.config.timeout
        }
      };
    } catch (error) {
      logger.error('Failed to get database stats:', error);
      throw error;
    }
  }

  // Health check for monitoring
  async healthCheck() {
    try {
      const startTime = Date.now();
      await this.pool.execute('SELECT 1 as health_check');
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        responseTime,
        isConnected: this.isConnected,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        error: error.message,
        isConnected: false,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create and export singleton instance
const database = new Database();

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing database connection...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, closing database connection...');
  await database.disconnect();
  process.exit(0);
});

module.exports = database;