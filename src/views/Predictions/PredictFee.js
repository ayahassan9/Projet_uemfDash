import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Fade,
  Card,
  CardContent,
  Avatar
} from "@mui/material";
import axios from "axios";

// Icons
import RefreshIcon from "@mui/icons-material/Refresh";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Charts
import LineChart from "../../components/Charts/LineChart";

// Import API configuration
import { API_CONFIG } from "../../config";

// API base URL
const API_BASE_URL = API_CONFIG.BASE_URL;

const PredictFee = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feeData, setFeeData] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/predictions/average-fee`);
      setFeeData(response.data);
    } catch (err) {
      console.error("Error getting fee prediction:", err);
      setError(
        err.response?.data?.error || 
        "Failed to fetch fee predictions. Please ensure valid data has been uploaded."
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
  const feeChartData = feeData ? {
    labels: [...Object.keys(feeData.historical_fees), feeData.next_year.toString()],
    datasets: [
      {
        label: "Average Tuition Fee (MAD)",
        data: [...Object.values(feeData.historical_fees), feeData.predicted_fee],
        borderColor: "#9c27b0",
        backgroundColor: "rgba(156, 39, 176, 0.2)",
        fill: true,
        tension: 0.4,
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

  const currentFee = feeData ? 
    Object.values(feeData.historical_fees)[Object.values(feeData.historical_fees).length - 1] : 0;

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Tuition Fee Forecast
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Predict average tuition fees for the upcoming academic year
            </Typography>
          </Box>
          <Tooltip title="Refresh Data">
            <IconButton onClick={loadData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {feeData && (
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
                    <Typography variant="subtitle2" color="text.secondary">
                      Current Average Fee ({Object.keys(feeData.historical_fees).pop()})
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ my: 1, fontWeight: 'bold' }}>
                      {formatCurrency(currentFee)}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <RequestQuoteIcon color="primary" sx={{ mr: 1, fontSize: 18 }} />
                      <Typography variant="body2" color="text.secondary">
                        Per student annually
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
                    <Typography variant="subtitle2" color="text.secondary">
                      Projected Fee ({feeData.next_year})
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ my: 1, fontWeight: 'bold', color: 'secondary.main' }}>
                      {formatCurrency(feeData.predicted_fee)}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <TrendingUpIcon color="secondary" sx={{ mr: 1, fontSize: 18 }} />
                      <Typography variant="body2" color="secondary.main">
                        {feeData.increase_percentage}% increase from current year
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
                    <Typography variant="subtitle2" color="text.secondary">
                      Prediction Confidence
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ my: 1, fontWeight: 'bold', color: 'info.main' }}>
                      {feeData.confidence || 85}%
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Based on historical data analysis
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>

        <Grid container spacing={4}>
          {/* Fee Chart */}
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
                Historical and Projected Fee Trends
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {feeChartData ? (
                <Box sx={{ height: 400 }}>
                  <LineChart 
                    data={feeChartData}
                    options={{
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
                    No fee trend data available
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
              <Typography variant="h6" gutterBottom>Fee Analysis</Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" fontWeight="bold">Key Insights</Typography>
                  <Typography variant="body2" paragraph>
                    {feeData && (
                      <>
                        The average tuition fee is projected to {feeData.increase_percentage > 0 ? "increase" : "decrease"} by 
                        {' '}{feeData.increase_percentage}% for the {feeData.next_year} academic year.
                        This {feeData.increase_percentage > 0 ? "increase" : "decrease"} is {Math.abs(feeData.increase_percentage) > 5 ? "significant" : "moderate"} 
                        and reflects changes in operational costs and market conditions.
                      </>
                    )}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" fontWeight="bold">Market Factors</Typography>
                  <Typography variant="body2" paragraph>
                    The tuition fee projections are influenced by:
                    <ul>
                      <li>Educational inflation rates</li>
                      <li>Competitive landscape in higher education</li>
                      <li>Institutional development plans</li>
                      <li>Economic conditions affecting student affordability</li>
                      <li>Cost of academic resources and infrastructure</li>
                    </ul>
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" fontWeight="bold">Recommendations</Typography>
                  <Typography variant="body2">
                    Based on the fee forecast:
                    <ul>
                      <li>Consider {feeData?.increase_percentage > 5 ? "phased implementation of fee increases" : "maintaining current fee structure"}</li>
                      <li>Enhance scholarship offerings to offset potential impact on enrollment</li>
                      <li>Communicate value proposition clearly to prospective students</li>
                      <li>Explore additional revenue streams to reduce dependency on tuition fees</li>
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

export default PredictFee;
