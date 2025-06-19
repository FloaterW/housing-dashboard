import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { housingData } from '../../data/housingData';

function HousingTypeDistributionChart({ selectedRegion }) {
  const distributionData =
    housingData.housingTypeDistribution[selectedRegion] || [];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">{data.type}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Market Share:</span>
              <span className="font-medium ml-2">{data.percentage}%</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Total Units:</span>
              <span className="font-medium ml-2">
                {data.count.toLocaleString()}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Avg Price:</span>
              <span className="font-medium ml-2">
                ${data.avgPrice.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🏘️</span>
        Housing Type Distribution - {selectedRegion}
      </h3>

      {distributionData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="percentage"
                  nameKey="type"
                >
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Statistics */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Market Composition</h4>
            {distributionData.map((item, index) => (
              <div
                key={item.type}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium text-gray-700">{item.type}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{item.percentage}%</p>
                  <p className="text-xs text-gray-500">
                    {item.count.toLocaleString()} units
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-600 text-lg">No data available</p>
            <p className="text-gray-500 text-sm">
              Housing distribution data for "{selectedRegion}" is not available
            </p>
          </div>
        </div>
      )}

      {/* Market Insights */}
      {distributionData.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Market Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Dominant Type:</span>
              <span className="ml-2 text-blue-600">
                {
                  distributionData.reduce((prev, current) =>
                    prev.percentage > current.percentage ? prev : current
                  ).type
                }{' '}
                (
                {
                  distributionData.reduce((prev, current) =>
                    prev.percentage > current.percentage ? prev : current
                  ).percentage
                }
                %)
              </span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">
                Total Housing Stock:
              </span>
              <span className="ml-2 text-blue-600">
                {distributionData
                  .reduce((sum, item) => sum + item.count, 0)
                  .toLocaleString()}{' '}
                units
              </span>
            </div>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {distributionData.length === 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            No housing distribution data available for {selectedRegion}
          </p>
        </div>
      )}
    </div>
  );
}

export default HousingTypeDistributionChart;
