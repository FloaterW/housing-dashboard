import logger from '../utils/logger';

class ApiService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.apiKey =
      process.env.REACT_APP_API_KEY || 'dev-api-key-change-in-production';
    this.timeout = 30000; // 30 seconds
  }

  // Default headers for all requests
  getDefaultHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      Accept: 'application/json',
    };
  }

  // Generic request method with error handling and logging
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = Date.now();

    const config = {
      method: 'GET',
      headers: this.getDefaultHeaders(),
      ...options,
    };

    // Use provided signal or create new AbortController for timeout
    const controller = options.signal ? null : new AbortController();
    const timeoutId = controller
      ? setTimeout(() => controller.abort(), this.timeout)
      : null;

    if (!options.signal && controller) {
      config.signal = controller.signal;
    }

    logger.apiCall(config.method, url, config.body);

    try {
      const response = await fetch(url, config);
      if (timeoutId) clearTimeout(timeoutId);

      const responseTime = Date.now() - startTime;
      logger.apiResponse(config.method, url, response.status, responseTime);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (error.name === 'AbortError') {
        logger.error('API request timeout', error, {
          url,
          timeout: this.timeout,
        });
        throw new Error('Request timeout - please try again');
      }

      logger.error('API request failed', error, { url, responseTime });
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}, options = {}) {
    const searchParams = new URLSearchParams(params).toString();
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    return this.request(url, { method: 'GET', ...options });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    try {
      const result = await this.get('/health');
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== HOUSING DATA ENDPOINTS =====

  // Get all regions
  async getRegions() {
    try {
      const response = await this.get('/housing/regions');
      return response.data || [];
    } catch (error) {
      logger.error('Failed to fetch regions', error);
      // Return fallback data
      return [
        { id: 1, name: 'Peel Region', code: 'PEEL' },
        { id: 2, name: 'Mississauga', code: 'MISS' },
        { id: 3, name: 'Brampton', code: 'BRAM' },
        { id: 4, name: 'Caledon', code: 'CALE' },
      ];
    }
  }

  // Get housing types
  async getHousingTypes() {
    try {
      const response = await this.get('/housing/types');
      return response.data || [];
    } catch (error) {
      logger.error('Failed to fetch housing types', error);
      // Return fallback data
      return [
        { id: 1, name: 'All Types', code: 'ALL' },
        { id: 2, name: 'Detached', code: 'DET' },
        { id: 3, name: 'Semi-Detached', code: 'SEMI' },
        { id: 4, name: 'Townhouse', code: 'TOWN' },
        { id: 5, name: 'Condo', code: 'CONDO' },
      ];
    }
  }

  // Get property sales with filtering
  async getPropertySales(filters = {}) {
    try {
      const response = await this.get('/housing/sales', filters);
      return {
        data: response.data || [],
        total: response.total || 0,
        page: response.page || 1,
        totalPages: response.totalPages || 1,
      };
    } catch (error) {
      logger.error('Failed to fetch property sales', error, filters);
      throw error;
    }
  }

  // Get market analytics
  async getMarketAnalytics(params = {}) {
    try {
      const response = await this.get('/analytics/market-trends', params);
      return response.data || {};
    } catch (error) {
      logger.error('Failed to fetch market analytics', error, params);
      throw error;
    }
  }

  // ===== RENTAL DATA ENDPOINTS =====

  // Get rental listings
  async getRentalListings(filters = {}) {
    try {
      const response = await this.get('/rental/listings', filters);
      return {
        data: response.data || [],
        total: response.total || 0,
        page: response.page || 1,
        totalPages: response.totalPages || 1,
      };
    } catch (error) {
      logger.error('Failed to fetch rental listings', error, filters);
      throw error;
    }
  }

  // Get rental market trends
  async getRentalTrends(params = {}) {
    try {
      const response = await this.get('/rental/trends', params);
      return response.data || {};
    } catch (error) {
      logger.error('Failed to fetch rental trends', error, params);
      throw error;
    }
  }

  // ===== AIRBNB DATA ENDPOINTS =====

  // Get AirBnB listings
  async getAirBnbListings(filters = {}) {
    try {
      const response = await this.get('/airbnb/listings', filters);
      return {
        data: response.data || [],
        total: response.total || 0,
        page: response.page || 1,
        totalPages: response.totalPages || 1,
      };
    } catch (error) {
      logger.error('Failed to fetch AirBnB listings', error, filters);
      throw error;
    }
  }

  // Get AirBnB market analysis
  async getAirBnbAnalysis(params = {}) {
    try {
      const response = await this.get('/airbnb/analysis', params);
      return response.data || {};
    } catch (error) {
      logger.error('Failed to fetch AirBnB analysis', error, params);
      throw error;
    }
  }

  // ===== ANALYTICS ENDPOINTS =====

  // Get comparative analysis
  async getComparativeAnalysis(params = {}) {
    try {
      const response = await this.get('/analytics/comparative', params);
      return response.data || {};
    } catch (error) {
      logger.error('Failed to fetch comparative analysis', error, params);
      throw error;
    }
  }

  // Get affordability metrics
  async getAffordabilityMetrics(params = {}) {
    try {
      const response = await this.get('/analytics/affordability', params);
      return response.data || {};
    } catch (error) {
      logger.error('Failed to fetch affordability metrics', error, params);
      throw error;
    }
  }

  // Get market velocity data
  async getMarketVelocity(params = {}) {
    try {
      const response = await this.get('/analytics/velocity', params);
      return response.data || {};
    } catch (error) {
      logger.error('Failed to fetch market velocity', error, params);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  // Batch multiple API calls
  async batchRequests(requests = []) {
    const startTime = Date.now();
    logger.info('Starting batch API requests', { count: requests.length });

    try {
      const promises = requests.map(({ endpoint, params, method = 'get' }) => {
        return this[method](endpoint, params).catch(error => ({
          error: error.message,
          endpoint,
          params,
        }));
      });

      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      const successful = results.filter(r => !r.error).length;
      const failed = results.length - successful;

      logger.info('Batch API requests completed', {
        total: results.length,
        successful,
        failed,
        duration: `${duration}ms`,
      });

      return results;
    } catch (error) {
      logger.error('Batch API requests failed', error);
      throw error;
    }
  }

  // Test API connectivity
  async testConnectivity() {
    const tests = [
      { name: 'Health Check', endpoint: '/health' },
      { name: 'Regions', endpoint: '/housing/regions' },
      { name: 'Housing Types', endpoint: '/housing/types' },
    ];

    const results = {};

    for (const test of tests) {
      try {
        const startTime = Date.now();
        await this.get(test.endpoint);
        results[test.name] = {
          status: 'success',
          responseTime: Date.now() - startTime,
        };
      } catch (error) {
        results[test.name] = {
          status: 'error',
          error: error.message,
        };
      }
    }

    return results;
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
