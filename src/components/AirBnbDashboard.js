import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  airbnbHistoricalData,
  airbnbCompetitiveData,
  airbnbMetrics,
  airbnbOpportunityAnalysis,
  estimateAirBnbRevenue
} from '../data/airbnbData';

const AirBnbDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState('Mississauga');
  const [selectedTimeframe, setSelectedTimeframe] = useState('6');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const regions = ['Mississauga', 'Brampton', 'Caledon'];
  const timeframes = [
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '12 Months' }
  ];

  // Filter data based on selections
  const filteredData = airbnbHistoricalData
    .filter(item => item.region === selectedRegion)
    .slice(-parseInt(selectedTimeframe));

  const revenueEstimate = estimateAirBnbRevenue(airbnbHistoricalData, selectedRegion);
  const opportunityData = airbnbOpportunityAnalysis.find(item => item.region === selectedRegion);
  const competitiveData = airbnbCompetitiveData.find(item => item.region === selectedRegion);

  // Chart colors
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  const MetricCard = ({ title, value, change, icon, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${parseFloat(change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(change) >= 0 ? '↗' : '↘'} {Math.abs(change)}%
            </p>
          )}
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
    </div>
  );

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AirBnB Market Analytics
        </h1>
        <p className="text-gray-600">
          Comprehensive analysis of short-term rental market trends and opportunities
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Period
            </label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timeframes.map(tf => (
                <option key={tf.value} value={tf.value}>{tf.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <TabButton
          id="overview"
          label="Overview"
          isActive={activeTab === 'overview'}
          onClick={setActiveTab}
        />
        <TabButton
          id="trends"
          label="Trends"
          isActive={activeTab === 'trends'}
          onClick={setActiveTab}
        />
        <TabButton
          id="competition"
          label="Competition"
          isActive={activeTab === 'competition'}
          onClick={setActiveTab}
        />
        <TabButton
          id="opportunity"
          label="Opportunity"
          isActive={activeTab === 'opportunity'}
          onClick={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Average Nightly Rate"
              value={`$${filteredData[filteredData.length - 1]?.averagePrice || 0}`}
              change={airbnbMetrics?.averagePrice?.change}
              icon="🏠"
              color="#3B82F6"
            />
            <MetricCard
              title="Total Active Listings"
              value={airbnbMetrics?.totalListings?.toLocaleString() || '0'}
              change={airbnbMetrics?.newListings?.change}
              icon="📊"
              color="#10B981"
            />
            <MetricCard
              title="Average Occupancy Rate"
              value={`${filteredData[filteredData.length - 1]?.occupancyRate || 0}%`}
              change={airbnbMetrics?.occupancyRate?.change}
              icon="📈"
              color="#F59E0B"
            />
            <MetricCard
              title="Average Rating"
              value={filteredData[filteredData.length - 1]?.averageRating || '0.0'}
              change={airbnbMetrics?.averageRating?.change}
              icon="⭐"
              color="#EF4444"
            />
          </div>

          {/* Revenue Estimation */}
          {revenueEstimate && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Revenue Estimation - {selectedRegion}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Monthly Revenue per Listing</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${revenueEstimate.monthlyRevenuePerListing?.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Market Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${(revenueEstimate.totalMarketRevenue / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Avg Bookings/Month</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {revenueEstimate.estimatedBookingsPerMonth}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Property Type Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Property Type Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filteredData[filteredData.length - 1]?.propertyTypes || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                >
                  {(filteredData[filteredData.length - 1]?.propertyTypes || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="space-y-6">
          {/* Price Trends */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Average Nightly Rate Trends
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Average Price']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="averagePrice"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Occupancy and Listings Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Occupancy Rate Trends
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Occupancy Rate']} />
                  <Line
                    type="monotone"
                    dataKey="occupancyRate"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Total Listings Growth
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalListings" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Listings and Reviews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                New Listings per Month
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="newListings" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Average Rating Trends
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[3, 5]} />
                  <Tooltip formatter={(value) => [value, 'Average Rating']} />
                  <Line
                    type="monotone"
                    dataKey="averageRating"
                    stroke="#EF4444"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'competition' && competitiveData && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Platform Competition Analysis - {selectedRegion}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={competitiveData.platforms}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Average Price']} />
                  <Bar dataKey="averagePrice" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={competitiveData.platforms}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="marketShare"
                    label={({ platform, marketShare }) => `${platform}: ${marketShare}%`}
                  >
                    {competitiveData.platforms.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {competitiveData.platforms.map((platform, index) => (
                <div key={platform.platform} className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">{platform.platform}</h3>
                  <p className="text-sm text-gray-600">
                    Avg Price: ${platform.averagePrice}
                  </p>
                  <p className="text-sm text-gray-600">
                    Listings: {platform.listingCount}
                  </p>
                  <p className="text-sm text-gray-600">
                    Rating: {platform.averageRating}/5.0
                  </p>
                  <p className="text-sm text-gray-600">
                    Market Share: {platform.marketShare}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'opportunity' && opportunityData && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Market Opportunity Analysis - {selectedRegion}
            </h2>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Opportunity Score
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {opportunityData.opportunityScore}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${opportunityData.opportunityScore}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Price Growth:</span>
                    <span className={`font-semibold ${
                      parseFloat(opportunityData.metrics.priceGrowth) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {opportunityData.metrics.priceGrowth}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Listing Growth:</span>
                    <span className="font-semibold">
                      {opportunityData.metrics.listingGrowth}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Occupancy Rate:</span>
                    <span className="font-semibold">
                      {opportunityData.metrics.occupancyRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Rating:</span>
                    <span className="font-semibold">
                      {opportunityData.metrics.averageRating}/5.0
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span className="font-semibold">
                      {opportunityData.metrics.averageResponseTime} min
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Market Risks</h3>
                <ul className="space-y-2">
                  {opportunityData.risks.map((risk, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2">⚠️</span>
                      <span className="text-sm">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Recommendation</h3>
              <p className="text-gray-700">{opportunityData.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirBnbDashboard;