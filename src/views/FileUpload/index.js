import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Alert,
  Card,
  CardContent,
  Button,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { Link } from "react-router-dom";

// Icons
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import PieChartIcon from "@mui/icons-material/PieChart";

const FileUpload = () => {
  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Données préchargées
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Le système a déjà chargé les données des étudiants d'Euromed Fès
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <Alert severity="success" sx={{ mb: 4 }}>
          <Typography variant="body1">
            <strong>Les données sont déjà chargées et prêtes à être analysées!</strong><br/>
            Vous pouvez maintenant explorer les statistiques et prédictions sans avoir à télécharger de fichier.
          </Typography>
        </Alert>
        
        <Grid container spacing={3}>
          {/* Informations sur les données */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider' 
              }}
            >
              <Typography variant="h6" gutterBottom>
                Informations sur les données
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Données des étudiants de l'Université Euromed de Fès" 
                    secondary="Échantillon de 20 étudiants avec informations académiques complètes"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Informations personnelles et académiques" 
                    secondary="Genre, nationalité, ville, type de baccalauréat, notes, etc."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Parcours académique détaillé" 
                    secondary="Notes par semestre, statut de diplomation, bourse d'études"
                  />
                </ListItem>
              </List>
              
              <Box mt={2}>
                <Alert severity="info" icon={<InfoIcon />}>
                  Ces données sont utilisées pour les démonstrations de l'outil d'analyse et sont déjà préchargées.
                </Alert>
              </Box>
            </Paper>
          </Grid>
          
          {/* Navigation vers les fonctionnalités */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider' 
              }}
            >
              <Typography variant="h6" gutterBottom>
                Explorer les fonctionnalités
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card 
                    component={Link} 
                    to="/statistics/gender"
                    sx={{ 
                      p: 2, 
                      textDecoration: 'none',
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PieChartIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" color="primary">Statistiques</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Visualisez les répartitions par genre, nationalité, type de bac et plus
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card 
                    component={Link} 
                    to="/predictions"
                    sx={{ 
                      p: 2, 
                      textDecoration: 'none',
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TimelineIcon color="secondary" sx={{ mr: 1 }} />
                        <Typography variant="h6" color="secondary">Prédictions</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Explorez les prédictions sur la diplomation, spécialités et plus
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card 
                    component={Link} 
                    to="/"
                    sx={{ 
                      p: 2, 
                      textDecoration: 'none',
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <BarChartIcon color="success" sx={{ mr: 1 }} />
                        <Typography variant="h6" color="success.main">Dashboard</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Consultez le tableau de bord avec les indicateurs clés de performance
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default FileUpload;
