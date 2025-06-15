import React, { useEffect, useRef, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import '@arcgis/core/assets/esri/themes/light/main.css';

function HousingMapDashboard() {
  const mapRef = useRef();
  const [mapView, setMapView] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('avgPrice');
  const [isLoading, setIsLoading] = useState(true);

  // Sample housing data with geographic coordinates for Peel Region municipalities
  const housingGeoData = [
    {
      municipality: 'Mississauga',
      geometry: [-79.6441, 43.5890], // [longitude, latitude]
      avgPrice: 1350000,
      priceGrowth: 11.9,
      affordabilityRate: 45.2,
      riskScore: 85,
      marketTemp: 82,
      inventory: 1.8
    },
    {
      municipality: 'Brampton',
      geometry: [-79.7624, 43.7315],
      avgPrice: 1150000,
      priceGrowth: 10.2,
      affordabilityRate: 58.3,
      riskScore: 74,
      marketTemp: 74,
      inventory: 2.3
    },
    {
      municipality: 'Caledon',
      geometry: [-79.8711, 43.8554],
      avgPrice: 1650000,
      priceGrowth: 7.6,
      affordabilityRate: 28.1,
      riskScore: 68,
      marketTemp: 68,
      inventory: 3.2
    }
  ];

  useEffect(() => {
    try {
      // Create the map
      const map = new Map({
        basemap: 'streets-navigation-vector' // Clean, modern basemap
      });

      // Create the view
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-79.6441, 43.6426], // Centered on Peel Region
        zoom: 10,
        popup: {
          dockEnabled: true,
          dockOptions: {
            position: 'top-right',
            breakpoint: false
          }
        }
      });

      // Create graphics layer for housing data
      const housingLayer = new GraphicsLayer({
        title: 'Housing Market Data'
      });

      // Function to get symbol based on selected metric
      const getSymbol = (data) => {
        let color, size;
        
        switch(selectedMetric) {
          case 'avgPrice':
            // Color based on price: green (lower) to red (higher)
            const priceRatio = data.avgPrice / 1650000; // Normalize to max price
            color = priceRatio > 0.8 ? [220, 38, 127] : // High price - red
                   priceRatio > 0.7 ? [251, 146, 60] : // Medium-high - orange  
                   [34, 197, 94]; // Lower price - green
            size = Math.max(20, data.avgPrice / 50000); // Size based on price
            break;
            
          case 'riskScore':
            // Color based on risk: green (low) to red (high)
            color = data.riskScore > 80 ? [220, 38, 127] : // High risk - red
                   data.riskScore > 70 ? [251, 146, 60] : // Medium risk - orange
                   [34, 197, 94]; // Low risk - green
            size = Math.max(15, data.riskScore / 3);
            break;
            
          case 'marketTemp':
            // Color based on temperature
            color = data.marketTemp > 80 ? [220, 38, 127] : // Very hot - red
                   data.marketTemp > 70 ? [251, 146, 60] : // Hot - orange
                   [34, 197, 94]; // Warm/cool - green
            size = Math.max(15, data.marketTemp / 3);
            break;
            
          default:
            color = [59, 130, 246]; // Default blue
            size = 25;
        }

        return new SimpleMarkerSymbol({
          color: color,
          size: size,
          outline: {
            color: [255, 255, 255],
            width: 2
          }
        });
      };

      // Function to update graphics based on selected metric
      const updateMapGraphics = () => {
        housingLayer.removeAll();

        housingGeoData.forEach(data => {
          const point = {
            type: 'point',
            longitude: data.geometry[0],
            latitude: data.geometry[1]
          };

          const popupTemplate = new PopupTemplate({
            title: '{municipality} Housing Market',
            content: `
              <div style="padding: 10px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td><strong>Average Price:</strong></td><td>$${data.avgPrice.toLocaleString()}</td></tr>
                  <tr><td><strong>Price Growth:</strong></td><td>${data.priceGrowth}%</td></tr>
                  <tr><td><strong>Affordability Rate:</strong></td><td>${data.affordabilityRate}%</td></tr>
                  <tr><td><strong>Risk Score:</strong></td><td>${data.riskScore}/100</td></tr>
                  <tr><td><strong>Market Temperature:</strong></td><td>${data.marketTemp}/100</td></tr>
                  <tr><td><strong>Inventory (months):</strong></td><td>${data.inventory}</td></tr>
                </table>
              </div>
            `,
            fieldInfos: [
              {
                fieldName: 'municipality',
                visible: false
              }
            ]
          });

          const graphic = new Graphic({
            geometry: point,
            symbol: getSymbol(data),
            attributes: data,
            popupTemplate: popupTemplate
          });

          housingLayer.add(graphic);
        });
      };

      // Add layer to map
      map.add(housingLayer);
      
      // Initial graphics update
      updateMapGraphics();
      
      // Store view reference
      setMapView(view);
      setIsLoading(false);

      // Cleanup function
      return () => {
        if (view) {
          view.destroy();
        }
      };
    } catch (err) {
      console.error('Error loading ArcGIS modules:', err);
      setIsLoading(false);
    }
  }, [selectedMetric]);

  // Update map when metric changes
  useEffect(() => {
    if (mapView) {
      // Trigger map update - in real implementation, this would update the graphics
      // For now, we'll reload the component to demonstrate the concept
    }
  }, [selectedMetric, mapView]);

  const metrics = [
    { id: 'avgPrice', label: 'Average Prices', icon: '💰' },
    { id: 'riskScore', label: 'Risk Levels', icon: '⚠️' },
    { id: 'marketTemp', label: 'Market Temperature', icon: '🌡️' },
    { id: 'affordabilityRate', label: 'Affordability', icon: '🏠' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center mb-2">
            <span className="mr-2">🗺️</span>
            Geographic Housing Market Analysis
          </h3>
          <p className="text-sm text-gray-600">
            Interactive map visualization of housing market trends across Peel Region
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 lg:mt-0">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 flex items-center space-x-1
                ${selectedMetric === metric.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <span>{metric.icon}</span>
              <span>{metric.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading ArcGIS Map...</p>
            </div>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg border border-gray-200"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Map Legend</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Low {selectedMetric === 'avgPrice' ? 'Price' : selectedMetric === 'riskScore' ? 'Risk' : 'Temperature'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span>Medium {selectedMetric === 'avgPrice' ? 'Price' : selectedMetric === 'riskScore' ? 'Risk' : 'Temperature'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>High {selectedMetric === 'avgPrice' ? 'Price' : selectedMetric === 'riskScore' ? 'Risk' : 'Temperature'}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Geographic Insights</h4>
          <p className="text-sm text-blue-600">
            Click on any municipality marker to view detailed housing market metrics and trends for that area.
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Data Visualization</h4>
          <p className="text-sm text-green-600">
            Marker size and color represent the intensity of the selected metric. Larger, redder markers indicate higher values.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HousingMapDashboard;