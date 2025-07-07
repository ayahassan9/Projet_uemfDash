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

const StatBacType = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bacData, setBacData] = useState(null);
  const theme = useTheme();
  const colors = getChartColors(theme);
  
  useEffect(() => {
    const fetchBacStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BAC_TYPE_STATS}`
        );
        console.log("Bac type API response:", response.data);
        setBacData(response.data);
      } catch (err) {
        console.error("Error fetching bac type statistics:", err);
        setError("Failed to fetch baccalaureate type distribution data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBacStats();
  }, []);
  
  // Prepare chart data using our utility
  const chartData = bacData ? prepareChartData(bacData, colors) : [];
  console.log("Bac type chart data:", chartData);
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Distribution par Type de Baccalauréat
      </Typography>
      
      <SchemaChecker />
      
      {loading ? (
        <Box display="flex" justifyContent="center" pt={4} pb={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : bacData ? (
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
                      <strong>{Object.keys(bacData.counts || {}).length}</strong> types de baccalauréat parmi <strong>{bacData.total}</strong> étudiants
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {Object.entries(bacData.counts || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([bac, count], index) => (
                      <Box key={bac} display="flex" justifyContent="space-between" mb={0.5}>
                        <Box display="flex" alignItems="center">
                          <Box 
                            width={12} 
                            height={12} 
                            bgcolor={colors[index % colors.length]} 
                            mr={1} 
                            borderRadius="50%" 
                          />
                          <Typography>{bac}</Typography>
                        </Box>
                        <Box>
                          <Typography fontWeight="bold">
                            {count} ({bacData.percentages?.[bac] || Math.round((count / bacData.total) * 100)}%)
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Taux de réussite: {bacData.success_rate?.[bac] || 0}%
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribution par Type de Baccalauréat
                  </Typography>
                  <Box height={300} mt={2}>
                    <PieChart 
                      data={chartData}
                      innerRadius={0.6}
                      padAngle={0.5}
                      cornerRadius={4}
                      arcLabel={d => `${d.value} (${Math.round((d.value / bacData.total) * 100)}%)`}
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
          Aucune donnée disponible pour l'analyse des types de baccalauréat
        </Alert>
      )}
    </div>
  );
};

export default StatBacType;
