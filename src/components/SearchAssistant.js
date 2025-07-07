import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Avatar,
  InputAdornment,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  CircularProgress,
  Tooltip,
  Fade,
  ListItemAvatar // Add this import
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

/**
 * Composant d'assistant de recherche qui comprend le langage naturel
 * @param {Object} props
 * @param {Function} props.onSearch - Callback appelé lorsqu'une recherche est effectuée
 * @param {Function} props.onGenerateChart - Callback appelé pour générer un graphique
 */
const SearchAssistant = ({ onSearch, onGenerateChart }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastResults, setLastResults] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [expandedSuggestion, setExpandedSuggestion] = useState(null);
  const searchBoxRef = useRef(null);

  // Fermer les suggestions en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Exemples de suggestions pour l'utilisateur
  const searchSuggestions = [
    {
      title: "Taux de réussite",
      examples: [
        "Afficher le taux de réussite par filière",
        "Comparer le taux de réussite entre les semestres"
      ],
      explanation: "Recherchez des informations sur les taux de réussite aux examens, filtrez par cours, promotion ou période."
    },
    {
      title: "Profils étudiants",
      examples: [
        "Montrer les étudiants en difficulté",
        "Trouver les étudiants avec plus de 3 absences"
      ],
      explanation: "Identifiez des groupes d'étudiants selon différents critères comme leurs performances ou leur assiduité."
    },
    {
      title: "Tendances",
      examples: [
        "Évolution des inscriptions depuis 2020",
        "Tendance des notes en mathématiques"
      ],
      explanation: "Analysez l'évolution de différentes métriques au fil du temps pour identifier des tendances."
    },
    {
      title: "Prédictions",
      examples: [
        "Prédire le taux d'abandon dans la filière informatique",
        "Estimer les inscriptions pour l'année prochaine"
      ],
      explanation: "Utilisez des modèles prédictifs pour anticiper les tendances futures basées sur les données historiques."
    }
  ];

  // Simulation d'analyse de la requête en langage naturel
  const processNaturalLanguageQuery = async (userQuery) => {
    setLoading(true);
    
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Dans un environnement réel, ceci serait remplacé par un appel à une API NLP
    const queryLower = userQuery.toLowerCase();
    
    // Analyse simplifiée basée sur des mots-clés
    let filters = {};
    let metric = null;
    let timeframe = null;
    let chartType = null;
    
    // Détecter les métriques potentielles
    if (queryLower.includes('taux de réussite') || queryLower.includes('réussite')) {
      metric = 'successRate';
    } else if (queryLower.includes('inscription')) {
      metric = 'enrollments';
    } else if (queryLower.includes('note') || queryLower.includes('examen')) {
      metric = 'grades';
    } else if (queryLower.includes('absence') || queryLower.includes('assiduité')) {
      metric = 'attendance';
    } else if (queryLower.includes('abandon')) {
      metric = 'dropout';
    }
    
    // Détecter les filtres potentiels
    if (queryLower.includes('informatique')) {
      filters.department = 'Informatique';
    } else if (queryLower.includes('mathématique')) {
      filters.subject = 'Mathématiques';
    }
    
    // Détecter la période
    if (queryLower.includes('2020')) {
      timeframe = { from: '2020-01-01', to: '2020-12-31' };
    } else if (queryLower.includes('année dernière')) {
      const lastYear = new Date().getFullYear() - 1;
      timeframe = { from: `${lastYear}-01-01`, to: `${lastYear}-12-31` };
    } else if (queryLower.includes('semestre')) {
      timeframe = { period: 'semester' };
    }
    
    // Déterminer le type de graphique approprié
    if (queryLower.includes('évolution') || queryLower.includes('tendance')) {
      chartType = 'line';
    } else if (queryLower.includes('comparer')) {
      chartType = 'bar';
    } else if (queryLower.includes('distribution')) {
      chartType = 'pie';
    } else if (metric) {
      // Type de graphique par défaut selon la métrique
      chartType = metric === 'successRate' || metric === 'grades' ? 'bar' : 'line';
    }
    
    // Construire l'objet de résultats
    const results = {
      query: userQuery,
      interpretation: {
        metric,
        filters,
        timeframe,
        chartType
      },
      timestamp: new Date()
    };
    
    // Ajouter à l'historique des recherches
    setSearchHistory(prev => [results, ...prev].slice(0, 10));
    setLastResults(results);
    setLoading(false);
    
    // Appeler le callback de recherche
    if (onSearch) {
      onSearch(results);
    }
    
    return results;
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setShowSuggestions(false);
    await processNaturalLanguageQuery(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleGenerateChart = () => {
    if (!lastResults) return;
    
    if (onGenerateChart) {
      onGenerateChart(lastResults);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setLastResults(null);
  };

  const handleHistoryClick = (historyItem) => {
    setQuery(historyItem.query);
    setLastResults(historyItem);
    setShowSuggestions(false);
  };

  return (
    <>
      <Box ref={searchBoxRef} sx={{ position: 'relative', width: '100%' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Recherchez en langage naturel (ex: 'Taux de réussite par filière')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SmartToyIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {query && (
                  <IconButton size="small" onClick={handleClearSearch} edge="end">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton 
                  color="primary" 
                  onClick={handleSearch}
                  disabled={!query.trim() || loading}
                  sx={{ ml: query ? 0 : 1 }}
                  edge="end"
                >
                  {loading ? <CircularProgress size={20} /> : <SearchIcon />}
                </IconButton>
                <IconButton 
                  onClick={() => setShowHelp(true)}
                  sx={{ ml: 0.5 }}
                >
                  <HelpOutlineIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: { pr: 1 }
          }}
        />

        {/* Suggestions et historique des recherches */}
        <Fade in={showSuggestions}>
          <Paper
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '100%',
              mt: 0.5,
              zIndex: 1000,
              maxHeight: 400,
              overflow: 'auto',
              boxShadow: 3,
              display: showSuggestions ? 'block' : 'none'
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <LightbulbIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                  Suggestions de recherche
                </Typography>
                <IconButton size="small" onClick={() => setShowSuggestions(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <List dense disablePadding>
                {searchSuggestions.map((suggestion, index) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      button
                      onClick={() => setExpandedSuggestion(expandedSuggestion === index ? null : index)}
                      sx={{ pl: 0 }}
                    >
                      <ListItemText 
                        primary={
                          <Typography variant="body2" fontWeight="medium" color="primary">
                            {suggestion.title}
                          </Typography>
                        }
                      />
                      {expandedSuggestion === index ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </ListItem>
                    
                    <Collapse in={expandedSuggestion === index} timeout="auto">
                      <Box sx={{ pl: 2, pb: 1 }}>
                        <Typography variant="caption" color="text.secondary" paragraph>
                          {suggestion.explanation}
                        </Typography>
                        
                        {suggestion.examples.map((example, exIdx) => (
                          <Chip
                            key={exIdx}
                            label={example}
                            size="small"
                            color="default"
                            variant="outlined"
                            onClick={() => handleSuggestionClick(example)}
                            sx={{ mr: 1, mb: 1, cursor: 'pointer' }}
                          />
                        ))}
                      </Box>
                    </Collapse>
                  </React.Fragment>
                ))}
              </List>

              {/* Historique des recherches */}
              {searchHistory.length > 0 && (
                <>
                  <Box sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center' }}>
                    <HistoryIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Historique des recherches
                    </Typography>
                  </Box>
                  
                  <List dense disablePadding>
                    {searchHistory.slice(0, 5).map((item, idx) => (
                      <ListItem 
                        key={idx}
                        button 
                        onClick={() => handleHistoryClick(item)}
                        sx={{ pl: 0 }}
                      >
                        <ListItemText 
                          primary={item.query} 
                          secondary={item.timestamp.toLocaleString()}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Box>
          </Paper>
        </Fade>
      </Box>

      {/* Résultats de la dernière recherche */}
      {lastResults && (
        <Fade in={Boolean(lastResults)}>
          <Paper sx={{ mt: 2, p: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Interprétation de votre recherche
            </Typography>
            
            <Typography variant="body2" paragraph>
              <b>Requête :</b> "{lastResults.query}"
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {lastResults.interpretation.metric && (
                <Chip 
                  label={`Métrique: ${lastResults.interpretation.metric}`} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              )}
              
              {Object.entries(lastResults.interpretation.filters || {}).map(([key, value]) => (
                <Chip 
                  key={key}
                  label={`${key}: ${value}`} 
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              ))}
              
              {lastResults.interpretation.timeframe && (
                <Chip 
                  label={`Période: ${lastResults.interpretation.timeframe.period || 'personnalisée'}`}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              )}
              
              {lastResults.interpretation.chartType && (
                <Chip 
                  icon={<TrendingUpIcon />}
                  label={`Graphique: ${lastResults.interpretation.chartType}`}
                  size="small"
                  color="default"
                  variant="outlined"
                />
              )}
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleGenerateChart}
            >
              Générer le graphique
            </Button>
          </Paper>
        </Fade>
      )}

      {/* Dialogue d'aide */}
      <Dialog
        open={showHelp}
        onClose={() => setShowHelp(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Comment utiliser la recherche intelligente
          <IconButton
            aria-label="close"
            onClick={() => setShowHelp(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom>
            Posez vos questions en langage naturel
          </Typography>
          
          <Typography variant="body2" paragraph>
            Notre assistant de recherche comprend le français courant. Vous pouvez formuler des requêtes comme vous le feriez à un collègue.
          </Typography>
          
          <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Exemples de requêtes:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Montre-moi le taux de réussite en informatique sur les 3 dernières années"
                  secondary="Génère un graphique d'évolution sur la période spécifiée"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Quels sont les étudiants ayant plus de 5 absences ce semestre?"
                  secondary="Affiche la liste des étudiants filtrée selon ce critère"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Compare les notes moyennes entre les filières scientifiques"
                  secondary="Génère un graphique comparatif entre différentes filières"
                />
              </ListItem>
            </List>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            Fonctionnalités disponibles
          </Typography>
          
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <SearchIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary="Recherche intelligente"
                secondary="L'assistant analyse votre requête et extrait les éléments pertinents"
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <TrendingUpIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary="Génération de graphiques"
                secondary="Création automatique de visualisations adaptées à votre requête"
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <HistoryIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary="Historique des recherches"
                secondary="Retrouvez facilement vos recherches précédentes"
              />
            </ListItem>
          </List>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setShowHelp(false)} color="primary">
            J'ai compris
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SearchAssistant;
