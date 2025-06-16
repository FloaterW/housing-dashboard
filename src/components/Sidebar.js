import React, { useState } from 'react';
import { housingData } from '../data/housingData';

function Sidebar({
  onRegionChange,
  onHousingTypeChange,
  selectedRegion,
  selectedHousingType,
  onNavigate,
  activeView,
}) {
  const [expandedSection, setExpandedSection] = useState(null);

  const handleNavigation = viewId => {
    if (onNavigate) {
      onNavigate(viewId);
    }
  };

  const toggleSection = section => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <aside className="w-full p-6 overflow-y-auto sticky top-0 max-h-screen">
      <div className="mb-8 animate-slide-up">
        <h3
          id="region-heading"
          className="text-lg font-bold text-gray-800 mb-4 flex items-center"
        >
          <span className="mr-2 text-xl" aria-hidden="true">
            📍
          </span>
          Select Region
        </h3>
        <div
          className="space-y-2"
          role="radiogroup"
          aria-labelledby="region-heading"
        >
          {housingData.regions.map((region, index) => (
            <button
              key={region}
              onClick={() => onRegionChange(region)}
              role="radio"
              aria-checked={selectedRegion === region}
              aria-label={`Select ${region} region`}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${
                  selectedRegion === region
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

      <div
        className="mb-8 animate-slide-up"
        style={{ animationDelay: '200ms' }}
      >
        <h3
          id="housing-type-heading"
          className="text-lg font-bold text-gray-800 mb-4 flex items-center"
        >
          <span className="mr-2 text-xl" aria-hidden="true">
            🏡
          </span>
          Housing Type
        </h3>
        <div
          className="space-y-2"
          role="radiogroup"
          aria-labelledby="housing-type-heading"
        >
          {housingData.housingTypes.map((type, index) => (
            <button
              key={type}
              onClick={() => onHousingTypeChange(type)}
              role="radio"
              aria-checked={selectedHousingType === type}
              aria-label={`Select ${type} housing type`}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                ${
                  selectedHousingType === type
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

      {/* Housing Affordability Section */}
      <div
        className="mb-8 animate-slide-up"
        style={{ animationDelay: '400ms' }}
      >
        <button
          onClick={() => toggleSection('affordability')}
          className={`
            w-full text-left px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105
            ${
              expandedSection === 'affordability' ||
              activeView?.startsWith('affordability')
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
            }
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2 text-xl">💰</span>
              <span className="font-medium">Housing Affordability</span>
            </div>
            <span
              className={`transform transition-transform ${expandedSection === 'affordability' ? 'rotate-180' : ''}`}
            >
              ▼
            </span>
          </div>
        </button>

        {expandedSection === 'affordability' && (
          <div className="mt-2 space-y-2 pl-4">
            <button
              onClick={() => handleNavigation('affordability-thresholds')}
              className={`
                w-full text-left px-4 py-2 rounded-lg transition-all duration-300
                ${
                  activeView === 'affordability-thresholds'
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              Thresholds 2024
            </button>
            <button
              onClick={() => handleNavigation('affordability-targets')}
              className={`
                w-full text-left px-4 py-2 rounded-lg transition-all duration-300
                ${
                  activeView === 'affordability-targets'
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              Progress vs Targets
            </button>
          </div>
        )}
      </div>

      {/* New & Total Rental Section */}
      <div
        className="mb-8 animate-slide-up"
        style={{ animationDelay: '500ms' }}
      >
        <button
          onClick={() => handleNavigation('rental')}
          className={`
            w-full text-left px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105
            ${
              activeView === 'rental'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
            }
          `}
        >
          <div className="flex items-center">
            <span className="mr-2 text-xl">🏢</span>
            <span className="font-medium">New & Total Rental</span>
          </div>
        </button>
      </div>

      {/* New & Total Ownership Section */}
      <div
        className="mb-8 animate-slide-up"
        style={{ animationDelay: '600ms' }}
      >
        <button
          onClick={() => handleNavigation('ownership')}
          className={`
            w-full text-left px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105
            ${
              activeView === 'ownership'
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
            }
          `}
        >
          <div className="flex items-center">
            <span className="mr-2 text-xl">🏠</span>
            <span className="font-medium">New & Total Ownership</span>
          </div>
        </button>
      </div>

      {/* AirBnB Analytics Section */}
      <div
        className="mb-8 animate-slide-up"
        style={{ animationDelay: '700ms' }}
      >
        <button
          onClick={() => handleNavigation('airbnb')}
          className={`
            w-full text-left px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105
            ${
              activeView === 'airbnb'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
            }
          `}
        >
          <div className="flex items-center">
            <span className="mr-2 text-xl">🏨</span>
            <span className="font-medium">AirBnB Analytics</span>
          </div>
        </button>
      </div>

      {/* Quick Stats */}
      <div
        className="mt-8 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg animate-slide-up"
        style={{ animationDelay: '700ms' }}
      >
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Quick Stats
        </h4>
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
