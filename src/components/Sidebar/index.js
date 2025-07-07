import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Typography,
  Avatar,
  useTheme
} from "@mui/material";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import WcIcon from "@mui/icons-material/Wc";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SchoolIcon from "@mui/icons-material/School";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PaidIcon from "@mui/icons-material/Paid";
import GradingIcon from "@mui/icons-material/Grading";
import TimelineIcon from "@mui/icons-material/Timeline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import GroupIcon from "@mui/icons-material/Group";
import { styled } from "@mui/material/styles";
import Logo from './Logo';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#ffffff',
    boxShadow: theme.palette.mode === 'dark' ? 'none' : '2px 0px 10px rgba(0, 0, 0, 0.05)',
    border: 'none',
    backgroundImage: theme.palette.mode === 'dark' 
      ? 'linear-gradient(180deg, rgba(17,24,39,1) 0%, rgba(24,31,48,1) 100%)'
      : 'none',
  }
}));

const ListItemStyled = styled(ListItem)(({ theme, selected }) => ({
  margin: '4px 8px',
  borderRadius: '8px',
  backgroundColor: selected ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const theme = useTheme();
  const [statsOpen, setStatsOpen] = useState(false);
  const [predictionsOpen, setPredictionsOpen] = useState(false);

  // Auto-open sections based on current path
  useEffect(() => {
    if (location.pathname.includes('statistics')) {
      setStatsOpen(true);
    }
    if (location.pathname.includes('predictions')) {
      setPredictionsOpen(true);
    }
  }, [location]);

  const handleStatsClick = () => {
    setStatsOpen(!statsOpen);
  };

  const handlePredictionsClick = () => {
    setPredictionsOpen(!predictionsOpen);
  };

  const drawer = (
    <div>
      <Toolbar 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          py: 3,
          mt: 1
        }}
      >
        <Logo />
      </Toolbar>

      <Box sx={{ px: 2, mb: 3 }}>
        <Box sx={{ 
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(45, 55, 72, 0.5)' : '#F3F4F6', 
          borderRadius: 2,
          p: 2,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', mr: 2 }}>AH</Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">Aya Hassan</Typography>
            <Typography variant="caption" color="text.secondary">Administrateur</Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ mx: 2 }} />

      <List component="nav" sx={{ px: 1 }}>
        <ListItemStyled 
          button 
          component={Link} 
          to="/" 
          selected={location.pathname === "/"}
        >
          <ListItemIcon>
            <DashboardIcon color={location.pathname === "/" ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText 
            primary="Tableau de Bord" 
            primaryTypographyProps={{
              fontWeight: location.pathname === "/" ? 'bold' : 'normal'
            }}
          />
        </ListItemStyled>

        <ListItemStyled button onClick={handleStatsClick} selected={statsOpen}>
          <ListItemIcon>
            <BarChartIcon color={statsOpen ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText 
            primary="Statistiques" 
            primaryTypographyProps={{ fontWeight: statsOpen ? 'bold' : 'normal' }}
          />
          {statsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemStyled>

        <Collapse in={statsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            <ListItemStyled
              button
              component={Link}
              to="/statistics/gender"
              selected={location.pathname === "/statistics/gender"}
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <WcIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Genre" />
            </ListItemStyled>

            <ListItemStyled
              button
              component={Link}
              to="/statistics/nationality"
              selected={location.pathname === "/statistics/nationality"}
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <PublicIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Nationalité" />
            </ListItemStyled>

            <ListItemStyled
              button
              component={Link}
              to="/statistics/city"
              selected={location.pathname === "/statistics/city"}
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <LocationCityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Ville" />
            </ListItemStyled>

            <ListItemStyled
              button
              component={Link}
              to="/statistics/bac-type"
              selected={location.pathname === "/statistics/bac-type"}
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <SchoolIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Type de Bac" />
            </ListItemStyled>

            <ListItemStyled
              button
              component={Link}
              to="/statistics/school-specialty"
              selected={location.pathname === "/statistics/school-specialty"}
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <ApartmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Écoles & Spécialités" />
            </ListItemStyled>

            <ListItemStyled
              button
              component={Link}
              to="/statistics/scholarship"
              selected={location.pathname === "/statistics/scholarship"}
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <PaidIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Bourses" />
            </ListItemStyled>

            <ListItemStyled
              button
              component={Link}
              to="/statistics/marks"
              selected={location.pathname === "/statistics/marks"}
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <GradingIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Notes" />
            </ListItemStyled>
          </List>
        </Collapse>

        <ListItemStyled button onClick={handlePredictionsClick} selected={predictionsOpen}>
          <ListItemIcon>
            <TimelineIcon color={predictionsOpen ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText 
            primary="Prédictions" 
            primaryTypographyProps={{ fontWeight: predictionsOpen ? 'bold' : 'normal' }}
          />
          {predictionsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemStyled>

        <Collapse in={predictionsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            <ListItemStyled
              button
              component={Link}
              to="/predictions/graduation"
              selected={location.pathname === "/predictions/graduation"}
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <EmojiEventsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Réussite" />
            </ListItemStyled>

            <ListItemStyled
              button
              component={Link}
              to="/predictions/specialty"
              selected={location.pathname === "/predictions/specialty"}
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <AutoFixHighIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Spécialité" />
            </ListItemStyled>

            <ListItemStyled
              button
              component={Link}
              to="/predictions/student-count"
              selected={location.pathname === "/predictions/student-count"}
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <PeopleAltIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Effectifs" />
            </ListItemStyled>

            <ListItemStyled
              button
              component={Link}
              to="/predictions/revenue"
              selected={location.pathname === "/predictions/revenue"}
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <AccountBalanceIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Revenus" />
            </ListItemStyled>

            <ListItemStyled
              button
              component={Link}
              to="/predictions/fee"
              selected={location.pathname === "/predictions/fee"}
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <RequestQuoteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Frais" />
            </ListItemStyled>
          </List>
        </Collapse>

        <ListItemStyled
          button
          component={Link}
          to="/team"
          selected={location.pathname === "/team"}
        >
          <ListItemIcon>
            <GroupIcon color={location.pathname === "/team" ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText 
            primary="Équipe" 
            primaryTypographyProps={{
              fontWeight: location.pathname === "/team" ? 'bold' : 'normal'
            }}
          />
        </ListItemStyled>
      </List>
      
      <Divider sx={{ mx: 2, my: 2 }} />
      
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Euromed Analytics v1.0.0
        </Typography>
      </Box>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
      <StyledDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </StyledDrawer>
      
      {/* Desktop drawer */}
      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </StyledDrawer>
    </Box>
  );
};

export default Sidebar;
