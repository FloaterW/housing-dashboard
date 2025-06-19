# Frontend-Backend Integration Plan

## Problem Statement

The frontend currently uses hardcoded data from `/src/data/` files instead of connecting to the backend MySQL database. While the backend has comprehensive API endpoints and populated database tables, no frontend components are actually consuming this data.

## Current State Analysis

### ✅ Backend Infrastructure (Already Working)

- MySQL database with 35 tables and real data
- Comprehensive API routes in `/backend/routes/`:
  - `housing.js` - Property sales, regions, types, analytics
  - `airbnb.js` - AirBnB listings and metrics
  - `rental.js` - Rental market data
  - `analytics.js` - Market trends and analysis
- Working API service class in `src/services/api.js`
- Custom hooks for API calls in `src/hooks/useApi.js`

### ❌ Frontend Data Flow (Currently Broken)

- All components import from hardcoded `/src/data/` files
- No components use `apiService` or `useApi` hooks
- No connection between UI selections and backend filters

## Integration Plan

### Phase 1: Core Data Integration (Priority: HIGH)

#### 1.1 Replace Housing Dashboard Components

**Target Files:**

- `src/components/Dashboard.js`
- `src/components/KeyMetrics.js`
- `src/components/charts/PriceChart.js`
- `src/components/charts/SalesChart.js`
- `src/components/charts/HousingTypeDistributionChart.js`

**Changes Required:**

```javascript
// BEFORE (hardcoded)
import { getDataForRegionAndType } from '../data/housingData';

// AFTER (API-driven)
import { useApi } from '../hooks/useApi';
import apiService from '../services/api';
```

#### 1.2 Replace AirBnB Dashboard

**Target Files:**

- `src/components/AirBnbDashboard.js`

**Changes Required:**

- Remove imports from `../data/airbnbData`
- Implement API calls to `/api/airbnb/listings` and `/api/airbnb/metrics`
- Connect region/timeframe selectors to API filters

#### 1.3 Update Chart Components

**Target Files:**

- All files in `src/components/charts/`

**Pattern to Replace:**

```javascript
// OLD
const data = housingData.priceData[selectedRegion][selectedType];

// NEW
const { data, loading, error } = useApi('/housing/price-trends', {
  regionId: getRegionId(selectedRegion),
  housingTypeId: getTypeId(selectedType),
  startDate: startDate,
  endDate: endDate,
});
```

### Phase 2: Data Mapping and Transformation (Priority: MEDIUM)

#### 2.1 Create Data Mapping Layer

**New File:** `src/utils/dataMappers.js`

```javascript
// Map frontend region names to backend IDs
export const mapRegionToId = regionName => {
  const mapping = {
    'Peel Region': 1,
    Mississauga: 2,
    Brampton: 3,
    Caledon: 4,
  };
  return mapping[regionName];
};

// Transform backend data to frontend format
export const transformPriceData = backendData => {
  return backendData.map(item => ({
    month: formatMonth(item.month),
    price: item.avg_price,
    change: item.mom_change_pct,
  }));
};
```

#### 2.2 Update API Service Methods

**File:** `src/services/api.js`

- Add specific methods for each dashboard section
- Implement proper error handling with fallbacks
- Add data transformation before returning

### Phase 3: Database Population (Priority: MEDIUM)

#### 3.1 Populate Missing Tables

**Empty Tables to Fill:**

- `market_velocity` - Days on market, listing turnover
- `new_vs_resale` - New construction vs resale data
- `ownership_trends` - Homeownership rates over time
- `rental_yields` - Investment property returns

#### 3.2 Create Data Migration Scripts

**New Files:**

- `backend/scripts/migrate-hardcoded-data.js`
- `backend/scripts/populate-missing-tables.js`

### Phase 4: Real-Time Features (Priority: LOW)

#### 4.1 WebSocket Integration

- Real-time price updates
- Live market alerts
- Dynamic dashboard updates

#### 4.2 Advanced Caching

- Redis implementation for frequently accessed data
- Client-side caching with TTL

## Implementation Steps

### Step 1: Create Region/Type ID Mapping

1. Query database for all regions and housing types
2. Create mapping objects for frontend names to backend IDs
3. Add helper functions to convert between formats

### Step 2: Update One Component at a Time

1. Start with `KeyMetrics.js` (simplest)
2. Replace hardcoded imports with `useApi` calls
3. Test thoroughly before moving to next component
4. Keep hardcoded data as fallback during transition

### Step 3: Migrate Hardcoded Data to Database

1. Create scripts to transfer data from `/src/data/` files to database
2. Ensure data formats match expected API responses
3. Validate all existing functionality still works

### Step 4: Remove Hardcoded Data Files

1. Delete unused files in `/src/data/`
2. Update imports and references
3. Clean up unused utilities

## Testing Strategy

### Unit Tests

- Test API service methods
- Test data transformation functions
- Test error handling and fallbacks

### Integration Tests

- Test complete data flow from database to UI
- Test region/filter changes trigger correct API calls
- Test loading states and error scenarios

### Performance Tests

- Measure API response times
- Test caching effectiveness
- Monitor bundle size changes

## Rollback Plan

### Gradual Migration

- Keep hardcoded data as fallback during transition
- Use feature flags to switch between data sources
- Monitor for errors and performance issues

### Quick Rollback

- Git branches for each phase
- Database backup before major changes
- Environment variables to toggle data sources

## Success Metrics

### Technical Metrics

- ✅ All dashboard data comes from database
- ✅ API response times < 500ms
- ✅ Zero hardcoded data files in use
- ✅ 100% test coverage for data layer

### User Experience

- ✅ No change in dashboard functionality
- ✅ Faster data updates (real-time)
- ✅ More accurate/current data
- ✅ Better error handling

## Risk Assessment

### High Risk

- **Data Format Mismatches** - Backend format differs from frontend expectations
- **Performance Issues** - API calls slower than hardcoded data
- **Feature Regression** - Existing functionality breaks

### Mitigation Strategies

- Thorough testing at each step
- Gradual rollout with feature flags
- Keep hardcoded data as backup initially
- Monitor performance and error rates

## Timeline Estimate

- **Phase 1**: 2-3 days (Core integration)
- **Phase 2**: 1-2 days (Data mapping)
- **Phase 3**: 1-2 days (Database population)
- **Phase 4**: 3-5 days (Advanced features)

**Total**: 7-12 days for complete integration
