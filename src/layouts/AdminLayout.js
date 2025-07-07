import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar, CssBaseline, IconButton, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

// Components
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";

// Icons
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 280;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    [theme.breakpoints.up("md")]: {
      marginLeft: 0,
    },
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AdminLayout = ({ darkMode, toggleDarkMode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppHeader 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        drawerWidth={drawerWidth}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </AppHeader>
      <Sidebar 
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Main open={mobileOpen}>
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
          <Outlet />
        </Container>
      </Main>
    </Box>
  );
};

export default AdminLayout;
