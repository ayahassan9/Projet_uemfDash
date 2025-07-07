import { useState } from "react";
import { 
  AppBar, Toolbar, Typography, IconButton, 
  Box, Menu, MenuItem, Tooltip, Avatar,
  Badge, Divider, ListItemIcon, Button
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

// Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import HelpIcon from "@mui/icons-material/Help";
import DownloadIcon from "@mui/icons-material/Download";
import FeedbackIcon from "@mui/icons-material/Feedback";

const StyledAppBar = styled(AppBar)(({ theme, drawerwidth }) => ({
  width: `calc(100% - ${drawerwidth}px)`,
  marginLeft: drawerwidth,
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginLeft: 0,
  },
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#333333',
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
  backdropFilter: 'blur(8px)',
  backgroundImage: theme.palette.mode === 'dark' 
    ? 'linear-gradient(180deg, rgba(26,26,26,0.9) 0%, rgba(26,26,26,0.95) 100%)'
    : 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
  borderBottom: '1px solid',
  borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
}));

// Logo component for Euromed
const EuromedLogo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 700,
  letterSpacing: 1,
  color: theme.palette.primary.main,
  '& img': {
    height: 40,
    marginRight: theme.spacing(1),
  },
}));

const AppHeader = ({ darkMode, toggleDarkMode, drawerWidth, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [helpAnchorEl, setHelpAnchorEl] = useState(null);
  
  // Mock notifications
  const notifications = [
    { id: 1, text: "Nouvel étudiant inscrit", time: "Il y a 5 minutes" },
    { id: 2, text: "Mise à jour des données terminée", time: "Il y a 30 minutes" },
    { id: 3, text: "Nouveau rapport disponible", time: "Il y a 2 heures" }
  ];
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleHelpMenuOpen = (event) => {
    setHelpAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
    setHelpAnchorEl(null);
  };

  return (
    <StyledAppBar 
      position="fixed" 
      drawerwidth={drawerWidth}
    >
      <Toolbar>
        {children}
        
        <EuromedLogo>
          {/* Placeholder for logo image */}
          <img 
            src="/logo-euromed.png" 
            alt="Euromed Logo" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.marginLeft = '0';
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              fontWeight: "bold",
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            EUROMED ANALYTICS
          </Typography>
        </EuromedLogo>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            startIcon={<DownloadIcon />}
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            Exporter les données
          </Button>
          
          <Tooltip title="Aide et support">
            <IconButton
              onClick={handleHelpMenuOpen}
              sx={{ ml: 1 }}
            >
              <HelpIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={darkMode ? "Mode clair" : "Mode sombre"}>
            <IconButton onClick={toggleDarkMode} sx={{ ml: 1 }}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Notifications">
            <IconButton 
              onClick={handleNotificationMenuOpen}
              sx={{ ml: 1 }}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Paramètres">
            <IconButton sx={{ ml: 1 }}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Profil">
            <IconButton 
              onClick={handleProfileMenuOpen}
              sx={{ ml: 1 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                A
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2,
              minWidth: 200,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              mt: 1.5,
            },
          }}
        >
          <MenuItem>
            <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }} />
            Aya Hassan
          </MenuItem>
          <Divider />
          <MenuItem component={Link} to="/team">
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Mon Profil
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <SettingsApplicationsIcon fontSize="small" />
            </ListItemIcon>
            Paramètres
          </MenuItem>
          <Divider />
          <MenuItem>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Déconnexion
          </MenuItem>
        </Menu>
        
        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          id="notification-menu"
          open={Boolean(notificationAnchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2,
              minWidth: 280,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              mt: 1.5,
            },
          }}
        >
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
          </Box>
          <Divider />
          
          {notifications.map((notification) => (
            <MenuItem key={notification.id} sx={{ py: 1.5 }}>
              <Box>
                <Typography variant="body2" fontWeight="medium">{notification.text}</Typography>
                <Typography variant="caption" color="text.secondary">{notification.time}</Typography>
              </Box>
            </MenuItem>
          ))}
          
          <Divider />
          <MenuItem sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" color="primary">Voir toutes les notifications</Typography>
          </MenuItem>
        </Menu>
        
        {/* Help Menu */}
        <Menu
          anchorEl={helpAnchorEl}
          id="help-menu"
          open={Boolean(helpAnchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2,
              minWidth: 200,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              mt: 1.5,
            },
          }}
        >
          <MenuItem>
            <ListItemIcon>
              <HelpIcon fontSize="small" />
            </ListItemIcon>
            Centre d'aide
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <FeedbackIcon fontSize="small" />
            </ListItemIcon>
            Envoyer un feedback
          </MenuItem>
          <MenuItem component={Link} to="/team">
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Contacter l'équipe
          </MenuItem>
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default AppHeader;
