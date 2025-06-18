import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from 'recharts';
import apiService from '../../services/api';

function MarketTrendsChart({ selectedRegion, selectedHousingType }) {
  const [metricsPair, setMetricsPair] = useState('price-volume');
  const [trendsData, setTrendsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendsData = async () => {
      try {
        setLoading(true);
        
        // Get region ID
        const regionMap = {
          'Peel Region': 1,
          'Mississauga': 2,
          'Brampton': 3,
          'Caledon': 4
        };
        const regionId = regionMap[selectedRegion] || 1;
        
        // Get housing type ID
        const housingTypeMap = {
          'All Types': 1,
          'Detached': 2,
          'Semi-Detached': 3,
          'Townhouse': 4,
          'Condo': 5
        };
        const housingTypeId = housingTypeMap[selectedHousingType] || 2;

        // Fetch price trends data
        const response = await apiService.getPriceTrendsDetailed(regionId, housingTypeId, 12);
        
        // Transform API data to chart format with calculated indexes
        const chartData = response.data.map((item, index) => {
          const basePrice = response.data[0]?.avg_price || 1000000;
          const baseSales = response.data[0]?.sales_count || 100;
          
          return {
            month: new Date(item.month + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            priceIndex: (parseFloat(item.avg_price) / basePrice) * 100,
            salesIndex: (parseInt(item.sales_count) / baseSales) * 100,
            affordabilityIndex: Math.max(50, 120 - (parseFloat(item.avg_price) / 10000)), // Inverse of price
            listToSaleRatio: 95 + Math.random() * 10 // Placeholder - would come from market health data
          };
        });

        setTrendsData(chartData);
      } catch (error) {
        console.error('Error loading trends data:', error);
        // Fallback data if API fails
        setTrendsData([
          { month: 'Jan 2024', priceIndex: 100, salesIndex: 100, affordabilityIndex: 85, listToSaleRatio: 97.5 },
          { month: 'Feb 2024', priceIndex: 102, salesIndex: 105, affordabilityIndex: 83, listToSaleRatio: 98.2 },
          { month: 'Mar 2024', priceIndex: 105, salesIndex: 95, affordabilityIndex: 80, listToSaleRatio: 99.1 },
          { month: 'Apr 2024', priceIndex: 108, salesIndex: 110, affordabilityIndex: 78, listToSaleRatio: 98.8 },
          { month: 'May 2024', priceIndex: 110, salesIndex: 115, affordabilityIndex: 76, listToSaleRatio: 99.5 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTrendsData();
  }, [selectedRegion, selectedHousingType]);

  const metricsPairs = {
    'price-volume': {
      title: 'Price & Sales Volume Trends',
      leftMetric: 'priceIndex',
      leftName: 'Average Price Index',
      leftColor: '#3B82F6',
      rightMetric: 'salesIndex',
      rightName: 'Sales Volume Index',
      rightColor: '#8B5CF6',
      showArea: true,
    },
    'affordability-ratio': {
      title: 'Affordability & List-to-Sale Ratio',
      leftMetric: 'affordabilityIndex',
      leftName: 'Affordability Index',
      leftColor: '#10B981',
      rightMetric: 'listToSaleRatio',
      rightName: 'List-to-Sale Ratio (%)',
      rightColor: '#F59E0B',
      showArea: false,
    },
  };

  const activeMetrics = metricsPairs[metricsPair];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading market trends...</span>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium">{entry.value.toFixed(1)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          {activeMetrics.title}
        </h3>
        <div className="flex space-x-2">
          {Object.entries(metricsPairs).map(([key, value]) => (
            <button
              key={key}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${
                  metricsPair === key
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              onClick={() => setMetricsPair(key)}
            >
              {key === 'price-volume'
                ? 'Price & Volume'
                : 'Affordability & Ratio'}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={trendsData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorLeft" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={activeMetrics.leftColor}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={activeMetrics.leftColor}
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="colorRight" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={activeMetrics.rightColor}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={activeMetrics.rightColor}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />

          {activeMetrics.showArea && (
            <Area
              yAxisId="left"
              type="monotone"
              dataKey={activeMetrics.leftMetric}
              stroke="none"
              fillOpacity={1}
              fill="url(#colorLeft)"
            />
          )}

          <Line
            yAxisId="left"
            type="monotone"
            dataKey={activeMetrics.leftMetric}
            name={activeMetrics.leftName}
            stroke={activeMetrics.leftColor}
            strokeWidth={3}
            dot={{ fill: activeMetrics.leftColor, r: 4 }}
            activeDot={{ r: 6, className: 'animate-pulse' }}
          />

          <Bar
            yAxisId="right"
            dataKey={activeMetrics.rightMetric}
            name={activeMetrics.rightName}
            fill={activeMetrics.rightColor}
            radius={[8, 8, 0, 0]}
            opacity={0.8}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MarketTrendsChart;
