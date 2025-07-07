import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider,
  Grid,
  Icon,
  Stack
} from '@mui/material';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import DataIcon from '@mui/icons-material/DataObject';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PeopleIcon from '@mui/icons-material/People';

/**
 * Composant affichant les informations sur les données du système
 */
const InfoDashboard = () => {
  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2, p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Informations sur les données
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Données des étudiants de l'Université Euromed de Fès
        </Typography>
        <Typography variant="body1">
          Échantillon de <strong>100000</strong> étudiants avec informations académiques complètes
        </Typography>
      </Box>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <PeopleIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  Informations personnelles et académiques
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Genre, nationalité, ville, type de baccalauréat, notes, etc.
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <SchoolIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  Parcours académique détaillé
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Notes par semestre, statut de diplomation, bourse d'études
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Ces données sont utilisées pour les démonstrations de l'outil d'analyse et sont déjà préchargées.
        </Typography>
      </Box>
    </Paper>
  );
};

export default InfoDashboard;
