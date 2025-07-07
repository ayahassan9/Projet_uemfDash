import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CardActionArea,
  Fade,
  Divider,
  Avatar
} from "@mui/material";

// Icons
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

const predictionsModules = [
  {
    title: "Graduation Success",
    description: "Predict if a student will graduate based on their profile",
    icon: <EmojiEventsIcon fontSize="large" />,
    color: "#1976d2",
    path: "/predictions/graduation"
  },
  {
    title: "Future Specialty",
    description: "Predict appropriate specialty based on student characteristics",
    icon: <AutoFixHighIcon fontSize="large" />,
    color: "#9c27b0",
    path: "/predictions/specialty"
  },
  {
    title: "Faculty Revenue",
    description: "Analyze and predict which faculty will generate the most revenue",
    icon: <AccountBalanceIcon fontSize="large" />,
    color: "#e91e63",
    path: "/predictions/revenue"
  },
  {
    title: "Future Students",
    description: "Predict student enrollment for next academic year",
    icon: <PeopleAltIcon fontSize="large" />,
    color: "#03a9f4",
    path: "/predictions/student-count"
  },
  {
    title: "Average Fee",
    description: "Predict average tuition fees for upcoming years",
    icon: <RequestQuoteIcon fontSize="large" />,
    color: "#4caf50",
    path: "/predictions/fee"
  }
];

const Predictions = () => {
  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Predictive Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Use AI and machine learning models to predict student and institutional outcomes
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={3}>
          {predictionsModules.map((module, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px -10px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <CardActionArea 
                  component={Link} 
                  to={module.path}
                  sx={{ height: '100%', p: 2 }}
                >
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: module.color,
                        width: 56,
                        height: 56
                      }}
                    >
                      {module.icon}
                    </Avatar>
                  </Box>
                  <Typography variant="h6" component="div" gutterBottom>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {module.description}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box mt={6} mb={2}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            About Our Prediction Models
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight="bold">Machine Learning Models</Typography>
              <Typography variant="body2" paragraph>
                Our predictions are powered by advanced machine learning algorithms including Random Forest, 
                Gradient Boosting, and Logistic Regression. These models analyze patterns in historical student 
                data to generate accurate predictions for future outcomes.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight="bold">Data Considerations</Typography>
              <Typography variant="body2" paragraph>
                Predictions are only as good as the data they're based on. Our models consider factors such 
                as academic performance, demographics, prior education, and institutional trends. All predictions 
                include confidence levels and should be used as decision support rather than absolute certainty.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight="bold">Applications</Typography>
              <Typography variant="body2">
                These predictive analytics can be used for:
                <ul>
                  <li>Academic advising and student support</li>
                  <li>Strategic planning and resource allocation</li>
                  <li>Financial projections and budgeting</li>
                  <li>Identifying at-risk students for early intervention</li>
                  <li>Optimizing program offerings based on student outcomes</li>
                </ul>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Fade>
  );
};

export default Predictions;
