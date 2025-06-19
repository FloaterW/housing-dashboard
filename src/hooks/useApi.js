import { useState, useEffect, useCallback, useRef } from 'react';
import apiService from '../services/api';
import logger from '../utils/logger';

// Custom hook for API data fetching with built-in caching and error handling
export const useApi = (endpoint, params = {}, options = {}) => {
  const {
    immediate = true,
    cache = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes default
    onSuccess,
    onError,
    retryCount = 3,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  // Generate cache key
  const getCacheKey = useCallback(() => {
    return `${endpoint}_${JSON.stringify(params)}`;
  }, [endpoint, params]);

  // Check if cached data is still valid
  const isCacheValid = useCallback(
    cacheKey => {
      if (!cache) return false;

      const cached = cacheRef.current.get(cacheKey);
      if (!cached) return false;

      const now = Date.now();
      return now - cached.timestamp < cacheTime;
    },
    [cache, cacheTime]
  );

  // Fetch data with retry logic
  const fetchData = useCallback(
    async (retryAttempt = 0) => {
      const cacheKey = getCacheKey();

      // Check cache first
      if (isCacheValid(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey);
        setData(cached.data);
        setLoading(false);
        setError(null);
        logger.debug('Using cached data', { endpoint, cacheKey });
        return cached.data;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const startTime = Date.now();
        const result = await apiService.get(endpoint, params, {
          signal: abortControllerRef.current.signal,
        });

        const duration = Date.now() - startTime;
        logger.debug('API fetch completed', { endpoint, duration, params });

        // Cache the result
        if (cache) {
          cacheRef.current.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });
        }

        setData(result);
        setLastFetch(Date.now());
        setLoading(false);

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        // Don't handle abort errors
        if (err.name === 'AbortError') {
          return;
        }

        logger.error('API fetch failed', err, {
          endpoint,
          params,
          retryAttempt,
          maxRetries: retryCount,
        });

        // Retry logic
        if (retryAttempt < retryCount) {
          logger.info(
            `Retrying API request (${retryAttempt + 1}/${retryCount})`,
            { endpoint }
          );

          retryTimeoutRef.current = setTimeout(
            () => {
              fetchData(retryAttempt + 1);
            },
            retryDelay * Math.pow(2, retryAttempt)
          ); // Exponential backoff

          return;
        }

        setError(err.message || 'Failed to fetch data');
        setLoading(false);

        if (onError) {
          onError(err);
        }
      }
    },
    [
      endpoint,
      params,
      cache,
      cacheTime,
      onSuccess,
      onError,
      retryCount,
      retryDelay,
      getCacheKey,
      isCacheValid,
    ]
  );

  // Refetch data manually
  const refetch = useCallback(() => {
    const cacheKey = getCacheKey();
    cacheRef.current.delete(cacheKey); // Clear cache
    return fetchData();
  }, [fetchData, getCacheKey]);

  // Clear cache for this endpoint
  const clearCache = useCallback(() => {
    const cacheKey = getCacheKey();
    cacheRef.current.delete(cacheKey);
  }, [getCacheKey]);

  // Effect to fetch data on mount or when dependencies change
  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fetchData, immediate]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
    lastFetch,
    isCacheValid: isCacheValid(getCacheKey()),
  };
};

// Hook for multiple API calls
export const useMultipleApi = (requests = [], options = {}) => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const { immediate = true } = options;

  const fetchAll = useCallback(async () => {
    if (!requests.length) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const promises = requests.map(async request => {
        try {
          const result = await apiService.get(request.endpoint, request.params);
          return { key: request.key, data: result, success: true };
        } catch (error) {
          logger.error(`Multi-API request failed for ${request.key}`, error);
          return { key: request.key, error: error.message, success: false };
        }
      });

      const responses = await Promise.all(promises);

      const newResults = {};
      const newErrors = {};

      responses.forEach(response => {
        if (response.success) {
          newResults[response.key] = response.data;
        } else {
          newErrors[response.key] = response.error;
        }
      });

      setResults(newResults);
      setErrors(newErrors);
    } catch (error) {
      logger.error('Multi-API batch request failed', error);
    } finally {
      setLoading(false);
    }
  }, [requests]);

  useEffect(() => {
    if (immediate) {
      fetchAll();
    }
  }, [fetchAll, immediate]);

  return {
    results,
    loading,
    errors,
    refetch: fetchAll,
    hasErrors: Object.keys(errors).length > 0,
  };
};

// Hook for paginated data
export const usePaginatedApi = (endpoint, initialParams = {}, options = {}) => {
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const { data, loading, error, refetch } = useApi(
    endpoint,
    { ...initialParams, page: currentPage },
    options
  );

  useEffect(() => {
    if (data) {
      setAllData(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    }
  }, [data]);

  const goToPage = useCallback(
    page => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    data: allData,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
    refetch,
  };
};

export default useApi;
