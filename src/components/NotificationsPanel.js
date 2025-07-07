import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Button,
  CircularProgress,
  Tab,
  Tabs
} from '@mui/material';

// Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

/**
 * NotificationsPanel - Panneau de notifications pour le tableau de bord
 */
const NotificationsPanel = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const open = Boolean(anchorEl);
  
  // Simuler le chargement des notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Dans un vrai scénario, vous feriez un appel API ici
      // const response = await fetch('/api/notifications');
      // const data = await response.json();
      
      const mockNotifications = [
        {
          id: 1,
          type: 'alert',
          title: 'Anomalie détectée',
          message: 'Taux d\'échec inhabituel dans le cours BDA-302',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          read: false,
          priority: 'high'
        },
        {
          id: 2,
          type: 'info',
          title: 'Mise à jour des données',
          message: 'Les données d\'admission du 2ème semestre sont disponibles',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          read: true,
          priority: 'medium'
        },
        {
          id: 3,
          type: 'task',
          title: 'Validation requise',
          message: 'Veuillez valider les rapports mensuels d\'assiduité',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          read: false,
          priority: 'medium'
        },
        {
          id: 4,
          type: 'event',
          title: 'Conseil pédagogique',
          message: 'Réunion planifiée pour demain à 14h00',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago
          read: true,
          priority: 'low'
        },
        {
          id: 5,
          type: 'info',
          title: 'Mise à jour système',
          message: 'Le système sera en maintenance ce week-end',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
          read: false,
          priority: 'low'
        }
      ];
      
      setNotifications(mockNotifications);
      setLoading(false);
    };
    
    if (open) {
      fetchNotifications();
    }
  }, [open]);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Filtrer les notifications selon l'onglet actif
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });
  
  // Compter les notifications non lues
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Obtenir l'icône selon le type de notification
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <ErrorOutlineIcon color="error" />;
      case 'task':
        return <AssignmentIcon color="primary" />;
      case 'event':
        return <EventNoteIcon color="success" />;
      case 'info':
      default:
        return <NewReleasesIcon color="info" />;
    }
  };
  
  // Formater la date relative (par ex. "il y a 5 minutes")
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) return 'À l\'instant';
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffHour < 24) return `Il y a ${diffHour} h`;
    if (diffDay === 1) return 'Hier';
    if (diffDay < 7) return `Il y a ${diffDay} j`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        size="large"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 1,
          sx: { 
            width: 360,
            maxWidth: '100%',
            maxHeight: '80vh'
          }
        }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
          {unreadCount > 0 && (
            <Button 
              size="small" 
              startIcon={<MarkEmailReadIcon fontSize="small" />} 
              onClick={handleMarkAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
        </Box>
        
        <Divider />
        
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 1 }}
        >
          <Tab label="Toutes" value="all" />
          <Tab 
            label={`Non lues (${unreadCount})`} 
            value="unread" 
            disabled={unreadCount === 0} 
          />
          <Tab label="Alertes" value="alert" />
          <Tab label="Tâches" value="task" />
          <Tab label="Événements" value="event" />
        </Tabs>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : filteredNotifications.length > 0 ? (
          <List sx={{ p: 0 }}>
            {filteredNotifications.map(notification => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 2,
                    py: 1,
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'background.paper' }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={notification.read ? 'normal' : 'bold'}>
                          {notification.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getRelativeTime(notification.timestamp)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                          {notification.message}
                        </Typography>
                        {!notification.read && (
                          <Button 
                            size="small" 
                            sx={{ mt: 0.5, p: 0, minWidth: 'auto' }}
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Marquer comme lu
                          </Button>
                        )}
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {activeTab === 'unread' 
                ? 'Aucune notification non lue' 
                : 'Aucune notification dans cette catégorie'}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button 
            fullWidth 
            size="small" 
            onClick={handleClose}
          >
            Voir toutes les notifications
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationsPanel;
