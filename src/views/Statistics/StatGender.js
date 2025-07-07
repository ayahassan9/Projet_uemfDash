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

// Icons
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import GroupIcon from '@mui/icons-material/Group';

// Config
import { API_CONFIG } from '../../config';

const StatGender = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genderData, setGenderData] = useState(null);
  const theme = useTheme();
  
  // Colors for the charts
  const genderColors = {
    Male: theme.palette.primary.main,
    Female: theme.palette.secondary.main,
    Unknown: theme.palette.grey[500],
    Other: theme.palette.warning.main
  };
  
  useEffect(() => {
    const fetchGenderStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENDER_STATS}`
        );
        setGenderData(response.data);
      } catch (err) {
        console.error("Error fetching gender statistics:", err);
        setError("Failed to fetch gender distribution data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGenderStats();
  }, []);
  
  // Prepare chart data from API response - safely handle missing data
  const prepareChartData = () => {
    if (!genderData || !genderData.counts) return [];
    
    return Object.entries(genderData.counts).map(([gender, count]) => ({
      id: gender,
      label: gender,
      value: count,
      color: genderColors[gender] || theme.palette.grey[500]
    }));
  };
  
  // Calculate percentages for display - safely handle missing data
  const calculatePercentages = () => {
    if (!genderData) return {};
    
    if (!genderData.percentages) {
      // Calculate manually if percentages aren't provided by the API
      const total = genderData?.total || 0;
      if (total === 0 || !genderData?.counts) return {};
      
      return Object.entries(genderData.counts).reduce((acc, [gender, count]) => {
        acc[gender] = ((count / total) * 100).toFixed(1);
        return acc;
      }, {});
    }
    
    return genderData.percentages;
  };
  
  const chartData = prepareChartData();
  const percentages = calculatePercentages();
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Distribution par Genre
      </Typography>
      
      <SchemaChecker />
      
      {loading ? (
        <Box display="flex" justifyContent="center" pt={4} pb={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : genderData ? (
        <>
          <Grid container spacing={3}>
            {/* Summary Card */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Résumé
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <GroupIcon fontSize="large" sx={{ mr: 1 }} />
                    <Typography variant="h4">
                      {genderData.total}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ ml: 1 }}>
                      étudiants au total
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Box display="flex" alignItems="center">
                      <MaleIcon sx={{ color: genderColors.Male, mr: 1 }} />
                      <Typography>Hommes</Typography>
                    </Box>
                    <Box>
                      <Typography fontWeight="bold">
                        {genderData.counts?.Male || 0} ({percentages?.Male || 0}%)
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Box display="flex" alignItems="center">
                      <FemaleIcon sx={{ color: genderColors.Female, mr: 1 }} />
                      <Typography>Femmes</Typography>
                    </Box>
                    <Box>
                      <Typography fontWeight="bold">
                        {genderData.counts?.Female || 0} ({percentages?.Female || 0}%)
                      </Typography>
                    </Box>
                  </Box>
                  
                  {Object.entries(genderData.counts || {})
                    .filter(([gender]) => !['Male', 'Female'].includes(gender))
                    .map(([gender, count]) => (
                      <Box key={gender} display="flex" justifyContent="space-between" mb={1}>
                        <Typography>{gender}</Typography>
                        <Typography fontWeight="bold">
                          {count} ({percentages[gender] || 0}%)
                        </Typography>
                      </Box>
                    ))}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Pie Chart */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Répartition par Genre
                  </Typography>
                  <Box height={300} mt={2}>
                    {/* Only render chart when we have valid data */}
                    {chartData && chartData.length > 0 ? (
                      <PieChart 
                        data={chartData} 
                        innerRadius={0.6}
                        padAngle={0.5}
                        cornerRadius={4}
                        arcLabel={d => `${d.value} (${percentages[d.label] || 0}%)`}
                        legends={[
                          {
                            anchor: 'right',
                            direction: 'column',
                            justify: false,
                            translateX: 0,
                            translateY: 0,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemsSpacing: 10,
                            symbolSize: 15,
                            itemDirection: 'left-to-right'
                          }
                        ]}
                      />
                    ) : (
                      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography variant="body2" color="textSecondary">
                          Pas assez de données pour afficher un graphique
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Detailed Table */}
            <Grid item xs={12}>
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Genre</TableCell>
                        <TableCell align="right">Nombre</TableCell>
                        <TableCell align="right">Pourcentage</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(genderData.counts || {}).map(([gender, count]) => (
                        <TableRow key={gender}>
                          <TableCell>{gender}</TableCell>
                          <TableCell align="right">{count}</TableCell>
                          <TableCell align="right">{percentages[gender] || 0}%</TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ '& > *': { fontWeight: 'bold' }}}>
                        <TableCell>Total</TableCell>
                        <TableCell align="right">{genderData.total}</TableCell>
                        <TableCell align="right">100%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
          
          {genderData.total === 10 && (
            <Alert severity="info" sx={{ mt: 3 }}>
              L'analyse est basée sur un jeu de données limité (10 étudiants). 
              Pour des statistiques plus significatives, ajoutez davantage de données.
            </Alert>
          )}
        </>
      ) : (
        <Alert severity="warning">
          Aucune donnée disponible pour l'analyse de genre
        </Alert>
      )}
    </div>
  );
};

export default StatGender;
