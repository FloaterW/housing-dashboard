import React, { useState } from 'react';
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
  ResponsiveContainer,
} from 'recharts';
import {
  airbnbHistoricalData,
  airbnbCompetitiveData,
  airbnbMetrics,
  airbnbOpportunityAnalysis,
  estimateAirBnbRevenue,
} from '../data/airbnbData';
import AirBnbRealScraper from '../utils/airbnbRealScraper';
// import { aprilAnalysisService } from '../data/aprilAnalysisData'; // Unused
import designSystem from '../styles/designSystem';
import logger from '../utils/logger';

const AirBnbDashboard = ({ selectedRegion: propSelectedRegion }) => {
  // Define valid regions first - memoized to prevent re-renders
  const regions = React.useMemo(
    () => ['Peel Region', 'Mississauga', 'Brampton', 'Caledon'],
    []
  );

  // Initialize with a valid region
  const getValidInitialRegion = () => {
    if (propSelectedRegion && regions.includes(propSelectedRegion)) {
      return propSelectedRegion;
    }
    // Check if propSelectedRegion has data in AirBnB dataset
    if (
      propSelectedRegion &&
      airbnbHistoricalData.some(item => item.region === propSelectedRegion)
    ) {
      return propSelectedRegion;
    }
    return 'Peel Region'; // Default to Peel Region
  };

  const [selectedRegion, setSelectedRegion] = useState(getValidInitialRegion());

  // Track if region change is from user interaction to prevent prop override
  const userChangedRegion = React.useRef(false);

  // Handler for manual region changes
  const handleRegionChange = React.useCallback(
    newRegion => {
      logger.info('AirBnB Dashboard Manual Region Change', {
        from: selectedRegion,
        to: newRegion,
        userInitiated: true,
      });
      userChangedRegion.current = true;
      setSelectedRegion(newRegion);
      // Reset the flag after a short delay to allow prop changes again
      setTimeout(() => {
        userChangedRegion.current = false;
      }, 100);
    },
    [selectedRegion]
  );

  // Sync with prop changes, but validate if the region has data
  React.useEffect(() => {
    // Don't override if user just changed the region manually
    if (userChangedRegion.current) return;

    if (propSelectedRegion && propSelectedRegion !== selectedRegion) {
      // Check if the prop region has data in AirBnB dataset
      const hasData = airbnbHistoricalData.some(
        item => item.region === propSelectedRegion
      );

      if (hasData) {
        setSelectedRegion(propSelectedRegion);
      } else {
        // Fallback to first available region with data
        const availableRegions = [
          ...new Set(airbnbHistoricalData.map(item => item.region)),
        ];
        const fallbackRegion =
          availableRegions.find(region => regions.includes(region)) ||
          'Peel Region';
        setSelectedRegion(fallbackRegion);
        logger.warn('AirBnB Dashboard', {
          message: 'Selected region has no AirBnB data, falling back',
          originalRegion: propSelectedRegion,
          fallbackRegion,
          availableRegions,
        });
      }
    }
  }, [propSelectedRegion, regions, selectedRegion]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6');
  const [activeTab, setActiveTab] = useState('overview');
  const [realScrapingEnabled, setRealScrapingEnabled] = useState(false);
  const [scrapingStatus, setScrapingStatus] = useState('idle'); // idle, loading, success, error
  const [realListings, setRealListings] = useState([]);
  const [scrapingError, setScrapingError] = useState(null);

  const timeframes = [
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '12 Months' },
  ];

  // Filter data based on selections
  const filteredData = airbnbHistoricalData
    .filter(item => item.region === selectedRegion)
    .slice(-parseInt(selectedTimeframe));

  // Safety check for empty data
  if (filteredData.length === 0) {
    logger.warn('AirBnB Dashboard', {
      message: 'No data found for selected region',
      selectedRegion,
      availableRegions: [
        ...new Set(airbnbHistoricalData.map(item => item.region)),
      ],
    });
  }

  // Log region changes
  React.useEffect(() => {
    logger.info('AirBnB Dashboard Region Changed', {
      selectedRegion,
      filteredDataLength: filteredData.length,
      hasData: filteredData.length > 0,
    });
  }, [selectedRegion, filteredData]);

  const revenueEstimate = estimateAirBnbRevenue(
    airbnbHistoricalData,
    selectedRegion
  );
  const opportunityData = airbnbOpportunityAnalysis.find(
    item => item.region === selectedRegion
  );
  const competitiveData = airbnbCompetitiveData.find(
    item => item.region === selectedRegion
  );

  // Chart colors - using design system
  const colors = designSystem.chartColors.palette;

  // Real scraping functionality
  const handleRealScraping = async () => {
    if (!realScrapingEnabled) {
      setRealScrapingEnabled(true);
      return;
    }

    setScrapingStatus('loading');
    setScrapingError(null);

    try {
      const scraper = new AirBnbRealScraper();

      // Test connection first
      const connectionTest = await scraper.testConnection();
      if (!connectionTest.success) {
        setScrapingError(connectionTest.message);
        setScrapingStatus('error');
        return;
      }

      // Generate dates for scraping
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + 7); // 1 week from now
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 3); // 3 night stay

      const checkInStr = checkIn.toISOString().split('T')[0];
      const checkOutStr = checkOut.toISOString().split('T')[0];

      // Handle Peel Region scraping - use a broader search
      const searchLocation =
        selectedRegion === 'Peel Region'
          ? 'Peel Region, Ontario'
          : selectedRegion + ', Ontario';

      logger.scrapingStart(selectedRegion, {
        checkInStr,
        checkOutStr,
        adults: 2,
        searchLocation,
      });
      const listings = await scraper.scrapeRealListings(
        searchLocation,
        checkInStr,
        checkOutStr,
        2
      );

      if (listings && listings.length > 0) {
        setRealListings(listings);
        setScrapingStatus('success');
        logger.scrapingSuccess(selectedRegion, listings.length);
      } else {
        setScrapingError(
          'No listings found. This is expected due to browser CORS limitations.'
        );
        setScrapingStatus('error');
      }
    } catch (error) {
      logger.scrapingError(selectedRegion, error);
      setScrapingError(error.message);
      setScrapingStatus('error');
    }
  };

  const MetricCard = ({
    title,
    value,
    change,
    icon,
    color = designSystem.colors.primary[500],
  }) => (
    <div
      className={`${designSystem.components.metric.card} ${designSystem.animations.transition}`}
      style={{ borderLeftColor: color }}
    >
      <div className={designSystem.layout.flexBetween}>
        <div>
          <h3 className={designSystem.components.metric.label}>{title}</h3>
          <p
            className={`${designSystem.components.metric.value} text-gray-900`}
          >
            {value}
          </p>
          {change && (
            <p
              className={`${designSystem.components.metric.change} ${parseFloat(change) >= 0 ? designSystem.typography.success : designSystem.typography.danger}`}
            >
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
      className={
        isActive
          ? designSystem.components.tab.active
          : designSystem.components.tab.inactive
      }
    >
      {label}
    </button>
  );

  return (
    <div
      className={`${designSystem.spacing.container} bg-gray-50 min-h-screen`}
    >
      {/* Header */}
      <div
        className={designSystem.spacing.sectionGap.replace('space-y-8', 'mb-8')}
      >
        <h1 className={designSystem.typography.h1}>AirBnB Market Analytics</h1>
        <p className={designSystem.typography.subtitle}>
          Comprehensive analysis of short-term rental market trends and
          opportunities
        </p>
      </div>

      {/* Debug Info (only show when there are issues) */}
      {filteredData.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-yellow-800">Debug Information</h3>
          <p className="text-sm text-yellow-700">
            Selected Region: {selectedRegion} | Filtered Data Length:{' '}
            {filteredData.length} | Total Data Length:{' '}
            {airbnbHistoricalData.length}
          </p>
          <p className="text-sm text-yellow-700">
            Available Regions:{' '}
            {[...new Set(airbnbHistoricalData.map(item => item.region))].join(
              ', '
            )}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className={`${designSystem.components.card.base} mb-6`}>
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                value={selectedRegion}
                onChange={e => handleRegionChange(e.target.value)}
                className={designSystem.components.input.base}
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Period
              </label>
              <select
                value={selectedTimeframe}
                onChange={e => setSelectedTimeframe(e.target.value)}
                className={designSystem.components.input.base}
              >
                {timeframes.map(tf => (
                  <option key={tf.value} value={tf.value}>
                    {tf.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Real Scraping Controls */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">Real-time Data</p>
              <p className="text-xs text-gray-400">
                {scrapingStatus === 'loading'
                  ? 'Scraping...'
                  : scrapingStatus === 'success'
                    ? `${realListings.length} listings`
                    : scrapingStatus === 'error'
                      ? 'Failed'
                      : 'Mock data'}
              </p>
            </div>

            <button
              onClick={handleRealScraping}
              disabled={scrapingStatus === 'loading'}
              className={
                scrapingStatus === 'loading'
                  ? 'bg-gray-400 cursor-not-allowed px-4 py-2 rounded-lg font-medium'
                  : realScrapingEnabled
                    ? designSystem.components.button.danger
                    : designSystem.components.button.success
              }
            >
              {scrapingStatus === 'loading' ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Scraping...
                </div>
              ) : realScrapingEnabled ? (
                'Scrape Live Data'
              ) : (
                'Try Real Scraping'
              )}
            </button>
          </div>
        </div>

        {/* Real Scraping Status */}
        {scrapingError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-red-500">⚠️</span>
              <div>
                <p className="text-sm font-medium text-red-800">
                  Scraping Limited
                </p>
                <p className="text-xs text-red-600 mt-1">{scrapingError}</p>
                <p className="text-xs text-red-500 mt-1">
                  💡 For real scraping, use the Node.js backend script:{' '}
                  <code>node airbnb-scraper-backend.js</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {scrapingStatus === 'success' && realListings.length > 0 && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <p className="text-sm font-medium text-green-800">
                Successfully scraped {realListings.length} real listings from
                AirBnB!
              </p>
            </div>
          </div>
        )}
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
        <TabButton
          id="april-analysis"
          label="April 2025 Analysis"
          isActive={activeTab === 'april-analysis'}
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
              value={
                filteredData.length > 0
                  ? `$${filteredData[filteredData.length - 1]?.averagePrice || 0}`
                  : '$0'
              }
              change={airbnbMetrics?.averagePrice?.change}
              icon="🏠"
              color={designSystem.colors.primary[500]}
            />
            <MetricCard
              title="Total Active Listings"
              value={airbnbMetrics?.totalListings?.toLocaleString() || '0'}
              change={airbnbMetrics?.newListings?.change}
              icon="📊"
              color={designSystem.colors.success[500]}
            />
            <MetricCard
              title="Average Occupancy Rate"
              value={
                filteredData.length > 0
                  ? `${filteredData[filteredData.length - 1]?.occupancyRate || 0}%`
                  : '0%'
              }
              change={airbnbMetrics?.occupancyRate?.change}
              icon="📈"
              color={designSystem.colors.warning[500]}
            />
            <MetricCard
              title="Average Rating"
              value={
                filteredData.length > 0
                  ? filteredData[filteredData.length - 1]?.averageRating ||
                    '0.0'
                  : '0.0'
              }
              change={airbnbMetrics?.averageRating?.change}
              icon="⭐"
              color={designSystem.colors.danger[500]}
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
                  <p className="text-sm text-gray-600">
                    Monthly Revenue per Listing
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    $
                    {revenueEstimate.monthlyRevenuePerListing?.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Market Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${(revenueEstimate.totalMarketRevenue / 1000000).toFixed(1)}
                    M
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
            {filteredData.length > 0 &&
            filteredData[filteredData.length - 1]?.propertyTypes?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={filteredData[filteredData.length - 1].propertyTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ type, percentage }) => `${type}: ${percentage}%`}
                  >
                    {filteredData[filteredData.length - 1].propertyTypes.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg">No property type data available</p>
                  <p className="text-sm">
                    Select a different region or time period
                  </p>
                </div>
              </div>
            )}
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
            {filteredData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={value => [`$${value}`, 'Average Price']}
                  />
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
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg">No price trend data available</p>
                  <p className="text-sm">
                    Select a different region or extend the time period
                  </p>
                </div>
              </div>
            )}
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
                  <Tooltip
                    formatter={value => [`${value}%`, 'Occupancy Rate']}
                  />
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
                  <Tooltip formatter={value => [value, 'Average Rating']} />
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
                  <Tooltip
                    formatter={value => [`$${value}`, 'Average Price']}
                  />
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
                    label={({ platform, marketShare }) =>
                      `${platform}: ${marketShare}%`
                    }
                  >
                    {competitiveData.platforms.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
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
                    <span
                      className={`font-semibold ${
                        parseFloat(opportunityData.metrics.priceGrowth) >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
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

      {activeTab === 'april-analysis' && (
        <div className="space-y-6">
          {/* April 2025 Analysis Overview */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">📊</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  April 2025 Daily Market Analysis
                </h2>
                <p className="text-gray-600">
                  Comprehensive daily AirBnB data across all Peel Region
                  municipalities
                </p>
              </div>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">3,275</div>
                <div className="text-sm text-gray-600">Total Listings</div>
                <div className="text-xs text-blue-500">30 days analyzed</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$94</div>
                <div className="text-sm text-gray-600">Avg Price/Night</div>
                <div className="text-xs text-green-500">Weighted average</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">109</div>
                <div className="text-sm text-gray-600">Daily Avg Listings</div>
                <div className="text-xs text-purple-500">
                  Across all regions
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">$495</div>
                <div className="text-sm text-gray-600">Price Range</div>
                <div className="text-xs text-orange-500">$10 - $505</div>
              </div>
            </div>

            {/* Municipality Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🏢</span>
                  <h3 className="text-lg font-bold text-blue-800">
                    Mississauga
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">
                      Total Listings:
                    </span>
                    <span className="font-semibold text-blue-900">1,493</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Avg Price:</span>
                    <span className="font-semibold text-blue-900">
                      $96/night
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Market Share:</span>
                    <span className="font-semibold text-blue-900">46%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">
                      Daily Average:
                    </span>
                    <span className="font-semibold text-blue-900">
                      50 listings
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🏘️</span>
                  <h3 className="text-lg font-bold text-green-800">Brampton</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">
                      Total Listings:
                    </span>
                    <span className="font-semibold text-green-900">1,149</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Avg Price:</span>
                    <span className="font-semibold text-green-900">
                      $72/night
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">
                      Market Share:
                    </span>
                    <span className="font-semibold text-green-900">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">
                      Daily Average:
                    </span>
                    <span className="font-semibold text-green-900">
                      38 listings
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🌲</span>
                  <h3 className="text-lg font-bold text-purple-800">Caledon</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-700">
                      Total Listings:
                    </span>
                    <span className="font-semibold text-purple-900">633</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-700">Avg Price:</span>
                    <span className="font-semibold text-purple-900">
                      $130/night
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-700">
                      Market Share:
                    </span>
                    <span className="font-semibold text-purple-900">19%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-700">
                      Daily Average:
                    </span>
                    <span className="font-semibold text-purple-900">
                      21 listings
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center gap-2">
                  <span>💰</span>
                  Pricing Insights
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>
                      Caledon commands 81% premium over Brampton ($130 vs $72)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>
                      Mississauga offers mid-range pricing at $96/night
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>
                      Weekend pricing increases: Caledon +50%, Mississauga +30%
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>
                      Easter weekend showed major demand surge (+22% supply)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <span>📈</span>
                  Supply Patterns
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Mississauga dominates with 46% market share</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Weekend supply increases 18% across all markets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Caledon operates as boutique market (19% share)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>
                      Daily listings range: 85-130 across all municipalities
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() =>
                  alert('Feature coming soon: Detailed municipality breakdown')
                }
                className={designSystem.components.button.primary}
              >
                View Detailed Analysis
              </button>
              <button
                onClick={() => alert('Feature coming soon: Export April data')}
                className={designSystem.components.button.success}
              >
                Export April Data
              </button>
              <button
                onClick={() => alert('Feature coming soon: Generate report')}
                className={designSystem.components.button.warning}
              >
                Generate Report
              </button>
            </div>
          </div>

          {/* Data Source Information */}
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-lg">ℹ️</span>
              <div>
                <h4 className="font-semibold text-gray-800">
                  Data Source & Methodology
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  This analysis is based on simulated daily AirBnB data for
                  April 2025, modeling realistic market patterns including
                  weekend effects, holiday impacts, and regional pricing
                  differences. The data represents 30 days of comprehensive
                  market tracking across Mississauga, Brampton, and Caledon.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  📁 Data files: mississauga_daily_april_2025.json,
                  brampton_daily_april_2025.json, caledon_daily_april_2025.json,
                  peel_region_comparative_analysis_april_2025.json
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirBnbDashboard;
