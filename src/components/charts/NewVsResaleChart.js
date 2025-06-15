import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { housingData } from '../../data/housingData';

function NewVsResaleChart({ selectedRegion }) {
  const [viewMode, setViewMode] = useState('units'); // 'units', 'prices', 'distribution'
  
  const newVsResaleData = housingData.newVsResale[selectedRegion] || [];
  
  // Transform data for different visualizations
  const getChartData = () => {
    // Add error handling for missing data
    if (!newVsResaleData || newVsResaleData.length === 0) {
      return [];
    }
    
    if (viewMode === 'distribution') {
      const totalNew = newVsResaleData.reduce((sum, item) => sum + (item.newUnits || 0), 0);
      const totalResale = newVsResaleData.reduce((sum, item) => sum + (item.resaleUnits || 0), 0);
      const total = totalNew + totalResale;
      
      if (total === 0) return [];
      
      return [
        { 
          name: 'New Homes', 
          value: totalNew, 
          percentage: ((totalNew / total) * 100).toFixed(1) 
        },
        { 
          name: 'Resale Homes', 
          value: totalResale, 
          percentage: ((totalResale / total) * 100).toFixed(1) 
        }
      ];
    }
    
    return newVsResaleData.map(item => {
      const totalUnits = (item.newUnits || 0) + (item.resaleUnits || 0);
      const newPercentage = totalUnits > 0 ? (item.newUnits / totalUnits) * 100 : 0;
      const pricePremium = item.resaleAvgPrice > 0 ? ((item.newAvgPrice - item.resaleAvgPrice) / item.resaleAvgPrice) * 100 : 0;
      
      return {
        type: item.type,
        newUnits: item.newUnits || 0,
        resaleUnits: item.resaleUnits || 0,
        totalUnits: totalUnits,
        newPercentage: newPercentage,
        resalePercentage: 100 - newPercentage,
        newAvgPrice: item.newAvgPrice || 0,
        resaleAvgPrice: item.resaleAvgPrice || 0,
        pricePremium: pricePremium
      };
    });
  };
  
  const chartData = getChartData();
  
  // Calculate summary statistics with error handling
  const totalNewUnits = newVsResaleData.reduce((sum, item) => sum + (item.newUnits || 0), 0);
  const totalResaleUnits = newVsResaleData.reduce((sum, item) => sum + (item.resaleUnits || 0), 0);
  const totalUnits = totalNewUnits + totalResaleUnits;
  const newMarketShare = totalUnits > 0 ? ((totalNewUnits / totalUnits) * 100).toFixed(1) : '0.0';
  
  const avgNewPrice = totalNewUnits > 0 ? 
    newVsResaleData.reduce((sum, item) => sum + ((item.newAvgPrice || 0) * (item.newUnits || 0)), 0) / totalNewUnits : 0;
  const avgResalePrice = totalResaleUnits > 0 ? 
    newVsResaleData.reduce((sum, item) => sum + ((item.resaleAvgPrice || 0) * (item.resaleUnits || 0)), 0) / totalResaleUnits : 0;
  const avgPricePremium = avgResalePrice > 0 ? 
    ((avgNewPrice - avgResalePrice) / avgResalePrice * 100).toFixed(1) : '0.0';
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      if (viewMode === 'distribution') {
        return (
          <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
            <p className="font-bold text-gray-800 mb-2">{data.name}</p>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-gray-600">Units:</span>
                <span className="font-medium ml-2">{data.value.toLocaleString()}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Market Share:</span>
                <span className="font-medium ml-2">{data.percentage}%</span>
              </p>
            </div>
          </div>
        );
      }
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {viewMode === 'units' ? (
              <>
                <p className="text-sm">
                  <span className="text-gray-600">New Units:</span>
                  <span className="font-medium ml-2">{data.newUnits} ({data.newPercentage.toFixed(1)}%)</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Resale Units:</span>
                  <span className="font-medium ml-2">{data.resaleUnits} ({data.resalePercentage.toFixed(1)}%)</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium ml-2">{data.totalUnits} units</span>
                </p>
              </>
            ) : (
              <>
                <p className="text-sm">
                  <span className="text-gray-600">New Avg Price:</span>
                  <span className="font-medium ml-2">${data.newAvgPrice.toLocaleString()}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Resale Avg Price:</span>
                  <span className="font-medium ml-2">${data.resaleAvgPrice.toLocaleString()}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">New Premium:</span>
                  <span className="font-medium ml-2 text-blue-600">+{data.pricePremium.toFixed(1)}%</span>
                </p>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };
  
  const formatCurrency = (value) => `$${(value / 1000).toFixed(0)}k`;
  const formatUnits = (value) => value.toLocaleString();
  
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  const PIE_COLORS = ['#3B82F6', '#10B981'];
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center mb-2">
            <span className="mr-2">🏗️</span>
            New vs Resale Housing Analysis - {selectedRegion}
          </h3>
          <p className="text-sm text-gray-600">
            Market composition and pricing comparison between new construction and resale homes
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 lg:mt-0">
          <button
            onClick={() => setViewMode('units')}
            className={`
              px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
              ${viewMode === 'units'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            Unit Distribution
          </button>
          <button
            onClick={() => setViewMode('prices')}
            className={`
              px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
              ${viewMode === 'prices'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            Price Comparison
          </button>
          <button
            onClick={() => setViewMode('distribution')}
            className={`
              px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
              ${viewMode === 'distribution'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            Market Split
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-gray-500 text-lg">No data available</p>
                <p className="text-gray-400 text-sm">Please check data configuration for {selectedRegion}</p>
              </div>
            </div>
          ) : viewMode === 'distribution' ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="type"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tickFormatter={viewMode === 'units' ? formatUnits : formatCurrency}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {/* Unit Distribution Bars */}
                <Bar 
                  dataKey="newUnits" 
                  stackId={viewMode === 'units' ? "units" : undefined}
                  name="New Construction" 
                  fill={viewMode === 'units' ? "#3B82F6" : "transparent"}
                  radius={viewMode === 'units' ? [0, 0, 0, 0] : [0, 0, 0, 0]}
                  hide={viewMode !== 'units'}
                />
                <Bar 
                  dataKey="resaleUnits" 
                  stackId={viewMode === 'units' ? "units" : undefined}
                  name="Resale" 
                  fill={viewMode === 'units' ? "#10B981" : "transparent"}
                  radius={viewMode === 'units' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  hide={viewMode !== 'units'}
                />
                
                {/* Price Comparison Bars */}
                <Bar 
                  dataKey="newAvgPrice" 
                  name="New Construction Price" 
                  fill={viewMode === 'prices' ? "#3B82F6" : "transparent"}
                  radius={viewMode === 'prices' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  hide={viewMode !== 'prices'}
                />
                <Bar 
                  dataKey="resaleAvgPrice" 
                  name="Resale Price" 
                  fill={viewMode === 'prices' ? "#10B981" : "transparent"}
                  radius={viewMode === 'prices' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  hide={viewMode !== 'prices'}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Summary Statistics */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Market Summary</h4>
          
          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-blue-700 font-medium">New Construction</p>
            <p className="text-2xl font-bold text-blue-800">{newMarketShare}%</p>
            <p className="text-xs text-blue-600">of total sales</p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-green-700 font-medium">Total Units</p>
            <p className="text-2xl font-bold text-green-800">{totalUnits.toLocaleString()}</p>
            <p className="text-xs text-green-600">monthly sales</p>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <p className="text-sm text-purple-700 font-medium">New Premium</p>
            <p className="text-2xl font-bold text-purple-800">+{avgPricePremium}%</p>
            <p className="text-xs text-purple-600">vs resale prices</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
            <p className="text-sm text-gray-700 font-medium">Price Gap</p>
            <p className="text-2xl font-bold text-gray-800">${((avgNewPrice - avgResalePrice) / 1000).toFixed(0)}k</p>
            <p className="text-xs text-gray-600">average difference</p>
          </div>
        </div>
      </div>

      {/* Type Analysis - Only show for units and prices modes */}
      {viewMode !== 'distribution' && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-4">Analysis by Housing Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {chartData.map((item, index) => {
              const isNewDominated = (item.newPercentage || 0) > 50;
              
              return (
                <div
                  key={item.type || index}
                  className={`
                    p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200
                    ${isNewDominated ? 'bg-blue-50' : 'bg-green-50'}
                  `}
                >
                  <h5 className="font-semibold text-gray-800 mb-2">{item.type}</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New:</span>
                      <span className="font-bold text-blue-600">{item.newUnits || 0} units</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Resale:</span>
                      <span className="font-bold text-green-600">{item.resaleUnits || 0} units</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New %:</span>
                      <span className={`text-sm font-medium ${isNewDominated ? 'text-blue-600' : 'text-gray-600'}`}>
                        {(item.newPercentage || 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Premium:</span>
                      <span className="text-sm font-medium text-purple-600">
                        +{(item.pricePremium || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Market Split Analysis - Only show for distribution mode */}
      {viewMode === 'distribution' && chartData.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-4">Market Composition</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chartData.map((item, index) => (
              <div
                key={item.name || index}
                className="p-6 rounded-lg border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-semibold text-gray-800">{item.name}</h5>
                  <div 
                    className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-green-500'}`}
                  ></div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-3xl font-bold text-gray-800">{item.value.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Units</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{item.percentage}%</p>
                    <p className="text-sm text-gray-600">Market Share</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-green-500'}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {viewMode === 'distribution' ? (
          <>
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-semibold text-blue-800 mb-2">Market Composition</h5>
              <p className="text-sm text-blue-600">
                New construction represents {newMarketShare}% of total market sales, 
                while resale homes make up the remaining {(100 - parseFloat(newMarketShare)).toFixed(1)}%.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-semibold text-green-800 mb-2">Market Dynamics</h5>
              <p className="text-sm text-green-600">
                The market shows a {parseFloat(newMarketShare) > 25 ? 'strong' : 'moderate'} presence 
                of new construction, indicating {parseFloat(newMarketShare) > 25 ? 'active development' : 'mature market conditions'}.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h5 className="font-semibold text-purple-800 mb-2">Investment Perspective</h5>
              <p className="text-sm text-purple-600">
                New homes command an average {avgPricePremium}% premium over resale properties, 
                reflecting modern amenities and construction standards.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-semibold text-blue-800 mb-2">New Construction Trends</h5>
              <p className="text-sm text-blue-600">
                New construction represents {newMarketShare}% of sales, with strongest presence in{' '}
                {chartData.length > 0 && chartData[0].newPercentage !== undefined ? 
                  chartData.reduce((prev, current) => 
                    (prev.newPercentage || 0) > (current.newPercentage || 0) ? prev : current
                  ).type?.toLowerCase() || 'various' : 'various'} segment.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-semibold text-green-800 mb-2">Resale Market Dominance</h5>
              <p className="text-sm text-green-600">
                Resale homes dominate overall sales volume, particularly in established neighborhoods 
                with mature housing stock and diverse pricing options.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h5 className="font-semibold text-purple-800 mb-2">Price Premium Analysis</h5>
              <p className="text-sm text-purple-600">
                New homes command an average {avgPricePremium}% premium, reflecting modern features, 
                energy efficiency, and updated building standards.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NewVsResaleChart;