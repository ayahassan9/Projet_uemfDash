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

const StatCity = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityData, setCityData] = useState(null);
  const theme = useTheme();
  const colors = getChartColors(theme);
  
  useEffect(() => {
    const fetchCityStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CITY_STATS}`
        );
        console.log("City API response:", response.data);
        setCityData(response.data);
      } catch (err) {
        console.error("Error fetching city statistics:", err);
        setError("Failed to fetch city distribution data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCityStats();
  }, []);
  
  // Prepare chart data using our utility
  const chartData = cityData ? prepareChartData(cityData, colors) : [];
  console.log("City chart data:", chartData);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Distribution par Ville
      </Typography>
      
      <SchemaChecker />
      
      {loading ? (
        <Box display="flex" justifyContent="center" pt={4} pb={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : cityData ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Résumé
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="body1">
                      <strong>{cityData.distinct_cities || Object.keys(cityData.counts || {}).length}</strong> villes différentes parmi <strong>{cityData.total}</strong> étudiants
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Top villes:
                  </Typography>
                  
                  {Object.entries(cityData.top_cities || cityData.counts || {})
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([city, count], index) => (
                      <Box key={city} display="flex" justifyContent="space-between" mb={0.5}>
                        <Box display="flex" alignItems="center">
                          <Box 
                            width={12} 
                            height={12} 
                            bgcolor={colors[index % colors.length]} 
                            mr={1} 
                            borderRadius="50%" 
                          />
                          <Typography>{city}</Typography>
                        </Box>
                        <Typography fontWeight="bold">
                          {count} ({cityData.percentages?.[city] || Math.round((count / cityData.total) * 100)}%)
                        </Typography>
                      </Box>
                    ))}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top 10 Villes
                  </Typography>
                  <Box height={300} mt={2}>
                    <PieChart 
                      data={chartData}
                      innerRadius={0.6}
                      padAngle={0.5}
                      cornerRadius={4}
                      arcLabel={d => `${d.value} (${Math.round((d.value / cityData.total) * 100)}%)`}
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
          Aucune donnée disponible pour l'analyse des villes
        </Alert>
      )}
    </div>
  );
};

export default StatCity;
