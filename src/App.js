import React, { useState, Suspense } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import ApiTest from './components/ApiTest';

// Lazy load components for code splitting
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const AffordabilityThresholds = React.lazy(
  () => import('./components/AffordabilityThresholds')
);
const AffordabilityTargets = React.lazy(
  () => import('./components/AffordabilityTargets')
);
const RentalDashboard = React.lazy(
  () => import('./components/RentalDashboard')
);
const OwnershipDashboard = React.lazy(
  () => import('./components/OwnershipDashboard')
);
const AirBnbDashboard = React.lazy(
  () => import('./components/AirBnbDashboard')
);

function App() {
  const [selectedRegion, setSelectedRegion] = useState('Peel Region');
  const [selectedHousingType, setSelectedHousingType] = useState('All Types');
  const [activeView, setActiveView] = useState('dashboard');

  const handleRegionChange = region => {
    setSelectedRegion(region);
  };

  const handleHousingTypeChange = type => {
    setSelectedHousingType(type);
  };

  const handleNavigation = viewId => {
    setActiveView(viewId);
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'affordability-thresholds':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AffordabilityThresholds selectedRegion={selectedRegion} />
          </Suspense>
        );
      case 'affordability-targets':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AffordabilityTargets />
          </Suspense>
        );
      case 'rental':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <RentalDashboard selectedRegion={selectedRegion} />
          </Suspense>
        );
      case 'ownership':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <OwnershipDashboard />
          </Suspense>
        );
      case 'airbnb':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AirBnbDashboard />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard
              selectedRegion={selectedRegion}
              selectedHousingType={selectedHousingType}
            />
          </Suspense>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <div className="w-64 bg-white">
            <Sidebar
              onRegionChange={handleRegionChange}
              onHousingTypeChange={handleHousingTypeChange}
              selectedRegion={selectedRegion}
              selectedHousingType={selectedHousingType}
              onNavigate={handleNavigation}
              activeView={activeView}
            />
          </div>
          <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
