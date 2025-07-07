import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  LinearProgress,
  Tooltip,
  Icon,
  useTheme
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';

/**
 * DashboardStats - Affiche des indicateurs clés et des statistiques en temps réel
 */
const DashboardStats = ({ refreshInterval = 60000 }) => {
  const [stats, setStats] = useState({
    activeStudents: { value: 1245, change: 3.2 },
    graduationRate: { value: 92, change: 1.8 },
    employmentRate: { value: 86, change: 4.5 },
    ongoingProjects: { value: 78, change: -2.1 }
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const theme = useTheme();

  // Fonction pour récupérer les statistiques (simulée)
  const fetchStats = async () => {
    setLoading(true);
    
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Dans un vrai scénario, vous appelleriez votre API ici
    // const response = await fetch('/api/dashboard/stats');
    // const data = await response.json();
    
    // Générer de petites variations pour simuler des changements
    setStats(prevStats => ({
      activeStudents: { 
        value: Math.floor(prevStats.activeStudents.value * (1 + (Math.random() * 0.02 - 0.01))), 
        change: +(prevStats.activeStudents.change + (Math.random() * 1 - 0.5)).toFixed(1)
      },
      graduationRate: { 
        value: Math.min(100, Math.max(0, +(prevStats.graduationRate.value + (Math.random() * 1 - 0.5)).toFixed(1))), 
        change: +(prevStats.graduationRate.change + (Math.random() * 0.8 - 0.4)).toFixed(1)
      },
      employmentRate: { 
        value: Math.min(100, Math.max(0, +(prevStats.employmentRate.value + (Math.random() * 1 - 0.5)).toFixed(1))), 
        change: +(prevStats.employmentRate.change + (Math.random() * 0.8 - 0.4)).toFixed(1)
      },
      ongoingProjects: { 
        value: Math.floor(prevStats.ongoingProjects.value * (1 + (Math.random() * 0.04 - 0.02))), 
        change: +(prevStats.ongoingProjects.change + (Math.random() * 1.5 - 0.75)).toFixed(1)
      }
    }));
    
    setLastUpdated(new Date());
    setLoading(false);
  };

  // Effet pour charger les statistiques au chargement et à intervalles réguliers
  useEffect(() => {
    fetchStats();
    
    // Configurer l'intervalle de rafraîchissement
    const interval = setInterval(fetchStats, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Configuration des statistiques à afficher
  const statConfigs = [
    {
      key: 'activeStudents',
      title: 'Étudiants actifs',
      icon: <PersonIcon />,
      color: theme.palette.primary.main,
      format: value => value.toLocaleString()
    },
    {
      key: 'graduationRate',
      title: 'Taux de diplômés',
      icon: <SchoolIcon />,
      color: theme.palette.success.main,
      format: value => `${value}%`
    },
    {
      key: 'employmentRate',
      title: "Taux d'insertion",
      icon: <WorkIcon />,
      color: theme.palette.info.main,
      format: value => `${value}%`
    },
    {
      key: 'ongoingProjects',
      title: 'Projets en cours',
      icon: <AssignmentIcon />,
      color: theme.palette.warning.main,
      format: value => value.toLocaleString()
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Indicateurs clés</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {loading && (
            <CircularProgress size={16} sx={{ mr: 1 }} />
          )}
          <Typography variant="caption" color="text.secondary">
            Mis à jour: {lastUpdated.toLocaleTimeString()}
          </Typography>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {statConfigs.map(config => {
          const statData = stats[config.key];
          const isPositiveChange = statData.change >= 0;
          
          return (
            <Grid item xs={6} sm={6} md={3} key={config.key}>
              <Paper
                elevation={0}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 2
                  }
                }}
              >
                {/* Barre de couleur décorative */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    bgcolor: config.color
                  }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {config.title}
                  </Typography>
                  <Box sx={{ color: config.color }}>
                    {config.icon}
                  </Box>
                </Box>
                
                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                  {config.format(statData.value)}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: isPositiveChange ? 'success.main' : 'error.main' 
                }}>
                  {isPositiveChange ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                  <Typography 
                    variant="body2" 
                    fontWeight="medium"
                    sx={{ ml: 0.5 }}
                  >
                    {isPositiveChange ? '+' : ''}{statData.change}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    vs. mois précédent
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DashboardStats;
