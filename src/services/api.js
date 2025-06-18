// API service for communicating with backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // GET request helper
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request helper
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request helper
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request helper
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }

  // Housing data endpoints
  async getRegions() {
    return this.get('/housing/regions');
  }

  async getHousingTypes() {
    return this.get('/housing/types');
  }

  async getSales(params = {}) {
    return this.get('/test/sales', params);
  }

  async getListings(params = {}) {
    return this.get('/housing/listings', params);
  }

  async getPriceTrends(regionId, housingTypeId, months = 12) {
    return this.get(`/housing/price-trends/${regionId}/${housingTypeId}`, { months });
  }

  async getMarketSummary(regionId) {
    return this.get(`/housing/market-summary/${regionId}`);
  }

  // Rental data endpoints
  async getRentalListings(params = {}) {
    return this.get('/rental/listings', params);
  }

  async getRentalMetrics(regionId, housingTypeId) {
    return this.get(`/rental/metrics/${regionId}/${housingTypeId}`);
  }

  // AirBnB data endpoints
  async getAirbnbListings(params = {}) {
    return this.get('/airbnb/listings', params);
  }

  async getAirbnbMetrics(regionId, housingTypeId) {
    return this.get(`/airbnb/metrics/${regionId}/${housingTypeId}`);
  }

  async getAirbnbPerformanceAnalysis(regionId) {
    return this.get(`/airbnb/performance-analysis/${regionId}`);
  }

  // Analytics endpoints - Comprehensive market data
  async getMarketOverview() {
    return this.get('/analytics/market-overview');
  }

  async getPriceAnalysis(regionId, months = 12) {
    return this.get(`/analytics/price-analysis/${regionId}`, { months });
  }

  async getMarketHealth(regionId) {
    return this.get(`/analytics/market-health/${regionId}`);
  }

  async getComparativeAnalysis(metric = 'price') {
    return this.get('/analytics/comparative-analysis', { metric });
  }

  async getAffordabilityAnalysis(regionId) {
    return this.get(`/analytics/affordability/${regionId}`);
  }

  // New comprehensive analytics endpoints
  async getHousingDistribution(regionId) {
    return this.get(`/analytics/housing-distribution/${regionId}`);
  }

  async getNewVsResaleData(regionId, months = 3) {
    return this.get(`/analytics/new-vs-resale/${regionId}`, { months });
  }

  async getRentalOverview(regionId) {
    return this.get(`/analytics/rental-overview/${regionId}`);
  }

  async getPriceTrendsDetailed(regionId, housingTypeId, months = 12) {
    return this.get(`/analytics/price-trends/${regionId}/${housingTypeId}`, { months });
  }

  async getMarketHealthDetailed(regionId, months = 6) {
    return this.get(`/analytics/market-health/${regionId}`, { months });
  }
}

// Create and export singleton instance
const apiService = new ApiService();

export default apiService;

// Export specific methods for convenience
export const {
  healthCheck,
  getRegions,
  getHousingTypes,
  getSales,
  getListings,
  getPriceTrends,
  getMarketSummary,
  getRentalListings,
  getRentalMetrics,
  getAirbnbListings,
  getAirbnbMetrics,
  getAirbnbPerformanceAnalysis,
  getMarketOverview,
  getPriceAnalysis,
  getMarketHealth,
  getComparativeAnalysis,
  getAffordabilityAnalysis,
} = apiService;