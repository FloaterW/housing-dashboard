import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AffordabilityThresholds from './components/AffordabilityThresholds';
import AffordabilityTargets from './components/AffordabilityTargets';
import RentalDashboard from './components/RentalDashboard';
import OwnershipDashboard from './components/OwnershipDashboard';

function App() {
  const [selectedRegion, setSelectedRegion] = useState('Peel Region');
  const [selectedHousingType, setSelectedHousingType] = useState('All Types');
  const [activeView, setActiveView] = useState('dashboard');

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
  };

  const handleHousingTypeChange = (type) => {
    setSelectedHousingType(type);
  };

  const handleNavigation = (viewId) => {
    setActiveView(viewId);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'affordability-thresholds':
        return <AffordabilityThresholds selectedRegion={selectedRegion} />;
      case 'affordability-targets':
        return <AffordabilityTargets />;
      case 'rental':
        return <RentalDashboard selectedRegion={selectedRegion} />;
      case 'ownership':
        return <OwnershipDashboard />;
      default:
        return (
          <Dashboard 
            selectedRegion={selectedRegion}
            selectedHousingType={selectedHousingType}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          onRegionChange={handleRegionChange} 
          onHousingTypeChange={handleHousingTypeChange}
          selectedRegion={selectedRegion}
          selectedHousingType={selectedHousingType}
          onNavigate={handleNavigation}
          activeView={activeView}
        />
        <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
