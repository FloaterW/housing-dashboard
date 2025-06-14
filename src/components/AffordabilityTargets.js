import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ownershipTargetSeries, rentalTargetSeries, densityTargetSeries } from '../data/affordability';

function AffordabilityTargets() {
  // Transform data for charts
  const transformData = (series) => {
    return series.map(([year, actual, target]) => ({
      year: year.toString(),
      actual,
      target,
    }));
  };

  const ownershipData = transformData(ownershipTargetSeries);
  const rentalData = transformData(rentalTargetSeries);
  const densityData = transformData(densityTargetSeries);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">Year {label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-sm">
                <span className="text-gray-600">{entry.name}:</span>
                <span className="font-medium ml-2" style={{ color: entry.color }}>
                  {entry.value.toFixed(1)}%
                </span>
              </p>
            ))}
            <p className="text-xs text-gray-500 mt-2">
              Gap: {Math.abs(payload[0].value - payload[1].value).toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = (data, title, subtitle, colors) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="year" 
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="circle"
          />
          <Bar 
            dataKey="actual" 
            name="Actual" 
            fill={colors.actual} 
            radius={[6, 6, 0, 0]}
          />
          <Bar 
            dataKey="target" 
            name="Target" 
            fill={colors.target} 
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Progress vs Targets</h2>
        <p className="text-gray-600">Tracking housing market performance against strategic targets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderChart(
          ownershipData,
          "Ownership Rate",
          "Home ownership percentage trends",
          { actual: "#3B82F6", target: "#93C5FD" }
        )}
        
        {renderChart(
          rentalData,
          "Rental Rate",
          "Rental housing percentage trends",
          { actual: "#10B981", target: "#86EFAC" }
        )}
        
        {renderChart(
          densityData,
          "Housing Density",
          "Units per hectare progress",
          { actual: "#F59E0B", target: "#FCD34D" }
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <h4 className="font-semibold text-blue-800">Ownership</h4>
          <p className="text-2xl font-bold text-blue-600 my-2">70.4%</p>
          <p className="text-sm text-blue-600">
            {ownershipData[ownershipData.length - 1].actual > ownershipData[ownershipData.length - 1].target ? '↑' : '↓'} 
            {' '}{Math.abs(ownershipData[ownershipData.length - 1].actual - ownershipData[ownershipData.length - 1].target).toFixed(1)}% from target
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <h4 className="font-semibold text-green-800">Rental</h4>
          <p className="text-2xl font-bold text-green-600 my-2">29.6%</p>
          <p className="text-sm text-green-600">
            {rentalData[rentalData.length - 1].actual < rentalData[rentalData.length - 1].target ? '↑' : '↓'} 
            {' '}{Math.abs(rentalData[rentalData.length - 1].actual - rentalData[rentalData.length - 1].target).toFixed(1)}% from target
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <h4 className="font-semibold text-yellow-800">Density</h4>
          <p className="text-2xl font-bold text-yellow-600 my-2">59.0</p>
          <p className="text-sm text-yellow-600">
            {densityData[densityData.length - 1].actual > densityData[densityData.length - 1].target ? '↑' : '↓'} 
            {' '}{Math.abs(densityData[densityData.length - 1].actual - densityData[densityData.length - 1].target).toFixed(1)} units/ha from target
          </p>
        </div>
      </div>
    </div>
  );
}

export default AffordabilityTargets; 