import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  CircularProgress, 
  Alert, 
  Typography,
  Snackbar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

/**
 * Reusable contact form component
 * @param {Object} props
 * @param {Function} props.onSubmit - function to handle form submission
 * @param {string} props.title - form title
 * @param {string} props.recipient - name of recipient
 * @param {boolean} props.compact - whether to show a compact version of the form
 */
const ContactForm = ({ onSubmit, title, recipient, compact = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    
    try {
      await onSubmit(formData);
      setSending(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setSending(false);
      setError(err.message || 'An error occurred while sending your message.');
    }
  };
  
  const isFormValid = 
    formData.name.trim() !== '' && 
    formData.email.trim() !== '' && 
    formData.message.trim() !== '';
  
  return (
    <Box>
      {title && (
        <Typography variant={compact ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom>
          {title}
        </Typography>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={compact ? 12 : 6}>
            <TextField
              name="name"
              label="Your Name"
              fullWidth
              variant="outlined"
              size={compact ? "small" : "medium"}
              required
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={compact ? 12 : 6}>
            <TextField
              name="email"
              label="Your Email"
              fullWidth
              variant="outlined"
              size={compact ? "small" : "medium"}
              required
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="subject"
              label={`Subject${recipient ? ` (To: ${recipient})` : ''}`}
              fullWidth
              variant="outlined"
              size={compact ? "small" : "medium"}
              value={formData.subject}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="message"
              label="Message"
              fullWidth
              variant="outlined"
              size={compact ? "small" : "medium"}
              required
              multiline
              rows={compact ? 3 : 5}
              value={formData.message}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              disabled={sending || !isFormValid}
              fullWidth={compact}
            >
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Message sent successfully!"
      />
    </Box>
  );
};

export default ContactForm;
