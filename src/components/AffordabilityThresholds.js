import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { affordabilityThresholds2024 } from '../data/affordability';
import MortgageStressTestChart from './charts/MortgageStressTestChart';
import AffordabilityGapHeatmap from './charts/AffordabilityGapHeatmap';
import HomeownershipTrendsChart from './charts/HomeownershipTrendsChart';

function AffordabilityThresholds({ selectedRegion = 'Peel Region' }) {
  const [activeTab, setActiveTab] = useState('thresholds');
  
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

  const tabs = [
    { id: 'thresholds', label: 'Affordability Thresholds', icon: '📊' },
    { id: 'stress-test', label: 'Mortgage Stress Test', icon: '🏦' },
    { id: 'heatmap', label: 'Affordability Gap Heatmap', icon: '🔥' },
    { id: 'ownership-trends', label: 'Homeownership Trends', icon: '🏠' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Housing Affordability Analysis</h2>
        <p className="text-gray-600">Comprehensive affordability analysis and stress testing</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center space-x-2 py-3 px-6 font-medium transition-all duration-300
              ${activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'thresholds' ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Income Requirements by Decile</h3>
            <p className="text-gray-600">Maximum affordable house prices by income decile</p>
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
      ) : activeTab === 'stress-test' ? (
        <MortgageStressTestChart selectedRegion={selectedRegion} />
      ) : activeTab === 'heatmap' ? (
        <AffordabilityGapHeatmap />
      ) : (
        <HomeownershipTrendsChart />
      )}
    </div>
  );
}

export default AffordabilityThresholds; 