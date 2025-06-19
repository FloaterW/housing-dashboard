// Frontend logging utility
class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  // Log levels
  static LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
  };

  // Format log message with timestamp and context
  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;

    if (data) {
      return { message: formattedMessage, data };
    }
    return formattedMessage;
  }

  // Error logging - always log errors
  error(message, error = null, context = {}) {
    const logData = {
      message,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: this.isDevelopment ? error.stack : undefined,
          }
        : null,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Always log errors to console in development
    if (this.isDevelopment) {
      console.error(this.formatMessage('ERROR', message), logData);
    }

    // In production, send to error reporting service
    if (this.isProduction) {
      this.sendToErrorService(logData);
    }

    return logData;
  }

  // Warning logging
  warn(message, data = null) {
    const logData = { message, data, timestamp: new Date().toISOString() };

    if (this.isDevelopment) {
      console.warn(this.formatMessage('WARN', message), data);
    }

    return logData;
  }

  // Info logging - for important application events
  info(message, data = null) {
    const logData = { message, data, timestamp: new Date().toISOString() };

    if (this.isDevelopment) {
      console.info(this.formatMessage('INFO', message), data);
    }

    return logData;
  }

  // Debug logging - only in development
  debug(message, data = null) {
    if (!this.isDevelopment) return;

    const logData = { message, data, timestamp: new Date().toISOString() };
    console.debug(this.formatMessage('DEBUG', message), data);

    return logData;
  }

  // Performance logging
  time(label) {
    if (this.isDevelopment) {
      console.time(label);
    }
    return Date.now();
  }

  timeEnd(label, startTime = null) {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }

    if (startTime) {
      const duration = Date.now() - startTime;
      this.debug(`${label} completed`, { duration: `${duration}ms` });
      return duration;
    }
  }

  // API call logging
  apiCall(method, url, data = null) {
    this.debug(`API ${method.toUpperCase()}: ${url}`, data);
  }

  apiResponse(method, url, status, responseTime, data = null) {
    const message = `API ${method.toUpperCase()}: ${url} - ${status} (${responseTime}ms)`;

    if (status >= 400) {
      this.warn(message, data);
    } else {
      this.debug(message, data);
    }
  }

  // Component lifecycle logging
  componentMount(componentName) {
    this.debug(`Component mounted: ${componentName}`);
  }

  componentUnmount(componentName) {
    this.debug(`Component unmounted: ${componentName}`);
  }

  // User interaction logging
  userAction(action, details = null) {
    this.info(`User action: ${action}`, details);
  }

  // Data export logging
  dataExport(exportType, recordCount, format = 'csv') {
    this.info(`Data export: ${exportType}`, {
      recordCount,
      format,
      timestamp: new Date().toISOString(),
    });
  }

  // Scraping operation logging
  scrapingStart(location, parameters = {}) {
    this.info(`Scraping started: ${location}`, parameters);
  }

  scrapingSuccess(location, resultCount, duration = null) {
    this.info(`Scraping successful: ${location}`, {
      resultCount,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  scrapingError(location, error, parameters = {}) {
    this.error(`Scraping failed: ${location}`, error, parameters);
  }

  // Send errors to external service (implement based on your error reporting service)
  sendToErrorService(errorData) {
    // Example: Send to Sentry, LogRocket, or custom error reporting
    try {
      // if (window.Sentry) {
      //   window.Sentry.captureException(new Error(errorData.message), {
      //     extra: errorData
      //   });
      // }
      // Or send to custom endpoint
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData)
      // }).catch(() => {}); // Fail silently
    } catch (e) {
      // Fail silently to avoid error loops
    }
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;
