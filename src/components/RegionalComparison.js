import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { getRegionalComparisonData } from '../data/housingData';

function RegionalComparison({ selectedHousingType }) {
  const [selectedMetric, setSelectedMetric] = useState('averagePrice');

  const metrics = [
    { id: 'averagePrice', name: 'Average Price', icon: '💰', color: '#3B82F6' },
    {
      id: 'pricePerSqFt',
      name: 'Price per Sq Ft',
      icon: '📐',
      color: '#8B5CF6',
    },
    {
      id: 'daysOnMarket',
      name: 'Days on Market',
      icon: '📅',
      color: '#F59E0B',
    },
    {
      id: 'absorptionRate',
      name: 'Absorption Rate',
      icon: '📊',
      color: '#10B981',
    },
  ];

  const data = getRegionalComparisonData(selectedMetric, selectedHousingType);
  const currentMetric = metrics.find(m => m.id === selectedMetric);
  const isHigherBetter = selectedMetric !== 'daysOnMarket';

  // Format values for display
  const formatValue = value => {
    switch (selectedMetric) {
      case 'averagePrice':
        return `$${(value / 1000000).toFixed(2)}M`;
      case 'pricePerSqFt':
        return `$${value}`;
      case 'daysOnMarket':
        return `${value} days`;
      case 'absorptionRate':
        return `${value}%`;
      default:
        return value;
    }
  };

  // Custom tooltip with enhanced styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const regionValue = payload[0].value;
      const ontarioAvg = data.find(d => d.name === label)?.ontarioAverage || 0;
      const difference = regionValue - ontarioAvg;
      const percentDiff = ((difference / ontarioAvg) * 100).toFixed(1);

      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Region Value:</span>
              <span className="font-medium">{formatValue(regionValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ontario Avg:</span>
              <span className="font-medium">{formatValue(ontarioAvg)}</span>
            </div>
            <div
              className={`flex justify-between items-center pt-2 border-t ${
                (difference > 0 && isHigherBetter) ||
                (difference < 0 && !isHigherBetter)
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              <span className="text-sm font-medium">Difference:</span>
              <span className="font-bold">
                {difference > 0 ? '+' : ''}
                {percentDiff}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Get bar colors based on performance
  const getBarColor = (value, ontarioAvg) => {
    const difference = value - ontarioAvg;
    if (
      (difference > 0 && isHigherBetter) ||
      (difference < 0 && !isHigherBetter)
    ) {
      return '#10B981'; // Green for better performance
    }
    return '#EF4444'; // Red for worse performance
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Regional Comparison
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Compare {selectedHousingType} across regions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {metrics.map(metric => (
            <button
              key={metric.id}
              className={`
                flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg
                transition-all duration-300 transform hover:scale-105
                ${
                  selectedMetric === metric.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              onClick={() => setSelectedMetric(metric.id)}
            >
              <span className="text-lg">{metric.icon}</span>
              <span className="hidden sm:inline">{metric.name}</span>
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
          layout="vertical"
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop
                offset="5%"
                stopColor={currentMetric.color}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={currentMetric.color}
                stopOpacity={0.6}
              />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            tickFormatter={formatValue}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />

          <Bar dataKey="value" name="Regional Values" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.value, entry.ontarioAverage)}
              />
            ))}
          </Bar>

          <Bar
            dataKey="ontarioAverage"
            name="Ontario Average"
            fill="#9CA3AF"
            opacity={0.7}
            radius={[0, 8, 8, 0]}
          />

          <ReferenceLine
            x={data.length > 0 ? data[0].ontarioAverage : 0}
            stroke="#9CA3AF"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: 'Ontario Avg',
              position: 'topRight',
              fill: '#9CA3AF',
              fontSize: 12,
              fontWeight: 'bold',
            }}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Color Legend */}
      <div className="mt-4 mb-6 flex justify-center">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-700">
              {isHigherBetter
                ? 'Above Ontario Average'
                : 'Below Ontario Average'}{' '}
              (Better)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-700">
              {isHigherBetter
                ? 'Below Ontario Average'
                : 'Above Ontario Average'}{' '}
              (Worse)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-gray-400 rounded"></div>
            <span className="text-gray-700">Ontario Average</span>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Performance Summary
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.map(region => {
            const diff = (
              ((region.value - region.ontarioAverage) / region.ontarioAverage) *
              100
            ).toFixed(1);
            const isPositive =
              (diff > 0 && isHigherBetter) || (diff < 0 && !isHigherBetter);

            return (
              <div key={region.name} className="text-center">
                <p className="text-xs text-gray-600">{region.name}</p>
                <p
                  className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                >
                  {diff > 0 ? '+' : ''}
                  {diff}%
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RegionalComparison;
