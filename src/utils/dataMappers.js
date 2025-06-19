import { format, parseISO } from 'date-fns';

// ===== REGION AND TYPE MAPPING =====

// Map frontend region names to backend database IDs
export const mapRegionToId = regionName => {
  const mapping = {
    'Peel Region': 1,
    Mississauga: 2,
    Brampton: 3,
    Caledon: 4,
  };
  return mapping[regionName] || 2; // Default to Mississauga (has actual data)
};

// Map backend region IDs to frontend names
export const mapIdToRegion = regionId => {
  const mapping = {
    1: 'Peel Region',
    2: 'Mississauga',
    3: 'Brampton',
    4: 'Caledon',
  };
  return mapping[regionId] || 'Mississauga';
};

// Map frontend housing type names to backend database IDs
export const mapHousingTypeToId = typeName => {
  const mapping = {
    'All Types': 1,
    Detached: 2,
    'Semi-Detached': 3,
    Townhouse: 4,
    Condo: 5,
  };
  return mapping[typeName] || 1; // Default to All Types
};

// Map backend housing type IDs to frontend names
export const mapIdToHousingType = typeId => {
  const mapping = {
    1: 'All Types',
    2: 'Detached',
    3: 'Semi-Detached',
    4: 'Townhouse',
    5: 'Condo',
  };
  return mapping[typeId] || 'All Types';
};

// ===== DATA TRANSFORMATION FUNCTIONS =====

// Transform backend price trends data to frontend format
export const transformPriceData = backendData => {
  if (!Array.isArray(backendData)) return [];

  return backendData.map(item => ({
    month: formatMonth(item.month),
    price: Math.round(item.avg_price || 0),
    change: parseFloat(item.mom_change_pct || 0),
    minPrice: Math.round(item.min_price || 0),
    maxPrice: Math.round(item.max_price || 0),
    salesCount: parseInt(item.sales_count || 0),
  }));
};

// Transform backend sales data to frontend format
export const transformSalesData = backendData => {
  if (!Array.isArray(backendData)) return [];

  return backendData.map(item => ({
    month: formatMonth(item.sale_date),
    sales: parseInt(item.sales_count || 0),
    avgPrice: Math.round(item.avg_sale_price || 0),
    totalValue: Math.round(item.total_sales_value || 0),
  }));
};

// Transform backend market metrics to frontend format
export const transformMarketMetrics = backendData => {
  if (!backendData) return {};

  return {
    avgPrice: Math.round(parseFloat(backendData.avg_price || 0)),
    priceChange: parseFloat(backendData.price_change_pct || 0),
    totalSales: parseInt(backendData.total_sales || 0),
    salesChange: parseFloat(backendData.sales_change_pct || 0),
    avgDaysOnMarket: Math.round(
      parseFloat(backendData.avg_days_on_market || 0)
    ),
    daysChange: parseFloat(backendData.days_change_pct || 0),
    inventory: parseInt(backendData.active_listings || 0),
    inventoryChange: parseFloat(backendData.inventory_change_pct || 0),
  };
};

// Transform backend housing distribution data to frontend format
export const transformHousingDistribution = backendData => {
  if (!Array.isArray(backendData)) return [];

  return backendData.map(item => ({
    type: mapIdToHousingType(item.housing_type_id),
    count: parseInt(item.total_stock_count || 0),
    percentage: parseFloat(item.market_share_pct || 0),
    avgPrice: Math.round(item.avg_price || 0),
  }));
};

// Transform backend AirBnB metrics to frontend format
export const transformAirBnbMetrics = backendData => {
  if (!backendData) return {};

  return {
    totalListings: parseInt(backendData.total_listings || 0),
    averagePrice: {
      current: Math.round(backendData.avg_nightly_rate || 0),
      change: parseFloat(backendData.price_change_pct || 0).toFixed(1),
    },
    occupancyRate: {
      current: Math.round(backendData.avg_occupancy_rate || 0),
      change: parseFloat(backendData.occupancy_change_pct || 0).toFixed(1),
    },
    averageRating: {
      current: parseFloat(backendData.avg_rating || 0).toFixed(1),
      change: parseFloat(backendData.rating_change_pct || 0).toFixed(1),
    },
    newListings: {
      current: parseInt(backendData.new_listings || 0),
      change: parseFloat(backendData.new_listings_change_pct || 0).toFixed(1),
    },
  };
};

// Transform backend AirBnB listings to frontend format
export const transformAirBnbListings = backendData => {
  if (!Array.isArray(backendData)) return [];

  return backendData.map(item => ({
    id: item.id,
    nightly_rate: Math.round(item.nightly_rate || 0),
    cleaning_fee: Math.round(item.cleaning_fee || 0),
    bedrooms: parseInt(item.bedrooms || 0),
    bathrooms: parseFloat(item.bathrooms || 0),
    max_guests: parseInt(item.max_guests || 0),
    occupancy_rate: Math.round(item.occupancy_rate || 0),
    monthly_revenue: Math.round(item.monthly_revenue || 0),
    average_rating: parseFloat(item.average_rating || 0).toFixed(1),
    total_reviews: parseInt(item.total_reviews || 0),
    is_entire_home: Boolean(item.is_entire_home),
    is_superhost: Boolean(item.is_superhost),
    instant_book: Boolean(item.instant_book),
    region_name: item.region_name,
    housing_type_name: item.housing_type_name,
  }));
};

// Transform backend rental data to frontend format
export const transformRentalData = backendData => {
  if (!Array.isArray(backendData)) return [];

  return backendData.map(item => ({
    month: formatMonth(item.month),
    avgRent: Math.round(item.avg_rent || 0),
    medianRent: Math.round(item.median_rent || 0),
    vacancyRate: parseFloat(item.vacancy_rate_pct || 0),
    yoyGrowth: parseFloat(item.yoy_growth_pct || 0),
    totalUnits: parseInt(item.total_rental_units || 0),
    availableUnits: parseInt(item.available_units || 0),
  }));
};

// ===== UTILITY FUNCTIONS =====

// Format month from backend date format to frontend display format
export const formatMonth = dateString => {
  if (!dateString) return '';

  try {
    // Handle different date formats
    let date;
    if (dateString.includes('-')) {
      // ISO format: 2024-01-01
      date = parseISO(dateString);
    } else {
      // Already formatted: "Jan 2024"
      return dateString;
    }

    return format(date, 'MMM yyyy'); // "Jan 2024"
  } catch (error) {
    console.warn('Error formatting date:', dateString, error);
    return dateString; // Return as-is if parsing fails
  }
};

// Generate date range for API calls
export const generateDateRange = (months = 12) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return {
    startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD
    endDate: endDate.toISOString().split('T')[0],
  };
};

// Validate and clean numeric values
export const safeNumber = (value, defaultValue = 0) => {
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Format currency values
export const formatCurrency = (value, locale = 'en-CA') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
};

// Format percentage values
export const formatPercentage = (value, decimals = 1) => {
  return `${(value || 0).toFixed(decimals)}%`;
};

// ===== ERROR HANDLING =====

// Provide fallback data structure for failed API calls
export const getFallbackMetrics = (
  selectedRegion = 'Peel Region',
  selectedHousingType = 'All Types'
) => {
  // Return reasonable estimates based on region and housing type
  // This prevents showing all zeros when no data is available

  const basePrice =
    selectedRegion === 'Mississauga'
      ? 1350000
      : selectedRegion === 'Brampton'
        ? 1150000
        : selectedRegion === 'Caledon'
          ? 1650000
          : 1400000;

  const typeMultiplier =
    selectedHousingType === 'Detached'
      ? 1.3
      : selectedHousingType === 'Semi-Detached'
        ? 0.8
        : selectedHousingType === 'Townhouse'
          ? 0.7
          : selectedHousingType === 'Condo'
            ? 0.5
            : 1.0;

  return {
    avgPrice: Math.round(basePrice * typeMultiplier),
    priceChange: 0,
    totalSales: 0,
    salesChange: 0,
    avgDaysOnMarket: 0,
    daysChange: 0,
    inventory: 0,
    inventoryChange: 0,
  };
};

// Provide fallback empty chart data
export const getFallbackChartData = () => [];

// Check if data is valid and not empty
export const isValidData = data => {
  return (
    data &&
    ((Array.isArray(data) && data.length > 0) ||
      (typeof data === 'object' && Object.keys(data).length > 0))
  );
};
