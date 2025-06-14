import React from 'react';
import { getDataForRegionAndType } from '../data/housingData';

function KeyMetrics({ selectedRegion, selectedHousingType }) {
  const metrics = getDataForRegionAndType('keyMetrics', selectedRegion, selectedHousingType) || {
    avgPrice: 1245000,
    priceChange: 5.2,
    totalSales: 1400,
    salesChange: 3.7,
    avgDaysOnMarket: 18,
    daysChange: -2.5,
    inventory: 3500,
    inventoryChange: -8.3,
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatChange = (value) => {
    const isPositive = value > 0;
    return (
      <span className={`text-sm font-medium flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <span className="text-lg mr-1">{isPositive ? '↑' : '↓'}</span>
        {Math.abs(value)}%
      </span>
    );
  };

  const metricCards = [
    {
      title: 'Average Price',
      value: formatCurrency(metrics.avgPrice),
      change: metrics.priceChange,
      icon: '💰',
      bgGradient: 'from-blue-400 to-blue-600',
      shadowColor: 'shadow-blue-200',
    },
    {
      title: 'Total Sales',
      value: metrics.totalSales.toLocaleString(),
      change: metrics.salesChange,
      icon: '📊',
      bgGradient: 'from-green-400 to-green-600',
      shadowColor: 'shadow-green-200',
    },
    {
      title: 'Days on Market',
      value: metrics.avgDaysOnMarket,
      change: metrics.daysChange,
      icon: '📅',
      bgGradient: 'from-yellow-400 to-yellow-600',
      shadowColor: 'shadow-yellow-200',
    },
    {
      title: 'Active Inventory',
      value: metrics.inventory.toLocaleString(),
      change: metrics.inventoryChange,
      icon: '🏠',
      bgGradient: 'from-purple-400 to-purple-600',
      shadowColor: 'shadow-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => (
        <div
          key={index}
          className={`
            transform transition-all duration-500 hover:scale-105 hover:-translate-y-2
            animate-slide-up
          `}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`
            bg-gradient-to-br ${metric.bgGradient} rounded-xl p-6 text-white
            shadow-xl ${metric.shadowColor} hover:shadow-2xl
            relative overflow-hidden group
          `}>
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/90 font-medium text-sm uppercase tracking-wider">{metric.title}</h3>
                <span className="text-3xl animate-pulse">{metric.icon}</span>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold">{metric.value}</p>
                <div className="flex items-center justify-between">
                  {formatChange(metric.change)}
                  <span className="text-xs text-white/70">vs last month</span>
                </div>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default KeyMetrics; 