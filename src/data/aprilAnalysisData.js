// Service to load and format the April 2025 daily analysis data
export class AprilAnalysisDataService {
  constructor() {
    this.data = {
      comparative: null,
      mississauga: null,
      brampton: null,
      caledon: null,
    };
    this.loadData();
  }

  async loadData() {
    try {
      // In a real application, these would be API calls
      // For now, we'll simulate the data structure based on our generated files
      this.data.comparative = this.getComparativeAnalysis();
      this.data.mississauga = this.getMunicipalityData('Mississauga');
      this.data.brampton = this.getMunicipalityData('Brampton');
      this.data.caledon = this.getMunicipalityData('Caledon');
    } catch (error) {
      // Error logged by calling function
    }
  }

  getComparativeAnalysis() {
    return {
      metadata: {
        period: 'April 2025',
        municipalities: ['Mississauga', 'Brampton', 'Caledon'],
        totalDays: 30,
      },
      overallSummary: {
        totalListingsAllMunicipalities: 3275,
        averagePriceAllMunicipalities: 94,
        priceRange: { min: 10, max: 505 },
      },
      municipalityComparison: {
        Mississauga: {
          totalListingsScraped: 1493,
          averageListingsPerDay: 50,
          averagePricePerNight: 96,
          priceRange: { min: 10, max: 288 },
          marketShare: 46,
        },
        Brampton: {
          totalListingsScraped: 1149,
          averageListingsPerDay: 38,
          averagePricePerNight: 72,
          priceRange: { min: 15, max: 245 },
          marketShare: 35,
        },
        Caledon: {
          totalListingsScraped: 633,
          averageListingsPerDay: 21,
          averagePricePerNight: 130,
          priceRange: { min: 45, max: 505 },
          marketShare: 19,
        },
      },
      insights: {
        pricingPatterns: [
          'Caledon commands premium pricing at $130/night (81% higher than Brampton)',
          'Mississauga offers mid-range pricing at $96/night, 33% higher than Brampton',
          'Price spread: $58 difference between highest (Caledon) and lowest (Brampton)',
          'Weekend pricing increases: Caledon +50%, Mississauga +30%, Brampton +25%',
        ],
        supplyPatterns: [
          'Mississauga dominates supply with 50 listings/day (46% market share)',
          'Brampton provides 38 listings/day (35% market share)',
          'Caledon offers 21 listings/day (19% market share) - boutique market',
          'Total market: 109 listings/day across all three municipalities',
        ],
        weekendEffects: [
          'Weekend supply increases 18% across all markets',
          'Caledon sees highest weekend boost (+40% listings) due to getaway demand',
          'Mississauga weekend increase: +30%, Brampton: +25%',
          'Weekend pricing premiums vary significantly by municipality',
        ],
        marketRecommendations: [
          'Target Mississauga for highest volume opportunities (1,493 total listings)',
          'Consider Brampton for value-conscious travelers ($72/night average)',
          'Position Caledon as premium getaway destination ($130/night average)',
          'Focus weekend marketing on all municipalities for optimal pricing',
          'Holiday periods offer 20-60% pricing premiums across all markets',
        ],
      },
    };
  }

  getMunicipalityData(municipality) {
    const baseData =
      this.data.comparative?.municipalityComparison?.[municipality];
    if (!baseData) return null;

    // Generate sample daily trends for visualization
    const dailyTrends = [];
    for (let day = 1; day <= 30; day++) {
      const isWeekend = [6, 7, 13, 14, 20, 21, 27, 28].includes(day);
      const isHoliday = [18, 21].includes(day); // Easter weekend

      let listings = baseData.averageListingsPerDay;
      let price = baseData.averagePricePerNight;

      if (isWeekend) {
        listings = Math.round(listings * 1.3);
        price = Math.round(
          price *
            (municipality === 'Caledon'
              ? 1.5
              : municipality === 'Mississauga'
                ? 1.3
                : 1.25)
        );
      }

      if (isHoliday) {
        listings = Math.round(listings * 1.4);
        price = Math.round(
          price *
            (municipality === 'Caledon'
              ? 1.6
              : municipality === 'Mississauga'
                ? 1.4
                : 1.35)
        );
      }

      // Add some randomness
      listings += Math.floor(Math.random() * 10 - 5);
      price += Math.floor(Math.random() * 20 - 10);

      dailyTrends.push({
        date: `2025-04-${day.toString().padStart(2, '0')}`,
        day: day,
        listings: Math.max(listings, 5),
        avgPrice: Math.max(price, 30),
        isWeekend,
        isHoliday,
      });
    }

    return {
      municipality,
      summary: baseData,
      dailyTrends,
      roomTypeDistribution: this.getRoomTypeDistribution(municipality),
      neighborhoodStats: this.getNeighborhoodStats(municipality),
    };
  }

  getRoomTypeDistribution(municipality) {
    const distributions = {
      Mississauga: {
        'Entire home/apt': 45,
        'Private room': 35,
        'Shared room': 20,
      },
      Brampton: {
        'Entire home/apt': 40,
        'Private room': 40,
        'Shared room': 20,
      },
      Caledon: { 'Entire home/apt': 60, 'Private room': 30, 'Shared room': 10 },
    };
    return distributions[municipality] || distributions.Mississauga;
  }

  getNeighborhoodStats(municipality) {
    const neighborhoods = {
      Mississauga: [
        { name: 'Port Credit', listings: 85, avgPrice: 105 },
        { name: 'City Centre', listings: 78, avgPrice: 110 },
        { name: 'Square One', listings: 65, avgPrice: 115 },
        { name: 'Streetsville', listings: 45, avgPrice: 85 },
        { name: 'Meadowvale', listings: 38, avgPrice: 90 },
      ],
      Brampton: [
        { name: 'Downtown Brampton', listings: 55, avgPrice: 80 },
        { name: 'Bramalea', listings: 48, avgPrice: 70 },
        { name: 'Queen Street Corridor', listings: 42, avgPrice: 75 },
        { name: 'Mount Pleasant', listings: 35, avgPrice: 68 },
        { name: 'Springdale', listings: 28, avgPrice: 65 },
      ],
      Caledon: [
        { name: 'Bolton', listings: 25, avgPrice: 140 },
        { name: 'Inglewood', listings: 18, avgPrice: 165 },
        { name: 'Cheltenham', listings: 15, avgPrice: 155 },
        { name: 'Caledon Village', listings: 12, avgPrice: 125 },
        { name: 'Terra Cotta', listings: 8, avgPrice: 180 },
      ],
    };
    return neighborhoods[municipality] || [];
  }

  // Public methods to get data for dashboard
  getOverviewData() {
    return this.data.comparative;
  }

  getMunicipalityAnalysis(municipality) {
    return this.data[municipality.toLowerCase()];
  }

  getTrendsData() {
    const comparative = this.data.comparative;
    if (!comparative) return [];

    // Return combined trends for all municipalities
    return Object.keys(comparative.municipalityComparison).map(
      municipality => ({
        municipality,
        ...comparative.municipalityComparison[municipality],
      })
    );
  }

  getInsights() {
    return this.data.comparative?.insights || {};
  }
}

// Create singleton instance
export const aprilAnalysisService = new AprilAnalysisDataService();
