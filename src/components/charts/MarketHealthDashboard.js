import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { 
  priceToIncomeRatios, 
  marketTemperature, 
  supplyDemandMetrics, 
  riskIndicators, 
  marketHealthTrends, 
  marketForecasts, 
  keyPerformanceIndicators 
} from '../../data/marketHealth';

function MarketHealthDashboard() {
  const [selectedRegion, setSelectedRegion] = useState('Peel Region');
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'temperature', 'risk', 'trends', 'forecast'
  
  const regions = Object.keys(marketTemperature);
  
  // Get data based on view mode
  const getChartData = () => {
    switch(viewMode) {
      case 'overview':
        return regions.map(region => ({
          region: region.replace(' Region', ''),
          health: keyPerformanceIndicators.regional[region].health,
          risk: keyPerformanceIndicators.regional[region].risk,
          opportunity: keyPerformanceIndicators.regional[region].opportunity,
          priceToIncome: priceToIncomeRatios[region].ratio,
          temperature: marketTemperature[region].overall
        }));
      case 'temperature':
        const tempData = marketTemperature[selectedRegion];
        return [
          { metric: 'Price Growth', value: tempData.priceGrowth },
          { metric: 'Sales Volume', value: tempData.salesVolume },
          { metric: 'Inventory', value: tempData.inventory },
          { metric: 'Time on Market', value: tempData.timeOnMarket }
        ];
      case 'risk':
        return regions.map(region => ({
          region: region.replace(' Region', ''),
          riskScore: riskIndicators[region].riskScore,
          overvaluation: riskIndicators[region].overvaluation,
          interestSensitivity: riskIndicators[region].interestRateSensitivity,
          priceToIncome: priceToIncomeRatios[region].ratio
        }));
      case 'trends':
        return marketHealthTrends[selectedRegion];
      case 'forecast':
        return regions.map(region => ({
          region: region.replace(' Region', ''),
          forecast: marketForecasts[region].priceGrowthNext12Months,
          confidence: marketForecasts[region].confidence,
          currentGrowth: marketHealthTrends[region][marketHealthTrends[region].length - 1].priceGrowth
        }));
      default:
        return [];
    }
  };
  
  const chartData = getChartData();
  
  // Get risk level color
  const getRiskColor = (risk) => {
    if (risk >= 80) return 'bg-red-600';
    if (risk >= 70) return 'bg-orange-500';
    if (risk >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Get health score color
  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };
  
  // Get temperature status color
  const getTempColor = (status) => {
    switch(status) {
      case 'Very Hot': return 'bg-red-600';
      case 'Hot': return 'bg-orange-500';
      case 'Warm': return 'bg-yellow-500';
      case 'Cool': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-sm">
                <span className="text-gray-600">{entry.name}:</span>
                <span className="font-medium ml-2" style={{ color: entry.color }}>
                  {typeof entry.value === 'number' ? 
                    (entry.name.includes('Growth') || entry.name.includes('forecast') ? 
                      `${entry.value.toFixed(1)}%` : 
                      entry.value.toFixed(1)
                    ) : 
                    entry.value
                  }
                </span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  
  const formatPercent = (value) => `${value}%`;
  const formatNumber = (value) => value.toFixed(1);
  
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center mb-2">
            <span className="mr-2">🏥</span>
            Market Health Indicators Dashboard
          </h3>
          <p className="text-sm text-gray-600">
            Comprehensive market analysis including risk assessment, temperature, and forecasts
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 lg:mt-0">
          {/* View Mode Selection */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('overview')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'overview'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('temperature')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'temperature'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Temperature
            </button>
            <button
              onClick={() => setViewMode('risk')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'risk'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Risk Analysis
            </button>
            <button
              onClick={() => setViewMode('trends')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'trends'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Trends
            </button>
            <button
              onClick={() => setViewMode('forecast')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'forecast'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Forecast
            </button>
          </div>
          
          {/* Region Selection - Always visible, disabled when not applicable */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            disabled={!(viewMode === 'temperature' || viewMode === 'trends')}
            className={`
              min-w-[180px] px-3 py-2 text-sm border rounded-lg transition-all duration-300
              ${(viewMode === 'temperature' || viewMode === 'trends')
                ? 'border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer'
                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{keyPerformanceIndicators.overall.marketHealth}</p>
          <p className="text-sm text-blue-800">Market Health</p>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{keyPerformanceIndicators.overall.affordability}</p>
          <p className="text-sm text-red-800">Affordability</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{keyPerformanceIndicators.overall.sustainability}</p>
          <p className="text-sm text-yellow-800">Sustainability</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{keyPerformanceIndicators.overall.growth}</p>
          <p className="text-sm text-green-800">Growth</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{keyPerformanceIndicators.overall.stability}</p>
          <p className="text-sm text-purple-800">Stability</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={400}>
            {viewMode === 'trends' ? (
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="healthScore" 
                  stroke="#3B82F6" 
                  fill="url(#healthGradient)"
                  name="Health Score"
                />
                <Area 
                  type="monotone" 
                  dataKey="priceGrowth" 
                  stroke="#10B981" 
                  fill="url(#growthGradient)"
                  name="Price Growth (%)"
                />
              </AreaChart>
            ) : viewMode === 'temperature' ? (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="metric"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Temperature Score" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="region"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {/* Overview Bars */}
                <Bar 
                  dataKey="health" 
                  name="Health Score" 
                  fill={viewMode === 'overview' ? "#3B82F6" : "transparent"} 
                  radius={viewMode === 'overview' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  hide={viewMode !== 'overview'}
                />
                <Bar 
                  dataKey="risk" 
                  name="Risk Score" 
                  fill={viewMode === 'overview' ? "#EF4444" : "transparent"} 
                  radius={viewMode === 'overview' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  hide={viewMode !== 'overview'}
                />
                <Bar 
                  dataKey="opportunity" 
                  name="Opportunity Score" 
                  fill={viewMode === 'overview' ? "#10B981" : "transparent"} 
                  radius={viewMode === 'overview' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  hide={viewMode !== 'overview'}
                />
                
                {/* Risk Analysis Bars */}
                <Bar 
                  dataKey="riskScore" 
                  name="Overall Risk Score" 
                  fill={viewMode === 'risk' ? "#EF4444" : "transparent"} 
                  radius={viewMode === 'risk' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  hide={viewMode !== 'risk'}
                />
                <Bar 
                  dataKey="priceToIncome" 
                  name="Price-to-Income Ratio" 
                  fill={viewMode === 'risk' ? "#F59E0B" : "transparent"} 
                  radius={viewMode === 'risk' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  hide={viewMode !== 'risk'}
                />
                
                {/* Forecast Bars */}
                <Bar 
                  dataKey="currentGrowth" 
                  name="Current Growth %" 
                  fill={viewMode === 'forecast' ? "#3B82F6" : "transparent"} 
                  radius={viewMode === 'forecast' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  hide={viewMode !== 'forecast'}
                />
                <Bar 
                  dataKey="forecast" 
                  name="12-Month Forecast %" 
                  fill={viewMode === 'forecast' ? "#10B981" : "transparent"} 
                  radius={viewMode === 'forecast' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  hide={viewMode !== 'forecast'}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Summary Statistics */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Market Summary</h4>
          
          {viewMode === 'overview' && (
            <>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-700 font-medium">Market Leader</p>
                <p className="text-lg font-bold text-blue-800">Mississauga</p>
                <p className="text-xs text-blue-600">Highest health score</p>
              </div>
              
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <p className="text-sm text-red-700 font-medium">Highest Risk</p>
                <p className="text-lg font-bold text-red-800">Mississauga</p>
                <p className="text-xs text-red-600">Risk score: 85</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-green-700 font-medium">Best Opportunity</p>
                <p className="text-lg font-bold text-green-800">Brampton</p>
                <p className="text-xs text-green-600">Opportunity score: 76</p>
              </div>
            </>
          )}
          
          {viewMode === 'temperature' && (
            <>
              <div className={`p-3 rounded-lg border-l-4 ${getTempColor(marketTemperature[selectedRegion].status).replace('bg-', 'border-').replace('600', '500')}`}>
                <p className="text-sm font-medium">Market Status</p>
                <p className="text-lg font-bold">{marketTemperature[selectedRegion].status}</p>
                <p className="text-xs">Overall: {marketTemperature[selectedRegion].overall}/100</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                <p className="text-sm text-gray-700 font-medium">Supply Demand</p>
                <p className="text-lg font-bold text-gray-800">{supplyDemandMetrics[selectedRegion].monthsOfInventory} months</p>
                <p className="text-xs text-gray-600">Inventory supply</p>
              </div>
            </>
          )}
          
          {viewMode === 'risk' && (
            <>
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <p className="text-sm text-red-700 font-medium">Overvaluation Risk</p>
                <p className="text-lg font-bold text-red-800">High</p>
                <p className="text-xs text-red-600">Above sustainable levels</p>
              </div>
              
              <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <p className="text-sm text-orange-700 font-medium">Interest Rate Risk</p>
                <p className="text-lg font-bold text-orange-800">Very High</p>
                <p className="text-xs text-orange-600">Highly leveraged market</p>
              </div>
            </>
          )}
          
          {viewMode === 'trends' && (
            <>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-700 font-medium">Current Health</p>
                <p className="text-2xl font-bold text-blue-800">
                  {marketHealthTrends[selectedRegion][marketHealthTrends[selectedRegion].length - 1].healthScore}
                </p>
                <p className="text-xs text-blue-600">Health score</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-green-700 font-medium">Price Growth</p>
                <p className="text-2xl font-bold text-green-800">
                  {marketHealthTrends[selectedRegion][marketHealthTrends[selectedRegion].length - 1].priceGrowth.toFixed(1)}%
                </p>
                <p className="text-xs text-green-600">Year-over-year</p>
              </div>
            </>
          )}
          
          {viewMode === 'forecast' && (
            <>
              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <p className="text-sm text-purple-700 font-medium">Best Forecast</p>
                <p className="text-lg font-bold text-purple-800">Brampton</p>
                <p className="text-xs text-purple-600">9.1% growth expected</p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <p className="text-sm text-yellow-700 font-medium">Confidence Level</p>
                <p className="text-lg font-bold text-yellow-800">Moderate</p>
                <p className="text-xs text-yellow-600">Market uncertainty</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Regional Breakdown */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-800 mb-4">Regional Market Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map((region) => {
            const regionData = keyPerformanceIndicators.regional[region];
            const tempData = marketTemperature[region];
            const riskData = riskIndicators[region];
            const forecastData = marketForecasts[region];
            
            return (
              <div
                key={region}
                className="p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-semibold text-gray-800">{region.replace(' Region', '')}</h5>
                  <div className={`w-3 h-3 rounded-full ${getTempColor(tempData.status)}`}></div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Health:</span>
                    <span className={`font-bold ${getHealthColor(regionData.health)}`}>
                      {regionData.health}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Risk:</span>
                    <span className="font-bold text-red-600">{regionData.risk}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Temperature:</span>
                    <span className="font-medium text-orange-600">{tempData.status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Forecast:</span>
                    <span className="font-medium text-purple-600">
                      {forecastData.priceGrowthNext12Months.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">P/I Ratio:</span>
                    <span className="font-medium text-gray-800">
                      {priceToIncomeRatios[region].ratio.toFixed(1)}x
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Outlook:</p>
                  <p className="text-sm font-medium text-gray-800">{forecastData.outlook}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-lg p-4">
          <h5 className="font-semibold text-red-800 mb-2">Market Risks</h5>
          <p className="text-sm text-red-600">
            High overvaluation and interest rate sensitivity across all regions pose significant risks. 
            Mississauga shows the highest risk profile with concerning affordability metrics.
          </p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <h5 className="font-semibold text-yellow-800 mb-2">Growth Outlook</h5>
          <p className="text-sm text-yellow-600">
            Price growth expected to moderate but remain elevated. Brampton offers the best growth prospects, 
            while Mississauga faces correction pressure.
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-semibold text-blue-800 mb-2">Investment Strategy</h5>
          <p className="text-sm text-blue-600">
            Market health remains strong but sustainability concerns growing. Diversification across regions 
            and property types recommended to mitigate concentration risk.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MarketHealthDashboard;