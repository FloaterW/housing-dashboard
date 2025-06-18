import React, { useState, useEffect } from 'react';
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
import apiService from '../services/api';
import RentalPriceTrendsChart from './charts/RentalPriceTrendsChart';
import RentalYieldAnalysisChart from './charts/RentalYieldAnalysisChart';

function RentalDashboard({ selectedRegion = 'Peel Region' }) {
  const [activeTab, setActiveTab] = useState('trends');
  const [rentalData, setRentalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get region ID from region name
  const getRegionId = (regionName) => {
    const regionMap = {
      'Peel Region': 1,
      'Mississauga': 2,
      'Brampton': 3,
      'Caledon': 4
    };
    return regionMap[regionName] || 1;
  };

  // Load rental data
  useEffect(() => {
    const loadRentalData = async () => {
      try {
        setLoading(true);
        setError(null);

        const regionId = getRegionId(selectedRegion);
        
        // Fetch rental overview data from API
        const response = await apiService.getRentalOverview(regionId);
        setRentalData(response.data);

      } catch (err) {
        console.error('Error loading rental data:', err);
        setError('Failed to load rental data. Using fallback data.');
        // Set fallback data
        setRentalData({
          rentalMetrics: [
            { bedroom_type: 'Bachelor', avg_rent: 1250, vacancy_rate_pct: 2.5 },
            { bedroom_type: '1 Bedroom', avg_rent: 1680, vacancy_rate_pct: 1.8 },
            { bedroom_type: '2 Bedroom', avg_rent: 2100, vacancy_rate_pct: 2.1 },
            { bedroom_type: '3+ Bedroom', avg_rent: 2750, vacancy_rate_pct: 3.2 }
          ],
          stockSummary: {
            total_pbr_units: 8500,
            new_pbr_units: 1200,
            rented_condos_count: 12000,
            overall_vacancy_pct: 2.4
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadRentalData();
  }, [selectedRegion]);

  // Transform vacancy data from API
  const vacancyData = rentalData?.rentalMetrics?.map(item => ({
    type: item.bedroom_type,
    rate: parseFloat(item.vacancy_rate_pct),
  })) || [];

  // Purpose-built units data from API
  const pbrData = rentalData?.stockSummary ? [
    {
      category: 'Existing Stock',
      value: rentalData.stockSummary.total_pbr_units - rentalData.stockSummary.new_pbr_units,
    },
    { category: 'New Units (2024)', value: rentalData.stockSummary.new_pbr_units },
  ] : [];

  // Rented condos data for donut chart from API
  const condoData = rentalData?.stockSummary ? [
    {
      name: 'Purpose-Built Rental',
      value: rentalData.stockSummary.total_pbr_units,
    },
    { name: 'Rented Condos', value: rentalData.stockSummary.rented_condos_count },
  ] : [];

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
          {rentalData?.stockSummary?.overall_vacancy_pct || 2.4}%
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
            {(rentalData?.stockSummary?.total_pbr_units || 8500).toLocaleString()}
          </p>
          <p className="text-sm text-blue-800">Total PBR Units</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-600">
            +{(rentalData?.stockSummary?.new_pbr_units || 1200).toLocaleString()}
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
                {(rentalData?.stockSummary?.total_pbr_units || 8500).toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${((rentalData?.stockSummary?.total_pbr_units || 8500) / ((rentalData?.stockSummary?.total_pbr_units || 8500) + (rentalData?.stockSummary?.rented_condos_count || 12000))) * 100}%`,
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
                {(rentalData?.stockSummary?.rented_condos_count || 12000).toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${((rentalData?.stockSummary?.rented_condos_count || 12000) / ((rentalData?.stockSummary?.total_pbr_units || 8500) + (rentalData?.stockSummary?.rented_condos_count || 12000))) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Total Rental Stock:</span>
              <span className="ml-2 text-lg font-bold text-gray-800">
                {(
                  (rentalData?.stockSummary?.total_pbr_units || 8500) +
                  (rentalData?.stockSummary?.rented_condos_count || 12000)
                ).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
          <span className="ml-3 text-xl text-gray-600">Loading rental data...</span>
        </div>
      </div>
    );
  }

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

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">⚠️</span>
            <p className="text-sm font-medium text-yellow-800">{error}</p>
          </div>
        </div>
      )}

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
