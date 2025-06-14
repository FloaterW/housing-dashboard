import React from 'react';
import PriceChart from './charts/PriceChart';
import SalesChart from './charts/SalesChart';
import InventoryChart from './charts/InventoryChart';
import MarketTrendsChart from './charts/MarketTrendsChart';
import KeyMetrics from './KeyMetrics';
import EnhancedMetrics from './EnhancedMetrics';
import RegionalComparison from './RegionalComparison';

function Dashboard({ selectedRegion, selectedHousingType }) {
  return (
    <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {selectedRegion} - {selectedHousingType}
          </h2>
          <p className="text-gray-600 text-lg">
            Real-time housing market analytics and trends for February 2025
          </p>
        </div>

        {/* Key Metrics with staggered animation */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Performance Indicators</h3>
          <KeyMetrics 
            selectedRegion={selectedRegion} 
            selectedHousingType={selectedHousingType} 
          />
        </div>

        {/* Enhanced Metrics with tabs */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <EnhancedMetrics
            selectedRegion={selectedRegion}
            selectedHousingType={selectedHousingType}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Price Trends Chart */}
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="bg-white rounded-xl shadow-lg p-6 h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📈</span>
                Average Price Trends
              </h3>
              <PriceChart 
                selectedRegion={selectedRegion} 
                selectedHousingType={selectedHousingType} 
              />
            </div>
          </div>

          {/* Sales Chart */}
          <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="bg-white rounded-xl shadow-lg p-6 h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Monthly Sales Volume
              </h3>
              <SalesChart 
                selectedRegion={selectedRegion} 
                selectedHousingType={selectedHousingType} 
              />
            </div>
          </div>
        </div>

        {/* Market Trends Chart */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '500ms' }}>
          <MarketTrendsChart
            selectedRegion={selectedRegion}
            selectedHousingType={selectedHousingType}
          />
        </div>

        {/* Regional Comparison */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '600ms' }}>
          <RegionalComparison
            selectedHousingType={selectedHousingType}
          />
        </div>

        {/* Inventory Chart */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '700ms' }}>
          <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🏠</span>
              Current Market Inventory
            </h3>
            <div className="max-w-2xl mx-auto">
              <InventoryChart 
                selectedRegion={selectedRegion} 
                selectedHousingType={selectedHousingType} 
              />
            </div>
          </div>
        </div>

        {/* Market Insights with enhanced styling */}
        <div className="animate-slide-up" style={{ animationDelay: '800ms' }}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-1">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">💡</span>
                Market Insights & Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg transform transition-all duration-300 hover:scale-105">
                  <span className="text-3xl animate-bounce">📈</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Price Trend Analysis</h4>
                    <p className="text-sm text-gray-600">
                      {selectedRegion} shows strong price appreciation with {selectedHousingType} properties leading the market growth
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg transform transition-all duration-300 hover:scale-105">
                  <span className="text-3xl animate-pulse">🏘️</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Market Activity</h4>
                    <p className="text-sm text-gray-600">
                      High buyer demand with limited inventory creating competitive bidding situations
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg transform transition-all duration-300 hover:scale-105">
                  <span className="text-3xl animate-spin-slow">⏱️</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Speed of Sales</h4>
                    <p className="text-sm text-gray-600">
                      Properties selling {Math.abs(getDataForRegionAndType('keyMetrics', selectedRegion, selectedHousingType)?.daysChange || 2.5)}% faster than last month
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg transform transition-all duration-300 hover:scale-105">
                  <span className="text-3xl animate-wiggle">🎯</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Strategic Recommendation</h4>
                    <p className="text-sm text-gray-600">
                      Optimal time for sellers to list. Buyers should act quickly with pre-approved financing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Import the helper function
import { getDataForRegionAndType } from '../data/housingData';

export default Dashboard; 