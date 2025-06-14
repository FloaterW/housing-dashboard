import React from 'react';
import { housingData } from '../data/housingData';

function Sidebar({ onRegionChange, onHousingTypeChange, selectedRegion, selectedHousingType }) {
  return (
    <aside className="w-64 bg-white shadow-2xl p-6 overflow-y-auto">
      <div className="mb-8 animate-slide-up">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2 text-xl">📍</span>
          Select Region
        </h3>
        <div className="space-y-2">
          {housingData.regions.map((region, index) => (
            <button
              key={region}
              onClick={() => onRegionChange(region)}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105
                ${selectedRegion === region
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }
                animate-slide-up
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{region}</span>
                {selectedRegion === region && (
                  <span className="text-lg animate-bounce">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2 text-xl">🏡</span>
          Housing Type
        </h3>
        <div className="space-y-2">
          {housingData.housingTypes.map((type, index) => (
            <button
              key={type}
              onClick={() => onHousingTypeChange(type)}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105
                ${selectedHousingType === type
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }
                animate-slide-up
              `}
              style={{ animationDelay: `${(index + 4) * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{type}</span>
                {selectedHousingType === type && (
                  <span className="text-lg animate-bounce">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg animate-slide-up" style={{ animationDelay: '400ms' }}>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Regions</span>
            <span className="font-medium text-gray-800">4</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Property Types</span>
            <span className="font-medium text-gray-800">5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Data Points</span>
            <span className="font-medium text-gray-800">14 months</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar; 