import React from 'react';
import { getDataForRegionAndType } from '../data/housingData';
import designSystem from '../styles/designSystem';

function KeyMetrics({ selectedRegion, selectedHousingType }) {
  const metrics = getDataForRegionAndType(
    'keyMetrics',
    selectedRegion,
    selectedHousingType
  ) || {
    avgPrice: 1245000,
    priceChange: 5.2,
    totalSales: 1400,
    salesChange: 3.7,
    avgDaysOnMarket: 18,
    daysChange: -2.5,
    inventory: 3500,
    inventoryChange: -8.3,
  };

  const formatCurrency = value => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatChange = value => {
    const isPositive = value > 0;
    return (
      <span
        className={`${designSystem.components.metric.change} flex items-center ${isPositive ? designSystem.typography.success : designSystem.typography.danger}`}
      >
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
      bgGradient: designSystem.gradients.primary,
      shadowColor: designSystem.shadows.card,
      borderColor: designSystem.colors.primary[500],
    },
    {
      title: 'Total Sales',
      value: metrics.totalSales.toLocaleString(),
      change: metrics.salesChange,
      icon: '📊',
      bgGradient: designSystem.gradients.success,
      shadowColor: designSystem.shadows.card,
      borderColor: designSystem.colors.success[500],
    },
    {
      title: 'Days on Market',
      value: metrics.avgDaysOnMarket,
      change: metrics.daysChange,
      icon: '📅',
      bgGradient: designSystem.gradients.warning,
      shadowColor: designSystem.shadows.card,
      borderColor: designSystem.colors.warning[500],
    },
    {
      title: 'Active Inventory',
      value: metrics.inventory.toLocaleString(),
      change: metrics.inventoryChange,
      icon: '🏠',
      bgGradient: designSystem.gradients.accent,
      shadowColor: designSystem.shadows.card,
      borderColor: designSystem.colors.accent[500],
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h3 className={designSystem.typography.h3}>
          Key Performance Indicators
        </h3>
        <p className={designSystem.typography.bodySmall}>
          {selectedRegion} - {selectedHousingType}
        </p>
      </div>

      <div
        className={designSystem.layout.gridResponsive4 + ' ' + designSystem.spacing.gridGap}
        role="region"
        aria-label="Key performance metrics"
      >
        {metricCards.map((metric, index) => (
          <div
            key={index}
            className={`
            ${designSystem.animations.transition} ${designSystem.animations.hoverScale} hover:-translate-y-2
            animate-slide-up
          `}
            style={{ animationDelay: `${index * 100}ms` }}
            role="article"
            aria-labelledby={`metric-${index}-title`}
          >
            <div
              className={`
            bg-gradient-to-br ${metric.bgGradient} ${designSystem.borders.radius.medium} ${designSystem.spacing.container} text-white
            ${metric.shadowColor} hover:shadow-2xl ${designSystem.animations.transition}
            relative overflow-hidden group
          `}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    id={`metric-${index}-title`}
                    className="text-white/90 font-medium text-sm uppercase tracking-wider"
                  >
                    {metric.title}
                  </h3>
                  <span className="text-3xl animate-pulse" aria-hidden="true">
                    {metric.icon}
                  </span>
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
    </div>
  );
}

export default React.memo(KeyMetrics);
