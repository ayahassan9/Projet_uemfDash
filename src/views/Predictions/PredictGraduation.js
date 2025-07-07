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
} from "@mui/material";
import axios from "axios";

// Icons
import RefreshIcon from "@mui/icons-material/Refresh";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// Import API configuration
import { API_CONFIG } from "../../config";

// API base URL
const API_BASE_URL = API_CONFIG.BASE_URL;

const PredictGraduation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    Gender: "Male",
    Mark: 15,
    Baccalaureat_Type: "Scientific",
    Scholarship: false
  });

  // Mock data for dropdowns
  const bacTypes = ["Scientific", "Literary", "Technical", "Economic", "Foreign", "Other"];
  const genderOptions = ["Male", "Female"];
  const scholarshipOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "Mark" ? parseFloat(value) : value
    });
  };

  const handleScholarshipChange = (e) => {
    setFormData({
      ...formData,
      Scholarship: e.target.value === "true"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/predictions/graduation`, formData);
      setPrediction(response.data);
    } catch (err) {
      console.error("Error making graduation prediction:", err);
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
      Scholarship: false
    });
    setPrediction(null);
    setError(null);
  };

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Graduation Success Prediction
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Predict whether a student is likely to graduate based on their profile
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
                      label="Has Scholarship"
                      name="Scholarship"
                      value={formData.Scholarship.toString()}
                      onChange={handleScholarshipChange}
                      variant="outlined"
                    >
                      {scholarshipOptions.map((option) => (
                        <MenuItem key={option.value.toString()} value={option.value.toString()}>
                          {option.label}
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
                        Generate Prediction
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
                Prediction Results
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
                  <EmojiEventsIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Enter student information and click "Generate Prediction" to see graduation predictions
                  </Typography>
                </Box>
              )}
              
              {prediction && (
                <Fade in={true} timeout={1000}>
                  <Box>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Typography variant="h5" gutterBottom>
                        {prediction.prediction}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        {prediction.prediction === 'Likely to graduate' ? (
                          <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
                        ) : (
                          <CancelIcon color="error" sx={{ fontSize: 80 }} />
                        )}
                      </Box>
                      
                      <Typography variant="h6" color={prediction.probability > 70 ? "success.main" : 
                                                      prediction.probability > 40 ? "warning.main" : "error.main"}>
                        {prediction.probability}% chance of graduation
                      </Typography>
                      
                      <LinearProgress 
                        variant="determinate" 
                        value={prediction.probability} 
                        color={prediction.probability > 70 ? "success" : 
                               prediction.probability > 40 ? "warning" : "error"}
                        sx={{ height: 10, borderRadius: 5, mt: 2 }}
                      />
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      Key Factors Influencing Prediction:
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
                        This prediction is based on historical student data and machine learning algorithms.
                        The accuracy may vary, and the prediction should be used as one factor in academic planning.
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

export default PredictGraduation;
