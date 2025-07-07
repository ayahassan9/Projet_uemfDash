import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// Un composant stylisé pour le logo
const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  letterSpacing: 1,
  textAlign: "center",
  marginTop: theme.spacing(1),
  background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const LogoBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: '4px 8px',
  borderRadius: 12,
  fontSize: '0.7rem',
  fontWeight: 'bold',
  marginTop: theme.spacing(1),
  textTransform: 'uppercase',
  letterSpacing: 1,
}));

// Composant pour le cercle stylisé
const LogoCircle = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
  fontSize: '1.5rem',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: '50%',
    border: `2px solid ${theme.palette.primary.main}`,
  }
}));

const Logo = () => {
  return (
    <LogoContainer>
      <Box sx={{ position: 'relative' }}>
        <Box 
          component="img"
          src="/logo-euromed.png"
          alt="Euromed Logo"
          sx={{ 
            width: 80, 
            height: 80,
            display: 'block',
            objectFit: 'contain'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <LogoCircle sx={{ display: 'none' }}>
          UE
        </LogoCircle>
      </Box>
      
      <LogoText variant="h5">
        EUROMED
      </LogoText>
      
      <LogoBadge>
        Analytics
      </LogoBadge>
    </LogoContainer>
  );
};

export default Logo;
