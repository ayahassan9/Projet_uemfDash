import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Card,
  useTheme,
  Fab,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';

// Icons
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ChatIcon from '@mui/icons-material/Chat';

/**
 * EmailChatBot - A component that helps users generate well-formatted emails
 * based on their general ideas or requests.
 */
const EmailChatBot = ({ teamMembers, onEmailGenerated, onClose }) => {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Bonjour ! Je suis l'assistant de rédaction d'emails. Décrivez-moi votre idée ou requête, et je vous aiderai à rédiger un email professionnel pour l'équipe.",
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(teamMembers?.[0] || null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle closing the dialog
  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: userInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setLoading(true);
    
    // Simulate AI processing with timeout
    setTimeout(() => {
      generateBotResponse(userInput);
    }, 1500);
  };

  // Generate bot response
  const generateBotResponse = (userMessage) => {
    // In a real app, you would call an AI API here (OpenAI, etc.)
    // For now, we'll mock the email generation

    // Simple email structure based on user input
    const subject = "Demande concernant le projet Euromed Analytics";
    const greeting = `Bonjour ${selectedTeamMember?.name},`;
    
    const body = `J'espère que ce message vous trouve bien.\n\nJe vous contacte au sujet du projet Euromed Analytics.\n\n${userMessage}\n\nMerci d'avance pour votre retour sur ce sujet.`;
    
    const conclusion = "Je reste à votre disposition pour toute information complémentaire.\n\nCordialement,\n[Votre nom]";
    
    const emailContent = {
      to: selectedTeamMember?.links?.email?.replace('mailto:', '') || '',
      subject: subject,
      body: `${greeting}\n\n${body}\n\n${conclusion}`
    };
    
    setGeneratedEmail(emailContent);
    
    const botResponse = {
      id: messages.length + 2,
      sender: 'bot',
      text: "Voici l'email que j'ai généré pour vous. Vous pouvez le modifier ou le copier directement.",
      timestamp: new Date(),
      isEmail: true,
      email: emailContent
    };
    
    setMessages(prev => [...prev, botResponse]);
    setLoading(false);
    
    if (onEmailGenerated) {
      onEmailGenerated(emailContent);
    }
  };

  // Handle pressing Enter key to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Copy email to clipboard
  const handleCopyEmail = () => {
    if (!generatedEmail) return;
    
    const emailText = `À: ${generatedEmail.to}\nObjet: ${generatedEmail.subject}\n\n${generatedEmail.body}`;
    
    navigator.clipboard.writeText(emailText).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      },
      (err) => console.error('Could not copy text: ', err)
    );
  };

  // Open email in default email client
  const handleOpenEmail = () => {
    if (!generatedEmail) return;
    
    const mailtoLink = `mailto:${generatedEmail.to}?subject=${encodeURIComponent(generatedEmail.subject)}&body=${encodeURIComponent(generatedEmail.body)}`;
    window.location.href = mailtoLink;
  };

  // Render email preview card
  const renderEmailPreview = (email) => {
    return (
      <Card variant="outlined" sx={{ p: 2, my: 1, bgcolor: 'background.default' }}>
        <Typography variant="body2" gutterBottom>
          <strong>À :</strong> {email.to}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Objet :</strong> {email.subject}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography
          variant="body2" 
          component="pre"
          sx={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            m: 0
          }}
        >
          {email.body}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyEmail}
          >
            Copier
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<EmailIcon />}
            onClick={handleOpenEmail}
          >
            Ouvrir dans le client email
          </Button>
        </Box>
      </Card>
    );
  };

  // Render chat message
  const renderMessage = (message) => {
    const isBot = message.sender === 'bot';
    
    return (
      <ListItem
        key={message.id}
        alignItems="flex-start"
        sx={{
          flexDirection: isBot ? 'row' : 'row-reverse',
          mb: 2
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: isBot ? 'primary.main' : 'secondary.main',
            }}
          >
            {isBot ? <SmartToyIcon /> : <PersonIcon />}
          </Avatar>
        </ListItemAvatar>
        
        <ListItemText
          primary={
            <Typography 
              variant="body1" 
              component="div"
              sx={{ 
                bgcolor: isBot ? 'primary.50' : 'secondary.50',
                color: 'text.primary',
                p: 2,
                borderRadius: 2,
                maxWidth: '80%',
                marginLeft: isBot ? 0 : 'auto',
                marginRight: isBot ? 'auto' : 0,
              }}
            >
              {message.text}
              {message.isEmail && renderEmailPreview(message.email)}
            </Typography>
          }
          secondary={
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                textAlign: isBot ? 'left' : 'right',
                mt: 0.5
              }}
            >
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          }
          disableTypography
          sx={{
            m: 0,
            p: 0,
            width: '100%'
          }}
        />
      </ListItem>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center' }}>
        <SmartToyIcon sx={{ mr: 1 }} />
        Assistant Email
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
        {/* Messages List */}
        <List sx={{ 
          p: 2, 
          flexGrow: 1, 
          overflow: 'auto',
          bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'
        }}>
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </List>
        
        {/* Message Input */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <TextField
            fullWidth
            placeholder="Décrivez votre idée ou requête ici..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            multiline
            rows={2}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || loading}
                >
                  Envoyer
                </Button>
              ),
              sx: { alignItems: 'flex-end' }
            }}
          />
        </Paper>
      </DialogContent>
      
      {/* Success notification */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Email copié dans le presse-papiers
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

/**
 * ChatBotFab - A floating action button to open the EmailChatBot
 */
export const ChatBotFab = ({ onClick }) => {
  return (
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
};

export default EmailChatBot;
