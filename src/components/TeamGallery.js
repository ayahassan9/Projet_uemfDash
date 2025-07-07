import React, { useState } from 'react';
import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
  Modal,
  IconButton,
  Fab,
  useMediaQuery,
  useTheme,
  Paper
} from '@mui/material';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * Component to display a gallery of team photos with lightbox functionality
 * @param {Object} props
 * @param {Array} props.images - List of image objects with src, alt, and caption properties
 * @param {string} props.title - Gallery title
 */
const TeamGallery = ({ images = [], title = "Team Gallery" }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  
  const handleOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  
  // Calculate cols based on screen size
  const getCols = () => {
    if (isMobile) return 2;
    if (isMedium) return 3;
    return 4;
  };
  
  if (!images || images.length === 0) {
    return null;
  }
  
  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      
      <Paper 
        elevation={0} 
        variant="outlined"
        sx={{ p: 2, borderRadius: 2 }}
      >
        <ImageList cols={getCols()} gap={8}>
          {images.map((image, index) => (
            <ImageListItem 
              key={index}
              onClick={() => handleOpen(index)}
              sx={{ 
                cursor: 'pointer',
                borderRadius: 1,
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: 3,
                  '& img': {
                    transform: 'scale(1.05)',
                  },
                },
              }}
            >
              <img
                src={image.src}
                alt={image.alt || `Team photo ${index + 1}`}
                loading="lazy"
                style={{ 
                  transition: 'transform 0.3s ease',
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Paper>
      
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box sx={{ 
          position: 'relative', 
          maxWidth: '90vw', 
          maxHeight: '90vh',
          outline: 'none',
        }}>
          <IconButton
            sx={{
              position: 'absolute',
              top: -16,
              right: -16,
              backgroundColor: 'background.paper',
              zIndex: 1,
              '&:hover': { backgroundColor: 'action.hover' },
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'background.paper',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 24,
            }}
          >
            <Box 
              sx={{ 
                height: '70vh',
                maxHeight: 600,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src={images[currentIndex].src}
                alt={images[currentIndex].alt || `Team photo ${currentIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            
            {images[currentIndex].caption && (
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="body2">
                  {images[currentIndex].caption}
                </Typography>
              </Box>
            )}
          </Box>
          
          {images.length > 1 && (
            <>
              <Fab
                size="small"
                color="default"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: -20,
                  transform: 'translateY(-50%)',
                }}
                onClick={handlePrev}
              >
                <ArrowBackIcon />
              </Fab>
              
              <Fab
                size="small"
                color="default"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: -20,
                  transform: 'translateY(-50%)',
                }}
                onClick={handleNext}
              >
                <ArrowForwardIcon />
              </Fab>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default TeamGallery;
