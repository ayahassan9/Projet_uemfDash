import React from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';

/**
 * Timeline component for displaying project milestones
 * @param {Object} props
 * @param {Array} props.milestones - Array of milestone objects with date, title, and description
 * @param {boolean} props.vertical - Whether to show timeline vertically (default) or horizontally
 * @param {string} props.title - Timeline title
 */
const ProjectTimeline = ({ milestones = [], vertical = true, title }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Force vertical layout on mobile
  const isVertical = isMobile || vertical;

  if (!milestones || milestones.length === 0) {
    return null;
  }
  
  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      
      <Paper
        elevation={0}
        variant="outlined"
        sx={{ 
          p: 2, 
          borderRadius: 2,
          overflow: isVertical ? 'visible' : 'auto'
        }}
      >
        {/* Vertical Timeline */}
        {isVertical ? (
          <Stepper orientation="vertical" nonLinear activeStep={-1}>
            {milestones.map((milestone, index) => (
              <Step key={index} completed={false} expanded>
                <StepLabel
                  optional={
                    <Typography variant="caption" color="text.secondary">
                      {milestone.date}
                    </Typography>
                  }
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {milestone.title}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box sx={{ ml: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {milestone.description}
                    </Typography>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        ) : (
          /* Horizontal Timeline */
          <Box>
            <Stepper nonLinear activeStep={-1} alternativeLabel>
              {milestones.map((milestone, index) => (
                <Step key={index} completed={false}>
                  <StepLabel>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {milestone.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {milestone.date}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ 
              display: 'flex',
              overflowX: 'auto',
              gap: 2,
              pb: 1
            }}>
              {milestones.map((milestone, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{ 
                    p: 1.5,
                    minWidth: 200,
                    flexShrink: 0
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {milestone.date}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {milestone.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {milestone.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ProjectTimeline;
