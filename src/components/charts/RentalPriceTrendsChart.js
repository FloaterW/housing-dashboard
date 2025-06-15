import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { rentalPriceTrends } from '../../data/rental';

function RentalPriceTrendsChart({ selectedRegion }) {
  const [selectedBedrooms, setSelectedBedrooms] = useState('1-BR');
  const [viewMode, setViewMode] = useState('price'); // 'price' or 'growth'

  const bedroomOptions = ['1-BR', '2-BR', '3+-BR'];
  const rentalData = rentalPriceTrends[selectedRegion]?.[selectedBedrooms] || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Average Rent:</span>
              <span className="font-medium ml-2">${data.rent.toLocaleString()}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">YoY Growth:</span>
              <span className="font-medium ml-2">{data.yoyGrowth}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const formatPrice = (value) => `$${(value / 1000).toFixed(1)}k`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4 md:mb-0">
          <span className="mr-2">📈</span>
          Rental Price Trends - {selectedRegion}
        </h3>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Bedroom Selection */}
          <div className="flex space-x-2">
            {bedroomOptions.map((bedroom) => (
              <button
                key={bedroom}
                onClick={() => setSelectedBedrooms(bedroom)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                  ${selectedBedrooms === bedroom
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {bedroom}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('price')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'price'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Price
            </button>
            <button
              onClick={() => setViewMode('growth')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${viewMode === 'growth'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Growth
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={350}>
            {viewMode === 'price' ? (
              <LineChart data={rentalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tickFormatter={formatPrice}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rent" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Monthly Rent"
                />
              </LineChart>
            ) : (
              <ComposedChart data={rentalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month"
                  tick={{ fontSize: 12 }}
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
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'YoY Growth']}
                  contentStyle={{ borderRadius: '8px' }}
                />
                <Legend />
                <Bar 
                  dataKey="yoyGrowth" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                  name="YoY Growth (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="yoyGrowth" 
                  stroke="#059669" 
                  strokeWidth={2}
                  dot={{ fill: '#059669', r: 3 }}
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Summary Statistics */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Current Stats</h4>
          
          {rentalData.length > 0 && (
            <>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-700 font-medium">Current Rent</p>
                <p className="text-2xl font-bold text-blue-800">
                  ${rentalData[rentalData.length - 1]?.rent.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600">
                  {selectedBedrooms} in {selectedRegion}
                </p>
              </div>

              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-green-700 font-medium">YoY Growth</p>
                <p className="text-2xl font-bold text-green-800">
                  {rentalData[rentalData.length - 1]?.yoyGrowth}%
                </p>
                <p className="text-xs text-green-600">
                  vs. Feb 2024
                </p>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <p className="text-sm text-purple-700 font-medium">12-Month Increase</p>
                <p className="text-2xl font-bold text-purple-800">
                  ${(rentalData[rentalData.length - 1]?.rent - rentalData[0]?.rent).toLocaleString()}
                </p>
                <p className="text-xs text-purple-600">
                  Total increase
                </p>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <p className="text-sm text-orange-700 font-medium">Avg Monthly Change</p>
                <p className="text-2xl font-bold text-orange-800">
                  ${Math.round((rentalData[rentalData.length - 1]?.rent - rentalData[0]?.rent) / (rentalData.length - 1))}
                </p>
                <p className="text-xs text-orange-600">
                  Per month
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Market Analysis */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-semibold text-blue-800 mb-1">Market Trend</h5>
          <p className="text-sm text-blue-600">
            {rentalData.length > 0 && rentalData[rentalData.length - 1]?.yoyGrowth > 6 
              ? 'Strong Growth' 
              : rentalData.length > 0 && rentalData[rentalData.length - 1]?.yoyGrowth > 3
              ? 'Moderate Growth'
              : 'Stable Growth'
            }
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <h5 className="font-semibold text-green-800 mb-1">Price Competitiveness</h5>
          <p className="text-sm text-green-600">
            {selectedRegion === 'Brampton' ? 'Most Affordable' :
             selectedRegion === 'Mississauga' ? 'Premium Market' :
             selectedRegion === 'Caledon' ? 'Luxury Market' :
             'Balanced Market'}
          </p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <h5 className="font-semibold text-yellow-800 mb-1">Investment Outlook</h5>
          <p className="text-sm text-yellow-600">
            {rentalData.length > 0 && rentalData[rentalData.length - 1]?.yoyGrowth > 7 
              ? 'Strong Returns' 
              : 'Steady Returns'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

export default RentalPriceTrendsChart;