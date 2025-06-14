import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ownershipAffordability2024 } from '../data/ownership';

function OwnershipDashboard() {
  const [selectedDecile, setSelectedDecile] = useState(5);

  // Transform data for the selected decile
  const getDecileData = (decile) => {
    const decileData = ownershipAffordability2024.filter(row => row[0] === decile);
    return decileData.map(row => ({
      dwellingType: row[1],
      Mississauga: row[2],
      Brampton: row[3],
      Caledon: row[4],
    }));
  };

  const chartData = getDecileData(selectedDecile);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-sm">
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                <span className="text-gray-600">{entry.name}:</span>
                <span className="font-medium ml-2">{entry.value}%</span>
              </p>
            ))}
            <p className="text-sm font-semibold pt-2 border-t">
              Total Affordability: {total}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const calculateStats = () => {
    const stats = { Mississauga: 0, Brampton: 0, Caledon: 0 };
    chartData.forEach(item => {
      stats.Mississauga += item.Mississauga;
      stats.Brampton += item.Brampton;
      stats.Caledon += item.Caledon;
    });
    return stats;
  };

  const stats = calculateStats();

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">New & Total Ownership</h2>
        <p className="text-gray-600">Housing affordability analysis by income decile and dwelling type</p>
      </div>

      {/* Decile Slider */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Select Income Decile</h3>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="range"
              min="1"
              max="10"
              value={selectedDecile}
              onChange={(e) => setSelectedDecile(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(selectedDecile - 1) * 11.11}%, #E5E7EB ${(selectedDecile - 1) * 11.11}%, #E5E7EB 100%)`
              }}
            />
            <div className="flex justify-between mt-2 px-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <span 
                  key={num} 
                  className={`text-xs ${num === selectedDecile ? 'font-bold text-blue-600' : 'text-gray-500'}`}
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-lg font-semibold text-blue-800">Decile {selectedDecile}</p>
            <p className="text-sm text-blue-600">
              Income Range: ${selectedDecile === 1 ? '< 35k' : selectedDecile === 10 ? '> 160k' : `${35 + (selectedDecile - 1) * 10}-${35 + selectedDecile * 10}k`}
            </p>
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Affordability by Dwelling Type - Decile {selectedDecile}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="dwellingType"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar dataKey="Mississauga" stackId="a" fill="#3B82F6" />
            <Bar dataKey="Brampton" stackId="a" fill="#10B981" />
            <Bar dataKey="Caledon" stackId="a" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* City Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <h4 className="font-semibold text-blue-800 mb-2">Mississauga</h4>
          <p className="text-3xl font-bold text-blue-600">{(stats.Mississauga / 4).toFixed(0)}%</p>
          <p className="text-sm text-blue-600 mt-1">Average Affordability</p>
          <div className="mt-3 space-y-1 text-xs text-left">
            <p>Detached: {chartData.find(d => d.dwellingType === 'Detached')?.Mississauga || 0}%</p>
            <p>Condo: {chartData.find(d => d.dwellingType === 'Condo')?.Mississauga || 0}%</p>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-xl p-6 text-center">
          <h4 className="font-semibold text-green-800 mb-2">Brampton</h4>
          <p className="text-3xl font-bold text-green-600">{(stats.Brampton / 4).toFixed(0)}%</p>
          <p className="text-sm text-green-600 mt-1">Average Affordability</p>
          <div className="mt-3 space-y-1 text-xs text-left">
            <p>Detached: {chartData.find(d => d.dwellingType === 'Detached')?.Brampton || 0}%</p>
            <p>Condo: {chartData.find(d => d.dwellingType === 'Condo')?.Brampton || 0}%</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-xl p-6 text-center">
          <h4 className="font-semibold text-yellow-800 mb-2">Caledon</h4>
          <p className="text-3xl font-bold text-yellow-600">{(stats.Caledon / 4).toFixed(0)}%</p>
          <p className="text-sm text-yellow-600 mt-1">Average Affordability</p>
          <div className="mt-3 space-y-1 text-xs text-left">
            <p>Detached: {chartData.find(d => d.dwellingType === 'Detached')?.Caledon || 0}%</p>
            <p>Condo: {chartData.find(d => d.dwellingType === 'Condo')?.Caledon || 0}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnershipDashboard; 