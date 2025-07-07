import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * A simple pie chart implementation that doesn't rely on external libraries
 * 
 * @param {Object} props Component props
 * @param {Array} props.data Array of {id, label, value, color} objects
 */
const SimplePieChart = ({ data = [] }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
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
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate the segments for the pie chart
  let startAngle = 0;
  const segments = data.map(item => {
    const percentage = (item.value / total) * 100;
    const degrees = (percentage / 100) * 360;
    
    // Calculate the SVG arc parameters
    const endAngle = startAngle + degrees;
    
    // SVG arc path
    const x1 = 100 + 80 * Math.cos(Math.PI * startAngle / 180);
    const y1 = 100 + 80 * Math.sin(Math.PI * startAngle / 180);
    const x2 = 100 + 80 * Math.cos(Math.PI * endAngle / 180);
    const y2 = 100 + 80 * Math.sin(Math.PI * endAngle / 180);
    
    // Determine which arc to draw (large or small)
    const largeArcFlag = degrees > 180 ? 1 : 0;
    
    // Create the SVG path
    const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    
    const segment = {
      path,
      color: item.color || `hsl(${Math.round(startAngle)}, 70%, 50%)`,
      label: item.label,
      value: item.value,
      percentage
    };
    
    startAngle += degrees;
    return segment;
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
        
        {/* Inner circle for donut effect */}
        <circle cx="100" cy="100" r="50" fill="white" />
      </svg>
      
      {/* Legend */}
      <Box 
        position="absolute" 
        right="10%" 
        top="50%"
        sx={{ transform: 'translateY(-50%)' }}
      >
        {data.map((item, i) => (
          <Box key={i} display="flex" alignItems="center" mb={1}>
            <Box 
              width={12} 
              height={12} 
              mr={1} 
              sx={{ 
                backgroundColor: item.color || `hsl(${i * 360 / data.length}, 70%, 50%)`,
                borderRadius: '2px'
              }} 
            />
            <Typography variant="caption">
              {item.label}: {item.value} ({Math.round((item.value / total) * 100)}%)
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SimplePieChart;
