import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

/**
 * A robust pie chart component that works with various data formats from the backend API
 * 
 * @param {Object} props Component properties
 * @param {Array|Object} props.data Chart data in various formats
 * @param {Number} props.innerRadius Inner radius for donut effect (0-1)
 * @param {Function} props.arcLabel Optional function to format arc labels
 */
const PieChart = ({ data, innerRadius = 0.6, arcLabel }) => {
  const theme = useTheme();
  
  // Default colors from theme
  const defaultColors = [
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
    theme.palette.warning.light,
    theme.palette.error.light,
  ];

  // Convert data to standard format
  const processData = (inputData) => {
    // Handle empty data
    if (!inputData) {
      console.error("PieChart received null or undefined data");
      return [];
    }

    // Already in array format with proper structure
    if (Array.isArray(inputData) && inputData.length > 0 && inputData[0].hasOwnProperty('value')) {
      return inputData;
    }
    
    // Convert array of items without value property
    if (Array.isArray(inputData) && inputData.length > 0) {
      return inputData.map((item, index) => ({
        id: item.id || `item-${index}`,
        label: item.label || (typeof item === 'object' ? Object.values(item)[0] : String(item)),
        value: item.value || 1,
        color: item.color || defaultColors[index % defaultColors.length]
      }));
    }
    
    // Convert object format (common in API responses)
    // Like {counts: {Male: 120, Female: 80}} or {Male: 120, Female: 80}
    if (typeof inputData === 'object' && !Array.isArray(inputData)) {
      // Handle {counts: {key: value}} format from statistics endpoints
      const countData = inputData.counts || inputData;
      if (!countData || typeof countData !== 'object') {
        console.error("PieChart received invalid object format:", inputData);
        return [];
      }
      
      return Object.entries(countData).map(([key, value], index) => ({
        id: key,
        label: key,
        value: Number(value) || 0,
        color: defaultColors[index % defaultColors.length]
      })).filter(item => item.value > 0);
    }
    
    console.error("PieChart received unrecognized data format:", inputData);
    return [];
  };
  
  // Process the data into standardized format
  const chartData = processData(data);
  
  // Display error if no valid data
  if (chartData.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100%"
        width="100%"
      >
        <Typography variant="body2" color="textSecondary">
          No data available for chart
        </Typography>
      </Box>
    );
  }

  // Calculate total for percentages
  const total = chartData.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  
  if (total <= 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100%"
        width="100%"
      >
        <Typography variant="body2" color="textSecondary">
          No data values for chart
        </Typography>
      </Box>
    );
  }
  
  // Calculate the segments for the pie chart
  let startAngle = 0;
  const segments = chartData.map((item, index) => {
    const value = Number(item.value) || 0;
    const percentage = (value / total) * 100;
    const degrees = (percentage / 100) * 360;
    
    // Calculate the SVG arc parameters
    const segmentStartAngle = startAngle;
    const segmentEndAngle = startAngle + degrees;
    
    // SVG arc path calculation
    const outerRadius = 80;
    const innerR = innerRadius * outerRadius;
    
    // Outer arc points
    const x1 = 100 + outerRadius * Math.cos(Math.PI * segmentStartAngle / 180);
    const y1 = 100 + outerRadius * Math.sin(Math.PI * segmentStartAngle / 180);
    const x2 = 100 + outerRadius * Math.cos(Math.PI * segmentEndAngle / 180);
    const y2 = 100 + outerRadius * Math.sin(Math.PI * segmentEndAngle / 180);
    
    // Inner arc points (for donut chart)
    const ix1 = 100 + innerR * Math.cos(Math.PI * segmentStartAngle / 180);
    const iy1 = 100 + innerR * Math.sin(Math.PI * segmentStartAngle / 180);
    const ix2 = 100 + innerR * Math.cos(Math.PI * segmentEndAngle / 180);
    const iy2 = 100 + innerR * Math.sin(Math.PI * segmentEndAngle / 180);
    
    // Determine which arc to draw (large or small)
    const largeArcFlag = degrees > 180 ? 1 : 0;
    
    // Create the SVG path
    let path;
    if (innerRadius > 0) {
      // Donut segment
      path = `
        M ${x1} ${y1}
        A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        L ${ix2} ${iy2}
        A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${ix1} ${iy1}
        Z
      `;
    } else {
      // Regular pie segment
      path = `M 100 100 L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    }
    
    // Store segment info
    const segment = {
      path,
      color: item.color || defaultColors[index % defaultColors.length],
      label: item.label,
      value,
      percentage,
      midAngle: segmentStartAngle + degrees / 2
    };
    
    // Update start angle for next segment
    startAngle += degrees;
    return segment;
  });

  // Calculate label positions
  const labels = segments.map(segment => {
    const labelRadius = (80 + (innerRadius * 80)) / 2; // Position between inner and outer radius
    const labelX = 100 + labelRadius * Math.cos(Math.PI * segment.midAngle / 180);
    const labelY = 100 + labelRadius * Math.sin(Math.PI * segment.midAngle / 180);
    
    // Get label text using arc label formatter or default to percentage
    let labelText = '';
    if (arcLabel && typeof arcLabel === 'function') {
      labelText = arcLabel({
        id: segment.label,
        label: segment.label,
        value: segment.value
      });
    } else {
      labelText = `${Math.round(segment.percentage)}%`;
    }
    
    return {
      x: labelX,
      y: labelY,
      text: labelText
    };
  });

  return (
    <Box position="relative" width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        {/* Create pie segments */}
        {segments.map((segment, i) => (
          <path
            key={i}
            d={segment.path}
            fill={segment.color}
            stroke="#fff"
            strokeWidth="1"
          />
        ))}
        
        {/* Add labels */}
        {segments.map((segment, i) => {
          // Only show labels if segment is large enough
          if (segment.percentage < 5) return null;
          
          const label = labels[i];
          return (
            <text
              key={`label-${i}`}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize="8px"
              fontWeight="bold"
              style={{textShadow: "0px 0px 2px rgba(0,0,0,0.5)"}}
            >
              {label.text}
            </text>
          );
        })}
      </svg>
      
      {/* Legend */}
      <Box 
        position="absolute" 
        right="10px"
        top="50%"
        sx={{ 
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          maxHeight: '80%',
          overflow: 'auto'
        }}
      >
        {chartData.map((item, i) => (
          <Box key={i} display="flex" alignItems="center" mb={0.5}>
            <Box 
              width={10} 
              height={10} 
              mr={1} 
              sx={{ 
                backgroundColor: item.color || defaultColors[i % defaultColors.length],
                borderRadius: '2px'
              }} 
            />
            <Typography variant="caption" noWrap sx={{ maxWidth: 120 }}>
              {item.label}: {Math.round(segments[i].percentage)}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PieChart;
