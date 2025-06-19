const redis = require('redis');
const logger = require('../config/logger');

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.defaultTTL = 300; // 5 minutes default
  }

  async connect() {
    try {
      // For Redis v4+ client configuration
      this.client = redis.createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              logger.error('Too many Redis connection attempts');
              return false;
            }
            return Math.min(retries * 100, 3000);
          }
        },
        password: process.env.REDIS_PASSWORD || undefined,
        database: process.env.REDIS_DB || 0
      });

      this.client.on('connect', () => {
        logger.info('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        logger.error('Redis client error', err);
        this.isConnected = false;
      });

      this.client.on('end', () => {
        logger.info('Redis client disconnected');
        this.isConnected = false;
      });

      this.client.on('ready', () => {
        this.isConnected = true;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      logger.error('Failed to connect to Redis', error);
      // Don't throw error - degrade gracefully without caching
      this.isConnected = false;
      return null;
    }
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      try {
        await this.client.quit();
        logger.info('Redis client disconnected successfully');
      } catch (error) {
        logger.error('Error disconnecting Redis client', error);
      }
    }
  }

  // Generate cache key with namespace
  generateKey(namespace, ...parts) {
    return `housing_dashboard:${namespace}:${parts.join(':')}`;
  }

  // Get cached data
  async get(key) {
    if (!this.isConnected) return null;

    try {
      const cached = await this.client.get(key);
      if (cached) {
        logger.debug('Cache hit', { key });
        return JSON.parse(cached);
      }
      logger.debug('Cache miss', { key });
      return null;
    } catch (error) {
      logger.warn('Cache get error', { key, error: error.message });
      return null;
    }
  }

  // Set cached data with TTL
  async set(key, data, ttl = null) {
    if (!this.isConnected) return false;

    try {
      const ttlToUse = ttl || this.defaultTTL;
      await this.client.setEx(key, ttlToUse, JSON.stringify(data));
      logger.debug('Cache set', { key, ttl: ttlToUse });
      return true;
    } catch (error) {
      logger.warn('Cache set error', { key, error: error.message });
      return false;
    }
  }

  // Delete cached data
  async del(key) {
    if (!this.isConnected) return false;

    try {
      await this.client.del(key);
      logger.debug('Cache deleted', { key });
      return true;
    } catch (error) {
      logger.warn('Cache delete error', { key, error: error.message });
      return false;
    }
  }

  // Clear cache by pattern
  async clearByPattern(pattern) {
    if (!this.isConnected) return false;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        logger.info('Cache cleared by pattern', { pattern, keysDeleted: keys.length });
      }
      return true;
    } catch (error) {
      logger.warn('Cache clear pattern error', { pattern, error: error.message });
      return false;
    }
  }

  // Cache with automatic key generation
  async cacheQuery(namespace, queryParams, queryFunction, ttl = null) {
    const key = this.generateKey(namespace, JSON.stringify(queryParams));
    
    // Try to get from cache first
    const cached = await this.get(key);
    if (cached) {
      return cached;
    }

    // Execute query and cache result
    try {
      const result = await queryFunction();
      await this.set(key, result, ttl);
      return result;
    } catch (error) {
      logger.error('Query execution error in cacheQuery', error);
      throw error;
    }
  }

  // Middleware for caching API responses
  middleware(namespace, ttl = null) {
    return async (req, res, next) => {
      if (req.method !== 'GET') {
        return next();
      }

      const key = this.generateKey(
        namespace, 
        req.originalUrl,
        JSON.stringify(req.query),
        JSON.stringify(req.params)
      );

      const cached = await this.get(key);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cached);
      }

      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = function(data) {
        res.setHeader('X-Cache', 'MISS');
        cache.set(key, data, ttl).catch(err => {
          logger.warn('Failed to cache response', { key, error: err.message });
        });
        return originalJson.call(this, data);
      };

      next();
    };
  }

  // Health check
  async healthCheck() {
    if (!this.isConnected) {
      return { status: 'disconnected', message: 'Redis not connected' };
    }

    try {
      const start = Date.now();
      await this.client.ping();
      const responseTime = Date.now() - start;
      
      return {
        status: 'healthy',
        responseTime,
        connected: this.isConnected
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        connected: false
      };
    }
  }

  // Cache statistics
  async getStats() {
    if (!this.isConnected) {
      return { error: 'Redis not connected' };
    }

    try {
      const info = await this.client.info('memory');
      const keyspace = await this.client.info('keyspace');
      
      return {
        memory: this.parseRedisInfo(info),
        keyspace: this.parseRedisInfo(keyspace),
        connected: this.isConnected
      };
    } catch (error) {
      logger.error('Failed to get Redis stats', error);
      return { error: error.message };
    }
  }

  parseRedisInfo(info) {
    const lines = info.split('\r\n');
    const result = {};
    
    lines.forEach(line => {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split(':');
        if (key && value) {
          result[key] = value;
        }
      }
    });
    
    return result;
  }
}

// Create singleton instance
const cache = new CacheService();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing Redis connection...');
  await cache.disconnect();
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, closing Redis connection...');
  await cache.disconnect();
});

module.exports = cache; 