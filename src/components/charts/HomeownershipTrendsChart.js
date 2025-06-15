import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { homeownershipTrends } from '../../data/affordability';

function HomeownershipTrendsChart() {
  const [selectedRegion, setSelectedRegion] = useState('Peel Region');
  const [viewMode, setViewMode] = useState('rates'); // 'rates', 'gap', 'first-time'
  
  const regions = Object.keys(homeownershipTrends);
  const trendsData = homeownershipTrends[selectedRegion] || [];
  
  // Transform data based on view mode
  const getChartData = () => {
    if (viewMode === 'gap') {
      return trendsData.map(item => ({
        ...item,
        gap: item.target - item.rate,
        gapTrend: item.target - item.rate > 0 ? 'Below Target' : 'Above Target'
      }));
    }
    
    if (viewMode === 'first-time') {
      return trendsData.map(item => ({
        ...item,
        firstTimeBuyerGap: item.rate - item.firstTimeBuyers,
      }));
    }
    
    return trendsData;
  };
  
  const chartData = getChartData();
  
  // Calculate statistics
  const currentRate = chartData[chartData.length - 1]?.rate || 0;
  const currentTarget = chartData[chartData.length - 1]?.target || 0;
  const rateChange = chartData.length > 1 ? 
    chartData[chartData.length - 1].rate - chartData[0].rate : 0;
  const avgGap = chartData.reduce((sum, item) => sum + (item.target - item.rate), 0) / chartData.length;
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {viewMode === 'rates' && (
              <>
                <p className="text-sm">
                  <span className="text-gray-600">Actual Rate:</span>
                  <span className="font-medium ml-2">{data.rate}%</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Target Rate:</span>
                  <span className="font-medium ml-2">{data.target}%</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Gap:</span>
                  <span className={`font-medium ml-2 ${data.target - data.rate > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {data.target - data.rate > 0 ? '-' : '+'}{Math.abs(data.target - data.rate).toFixed(1)}%
                  </span>
                </p>
              </>
            )}
            
            {viewMode === 'gap' && (
              <>
                <p className="text-sm">
                  <span className="text-gray-600">Target Gap:</span>
                  <span className={`font-medium ml-2 ${data.gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {data.gap.toFixed(1)}%
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium ml-2">{data.gapTrend}</span>
                </p>
              </>
            )}
            
            {viewMode === 'first-time' && (
              <>
                <p className="text-sm">
                  <span className="text-gray-600">Overall Rate:</span>
                  <span className="font-medium ml-2">{data.rate}%</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">First-time Buyers:</span>
                  <span className="font-medium ml-2">{data.firstTimeBuyers}%</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Difference:</span>
                  <span className="font-medium ml-2">{data.firstTimeBuyerGap.toFixed(1)}%</span>
                </p>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };
  
  const formatPercent = (value) => `${value}%`;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center mb-2">
            <span className="mr-2">🏠</span>
            Homeownership Rate Trends
          </h3>
          <p className="text-sm text-gray-600">
            Historical trends and target comparisons across regions
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 lg:mt-0">
          {/* View Mode Selection */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('rates')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'rates'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Rates vs Target
            </button>
            <button
              onClick={() => setViewMode('gap')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'gap'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Target Gap
            </button>
            <button
              onClick={() => setViewMode('first-time')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'first-time'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              First-time Buyers
            </button>
          </div>
          
          {/* Region Selection */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={400}>
            {viewMode === 'gap' ? (
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="year"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tickFormatter={formatPercent}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  domain={[0, 'dataMax + 1']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  dataKey="gap" 
                  name="Target Gap" 
                  fill="#EF4444" 
                  fillOpacity={0.3}
                  stroke="#DC2626" 
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="year"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tickFormatter={formatPercent}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {/* Rates vs Target Lines */}
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke={viewMode === 'rates' ? "#3B82F6" : "transparent"}
                  strokeWidth={3}
                  dot={{ fill: viewMode === 'rates' ? '#3B82F6' : 'transparent', r: viewMode === 'rates' ? 4 : 0 }}
                  name="Actual Rate"
                  hide={viewMode !== 'rates'}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke={viewMode === 'rates' ? "#EF4444" : "transparent"}
                  strokeWidth={2}
                  strokeDasharray={viewMode === 'rates' ? "5 5" : "0"}
                  dot={{ fill: viewMode === 'rates' ? '#EF4444' : 'transparent', r: viewMode === 'rates' ? 3 : 0 }}
                  name="Target Rate"
                  hide={viewMode !== 'rates'}
                />
                
                {/* First-time Buyers Lines */}
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke={viewMode === 'first-time' ? "#3B82F6" : "transparent"}
                  strokeWidth={3}
                  dot={{ fill: viewMode === 'first-time' ? '#3B82F6' : 'transparent', r: viewMode === 'first-time' ? 4 : 0 }}
                  name="Overall Rate"
                  hide={viewMode !== 'first-time'}
                />
                <Line 
                  type="monotone" 
                  dataKey="firstTimeBuyers" 
                  stroke={viewMode === 'first-time' ? "#10B981" : "transparent"}
                  strokeWidth={2}
                  dot={{ fill: viewMode === 'first-time' ? '#10B981' : 'transparent', r: viewMode === 'first-time' ? 3 : 0 }}
                  name="First-time Buyers"
                  hide={viewMode !== 'first-time'}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Summary Statistics */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Performance Summary</h4>
          
          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-blue-700 font-medium">Current Rate</p>
            <p className="text-2xl font-bold text-blue-800">{currentRate}%</p>
            <p className="text-xs text-blue-600">2024 actual</p>
          </div>
          
          <div className={`p-3 rounded-lg border-l-4 ${
            currentRate >= currentTarget ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
          }`}>
            <p className={`text-sm font-medium ${
              currentRate >= currentTarget ? 'text-green-700' : 'text-red-700'
            }`}>
              Target {currentRate >= currentTarget ? 'Met' : 'Gap'}
            </p>
            <p className={`text-2xl font-bold ${
              currentRate >= currentTarget ? 'text-green-800' : 'text-red-800'
            }`}>
              {Math.abs(currentTarget - currentRate).toFixed(1)}%
            </p>
            <p className={`text-xs ${
              currentRate >= currentTarget ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentRate >= currentTarget ? 'Above target' : 'Below target'}
            </p>
          </div>
          
          <div className={`p-3 rounded-lg border-l-4 ${
            rateChange >= 0 ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
          }`}>
            <p className={`text-sm font-medium ${
              rateChange >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              Trend (2019-2024)
            </p>
            <p className={`text-2xl font-bold ${
              rateChange >= 0 ? 'text-green-800' : 'text-red-800'
            }`}>
              {rateChange >= 0 ? '+' : ''}{rateChange.toFixed(1)}%
            </p>
            <p className={`text-xs ${
              rateChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {rateChange >= 0 ? 'Increasing' : 'Declining'}
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
            <p className="text-sm text-gray-700 font-medium">Avg Gap</p>
            <p className="text-2xl font-bold text-gray-800">{avgGap.toFixed(1)}%</p>
            <p className="text-xs text-gray-600">Historical average</p>
          </div>
        </div>
      </div>

      {/* Regional Comparison */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-800 mb-4">Regional Comparison (2024)</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {regions.map(region => {
            const regionData = homeownershipTrends[region];
            const latest = regionData[regionData.length - 1];
            const isSelected = region === selectedRegion;
            const isAboveTarget = latest.rate >= latest.target;
            
            return (
              <div
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`
                  p-4 rounded-lg cursor-pointer transition-all duration-200 border-2
                  ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}
                `}
              >
                <h5 className="font-semibold text-gray-800 mb-2">{region.replace(' Region', '')}</h5>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rate:</span>
                    <span className="font-bold text-gray-800">{latest.rate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Target:</span>
                    <span className="font-medium text-gray-700">{latest.target}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      isAboveTarget ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isAboveTarget ? 'On Track' : 'Behind'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-lg p-4">
          <h5 className="font-semibold text-red-800 mb-2">Declining Trend</h5>
          <p className="text-sm text-red-600">
            All regions showing declining homeownership rates, with targets becoming increasingly difficult to achieve.
          </p>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <h5 className="font-semibold text-orange-800 mb-2">First-time Buyer Challenge</h5>
          <p className="text-sm text-orange-600">
            First-time buyer participation dropping significantly, indicating barriers to market entry.
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-semibold text-blue-800 mb-2">Policy Impact</h5>
          <p className="text-sm text-blue-600">
            Growing gap between targets and reality suggests need for policy intervention and affordability measures.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomeownershipTrendsChart;