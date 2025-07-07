import { createTheme } from "@mui/material/styles";

// Custom color settings
export default createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
      light: "#e3f2fd",
      dark: "#42a5f5",
      contrastText: "#2a2a2a",
    },
    secondary: {
      main: "#ce93d8",
      light: "#f3e5f5",
      dark: "#ab47bc",
      contrastText: "#2a2a2a",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
      card: "#252525",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
    divider: "rgba(255, 255, 255, 0.12)",
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#29b6f6",
    },
    success: {
      main: "#66bb6a",
    },
    chart: {
      primary: "#90caf9",
      secondary: "#ce93d8",
      tertiary: "#f48fb1",
      quaternary: "#4fc3f7",
      quinary: "#81c784",
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: "2rem",
    },
    h2: {
      fontWeight: 500,
      fontSize: "1.75rem",
    },
    h3: {
      fontWeight: 500,
      fontSize: "1.5rem",
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.25rem",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.1rem",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    subtitle1: {
      fontSize: "0.875rem",
    },
    subtitle2: {
      fontSize: "0.75rem",
      fontWeight: 400,
    },
    body1: {
      fontSize: "0.875rem",
    },
    body2: {
      fontSize: "0.75rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0, 0, 0, 0.2)",
    // ... other shadow levels
    "0px 24px 38px rgba(0, 0, 0, 0.4)",
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#252525",
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
        },
      },
    },
  },
});
