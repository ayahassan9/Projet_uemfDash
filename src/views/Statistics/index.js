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
import WcIcon from "@mui/icons-material/Wc";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SchoolIcon from "@mui/icons-material/School";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PaidIcon from "@mui/icons-material/Paid";
import GradingIcon from "@mui/icons-material/Grading";

const statisticsModules = [
  {
    title: "Gender Distribution",
    description: "Analysis of student gender distribution",
    icon: <WcIcon fontSize="large" />,
    color: "#1976d2",
    path: "/statistics/gender"
  },
  {
    title: "Nationality",
    description: "Distribution of student nationalities",
    icon: <PublicIcon fontSize="large" />,
    color: "#9c27b0",
    path: "/statistics/nationality"
  },
  {
    title: "Cities",
    description: "Distribution of student cities of origin",
    icon: <LocationCityIcon fontSize="large" />,
    color: "#e91e63",
    path: "/statistics/city"
  },
  {
    title: "Baccalaureate Type",
    description: "Analysis by type of baccalaureate diploma",
    icon: <SchoolIcon fontSize="large" />,
    color: "#03a9f4",
    path: "/statistics/bac-type"
  },
  {
    title: "Schools & Specialties",
    description: "Analysis of schools and program specialties",
    icon: <ApartmentIcon fontSize="large" />,
    color: "#4caf50",
    path: "/statistics/school-specialty"
  },
  {
    title: "Scholarship Rate",
    description: "Analysis of scholarship distribution",
    icon: <PaidIcon fontSize="large" />,
    color: "#ff9800",
    path: "/statistics/scholarship"
  },
  {
    title: "Mark Correlations",
    description: "Correlation between marks and other factors",
    icon: <GradingIcon fontSize="large" />,
    color: "#795548",
    path: "/statistics/marks"
  }
];

const Statistics = () => {
  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Statistical Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Explore the various statistical analyses of student data
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={3}>
          {statisticsModules.map((module, index) => (
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
      </Box>
    </Fade>
  );
};

export default Statistics;
