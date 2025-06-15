import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter } from 'recharts';
import { rentalYieldData } from '../../data/rental';

function RentalYieldAnalysisChart() {
  const [selectedRegion, setSelectedRegion] = useState('Peel Region');
  const [viewMode, setViewMode] = useState('yields'); // 'yields', 'cashflow', 'comparison', 'roi'
  const [investmentAmount, setInvestmentAmount] = useState(200000); // Down payment
  
  const regions = Object.keys(rentalYieldData);
  const yieldData = rentalYieldData[selectedRegion] || [];
  
  // Calculate additional investment metrics
  const getInvestmentData = () => {
    return yieldData.map(item => {
      const downPaymentRatio = 0.20; // 20% down payment
      const downPayment = item.avgPrice * downPaymentRatio;
      const mortgageAmount = item.avgPrice - downPayment;
      const mortgageRate = 0.0525; // 5.25% interest rate
      const monthlyMortgagePayment = (mortgageAmount * mortgageRate / 12) / (1 - Math.pow(1 + mortgageRate / 12, -300)); // 25 year amortization
      
      const monthlyRent = item.avgRent;
      const monthlyExpenses = monthlyRent * 0.30; // 30% of rent for expenses (property tax, insurance, maintenance, vacancy)
      const monthlyNetIncome = monthlyRent - monthlyExpenses;
      const monthlyCashFlow = monthlyNetIncome - monthlyMortgagePayment;
      
      const annualRent = monthlyRent * 12;
      const annualExpenses = monthlyExpenses * 12;
      const annualNetIncome = annualRent - annualExpenses;
      const annualMortgagePayment = monthlyMortgagePayment * 12;
      const annualCashFlow = annualNetIncome - annualMortgagePayment;
      
      const cashOnCashReturn = (annualCashFlow / downPayment) * 100;
      const capRate = (annualNetIncome / item.avgPrice) * 100;
      const rentToPrice = (monthlyRent / item.avgPrice) * 100;
      
      return {
        ...item,
        downPayment,
        mortgageAmount,
        monthlyMortgagePayment,
        monthlyExpenses,
        monthlyNetIncome,
        monthlyCashFlow,
        annualCashFlow,
        cashOnCashReturn,
        capRate,
        rentToPrice,
        breakEvenRatio: (monthlyMortgagePayment + monthlyExpenses) / monthlyRent
      };
    });
  };
  
  const investmentData = getInvestmentData();
  
  // Get chart data based on view mode
  const getChartData = () => {
    switch(viewMode) {
      case 'yields':
        return investmentData.map(item => ({
          type: item.type,
          grossYield: item.grossYield,
          netYield: item.netYield,
          capRate: item.capRate
        }));
      case 'cashflow':
        return investmentData.map(item => ({
          type: item.type,
          monthlyRent: item.avgRent,
          monthlyExpenses: item.monthlyExpenses,
          monthlyMortgage: item.monthlyMortgagePayment,
          monthlyCashFlow: item.monthlyCashFlow
        }));
      case 'comparison':
        return regions.map(region => {
          const regionData = rentalYieldData[region];
          const avgGrossYield = regionData.reduce((sum, item) => sum + item.grossYield, 0) / regionData.length;
          const avgNetYield = regionData.reduce((sum, item) => sum + item.netYield, 0) / regionData.length;
          const avgPrice = regionData.reduce((sum, item) => sum + item.avgPrice, 0) / regionData.length;
          const avgRent = regionData.reduce((sum, item) => sum + item.avgRent, 0) / regionData.length;
          
          return {
            region: region.replace(' Region', ''),
            grossYield: avgGrossYield,
            netYield: avgNetYield,
            avgPrice: avgPrice / 1000, // Convert to thousands
            avgRent: avgRent
          };
        });
      case 'roi':
        return investmentData.map(item => ({
          type: item.type,
          x: item.avgPrice / 1000, // Price in thousands
          y: item.cashOnCashReturn,
          capRate: item.capRate,
          rentToPrice: item.rentToPrice
        }));
      default:
        return investmentData;
    }
  };
  
  const chartData = getChartData();
  
  // Calculate summary statistics
  const avgGrossYield = investmentData.reduce((sum, item) => sum + item.grossYield, 0) / investmentData.length;
  const avgNetYield = investmentData.reduce((sum, item) => sum + item.netYield, 0) / investmentData.length;
  const avgCashFlow = investmentData.reduce((sum, item) => sum + item.monthlyCashFlow, 0) / investmentData.length;
  const bestCashFlow = investmentData.reduce((prev, current) => 
    prev.monthlyCashFlow > current.monthlyCashFlow ? prev : current
  );
  const bestYield = investmentData.reduce((prev, current) => 
    prev.grossYield > current.grossYield ? prev : current
  );
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {viewMode === 'yields' && (
              <>
                <p className="text-sm">
                  <span className="text-gray-600">Gross Yield:</span>
                  <span className="font-medium ml-2">{data.grossYield}%</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Net Yield:</span>
                  <span className="font-medium ml-2">{data.netYield}%</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Cap Rate:</span>
                  <span className="font-medium ml-2">{data.capRate?.toFixed(1)}%</span>
                </p>
              </>
            )}
            
            {viewMode === 'cashflow' && (
              <>
                <p className="text-sm">
                  <span className="text-gray-600">Monthly Rent:</span>
                  <span className="font-medium ml-2">${data.monthlyRent?.toLocaleString()}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Monthly Expenses:</span>
                  <span className="font-medium ml-2 text-red-600">-${data.monthlyExpenses?.toLocaleString()}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Mortgage Payment:</span>
                  <span className="font-medium ml-2 text-red-600">-${data.monthlyMortgage?.toLocaleString()}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Net Cash Flow:</span>
                  <span className={`font-medium ml-2 ${data.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${data.monthlyCashFlow?.toLocaleString()}
                  </span>
                </p>
              </>
            )}
            
            {viewMode === 'comparison' && (
              <>
                <p className="text-sm">
                  <span className="text-gray-600">Gross Yield:</span>
                  <span className="font-medium ml-2">{data.grossYield?.toFixed(1)}%</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Net Yield:</span>
                  <span className="font-medium ml-2">{data.netYield?.toFixed(1)}%</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Avg Price:</span>
                  <span className="font-medium ml-2">${(data.avgPrice * 1000).toLocaleString()}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Avg Rent:</span>
                  <span className="font-medium ml-2">${data.avgRent?.toLocaleString()}</span>
                </p>
              </>
            )}
            
            {viewMode === 'roi' && (
              <>
                <p className="text-sm">
                  <span className="text-gray-600">Property Price:</span>
                  <span className="font-medium ml-2">${(data.x * 1000).toLocaleString()}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Cash-on-Cash Return:</span>
                  <span className="font-medium ml-2">{data.y?.toFixed(1)}%</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Cap Rate:</span>
                  <span className="font-medium ml-2">{data.capRate?.toFixed(1)}%</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Rent-to-Price:</span>
                  <span className="font-medium ml-2">{data.rentToPrice?.toFixed(2)}%</span>
                </p>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };
  
  const formatCurrency = (value) => `$${value?.toLocaleString() || 0}`;
  const formatPercent = (value) => `${value}%`;
  
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center mb-2">
            <span className="mr-2">💰</span>
            Rental Yield Investment Analysis
          </h3>
          <p className="text-sm text-gray-600">
            Comprehensive investment analysis including yields, cash flow, and ROI metrics
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 lg:mt-0">
          {/* View Mode Selection */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('yields')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'yields'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Yields
            </button>
            <button
              onClick={() => setViewMode('cashflow')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'cashflow'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Cash Flow
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'comparison'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Regional
            </button>
            <button
              onClick={() => setViewMode('roi')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'roi'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              ROI Analysis
            </button>
          </div>
          
          {/* Region Selection */}
          {viewMode !== 'comparison' && (
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={400}>
            {viewMode === 'roi' ? (
              <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number"
                  dataKey="x"
                  domain={['dataMin - 50', 'dataMax + 50']}
                  name="Property Price"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => `$${value}k`}
                  label={{ value: 'Property Price (thousands)', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number"
                  dataKey="y"
                  name="Cash-on-Cash Return"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={formatPercent}
                  label={{ value: 'Cash-on-Cash Return (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Scatter 
                  data={chartData} 
                  fill="#3B82F6"
                />
              </ScatterChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey={viewMode === 'comparison' ? 'region' : 'type'}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tickFormatter={viewMode === 'cashflow' ? formatCurrency : formatPercent}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {/* Yield Bars */}
                <Bar 
                  dataKey="grossYield" 
                  name="Gross Yield" 
                  fill={viewMode === 'yields' ? "#3B82F6" : "transparent"}
                  hide={viewMode !== 'yields'}
                />
                <Bar 
                  dataKey="netYield" 
                  name="Net Yield" 
                  fill={viewMode === 'yields' ? "#10B981" : "transparent"}
                  hide={viewMode !== 'yields'}
                />
                <Bar 
                  dataKey="capRate" 
                  name="Cap Rate" 
                  fill={viewMode === 'yields' ? "#F59E0B" : "transparent"}
                  hide={viewMode !== 'yields'}
                />
                
                {/* Cash Flow Bars */}
                <Bar 
                  dataKey="monthlyRent" 
                  name="Monthly Rent" 
                  fill={viewMode === 'cashflow' ? "#10B981" : "transparent"}
                  hide={viewMode !== 'cashflow'}
                />
                <Bar 
                  dataKey="monthlyExpenses" 
                  name="Monthly Expenses" 
                  fill={viewMode === 'cashflow' ? "#EF4444" : "transparent"}
                  hide={viewMode !== 'cashflow'}
                />
                <Bar 
                  dataKey="monthlyMortgage" 
                  name="Mortgage Payment" 
                  fill={viewMode === 'cashflow' ? "#F59E0B" : "transparent"}
                  hide={viewMode !== 'cashflow'}
                />
                <Bar 
                  dataKey="monthlyCashFlow" 
                  name="Net Cash Flow" 
                  fill={viewMode === 'cashflow' ? "#3B82F6" : "transparent"}
                  hide={viewMode !== 'cashflow'}
                />
                
                {/* Comparison Bars */}
                <Bar 
                  dataKey="grossYield" 
                  name="Gross Yield" 
                  fill={viewMode === 'comparison' ? "#3B82F6" : "transparent"}
                  hide={viewMode !== 'comparison'}
                />
                <Bar 
                  dataKey="netYield" 
                  name="Net Yield" 
                  fill={viewMode === 'comparison' ? "#10B981" : "transparent"}
                  hide={viewMode !== 'comparison'}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Summary Statistics */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Investment Summary</h4>
          
          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-blue-700 font-medium">Avg Gross Yield</p>
            <p className="text-2xl font-bold text-blue-800">{avgGrossYield.toFixed(1)}%</p>
            <p className="text-xs text-blue-600">Before expenses</p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-green-700 font-medium">Avg Net Yield</p>
            <p className="text-2xl font-bold text-green-800">{avgNetYield.toFixed(1)}%</p>
            <p className="text-xs text-green-600">After expenses</p>
          </div>
          
          <div className={`p-3 rounded-lg border-l-4 ${
            avgCashFlow >= 0 ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
          }`}>
            <p className={`text-sm font-medium ${
              avgCashFlow >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              Avg Cash Flow
            </p>
            <p className={`text-2xl font-bold ${
              avgCashFlow >= 0 ? 'text-green-800' : 'text-red-800'
            }`}>
              ${avgCashFlow.toFixed(0)}
            </p>
            <p className={`text-xs ${
              avgCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              per month
            </p>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <p className="text-sm text-purple-700 font-medium">Best Opportunity</p>
            <p className="text-lg font-bold text-purple-800">{bestYield.type}</p>
            <p className="text-xs text-purple-600">{bestYield.grossYield}% gross yield</p>
          </div>
        </div>
      </div>

      {/* Investment Breakdown */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-800 mb-4">Investment Breakdown by Property Type</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {investmentData.map((item, index) => {
            const isPositiveCashFlow = item.monthlyCashFlow >= 0;
            
            return (
              <div
                key={item.type}
                className={`
                  p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200
                  ${isPositiveCashFlow ? 'bg-green-50' : 'bg-red-50'}
                `}
              >
                <h5 className="font-semibold text-gray-800 mb-3">{item.type}</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Property Price:</span>
                    <span className="font-bold text-gray-800">${item.avgPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Rent:</span>
                    <span className="font-bold text-green-600">${item.avgRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Gross Yield:</span>
                    <span className="font-medium text-blue-600">{item.grossYield}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cash Flow:</span>
                    <span className={`font-medium ${isPositiveCashFlow ? 'text-green-600' : 'text-red-600'}`}>
                      ${item.monthlyCashFlow.toFixed(0)}/mo
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cash-on-Cash:</span>
                    <span className="font-medium text-purple-600">{item.cashOnCashReturn.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Down Payment:</span>
                    <span className="text-sm text-gray-800">${item.downPayment.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-semibold text-blue-800 mb-2">Market Opportunity</h5>
          <p className="text-sm text-blue-600">
            {bestYield.type} properties offer the highest gross yields at {bestYield.grossYield}%, 
            making them attractive for income-focused investors.
          </p>
        </div>
        
        <div className={`rounded-lg p-4 ${
          bestCashFlow.monthlyCashFlow >= 0 ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <h5 className={`font-semibold mb-2 ${
            bestCashFlow.monthlyCashFlow >= 0 ? 'text-green-800' : 'text-red-800'
          }`}>
            Cash Flow Analysis
          </h5>
          <p className={`text-sm ${
            bestCashFlow.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {bestCashFlow.type} properties generate ${Math.abs(bestCashFlow.monthlyCashFlow).toFixed(0)}/month in{' '}
            {bestCashFlow.monthlyCashFlow >= 0 ? 'positive cash flow' : 'negative cash flow'}, 
            {bestCashFlow.monthlyCashFlow >= 0 ? ' ideal for leveraged investments' : ' requiring additional capital injection'}.
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <h5 className="font-semibold text-purple-800 mb-2">Investment Strategy</h5>
          <p className="text-sm text-purple-600">
            With average net yields of {avgNetYield.toFixed(1)}%, this market offers {avgNetYield > 3 ? 'competitive' : 'moderate'} returns 
            for real estate investors seeking rental income diversification.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RentalYieldAnalysisChart;