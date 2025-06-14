import React from 'react';
import PriceChart from './charts/PriceChart';
import SalesChart from './charts/SalesChart';
import InventoryChart from './charts/InventoryChart';
import KeyMetrics from './KeyMetrics';

function Dashboard({ selectedRegion, selectedHousingType }) {
  return (
    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {selectedRegion} - {selectedHousingType}
          </h2>
          <p className="text-gray-600">
            Real-time housing market analytics and trends for February 2025
          </p>
        </div>

        {/* Key Metrics */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Performance Indicators</h3>
          <KeyMetrics 
            selectedRegion={selectedRegion} 
            selectedHousingType={selectedHousingType} 
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Price Trends Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Average Price Trends
            </h3>
            <PriceChart 
              selectedRegion={selectedRegion} 
              selectedHousingType={selectedHousingType} 
            />
          </div>

          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Monthly Sales Volume
            </h3>
            <SalesChart 
              selectedRegion={selectedRegion} 
              selectedHousingType={selectedHousingType} 
            />
          </div>
        </div>

        {/* Inventory Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Current Market Inventory
          </h3>
          <div className="max-w-2xl mx-auto">
            <InventoryChart 
              selectedRegion={selectedRegion} 
              selectedHousingType={selectedHousingType} 
            />
          </div>
        </div>

        {/* Market Insights */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📈</span>
              <div>
                <h4 className="font-medium text-gray-800">Price Trend</h4>
                <p className="text-sm text-gray-600">
                  Prices in {selectedRegion} have shown consistent growth over the past year
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🏘️</span>
              <div>
                <h4 className="font-medium text-gray-800">Market Activity</h4>
                <p className="text-sm text-gray-600">
                  Strong buyer demand with limited inventory driving competitive conditions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⏱️</span>
              <div>
                <h4 className="font-medium text-gray-800">Quick Sales</h4>
                <p className="text-sm text-gray-600">
                  Properties are selling faster than the historical average
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-medium text-gray-800">Recommendation</h4>
                <p className="text-sm text-gray-600">
                  Sellers' market conditions favor listing properties now
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard; 