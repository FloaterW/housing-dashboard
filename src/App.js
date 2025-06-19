import React, { Suspense } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';

import {
  AppProvider,
  useSelectedRegion,
  useSelectedHousingType,
  useActiveView,
  useAppActions,
} from './context/AppContext';
import logger from './utils/logger';

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

// Main App component using context
function AppContent() {
  const [selectedRegion] = useSelectedRegion();
  const [selectedHousingType] = useSelectedHousingType();
  const [activeView] = useActiveView();
  const actions = useAppActions();

  // Log component mount
  React.useEffect(() => {
    logger.componentMount('App');
    return () => logger.componentUnmount('App');
  }, []);

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
            <AffordabilityThresholds
              selectedRegion={selectedRegion}
              selectedHousingType={selectedHousingType}
            />
          </Suspense>
        );
      case 'affordability-targets':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AffordabilityTargets
              selectedRegion={selectedRegion}
              selectedHousingType={selectedHousingType}
            />
          </Suspense>
        );
      case 'rental':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <RentalDashboard
              selectedRegion={selectedRegion}
              selectedHousingType={selectedHousingType}
            />
          </Suspense>
        );
      case 'ownership':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <OwnershipDashboard
              selectedRegion={selectedRegion}
              selectedHousingType={selectedHousingType}
            />
          </Suspense>
        );
      case 'airbnb':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AirBnbDashboard
              selectedRegion={selectedRegion}
              selectedHousingType={selectedHousingType}
            />
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
              selectedRegion={selectedRegion}
              selectedHousingType={selectedHousingType}
              onRegionChange={actions.setSelectedRegion}
              onHousingTypeChange={actions.setSelectedHousingType}
              onNavigate={actions.setActiveView}
              activeView={activeView}
            />
          </div>
          <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto">{renderContent()}</div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Wrapper component with context provider
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
