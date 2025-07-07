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

const StatNationality = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nationalityData, setNationalityData] = useState(null);
  const theme = useTheme();
  const colors = getChartColors(theme);
  
  useEffect(() => {
    const fetchNationalityStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NATIONALITY_STATS}`
        );
        console.log("Nationality API response:", response.data);
        setNationalityData(response.data);
      } catch (err) {
        console.error("Error fetching nationality statistics:", err);
        setError("Failed to fetch nationality distribution data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchNationalityStats();
  }, []);
  
  // Prepare chart data - use our utility function
  const chartData = nationalityData ? prepareChartData(nationalityData, colors) : [];
  console.log("Nationality chart data:", chartData);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Distribution par Nationalité
      </Typography>
      
      <SchemaChecker />
      
      {loading ? (
        <Box display="flex" justifyContent="center" pt={4} pb={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : nationalityData ? (
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
                      <strong>{nationalityData.distinct_nationalities || Object.keys(nationalityData.counts || {}).length}</strong> nationalités différentes parmi <strong>{nationalityData.total}</strong> étudiants
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Top nationalités:
                  </Typography>
                  
                  {Object.entries(nationalityData.top_nationalities || nationalityData.counts || {})
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([nationality, count], index) => (
                      <Box key={nationality} display="flex" justifyContent="space-between" mb={0.5}>
                        <Box display="flex" alignItems="center">
                          <Box 
                            width={12} 
                            height={12} 
                            bgcolor={colors[index % colors.length]} 
                            mr={1} 
                            borderRadius="50%" 
                          />
                          <Typography>{nationality}</Typography>
                        </Box>
                        <Typography fontWeight="bold">
                          {count} ({nationalityData.percentages?.[nationality] || Math.round((count / nationalityData.total) * 100)}%)
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
                    Répartition par Nationalité
                  </Typography>
                  <Box height={300} mt={2}>
                    <PieChart 
                      data={chartData}
                      innerRadius={0.6}
                      padAngle={0.5}
                      cornerRadius={4}
                      arcLabel={d => `${d.value} (${Math.round((d.value / nationalityData.total) * 100)}%)`}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider' 
                }}
              >
                <Typography variant="h6" gutterBottom>International Diversity Analysis</Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" fontWeight="bold">Geographic Distribution</Typography>
                    <Typography variant="body2" paragraph>
                      {nationalityData && Object.keys(nationalityData.counts).length > 10 ? 
                        `With students from ${Object.keys(nationalityData.counts).length} different countries, the university demonstrates strong international appeal.` :
                        nationalityData && Object.keys(nationalityData.counts).length > 3 ?
                        `Students come from ${Object.keys(nationalityData.counts).length} different countries, showing moderate international diversity.` :
                        `Currently, the student body represents a limited number of nationalities (${Object.keys(nationalityData.counts).length}).`}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" fontWeight="bold">Major Groups</Typography>
                    <Typography variant="body2" paragraph>
                      {nationalityData && Object.keys(nationalityData.counts).length > 0 && 
                        `The majority of international students come from ${Object.keys(nationalityData.counts)[0]} 
                        (${nationalityData.percentages[Object.keys(nationalityData.counts)[0]]}%).`}
                      {nationalityData && Object.keys(nationalityData.counts).length > 1 && 
                        ` This is followed by ${Object.keys(nationalityData.counts)[1]} 
                        (${nationalityData.percentages[Object.keys(nationalityData.counts)[1]]}%).`}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" fontWeight="bold">Implications</Typography>
                    <Typography variant="body2">
                      International diversity enriches the educational experience through varied perspectives 
                      and cultural exchange. It also presents opportunities for global networking and future 
                      international collaboration.
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : (
        <Alert severity="warning">
          Aucune donnée disponible pour l'analyse de nationalité
        </Alert>
      )}
    </div>
  );
};

export default StatNationality;
