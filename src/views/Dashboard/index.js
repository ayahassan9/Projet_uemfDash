import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  Tooltip,
  Alert,
  Paper,
  Fade,
  Avatar
} from "@mui/material";
import axios from "axios";

// Icons
import RefreshIcon from "@mui/icons-material/Refresh";
import SchoolIcon from "@mui/icons-material/School";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import PeopleIcon from "@mui/icons-material/People";
import GradingIcon from "@mui/icons-material/Grading";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PublicIcon from "@mui/icons-material/Public";

// Charts
import PieChart from "../../components/Charts/PieChart";
import BarChart from "../../components/Charts/BarChart";
import LineChart from "../../components/Charts/LineChart";

// Importez le vérificateur de schéma
import SchemaChecker from "../../components/SchemaChecker";

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

// Modifier les appels API et les textes pour refléter que les données sont préchargées
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [summaryData, setSummaryData] = useState(null);

  // Fonction pour charger les données du résumé depuis l'API
  const loadSummaryData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/data/summary");
      if (!response.ok) throw new Error("Erreur lors de la récupération des données");
      
      const data = await response.json();
      setSummaryData(data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur de chargement des données:", err);
      setError("Impossible de charger les données. Veuillez vérifier que le serveur backend est en cours d'exécution.");
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadSummaryData();
  }, []);

  // Prepare chart data once stats are loaded
  const genderChartData = summaryData?.gender ? {
    labels: Object.keys(summaryData.gender.counts),
    values: Object.values(summaryData.gender.counts),
  } : null;

  const bacTypeChartData = summaryData?.bacType ? {
    labels: Object.keys(summaryData.bacType.counts).slice(0, 6),
    datasets: [
      {
        label: "Student Count",
        data: Object.values(summaryData.bacType.counts).slice(0, 6),
        backgroundColor: "#1976d2",
        borderWidth: 1,
      }
    ]
  } : null;

  const marksChartData = summaryData?.marks && summaryData.marks.by_bac_type ? {
    labels: Object.keys(summaryData.marks.by_bac_type),
    datasets: [
      {
        label: "Average Mark by Bac Type",
        data: Object.values(summaryData.marks.by_bac_type),
        borderColor: "#9c27b0",
        backgroundColor: "rgba(156, 39, 176, 0.3)",
        fill: true,
        tension: 0.3,
      }
    ]
  } : null;

  // Mettre à jour les messages et l'affichage pour refléter que les données sont préchargées
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
        <CircularProgress size={60} thickness={4} />
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
        {/* Ajouter le vérificateur de schéma en haut du dashboard */}
        <SchemaChecker />

        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" fontWeight="bold">
            Dashboard Overview
          </Typography>
          <Tooltip title="Refresh Data">
            <IconButton onClick={loadSummaryData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Students
                  </Typography>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PeopleIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" component="div" sx={{ my: 1, fontWeight: 'bold' }}>
                  {summaryData?.gender?.total || 0}
                </Typography>
                <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                  <Chip 
                    icon={<TrendingUpIcon />} 
                    label="Active" 
                    size="small" 
                    color="success" 
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" color="text.secondary">
                    Scholarship Rate
                  </Typography>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <GradingIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" component="div" sx={{ my: 1, fontWeight: 'bold' }}>
                  {summaryData?.scholarship?.percentage || 0}%
                </Typography>
                <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                  <Chip 
                    label="Scholarship Students" 
                    size="small" 
                    color="secondary" 
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" color="text.secondary">
                    Different Nationalities
                  </Typography>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <PublicIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" component="div" sx={{ my: 1, fontWeight: 'bold' }}>
                  {summaryData?.nationality ? Object.keys(summaryData.nationality.counts).length : 0}
                </Typography>
                <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                  <Chip 
                    label="International Diversity" 
                    size="small" 
                    color="info" 
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" color="text.secondary">
                    Bac Types
                  </Typography>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <SchoolIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" component="div" sx={{ my: 1, fontWeight: 'bold' }}>
                  {summaryData?.bacType ? Object.keys(summaryData.bacType.counts).length : 0}
                </Typography>
                <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                  <Chip 
                    label="Academic Backgrounds" 
                    size="small" 
                    color="warning" 
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Gender Distribution */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{ 
                p: 2, 
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider' 
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Gender Distribution
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {genderChartData ? (
                <PieChart data={genderChartData} />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <Typography variant="body2" color="text.secondary">No gender data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Baccalaureate Types */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{ 
                p: 2, 
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider' 
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Baccalaureate Types
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {bacTypeChartData ? (
                <BarChart data={bacTypeChartData} />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <Typography variant="body2" color="text.secondary">No baccalaureate type data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Mark Distribution */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ 
                p: 2, 
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider' 
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Average Marks by Baccalaureate Type
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {marksChartData ? (
                <LineChart data={marksChartData} height={400} />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <Typography variant="body2" color="text.secondary">No mark data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Dashboard;
