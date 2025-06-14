import React from 'react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
      </div>
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-slide-up flex items-center">
              <span className="mr-3 text-4xl animate-bounce">🏠</span>
              Housing Market Dashboard
            </h1>
            <p className="text-blue-100 text-sm md:text-base animate-fade-in" style={{ animationDelay: '200ms' }}>
              Real-time analytics and insights for the Greater Toronto Area housing market
            </p>
          </div>
          
          {/* Live indicator */}
          <div className="hidden md:flex items-center space-x-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-100">Live Data</span>
          </div>
        </div>
        
        {/* Market status bar */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-green-300">▲</span>
            <span>Market Up 5.2%</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span>📊</span>
            <span>1,400 Sales This Month</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span>⚡</span>
            <span>18 Days Average</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 