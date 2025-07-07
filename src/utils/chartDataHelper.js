/**
 * Utility functions to convert API data to chart-compatible formats
 */

/**
 * Converts API statistics data to format required by PieChart component
 * Works with various API response formats from statistics endpoints
 * 
 * @param {Object|Array} apiData - Data from API (can be object with counts or array)
 * @param {Array} colors - Array of colors to use for the chart segments
 * @returns {Array} - Array of objects with id, label, value and color properties
 */
export const prepareChartData = (apiData, colors) => {
  // Handle null or undefined data
  if (!apiData) {
    console.warn("Chart data is null or undefined");
    return [];
  }
  
  // Debug the data we received
  console.log("Preparing chart data from:", apiData);
  
  // If it's already in the right format (array of objects with value property)
  if (Array.isArray(apiData) && apiData.length > 0 && apiData[0].hasOwnProperty('value')) {
    return apiData.map((item, index) => ({
      ...item,
      color: item.color || (colors ? colors[index % colors.length] : undefined)
    }));
  }
  
  // Handle object with 'counts' property (common in API responses)
  if (apiData.counts && typeof apiData.counts === 'object') {
    return Object.entries(apiData.counts)
      .filter(([_, value]) => value > 0)
      .map(([key, value], index) => ({
        id: key,
        label: key,
        value: Number(value),
        color: colors ? colors[index % colors.length] : undefined
      }));
  }
  
  // Handle plain object format (key-value pairs)
  if (typeof apiData === 'object' && !Array.isArray(apiData)) {
    return Object.entries(apiData)
      .filter(([key, value]) => key !== 'total' && Number(value) > 0)
      .map(([key, value], index) => ({
        id: key,
        label: key,
        value: Number(value),
        color: colors ? colors[index % colors.length] : undefined
      }));
  }
  
  console.warn("Unable to convert data to chart format", apiData);
  return [];
};

/**
 * Creates standardized colors for charts from theme
 * 
 * @param {Object} theme - Material-UI theme
 * @returns {Array} - Array of color strings
 */
export const getChartColors = (theme) => {
  return [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.info.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.primary.light,
    theme.palette.secondary.light,
    theme.palette.success.light,
    theme.palette.info.light,
  ];
};
