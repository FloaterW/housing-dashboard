import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { affordabilityThresholds2024 } from '../data/affordability';

function AffordabilityThresholds() {
  // Transform data for Recharts
  const chartData = affordabilityThresholds2024.map(([decile, income, housePrice]) => ({
    decile: `D${decile}`,
    income: income / 1000, // Convert to thousands for better display
    maxHousePrice: housePrice / 1000, // Convert to thousands
  }));

  const formatCurrency = (value) => `$${value}k`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const decileNum = label.replace('D', '');
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">Decile {decileNum}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Min Income:</span>
              <span className="font-medium ml-2">${(payload[0].value * 1000).toLocaleString()}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Max House Price:</span>
              <span className="font-medium ml-2">${(payload[1].value * 1000).toLocaleString()}</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Ratio: {(payload[1].value / payload[0].value).toFixed(1)}x
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Housing Affordability Thresholds 2024</h2>
        <p className="text-gray-600">Income requirements and maximum affordable house prices by decile</p>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="decile" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="income" 
              name="Minimum Income" 
              fill="#3B82F6" 
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="maxHousePrice" 
              name="Max House Price" 
              fill="#8B5CF6" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-1">Lowest Threshold</h4>
          <p className="text-sm text-blue-600">
            Decile 1: $35k income → $150k house
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-semibold text-purple-800 mb-1">Median Threshold</h4>
          <p className="text-sm text-purple-600">
            Decile 5-6: $75-85k income → $350-425k house
          </p>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4">
          <h4 className="font-semibold text-indigo-800 mb-1">Highest Threshold</h4>
          <p className="text-sm text-indigo-600">
            Decile 10: $160k income → $950k house
          </p>
        </div>
      </div>
    </div>
  );
}

export default AffordabilityThresholds; 