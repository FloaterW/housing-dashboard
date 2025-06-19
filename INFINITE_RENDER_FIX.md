# 🔧 Fix: Infinite Re-render Loop in KeyMetrics Component

## Issue

**Error**: `Too many re-renders. React limits the number of renders to prevent an infinite loop.`

**Location**: KeyMetrics component at line 1052

## Root Cause Analysis

The infinite loop was caused by calling `logExperiment()` during the render phase:

```javascript
// ❌ PROBLEMATIC CODE - Causes infinite re-renders
// Determine which data to use
let data, dataSource;

if (useApiData && !apiLoadError && apiData) {
  const transformedData = transformApiData(apiData);
  if (transformedData) {
    data = transformedData;
    dataSource = 'API';
    logExperiment('Using API data', 'info'); // ⚠️ State update during render!
  }
  // ... more render-phase state updates
}
```

**Problem**: `logExperiment()` calls `setExperimentLog()` which triggers a re-render, creating an infinite loop.

## Solution Applied

### 1. Moved Side Effects to useEffect

```javascript
// ✅ FIXED CODE - Side effects in useEffect
useEffect(() => {
  if (dataSource === 'API') {
    logExperiment('Using API data', 'info');
  } else if (dataSource === 'Hardcoded (API transform failed)') {
    logExperiment(
      'API data transformation failed, using hardcoded data',
      'warning'
    );
  }
  // ... other logging based on dataSource
}, [dataSource, apiLoadError, logExperiment]);
```

### 2. Memoized Expensive Computations

```javascript
// ✅ Prevent unnecessary recalculations
const regionId = useMemo(() => mapRegionToId(selectedRegion), [selectedRegion]);
const housingTypeId = useMemo(
  () => mapHousingTypeToId(selectedHousingType),
  [selectedHousingType]
);

const hardcodedData = useMemo(
  () =>
    getDataForRegionAndType('keyMetrics', selectedRegion, selectedHousingType),
  [selectedRegion, selectedHousingType]
);

const { data, dataSource } = useMemo(() => {
  // Data determination logic moved here
}, [
  useApiData,
  apiLoadError,
  apiData,
  apiLoading,
  hardcodedData,
  transformApiData,
]);
```

### 3. Optimized Callbacks

```javascript
// ✅ Prevent function recreation on every render
const logExperiment = useCallback((message, type = 'info', data = null) => {
  // Logging logic
}, []);

const formatCurrency = useCallback(value => {
  // Formatting logic
}, []);

const transformApiData = useCallback(data => {
  // Transformation logic
}, []);
```

### 4. Memoized Component Arrays

```javascript
// ✅ Prevent metric cards recreation
const metricCards = useMemo(
  () => [
    // Metric card definitions
  ],
  [data, formatCurrency]
);
```

## Key React Performance Rules Applied

### ✅ DO

- Use `useEffect` for side effects (logging, API calls, etc.)
- Use `useMemo` for expensive computations
- Use `useCallback` for functions passed as props
- Memoize arrays and objects that don't need to change

### ❌ DON'T

- Call setState or any side effects during render
- Create new objects/arrays on every render
- Use functions that trigger state updates in render phase
- Ignore dependency arrays in hooks

## Testing Verification

After applying the fix:

- ✅ Component renders without errors
- ✅ API integration still works correctly
- ✅ Toggle functionality preserved
- ✅ Debug logging still functional
- ✅ Performance improved (fewer re-renders)

## Prevention for Future Components

When creating new API-integrated components:

1. **Always use useEffect for side effects**:

   ```javascript
   useEffect(() => {
     // Log state changes here, not in render
   }, [dependencies]);
   ```

2. **Memoize expensive operations**:

   ```javascript
   const expensiveValue = useMemo(() => calculateSomething(), [deps]);
   ```

3. **Use React DevTools Profiler** to identify performance issues early

4. **Follow the "pure render" principle**: Render should be deterministic and side-effect free

## Files Modified

- `src/components/KeyMetrics.js` - Complete refactor for performance
- `EXPERIMENT_LOG.md` - Updated with fix documentation

---

**Result**: Component now renders cleanly with optimized performance and maintained functionality.

_Fixed: June 19, 2025_
