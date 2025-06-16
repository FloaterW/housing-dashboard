import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AirBnbDashboard from '../AirBnbDashboard';

// Mock recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  Bar: () => <div data-testid="bar" />,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />
}));

// Mock the data module
jest.mock('../../data/airbnbData', () => ({
  airbnbHistoricalData: [
    {
      date: '2024-01-01',
      month: 'Jan 2024',
      region: 'Mississauga',
      averagePrice: 120,
      totalListings: 150,
      averageRating: '4.2',
      occupancyRate: 75,
      newListings: 10,
      reviewCount: 300,
      superhostPercentage: 25,
      averageResponseTime: 60,
      propertyTypes: [
        { type: 'Entire home', count: 80, percentage: 53 },
        { type: 'Private room', count: 60, percentage: 40 },
        { type: 'Shared room', count: 10, percentage: 7 }
      ]
    },
    {
      date: '2024-02-01',
      month: 'Feb 2024',
      region: 'Mississauga',
      averagePrice: 125,
      totalListings: 155,
      averageRating: '4.3',
      occupancyRate: 78,
      newListings: 12,
      reviewCount: 320,
      superhostPercentage: 27,
      averageResponseTime: 55,
      propertyTypes: [
        { type: 'Entire home', count: 85, percentage: 55 },
        { type: 'Private room', count: 60, percentage: 39 },
        { type: 'Shared room', count: 10, percentage: 6 }
      ]
    }
  ],
  airbnbCompetitiveData: [
    {
      region: 'Mississauga',
      platforms: [
        { platform: 'Airbnb', averagePrice: 120, listingCount: 150, averageRating: '4.2', marketShare: 60 },
        { platform: 'VRBO', averagePrice: 130, listingCount: 80, averageRating: '4.1', marketShare: 30 },
        { platform: 'Booking.com', averagePrice: 125, listingCount: 30, averageRating: '4.0', marketShare: 10 }
      ]
    }
  ],
  airbnbMetrics: {
    totalListings: 305,
    averagePrice: { current: 125, change: '4.2' },
    occupancyRate: { current: 78, change: '4.0' },
    averageRating: { current: '4.3', change: '2.4' },
    newListings: { current: 12, change: '20.0' }
  },
  airbnbOpportunityAnalysis: [
    {
      region: 'Mississauga',
      opportunityScore: 75,
      metrics: {
        priceGrowth: '4.2',
        listingGrowth: '3.3',
        occupancyRate: 78,
        averageRating: '4.3',
        averageResponseTime: 55
      },
      recommendation: 'Good market opportunity - Solid fundamentals with growth potential',
      risks: ['No significant risks identified']
    }
  ],
  estimateAirBnbRevenue: jest.fn(() => ({
    region: 'Mississauga',
    monthlyRevenuePerListing: 2500,
    totalMarketRevenue: 387500,
    averagePrice: 125,
    occupancyRate: 78,
    estimatedBookingsPerMonth: 8,
    averageBookingDuration: 3
  }))
}));

describe('AirBnbDashboard', () => {
  beforeEach(() => {
    // Clear any previous test data
    jest.clearAllMocks();
  });

  test('renders dashboard header correctly', () => {
    render(<AirBnbDashboard />);
    
    expect(screen.getByText('AirBnB Market Analytics')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive analysis of short-term rental market trends and opportunities')).toBeInTheDocument();
  });

  test('renders region and timeframe selectors', () => {
    render(<AirBnbDashboard />);
    
    expect(screen.getByText('Region')).toBeInTheDocument();
    expect(screen.getByText('Time Period')).toBeInTheDocument();
    
    // Check that options are available
    expect(screen.getByText('Mississauga')).toBeInTheDocument();
    expect(screen.getByText('6 Months')).toBeInTheDocument();
  });

  test('renders tab navigation', () => {
    render(<AirBnbDashboard />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Trends')).toBeInTheDocument();
    expect(screen.getByText('Competition')).toBeInTheDocument();
    expect(screen.getByText('Opportunity')).toBeInTheDocument();
  });

  test('displays key metrics cards in overview tab', () => {
    render(<AirBnbDashboard />);
    
    expect(screen.getByText('Average Nightly Rate')).toBeInTheDocument();
    expect(screen.getByText('Total Active Listings')).toBeInTheDocument();
    expect(screen.getByText('Average Occupancy Rate')).toBeInTheDocument();
    expect(screen.getByText('Average Rating')).toBeInTheDocument();
  });

  test('displays revenue estimation section', () => {
    render(<AirBnbDashboard />);
    
    expect(screen.getByText(/Revenue Estimation/)).toBeInTheDocument();
    expect(screen.getByText('Monthly Revenue per Listing')).toBeInTheDocument();
    expect(screen.getByText('Total Market Revenue')).toBeInTheDocument();
    expect(screen.getByText('Avg Bookings/Month')).toBeInTheDocument();
  });

  test('switches between tabs correctly', async () => {
    render(<AirBnbDashboard />);
    
    // Initially on overview tab
    expect(screen.getByText(/Revenue Estimation/)).toBeInTheDocument();
    
    // Switch to trends tab
    fireEvent.click(screen.getByText('Trends'));
    await waitFor(() => {
      expect(screen.getByText('Average Nightly Rate Trends')).toBeInTheDocument();
    });
    
    // Switch to competition tab
    fireEvent.click(screen.getByText('Competition'));
    await waitFor(() => {
      expect(screen.getByText(/Platform Competition Analysis/)).toBeInTheDocument();
    });
    
    // Switch to opportunity tab
    fireEvent.click(screen.getByText('Opportunity'));
    await waitFor(() => {
      expect(screen.getByText(/Market Opportunity Analysis/)).toBeInTheDocument();
    });
  });

  test('updates data when region changes', async () => {
    render(<AirBnbDashboard />);
    
    const selects = screen.getAllByRole('combobox');
    const regionSelect = selects[0]; // First select should be region
    
    fireEvent.change(regionSelect, { target: { value: 'Brampton' } });
    
    await waitFor(() => {
      expect(regionSelect.value).toBe('Brampton');
    });
  });

  test('updates data when timeframe changes', async () => {
    render(<AirBnbDashboard />);
    
    const selects = screen.getAllByRole('combobox');
    const timeframeSelect = selects[1]; // Second select should be timeframe
    
    fireEvent.change(timeframeSelect, { target: { value: '12' } });
    
    await waitFor(() => {
      expect(timeframeSelect.value).toBe('12');
    });
  });

  test('displays property type distribution chart', () => {
    render(<AirBnbDashboard />);
    
    expect(screen.getByText('Property Type Distribution')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  test('displays trends charts when trends tab is active', async () => {
    render(<AirBnbDashboard />);
    
    fireEvent.click(screen.getByText('Trends'));
    
    await waitFor(() => {
      expect(screen.getByText('Average Nightly Rate Trends')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Occupancy Rate Trends')).toBeInTheDocument();
    expect(screen.getByText('Total Listings Growth')).toBeInTheDocument();
    expect(screen.getByText('New Listings per Month')).toBeInTheDocument();
    expect(screen.getByText('Average Rating Trends')).toBeInTheDocument();
  });

  test('displays competition analysis when competition tab is active', async () => {
    render(<AirBnbDashboard />);
    
    fireEvent.click(screen.getByText('Competition'));
    
    await waitFor(() => {
      expect(screen.getByText(/Platform Competition Analysis/)).toBeInTheDocument();
    });
    
    expect(screen.getByText('Airbnb')).toBeInTheDocument();
    expect(screen.getByText('VRBO')).toBeInTheDocument();
    expect(screen.getByText('Booking.com')).toBeInTheDocument();
  });

  test('displays opportunity analysis when opportunity tab is active', async () => {
    render(<AirBnbDashboard />);
    
    fireEvent.click(screen.getByText('Opportunity'));
    
    await waitFor(() => {
      expect(screen.getByText(/Market Opportunity Analysis/)).toBeInTheDocument();
    });
    
    expect(screen.getByText('Opportunity Score')).toBeInTheDocument();
    expect(screen.getByText('Key Metrics')).toBeInTheDocument();
    expect(screen.getByText('Market Risks')).toBeInTheDocument();
    expect(screen.getByText('Recommendation')).toBeInTheDocument();
  });

  test('handles missing data gracefully', () => {
    // Mock empty data
    jest.doMock('../../data/airbnbData', () => ({
      airbnbHistoricalData: [],
      airbnbCompetitiveData: [],
      airbnbMetrics: null,
      airbnbOpportunityAnalysis: [],
      estimateAirBnbRevenue: jest.fn(() => null)
    }));
    
    render(<AirBnbDashboard />);
    
    // Should still render without crashing
    expect(screen.getByText('AirBnB Market Analytics')).toBeInTheDocument();
  });

  test('metric cards display correct values and changes', () => {
    render(<AirBnbDashboard />);
    
    // Check that metric values are displayed
    expect(screen.getByText('$125')).toBeInTheDocument(); // Average price
    expect(screen.getByText('305')).toBeInTheDocument(); // Total listings
    expect(screen.getByText('78%')).toBeInTheDocument(); // Occupancy rate
    expect(screen.getByText('4.3')).toBeInTheDocument(); // Average rating
  });

  test('opportunity score progress bar displays correctly', async () => {
    render(<AirBnbDashboard />);
    
    fireEvent.click(screen.getByText('Opportunity'));
    
    await waitFor(() => {
      expect(screen.getByText('75/100')).toBeInTheDocument();
    });
  });
});