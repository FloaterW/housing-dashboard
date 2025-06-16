import React from 'react';
import { ResponsiveContainer } from 'recharts';
import designSystem from '../../styles/designSystem';

/**
 * Reusable Chart Wrapper Component
 * Provides consistent styling and theming for all charts across the application
 */
const ChartWrapper = ({ 
  title, 
  subtitle, 
  children, 
  height = 400, 
  className = '',
  showLegend = false,
  actions = null,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <div className={`${designSystem.components.card.base} ${className}`}>
        <div className={designSystem.layout.flexCenter} style={{ height: height }}>
          <div className="text-center">
            <div className={`${designSystem.animations.spin} w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4`}></div>
            <p className={designSystem.typography.bodySmall}>Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${designSystem.components.card.base} ${className}`}>
        <div className={designSystem.layout.flexCenter} style={{ height: height }}>
          <div className="text-center">
            <span className="text-4xl mb-4 block">📊</span>
            <h3 className={`${designSystem.typography.h4} mb-2`}>Chart Error</h3>
            <p className={designSystem.typography.bodySmall}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${designSystem.components.card.hover} ${className}`}>
      {/* Chart Header */}
      {(title || actions) && (
        <div className={`${designSystem.layout.flexBetween} mb-6`}>
          <div>
            {title && (
              <h2 className={designSystem.typography.h3}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`${designSystem.typography.bodySmall} mt-1`}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Chart Container */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          {children}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className={`${designSystem.layout.flexCenter} ${designSystem.spacing.componentGapSmall}`}>
            <div className={`${designSystem.layout.flexCenter} gap-2`}>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className={designSystem.typography.caption}>Primary Data</span>
            </div>
            <div className={`${designSystem.layout.flexCenter} gap-2`}>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className={designSystem.typography.caption}>Secondary Data</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Chart Theme Configuration
 * Consistent colors and styling for all chart components
 */
export const chartTheme = {
  colors: designSystem.chartColors.palette,
  
  // Primary chart colors
  primary: designSystem.chartColors.primary,
  secondary: designSystem.chartColors.secondary,
  accent: designSystem.chartColors.accent,
  success: designSystem.chartColors.success,
  warning: designSystem.chartColors.warning,
  danger: designSystem.chartColors.danger,
  
  // Grid and axis styling
  grid: {
    stroke: designSystem.colors.gray[200],
    strokeDasharray: '3 3',
  },
  
  // Axis styling
  axis: {
    fontSize: 12,
    fill: designSystem.colors.gray[600],
    fontFamily: 'inherit',
  },
  
  // Tooltip styling
  tooltip: {
    backgroundColor: designSystem.colors.gray[900],
    border: 'none',
    borderRadius: 8,
    color: 'white',
    fontSize: 12,
    fontFamily: 'inherit',
    boxShadow: designSystem.shadows.large,
  },
  
  // Legend styling
  legend: {
    fontSize: 12,
    fill: designSystem.colors.gray[700],
    fontFamily: 'inherit',
  },
};

/**
 * Common Chart Props
 * Standardized props for consistent chart appearance
 */
export const getChartProps = (type = 'default') => {
  const baseProps = {
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
  };

  const typeSpecificProps = {
    line: {
      strokeWidth: 2,
      dot: { strokeWidth: 2, r: 4 },
      activeDot: { r: 6, strokeWidth: 0 },
    },
    bar: {
      radius: [4, 4, 0, 0],
    },
    area: {
      strokeWidth: 2,
      fillOpacity: 0.6,
    },
    pie: {
      cx: '50%',
      cy: '50%',
      outerRadius: 100,
      innerRadius: 0,
    },
  };

  return {
    ...baseProps,
    ...(typeSpecificProps[type] || {}),
  };
};

/**
 * Chart Action Components
 * Reusable action buttons for charts
 */
export const ChartActions = {
  ExportButton: ({ onClick, loading = false }) => (
    <button
      onClick={onClick}
      disabled={loading}
      className={designSystem.components.button.secondary}
    >
      {loading ? (
        <div className={`${designSystem.animations.spin} w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full`}></div>
      ) : (
        '📊'
      )}
      <span className="ml-2">Export</span>
    </button>
  ),
  
  RefreshButton: ({ onClick, loading = false }) => (
    <button
      onClick={onClick}
      disabled={loading}
      className={designSystem.components.button.secondary}
    >
      <span className={loading ? designSystem.animations.spin : ''}>🔄</span>
      <span className="ml-2">Refresh</span>
    </button>
  ),
  
  FilterButton: ({ onClick, active = false }) => (
    <button
      onClick={onClick}
      className={active ? designSystem.components.button.primary : designSystem.components.button.secondary}
    >
      🔍
      <span className="ml-2">Filter</span>
    </button>
  ),
};

export default ChartWrapper;