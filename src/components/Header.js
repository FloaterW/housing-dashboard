import React from 'react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">Housing Market Dashboard</h1>
        <p className="text-blue-100">Real-time analytics and insights for the Greater Toronto Area housing market</p>
      </div>
    </header>
  );
}

export default Header; 