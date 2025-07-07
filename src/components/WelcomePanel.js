import React, { useState, useEffect } from "react";
import { 
  Paper, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Divider, 
  Chip, 
  Grid 
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonIcon from "@mui/icons-material/Person";
import TodayIcon from "@mui/icons-material/Today";
import SchoolIcon from "@mui/icons-material/School";

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  overflow: "hidden",
}));

const Circle = styled(Box)(({ theme, size, opacity, top, left, right, bottom }) => ({
  position: "absolute",
  width: size,
  height: size,
  borderRadius: "50%",
  backgroundColor: "white",
  opacity: opacity,
  top: top,
  left: left,
  right: right,
  bottom: bottom,
}));

const WelcomePanel = ({ onClose }) => {
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Set current time
    const now = new Date();
    setCurrentTime(now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    // Set greeting based on time of day
    const hour = now.getHours();
    if (hour < 12) {
      setGreeting("Bonjour");
    } else if (hour < 18) {
      setGreeting("Bon après-midi");
    } else {
      setGreeting("Bonsoir");
    }

    // Capitalize first letter
    setGreeting(greeting.charAt(0).toUpperCase() + greeting.slice(1));
  }, [greeting]);

  return (
    <StyledPaper elevation={4}>
      {/* Decorative circles in the background */}
      <Circle size="300px" opacity={0.1} top="-150px" left="-50px" />
      <Circle size="200px" opacity={0.1} bottom="-100px" right="-50px" />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Chip 
                  label="Tableau de bord analytique" 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {greeting}, Aya Hassan 👋
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                Bienvenue dans le tableau de bord analytique d'Euromed Fès. 
                Explorez les données et prédictions pour prendre les meilleures décisions.
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              <Chip 
                icon={<TodayIcon />} 
                label={currentTime} 
                size="small" 
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
              <Chip 
                icon={<PersonIcon />} 
                label="2 utilisateurs actifs" 
                size="small" 
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
              <Chip 
                icon={<SchoolIcon />} 
                label="10 écoles analysées" 
                size="small" 
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
              <Chip 
                icon={<TrendingUpIcon />} 
                label="Dernière mise à jour: aujourd'hui" 
                size="small" 
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: 'white', 
                  color: 'primary.main',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  },
                  mr: 2
                }}
              >
                Voir les rapports
              </Button>
              <Button 
                variant="outlined" 
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white',
                  } 
                }}
              >
                Importer des données
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
              justifyContent: 'center',
              alignItems: {xs: 'flex-start', md: 'flex-end'}
            }}>
              <Box sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.2)',
                maxWidth: '100%',
              }}>
                <Typography variant="subtitle2" fontWeight="bold">Stats rapides</Typography>
                <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.2)' }} />
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>53%</strong> de réussite
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>2,500+</strong> étudiants
                </Typography>
                <Typography variant="body2">
                  <strong>10</strong> nationalités
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Close button */}
      <IconButton 
        sx={{ 
          position: "absolute", 
          top: 8, 
          right: 8, 
          backgroundColor: 'rgba(255,255,255,0.2)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.3)',
          }
        }} 
        size="small" 
        onClick={onClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </StyledPaper>
  );
};

export default WelcomePanel;
