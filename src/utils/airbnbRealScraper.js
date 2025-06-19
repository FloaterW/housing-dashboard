import axios from 'axios';
import { format, addDays } from 'date-fns';
import logger from './logger';

class AirBnbRealScraper {
  constructor() {
    this.baseUrl = 'https://www.airbnb.com';
    this.searchUrl = '/api/v3/StaysSearch';
    this.rateLimit = 2000; // 2 seconds between requests to be respectful
    this.lastRequestTime = 0;
    this.corsProxies = [
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url=',
      'https://proxy.cors.sh/',
    ];

    this.client = axios.create({
      timeout: 15000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      },
    });

    this.rateLimiter = {
      requests: 0,
      lastReset: Date.now(),
      maxRequests: 10,
      timeWindow: 60000, // 1 minute
    };
  }

  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.rateLimit) {
      const waitTime = this.rateLimit - timeSinceLastRequest;
      logger.debug(`Rate limiting: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  // Build AirBnB search URL for direct scraping
  buildSearchUrl(location, checkIn, checkOut, adults = 2) {
    const checkinDate = format(new Date(checkIn), 'yyyy-MM-dd');
    const checkoutDate = format(new Date(checkOut), 'yyyy-MM-dd');

    const params = new URLSearchParams({
      place_id: '',
      query: location,
      checkin: checkinDate,
      checkout: checkoutDate,
      adults: adults.toString(),
      children: '0',
      infants: '0',
      pets: '0',
      page: '1',
      tab_id: 'home_tab',
      refinement_paths: '[]',
      flexible_trip_lengths: '["weekend_trip"]',
      monthly_start_date: checkinDate,
      monthly_length: '3',
      price_filter_input_type: '0',
      channel: 'EXPLORE',
      date_picker_type: 'calendar',
      source: 'structured_search_input_header',
      search_type: 'autocomplete_click',
    });

    return `${this.baseUrl}/s/${encodeURIComponent(location)}/homes?${params.toString()}`;
  }

  // Rate limiting to avoid overwhelming servers
  async rateLimit() {
    const now = Date.now();

    // Reset counter if time window has passed
    if (now - this.rateLimiter.lastReset > this.rateLimiter.timeWindow) {
      this.rateLimiter.requests = 0;
      this.rateLimiter.lastReset = now;
    }

    // If we've hit the limit, wait
    if (this.rateLimiter.requests >= this.rateLimiter.maxRequests) {
      const waitTime =
        this.rateLimiter.timeWindow - (now - this.rateLimiter.lastReset);
      logger.debug(`Rate limiting: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));

      // Reset after waiting
      this.rateLimiter.requests = 0;
      this.rateLimiter.lastReset = Date.now();
    }

    this.rateLimiter.requests++;
  }

  // Method 1: Direct API call (works in backend/extension)
  async tryDirectApiCall(location, checkIn, checkOut, adults) {
    try {
      await this.rateLimit();

      // AirBnB's search API endpoint (simplified)
      const apiUrl = `https://www.airbnb.com/api/v3/StaySearch`;

      const params = {
        operationName: 'StaysSearch',
        locale: 'en',
        currency: 'CAD',
        variables: {
          request: {
            metadataOnly: false,
            version: '1.8.6',
            tabId: 'home_tab',
            refinementPaths: ['/homes'],
            flexibleTripLengths: [],
            dateSearchType: 'calendar',
            placeId: null,
            source: 'structured_search_input_header',
            searchType: 'pagination',
            query: location,
            cdnCacheSafe: false,
            simpleSearchTreatment: 'simple_search_only',
            treatmentFlags: ['simple_search_only', 'simple_search_desktop_v3'],
            searchByMap: false,
            isInitialLoad: true,
          },
        },
      };

      logger.debug('🔄 Attempting direct API call...');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'X-Airbnb-Api-Key': 'd306zoyjsyarp7ifhu67rjxn52tv0t20', // Public API key
          'X-Airbnb-GraphQL-Platform': 'web',
          'X-Airbnb-GraphQL-Platform-Client': 'minimalist-niobe',
          'X-Airbnb-Supports-Airlock-V2': 'true',
          'X-Niobe-Short-Circuited': 'true',
          'X-CSRF-Token': 'null',
          'X-CSRF-Without-Token': '1',
        },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.data && data.data.dora && data.data.dora.exploreV3) {
          const sections = data.data.dora.exploreV3.sections;
          let listings = [];

          sections.forEach(section => {
            if (section.items) {
              section.items.forEach(item => {
                if (item.listing) {
                  listings.push(this.parseApiListing(item.listing));
                }
              });
            }
          });

          logger.debug('✅ Direct API call successful!');
          return listings;
        }
      }

      throw new Error('Invalid response structure');
    } catch (error) {
      logger.warn('❌ Direct API call failed:', error.message);
      throw error;
    }
  }

  // Method 2: Try different CORS proxies
  async tryCorsProxy(location, checkIn, checkOut, adults) {
    const proxies = [
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url=',
      'https://crossorigin.me/',
    ];

    for (const proxy of proxies) {
      try {
        await this.rateLimit();

        logger.debug(`🔄 Attempting CORS proxy: ${proxy}`);

        const searchUrl = `https://www.airbnb.ca/s/${encodeURIComponent(location)}/homes`;
        const proxiedUrl = proxy + encodeURIComponent(searchUrl);

        const response = await fetch(proxiedUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (response.ok) {
          const html = await response.text();
          const listings = this.parseHtmlResponse(html);

          if (listings.length > 0) {
            logger.debug(`✅ CORS proxy successful: ${proxy}`);
            return listings;
          }
        }
      } catch (error) {
        logger.warn(`❌ CORS proxy failed (${proxy}):`, error.message);
        continue;
      }
    }

    throw new Error('All CORS proxies failed');
  }

  // Method 3: Try alternative endpoints
  async tryAlternativeEndpoints(location, checkIn, checkOut, adults) {
    const endpoints = [
      `https://www.airbnb.com/api/v2/explore_tabs?_format=for_explore_search_web`,
      `https://www.airbnb.com/api/v3/StaySearch`,
      `https://www.airbnb.com/api/v2/search_results`,
    ];

    for (const endpoint of endpoints) {
      try {
        await this.rateLimit();

        logger.debug(`🔄 Attempting alternative endpoint: ${endpoint}`);

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; housing-dashboard/1.0)',
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const listings = this.parseEndpointResponse(data);

          if (listings.length > 0) {
            logger.debug(`✅ Alternative endpoint successful: ${endpoint}`);
            return listings;
          }
        }
      } catch (error) {
        logger.warn(
          `❌ Alternative endpoint failed (${endpoint}):`,
          error.message
        );
        continue;
      }
    }

    throw new Error('All alternative endpoints failed');
  }

  // Parse API response listing
  parseApiListing(listing) {
    try {
      return {
        id: listing.id,
        name: listing.name,
        price: listing.pricing?.rate?.amount || 0,
        currency: listing.pricing?.rate?.currency || 'CAD',
        roomType: listing.roomTypeCategory,
        latitude: listing.lat,
        longitude: listing.lng,
        neighborhood: listing.neighborhoodOverview?.localizedName,
        rating: listing.avgRating,
        reviewCount: listing.reviewsCount,
        amenities: listing.listingAmenities || [],
        photos: listing.pictures?.map(pic => pic.picture) || [],
        availability: listing.availability || {},
        verified: listing.isVerified || false,
      };
    } catch (error) {
      logger.error('Error parsing API response:', error);
      return null;
    }
  }

  // Parse HTML response (fallback method)
  parseHtmlResponse(html) {
    try {
      // Basic HTML parsing for listings
      const listingRegex = /"listing":({[^}]+})/g;
      const listings = [];
      let match;

      while ((match = listingRegex.exec(html)) !== null) {
        try {
          const listingData = JSON.parse(match[1]);
          listings.push(this.parseApiListing(listingData));
        } catch (e) {
          // Skip invalid JSON
          continue;
        }
      }

      return listings.filter(l => l !== null);
    } catch (error) {
      logger.error('Error parsing HTML response:', error);
      return [];
    }
  }

  // Parse endpoint response
  parseEndpointResponse(data) {
    // Implementation would depend on endpoint structure
    return [];
  }

  // Method 4: HTML parsing fallback
  async tryHtmlParsing(location, checkIn, checkOut, adults) {
    try {
      await this.rateLimit();

      logger.debug('📝 Attempting HTML parsing fallback...');

      const searchUrl = `https://www.airbnb.ca/s/${encodeURIComponent(location)}/homes`;

      // This would normally require a CORS proxy or backend
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (response.ok) {
        const html = await response.text();
        return this.parseHtmlResponse(html);
      }

      throw new Error('HTML fetch failed');
    } catch (error) {
      logger.warn('HTML parsing failed:', error.message);
      throw error;
    }
  }

  // Main scraping method with multiple fallbacks
  async scrapeRealData(location, checkIn = null, checkOut = null, adults = 2) {
    const methods = [
      this.tryDirectApiCall.bind(this),
      this.tryCorsProxy.bind(this),
      this.tryAlternativeEndpoints.bind(this),
      this.tryHtmlParsing.bind(this),
    ];

    logger.info(`🔍 Starting real AirBnB scraping for ${location}...`);
    logger.debug(
      `📅 Check-in: ${checkIn}, Check-out: ${checkOut}, Adults: ${adults}`
    );

    for (const method of methods) {
      try {
        const result = await method(location, checkIn, checkOut, adults);

        if (result && result.length > 0) {
          logger.info(
            `✅ Scraping successful! Found ${result.length} listings`
          );
          return result;
        }
      } catch (error) {
        logger.debug(`❌ Method failed:`, error.message);
        continue;
      }
    }

    // All methods failed
    logger.warn(
      '❌ All scraping methods failed. This is expected in browser environments.'
    );
    logger.info(
      '💡 Consider using a backend service or browser extension for real scraping.'
    );

    // Return empty array instead of throwing
    return [];
  }

  // Process and validate real listings
  processRealListings(listings) {
    return listings
      .filter(listing => listing.pricePerNight > 0) // Filter out invalid data
      .map(listing => ({
        ...listing,
        pricePerNight: parseFloat(listing.pricePerNight) || 0,
        rating: parseFloat(listing.rating) || 0,
        reviewCount: parseInt(listing.reviewCount) || 0,
        processed: true,
        processedAt: new Date().toISOString(),
      }))
      .sort((a, b) => b.reviewCount - a.reviewCount); // Sort by review count
  }

  // Test connectivity
  async testConnectivity() {
    try {
      logger.debug('🧪 Testing AirBnB connectivity...');

      const testUrl = 'https://www.airbnb.com/api/v2/explore_tabs';
      const response = await fetch(testUrl, {
        method: 'HEAD',
        mode: 'no-cors',
      });

      logger.debug('✅ Connection test successful!');
      return true;
    } catch (error) {
      logger.error('❌ Connection test failed:', error.message);
      return false;
    }
  }

  // Get suggested implementation approaches
  getImplementationSuggestions() {
    return {
      frontend: {
        title: 'Frontend Approaches (Limited)',
        options: [
          {
            name: 'CORS Proxy',
            description: 'Use public CORS proxies (unreliable, may be blocked)',
            difficulty: 'Easy',
            reliability: 'Low',
          },
          {
            name: 'Browser Extension',
            description: 'Create extension with elevated permissions',
            difficulty: 'Medium',
            reliability: 'Medium',
          },
        ],
      },
      backend: {
        title: 'Backend Approaches (Recommended)',
        options: [
          {
            name: 'Node.js + Puppeteer',
            description:
              'Headless browser automation for JavaScript-heavy sites',
            difficulty: 'Medium',
            reliability: 'High',
          },
          {
            name: 'Python + Selenium',
            description: 'Browser automation with extensive scraping libraries',
            difficulty: 'Medium',
            reliability: 'High',
          },
          {
            name: 'Proxy + Cheerio',
            description: 'Server-side HTML parsing with rotating proxies',
            difficulty: 'Hard',
            reliability: 'Medium',
          },
        ],
      },
      apis: {
        title: 'Alternative Data Sources',
        options: [
          {
            name: 'RapidAPI AirBnB',
            description: 'Third-party APIs that provide AirBnB data',
            difficulty: 'Easy',
            reliability: 'High',
          },
          {
            name: 'InsideAirbnb.com',
            description: 'Open dataset of AirBnB listings',
            difficulty: 'Easy',
            reliability: 'Medium',
          },
        ],
      },
    };
  }
}

export default AirBnbRealScraper;
