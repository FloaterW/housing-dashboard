import React, { createContext, useContext, useReducer, useEffect } from 'react';
import logger from '../utils/logger';

// Initial state
const initialState = {
  // UI State
  selectedRegion: 'Peel Region',
  selectedHousingType: 'All Types',
  activeView: 'dashboard',
  loading: false,

  // Data State
  regions: [],
  housingTypes: [],

  // User Preferences
  preferences: {
    theme: 'light',
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutes
    chartAnimations: true,
    compactMode: false,
  },

  // Error State
  errors: {},

  // Cache State
  lastDataFetch: null,
  cacheInvalidated: false,
};

// Action types
export const actionTypes = {
  // UI Actions
  SET_SELECTED_REGION: 'SET_SELECTED_REGION',
  SET_SELECTED_HOUSING_TYPE: 'SET_SELECTED_HOUSING_TYPE',
  SET_ACTIVE_VIEW: 'SET_ACTIVE_VIEW',
  SET_LOADING: 'SET_LOADING',

  // Data Actions
  SET_REGIONS: 'SET_REGIONS',
  SET_HOUSING_TYPES: 'SET_HOUSING_TYPES',

  // User Preference Actions
  SET_PREFERENCE: 'SET_PREFERENCE',
  SET_PREFERENCES: 'SET_PREFERENCES',
  RESET_PREFERENCES: 'RESET_PREFERENCES',

  // Error Actions
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_ALL_ERRORS: 'CLEAR_ALL_ERRORS',

  // Cache Actions
  UPDATE_LAST_FETCH: 'UPDATE_LAST_FETCH',
  INVALIDATE_CACHE: 'INVALIDATE_CACHE',

  // Reset Actions
  RESET_STATE: 'RESET_STATE',
};

// Reducer function
const appReducer = (state, action) => {
  logger.debug('State action dispatched', {
    type: action.type,
    payload: action.payload,
  });

  switch (action.type) {
    case actionTypes.SET_SELECTED_REGION:
      return {
        ...state,
        selectedRegion: action.payload,
        cacheInvalidated: true,
      };

    case actionTypes.SET_SELECTED_HOUSING_TYPE:
      return {
        ...state,
        selectedHousingType: action.payload,
        cacheInvalidated: true,
      };

    case actionTypes.SET_ACTIVE_VIEW:
      return {
        ...state,
        activeView: action.payload,
      };

    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case actionTypes.SET_REGIONS:
      return {
        ...state,
        regions: action.payload,
      };

    case actionTypes.SET_HOUSING_TYPES:
      return {
        ...state,
        housingTypes: action.payload,
      };

    case actionTypes.SET_PREFERENCE:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [action.payload.key]: action.payload.value,
        },
      };

    case actionTypes.SET_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };

    case actionTypes.RESET_PREFERENCES:
      return {
        ...state,
        preferences: initialState.preferences,
      };

    case actionTypes.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error,
        },
      };

    case actionTypes.CLEAR_ERROR:
      const newErrors = { ...state.errors };
      delete newErrors[action.payload];
      return {
        ...state,
        errors: newErrors,
      };

    case actionTypes.CLEAR_ALL_ERRORS:
      return {
        ...state,
        errors: {},
      };

    case actionTypes.UPDATE_LAST_FETCH:
      return {
        ...state,
        lastDataFetch: Date.now(),
        cacheInvalidated: false,
      };

    case actionTypes.INVALIDATE_CACHE:
      return {
        ...state,
        cacheInvalidated: true,
      };

    case actionTypes.RESET_STATE:
      return {
        ...initialState,
        preferences: state.preferences, // Keep user preferences
      };

    default:
      logger.warn('Unknown action type dispatched', { type: action.type });
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem(
        'housing_dashboard_preferences'
      );
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        dispatch({
          type: actionTypes.SET_PREFERENCES,
          payload: preferences,
        });
        logger.info('Loaded user preferences from localStorage');
      }
    } catch (error) {
      logger.error('Failed to load preferences from localStorage', error);
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(
        'housing_dashboard_preferences',
        JSON.stringify(state.preferences)
      );
      logger.debug('Saved user preferences to localStorage');
    } catch (error) {
      logger.error('Failed to save preferences to localStorage', error);
    }
  }, [state.preferences]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!state.preferences.autoRefresh) return;

    const interval = setInterval(() => {
      dispatch({ type: actionTypes.INVALIDATE_CACHE });
      logger.info('Auto-refresh triggered - cache invalidated');
    }, state.preferences.refreshInterval);

    return () => clearInterval(interval);
  }, [state.preferences.autoRefresh, state.preferences.refreshInterval]);

  // Action creators
  const actions = {
    // UI Actions
    setSelectedRegion: region => {
      dispatch({ type: actionTypes.SET_SELECTED_REGION, payload: region });
      logger.userAction('Region Changed', { region });
    },

    setSelectedHousingType: type => {
      dispatch({ type: actionTypes.SET_SELECTED_HOUSING_TYPE, payload: type });
      logger.userAction('Housing Type Changed', { type });
    },

    setActiveView: view => {
      dispatch({ type: actionTypes.SET_ACTIVE_VIEW, payload: view });
      logger.userAction('View Changed', { view });
    },

    setLoading: loading => {
      dispatch({ type: actionTypes.SET_LOADING, payload: loading });
    },

    // Data Actions
    setRegions: regions => {
      dispatch({ type: actionTypes.SET_REGIONS, payload: regions });
    },

    setHousingTypes: types => {
      dispatch({ type: actionTypes.SET_HOUSING_TYPES, payload: types });
    },

    // Preference Actions
    setPreference: (key, value) => {
      dispatch({
        type: actionTypes.SET_PREFERENCE,
        payload: { key, value },
      });
      logger.userAction('Preference Changed', { key, value });
    },

    setPreferences: preferences => {
      dispatch({ type: actionTypes.SET_PREFERENCES, payload: preferences });
    },

    resetPreferences: () => {
      dispatch({ type: actionTypes.RESET_PREFERENCES });
      logger.userAction('Preferences Reset');
    },

    // Error Actions
    setError: (key, error) => {
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: { key, error },
      });
      logger.error(`Application error: ${key}`, error);
    },

    clearError: key => {
      dispatch({ type: actionTypes.CLEAR_ERROR, payload: key });
    },

    clearAllErrors: () => {
      dispatch({ type: actionTypes.CLEAR_ALL_ERRORS });
    },

    // Cache Actions
    updateLastFetch: () => {
      dispatch({ type: actionTypes.UPDATE_LAST_FETCH });
    },

    invalidateCache: () => {
      dispatch({ type: actionTypes.INVALIDATE_CACHE });
      logger.info('Cache manually invalidated');
    },

    // Reset Actions
    resetState: () => {
      dispatch({ type: actionTypes.RESET_STATE });
      logger.userAction('Application State Reset');
    },
  };

  // Computed values
  const computed = {
    hasErrors: Object.keys(state.errors).length > 0,
    errorCount: Object.keys(state.errors).length,
    isDataStale: state.lastDataFetch
      ? Date.now() - state.lastDataFetch > state.preferences.refreshInterval * 2
      : true,
    currentRegionData: state.regions.find(r => r.name === state.selectedRegion),
    currentHousingTypeData: state.housingTypes.find(
      t => t.name === state.selectedHousingType
    ),
  };

  const value = {
    state,
    actions,
    computed,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Selectors for specific parts of state
export const useAppState = () => {
  const { state } = useAppContext();
  return state;
};

export const useAppActions = () => {
  const { actions } = useAppContext();
  return actions;
};

export const useAppComputed = () => {
  const { computed } = useAppContext();
  return computed;
};

// Selector hooks for specific state slices
export const useSelectedRegion = () => {
  const { state, actions } = useAppContext();
  return [state.selectedRegion, actions.setSelectedRegion];
};

export const useSelectedHousingType = () => {
  const { state, actions } = useAppContext();
  return [state.selectedHousingType, actions.setSelectedHousingType];
};

export const useActiveView = () => {
  const { state, actions } = useAppContext();
  return [state.activeView, actions.setActiveView];
};

export const usePreferences = () => {
  const { state, actions } = useAppContext();
  return [
    state.preferences,
    actions.setPreference,
    actions.setPreferences,
    actions.resetPreferences,
  ];
};

export const useErrors = () => {
  const { state, actions, computed } = useAppContext();
  return [
    state.errors,
    computed.hasErrors,
    actions.setError,
    actions.clearError,
    actions.clearAllErrors,
  ];
};

export default AppContext;
