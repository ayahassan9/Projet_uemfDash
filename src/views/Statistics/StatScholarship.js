import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Alert, useTheme
} from '@mui/material';
import axios from 'axios';

// Components
import PieChart from '../../components/Charts/PieChart';
import SchemaChecker from '../../components/SchemaChecker';

// Utils
import { prepareChartData, getChartColors } from '../../utils/chartDataHelper';

// Config
import { API_CONFIG } from '../../config';

const StatScholarship = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scholarshipData, setScholarshipData] = useState(null);
  const theme = useTheme();
  const colors = getChartColors(theme);
  
  useEffect(() => {
    const fetchScholarshipStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCHOLARSHIP_STATS}`
        );
        console.log("Scholarship API response:", response.data);
        setScholarshipData(response.data);
      } catch (err) {
        console.error("Error fetching scholarship statistics:", err);
        setError("Failed to fetch scholarship distribution data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchScholarshipStats();
  }, []);
  
  // Prepare scholarship chart data with our utility
  const prepareScholarshipChartData = () => {
    if (!scholarshipData || !scholarshipData.counts) {
      return [];
    }
    
    return [
      {
        id: 'With Scholarship',
        label: 'Boursiers',
        value: scholarshipData.counts[true] || 0,
        color: theme.palette.primary.main
      },
      {
        id: 'Without Scholarship',
        label: 'Non-boursiers',
        value: scholarshipData.counts[false] || 0,
        color: theme.palette.secondary.main
      }
    ];
  };
  
  const scholarshipChartData = prepareScholarshipChartData();
  console.log("Scholarship chart data:", scholarshipChartData);
  
  // Prepare gender distribution chart data
  const prepareGenderChartData = () => {
    if (!scholarshipData || !scholarshipData.by_gender) {
      return [];
    }
    
    return Object.entries(scholarshipData.by_gender).map(([gender, percentage], index) => ({
      id: gender,
      label: gender,
      value: percentage,
      color: index === 0 ? theme.palette.success.main : theme.palette.info.main
    }));
  };
  
  const genderChartData = prepareGenderChartData();
  console.log("Gender scholarship chart data:", genderChartData);
  
  const totalStudents = scholarshipData ? 
    (scholarshipData.counts[true] || 0) + (scholarshipData.counts[false] || 0) : 0;
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Distribution des Bourses
      </Typography>
      
      <SchemaChecker />
      
      {loading ? (
        <Box display="flex" justifyContent="center" pt={4} pb={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : scholarshipData ? (
        <>
          <Grid container spacing={3}>
            {/* Main distribution chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Boursiers vs. Non-boursiers
                  </Typography>
                  <Box height={300} mt={2}>
                    <PieChart 
                      data={scholarshipChartData}
                      innerRadius={0.6}
                      padAngle={0.5}
                      cornerRadius={4}
                      arcLabel={d => `${d.value} (${Math.round((d.value / totalStudents) * 100)}%)`}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* ...existing code... */}
          </Grid>
        </>
      ) : (
        <Alert severity="warning">
          Aucune donnée disponible pour l'analyse des bourses
        </Alert>
      )}
    </div>
  );
};

export default StatScholarship;
