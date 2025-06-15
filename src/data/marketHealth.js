// Market Health Indicators Data
// Comprehensive metrics for assessing overall market conditions

// Price-to-income ratios by region (higher = less affordable)
export const priceToIncomeRatios = {
  'Peel Region': { ratio: 12.8, benchmark: 10.0, status: 'Overvalued', trend: 'Rising' },
  'Mississauga': { ratio: 13.5, benchmark: 10.0, status: 'Overvalued', trend: 'Rising' },
  'Brampton': { ratio: 11.9, benchmark: 10.0, status: 'Overvalued', trend: 'Stable' },
  'Caledon': { ratio: 15.2, benchmark: 10.0, status: 'Severely Overvalued', trend: 'Rising' }
};

// Market temperature indicators (0-100 scale)
export const marketTemperature = {
  'Peel Region': {
    overall: 78,
    priceGrowth: 85,
    salesVolume: 72,
    inventory: 65,
    timeOnMarket: 68,
    status: 'Hot'
  },
  'Mississauga': {
    overall: 82,
    priceGrowth: 88,
    salesVolume: 75,
    inventory: 60,
    timeOnMarket: 65,
    status: 'Very Hot'
  },
  'Brampton': {
    overall: 74,
    priceGrowth: 80,
    salesVolume: 78,
    inventory: 70,
    timeOnMarket: 72,
    status: 'Hot'
  },
  'Caledon': {
    overall: 68,
    priceGrowth: 72,
    salesVolume: 58,
    inventory: 75,
    timeOnMarket: 85,
    status: 'Warm'
  }
};

// Supply and demand metrics
export const supplyDemandMetrics = {
  'Peel Region': {
    monthsOfInventory: 2.1,
    newListings: 1250,
    salesVolume: 980,
    absorptionRate: 78.4,
    demandIndex: 85,
    supplyIndex: 42
  },
  'Mississauga': {
    monthsOfInventory: 1.8,
    newListings: 520,
    salesVolume: 420,
    absorptionRate: 80.8,
    demandIndex: 88,
    supplyIndex: 38
  },
  'Brampton': {
    monthsOfInventory: 2.3,
    newListings: 580,
    salesVolume: 465,
    absorptionRate: 80.2,
    demandIndex: 82,
    supplyIndex: 45
  },
  'Caledon': {
    monthsOfInventory: 3.2,
    newListings: 150,
    salesVolume: 95,
    absorptionRate: 63.3,
    demandIndex: 65,
    supplyIndex: 58
  }
};

// Market risk indicators
export const riskIndicators = {
  'Peel Region': {
    overvaluation: 'High',
    interestRateSensitivity: 'Very High',
    speculativeActivity: 'Moderate',
    householdDebt: 'High',
    overallRisk: 'High',
    riskScore: 78
  },
  'Mississauga': {
    overvaluation: 'Very High',
    interestRateSensitivity: 'Very High',
    speculativeActivity: 'High',
    householdDebt: 'Very High',
    overallRisk: 'Very High',
    riskScore: 85
  },
  'Brampton': {
    overvaluation: 'High',
    interestRateSensitivity: 'High',
    speculativeActivity: 'Moderate',
    householdDebt: 'High',
    overallRisk: 'High',
    riskScore: 74
  },
  'Caledon': {
    overvaluation: 'Very High',
    interestRateSensitivity: 'High',
    speculativeActivity: 'Low',
    householdDebt: 'Moderate',
    overallRisk: 'Moderate',
    riskScore: 68
  }
};

// Market health trends over time
export const marketHealthTrends = {
  'Peel Region': [
    { month: 'Jan 2024', healthScore: 65, priceGrowth: 8.2, riskLevel: 'Moderate' },
    { month: 'Feb 2024', healthScore: 68, priceGrowth: 8.5, riskLevel: 'Moderate' },
    { month: 'Mar 2024', healthScore: 72, priceGrowth: 9.1, riskLevel: 'High' },
    { month: 'Apr 2024', healthScore: 75, priceGrowth: 9.8, riskLevel: 'High' },
    { month: 'May 2024', healthScore: 78, priceGrowth: 10.2, riskLevel: 'High' },
    { month: 'Jun 2024', healthScore: 76, priceGrowth: 9.9, riskLevel: 'High' },
    { month: 'Jul 2024', healthScore: 79, priceGrowth: 10.5, riskLevel: 'High' },
    { month: 'Aug 2024', healthScore: 81, priceGrowth: 11.1, riskLevel: 'High' },
    { month: 'Sep 2024', healthScore: 78, priceGrowth: 10.8, riskLevel: 'High' },
    { month: 'Oct 2024', healthScore: 82, priceGrowth: 11.4, riskLevel: 'Very High' },
    { month: 'Nov 2024', healthScore: 80, priceGrowth: 11.0, riskLevel: 'High' },
    { month: 'Dec 2024', healthScore: 79, priceGrowth: 10.7, riskLevel: 'High' },
    { month: 'Jan 2025', healthScore: 77, priceGrowth: 10.3, riskLevel: 'High' },
    { month: 'Feb 2025', healthScore: 78, priceGrowth: 10.6, riskLevel: 'High' }
  ],
  'Mississauga': [
    { month: 'Jan 2024', healthScore: 70, priceGrowth: 9.5, riskLevel: 'High' },
    { month: 'Feb 2024', healthScore: 73, priceGrowth: 9.8, riskLevel: 'High' },
    { month: 'Mar 2024', healthScore: 76, priceGrowth: 10.4, riskLevel: 'High' },
    { month: 'Apr 2024', healthScore: 78, priceGrowth: 11.1, riskLevel: 'Very High' },
    { month: 'May 2024', healthScore: 81, priceGrowth: 11.5, riskLevel: 'Very High' },
    { month: 'Jun 2024', healthScore: 79, priceGrowth: 11.2, riskLevel: 'Very High' },
    { month: 'Jul 2024', healthScore: 83, priceGrowth: 11.8, riskLevel: 'Very High' },
    { month: 'Aug 2024', healthScore: 85, priceGrowth: 12.4, riskLevel: 'Very High' },
    { month: 'Sep 2024', healthScore: 82, priceGrowth: 12.1, riskLevel: 'Very High' },
    { month: 'Oct 2024', healthScore: 86, priceGrowth: 12.7, riskLevel: 'Very High' },
    { month: 'Nov 2024', healthScore: 84, priceGrowth: 12.3, riskLevel: 'Very High' },
    { month: 'Dec 2024', healthScore: 83, priceGrowth: 12.0, riskLevel: 'Very High' },
    { month: 'Jan 2025', healthScore: 81, priceGrowth: 11.6, riskLevel: 'Very High' },
    { month: 'Feb 2025', healthScore: 82, priceGrowth: 11.9, riskLevel: 'Very High' }
  ],
  'Brampton': [
    { month: 'Jan 2024', healthScore: 62, priceGrowth: 7.8, riskLevel: 'Moderate' },
    { month: 'Feb 2024', healthScore: 65, priceGrowth: 8.1, riskLevel: 'Moderate' },
    { month: 'Mar 2024', healthScore: 68, priceGrowth: 8.7, riskLevel: 'High' },
    { month: 'Apr 2024', healthScore: 71, priceGrowth: 9.4, riskLevel: 'High' },
    { month: 'May 2024', healthScore: 74, priceGrowth: 9.8, riskLevel: 'High' },
    { month: 'Jun 2024', healthScore: 72, priceGrowth: 9.5, riskLevel: 'High' },
    { month: 'Jul 2024', healthScore: 75, priceGrowth: 10.1, riskLevel: 'High' },
    { month: 'Aug 2024', healthScore: 77, priceGrowth: 10.7, riskLevel: 'High' },
    { month: 'Sep 2024', healthScore: 74, priceGrowth: 10.4, riskLevel: 'High' },
    { month: 'Oct 2024', healthScore: 78, priceGrowth: 11.0, riskLevel: 'High' },
    { month: 'Nov 2024', healthScore: 76, priceGrowth: 10.6, riskLevel: 'High' },
    { month: 'Dec 2024', healthScore: 75, priceGrowth: 10.3, riskLevel: 'High' },
    { month: 'Jan 2025', healthScore: 73, priceGrowth: 9.9, riskLevel: 'High' },
    { month: 'Feb 2025', healthScore: 74, priceGrowth: 10.2, riskLevel: 'High' }
  ],
  'Caledon': [
    { month: 'Jan 2024', healthScore: 58, priceGrowth: 6.2, riskLevel: 'Moderate' },
    { month: 'Feb 2024', healthScore: 60, priceGrowth: 6.5, riskLevel: 'Moderate' },
    { month: 'Mar 2024', healthScore: 62, priceGrowth: 6.9, riskLevel: 'Moderate' },
    { month: 'Apr 2024', healthScore: 64, priceGrowth: 7.3, riskLevel: 'Moderate' },
    { month: 'May 2024', healthScore: 66, priceGrowth: 7.7, riskLevel: 'Moderate' },
    { month: 'Jun 2024', healthScore: 65, priceGrowth: 7.4, riskLevel: 'Moderate' },
    { month: 'Jul 2024', healthScore: 67, priceGrowth: 7.8, riskLevel: 'Moderate' },
    { month: 'Aug 2024', healthScore: 69, priceGrowth: 8.2, riskLevel: 'High' },
    { month: 'Sep 2024', healthScore: 67, priceGrowth: 7.9, riskLevel: 'Moderate' },
    { month: 'Oct 2024', healthScore: 70, priceGrowth: 8.3, riskLevel: 'High' },
    { month: 'Nov 2024', healthScore: 69, priceGrowth: 8.0, riskLevel: 'High' },
    { month: 'Dec 2024', healthScore: 68, priceGrowth: 7.7, riskLevel: 'Moderate' },
    { month: 'Jan 2025', healthScore: 67, priceGrowth: 7.4, riskLevel: 'Moderate' },
    { month: 'Feb 2025', healthScore: 68, priceGrowth: 7.6, riskLevel: 'Moderate' }
  ]
};

// Market predictions and forecasts
export const marketForecasts = {
  'Peel Region': {
    priceGrowthNext12Months: 8.5,
    confidence: 'Moderate',
    keyRisks: ['Interest Rate Increases', 'Affordability Crisis', 'Policy Changes'],
    outlook: 'Cautiously Optimistic',
    recommendedActions: ['Monitor Interest Rates', 'Assess Affordability Impact', 'Watch Supply Response']
  },
  'Mississauga': {
    priceGrowthNext12Months: 7.2,
    confidence: 'Low',
    keyRisks: ['Overvaluation', 'Interest Rate Sensitivity', 'Speculative Activity'],
    outlook: 'Concerning',
    recommendedActions: ['Exercise Caution', 'Monitor Correction Signals', 'Assess Downside Risk']
  },
  'Brampton': {
    priceGrowthNext12Months: 9.1,
    confidence: 'Moderate',
    keyRisks: ['Affordability Constraints', 'Interest Rate Impact', 'Employment Trends'],
    outlook: 'Positive',
    recommendedActions: ['Monitor Employment', 'Track Affordability', 'Watch First-time Buyers']
  },
  'Caledon': {
    priceGrowthNext12Months: 6.8,
    confidence: 'High',
    keyRisks: ['Limited Inventory', 'Infrastructure Constraints', 'Luxury Market Volatility'],
    outlook: 'Stable',
    recommendedActions: ['Monitor Luxury Trends', 'Track Infrastructure Development', 'Assess Supply Pipeline']
  }
};

// Key performance indicators
export const keyPerformanceIndicators = {
  overall: {
    marketHealth: 76,
    affordability: 32,
    sustainability: 45,
    growth: 88,
    stability: 61
  },
  regional: {
    'Peel Region': { health: 78, risk: 78, opportunity: 72 },
    'Mississauga': { health: 82, risk: 85, opportunity: 68 },
    'Brampton': { health: 74, risk: 74, opportunity: 76 },
    'Caledon': { health: 68, risk: 68, opportunity: 70 }
  }
};