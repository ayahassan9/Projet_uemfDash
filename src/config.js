// Configuration globale de l'application

// Use a consistent default port
const apiPort = 8000;

// Configuration de l'API
export const API_CONFIG = {
  // URL de base pour les appels API
  BASE_URL: `http://localhost:${apiPort}/api`,
  
  // Endpoints API
  ENDPOINTS: {
    // Données et schéma
    DATA_SUMMARY: '/data/summary',
    SCHEMA: '/schema',  // Nouvel endpoint pour les infos de schéma
    
    // Statistiques
    GENDER_STATS: '/statistics/gender',
    NATIONALITY_STATS: '/statistics/nationality',
    CITY_STATS: '/statistics/city',
    BAC_TYPE_STATS: '/statistics/bac-type',
    SCHOOL_SPECIALTY_STATS: '/statistics/school-specialty',
    SCHOLARSHIP_STATS: '/statistics/scholarship',
    MARK_CORRELATIONS: '/statistics/mark-correlations',
    
    // Prédictions
    GRADUATION_PREDICTION: '/predictions/graduation',
    SPECIALTY_PREDICTION: '/predictions/specialty',
    FACULTY_REVENUE: '/predictions/faculty-revenue',
    NEXT_YEAR_STUDENTS: '/predictions/next-year-students',
    AVERAGE_FEE: '/predictions/average-fee',
    
    // Upload
    UPLOAD: '/upload'
  },
  
  // Options de requête par défaut
  DEFAULT_OPTIONS: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
};
