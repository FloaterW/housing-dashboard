// CSV Export Utility Functions

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        let value = row[header];
        // Handle values that might contain commas, quotes, or newlines
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportChartDataToCSV = (chartData, filename, metric = '') => {
  if (!chartData || chartData.length === 0) {
    console.warn('No chart data to export');
    return;
  }

  // Add metadata header if metric is provided
  let csvContent = '';
  if (metric) {
    csvContent += `# Housing Market Data Export - ${metric}\n`;
    csvContent += `# Generated on: ${new Date().toLocaleString()}\n`;
    csvContent += `# Total Records: ${chartData.length}\n\n`;
  }

  // Get headers from the first object
  const headers = Object.keys(chartData[0]);
  
  // Create CSV content
  csvContent += [
    // Header row
    headers.join(','),
    // Data rows
    ...chartData.map(row => 
      headers.map(header => {
        let value = row[header];
        // Handle values that might contain commas, quotes, or newlines
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportMarketHealthToCSV = (data, filename) => {
  const formattedData = data.map(item => ({
    'Region': item.region || item.municipality || 'N/A',
    'Health Score': item.health || item.healthScore || 'N/A',
    'Risk Score': item.risk || item.riskScore || 'N/A',
    'Market Temperature': item.marketTemp || item.temperature || 'N/A',
    'Average Price ($)': item.avgPrice || 'N/A',
    'Price Growth (%)': item.priceGrowth || 'N/A',
    'Affordability Rate (%)': item.affordabilityRate || 'N/A',
    'Inventory (months)': item.inventory || 'N/A'
  }));

  exportChartDataToCSV(formattedData, filename, 'Market Health Analysis');
};

export const exportHousingMapDataToCSV = (housingGeoData, selectedMetric) => {
  const formattedData = housingGeoData.map(item => ({
    'Municipality': item.municipality,
    'Longitude': item.geometry[0],
    'Latitude': item.geometry[1],
    'Average Price ($)': item.avgPrice,
    'Price Growth (%)': item.priceGrowth,
    'Affordability Rate (%)': item.affordabilityRate,
    'Risk Score': item.riskScore,
    'Market Temperature': item.marketTemp,
    'Inventory (months)': item.inventory
  }));

  exportChartDataToCSV(formattedData, 'housing_geographic_data', `Geographic Analysis - ${selectedMetric}`);
};