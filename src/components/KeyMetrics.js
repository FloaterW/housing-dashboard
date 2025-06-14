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
      <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(value)}%
      </span>
    );
  };

  const metricCards = [
    {
      title: 'Average Price',
      value: formatCurrency(metrics.avgPrice),
      change: metrics.priceChange,
      icon: '💰',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Total Sales',
      value: metrics.totalSales.toLocaleString(),
      change: metrics.salesChange,
      icon: '📊',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Days on Market',
      value: metrics.avgDaysOnMarket,
      change: metrics.daysChange,
      icon: '📅',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'Active Inventory',
      value: metrics.inventory.toLocaleString(),
      change: metrics.inventoryChange,
      icon: '🏠',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => (
        <div
          key={index}
          className={`${metric.bgColor} ${metric.borderColor} border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">{metric.title}</h3>
            <span className="text-2xl">{metric.icon}</span>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
            <div className="flex items-center space-x-2">
              {formatChange(metric.change)}
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default KeyMetrics; 