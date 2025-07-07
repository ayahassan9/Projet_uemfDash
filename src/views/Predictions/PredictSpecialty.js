import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Fade,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import axios from "axios";

// Icons
import RefreshIcon from "@mui/icons-material/Refresh";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import SendIcon from "@mui/icons-material/Send";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";

// Import API configuration
import { API_CONFIG } from "../../config";

// API base URL
const API_BASE_URL = API_CONFIG.BASE_URL;

const PredictSpecialty = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    Gender: "Male",
    Mark: 15,
    Baccalaureat_Type: "Scientific",
    Interests: "Technology"
  });

  // Mock data for dropdowns
  const bacTypes = ["Scientific", "Literary", "Technical", "Economic", "Foreign", "Other"];
  const genderOptions = ["Male", "Female"];
  const interestOptions = [
    "Technology", "Business", "Medicine", "Arts", 
    "Law", "Engineering", "Social Sciences", "Natural Sciences"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "Mark" ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/predictions/specialty`, formData);
      setPrediction(response.data);
    } catch (err) {
      console.error("Error making specialty prediction:", err);
      setError(
        err.response?.data?.error || 
        "Failed to generate prediction. Please ensure valid data has been uploaded and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Gender: "Male",
      Mark: 15,
      Baccalaureat_Type: "Scientific",
      Interests: "Technology"
    });
    setPrediction(null);
    setError(null);
  };

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Specialty Recommendation
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Get suggestions for the most suitable specialty based on student profile
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={4}>
          {/* Prediction Form */}
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
                Student Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Gender"
                      name="Gender"
                      value={formData.Gender}
                      onChange={handleInputChange}
                      variant="outlined"
                    >
                      {genderOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Baccalaureate Type"
                      name="Baccalaureat_Type"
                      value={formData.Baccalaureat_Type}
                      onChange={handleInputChange}
                      variant="outlined"
                    >
                      {bacTypes.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Baccalaureate Mark"
                      name="Mark"
                      type="number"
                      value={formData.Mark}
                      onChange={handleInputChange}
                      inputProps={{ min: 0, max: 20, step: 0.1 }}
                      variant="outlined"
                      helperText="Enter a value between 0 and 20"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Primary Interest Area"
                      name="Interests"
                      value={formData.Interests}
                      onChange={handleInputChange}
                      variant="outlined"
                    >
                      {interestOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<SendIcon />}
                        disabled={loading}
                        fullWidth
                      >
                        Get Recommendations
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outlined"
                        color="secondary"
                        size="large"
                        onClick={resetForm}
                        disabled={loading}
                      >
                        Reset
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              
              {loading && <LinearProgress sx={{ mt: 3 }} />}
              
              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}
            </Paper>
          </Grid>
          
          {/* Prediction Results */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Recommended Specialties
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {!prediction && !loading && !error && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flex: 1
                }}>
                  <AutoFixHighIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Enter student information and click "Get Recommendations" to see suggested specialties
                  </Typography>
                </Box>
              )}
              
              {prediction && prediction.recommendations && (
                <Fade in={true} timeout={1000}>
                  <Box>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                        Based on the student profile, we recommend:
                      </Typography>
                      
                      <List>
                        {prediction.recommendations.map((rec, index) => (
                          <ListItem
                            key={index}
                            sx={{ 
                              mb: 2, 
                              p: 2, 
                              bgcolor: index === 0 ? 'primary.light' : 'background.paper',
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}
                          >
                            <ListItemIcon>
                              {index === 0 ? 
                                <StarIcon fontSize="large" color="primary" /> : 
                                <SchoolIcon fontSize="large" color="action" />
                              }
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="h6">
                                    {rec.specialty}
                                  </Typography>
                                  {index === 0 && 
                                    <Chip size="small" color="primary" label="Best Match" />
                                  }
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Match confidence: {rec.probability}%
                                  </Typography>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={rec.probability} 
                                    color={index === 0 ? "success" : "primary"}
                                    sx={{ height: 6, borderRadius: 3 }}
                                  />
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      Key Factors Influencing Recommendation:
                    </Typography>
                    
                    {prediction.important_factors && Object.entries(prediction.important_factors).map(([factor, importance]) => (
                      <Box key={factor} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">{factor}</Typography>
                          <Typography variant="body2" fontWeight="bold">{importance}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={importance} 
                          color="info"
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    ))}
                    
                    <Box mt={3}>
                      <Typography variant="body2" color="text.secondary">
                        Recommendations are based on historical student data, academic performance patterns,
                        and career outcomes. Consider these suggestions alongside personal interests and career goals.
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default PredictSpecialty;
