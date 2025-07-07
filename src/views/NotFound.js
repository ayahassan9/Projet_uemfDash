import { Box, Button, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";

// Icons
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import HomeIcon from "@mui/icons-material/Home";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        textAlign: "center"
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          maxWidth: 600,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <SentimentDissatisfiedIcon
          sx={{ fontSize: 100, mb: 3, color: "text.secondary" }}
        />
        
        <Typography variant="h1" fontWeight="bold" color="primary" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom>
          Page not found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </Typography>
        
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<HomeIcon />}
        >
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
