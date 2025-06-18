import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function ApiTest() {
  const [data, setData] = useState({
    health: null,
    regions: null,
    housingTypes: null,
    sales: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing API endpoints...');
        
        // Test health endpoint
        const health = await apiService.healthCheck();
        console.log('Health check:', health);
        
        // Test regions endpoint
        const regions = await apiService.getRegions();
        console.log('Regions:', regions);
        
        // Test housing types endpoint
        const housingTypes = await apiService.getHousingTypes();
        console.log('Housing types:', housingTypes);
        
        // Test sales endpoint
        const sales = await apiService.getSales();
        console.log('Sales:', sales);
        
        setData({
          health,
          regions,
          housingTypes,
          sales,
          loading: false,
          error: null
        });
        
      } catch (error) {
        console.error('API test failed:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    testAPI();
  }, []);

  if (data.loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Testing API Connection...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-red-800">API Test Failed</h2>
        <p className="text-red-600">{data.error}</p>
        <div className="mt-4 text-sm text-gray-600">
          <p>Make sure the backend server is running on port 3001</p>
          <p>Check the browser console for more details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-green-800">🎉 API Integration Successful!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Status */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Health Status</h3>
          <p className="text-sm text-green-600">
            Status: {data.health?.status} | 
            Response Time: {data.health?.responseTime}
          </p>
        </div>

        {/* Regions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Regions ({data.regions?.count})</h3>
          <div className="text-sm">
            {data.regions?.data?.map(region => (
              <div key={region.id} className="mb-1">
                {region.name} - {region.active_listings} listings
              </div>
            ))}
          </div>
        </div>

        {/* Housing Types */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Housing Types ({data.housingTypes?.count})</h3>
          <div className="text-sm">
            {data.housingTypes?.data?.map(type => (
              <div key={type.id} className="mb-1">
                {type.name} ({type.code})
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Recent Sales ({data.sales?.count})</h3>
          <div className="text-sm">
            {data.sales?.data?.slice(0, 3).map(sale => (
              <div key={sale.id} className="mb-1">
                ${sale.sale_price} - {sale.region_name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✅ Database connected and populated</li>
          <li>✅ Backend API running and responding</li>
          <li>✅ Frontend can communicate with API</li>
          <li>🔄 Ready to replace hardcoded data in components</li>
        </ul>
      </div>
    </div>
  );
}

export default ApiTest;