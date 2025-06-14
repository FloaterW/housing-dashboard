import React, { useState } from 'react';
import { getEnhancedMarketData } from '../data/housingData';

function EnhancedMetrics({ selectedRegion, selectedHousingType }) {
  const { enhancedMetrics } = getEnhancedMarketData(selectedRegion, selectedHousingType);
  const [activeTab, setActiveTab] = useState('price');
  
  const metricGroups = {
    price: [
      {
        title: 'Average Price',
        value: enhancedMetrics.averagePrice,
        change: enhancedMetrics.priceChange,
        isPositive: enhancedMetrics.priceChange > 0,
        icon: '💰',
        bgGradient: 'from-blue-400 to-blue-600',
      },
      {
        title: 'Median Price',
        value: enhancedMetrics.medianPrice,
        change: enhancedMetrics.medianPriceChange,
        isPositive: enhancedMetrics.medianPriceChange > 0,
        icon: '📊',
        bgGradient: 'from-indigo-400 to-indigo-600',
      },
      {
        title: 'Price Per Sq Ft',
        value: enhancedMetrics.pricePerSqFt,
        change: enhancedMetrics.pricePerSqFtChange,
        isPositive: enhancedMetrics.pricePerSqFtChange > 0,
        icon: '📐',
        bgGradient: 'from-purple-400 to-purple-600',
      },
      {
        title: 'List-to-Sale Ratio',
        value: enhancedMetrics.listToSaleRatio + '%',
        change: enhancedMetrics.listToSaleChange,
        isPositive: enhancedMetrics.listToSaleChange > 0,
        icon: '🎯',
        bgGradient: 'from-pink-400 to-pink-600',
      },
    ],
    activity: [
      {
        title: 'Total Sales',
        value: enhancedMetrics.totalSales.toLocaleString(),
        change: enhancedMetrics.salesChange,
        isPositive: enhancedMetrics.salesChange > 0,
        icon: '🛒',
        bgGradient: 'from-green-400 to-green-600',
      },
      {
        title: 'Days on Market',
        value: enhancedMetrics.daysOnMarket,
        change: enhancedMetrics.daysOnMarketChange,
        isPositive: enhancedMetrics.daysOnMarketChange < 0,
        icon: '⏱️',
        bgGradient: 'from-yellow-400 to-yellow-600',
      },
      {
        title: 'New Listings',
        value: enhancedMetrics.newListings.toLocaleString(),
        change: enhancedMetrics.newListingsChange,
        isPositive: enhancedMetrics.newListingsChange > 0,
        icon: '🏡',
        bgGradient: 'from-orange-400 to-orange-600',
      },
      {
        title: 'Absorption Rate',
        value: enhancedMetrics.absorptionRate + '%',
        change: enhancedMetrics.absorptionRateChange,
        isPositive: enhancedMetrics.absorptionRateChange > 0,
        icon: '📈',
        bgGradient: 'from-red-400 to-red-600',
      },
    ],
    market: [
      {
        title: 'Months of Inventory',
        value: enhancedMetrics.monthsOfInventory,
        change: enhancedMetrics.inventoryChange,
        isPositive: enhancedMetrics.inventoryChange < 0,
        icon: '📦',
        bgGradient: 'from-teal-400 to-teal-600',
      },
      {
        title: 'Price-to-Income',
        value: enhancedMetrics.priceToIncome + 'x',
        change: enhancedMetrics.priceToIncomeChange,
        isPositive: enhancedMetrics.priceToIncomeChange < 0,
        icon: '💳',
        bgGradient: 'from-cyan-400 to-cyan-600',
      },
      {
        title: 'Seller Market Index',
        value: enhancedMetrics.sellerMarketIndex + '/100',
        change: null,
        isPositive: null,
        icon: '🏪',
        bgGradient: enhancedMetrics.sellerMarketIndex > 75 ? 'from-red-400 to-red-600' : 
                     enhancedMetrics.sellerMarketIndex > 50 ? 'from-orange-400 to-orange-600' : 'from-green-400 to-green-600',
        description: enhancedMetrics.sellerMarketIndex > 75 ? 'Strong Seller\'s Market' : 
                    enhancedMetrics.sellerMarketIndex > 50 ? 'Moderate Seller\'s Market' : 'Buyer\'s Market',
      },
      {
        title: 'Affordability Index',
        value: enhancedMetrics.affordabilityIndex + '/100',
        change: null,
        isPositive: null,
        icon: '🏠',
        bgGradient: enhancedMetrics.affordabilityIndex > 75 ? 'from-green-400 to-green-600' : 
                     enhancedMetrics.affordabilityIndex > 50 ? 'from-orange-400 to-orange-600' : 'from-red-400 to-red-600',
        description: enhancedMetrics.affordabilityIndex > 75 ? 'High Affordability' : 
                    enhancedMetrics.affordabilityIndex > 50 ? 'Moderate Affordability' : 'Low Affordability',
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Enhanced Market Metrics</h3>
        
        {/* Animated Tabs */}
        <div className="flex border-b-2 border-gray-200 mb-6">
          {[
            { id: 'price', label: 'Price Metrics', icon: '💰' },
            { id: 'activity', label: 'Activity Metrics', icon: '📊' },
            { id: 'market', label: 'Market Conditions', icon: '🏪' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`
                flex items-center space-x-2 py-3 px-6 font-medium transition-all duration-300
                ${activeTab === tab.id 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Metrics Grid with Animations */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricGroups[activeTab].map((metric, index) => (
            <div
              key={metric.title}
              className={`
                transform transition-all duration-500 hover:scale-105
                ${activeTab ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`
                bg-gradient-to-br ${metric.bgGradient} rounded-xl p-6 text-white
                shadow-lg hover:shadow-2xl transition-shadow duration-300
              `}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-white/90">{metric.title}</h4>
                  <span className="text-2xl animate-pulse">{metric.icon}</span>
                </div>
                
                <p className="text-2xl font-bold mb-2">{metric.value}</p>
                
                {metric.change !== null ? (
                  <div className={`flex items-center space-x-1 text-sm ${
                    metric.isPositive ? 'text-green-200' : 'text-red-200'
                  }`}>
                    <span className="font-medium">
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                    <span className="text-lg">
                      {metric.isPositive ? '↑' : '↓'}
                    </span>
                  </div>
                ) : metric.description ? (
                  <div className="text-sm text-white/90 font-medium">
                    {metric.description}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EnhancedMetrics; 