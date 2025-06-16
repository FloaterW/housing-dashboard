import AirBnbScraper, { analyzeTrends } from '../utils/airbnbScraper';
import { format, subMonths, startOfMonth } from 'date-fns';

// Initialize scraper instance
const scraper = new AirBnbScraper();

// Mock historical data for demonstration
export const generateAirBnbHistoricalData = () => {
  const months = 12;
  const data = [];
  const regions = ['Mississauga', 'Brampton', 'Caledon'];
  
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const monthStart = startOfMonth(date);
    
    regions.forEach(region => {
      // Simulate seasonal pricing patterns
      const seasonalMultiplier = getSeasonalMultiplier(date.getMonth());
      const basePrice = getRegionBasePrice(region);
      
      data.push({
        date: format(monthStart, 'yyyy-MM-dd'),
        month: format(monthStart, 'MMM yyyy'),
        region: region,
        averagePrice: Math.round(basePrice * seasonalMultiplier),
        totalListings: Math.floor(Math.random() * 100) + 150,
        averageRating: (Math.random() * 1.5 + 3.5).toFixed(1),
        occupancyRate: Math.round((Math.random() * 30 + 60)),
        newListings: Math.floor(Math.random() * 20) + 5,
        reviewCount: Math.floor(Math.random() * 500) + 100,
        superhostPercentage: Math.round(Math.random() * 30 + 20),
        averageResponseTime: Math.floor(Math.random() * 120) + 30, // minutes
        propertyTypes: generatePropertyTypeData(),
        priceRanges: generatePriceRangeData(basePrice * seasonalMultiplier),
        amenityPopularity: generateAmenityData()
      });
    });
  }
  
  return data;
};

// Regional base pricing
const getRegionBasePrice = (region) => {
  const basePrices = {
    'Mississauga': 120,
    'Brampton': 95,
    'Caledon': 150
  };
  return basePrices[region] || 110;
};

// Seasonal pricing multipliers
const getSeasonalMultiplier = (month) => {
  const seasonalFactors = {
    0: 0.8,  // January
    1: 0.8,  // February
    2: 0.9,  // March
    3: 1.0,  // April
    4: 1.1,  // May
    5: 1.3,  // June
    6: 1.4,  // July
    7: 1.4,  // August
    8: 1.2,  // September
    9: 1.1,  // October
    10: 0.9, // November
    11: 1.0  // December
  };
  return seasonalFactors[month] || 1.0;
};

// Property type distribution
const generatePropertyTypeData = () => {
  return [
    { type: 'Entire home/apt', count: Math.floor(Math.random() * 50) + 30, percentage: null },
    { type: 'Private room', count: Math.floor(Math.random() * 30) + 15, percentage: null },
    { type: 'Shared room', count: Math.floor(Math.random() * 10) + 2, percentage: null },
    { type: 'Hotel room', count: Math.floor(Math.random() * 15) + 5, percentage: null }
  ].map(item => {
    const total = 100; // Approximate total for percentage calculation
    return { ...item, percentage: Math.round((item.count / total) * 100) };
  });
};

// Price range distribution
const generatePriceRangeData = (averagePrice) => {
  const ranges = [
    { range: '$0-50', count: Math.floor(Math.random() * 10) + 2 },
    { range: '$50-100', count: Math.floor(Math.random() * 25) + 15 },
    { range: '$100-150', count: Math.floor(Math.random() * 30) + 20 },
    { range: '$150-200', count: Math.floor(Math.random() * 20) + 10 },
    { range: '$200-300', count: Math.floor(Math.random() * 15) + 8 },
    { range: '$300+', count: Math.floor(Math.random() * 10) + 3 }
  ];
  
  // Adjust distribution based on average price
  if (averagePrice > 150) {
    ranges[4].count += 10;
    ranges[5].count += 5;
  } else if (averagePrice < 100) {
    ranges[1].count += 15;
    ranges[2].count += 10;
  }
  
  return ranges;
};

// Amenity popularity data
const generateAmenityData = () => {
  const amenities = [
    'WiFi', 'Kitchen', 'Washer', 'Air conditioning', 'Heating',
    'TV', 'Parking', 'Pool', 'Hot tub', 'Gym', 'Pets allowed'
  ];
  
  return amenities.map(amenity => ({
    amenity,
    percentage: Math.floor(Math.random() * 60) + 20 // 20-80% availability
  })).sort((a, b) => b.percentage - a.percentage);
};

// Competitive analysis data
export const generateCompetitiveAnalysisData = () => {
  const regions = ['Mississauga', 'Brampton', 'Caledon'];
  const platforms = ['Airbnb', 'VRBO', 'Booking.com'];
  
  return regions.map(region => {
    const regionData = platforms.map(platform => ({
      platform,
      averagePrice: Math.floor(Math.random() * 50) + 100,
      listingCount: Math.floor(Math.random() * 200) + 100,
      averageRating: (Math.random() * 1 + 4).toFixed(1),
      marketShare: Math.floor(Math.random() * 40) + 20
    }));
    
    // Normalize market share to 100%
    const totalShare = regionData.reduce((sum, item) => sum + item.marketShare, 0);
    regionData.forEach(item => {
      item.marketShare = Math.round((item.marketShare / totalShare) * 100);
    });
    
    return {
      region,
      platforms: regionData
    };
  });
};

// Performance metrics calculation
export const calculateAirBnbMetrics = (data) => {
  if (!data || data.length === 0) return null;
  
  const latestMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];
  
  const calculateChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };
  
  return {
    totalListings: data.reduce((sum, item) => sum + item.totalListings, 0),
    averagePrice: {
      current: latestMonth?.averagePrice || 0,
      change: calculateChange(latestMonth?.averagePrice, previousMonth?.averagePrice)
    },
    occupancyRate: {
      current: latestMonth?.occupancyRate || 0,
      change: calculateChange(latestMonth?.occupancyRate, previousMonth?.occupancyRate)
    },
    averageRating: {
      current: latestMonth?.averageRating || 0,
      change: calculateChange(latestMonth?.averageRating, previousMonth?.averageRating)
    },
    newListings: {
      current: latestMonth?.newListings || 0,
      change: calculateChange(latestMonth?.newListings, previousMonth?.newListings)
    },
    superhostPercentage: latestMonth?.superhostPercentage || 0,
    averageResponseTime: latestMonth?.averageResponseTime || 0
  };
};

// Revenue estimation
export const estimateAirBnbRevenue = (data, region) => {
  const regionData = data.filter(item => item.region === region);
  if (regionData.length === 0) return null;
  
  const latestData = regionData[regionData.length - 1];
  const averagePrice = latestData.averagePrice;
  const occupancyRate = latestData.occupancyRate / 100;
  const totalListings = latestData.totalListings;
  
  // Estimate monthly revenue per listing
  const daysInMonth = 30;
  const averageBookingDuration = 3; // days
  const bookingsPerMonth = (daysInMonth * occupancyRate) / averageBookingDuration;
  const monthlyRevenuePerListing = bookingsPerMonth * averagePrice * averageBookingDuration;
  
  // Total market revenue estimate
  const totalMarketRevenue = monthlyRevenuePerListing * totalListings;
  
  return {
    region,
    monthlyRevenuePerListing: Math.round(monthlyRevenuePerListing),
    totalMarketRevenue: Math.round(totalMarketRevenue),
    averagePrice,
    occupancyRate: Math.round(occupancyRate * 100),
    estimatedBookingsPerMonth: Math.round(bookingsPerMonth),
    averageBookingDuration
  };
};

// Market opportunity analysis
export const analyzeMarketOpportunity = (data) => {
  const regions = ['Mississauga', 'Brampton', 'Caledon'];
  
  return regions.map(region => {
    const regionData = data.filter(item => item.region === region);
    const latest = regionData[regionData.length - 1];
    const sixMonthsAgo = regionData[regionData.length - 6];
    
    if (!latest || !sixMonthsAgo) return null;
    
    const priceGrowth = ((latest.averagePrice - sixMonthsAgo.averagePrice) / sixMonthsAgo.averagePrice * 100);
    const listingGrowth = ((latest.totalListings - sixMonthsAgo.totalListings) / sixMonthsAgo.totalListings * 100);
    const demandIndicator = latest.occupancyRate;
    
    // Opportunity score calculation (0-100)
    let opportunityScore = 0;
    
    // High occupancy = good demand
    if (demandIndicator > 80) opportunityScore += 30;
    else if (demandIndicator > 70) opportunityScore += 20;
    else if (demandIndicator > 60) opportunityScore += 10;
    
    // Positive price growth = market strength
    if (priceGrowth > 10) opportunityScore += 25;
    else if (priceGrowth > 5) opportunityScore += 15;
    else if (priceGrowth > 0) opportunityScore += 10;
    
    // Moderate listing growth = healthy competition
    if (listingGrowth > 0 && listingGrowth < 20) opportunityScore += 20;
    else if (listingGrowth > 20) opportunityScore += 10; // High competition
    
    // High ratings indicate quality market
    if (latest.averageRating > 4.5) opportunityScore += 15;
    else if (latest.averageRating > 4.0) opportunityScore += 10;
    else if (latest.averageRating > 3.5) opportunityScore += 5;
    
    // Response time factor
    if (latest.averageResponseTime < 60) opportunityScore += 10;
    else if (latest.averageResponseTime < 120) opportunityScore += 5;
    
    return {
      region,
      opportunityScore: Math.min(opportunityScore, 100),
      metrics: {
        priceGrowth: priceGrowth.toFixed(1),
        listingGrowth: listingGrowth.toFixed(1),
        occupancyRate: demandIndicator,
        averageRating: latest.averageRating,
        averageResponseTime: latest.averageResponseTime
      },
      recommendation: getOpportunityRecommendation(opportunityScore),
      risks: identifyMarketRisks(latest, priceGrowth, listingGrowth)
    };
  }).filter(Boolean);
};

const getOpportunityRecommendation = (score) => {
  if (score >= 80) return 'Excellent market opportunity - High demand, strong pricing, quality standards';
  if (score >= 60) return 'Good market opportunity - Solid fundamentals with growth potential';
  if (score >= 40) return 'Moderate opportunity - Consider market conditions and competition';
  return 'Limited opportunity - High competition or market challenges';
};

const identifyMarketRisks = (data, priceGrowth, listingGrowth) => {
  const risks = [];
  
  if (listingGrowth > 25) risks.push('High competition - Rapid increase in listings');
  if (data.occupancyRate < 60) risks.push('Low demand - Below average occupancy rates');
  if (priceGrowth < -5) risks.push('Price decline - Negative pricing trend');
  if (data.averageRating < 4.0) risks.push('Quality concerns - Below average guest satisfaction');
  if (data.averageResponseTime > 180) risks.push('Service issues - Slow host response times');
  
  return risks.length > 0 ? risks : ['No significant risks identified'];
};

// Export the main data
export const airbnbHistoricalData = generateAirBnbHistoricalData();
export const airbnbCompetitiveData = generateCompetitiveAnalysisData();
export const airbnbMetrics = calculateAirBnbMetrics(airbnbHistoricalData);
export const airbnbOpportunityAnalysis = analyzeMarketOpportunity(airbnbHistoricalData);