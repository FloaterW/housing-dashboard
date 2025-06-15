import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { housingData } from '../../data/housingData';

function PricePerSqFtChart({ selectedRegion }) {
  const sqFtData = housingData.pricePerSqFt[selectedRegion] || [];
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Price per Sq Ft:</span>
              <span className="font-medium ml-2">${data.pricePerSqFt}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Avg Size:</span>
              <span className="font-medium ml-2">{data.avgSqFt.toLocaleString()} sq ft</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Typical Price:</span>
              <span className="font-medium ml-2">${(data.pricePerSqFt * data.avgSqFt).toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const formatPrice = (value) => `$${value}`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📏</span>
        Price per Square Foot Analysis - {selectedRegion}
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={sqFtData}
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
                tickFormatter={formatPrice}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
              <Legend />
              <Bar 
                dataKey="pricePerSqFt" 
                name="Price per Sq Ft" 
                fill="#3B82F6" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Cards */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Price Efficiency</h4>
          {sqFtData.map((item, index) => {
            const efficiency = item.pricePerSqFt;
            const isHighEfficiency = efficiency < 750;
            const isMediumEfficiency = efficiency >= 750 && efficiency < 850;
            
            return (
              <div 
                key={item.type} 
                className={`p-3 rounded-lg border-l-4 ${
                  isHighEfficiency ? 'bg-green-50 border-green-500' :
                  isMediumEfficiency ? 'bg-yellow-50 border-yellow-500' :
                  'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{item.type}</p>
                    <p className="text-xs text-gray-500">{item.avgSqFt.toLocaleString()} sq ft avg</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">${item.pricePerSqFt}</p>
                    <p className={`text-xs ${
                      isHighEfficiency ? 'text-green-600' :
                      isMediumEfficiency ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {isHighEfficiency ? 'Efficient' : isMediumEfficiency ? 'Moderate' : 'Premium'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Analysis */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-semibold text-blue-800 mb-1">Most Affordable</h5>
          <p className="text-sm text-blue-600">
            {sqFtData.reduce((prev, current) => 
              (prev.pricePerSqFt < current.pricePerSqFt) ? prev : current
            ).type} at ${sqFtData.reduce((prev, current) => 
              (prev.pricePerSqFt < current.pricePerSqFt) ? prev : current
            ).pricePerSqFt}/sq ft
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <h5 className="font-semibold text-purple-800 mb-1">Premium Option</h5>
          <p className="text-sm text-purple-600">
            {sqFtData.reduce((prev, current) => 
              (prev.pricePerSqFt > current.pricePerSqFt) ? prev : current
            ).type} at ${sqFtData.reduce((prev, current) => 
              (prev.pricePerSqFt > current.pricePerSqFt) ? prev : current
            ).pricePerSqFt}/sq ft
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <h5 className="font-semibold text-green-800 mb-1">Price Range</h5>
          <p className="text-sm text-green-600">
            ${Math.min(...sqFtData.map(d => d.pricePerSqFt))} - ${Math.max(...sqFtData.map(d => d.pricePerSqFt))} per sq ft
          </p>
        </div>
      </div>
    </div>
  );
}

export default PricePerSqFtChart;