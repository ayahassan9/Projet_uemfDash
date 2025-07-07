import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import axios from "axios";

// Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";

// Config
import { API_CONFIG } from "../config";

const SchemaChecker = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schemaInfo, setSchemaInfo] = useState(null);
  
  // Liste des fonctionnalités et leurs descriptions
  const featureDescriptions = {
    data_summary: "Résumé des données",
    gender_stats: "Statistiques par genre",
    nationality_stats: "Statistiques par nationalité",
    city_stats: "Statistiques par ville",
    bac_type_stats: "Statistiques par type de baccalauréat",
    school_specialty_stats: "Statistiques écoles et spécialités",
    scholarship_stats: "Statistiques sur les bourses",
    mark_correlations: "Corrélations des notes",
    graduation_prediction: "Prédiction de réussite académique",
    specialty_prediction: "Recommandation de spécialité",
    faculty_revenue: "Prévision des revenus par faculté",
    next_year_students: "Prévision du nombre d'étudiants",
    average_fee: "Prévision des frais de scolarité"
  };
  
  // Charger les informations de schéma
  useEffect(() => {
    const fetchSchemaInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/schema`);
        setSchemaInfo(response.data);
      } catch (err) {
        setError("Impossible de récupérer les informations de schéma. Le serveur backend prend-il en charge cette fonctionnalité?");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchemaInfo();
  }, []);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        <AlertTitle>Erreur</AlertTitle>
        {error}
      </Alert>
    );
  }
  
  const availableFeatures = schemaInfo?.available_features || [];
  const allFeatures = Object.keys(featureDescriptions);
  const missingFeatures = allFeatures.filter(f => !availableFeatures.includes(f));
  
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Compatibilité avec vos données ({schemaInfo?.schema?.row_count || "?"} étudiants)
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Afficher un avertissement si les données sont échantillonnées */}
      {schemaInfo?.schema?.is_sampled && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <AlertTitle>Données volumineuses</AlertTitle>
          Les statistiques sont calculées sur un échantillon de {schemaInfo.schema.analyzed_rows.toLocaleString()} lignes sur un total de {schemaInfo.schema.row_count.toLocaleString()} enregistrements.
        </Alert>
      )}
      
      {availableFeatures.length === 0 ? (
        <Alert severity="warning">
          <AlertTitle>Attention</AlertTitle>
          Aucune fonctionnalité n'a pu être activée avec la structure de données actuelle.
          Veuillez vérifier que votre fichier CSV contient les colonnes requises.
        </Alert>
      ) : (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>Information sur vos données</AlertTitle>
            L'interface est actuellement adaptée à vos données selon le fichier <strong>backend/data/students.csv</strong>
            {schemaInfo?.schema?.row_count > 10000 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                📊 Volume important détecté: {schemaInfo.schema.row_count.toLocaleString()} enregistrements
              </Typography>
            )}
            {missingFeatures.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Certaines fonctionnalités ne sont pas disponibles en raison de colonnes manquantes.
              </Typography>
            )}
          </Alert>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Fonctionnalités disponibles ({availableFeatures.length})
                  </Typography>
                  <List dense>
                    {availableFeatures.map(feature => (
                      <ListItem key={feature}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={featureDescriptions[feature] || feature} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            {missingFeatures.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Fonctionnalités non disponibles ({missingFeatures.length})
                    </Typography>
                    <List dense>
                      {missingFeatures.map(feature => (
                        <ListItem key={feature}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <ErrorIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={featureDescriptions[feature] || feature} 
                            secondary="Colonnes nécessaires manquantes"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </>
      )}
      
      {schemaInfo?.schema?.headers && (
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Structure de données détectée
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {schemaInfo.schema.headers.map(column => (
              <Chip 
                key={column}
                label={column}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default SchemaChecker;
