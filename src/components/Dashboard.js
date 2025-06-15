import React from 'react';
import PriceChart from './charts/PriceChart';
import SalesChart from './charts/SalesChart';
import MarketTrendsChart from './charts/MarketTrendsChart';
import HousingTypeDistributionChart from './charts/HousingTypeDistributionChart';
import PricePerSqFtChart from './charts/PricePerSqFtChart';
import MarketVelocityChart from './charts/MarketVelocityChart';
import NewVsResaleChart from './charts/NewVsResaleChart';
import MarketHealthDashboard from './charts/MarketHealthDashboard';
import HousingMapDashboard from './charts/HousingMapDashboard';
import KeyMetrics from './KeyMetrics';
import EnhancedMetrics from './EnhancedMetrics';
import RegionalComparison from './RegionalComparison';
import { getDataForRegionAndType } from '../data/housingData';
import { exportAllDashboardData } from '../utils/masterExport';

function Dashboard({ selectedRegion, selectedHousingType }) {
  const handleMasterExport = () => {
    // Get comprehensive housing geo data for export
    const housingGeoData = [
      { municipality: 'Mississauga', geometry: [-79.6441, 43.5890], avgPrice: 1350000, priceGrowth: 11.9, affordabilityRate: 45.2, riskScore: 85, marketTemp: 82, inventory: 1.8 },
      { municipality: 'Brampton', geometry: [-79.7624, 43.7315], avgPrice: 1150000, priceGrowth: 10.2, affordabilityRate: 58.3, riskScore: 74, marketTemp: 74, inventory: 2.3 },
      { municipality: 'Caledon', geometry: [-79.8711, 43.8554], avgPrice: 1650000, priceGrowth: 7.6, affordabilityRate: 28.1, riskScore: 68, marketTemp: 68, inventory: 3.2 },
      { municipality: 'Oakville', geometry: [-79.6876, 43.4675], avgPrice: 1750000, priceGrowth: 9.8, affordabilityRate: 32.1, riskScore: 78, marketTemp: 79, inventory: 1.5 },
      { municipality: 'Milton', geometry: [-79.8774, 43.5183], avgPrice: 1450000, priceGrowth: 12.1, affordabilityRate: 41.8, riskScore: 76, marketTemp: 81, inventory: 2.1 }
    ];
    
    // Call the enhanced export function
    exportAllDashboardData(selectedRegion, selectedHousingType, housingGeoData, null);
  };

  return (
    <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                {selectedRegion} - {selectedHousingType}
              </h2>
              <p className="text-gray-600 text-lg">
                Real-time housing market analytics and trends for February 2025
              </p>
            </div>
            
            {/* Master Export Button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleMasterExport}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-lg">📊</span>
                <span>Export All Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics with staggered animation */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
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

        {/* Housing Type Analysis Section */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Housing Type Analysis</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <HousingTypeDistributionChart selectedRegion={selectedRegion} />
            <PricePerSqFtChart selectedRegion={selectedRegion} />
          </div>
        </div>

        {/* Market Velocity Analysis */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '275ms' }}>
          <MarketVelocityChart selectedRegion={selectedRegion} />
        </div>

        {/* New vs Resale Analysis */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '285ms' }}>
          <NewVsResaleChart selectedRegion={selectedRegion} />
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


        {/* Market Health Dashboard */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '700ms' }}>
          <MarketHealthDashboard />
        </div>

        {/* Geographic Map Analysis */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '725ms' }}>
          <HousingMapDashboard />
        </div>

        {/* Market Insights with enhanced styling */}
        <div className="animate-slide-up" style={{ animationDelay: '750ms' }}>
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

export default Dashboard; 