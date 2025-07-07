import React from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Typography,
  Tooltip,
  Divider,
  useTheme
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import MoreVertIcon from '@mui/icons-material/MoreVert';

/**
 * ThemeToggle - Composant pour changer les préférences d'affichage de l'application
 * 
 * @param {Object} props
 * @param {string} props.mode - Mode actuel (light/dark/system)
 * @param {Function} props.onModeChange - Fonction appelée lors du changement de mode
 * @param {string} props.primaryColor - Couleur primaire actuelle
 * @param {Function} props.onPrimaryColorChange - Fonction appelée lors du changement de couleur primaire
 * @param {number} props.fontSize - Taille de police relative (0.8, 1, 1.2)
 * @param {Function} props.onFontSizeChange - Fonction appelée lors du changement de taille de police
 */
const ThemeToggle = ({ 
  mode = 'light', 
  onModeChange = () => {},
  primaryColor = 'blue',
  onPrimaryColorChange = () => {},
  fontSize = 1,
  onFontSizeChange = () => {}
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  
  // Options de couleurs principales
  const colorOptions = [
    { value: 'blue', label: 'Bleu', color: '#1976d2' },
    { value: 'purple', label: 'Violet', color: '#9c27b0' },
    { value: 'green', label: 'Vert', color: '#2e7d32' },
    { value: 'orange', label: 'Orange', color: '#ed6c02' },
    { value: 'red', label: 'Rouge', color: '#d32f2f' },
    { value: 'teal', label: 'Turquoise', color: '#009688' }
  ];
  
  // Options de taille de police
  const fontSizeOptions = [
    { value: 0.85, label: 'Petite' },
    { value: 1, label: 'Normale' },
    { value: 1.15, label: 'Grande' }
  ];
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleModeChange = (newMode) => {
    onModeChange(newMode);
    handleMenuClose();
  };
  
  const handleColorChange = (newColor) => {
    onPrimaryColorChange(newColor);
    handleMenuClose();
  };
  
  const handleFontSizeChange = (newSize) => {
    onFontSizeChange(newSize);
    handleMenuClose();
  };
  
  // Déterminer l'icône à afficher
  const getThemeIcon = () => {
    switch (mode) {
      case 'dark':
        return <DarkModeIcon />;
      case 'light':
        return <LightModeIcon />;
      default:
        return <SettingsBrightnessIcon />;
    }
  };
  
  return (
    <>
      <Tooltip title="Préférences d'affichage">
        <IconButton 
          onClick={handleMenuOpen} 
          color="inherit"
          size="large"
        >
          {getThemeIcon()}
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
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
          sx: { width: 225, maxWidth: '100%' }
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
          Mode d'affichage
        </Typography>
        
        <MenuItem 
          selected={mode === 'light'} 
          onClick={() => handleModeChange('light')}
        >
          <ListItemIcon>
            <LightModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clair</ListItemText>
        </MenuItem>
        
        <MenuItem 
          selected={mode === 'dark'} 
          onClick={() => handleModeChange('dark')}
        >
          <ListItemIcon>
            <DarkModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sombre</ListItemText>
        </MenuItem>
        
        <MenuItem 
          selected={mode === 'system'} 
          onClick={() => handleModeChange('system')}
        >
          <ListItemIcon>
            <SettingsBrightnessIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Système</ListItemText>
        </MenuItem>
        
        <Divider sx={{ my: 1 }} />
        
        <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
          Couleur principale
        </Typography>
        
        {colorOptions.map((option) => (
          <MenuItem 
            key={option.value}
            selected={primaryColor === option.value} 
            onClick={() => handleColorChange(option.value)}
          >
            <ListItemIcon>
              <ColorLensIcon fontSize="small" style={{ color: option.color }} />
            </ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
        
        <Divider sx={{ my: 1 }} />
        
        <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
          Taille du texte
        </Typography>
        
        {fontSizeOptions.map((option) => (
          <MenuItem 
            key={option.value}
            selected={fontSize === option.value} 
            onClick={() => handleFontSizeChange(option.value)}
          >
            <ListItemIcon>
              <FormatSizeIcon 
                fontSize="small" 
                sx={{ 
                  transform: `scale(${option.value})`,
                  transition: 'transform 0.2s'
                }} 
              />
            </ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ThemeToggle;
