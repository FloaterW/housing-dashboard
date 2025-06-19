#!/usr/bin/env node

// Simple API test script
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing Housing Dashboard API Integration...\n');

  const tests = [
    {
      name: 'Health Check',
      url: `${BASE_URL}/api/health`
    },
    {
      name: 'Regions List', 
      url: `${BASE_URL}/api/housing/regions`
    },
    {
      name: 'Housing Types',
      url: `${BASE_URL}/api/housing/types`
    },
    {
      name: 'Price Trends (Mississauga, All Types)',
      url: `${BASE_URL}/api/analytics/price-trends?regionId=2&housingTypeId=1&months=12`
    },
    {
      name: 'Market Summary (Mississauga, All Types)',
      url: `${BASE_URL}/api/analytics/market-summary?regionId=2&housingTypeId=1`
    }
  ];

  for (const test of tests) {
    try {
      console.log(`📡 Testing: ${test.name}`);
      console.log(`   URL: ${test.url}`);
      
      const response = await axios.get(test.url, { 
        timeout: 5000,
        headers: { 'Accept': 'application/json' }
      });
      
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   📦 Data: ${JSON.stringify(response.data).substring(0, 200)}...`);
      
      if (response.data?.data && Array.isArray(response.data.data)) {
        console.log(`   📊 Records: ${response.data.data.length}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      if (error.response) {
        console.log(`   📄 Response: ${error.response.status} - ${error.response.statusText}`);
        console.log(`   💬 Message: ${JSON.stringify(error.response.data)}`);
      }
    }
    console.log('');
  }

  console.log('🏁 API Test Complete!\n');
}

// Test database tables directly
async function testDatabase() {
  console.log('🗄️  Testing Database Tables...\n');
  
  try {
    const testQueries = [
      'SELECT COUNT(*) as count FROM regions',
      'SELECT COUNT(*) as count FROM housing_types', 
      'SELECT COUNT(*) as count FROM price_trends',
      'SELECT COUNT(*) as count FROM key_metrics',
      'SHOW TABLES'
    ];

    for (const query of testQueries) {
      try {
        const response = await axios.post(`${BASE_URL}/api/debug/query`, {
          query: query
        });
        console.log(`✅ ${query}: ${JSON.stringify(response.data)}`);
      } catch (error) {
        console.log(`❌ ${query}: ${error.message}`);
      }
    }
  } catch (error) {
    console.log(`❌ Database test failed: ${error.message}`);
  }
}

if (require.main === module) {
  testAPI().then(() => {
    console.log('🎯 Integration Status:');
    console.log('- If all tests pass, the PriceChart integration should work!');
    console.log('- If price-trends fails, check database schema and seed data');
    console.log('- Open http://localhost:3000 to see the frontend with integration controls');
  }).catch(console.error);
}