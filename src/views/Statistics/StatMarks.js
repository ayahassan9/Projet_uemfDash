import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Fade,
  Tab,
  Tabs
} from "@mui/material";
import axios from "axios";

// Icons
import RefreshIcon from "@mui/icons-material/Refresh";
import GradingIcon from "@mui/icons-material/Grading";
import WcIcon from "@mui/icons-material/Wc";
import SchoolIcon from "@mui/icons-material/School";
import PaidIcon from "@mui/icons-material/Paid";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

// Charts
import BarChart from "../../components/Charts/BarChart";
import LineChart from "../../components/Charts/LineChart";

import { API_CONFIG } from "../../config";

// API base URL
const API_BASE_URL = API_CONFIG.BASE_URL;

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const StatMarks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marksData, setMarksData] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.MARK_CORRELATIONS}`);
      setMarksData(response.data);
    } catch (err) {
      console.error("Error loading mark correlation data:", err);
      setError("Failed to load grade correlation data. Please ensure a CSV file has been uploaded.");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  // Prepare chart data for gender correlation
  const genderChartData = marksData && marksData.by_gender ? {
    labels: Object.keys(marksData.by_gender),
    datasets: [
      {
        label: "Average Mark by Gender",
        data: Object.values(marksData.by_gender),
        backgroundColor: ["#1976d2", "#9c27b0", "#ff9800"],
        borderWidth: 1,
      },
    ],
  } : null;

  // Prepare chart data for bac type correlation
  const bacTypeChartData = marksData && marksData.by_bac_type ? {
    labels: Object.keys(marksData.by_bac_type),
    datasets: [
      {
        label: "Average Mark by Bac Type",
        data: Object.values(marksData.by_bac_type),
        backgroundColor: "#4caf50",
        borderWidth: 1,
      },
    ],
  } : null;

  // Prepare chart data for scholarship correlation
  const scholarshipChartData = marksData && marksData.by_scholarship ? {
    labels: ['With Scholarship', 'Without Scholarship'],
    datasets: [
      {
        label: "Average Mark",
        data: [marksData.by_scholarship[true] || 0, marksData.by_scholarship[false] || 0],
        backgroundColor: ["#ff9800", "#f44336"],
        borderWidth: 1,
      },
    ],
  } : null;

  // Prepare chart data for specialty correlation
  const specialtyChartData = marksData && marksData.by_specialty ? {
    labels: Object.keys(marksData.by_specialty),
    datasets: [
      {
        label: "Average Mark by Specialty",
        data: Object.values(marksData.by_specialty),
        backgroundColor: "#03a9f4",
        borderWidth: 1,
      },
    ],
  } : null;

  // Prepare chart data for graduation correlation
  const graduationChartData = marksData && marksData.by_graduation ? {
    labels: ['Graduated', 'Not Graduated'],
    datasets: [
      {
        label: "Average Mark",
        data: [marksData.by_graduation.graduated, marksData.by_graduation.not_graduated],
        backgroundColor: ["#4caf50", "#f44336"],
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

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Mark Correlations Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Analysis of correlations between marks and other factors
            </Typography>
          </Box>
          <Tooltip title="Refresh Data">
            <IconButton onClick={loadData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Tabs 
          value={tabValue} 
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            mb: 3,
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontWeight: 'bold',
              py: 2
            }
          }}
        >
          <Tab icon={<WcIcon />} label="By Gender" iconPosition="start" />
          <Tab icon={<SchoolIcon />} label="By Bac Type" iconPosition="start" />
          <Tab icon={<PaidIcon />} label="By Scholarship" iconPosition="start" />
          <Tab icon={<AutoAwesomeIcon />} label="By Specialty" iconPosition="start" />
          <Tab icon={<EmojiEventsIcon />} label="By Graduation" iconPosition="start" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
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
                <Typography variant="h6" gutterBottom>Marks by Gender</Typography>
                <Divider sx={{ mb: 3 }} />
                
                {genderChartData ? (
                  <>
                    <BarChart 
                      data={genderChartData}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: 'Average Mark Distribution by Gender'
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: false,
                            title: {
                              display: true,
                              text: 'Average Mark'
                            }
                          }
                        }
                      }}
                      height={350}
                    />
                    
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="subtitle1" fontWeight="bold">Analysis</Typography>
                      <Typography variant="body2" paragraph>
                        {(() => {
                          const entries = Object.entries(marksData.by_gender);
                          const highest = entries.reduce((a, b) => a[1] > b[1] ? a : b);
                          const lowest = entries.reduce((a, b) => a[1] < b[1] ? a : b);
                          const diff = Math.abs(highest[1] - lowest[1]).toFixed(2);
                          
                          return (
                            <>
                              {highest[0]} students have the highest average mark at {highest[1]}, 
                              while {lowest[0]} students have an average mark of {lowest[1]}. 
                              The difference is {diff} points 
                              {diff > 2 
                                ? ", which represents a significant gap in academic performance between genders."
                                : ", suggesting a relatively small performance gap between genders."
                              }
                            </>
                          );
                        })()}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <Typography variant="body2" color="text.secondary">No gender correlation data available</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
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
                <Typography variant="h6" gutterBottom>Marks by Baccalaureate Type</Typography>
                <Divider sx={{ mb: 3 }} />
                
                {bacTypeChartData ? (
                  <>
                    <BarChart 
                      data={bacTypeChartData}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: 'Average Mark by Baccalaureate Type'
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: false,
                            title: {
                              display: true,
                              text: 'Average Mark'
                            }
                          }
                        }
                      }}
                      height={350}
                    />
                    
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="subtitle1" fontWeight="bold">Analysis</Typography>
                      <Typography variant="body2" paragraph>
                        {(() => {
                          const entries = Object.entries(marksData.by_bac_type);
                          const highest = entries.reduce((a, b) => a[1] > b[1] ? a : b);
                          const lowest = entries.reduce((a, b) => a[1] < b[1] ? a : b);
                          const diff = Math.abs(highest[1] - lowest[1]).toFixed(2);
                          
                          return (
                            <>
                              Students with {highest[0]} baccalaureate background have the highest average mark at {highest[1]}, 
                              while those with {lowest[0]} background have an average mark of {lowest[1]}. 
                              The difference is {diff} points, suggesting that prior academic preparation
                              {diff > 3 
                                ? " strongly influences university performance."
                                : " has some influence on university performance."
                              }
                            </>
                          );
                        })()}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <Typography variant="body2" color="text.secondary">No baccalaureate type correlation data available</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
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
                <Typography variant="h6" gutterBottom>Marks by Scholarship Status</Typography>
                <Divider sx={{ mb: 3 }} />
                
                {scholarshipChartData ? (
                  <>
                    <BarChart 
                      data={scholarshipChartData}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: 'Average Mark by Scholarship Status'
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: false,
                            title: {
                              display: true,
                              text: 'Average Mark'
                            }
                          }
                        }
                      }}
                      height={350}
                    />
                    
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="subtitle1" fontWeight="bold">Analysis</Typography>
                      <Typography variant="body2" paragraph>
                        Students with scholarships have an average mark of {marksData.by_scholarship[true]}, 
                        while those without scholarships have an average of {marksData.by_scholarship[false]}.
                        The difference is {Math.abs(marksData.by_scholarship[true] - marksData.by_scholarship[false]).toFixed(2)} points,
                        {marksData.by_scholarship[true] > marksData.by_scholarship[false] 
                          ? " indicating that scholarship recipients tend to perform better academically."
                          : " suggesting that scholarship status doesn't necessarily correlate with higher academic performance."
                        }
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <Typography variant="body2" color="text.secondary">No scholarship correlation data available</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
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
                <Typography variant="h6" gutterBottom>Marks by Specialty</Typography>
                <Divider sx={{ mb: 3 }} />
                
                {specialtyChartData ? (
                  <>
                    <BarChart 
                      data={specialtyChartData}
                      options={{
                        indexAxis: 'y',
                        plugins: {
                          title: {
                            display: true,
                            text: 'Average Mark by Specialty'
                          },
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          x: {
                            beginAtZero: false,
                            title: {
                              display: true,
                              text: 'Average Mark'
                            }
                          }
                        }
                      }}
                      height={400}
                      horizontal={true}
                    />
                    
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="subtitle1" fontWeight="bold">Analysis</Typography>
                      <Typography variant="body2" paragraph>
                        {(() => {
                          const entries = Object.entries(marksData.by_specialty);
                          const highest = entries.reduce((a, b) => a[1] > b[1] ? a : b);
                          const lowest = entries.reduce((a, b) => a[1] < b[1] ? a : b);
                          
                          return (
                            <>
                              The {highest[0]} specialty has the highest average mark at {highest[1]}, 
                              while {lowest[0]} has the lowest at {lowest[1]}. This variation could be due to:
                              <ul>
                                <li>Different grading standards across specialties</li>
                                <li>Varying levels of academic difficulty</li>
                                <li>Different student populations with varying academic backgrounds</li>
                              </ul>
                            </>
                          );
                        })()}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <Typography variant="body2" color="text.secondary">No specialty correlation data available</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
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
                <Typography variant="h6" gutterBottom>Marks by Graduation Status</Typography>
                <Divider sx={{ mb: 3 }} />
                
                {graduationChartData ? (
                  <>
                    <BarChart 
                      data={graduationChartData}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: 'Average Mark by Graduation Status'
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: false,
                            title: {
                              display: true,
                              text: 'Average Mark'
                            }
                          }
                        }
                      }}
                      height={350}
                    />
                    
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="subtitle1" fontWeight="bold">Analysis</Typography>
                      <Typography variant="body2" paragraph>
                        Students who graduated have an average mark of {marksData.by_graduation.graduated}, 
                        compared to {marksData.by_graduation.not_graduated} for those who didn't graduate.
                        The difference is {Math.abs(marksData.by_graduation.graduated - marksData.by_graduation.not_graduated).toFixed(2)} points,
                        {Math.abs(marksData.by_graduation.graduated - marksData.by_graduation.not_graduated) > 3 
                          ? " showing a strong correlation between high marks and graduation success."
                          : " suggesting some correlation between marks and graduation success."
                        }
                      </Typography>
                      
                      <Typography variant="body2">
                        This data can be used to identify at-risk students early based on their marks, and provide targeted academic support to improve graduation rates.
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <Typography variant="body2" color="text.secondary">No graduation status correlation data available</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Overall Insights */}
        <Box mt={4}>
          <Paper
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider' 
            }}
          >
            <Typography variant="h6" gutterBottom>Overall Mark Correlations Insights</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="bold">Key Performance Factors</Typography>
                <Typography variant="body2" paragraph>
                  Based on the data analysis, the factors most strongly correlated with student marks are:
                  <ol>
                    <li>Baccalaureate type: Prior academic background</li>
                    <li>Specialty choice: Different programs have varying mark profiles</li>
                    <li>Scholarship status: Often reflects academic ability</li>
                  </ol>
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="bold">Predictive Value</Typography>
                <Typography variant="body2" paragraph>
                  These correlations have predictive value for academic success. Students with higher marks tend to:
                  <ul>
                    <li>Graduate at higher rates</li>
                    <li>Qualify for scholarships more frequently</li>
                    <li>Perform more consistently across academic years</li>
                  </ul>
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="bold">Recommendations</Typography>
                <Typography variant="body2">
                  Based on these findings, the university could consider:
                  <ul>
                    <li>Targeted support systems for students from baccalaureate types with lower average marks</li>
                    <li>Additional academic resources for specialties with lower performance</li>
                    <li>Balanced scholarship distribution to encourage academic excellence</li>
                    <li>Early intervention for students showing mark patterns associated with non-graduation</li>
                  </ul>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Fade>
  );
};

export default StatMarks;
