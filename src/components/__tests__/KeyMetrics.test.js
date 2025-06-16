import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import KeyMetrics from '../KeyMetrics';

// Mock the housing data
jest.mock('../../data/housingData', () => ({
  getDataForRegionAndType: jest.fn(() => ({
    avgPrice: 1245000,
    priceChange: 5.2,
    totalSales: 1400,
    salesChange: 3.7,
    avgDaysOnMarket: 18,
    daysChange: -2.5,
    inventory: 3500,
    inventoryChange: -8.3,
  })),
}));

describe('KeyMetrics Component', () => {
  const defaultProps = {
    selectedRegion: 'Peel Region',
    selectedHousingType: 'All Types',
  };

  test('renders without crashing', () => {
    render(<KeyMetrics {...defaultProps} />);
    expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument();
  });

  test('displays correct region and housing type', () => {
    render(<KeyMetrics {...defaultProps} />);
    expect(screen.getByText('Peel Region - All Types')).toBeInTheDocument();
  });

  test('displays all four metric cards', () => {
    render(<KeyMetrics {...defaultProps} />);

    expect(screen.getByText('Average Price')).toBeInTheDocument();
    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getByText('Days on Market')).toBeInTheDocument();
    expect(screen.getByText('Active Inventory')).toBeInTheDocument();
  });

  test('formats currency correctly', () => {
    render(<KeyMetrics {...defaultProps} />);

    expect(screen.getByText('$1,245,000')).toBeInTheDocument();
  });

  test('displays positive and negative changes correctly', () => {
    render(<KeyMetrics {...defaultProps} />);

    // Should show upward arrow for positive changes
    expect(screen.getByText('5.2%')).toBeInTheDocument();
    expect(screen.getByText('3.7%')).toBeInTheDocument();

    // Should show downward arrow for negative changes
    expect(screen.getByText('2.5%')).toBeInTheDocument(); // absolute value
    expect(screen.getByText('8.3%')).toBeInTheDocument(); // absolute value
  });

  test('displays metric values correctly', () => {
    render(<KeyMetrics {...defaultProps} />);

    expect(screen.getByText('1,400')).toBeInTheDocument(); // Total sales
    expect(screen.getByText('18')).toBeInTheDocument(); // Days on market
    expect(screen.getByText('3,500')).toBeInTheDocument(); // Inventory
  });
});
