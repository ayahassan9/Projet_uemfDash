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
  CardContent
} from "@mui/material";
import axios from "axios";

// Icons
import RefreshIcon from "@mui/icons-material/Refresh";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";

// Charts
import LineChart from "../../components/Charts/LineChart";
import BarChart from "../../components/Charts/BarChart";

// Import API configuration
import { API_CONFIG } from "../../config";

// API base URL
const API_BASE_URL = API_CONFIG.BASE_URL;

const PredictStudentCount = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/predictions/next-year-students`);
      setStudentData(response.data);
    } catch (err) {
      console.error("Error getting student count prediction:", err);
      setError(
        err.response?.data?.error || 
        "Failed to fetch student count predictions. Please ensure valid data has been uploaded."
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Prepare historical chart data
  const enrollmentChartData = studentData ? {
    labels: Object.keys(studentData.historical_counts).map(year => `${year}`),
    datasets: [
      {
        label: "Yearly Enrollment",
        data: Object.values(studentData.historical_counts),
        borderColor: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#1976d2",
      },
    ],
  } : null;

  // Prepare school prediction chart
  const schoolChartData = studentData && studentData.by_school ? {
    labels: Object.keys(studentData.by_school),
    datasets: [
      {
        label: "Projected Students",
        data: Object.values(studentData.by_school),
        backgroundColor: [
          "#1976d2", "#9c27b0", "#e91e63", "#03a9f4", "#4caf50", 
          "#ff9800", "#8bc34a", "#3f51b5", "#f44336", "#009688"
        ],
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

  const growthRate = studentData ? 
    (((studentData.predicted_count - (studentData.historical_counts[studentData.current_year] || 0)) / 
    (studentData.historical_counts[studentData.current_year] || 1)) * 100).toFixed(1) : 0;

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Future Student Enrollment Forecast
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Predict student enrollment for the upcoming academic year
            </Typography>
          </Box>
          <Tooltip title="Refresh Data">
            <IconButton onClick={loadData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {studentData && (
            <>
              <Grid item xs={12} md={6} lg={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Current Year Enrollment ({studentData.current_year})
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ my: 1, fontWeight: 'bold' }}>
                      {studentData.historical_counts[studentData.current_year] || 0}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <PeopleAltIcon color="primary" sx={{ mr: 1, fontSize: 18 }} />
                      <Typography variant="body2" color="text.secondary">
                        Total students
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Projected Enrollment ({studentData.next_year})
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ my: 1, fontWeight: 'bold' }}>
                      {studentData.predicted_count}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <TrendingUpIcon color="success" sx={{ mr: 1, fontSize: 18 }} />
                      <Typography variant="body2" color={Number(growthRate) >= 0 ? "success.main" : "error.main"}>
                        {growthRate}% {Number(growthRate) >= 0 ? "increase" : "decrease"} from current year
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Top School for Next Year
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ my: 1, fontWeight: 'bold' }}>
                      {studentData.by_school && Object.keys(studentData.by_school)[0]}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <SchoolIcon color="secondary" sx={{ mr: 1, fontSize: 18 }} />
                      <Typography variant="body2" color="text.secondary">
                        {studentData.by_school && Object.values(studentData.by_school)[0]} projected students
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Data Timespan
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ my: 1, fontWeight: 'bold' }}>
                      {Object.keys(studentData.historical_counts).length} years
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Historical data range used for prediction
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>

        <Grid container spacing={4}>
          {/* Historical Enrollment Chart */}
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
                Historical and Projected Enrollment
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {enrollmentChartData ? (
                <Box sx={{ height: 400 }}>
                  <LineChart 
                    data={{
                      ...enrollmentChartData,
                      datasets: [
                        ...enrollmentChartData.datasets,
                        {
                          label: "Projected",
                          data: [...Array(enrollmentChartData.labels.length - 1).fill(null), 
                                 enrollmentChartData.datasets[0].data[enrollmentChartData.datasets[0].data.length - 1],
                                 studentData.predicted_count],
                          borderColor: "#4caf50",
                          backgroundColor: "rgba(76, 175, 80, 0.2)",
                          fill: true,
                          borderDash: [5, 5],
                          pointRadius: 5,
                          pointBackgroundColor: "#4caf50",
                        }
                      ]
                    }}
                    options={{
                      scales: {
                        y: {
                          title: {
                            display: true,
                            text: 'Number of Students'
                          }
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Academic Year'
                          }
                        }
                      }
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <Typography variant="body2" color="text.secondary">
                    No enrollment data available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* School Projection Chart */}
          <Grid item xs={12} md={6}>
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
                Projected Students by School ({studentData?.next_year})
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {schoolChartData ? (
                <Box sx={{ height: 400 }}>
                  <BarChart 
                    data={schoolChartData}
                    options={{
                      indexAxis: 'y',
                    }}
                    horizontal={true}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <Typography variant="body2" color="text.secondary">
                    No school projection data available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Analysis */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%'
              }}
            >
              <Typography variant="h6" gutterBottom>Enrollment Analysis</Typography>
              <Divider sx={{ mb: 3 }} />
              
              {studentData && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Key Insights</Typography>
                  <Typography variant="body2" paragraph>
                    For the academic year {studentData.next_year}, we project a total enrollment of 
                    <strong> {studentData.predicted_count} students</strong>, representing 
                    a {growthRate}% {Number(growthRate) >= 0 ? "increase" : "decrease"} from the current year.
                  </Typography>
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>School Distribution</Typography>
                  <Typography variant="body2" paragraph>
                    The {Object.keys(studentData.by_school)[0]} is expected to have the highest enrollment with 
                    {' '}{Object.values(studentData.by_school)[0]} students, followed by {Object.keys(studentData.by_school)[1]} with
                    {' '}{Object.values(studentData.by_school)[1]} students.
                  </Typography>
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Planning Recommendations</Typography>
                  <Typography variant="body2">
                    <ul>
                      <li>Prepare infrastructure and faculty resources for the projected {studentData.predicted_count} students</li>
                      <li>Focus capacity planning on high-growth schools, especially {Object.keys(studentData.by_school)[0]}</li>
                      <li>Consider admission targets and marketing strategies based on these projections</li>
                      <li>Review historical growth patterns to identify trends and opportunities</li>
                    </ul>
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default PredictStudentCount;
