import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Material Dashboard components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard themes
import theme from "./assets/theme";
import themeDark from "./assets/theme-dark";

// Layout components
import AdminLayout from "./layouts/AdminLayout";

// Views
import Dashboard from "./views/Dashboard";
import FileUpload from "./views/FileUpload";
import Statistics from "./views/Statistics";
import StatGender from "./views/Statistics/StatGender";
import StatNationality from "./views/Statistics/StatNationality";
import StatCity from "./views/Statistics/StatCity";
import StatBacType from "./views/Statistics/StatBacType";
import StatSchoolSpecialty from "./views/Statistics/StatSchoolSpecialty";
import StatScholarship from "./views/Statistics/StatScholarship";
import StatMarks from "./views/Statistics/StatMarks";
import Predictions from "./views/Predictions";
import PredictGraduation from "./views/Predictions/PredictGraduation";
import PredictSpecialty from "./views/Predictions/PredictSpecialty";
import PredictRevenue from "./views/Predictions/PredictRevenue";
import PredictStudentCount from "./views/Predictions/PredictStudentCount";
import PredictFee from "./views/Predictions/PredictFee";
import Team from "./views/Team";
import NotFound from "./views/NotFound";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Check local storage for user preferences
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const savedDataLoaded = localStorage.getItem("dataLoaded") === "true";
    setDarkMode(savedDarkMode);
    setDataLoaded(savedDataLoaded);
  }, []);

  // Save preferences to local storage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("dataLoaded", dataLoaded);
  }, [darkMode, dataLoaded]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Set data loaded status
  const setDataLoadedStatus = (status) => {
    setDataLoaded(status);
  };

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<AdminLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
          <Route path="/" element={dataLoaded ? <Dashboard /> : <Navigate to="/upload" />} />
          <Route path="/upload" element={<FileUpload setDataLoaded={setDataLoadedStatus} />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/statistics/gender" element={<StatGender />} />
          <Route path="/statistics/nationality" element={<StatNationality />} />
          <Route path="/statistics/city" element={<StatCity />} />
          <Route path="/statistics/bac-type" element={<StatBacType />} />
          <Route path="/statistics/school-specialty" element={<StatSchoolSpecialty />} />
          <Route path="/statistics/scholarship" element={<StatScholarship />} />
          <Route path="/statistics/marks" element={<StatMarks />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/predictions/graduation" element={<PredictGraduation />} />
          <Route path="/predictions/specialty" element={<PredictSpecialty />} />
          <Route path="/predictions/revenue" element={<PredictRevenue />} />
          <Route path="/predictions/student-count" element={<PredictStudentCount />} />
          <Route path="/predictions/fee" element={<PredictFee />} />
          <Route path="/team" element={<Team />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Navigate to="/dashboard#calendar" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
