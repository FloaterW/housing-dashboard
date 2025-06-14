import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

function App() {
  const [selectedRegion, setSelectedRegion] = useState('Peel Region');
  const [selectedHousingType, setSelectedHousingType] = useState('All Types');

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
  };

  const handleHousingTypeChange = (type) => {
    setSelectedHousingType(type);
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
        />
        <Dashboard 
          selectedRegion={selectedRegion}
          selectedHousingType={selectedHousingType}
        />
      </div>
    </div>
  );
}

export default App;
