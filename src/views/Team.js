import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  Fade,
  Chip,
  CardActions,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  Stack,
  Rating,
  Tooltip,
  CircularProgress,
  Fab
} from "@mui/material";

// Icons
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CodeIcon from "@mui/icons-material/Code";
import SchoolIcon from "@mui/icons-material/School";
import SendIcon from "@mui/icons-material/Send";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";
import DescriptionIcon from "@mui/icons-material/Description";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import StorageIcon from "@mui/icons-material/Storage";
import DataObjectIcon from "@mui/icons-material/DataObject";
import BarChartIcon from "@mui/icons-material/BarChart";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import Verified from "@mui/icons-material/Verified";
import ChatIcon from "@mui/icons-material/Chat";

// Import VerifiedIcon from our components
import VerifiedIcon from "../components/VerifiedIcon";

// Temporary chatbot components until the real ones are properly implemented
// These will prevent the "undefined component" errors
const TempChatBotFab = ({ onClick }) => (
  <Tooltip title="Assistant Email">
    <Fab
      color="primary"
      aria-label="chat"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000
      }}
    >
      <ChatIcon />
    </Fab>
  </Tooltip>
);

const TempEmailChatBot = ({ teamMembers, onEmailGenerated, onClose }) => (
  <Dialog
    open={true}
    onClose={onClose}
    maxWidth="md"
    fullWidth
  >
    <DialogTitle>Assistant Email</DialogTitle>
    <DialogContent>
      <Typography>
        L'assistant de rédaction d'emails est en cours de chargement...
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Fermer</Button>
    </DialogActions>
  </Dialog>
);

// Try importing the real components, but use the temporary ones if they fail
let EmailChatBot, ChatBotFab;
try {
  const ChatBotModule = require('../components/EmailChatBot');
  EmailChatBot = ChatBotModule.default;
  ChatBotFab = ChatBotModule.ChatBotFab;
} catch (error) {
  console.warn('EmailChatBot component not found, using temporary component');
  EmailChatBot = TempEmailChatBot;
  ChatBotFab = TempChatBotFab;
}

// Temporarily remove recharts import and replace with a placeholder component
// Instead of using the actual RadarChart from recharts
const RadarChartPlaceholder = ({ data }) => (
  <Box sx={{ 
    p: 3, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    border: '1px dashed',
    borderColor: 'divider',
    borderRadius: 2,
    height: 300
  }}>
    <Typography variant="body2" color="text.secondary" align="center">
      Skill Distribution Chart
      <br />
      (Install recharts package to enable this visualization)
    </Typography>
    
    <Box sx={{ mt: 2 }}>
      {data?.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
          <Typography variant="caption">{item.subject}</Typography>
          <Typography variant="caption" fontWeight="bold">{item.A}%</Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

// Placeholder for recharts components
const ResponsiveContainer = ({ children, width, height }) => (
  <Box sx={{ width, height }}>{children}</Box>
);

const RadarChart = (props) => <Box {...props}>{props.children}</Box>;
const PolarGrid = () => null;
const PolarAngleAxis = () => null;
const PolarRadiusAxis = () => null;
const Radar = () => null;

// Data science research areas and interests
const researchAreas = [
  {
    title: "Machine Learning",
    icon: <ModelTrainingIcon />,
    description: "Développement et optimisation d'algorithmes d'apprentissage automatique pour l'analyse prédictive",
    publications: 3,
    projects: 5,
    expertise: 90
  },
  {
    title: "Big Data Processing",
    icon: <StorageIcon />,
    description: "Technologies et techniques pour le traitement efficace des grands volumes de données",
    publications: 2,
    projects: 4,
    expertise: 85
  },
  {
    title: "Data Visualization",
    icon: <BarChartIcon />,
    description: "Création de visualisations interactives pour explorer et communiquer des insights complexes",
    publications: 4,
    projects: 6,
    expertise: 92
  },
  {
    title: "Predictive Analytics",
    icon: <AutoGraphIcon />,
    description: "Application de techniques statistiques et d'apprentissage automatique pour prédire des tendances futures",
    publications: 2,
    projects: 3,
    expertise: 88
  }
];

// Data analytics projects
const dataProjects = [
  {
    title: "Analyse prédictive du parcours des étudiants",
    description: "Développement d'un modèle ML pour prédire les performances académiques et identifier les étudiants à risque",
    technologies: ["Python", "Scikit-learn", "TensorFlow", "Pandas"],
    metrics: {
      accuracy: 92,
      precision: 89,
      recall: 87,
      f1Score: 88
    }
  },
  {
    title: "Dashboard analytique pour l'insertion professionnelle",
    description: "Création d'une plateforme de visualisation pour suivre les indicateurs d'insertion professionnelle des diplômés",
    technologies: ["React", "D3.js", "Python", "Flask", "MongoDB"],
    metrics: {
      userSatisfaction: 94,
      dataPoints: "15K+",
      insightGenerated: "12 KPIs",
      adoptionRate: "87%"
    }
  },
  {
    title: "Modélisation des parcours de formation",
    description: "Analyse de graphes pour optimiser les parcours de formation et identifier les séquences optimales de cours",
    technologies: ["R", "NetworkX", "Neo4j", "GraphQL"],
    metrics: {
      optimizationRate: "23%",
      pathEfficiency: "31%",
      predictiveAccuracy: "89%"
    }
  }
];

const teamMembers = [
  {
    name: "Aya Hassan",
    role: "Big Data Student",
    avatar: "/avatars/aya.jpg", // Placeholder, replace with actual image path
    bio: "Specializes in full-stack development with expertise in React, Flask, and data visualization. Led the development of Euromed Analytics Dashboard.",
    skills: [
      { name: "React", level: 90 },
      { name: "Python", level: 85 },
      { name: "Data Science", level: 88 },
      { name: "Machine Learning", level: 92 },
      { name: "Big Data", level: 85 },
      { name: "Analytics", level: 78 }
    ],
    radarSkills: [
      { subject: 'Programming', A: 90, fullMark: 100 },
      { subject: 'Algorithms', A: 85, fullMark: 100 },
      { subject: 'Statistics', A: 82, fullMark: 100 },
      { subject: 'Data Viz', A: 88, fullMark: 100 },
      { subject: 'ML/AI', A: 78, fullMark: 100 },
      { subject: 'Big Data', A: 75, fullMark: 100 },
    ],
    links: {
      email: "mailto:aya.hassan@eidia.ueuromed.org",
      linkedin: "https://linkedin.com/in/ayahassan",
      github: "https://github.com/ayahassan"
    },
    githubStats: {
      contributions: 247,
      repositories: 18,
      stars: 32,
      followers: 15
    },
    education: [
      "MSc in Big Data and Analytics, Euromed University of Fes (2023-Present)",
      "BSc in Computer Science, Mohammed V University (2019-2023)"
    ],
    languages: [
      { name: "Arabic", proficiency: "Native" },
      { name: "French", proficiency: "Fluent" },
      { name: "English", proficiency: "Professional" }
    ],
    certifications: [
      { name: "Azure Data Scientist Associate", issuer: "Microsoft", year: 2023 },
      { name: "TensorFlow Developer", issuer: "Google", year: 2022 },
      { name: "Data Science Professional", issuer: "IBM", year: 2022 }
    ]
  },
  {
    name: "Yassir Tajmouati",
    role: "Big Data Student",
    avatar: "/avatars/yassir.jpg", // Placeholder, replace with actual image path
    bio: "Specializes in data science and analytics. Contributed to the development of prediction models and data processing pipelines for the platform.",
    skills: [
      { name: "React", level: 90 },
      { name: "Python", level: 85 },
      { name: "Data Science", level: 88 },
      { name: "Machine Learning", level: 92 },
      { name: "Big Data", level: 85 },
      { name: "Analytics", level: 78 }
    ],
    radarSkills: [
      { subject: 'Programming', A: 90, fullMark: 100 },
      { subject: 'Algorithms', A: 85, fullMark: 100 },
      { subject: 'Statistics', A: 82, fullMark: 100 },
      { subject: 'Data Viz', A: 88, fullMark: 100 },
      { subject: 'ML/AI', A: 78, fullMark: 100 },
      { subject: 'Big Data', A: 75, fullMark: 100 },
    ],
    links: {
      email: "mailto:yassir.tajmouati@eidia.ueuromed.org",
      linkedin: "https://linkedin.com/in/yassirtajmouati",
      github: "https://github.com/yassirtajmouati"
    },
    githubStats: {
      contributions: 187,
      repositories: 15,
      stars: 28,
      followers: 12
    },
    education: [
      "MSc in Big Data and Analytics, Euromed University of Fes (2023-Present)",
      "BSc in Mathematics and Computer Science, Hassan II University (2019-2023)"
    ],
    languages: [
      { name: "Arabic", proficiency: "Native" },
      { name: "French", proficiency: "Fluent" },
      { name: "English", proficiency: "Professional" }
    ],
    certifications: [
      { name: "AWS Certified Data Analytics", issuer: "Amazon", year: 2023 },
      { name: "Deep Learning Specialization", issuer: "Coursera", year: 2022 },
      { name: "Spark Developer", issuer: "Databricks", year: 2022 }
    ]
  }
];

const testimonials = [
  {
    quote: "The team delivered an exceptional analytics platform that has transformed how we process and visualize student data at Euromed.",
    author: "Dr. Nadia Tazi",
    position: "Academic Director, Euromed University",
    avatar: "/avatars/nadia.jpg"
  },
  {
    quote: "The predictive models developed by this team have significantly improved our ability to identify at-risk students and provide timely interventions.",
    author: "Prof. Mehdi Karimi",
    position: "Head of Data Science Department",
    avatar: "/avatars/mehdi.jpg"
  },
  {
    quote: "An impressive example of how student-led projects can provide real value to educational institutions. The dashboard is now an essential tool for our administration.",
    author: "Ahmed Bennani",
    position: "CIO, Euromed University",
    avatar: "/avatars/ahmed.jpg"
  }
];

const Team = () => {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [skillFilter, setSkillFilter] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [tabValue, setTabValue] = useState(0);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedMemberDetails, setSelectedMemberDetails] = useState(null);
  const [researchTabValue, setResearchTabValue] = useState(0);
  // Add state for chatbot
  const [chatbotOpen, setChatbotOpen] = useState(false);
  
  // Get all unique skills
  const allSkills = [...new Set(teamMembers.flatMap(member => member.skills.map(skill => skill.name)))];

  // Filter team members by skill
  const filteredMembers = skillFilter 
    ? teamMembers.filter(member => 
        member.skills.some(skill => skill.name.toLowerCase().includes(skillFilter.toLowerCase()))
      )
    : teamMembers;

  const handleOpenContactDialog = (member) => {
    setSelectedMember(member);
    setContactDialogOpen(true);
  };

  const handleCloseContactDialog = () => {
    setContactDialogOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendMessage = () => {
    // Here you would typically send the message via API
    console.log("Sending message to", selectedMember?.name, contactForm);
    
    // Reset form and close dialog
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    handleCloseContactDialog();
    
    // Show success message (in a real app you'd use a proper notification system)
    alert(`Message sent to ${selectedMember?.name}!`);
  };

  const handleOpenDetails = (member) => {
    setSelectedMemberDetails(member);
    setDetailsDialogOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleResearchTabChange = (event, newValue) => {
    setResearchTabValue(newValue);
  };

  // Calculate the average metrics for project performance
  const calculateAverageMetrics = () => {
    let sum = 0;
    let count = 0;

    dataProjects.forEach(project => {
      Object.values(project.metrics).forEach(metric => {
        if (typeof metric === 'number') {
          sum += metric;
          count++;
        }
      });
    });

    return sum / count;
  };

  // Handler for opening the chatbot
  const handleOpenChatbot = () => {
    setChatbotOpen(true);
  };

  // Handler for when the chatbot is closed
  const handleCloseChatbot = () => {
    setChatbotOpen(false);
  };

  // Handler for when an email is generated
  const handleEmailGenerated = (email) => {
    console.log("Email generated:", email);
    // You can implement additional logic here if needed
  };

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Meet Our Team
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          The talented people behind the Euromed Analytics Dashboard
        </Typography>
        
        {/* Skill Filter */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
          <FormControl size="small" variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel id="skill-filter-label">Filter by Skill</InputLabel>
            <Select
              labelId="skill-filter-label"
              id="skill-filter"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              label="Filter by Skill"
            >
              <MenuItem value="">
                <em>All Skills</em>
              </MenuItem>
              {allSkills.map((skill) => (
                <MenuItem key={skill} value={skill}>{skill}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {skillFilter && (
            <Button 
              size="small" 
              sx={{ ml: 1 }}
              onClick={() => setSkillFilter("")}
            >
              Clear Filter
            </Button>
          )}
          
          <Box sx={{ ml: 'auto' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredMembers.length} of {teamMembers.length} team members
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={3}>
          {filteredMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px -10px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Box sx={{ 
                  p: 3, 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{ 
                      width: 120, 
                      height: 120,
                      mb: 2,
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                </Box>
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" paragraph>
                    {member.bio}
                  </Typography>
                  
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Top Skills
                  </Typography>
                  
                  {/* Display top 3 skills with progress bars */}
                  {member.skills.slice(0, 3).map((skill, idx) => (
                    <Box key={idx} sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">{skill.name}</Typography>
                        <Typography variant="caption" fontWeight="bold">{skill.level}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={skill.level} 
                        sx={{ height: 6, borderRadius: 5 }}
                      />
                    </Box>
                  ))}
                  
                  <Button 
                    size="small" 
                    color="primary" 
                    sx={{ mt: 1 }}
                    onClick={() => handleOpenDetails(member)}
                  >
                    View Full Profile
                  </Button>
                </CardContent>
                
                <Divider />
                
                <CardActions sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <IconButton 
                    aria-label="email"
                    onClick={() => handleOpenContactDialog(member)}
                    size="small"
                    color="primary"
                  >
                    <EmailIcon />
                  </IconButton>
                  <IconButton 
                    aria-label="linkedin"
                    href={member.links.linkedin}
                    size="small"
                    color="primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedInIcon />
                  </IconButton>
                  <IconButton 
                    aria-label="github"
                    href={member.links.github}
                    size="small"
                    color="primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHubIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Domaines de recherche et expertises en Data Science */}
        <Box mt={8} mb={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Domaines d'expertise en Data Science
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={3}>
            {researchAreas.map((area, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        mr: 1.5
                      }}
                    >
                      {area.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      {area.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" paragraph sx={{ flexGrow: 1 }}>
                    {area.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Tooltip title="Publications dans ce domaine">
                      <Chip 
                        label={`${area.publications} publications`}
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                    </Tooltip>
                    <Tooltip title="Projets réalisés">
                      <Chip 
                        label={`${area.projects} projets`}
                        size="small" 
                        color="secondary"
                        variant="outlined"
                      />
                    </Tooltip>
                  </Box>
                  
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                      Niveau d'expertise:
                    </Typography>
                    <Box sx={{ position: 'relative', width: '100%', height: 4, bgcolor: 'background.paper' }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={area.expertise} 
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          height: '100%',
                          borderRadius: 5,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" fontWeight="bold" sx={{ ml: 1 }}>
                      {area.expertise}%
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Data Analytics Projects */}
        <Box mt={8} mb={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Projets d'analyse de données
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={3}>
            {dataProjects.map((project, index) => (
              <Grid item xs={12} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" fontWeight="bold">
                        {project.title}
                      </Typography>
                      
                      <Typography variant="body2" paragraph>
                        {project.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Technologies utilisées:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {project.technologies.map((tech, idx) => (
                            <Chip 
                              key={idx}
                              label={tech}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        Métriques de performance:
                      </Typography>
                      <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                        {Object.entries(project.metrics).map(([key, value], idx) => (
                          <Box key={idx} sx={{ mb: 1.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </Typography>
                              <Typography variant="caption" fontWeight="bold">
                                {value}
                              </Typography>
                            </Box>
                            {typeof value === 'number' && (
                              <LinearProgress 
                                variant="determinate" 
                                value={value} 
                                sx={{ height: 6, borderRadius: 5 }}
                              />
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          {/* Overall Project Performance */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              mt: 3
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography variant="h6" fontWeight="bold">
                  Performance globale des projets
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analyse des indicateurs clés de performance à travers tous nos projets d'analyse de données
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={calculateAverageMetrics()}
                    size={120}
                    thickness={5}
                    sx={{ color: 'success.main' }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h5" component="div" color="success.main" fontWeight="bold">
                      {Math.round(calculateAverageMetrics())}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Taux de succès moyen
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Projets complétés</Typography>
                    <Typography variant="body2" fontWeight="bold">{dataProjects.length}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Technologies maîtrisées</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {[...new Set(dataProjects.flatMap(p => p.technologies))].length}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Testimonials Section */}
        <Box mt={8} mb={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Testimonials
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={3}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <FormatQuoteIcon 
                    color="primary" 
                    fontSize="large"
                    sx={{ mb: 2, transform: 'rotate(180deg)' }}
                  />
                  
                  <Typography variant="body1" paragraph sx={{ flexGrow: 1, fontStyle: 'italic' }}>
                    "{testimonial.quote}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Avatar src={testimonial.avatar} alt={testimonial.author} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {testimonial.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.position}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mt={6}>
          <Paper
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider' 
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              About the Project
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" paragraph>
              The Euromed Analytics Dashboard was developed as a collaborative project to provide the Université Euromed de Fès with 
              a comprehensive analytical tool for monitoring student data, academic performance, and institutional trends.
            </Typography>
            
            <Typography variant="body1">
              This project was completed as part of the university's digital transformation initiative, aiming to leverage 
              data analytics and artificial intelligence to improve decision-making processes and enhance educational outcomes.
            </Typography>

            <Box mt={3} sx={{ textAlign: 'center' }}>
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                onClick={() => setContactDialogOpen(true)}
                startIcon={<EmailIcon />}
              >
                Contact the Team
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Add ChatBot Fab - Use the component safely with proper JSX */}
        {ChatBotFab ? (
          <ChatBotFab onClick={handleOpenChatbot} />
        ) : (
          <TempChatBotFab onClick={handleOpenChatbot} />
        )}
        
        {/* Render the EmailChatBot component when it's open - Using proper JSX */}
        {chatbotOpen && EmailChatBot && (
          <EmailChatBot 
            teamMembers={teamMembers}
            onEmailGenerated={handleEmailGenerated}
            onClose={handleCloseChatbot}
          />
        )}
        
        {/* Fallback to temporary component when necessary */}
        {chatbotOpen && !EmailChatBot && (
          <TempEmailChatBot
            teamMembers={teamMembers}
            onEmailGenerated={handleEmailGenerated}
            onClose={handleCloseChatbot}
          />
        )}

        {/* Contact Dialog */}
        <Dialog 
          open={contactDialogOpen} 
          onClose={handleCloseContactDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedMember ? `Contact ${selectedMember.name}` : "Contact Our Team"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Your Name"
                  fullWidth
                  variant="outlined"
                  value={contactForm.name}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Your Email"
                  fullWidth
                  variant="outlined"
                  value={contactForm.email}
                  onChange={handleFormChange}
                  required
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="subject"
                  label="Subject"
                  fullWidth
                  variant="outlined"
                  value={contactForm.subject}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="message"
                  label="Message"
                  fullWidth
                  variant="outlined"
                  value={contactForm.message}
                  onChange={handleFormChange}
                  required
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseContactDialog} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage} 
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              disabled={!contactForm.name || !contactForm.email || !contactForm.message}
            >
              Send Message
            </Button>
          </DialogActions>
        </Dialog>

        {/* Member Details Dialog */}
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedMemberDetails && (
            <>
              <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    src={selectedMemberDetails.avatar}
                    alt={selectedMemberDetails.name}
                    sx={{ width: 120, height: 120, mr: 3 }}
                  />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedMemberDetails.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {selectedMemberDetails.role}
                    </Typography>
                    <Box sx={{ display: 'flex', mt: 1 }}>
                      <IconButton 
                        href={selectedMemberDetails.links.email}
                        size="small"
                        color="primary"
                      >
                        <EmailIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        href={selectedMemberDetails.links.linkedin}
                        size="small"
                        color="primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkedInIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        href={selectedMemberDetails.links.github}
                        size="small"
                        color="primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GitHubIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                  <Tab label="Skills" icon={<CodeIcon />} iconPosition="start" />
                  <Tab label="Education" icon={<SchoolIcon />} iconPosition="start" />
                  <Tab label="GitHub Stats" icon={<GitHubIcon />} iconPosition="start" />
                  <Tab label="Certifications" icon={<VerifiedIcon fontSize="small" />} iconPosition="start" />
                </Tabs>

                {/* Skills Tab with Radar Chart */}
                {tabValue === 0 && (
                  <Box sx={{ p: 1 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Technical Skills
                        </Typography>
                        
                        <Grid container spacing={2}>
                          {selectedMemberDetails.skills.map((skill, idx) => (
                            <Grid item xs={12} key={idx}>
                              <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="body2">{skill.name}</Typography>
                                  <Typography variant="body2" fontWeight="bold">{skill.level}%</Typography>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={skill.level} 
                                  sx={{ height: 8, borderRadius: 5 }}
                                />
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Skill Distribution
                        </Typography>
                        
                        <Box sx={{ height: 300, width: '100%' }}>
                          {/* Replace RadarChart with placeholder */}
                          <RadarChartPlaceholder data={selectedMemberDetails.radarSkills} />
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} mt={2}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                          Languages
                        </Typography>
                        
                        <Grid container spacing={2}>
                          {selectedMemberDetails.languages.map((language, idx) => (
                            <Grid item xs={6} sm={3} key={idx}>
                              <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="body2" fontWeight="bold">
                                  {language.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {language.proficiency}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Education Tab */}
                {tabValue === 1 && (
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Education Background
                    </Typography>
                    
                    <List>
                      {selectedMemberDetails.education.map((edu, idx) => (
                        <div key={idx}>
                          <Typography variant="body2" paragraph>
                            {edu}
                          </Typography>
                          {idx < selectedMemberDetails.education.length - 1 && <Divider sx={{ my: 1 }} />}
                        </div>
                      ))}
                    </List>
                  </Box>
                )}

                {/* GitHub Stats Tab */}
                {tabValue === 2 && (
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      GitHub Activity
                    </Typography>
                    
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      <Grid item xs={6} sm={3}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight="bold" color="primary">
                            {selectedMemberDetails.githubStats.contributions}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Contributions
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight="bold" color="primary">
                            {selectedMemberDetails.githubStats.repositories}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Repositories
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight="bold" color="primary">
                            {selectedMemberDetails.githubStats.stars}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <StarIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            Stars
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight="bold" color="primary">
                            {selectedMemberDetails.githubStats.followers}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Followers
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        href={selectedMemberDetails.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<GitHubIcon />}
                      >
                        View GitHub Profile
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Certifications Tab */}
                {tabValue === 3 && (
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Professional Certifications
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {selectedMemberDetails.certifications?.map((cert, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <VerifiedIcon color="primary" sx={{ mr: 1 }} />
                              <Typography variant="subtitle2" fontWeight="bold">
                                {cert.name}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {cert.issuer} • {cert.year}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailsDialogOpen(false)}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Team;
