import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import KeyMetrics from '../KeyMetrics';

// Mock the API hook
jest.mock('../../hooks/useApi', () => ({
  useApi: jest.fn(() => ({
    data: {
      avg_price: '1245000.000000',
      price_change_pct: 5.2,
      total_sales: 1400,
      sales_change_pct: 3.7,
      avg_days_on_market: '18.0000',
      days_change_pct: -2.5,
      active_listings: 3500,
      inventory_change_pct: -8.3,
    },
    loading: false,
    error: null,
  })),
}));

// Mock logger
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}));

// Mock data mappers
jest.mock('../../utils/dataMappers', () => ({
  mapRegionToId: jest.fn(() => 2),
  mapHousingTypeToId: jest.fn(() => 1),
  transformMarketMetrics: jest.fn(data => ({
    avgPrice: 1245000,
    priceChange: 5.2,
    totalSales: 1400,
    salesChange: 3.7,
    avgDaysOnMarket: 18,
    daysChange: -2.5,
    inventory: 3500,
    inventoryChange: -8.3,
  })),
  getFallbackMetrics: jest.fn(() => ({
    avgPrice: 0,
    priceChange: 0,
    totalSales: 0,
    salesChange: 0,
    avgDaysOnMarket: 0,
    daysChange: 0,
    inventory: 0,
    inventoryChange: 0,
  })),
  formatCurrency: jest.fn(value =>
    new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  ),
  isValidData: jest.fn(() => true),
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
