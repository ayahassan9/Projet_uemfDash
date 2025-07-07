import React, { useState, useEffect } from 'react';
import { Box, LinearProgress, Typography, useTheme } from '@mui/material';

/**
 * Animated skill progress bar with label and percentage
 * @param {Object} props
 * @param {string} props.skill - Name of the skill
 * @param {number} props.level - Skill level (0-100)
 * @param {boolean} props.animate - Whether to animate the progress bar
 * @param {string} props.color - Color of the progress bar (primary, secondary, success, etc.)
 * @param {Object} props.sx - Additional styles to apply
 */
const SkillProgressBar = ({ skill, level, animate = true, color = "primary", sx = {} }) => {
  const [progress, setProgress] = useState(animate ? 0 : level);
  const theme = useTheme();
  
  // Determine color from theme
  const progressColor = theme.palette[color]?.main || color;
  
  // Animate progress on mount
  useEffect(() => {
    if (!animate) return;
    
    const timer = setTimeout(() => {
      setProgress(level);
    }, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, [animate, level]);
  
  return (
    <Box sx={{ mb: 1.5, ...sx }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2">{skill}</Typography>
        <Typography variant="body2" fontWeight="bold">{level}%</Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 8, 
          borderRadius: 5,
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255,255,255,0.08)' 
            : 'rgba(0,0,0,0.08)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: progressColor,
            transition: animate ? 'transform 1.5s ease-out' : 'none'
          }
        }}
      />
    </Box>
  );
};

export default SkillProgressBar;
