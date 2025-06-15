// Affordability thresholds for 2024
// Format: [decile, minIncome, maxHousePrice]
export const affordabilityThresholds2024 = [
  [1, 35000, 150000],
  [2, 45000, 200000],
  [3, 55000, 250000],
  [4, 65000, 300000],
  [5, 75000, 350000],
  [6, 85000, 425000],
  [7, 95000, 500000],
  [8, 110000, 600000],
  [9, 130000, 750000],
  [10, 160000, 950000],
];

// Ownership target series
// Format: [year, actual, target]
export const ownershipTargetSeries = [
  [2018, 68.5, 70.0],
  [2019, 68.8, 70.5],
  [2020, 69.2, 71.0],
  [2021, 69.5, 71.5],
  [2022, 69.8, 72.0],
  [2023, 70.1, 72.5],
  [2024, 70.4, 73.0],
];

// Rental target series
// Format: [year, actual, target]
export const rentalTargetSeries = [
  [2018, 31.5, 30.0],
  [2019, 31.2, 29.5],
  [2020, 30.8, 29.0],
  [2021, 30.5, 28.5],
  [2022, 30.2, 28.0],
  [2023, 29.9, 27.5],
  [2024, 29.6, 27.0],
];

// Density target series
// Format: [year, actual, target]
export const densityTargetSeries = [
  [2018, 45.2, 50.0],
  [2019, 47.5, 52.0],
  [2020, 49.8, 54.0],
  [2021, 52.1, 56.0],
  [2022, 54.4, 58.0],
  [2023, 56.7, 60.0],
  [2024, 59.0, 62.0],
];

// Mortgage stress test data - current rates vs stressed rates
export const mortgageStressTestData = {
  'Peel Region': [
    { 
      type: 'Detached', 
      avgPrice: 1710000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 8950,
      stressPayment: 11280,
      qualifyingIncome: 180000,
      stressQualifyingIncome: 225600,
      downPayment20: 342000,
      monthlyTax: 650,
      monthlyInsurance: 180
    },
    { 
      type: 'Semi-Detached', 
      avgPrice: 1080000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 5650,
      stressPayment: 7120,
      qualifyingIncome: 113200,
      stressQualifyingIncome: 142400,
      downPayment20: 216000,
      monthlyTax: 410,
      monthlyInsurance: 120
    },
    { 
      type: 'Townhouse', 
      avgPrice: 980000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 5130,
      stressPayment: 6460,
      qualifyingIncome: 102600,
      stressQualifyingIncome: 129200,
      downPayment20: 196000,
      monthlyTax: 370,
      monthlyInsurance: 110
    },
    { 
      type: 'Condo', 
      avgPrice: 715000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 3740,
      stressPayment: 4710,
      qualifyingIncome: 74800,
      stressQualifyingIncome: 94200,
      downPayment20: 143000,
      monthlyTax: 270,
      monthlyInsurance: 80
    }
  ],
  'Mississauga': [
    { 
      type: 'Detached', 
      avgPrice: 1850000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 9680,
      stressPayment: 12200,
      qualifyingIncome: 193600,
      stressQualifyingIncome: 244000,
      downPayment20: 370000,
      monthlyTax: 700,
      monthlyInsurance: 200
    },
    { 
      type: 'Semi-Detached', 
      avgPrice: 1180000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 6180,
      stressPayment: 7790,
      qualifyingIncome: 123600,
      stressQualifyingIncome: 155800,
      downPayment20: 236000,
      monthlyTax: 450,
      monthlyInsurance: 130
    },
    { 
      type: 'Townhouse', 
      avgPrice: 1050000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 5500,
      stressPayment: 6930,
      qualifyingIncome: 110000,
      stressQualifyingIncome: 138600,
      downPayment20: 210000,
      monthlyTax: 400,
      monthlyInsurance: 120
    },
    { 
      type: 'Condo', 
      avgPrice: 780000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 4080,
      stressPayment: 5140,
      qualifyingIncome: 81600,
      stressQualifyingIncome: 102800,
      downPayment20: 156000,
      monthlyTax: 300,
      monthlyInsurance: 90
    }
  ],
  'Brampton': [
    { 
      type: 'Detached', 
      avgPrice: 1620000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 8480,
      stressPayment: 10680,
      qualifyingIncome: 169600,
      stressQualifyingIncome: 213600,
      downPayment20: 324000,
      monthlyTax: 620,
      monthlyInsurance: 170
    },
    { 
      type: 'Semi-Detached', 
      avgPrice: 1020000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 5340,
      stressPayment: 6730,
      qualifyingIncome: 106800,
      stressQualifyingIncome: 134600,
      downPayment20: 204000,
      monthlyTax: 390,
      monthlyInsurance: 110
    },
    { 
      type: 'Townhouse', 
      avgPrice: 920000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 4810,
      stressPayment: 6060,
      qualifyingIncome: 96200,
      stressQualifyingIncome: 121200,
      downPayment20: 184000,
      monthlyTax: 350,
      monthlyInsurance: 100
    },
    { 
      type: 'Condo', 
      avgPrice: 650000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 3400,
      stressPayment: 4280,
      qualifyingIncome: 68000,
      stressQualifyingIncome: 85600,
      downPayment20: 130000,
      monthlyTax: 250,
      monthlyInsurance: 70
    }
  ],
  'Caledon': [
    { 
      type: 'Detached', 
      avgPrice: 1950000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 10200,
      stressPayment: 12850,
      qualifyingIncome: 204000,
      stressQualifyingIncome: 257000,
      downPayment20: 390000,
      monthlyTax: 740,
      monthlyInsurance: 210
    },
    { 
      type: 'Semi-Detached', 
      avgPrice: 1250000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 6540,
      stressPayment: 8240,
      qualifyingIncome: 130800,
      stressQualifyingIncome: 164800,
      downPayment20: 250000,
      monthlyTax: 470,
      monthlyInsurance: 140
    },
    { 
      type: 'Townhouse', 
      avgPrice: 1150000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 6020,
      stressPayment: 7590,
      qualifyingIncome: 120400,
      stressQualifyingIncome: 151800,
      downPayment20: 230000,
      monthlyTax: 440,
      monthlyInsurance: 130
    },
    { 
      type: 'Condo', 
      avgPrice: 850000,
      currentRate: 5.25,
      stressRate: 7.25,
      currentPayment: 4450,
      stressPayment: 5600,
      qualifyingIncome: 89000,
      stressQualifyingIncome: 112000,
      downPayment20: 170000,
      monthlyTax: 320,
      monthlyInsurance: 100
    }
  ]
};

// Interest rate sensitivity analysis
export const interestRateScenarios = [
  { rate: 4.0, label: 'Historic Low', qualifyingMultiplier: 0.85 },
  { rate: 5.25, label: 'Current Rate', qualifyingMultiplier: 1.0 },
  { rate: 6.0, label: 'Moderate Increase', qualifyingMultiplier: 1.12 },
  { rate: 7.25, label: 'Stress Test Rate', qualifyingMultiplier: 1.26 },
  { rate: 8.0, label: 'High Rate', qualifyingMultiplier: 1.35 },
  { rate: 9.0, label: 'Crisis Scenario', qualifyingMultiplier: 1.48 }
];

// Affordability gap heatmap data (region vs income decile)
// Format: percentage of households that can afford average home price
export const affordabilityGapData = {
  'Peel Region': [
    { decile: 1, affordabilityRate: 2, avgIncome: 35000, avgHousePrice: 1245000 },
    { decile: 2, affordabilityRate: 5, avgIncome: 45000, avgHousePrice: 1245000 },
    { decile: 3, affordabilityRate: 8, avgIncome: 55000, avgHousePrice: 1245000 },
    { decile: 4, affordabilityRate: 12, avgIncome: 65000, avgHousePrice: 1245000 },
    { decile: 5, affordabilityRate: 18, avgIncome: 75000, avgHousePrice: 1245000 },
    { decile: 6, affordabilityRate: 25, avgIncome: 85000, avgHousePrice: 1245000 },
    { decile: 7, affordabilityRate: 35, avgIncome: 95000, avgHousePrice: 1245000 },
    { decile: 8, affordabilityRate: 48, avgIncome: 110000, avgHousePrice: 1245000 },
    { decile: 9, affordabilityRate: 65, avgIncome: 130000, avgHousePrice: 1245000 },
    { decile: 10, affordabilityRate: 85, avgIncome: 160000, avgHousePrice: 1245000 }
  ],
  'Mississauga': [
    { decile: 1, affordabilityRate: 1, avgIncome: 35000, avgHousePrice: 1350000 },
    { decile: 2, affordabilityRate: 3, avgIncome: 45000, avgHousePrice: 1350000 },
    { decile: 3, affordabilityRate: 6, avgIncome: 55000, avgHousePrice: 1350000 },
    { decile: 4, affordabilityRate: 9, avgIncome: 65000, avgHousePrice: 1350000 },
    { decile: 5, affordabilityRate: 14, avgIncome: 75000, avgHousePrice: 1350000 },
    { decile: 6, affordabilityRate: 20, avgIncome: 85000, avgHousePrice: 1350000 },
    { decile: 7, affordabilityRate: 28, avgIncome: 95000, avgHousePrice: 1350000 },
    { decile: 8, affordabilityRate: 40, avgIncome: 110000, avgHousePrice: 1350000 },
    { decile: 9, affordabilityRate: 55, avgIncome: 130000, avgHousePrice: 1350000 },
    { decile: 10, affordabilityRate: 75, avgIncome: 160000, avgHousePrice: 1350000 }
  ],
  'Brampton': [
    { decile: 1, affordabilityRate: 3, avgIncome: 35000, avgHousePrice: 1150000 },
    { decile: 2, affordabilityRate: 7, avgIncome: 45000, avgHousePrice: 1150000 },
    { decile: 3, affordabilityRate: 12, avgIncome: 55000, avgHousePrice: 1150000 },
    { decile: 4, affordabilityRate: 18, avgIncome: 65000, avgHousePrice: 1150000 },
    { decile: 5, affordabilityRate: 25, avgIncome: 75000, avgHousePrice: 1150000 },
    { decile: 6, affordabilityRate: 35, avgIncome: 85000, avgHousePrice: 1150000 },
    { decile: 7, affordabilityRate: 45, avgIncome: 95000, avgHousePrice: 1150000 },
    { decile: 8, affordabilityRate: 60, avgIncome: 110000, avgHousePrice: 1150000 },
    { decile: 9, affordabilityRate: 75, avgIncome: 130000, avgHousePrice: 1150000 },
    { decile: 10, affordabilityRate: 90, avgIncome: 160000, avgHousePrice: 1150000 }
  ],
  'Caledon': [
    { decile: 1, affordabilityRate: 1, avgIncome: 35000, avgHousePrice: 1650000 },
    { decile: 2, affordabilityRate: 2, avgIncome: 45000, avgHousePrice: 1650000 },
    { decile: 3, affordabilityRate: 4, avgIncome: 55000, avgHousePrice: 1650000 },
    { decile: 4, affordabilityRate: 6, avgIncome: 65000, avgHousePrice: 1650000 },
    { decile: 5, affordabilityRate: 9, avgIncome: 75000, avgHousePrice: 1650000 },
    { decile: 6, affordabilityRate: 13, avgIncome: 85000, avgHousePrice: 1650000 },
    { decile: 7, affordabilityRate: 18, avgIncome: 95000, avgHousePrice: 1650000 },
    { decile: 8, affordabilityRate: 25, avgIncome: 110000, avgHousePrice: 1650000 },
    { decile: 9, affordabilityRate: 35, avgIncome: 130000, avgHousePrice: 1650000 },
    { decile: 10, affordabilityRate: 50, avgIncome: 160000, avgHousePrice: 1650000 }
  ]
};

// Homeownership rate trends over time
export const homeownershipTrends = {
  'Peel Region': [
    { year: 2019, rate: 72.3, target: 73.0, firstTimeBuyers: 28.5 },
    { year: 2020, rate: 71.8, target: 73.5, firstTimeBuyers: 26.2 },
    { year: 2021, rate: 70.9, target: 74.0, firstTimeBuyers: 23.8 },
    { year: 2022, rate: 69.5, target: 74.5, firstTimeBuyers: 21.4 },
    { year: 2023, rate: 68.2, target: 75.0, firstTimeBuyers: 19.6 },
    { year: 2024, rate: 67.1, target: 75.5, firstTimeBuyers: 18.2 },
    { year: 2025, rate: 66.5, target: 76.0, firstTimeBuyers: 17.5 }
  ],
  'Mississauga': [
    { year: 2019, rate: 70.8, target: 72.0, firstTimeBuyers: 26.3 },
    { year: 2020, rate: 70.1, target: 72.5, firstTimeBuyers: 24.1 },
    { year: 2021, rate: 68.9, target: 73.0, firstTimeBuyers: 21.9 },
    { year: 2022, rate: 67.2, target: 73.5, firstTimeBuyers: 19.8 },
    { year: 2023, rate: 65.8, target: 74.0, firstTimeBuyers: 18.2 },
    { year: 2024, rate: 64.5, target: 74.5, firstTimeBuyers: 16.9 },
    { year: 2025, rate: 63.8, target: 75.0, firstTimeBuyers: 16.1 }
  ],
  'Brampton': [
    { year: 2019, rate: 74.2, target: 74.5, firstTimeBuyers: 31.2 },
    { year: 2020, rate: 73.8, target: 75.0, firstTimeBuyers: 29.4 },
    { year: 2021, rate: 73.1, target: 75.5, firstTimeBuyers: 27.1 },
    { year: 2022, rate: 71.9, target: 76.0, firstTimeBuyers: 24.8 },
    { year: 2023, rate: 70.8, target: 76.5, firstTimeBuyers: 22.9 },
    { year: 2024, rate: 69.9, target: 77.0, firstTimeBuyers: 21.6 },
    { year: 2025, rate: 69.4, target: 77.5, firstTimeBuyers: 20.8 }
  ],
  'Caledon': [
    { year: 2019, rate: 78.5, target: 78.0, firstTimeBuyers: 22.1 },
    { year: 2020, rate: 77.9, target: 78.5, firstTimeBuyers: 20.3 },
    { year: 2021, rate: 76.8, target: 79.0, firstTimeBuyers: 18.2 },
    { year: 2022, rate: 75.1, target: 79.5, firstTimeBuyers: 16.4 },
    { year: 2023, rate: 73.6, target: 80.0, firstTimeBuyers: 15.1 },
    { year: 2024, rate: 72.3, target: 80.5, firstTimeBuyers: 14.2 },
    { year: 2025, rate: 71.8, target: 81.0, firstTimeBuyers: 13.8 }
  ]
}; 