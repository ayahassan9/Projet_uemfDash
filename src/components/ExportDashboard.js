import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Paper,
  Stack,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';

// Icons
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';

/**
 * Component pour exporter le tableau de bord en PDF ou image
 * @param {Object} props
 * @param {React.RefObject} props.targetRef - Référence vers l'élément à exporter
 */
const ExportDashboard = ({ targetRef }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [progress, setProgress] = useState(0);
  const [exportSuccess, setExportSuccess] = useState(null);
  const [options, setOptions] = useState({
    includeFilters: true,
    includeHeader: true,
    includeDatetime: true,
    highQuality: true
  });

  const handleOpen = () => {
    setOpen(true);
    setExportSuccess(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOptionChange = (event) => {
    const { name, checked } = event.target;
    setOptions({
      ...options,
      [name]: checked
    });
  };

  const simulateProgress = () => {
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(prevProgress + diff, 100);
      });
    }, 200);

    return timer;
  };

  const handleExport = async () => {
    if (!targetRef.current) {
      setExportSuccess({
        status: 'error',
        message: 'Élément cible non trouvé. Réessayez ultérieurement.'
      });
      return;
    }

    setLoading(true);
    const progressTimer = simulateProgress();

    try {
      // Importation dynamique pour réduire la taille du bundle initial
      if (exportFormat === 'pdf') {
        const html2pdf = (await import('html2pdf.js')).default;
        
        const opt = {
          margin: 10,
          filename: `dashboard-export-${new Date().toISOString().slice(0, 10)}.pdf`,
          image: { type: 'jpeg', quality: options.highQuality ? 1.0 : 0.8 },
          html2canvas: { scale: options.highQuality ? 2 : 1 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Attendre la simulation pour démonstration 
        // Dans une application réelle, cette partie n'est pas nécessaire
        await new Promise(resolve => setTimeout(resolve, 1500));

        await html2pdf().from(targetRef.current).set(opt).save();
        
        setExportSuccess({
          status: 'success',
          message: 'Dashboard exporté avec succès en PDF'
        });
      } else {
        // Export en image
        const { toPng } = await import('html-to-image');
        
        const dataUrl = await toPng(targetRef.current, { 
          quality: options.highQuality ? 1.0 : 0.8,
          pixelRatio: options.highQuality ? 2 : 1
        });
        
        const link = document.createElement('a');
        link.download = `dashboard-export-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = dataUrl;
        link.click();

        setExportSuccess({
          status: 'success',
          message: 'Dashboard exporté avec succès en image'
        });
      }
    } catch (error) {
      console.error('Error during export:', error);
      setExportSuccess({
        status: 'error',
        message: 'Une erreur est survenue lors de l\'exportation'
      });
    } finally {
      clearInterval(progressTimer);
      setProgress(100);
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Exporter le dashboard">
        <IconButton color="primary" onClick={handleOpen}>
          <FileDownloadIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={loading ? undefined : handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Exporter le dashboard
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={loading}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {exportSuccess && (
            <Alert 
              severity={exportSuccess.status} 
              sx={{ mb: 2 }}
              action={
                exportSuccess.status === 'success' && (
                  <Button 
                    color="inherit" 
                    size="small"
                    onClick={handleClose}
                  >
                    Fermer
                  </Button>
                )
              }
            >
              {exportSuccess.message}
            </Alert>
          )}

          <Typography variant="subtitle1" gutterBottom>
            Format d'exportation
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                flex: 1, 
                cursor: 'pointer',
                bgcolor: exportFormat === 'pdf' ? 'action.selected' : 'transparent',
                borderColor: exportFormat === 'pdf' ? 'primary.main' : 'divider'
              }}
              onClick={() => setExportFormat('pdf')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PictureAsPdfIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">PDF</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Document de haute qualité, idéal pour l'impression
              </Typography>
            </Paper>

            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                flex: 1, 
                cursor: 'pointer',
                bgcolor: exportFormat === 'image' ? 'action.selected' : 'transparent',
                borderColor: exportFormat === 'image' ? 'primary.main' : 'divider'
              }}
              onClick={() => setExportFormat('image')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImageIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="body1">Image</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Format PNG, parfait pour le partage numérique
              </Typography>
            </Paper>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            Options d'exportation
          </Typography>

          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={options.includeHeader} 
                  onChange={handleOptionChange}
                  name="includeHeader"
                  disabled={loading}
                />
              }
              label="Inclure l'en-tête du dashboard"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={options.includeFilters} 
                  onChange={handleOptionChange}
                  name="includeFilters"
                  disabled={loading}
                />
              }
              label="Inclure les filtres appliqués"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={options.includeDatetime} 
                  onChange={handleOptionChange}
                  name="includeDatetime"
                  disabled={loading}
                />
              }
              label="Ajouter la date et l'heure d'exportation"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={options.highQuality} 
                  onChange={handleOptionChange}
                  name="highQuality"
                  disabled={loading}
                />
              }
              label="Haute qualité (fichier plus volumineux)"
            />
          </Stack>

          {loading && (
            <Box sx={{ mt: 3, width: '100%' }}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Génération de l'export en cours...
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 8, borderRadius: 5 }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleClose} 
            color="inherit"
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={handleExport}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : (
              exportFormat === 'pdf' ? <PictureAsPdfIcon /> : <ImageIcon />
            )}
          >
            {loading ? 'Exportation...' : 'Exporter'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportDashboard;
