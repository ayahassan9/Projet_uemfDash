import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
  Fade,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import axios from "axios";

// Icons
import RefreshIcon from "@mui/icons-material/Refresh";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PaidIcon from "@mui/icons-material/Paid";

// Charts
import BarChart from "../../components/Charts/BarChart";

// Import API configuration
import { API_CONFIG } from "../../config";

// API base URL
const API_BASE_URL = API_CONFIG.BASE_URL;

const PredictRevenue = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/predictions/faculty-revenue`);
      setRevenueData(response.data);
    } catch (err) {
      console.error("Error getting faculty revenue prediction:", err);
      setError(
        err.response?.data?.error || 
        "Failed to fetch revenue predictions. Please ensure valid data has been uploaded."
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Prepare chart data
  const revenueChartData = revenueData ? {
    labels: Object.keys(revenueData.faculty_revenues),
    datasets: [
      {
        label: "Projected Revenue (MAD)",
        data: Object.values(revenueData.faculty_revenues),
        backgroundColor: "#4caf50",
        borderWidth: 1,
      },
    ],
  } : null;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 3 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Faculty Revenue Forecast
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Projected revenue by faculty based on student enrollment and fees
            </Typography>
          </Box>
          <Tooltip title="Refresh Data">
            <IconButton onClick={loadData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {revenueData && revenueData.highest_revenue && (
            <>
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Highest Revenue Faculty
                      </Typography>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <AccountBalanceIcon />
                      </Avatar>
                    </Box>
                    <Typography variant="h5" component="div" fontWeight="bold" mb={1}>
                      {revenueData.highest_revenue.faculty}
                    </Typography>
                    <Typography variant="h4" component="div" color="success.main" fontWeight="bold">
                      {formatCurrency(revenueData.highest_revenue.amount)}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <TrendingUpIcon color="success" sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Projected annual revenue
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Student Count
                      </Typography>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <PeopleAltIcon />
                      </Avatar>
                    </Box>
                    <Typography variant="h5" component="div" fontWeight="bold" mb={1}>
                      {revenueData.highest_revenue.faculty}
                    </Typography>
                    <Typography variant="h4" component="div" color="primary.main" fontWeight="bold">
                      {revenueData.highest_revenue.student_count} students
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <TrendingUpIcon color="primary" sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Currently enrolled
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Average Fee
                      </Typography>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        <PaidIcon />
                      </Avatar>
                    </Box>
                    <Typography variant="h5" component="div" fontWeight="bold" mb={1}>
                      {revenueData.highest_revenue.faculty}
                    </Typography>
                    <Typography variant="h4" component="div" color="secondary.main" fontWeight="bold">
                      {formatCurrency(revenueData.highest_revenue.average_fee)}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        Per student annually
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>

        <Grid container spacing={4}>
          {/* Revenue Chart */}
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
              <Typography variant="h6" gutterBottom>
                Projected Revenue by Faculty
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {revenueChartData ? (
                <Box sx={{ height: 400 }}>
                  <BarChart 
                    data={revenueChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return formatCurrency(context.parsed.y);
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <Typography variant="body2" color="text.secondary">
                    No revenue data available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Analysis */}
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
              <Typography variant="h6" gutterBottom>Revenue Analysis</Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" fontWeight="bold">Key Insights</Typography>
                  <Typography variant="body2" paragraph>
                    {revenueData && (
                      <>
                        The {revenueData.highest_revenue.faculty} generates the highest revenue, 
                        contributing significantly to the university's financial stability. 
                        This is driven by a combination of {revenueData.highest_revenue.student_count} enrolled students
                        and competitive fee structure averaging {formatCurrency(revenueData.highest_revenue.average_fee)} per student.
                      </>
                    )}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" fontWeight="bold">Revenue Drivers</Typography>
                  <Typography variant="body2" paragraph>
                    The primary factors affecting faculty revenue include:
                    <ul>
                      <li>Student enrollment numbers</li>
                      <li>Fee structure for each program</li>
                      <li>Scholarship allocation</li>
                      <li>Program duration and retention rates</li>
                      <li>International vs. domestic student ratio</li>
                    </ul>
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" fontWeight="bold">Recommendations</Typography>
                  <Typography variant="body2">
                    Based on the revenue analysis:
                    <ul>
                      <li>Consider expanding high-revenue programs</li>
                      <li>Evaluate fee structures for underperforming faculties</li>
                      <li>Develop targeted marketing for faculties with growth potential</li>
                      <li>Optimize scholarship allocation to maximize revenue while maintaining diversity</li>
                    </ul>
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default PredictRevenue;
