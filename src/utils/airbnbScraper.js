import axios from 'axios';
import { format, subDays } from 'date-fns';

class AirBnbScraper {
  constructor() {
    this.baseUrl = 'https://www.airbnb.com';
    this.searchEndpoint = '/api/v3/StaysSearch';
    this.rateLimit = 1000; // 1 second between requests
    this.lastRequestTime = 0;
    
    // Configure axios with headers that mimic a real browser
    this.client = axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
  }

  // Rate limiting utility
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimit) {
      const waitTime = this.rateLimit - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  // Search parameters builder
  buildSearchParams(location, checkIn, checkOut, adults = 2, children = 0) {
    const checkinDate = format(new Date(checkIn), 'yyyy-MM-dd');
    const checkoutDate = format(new Date(checkOut), 'yyyy-MM-dd');
    
    return {
      operationName: 'StaysSearch',
      locale: 'en-CA',
      currency: 'CAD',
      variables: {
        staysSearchRequest: {
          requestedPageType: 'STAYS_SEARCH',
          cursor: '',
          limit: 50,
          query: location,
          checkin: checkinDate,
          checkout: checkoutDate,
          adults: adults,
          children: children,
          infants: 0,
          pets: 0,
          priceFilterInputType: 0,
          priceFilterNumNights: 1,
          categoryTag: '',
          channel: 'EXPLORE',
          itemsPerGrid: 50,
          placeId: '',
          refinementPaths: [],
          searchByMap: false,
          tabId: 'home_tab',
          flexibleTripLengths: ['weekend_trip'],
          datePickerType: 'calendar',
          source: 'structured_search_input_header',
          searchType: 'filter_change'
        }
      }
    };
  }

  // Main scraping method for search results
  async scrapeListings(location, checkIn, checkOut, adults = 2) {
    try {
      await this.waitForRateLimit();
      
      console.log(`Scraping AirBnB listings for ${location}...`);
      
      // Note: Direct API calls to AirBnB will be blocked by CORS in browser
      // This is a template for server-side implementation or proxy usage
      const allListings = [];
      
      // Simulate API response structure for demo purposes
      // In production, you'd use a proxy server or backend service
      const mockData = this.generateMockData(location, checkIn, checkOut);
      allListings.push(...mockData);
      
      console.log(`Found ${allListings.length} listings`);
      return this.processListings(allListings);
      
    } catch (error) {
      console.error('Error scraping AirBnB listings:', error);
      throw new Error(`Failed to scrape listings: ${error.message}`);
    }
  }

  // Generate mock data for demonstration (replace with real scraping in backend)
  generateMockData(location, checkIn, checkOut) {
    const listings = [];
    const regions = ['Mississauga', 'Brampton', 'Caledon'];
    const propertyTypes = ['Entire home', 'Private room', 'Shared room', 'Hotel room'];
    
    for (let i = 0; i < 50; i++) {
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      const randomType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const basePrice = Math.floor(Math.random() * 200) + 50;
      const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
      const reviews = Math.floor(Math.random() * 200) + 5;
      
      listings.push({
        id: `listing_${i}`,
        title: `Beautiful ${randomType} in ${randomRegion}`,
        location: randomRegion,
        propertyType: randomType,
        pricePerNight: basePrice,
        totalPrice: basePrice * this.calculateNights(checkIn, checkOut),
        rating: parseFloat(rating),
        reviewCount: reviews,
        host: {
          id: `host_${i}`,
          name: `Host ${i}`,
          isSuperhost: Math.random() > 0.7
        },
        amenities: this.generateRandomAmenities(),
        availability: {
          checkIn: checkIn,
          checkOut: checkOut,
          minimumNights: Math.floor(Math.random() * 3) + 1
        },
        coordinates: this.generateCoordinates(randomRegion),
        scrapedAt: new Date().toISOString()
      });
    }
    
    return listings;
  }

  // Process and clean scraped data
  processListings(rawListings) {
    return rawListings.map(listing => ({
      ...listing,
      pricePerNight: parseFloat(listing.pricePerNight) || 0,
      rating: parseFloat(listing.rating) || 0,
      reviewCount: parseInt(listing.reviewCount) || 0,
      processed: true,
      processedAt: new Date().toISOString()
    }));
  }

  // Utility methods
  calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  generateRandomAmenities() {
    const allAmenities = [
      'WiFi', 'Kitchen', 'Washer', 'Dryer', 'AC', 'Heating', 'TV', 
      'Parking', 'Pool', 'Gym', 'Hot tub', 'Pets allowed', 'Smoking allowed'
    ];
    
    const count = Math.floor(Math.random() * 8) + 3;
    const shuffled = allAmenities.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  generateCoordinates(region) {
    const regionCoords = {
      'Mississauga': { lat: 43.5890, lng: -79.6441 },
      'Brampton': { lat: 43.7315, lng: -79.7624 },
      'Caledon': { lat: 43.8361, lng: -79.9967 }
    };
    
    const base = regionCoords[region] || regionCoords['Mississauga'];
    return {
      latitude: base.lat + (Math.random() - 0.5) * 0.1,
      longitude: base.lng + (Math.random() - 0.5) * 0.1
    };
  }

  // Historical data simulation for trend analysis
  async scrapeHistoricalData(location, months = 6) {
    const historicalData = [];
    const today = new Date();
    
    for (let i = months; i >= 0; i--) {
      const date = subDays(today, i * 30);
      const checkIn = format(date, 'yyyy-MM-dd');
      const checkOut = format(subDays(date, -7), 'yyyy-MM-dd');
      
      try {
        await this.waitForRateLimit();
        const monthlyData = await this.scrapeListings(location, checkIn, checkOut, 2, 1);
        
        historicalData.push({
          month: format(date, 'yyyy-MM'),
          date: date.toISOString(),
          listings: monthlyData,
          summary: this.generateMonthlySummary(monthlyData)
        });
        
        console.log(`Scraped data for ${format(date, 'MMM yyyy')}`);
      } catch (error) {
        console.error(`Error scraping data for ${format(date, 'MMM yyyy')}:`, error);
      }
    }
    
    return historicalData;
  }

  generateMonthlySummary(listings) {
    if (!listings || listings.length === 0) {
      return {
        totalListings: 0,
        averagePrice: 0,
        averageRating: 0,
        occupancyRate: 0
      };
    }

    const totalListings = listings.length;
    const averagePrice = listings.reduce((sum, listing) => sum + listing.pricePerNight, 0) / totalListings;
    const averageRating = listings.reduce((sum, listing) => sum + listing.rating, 0) / totalListings;
    const occupancyRate = Math.random() * 0.4 + 0.6; // Simulate 60-100% occupancy

    return {
      totalListings,
      averagePrice: Math.round(averagePrice * 100) / 100,
      averageRating: Math.round(averageRating * 10) / 10,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      priceRange: {
        min: Math.min(...listings.map(l => l.pricePerNight)),
        max: Math.max(...listings.map(l => l.pricePerNight))
      }
    };
  }
}

// Trend analysis utilities
export const analyzeTrends = (historicalData) => {
  if (!historicalData || historicalData.length < 2) {
    return null;
  }

  const trends = {
    pricetrend: calculatePriceTrend(historicalData),
    listingCountTrend: calculateListingCountTrend(historicalData),
    ratingTrend: calculateRatingTrend(historicalData),
    seasonalPatterns: identifySeasonalPatterns(historicalData)
  };

  return trends;
};

const calculatePriceTrend = (data) => {
  const prices = data.map(d => d.summary.averagePrice);
  const firstHalf = prices.slice(0, Math.floor(prices.length / 2));
  const secondHalf = prices.slice(Math.floor(prices.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  return {
    direction: change > 0 ? 'increasing' : 'decreasing',
    percentage: Math.abs(change).toFixed(1),
    current: secondAvg.toFixed(2),
    previous: firstAvg.toFixed(2)
  };
};

const calculateListingCountTrend = (data) => {
  const counts = data.map(d => d.summary.totalListings);
  const firstHalf = counts.slice(0, Math.floor(counts.length / 2));
  const secondHalf = counts.slice(Math.floor(counts.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  return {
    direction: change > 0 ? 'increasing' : 'decreasing',
    percentage: Math.abs(change).toFixed(1),
    current: Math.round(secondAvg),
    previous: Math.round(firstAvg)
  };
};

const calculateRatingTrend = (data) => {
  const ratings = data.map(d => d.summary.averageRating);
  const firstHalf = ratings.slice(0, Math.floor(ratings.length / 2));
  const secondHalf = ratings.slice(Math.floor(ratings.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const change = secondAvg - firstAvg;
  
  return {
    direction: change > 0 ? 'increasing' : 'decreasing',
    change: Math.abs(change).toFixed(2),
    current: secondAvg.toFixed(2),
    previous: firstAvg.toFixed(2)
  };
};

const identifySeasonalPatterns = (data) => {
  const monthlyAverages = {};
  
  data.forEach(d => {
    const monthName = new Date(d.date).toLocaleString('default', { month: 'long' });
    
    if (!monthlyAverages[monthName]) {
      monthlyAverages[monthName] = [];
    }
    monthlyAverages[monthName].push(d.summary.averagePrice);
  });
  
  const seasonalData = Object.entries(monthlyAverages).map(([month, prices]) => ({
    month,
    averagePrice: prices.reduce((a, b) => a + b, 0) / prices.length
  }));
  
  return seasonalData.sort((a, b) => 
    new Date(Date.parse(a.month + " 1, 2024")) - new Date(Date.parse(b.month + " 1, 2024"))
  );
};

export default AirBnbScraper;