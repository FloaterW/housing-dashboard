import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { vacancyByBedroom2024, rentalStockSummary2024 } from '../data/rental';
import RentalPriceTrendsChart from './charts/RentalPriceTrendsChart';
import RentalYieldAnalysisChart from './charts/RentalYieldAnalysisChart';

function RentalDashboard({ selectedRegion = 'Peel Region' }) {
  const [activeTab, setActiveTab] = useState('trends');

  // Transform vacancy data
  const vacancyData = vacancyByBedroom2024.map(([type, rate]) => ({
    type,
    rate: parseFloat(rate),
  }));

  // Purpose-built units data
  const pbrData = [
    {
      category: 'Existing Stock',
      value:
        rentalStockSummary2024.totalPBRUnits -
        rentalStockSummary2024.newPBRUnits,
    },
    { category: 'New Units (2024)', value: rentalStockSummary2024.newPBRUnits },
  ];

  // Rented condos data for donut chart
  const condoData = [
    {
      name: 'Purpose-Built Rental',
      value: rentalStockSummary2024.totalPBRUnits,
    },
    { name: 'Rented Condos', value: rentalStockSummary2024.rentedCondos },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const tabs = [
    { id: 'trends', label: 'Rental Price Trends', icon: '📈' },
    { id: 'yield', label: 'Investment Yield Analysis', icon: '💰' },
    { id: 'vacancy', label: 'Vacancy Rates 2024', icon: '📊' },
    { id: 'pbr', label: 'Purpose-Built Units 2024', icon: '🏢' },
    { id: 'condos', label: 'Rented Condos 2024', icon: '🏠' },
  ];

  const renderVacancyRates = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Vacancy Rates by Bedroom Type
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={vacancyData}
          layout="horizontal"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
            tickFormatter={value => `${value}%`}
          />
          <Tooltip
            formatter={value => `${value}%`}
            contentStyle={{ borderRadius: '8px' }}
          />
          <Bar dataKey="rate" name="Vacancy Rate" radius={[8, 8, 0, 0]}>
            {vacancyData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-orange-50 rounded-lg">
        <p className="text-sm text-orange-800">
          <span className="font-semibold">Overall Vacancy Rate:</span>{' '}
          {rentalStockSummary2024.overallVacancyPct}%
        </p>
        <p className="text-xs text-orange-600 mt-1">
          Lower vacancy rates indicate stronger rental demand
        </p>
      </div>
    </div>
  );

  const renderPurposeBuiltUnits = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Purpose-Built Rental Units
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={pbrData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPBR" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={value => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={value => value.toLocaleString()}
            contentStyle={{ borderRadius: '8px' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            fillOpacity={1}
            fill="url(#colorPBR)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {rentalStockSummary2024.totalPBRUnits.toLocaleString()}
          </p>
          <p className="text-sm text-blue-800">Total PBR Units</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-600">
            +{rentalStockSummary2024.newPBRUnits.toLocaleString()}
          </p>
          <p className="text-sm text-green-800">New Units (2024)</p>
        </div>
      </div>
    </div>
  );

  const renderRentedCondos = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Rental Stock Composition
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={condoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {condoData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={value => value.toLocaleString()} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-800 font-medium">
                Purpose-Built
              </span>
              <span className="text-lg font-bold text-blue-600">
                {rentalStockSummary2024.totalPBRUnits.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${(rentalStockSummary2024.totalPBRUnits / (rentalStockSummary2024.totalPBRUnits + rentalStockSummary2024.rentedCondos)) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-800 font-medium">
                Rented Condos
              </span>
              <span className="text-lg font-bold text-green-600">
                {rentalStockSummary2024.rentedCondos.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${(rentalStockSummary2024.rentedCondos / (rentalStockSummary2024.totalPBRUnits + rentalStockSummary2024.rentedCondos)) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Total Rental Stock:</span>
              <span className="ml-2 text-lg font-bold text-gray-800">
                {(
                  rentalStockSummary2024.totalPBRUnits +
                  rentalStockSummary2024.rentedCondos
                ).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          New & Total Rental
        </h2>
        <p className="text-gray-600">
          Comprehensive rental market analysis and statistics
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b-2 border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center space-x-2 py-3 px-6 font-medium transition-all duration-300
              ${
                activeTab === tab.id
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'trends' && (
          <RentalPriceTrendsChart selectedRegion={selectedRegion} />
        )}
        {activeTab === 'yield' && <RentalYieldAnalysisChart />}
        {activeTab === 'vacancy' && renderVacancyRates()}
        {activeTab === 'pbr' && renderPurposeBuiltUnits()}
        {activeTab === 'condos' && renderRentedCondos()}
      </div>
    </div>
  );
}

export default RentalDashboard;
