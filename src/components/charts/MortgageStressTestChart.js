import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { mortgageStressTestData, interestRateScenarios } from '../../data/affordability';

function MortgageStressTestChart({ selectedRegion }) {
  const [selectedHousingType, setSelectedHousingType] = useState('Detached');
  const [viewMode, setViewMode] = useState('payment'); // 'payment', 'income', 'sensitivity'

  const stressData = mortgageStressTestData[selectedRegion] || [];
  
  const housingTypes = ['Detached', 'Semi-Detached', 'Townhouse', 'Condo'];

  // Transform data for different views
  const getChartData = () => {
    if (viewMode === 'sensitivity') {
      const selectedTypeData = stressData.find(item => item.type === selectedHousingType);
      if (!selectedTypeData) return [];
      
      return interestRateScenarios.map(scenario => ({
        ...scenario,
        qualifyingIncome: Math.round(selectedTypeData.qualifyingIncome * scenario.qualifyingMultiplier),
        monthlyPayment: Math.round(selectedTypeData.currentPayment * scenario.qualifyingMultiplier)
      }));
    }
    
    return stressData.map(item => ({
      type: item.type,
      currentPayment: item.currentPayment,
      stressPayment: item.stressPayment,
      paymentIncrease: item.stressPayment - item.currentPayment,
      currentIncome: item.qualifyingIncome,
      stressIncome: item.stressQualifyingIncome,
      incomeIncrease: item.stressQualifyingIncome - item.qualifyingIncome,
      avgPrice: item.avgPrice,
      downPayment: item.downPayment20
    }));
  };

  const chartData = getChartData();
  

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      if (viewMode === 'sensitivity') {
        return (
          <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
            <p className="font-bold text-gray-800 mb-2">{data.label}</p>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-gray-600">Interest Rate:</span>
                <span className="font-medium ml-2">{data.rate}%</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Required Income:</span>
                <span className="font-medium ml-2">${data.qualifyingIncome.toLocaleString()}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-medium ml-2">${data.monthlyPayment.toLocaleString()}</span>
              </p>
            </div>
          </div>
        );
      }
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {viewMode === 'payment' ? (
              <>
                <p className="text-sm">
                  <span className="text-gray-600">Current Payment:</span>
                  <span className="font-medium ml-2">${(data.currentPayment || 0).toLocaleString()}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Stress Payment:</span>
                  <span className="font-medium ml-2">${(data.stressPayment || 0).toLocaleString()}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Increase:</span>
                  <span className="font-medium ml-2 text-red-600">${(data.paymentIncrease || 0).toLocaleString()}</span>
                </p>
              </>
            ) : viewMode === 'income' ? (
              <>
                <p className="text-sm">
                  <span className="text-gray-600">Current Income Req:</span>
                  <span className="font-medium ml-2">${(data.currentIncome || 0).toLocaleString()}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Stress Income Req:</span>
                  <span className="font-medium ml-2">${(data.stressIncome || 0).toLocaleString()}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Increase:</span>
                  <span className="font-medium ml-2 text-red-600">${(data.incomeIncrease || 0).toLocaleString()}</span>
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-600">Data loading...</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const formatCurrency = (value) => `$${(value / 1000).toFixed(0)}k`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4 lg:mb-0">
          <span className="mr-2">🏦</span>
          Mortgage Stress Test Analysis - {selectedRegion}
        </h3>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* View Mode Selection */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('payment')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'payment'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Payments
            </button>
            <button
              onClick={() => setViewMode('income')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'income'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Income
            </button>
            <button
              onClick={() => setViewMode('sensitivity')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'sensitivity'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Rate Sensitivity
            </button>
          </div>

          {/* Housing Type Selection (for sensitivity analysis) */}
          {viewMode === 'sensitivity' && (
            <div className="flex space-x-2">
              {housingTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedHousingType(type)}
                  className={`
                    px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                    ${selectedHousingType === type
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {type.replace('Semi-', 'Semi')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-gray-500 text-lg">No data available</p>
                <p className="text-gray-400 text-sm">Please check data configuration</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
            {viewMode === 'sensitivity' ? (
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={formatCurrency}
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
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="qualifyingIncome" 
                  fill="#EF4444" 
                  radius={[4, 4, 0, 0]}
                  name="Required Income"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#DC2626" 
                  strokeWidth={3}
                  dot={{ fill: '#DC2626', r: 4 }}
                  name="Interest Rate (%)"
                />
              </ComposedChart>
            ) : (
              <BarChart 
                key={viewMode} 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="type"
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
                
                {/* Payment Bars */}
                <Bar 
                  dataKey="currentPayment" 
                  fill={viewMode === 'payment' ? "#3B82F6" : "transparent"} 
                  name="Current Payment"
                  hide={viewMode !== 'payment'}
                />
                <Bar 
                  dataKey="stressPayment" 
                  fill={viewMode === 'payment' ? "#EF4444" : "transparent"} 
                  name="Stress Test Payment"
                  hide={viewMode !== 'payment'}
                />
                
                {/* Income Bars */}
                <Bar 
                  dataKey="currentIncome" 
                  fill={viewMode === 'income' ? "#10B981" : "transparent"} 
                  name="Current Income Required"
                  hide={viewMode !== 'income'}
                />
                <Bar 
                  dataKey="stressIncome" 
                  fill={viewMode === 'income' ? "#EF4444" : "transparent"} 
                  name="Stress Test Income Required"
                  hide={viewMode !== 'income'}
                />
              </BarChart>
            )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Summary Statistics */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Impact Analysis</h4>
          
          {viewMode !== 'sensitivity' && chartData.length > 0 && (
            <>
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <p className="text-sm text-red-700 font-medium">
                  {viewMode === 'payment' ? 'Avg Payment Increase' : 'Avg Income Increase'}
                </p>
                <p className="text-2xl font-bold text-red-800">
                  ${viewMode === 'payment' 
                    ? Math.round(chartData.reduce((sum, item) => sum + item.paymentIncrease, 0) / chartData.length).toLocaleString()
                    : Math.round(chartData.reduce((sum, item) => sum + item.incomeIncrease, 0) / chartData.length).toLocaleString()
                  }
                </p>
                <p className="text-xs text-red-600">
                  Under stress test
                </p>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <p className="text-sm text-orange-700 font-medium">Most Impacted</p>
                <p className="text-lg font-bold text-orange-800">
                  {viewMode === 'payment' 
                    ? chartData.reduce((prev, current) => (prev.paymentIncrease > current.paymentIncrease) ? prev : current).type
                    : chartData.reduce((prev, current) => (prev.incomeIncrease > current.incomeIncrease) ? prev : current).type
                  }
                </p>
                <p className="text-xs text-orange-600">
                  Highest increase
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-700 font-medium">Stress Test Rate</p>
                <p className="text-2xl font-bold text-blue-800">7.25%</p>
                <p className="text-xs text-blue-600">
                  vs 5.25% current
                </p>
              </div>
            </>
          )}

          {viewMode === 'sensitivity' && (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <p className="text-sm text-red-700 font-medium">Crisis Scenario</p>
                <p className="text-lg font-bold text-red-800">
                  {chartData.find(d => d.rate === 9.0)?.qualifyingIncome.toLocaleString()}
                </p>
                <p className="text-xs text-red-600">
                  Required income at 9%
                </p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-green-700 font-medium">Historic Low</p>
                <p className="text-lg font-bold text-green-800">
                  {chartData.find(d => d.rate === 4.0)?.qualifyingIncome.toLocaleString()}
                </p>
                <p className="text-xs text-green-600">
                  Required income at 4%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-lg p-4">
          <h5 className="font-semibold text-red-800 mb-1">Risk Level</h5>
          <p className="text-sm text-red-600">
            {viewMode === 'payment' && chartData.length > 0 && 
             chartData.reduce((sum, item) => sum + item.paymentIncrease, 0) / chartData.length > 2000 
              ? 'High Impact' 
              : 'Moderate Impact'
            }
          </p>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <h5 className="font-semibold text-orange-800 mb-1">Buyer Impact</h5>
          <p className="text-sm text-orange-600">
            Reduced purchasing power under stress test
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-semibold text-blue-800 mb-1">Market Health</h5>
          <p className="text-sm text-blue-600">
            Stress test ensures borrower protection
          </p>
        </div>
      </div>
    </div>
  );
}

export default MortgageStressTestChart;