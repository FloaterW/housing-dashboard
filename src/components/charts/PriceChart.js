import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { getDataForRegionAndType } from '../../data/housingData';
import ChartWrapper, { chartTheme, getChartProps, ChartActions } from '../common/ChartWrapper';

function PriceChart({ selectedRegion, selectedHousingType }) {
  const data =
    getDataForRegionAndType('priceData', selectedRegion, selectedHousingType) ||
    [];

  const formatPrice = value => {
    return `$${(value / 1000000).toFixed(2)}M`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={chartTheme.tooltip} className="p-3 rounded-lg">
          <p className="font-semibold text-white">{label}</p>
          <p style={{ color: chartTheme.primary }}>
            Price: ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleExport = () => {
    console.log('Exporting price chart data...');
    // Export logic would go here
  };

  const handleRefresh = () => {
    console.log('Refreshing price chart data...');
    // Refresh logic would go here
  };

  const actions = (
    <>
      <ChartActions.RefreshButton onClick={handleRefresh} />
      <ChartActions.ExportButton onClick={handleExport} />
    </>
  );

  return (
    <ChartWrapper
      title="Housing Price Trends"
      subtitle={`${selectedRegion} - ${selectedHousingType}`}
      height={300}
      actions={actions}
    >
      <LineChart
        data={data}
        {...getChartProps('line')}
      >
        <CartesianGrid {...chartTheme.grid} />
        <XAxis
          dataKey="month"
          tick={chartTheme.axis}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          tickFormatter={formatPrice} 
          tick={chartTheme.axis} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={chartTheme.legend} />
        <Line
          type="monotone"
          dataKey="price"
          stroke={chartTheme.primary}
          {...getChartProps('line')}
          name="Average Price"
        />
      </LineChart>
    </ChartWrapper>
  );
}

export default React.memo(PriceChart);
