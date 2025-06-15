import React, { useState } from 'react';
import { ResponsiveContainer, Cell } from 'recharts';
import { affordabilityGapData } from '../../data/affordability';

function AffordabilityGapHeatmap() {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedDecile, setSelectedDecile] = useState(null);
  
  const regions = Object.keys(affordabilityGapData);
  const deciles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // Get color intensity based on affordability rate
  const getHeatmapColor = (rate) => {
    if (rate <= 10) return 'bg-red-800';
    if (rate <= 20) return 'bg-red-600';
    if (rate <= 30) return 'bg-red-400';
    if (rate <= 40) return 'bg-orange-500';
    if (rate <= 50) return 'bg-yellow-400';
    if (rate <= 60) return 'bg-yellow-300';
    if (rate <= 70) return 'bg-green-300';
    if (rate <= 80) return 'bg-green-400';
    return 'bg-green-600';
  };
  
  const getTextColor = (rate) => {
    return rate <= 30 ? 'text-white' : 'text-gray-800';
  };
  
  // Create heatmap data structure
  const createHeatmapData = () => {
    if (selectedRegion === 'All Regions') {
      return regions.map(region => ({
        region,
        data: deciles.map(decile => {
          const regionData = affordabilityGapData[region];
          const decileData = regionData.find(d => d.decile === decile);
          return {
            decile,
            affordabilityRate: decileData ? decileData.affordabilityRate : 0,
            avgIncome: decileData ? decileData.avgIncome : 0,
            avgHousePrice: decileData ? decileData.avgHousePrice : 0
          };
        })
      }));
    } else {
      return [{
        region: selectedRegion,
        data: affordabilityGapData[selectedRegion] || []
      }];
    }
  };
  
  const heatmapData = createHeatmapData();
  
  // Calculate statistics
  const getAllRates = () => {
    return regions.flatMap(region => 
      affordabilityGapData[region].map(d => d.affordabilityRate)
    );
  };
  
  const allRates = getAllRates();
  const avgAffordability = allRates.reduce((sum, rate) => sum + rate, 0) / allRates.length;
  const minRate = Math.min(...allRates);
  const maxRate = Math.max(...allRates);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center mb-2">
            <span className="mr-2">🔥</span>
            Affordability Gap Heatmap
          </h3>
          <p className="text-sm text-gray-600">
            Percentage of households that can afford average home prices by income decile
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All Regions">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="mb-6">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid grid-cols-11 gap-1 mb-2">
              <div className="text-xs font-medium text-gray-600 p-2">Region / Decile</div>
              {deciles.map(decile => (
                <div key={decile} className="text-xs font-medium text-gray-600 text-center p-2">
                  D{decile}
                </div>
              ))}
            </div>
            
            {/* Heatmap Rows */}
            {heatmapData.map(({ region, data }) => (
              <div key={region} className="grid grid-cols-11 gap-1 mb-1">
                <div className="text-sm font-medium text-gray-800 p-2 bg-gray-50 rounded flex items-center">
                  {region.replace(' Region', '')}
                </div>
                {data.map(({ decile, affordabilityRate, avgIncome, avgHousePrice }) => (
                  <div
                    key={`${region}-${decile}`}
                    className={`
                      ${getHeatmapColor(affordabilityRate)} ${getTextColor(affordabilityRate)}
                      p-2 rounded text-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md
                      group relative
                    `}
                    onClick={() => setSelectedDecile(selectedDecile === `${region}-${decile}` ? null : `${region}-${decile}`)}
                  >
                    <div className="text-xs font-bold">
                      {affordabilityRate}%
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                      <div className="font-bold">{region} - Decile {decile}</div>
                      <div>Affordability: {affordabilityRate}%</div>
                      <div>Avg Income: ${avgIncome.toLocaleString()}</div>
                      <div>Avg Price: ${avgHousePrice.toLocaleString()}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Color Legend */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Affordability Rate Legend</h4>
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-gray-600">Low</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-red-800 rounded"></div>
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <div className="w-4 h-4 bg-yellow-300 rounded"></div>
            <div className="w-4 h-4 bg-green-300 rounded"></div>
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <div className="w-4 h-4 bg-green-600 rounded"></div>
          </div>
          <span className="text-gray-600">High</span>
          <div className="ml-4 text-gray-500">
            <span>0%-10% | 11%-20% | 21%-30% | 31%-40% | 41%-50% | 51%-60% | 61%-70% | 71%-80% | 81%+</span>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
          <h5 className="font-semibold text-red-800 mb-1">Crisis Level</h5>
          <p className="text-lg font-bold text-red-800">{minRate}%</p>
          <p className="text-xs text-red-600">Lowest affordability rate</p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <h5 className="font-semibold text-blue-800 mb-1">Average</h5>
          <p className="text-lg font-bold text-blue-800">{avgAffordability.toFixed(1)}%</p>
          <p className="text-xs text-blue-600">Overall affordability</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <h5 className="font-semibold text-green-800 mb-1">Best Case</h5>
          <p className="text-lg font-bold text-green-800">{maxRate}%</p>
          <p className="text-xs text-green-600">Highest affordability rate</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
          <h5 className="font-semibold text-purple-800 mb-1">Gap Severity</h5>
          <p className="text-lg font-bold text-purple-800">{maxRate - minRate}%</p>
          <p className="text-xs text-purple-600">Affordability range</p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-lg p-4">
          <h5 className="font-semibold text-red-800 mb-2">Affordability Crisis</h5>
          <p className="text-sm text-red-600">
            Lower income deciles (1-4) face severe affordability challenges across all regions, 
            with rates below 20% in most areas.
          </p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <h5 className="font-semibold text-yellow-800 mb-2">Middle-Class Squeeze</h5>
          <p className="text-sm text-yellow-600">
            Even middle-income households (deciles 5-7) struggle with affordability, 
            particularly in Mississauga and Caledon.
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-semibold text-blue-800 mb-2">Regional Variation</h5>
          <p className="text-sm text-blue-600">
            Brampton shows relatively better affordability across deciles, 
            while Caledon presents the greatest challenges.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AffordabilityGapHeatmap;