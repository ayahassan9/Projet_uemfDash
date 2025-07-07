import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Alert, useTheme, Tabs, Tab
} from '@mui/material';
import axios from 'axios';

// Components
import PieChart from '../../components/Charts/PieChart';
import SchemaChecker from '../../components/SchemaChecker';

// Utils
import { prepareChartData, getChartColors } from '../../utils/chartDataHelper';

// Config
import { API_CONFIG } from '../../config';

const StatSchoolSpecialty = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const theme = useTheme();
  const colors = getChartColors(theme);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCHOOL_SPECIALTY_STATS}`
        );
        console.log("School specialty API response:", response.data);
        setData(response.data);
        
        // Set the first school as selected by default
        if (response.data && response.data.schools) {
          const firstSchool = Object.keys(response.data.schools)[0];
          setSelectedSchool(firstSchool);
        }
      } catch (err) {
        console.error("Error fetching school specialty statistics:", err);
        setError("Failed to fetch school and specialty distribution data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Prepare school chart data with our utility
  const schoolChartData = data ? prepareChartData({ counts: data?.schools || {} }, colors) : [];
  console.log("School chart data:", schoolChartData);
  
  // Prepare specialty chart data for selected school
  const prepareSpecialtyChartData = () => {
    if (!data || !selectedSchool || !data.school_specialty_distribution || 
        !data.school_specialty_distribution[selectedSchool]) {
      return [];
    }
    
    // Convert the specialty distribution for the selected school into our standard format
    return prepareChartData(
      { counts: data.school_specialty_distribution[selectedSchool] }, 
      colors.map(c => theme.palette.augmentColor({ color: { main: c } }).light) // Use lighter colors
    );
  };
  
  const specialtyChartData = prepareSpecialtyChartData();
  console.log("Specialty chart data:", specialtyChartData);
  
  // Calculate total students across schools
  const calculateTotal = () => {
    if (!data || !data.schools) return 0;
    return Object.values(data.schools).reduce((sum, count) => sum + count, 0);
  };
  
  const total = calculateTotal();
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Distribution des Écoles et Spécialités
      </Typography>
      
      <SchemaChecker />
      
      {loading ? (
        <Box display="flex" justifyContent="center" pt={4} pb={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : data ? (
        <>
          <Grid container spacing={3}>
            {/* School Distribution Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribution par École
                  </Typography>
                  <Box height={300} mt={2}>
                    <PieChart 
                      data={schoolChartData}
                      innerRadius={0.6}
                      padAngle={0.5}
                      cornerRadius={4}
                      arcLabel={d => `${Math.round((d.value / total) * 100)}%`}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* School-specific Specialty Distribution */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribution des Spécialités
                    {selectedSchool && ` - ${selectedSchool}`}
                  </Typography>
                  
                  {/* School selection tabs */}
                  {data.schools && Object.keys(data.schools).length > 1 && (
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                      <Tabs 
                        value={selectedSchool || Object.keys(data.schools)[0]}
                        onChange={(e, newValue) => setSelectedSchool(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                      >
                        {Object.keys(data.schools).map((school) => (
                          <Tab key={school} label={school} value={school} />
                        ))}
                      </Tabs>
                    </Box>
                  )}
                  
                  <Box height={300} mt={2}>
                    <PieChart 
                      data={specialtyChartData}
                      innerRadius={0.6}
                      padAngle={0.5}
                      cornerRadius={4}
                      arcLabel={d => `${Math.round((d.value / data.schools[selectedSchool]) * 100)}%`}
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
          Aucune donnée disponible pour l'analyse des écoles et spécialités
        </Alert>
      )}
    </div>
  );
};

export default StatSchoolSpecialty;
