import React from 'react';
import { housingData } from '../data/housingData';

function Sidebar({ onRegionChange, onHousingTypeChange, selectedRegion, selectedHousingType }) {
  return (
    <aside className="w-64 bg-white shadow-lg p-6">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Region</h3>
        <div className="space-y-2">
          {housingData.regions.map((region) => (
            <button
              key={region}
              onClick={() => onRegionChange(region)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                selectedRegion === region
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Housing Type</h3>
        <div className="space-y-2">
          {housingData.housingTypes.map((type) => (
            <button
              key={type}
              onClick={() => onHousingTypeChange(type)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                selectedHousingType === type
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar; 