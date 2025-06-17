import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { housingData } from '../../data/housingData';

function MarketVelocityChart({ selectedRegion }) {
  const velocityData = housingData.marketVelocity[selectedRegion] || [];

  // Transform data for scatter plot
  const scatterData = velocityData.map(item => ({
    ...item,
    x: item.daysOnMarket,
    y: item.avgPrice / 1000000, // Convert to millions for better display
    z: item.salesVolume, // This will determine bubble size
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">{data.type}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Days on Market:</span>
              <span className="font-medium ml-2">{data.daysOnMarket} days</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Average Price:</span>
              <span className="font-medium ml-2">
                ${data.avgPrice.toLocaleString()}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Monthly Sales:</span>
              <span className="font-medium ml-2">{data.salesVolume} units</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {data.daysOnMarket < 20
                ? 'Fast-moving market'
                : data.daysOnMarket < 30
                  ? 'Moderate pace'
                  : 'Slower market'}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = props => {
    const { cx, cy, payload, index } = props;
    const radius = Math.sqrt(payload.salesVolume) / 8; // Scale bubble size

    return (
      <circle
        cx={cx}
        cy={cy}
        r={Math.max(radius, 8)} // Minimum radius of 8
        fill={COLORS[index % COLORS.length]}
        fillOpacity={0.7}
        stroke={COLORS[index % COLORS.length]}
        strokeWidth={2}
        className="hover:fill-opacity-90 transition-all duration-200"
      />
    );
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">⚡</span>
        Market Velocity Analysis - {selectedRegion}
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scatter Plot */}
        <div className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                dataKey="x"
                domain={['dataMin - 2', 'dataMax + 2']}
                name="Days on Market"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                label={{
                  value: 'Days on Market',
                  position: 'insideBottom',
                  offset: -10,
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                domain={['dataMin - 0.1', 'dataMax + 0.1']}
                name="Average Price"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={value => `$${value.toFixed(1)}M`}
                label={{
                  value: 'Avg Price (Millions)',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={scatterData} shape={<CustomDot />} />
            </ScatterChart>
          </ResponsiveContainer>

          <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span>Bubble size = Sales Volume</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>←</span>
              <span>Faster Sales</span>
              <span>|</span>
              <span>Slower Sales</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Market Performance</h4>
          {velocityData.map((item, index) => {
            const velocity = item.daysOnMarket;
            const isHot = velocity < 20;
            const isModerate = velocity >= 20 && velocity < 30;

            return (
              <div
                key={item.type}
                className={`p-3 rounded-lg border-l-4 ${
                  isHot
                    ? 'bg-green-50 border-green-500'
                    : isModerate
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{item.type}</p>
                    <p className="text-xs text-gray-500">
                      {item.salesVolume} sales/month
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {item.daysOnMarket} days
                    </p>
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isHot
                            ? 'bg-green-500'
                            : isModerate
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                      />
                      <p
                        className={`text-xs ${
                          isHot
                            ? 'text-green-600'
                            : isModerate
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {isHot ? 'Hot' : isModerate ? 'Warm' : 'Cool'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <h5 className="font-semibold text-green-800 mb-1">Fastest Moving</h5>
          <p className="text-sm text-green-600">
            {
              velocityData.reduce((prev, current) =>
                prev.daysOnMarket < current.daysOnMarket ? prev : current
              ).type
            }{' '}
            -{' '}
            {
              velocityData.reduce((prev, current) =>
                prev.daysOnMarket < current.daysOnMarket ? prev : current
              ).daysOnMarket
            }{' '}
            days
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-semibold text-blue-800 mb-1">Highest Volume</h5>
          <p className="text-sm text-blue-600">
            {
              velocityData.reduce((prev, current) =>
                prev.salesVolume > current.salesVolume ? prev : current
              ).type
            }{' '}
            -{' '}
            {
              velocityData.reduce((prev, current) =>
                prev.salesVolume > current.salesVolume ? prev : current
              ).salesVolume
            }{' '}
            sales/month
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <h5 className="font-semibold text-purple-800 mb-1">
            Market Temperature
          </h5>
          <p className="text-sm text-purple-600">
            {velocityData.filter(d => d.daysOnMarket < 25).length >
            velocityData.length / 2
              ? 'Hot Market'
              : 'Balanced Market'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MarketVelocityChart;
