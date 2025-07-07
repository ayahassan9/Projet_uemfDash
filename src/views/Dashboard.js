import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  Tab,
  Tabs,
  Divider,
  useMediaQuery,
  useTheme,
  ButtonGroup,
  Button,
  Tooltip
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

// Icons
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import TranslateIcon from '@mui/icons-material/Translate';

// Components
import DashboardStats from '../components/DashboardStats';
import DataTable from '../components/DataTable';
import SearchAssistant from '../components/SearchAssistant';
import AcademicCalendar from '../components/AcademicCalendar';
import ExportDashboard from '../components/ExportDashboard';
import NotificationsPanel from '../components/NotificationsPanel';
import ThemeToggle from '../components/ThemeToggle';
import InfoDashboard from '../components/InfoDashboard'; // Import du nouveau composant

/**
 * Dashboard principal qui intègre les différents composants
 */
const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Déterminer l'onglet actif basé sur l'URL
  const getInitialTabFromUrl = () => {
    if (location.hash === '#calendar') return 1;
    if (location.hash === '#students') return 2;
    return 0;
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTabFromUrl());
  const [calendarLocale, setCalendarLocale] = useState('fr');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dashboardRef = useRef(null);

  // Mettre à jour l'URL lorsque l'onglet change
  useEffect(() => {
    const hashValues = ['', 'calendar', 'students'];
    navigate(`/dashboard${activeTab > 0 ? '#' + hashValues[activeTab] : ''}`, { replace: true });
  }, [activeTab, navigate]);

  // Gestion des événements du calendrier
  const handleEventCreate = (event) => {
    console.log('Event created:', event);
    // Ici vous pourriez appeler une API pour persister l'événement
  };

  const handleEventUpdate = (event) => {
    console.log('Event updated:', event);
    // Ici vous pourriez appeler une API pour mettre à jour l'événement
  };

  const handleEventDelete = (event) => {
    console.log('Event deleted:', event);
    // Ici vous pourriez appeler une API pour supprimer l'événement
  };

  // Aller directement à l'onglet du calendrier
  const goToCalendar = () => {
    setActiveTab(1);
  };

  // Données d'exemple pour le tableau
  const studentColumns = [
    { id: 'id', label: 'ID', width: 70 },
    { id: 'name', label: 'Nom' },
    { id: 'program', label: 'Filière' },
    { id: 'year', label: 'Année', width: 100 },
    { id: 'gpa', label: 'Moyenne', numeric: true, width: 100 },
    { id: 'status', label: 'Statut', width: 120, render: (value) => {
      const color = value === 'Actif' ? 'success' : value === 'En risque' ? 'warning' : 'error';
      return <Typography color={`${color}.main`}>{value}</Typography>;
    }}
  ];

  const studentData = [
    { id: '001', name: 'Sofia Benali', program: 'Informatique', year: 2, gpa: 16.5, status: 'Actif' },
    { id: '002', name: 'Karim Idrissi', program: 'Big Data', year: 3, gpa: 12.3, status: 'En risque' },
    { id: '003', name: 'Nadia Toumi', program: 'IA', year: 2, gpa: 18.1, status: 'Actif' },
    { id: '004', name: 'Hassan Mesbahi', program: 'Réseaux', year: 1, gpa: 10.8, status: 'En risque' },
    { id: '005', name: 'Leila Chakir', program: 'Informatique', year: 3, gpa: 14.5, status: 'Actif' },
    { id: '006', name: 'Omar Fadil', program: 'Big Data', year: 2, gpa: 9.2, status: 'Inactif' },
    { id: '007', name: 'Yasmine Tazi', program: 'IA', year: 3, gpa: 17.4, status: 'Actif' },
    { id: '008', name: 'Mehdi Rafi', program: 'Réseaux', year: 2, gpa: 13.7, status: 'Actif' },
  ];

  // Rendu de l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Vue générale
        return (
          <Box>
            <InfoDashboard /> {/* Ajout du composant d'information */}
            <DashboardStats refreshInterval={60000} />
            
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Étudiants en situation de risque
              </Typography>
              <DataTable 
                columns={studentColumns} 
                data={studentData.filter(student => student.status !== 'Actif')}
                title="Étudiants à surveiller"
              />
            </Box>
          </Box>
        );
      
      case 1: // Calendrier académique
        return (
          <Box>
            <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Calendrier académique</Typography>
              <ButtonGroup variant="outlined" size="small">
                <Button 
                  variant={calendarLocale === 'fr' ? 'contained' : 'outlined'}
                  onClick={() => setCalendarLocale('fr')}
                >
                  Français
                </Button>
                <Button 
                  variant={calendarLocale === 'ar' ? 'contained' : 'outlined'}
                  onClick={() => setCalendarLocale('ar')}
                  startIcon={<TranslateIcon fontSize="small" />}
                >
                  العربية
                </Button>
              </ButtonGroup>
            </Box>
            <AcademicCalendar 
              locale={calendarLocale}
              readOnly={false}
              onEventCreate={handleEventCreate}
              onEventUpdate={handleEventUpdate}
              onEventDelete={handleEventDelete}
            />
          </Box>
        );
      
      case 2: // Liste complète
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Liste des étudiants
            </Typography>
            <DataTable 
              columns={studentColumns} 
              data={studentData}
              title="Tous les étudiants"
            />
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box ref={dashboardRef} sx={{ pb: 4 }}>
      {/* En-tête du tableau de bord */}
      <Paper elevation={0} sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            Tableau de bord académique
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="primary"
              startIcon={<CalendarMonthIcon />}
              onClick={goToCalendar}
              variant={activeTab === 1 ? "contained" : "outlined"}
              size="small"
              sx={{ mr: 1 }}
            >
              Calendrier
            </Button>
            <NotificationsPanel />
            <ThemeToggle 
              mode="light"
              onModeChange={() => {}}
            />
            <ExportDashboard targetRef={dashboardRef} />
            <Tooltip title="Rafraîchir">
              <IconButton onClick={() => window.location.reload()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Barre de recherche intelligente */}
        <Box sx={{ mt: 2 }}>
          <SearchAssistant 
            onSearch={(results) => console.log('Search results:', results)}
            onGenerateChart={(chartData) => console.log('Generate chart:', chartData)}
          />
        </Box>
      </Paper>
      
      {/* Navigation par onglets */}
      <Paper elevation={0} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab icon={<BarChartIcon />} label="Vue générale" iconPosition="start" />
          <Tab icon={<CalendarMonthIcon />} label="Calendrier académique" iconPosition="start" />
          <Tab icon={<TableChartIcon />} label="Liste des étudiants" iconPosition="start" />
        </Tabs>
      </Paper>
      
      {/* Contenu principal du tableau de bord */}
      <Box>
        {renderTabContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
