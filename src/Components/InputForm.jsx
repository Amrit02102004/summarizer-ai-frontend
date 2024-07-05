import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  Box, 
  Typography, 
  TextField, 
  Checkbox, 
  FormControlLabel, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';
import { keyframes } from '@emotion/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const gradientMove = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#80cbc4',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%, transparent)',
          backgroundSize: '400% 400%',
          animation: `${gradientMove} 3s ease infinite`,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 30px 0 rgba(0,0,0,0.2)',
          },
        },
      },
    },
  },
});

const AnimatedBox = ({ children, delay }) => (
  <Box sx={{
    animation: `${fadeInUp} 0.5s ease-out forwards`,
    animationDelay: `${delay}s`,
    opacity: 0,
  }}>
    {children}
  </Box>
);

const SummaryAI = ({ sampleData }) => {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [prompt, setPrompt] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setResponseData(sampleData);
      setLoading(false);
    }, 2000);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ padding: 3, maxWidth: 800, margin: 'auto' }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
          Summary AI
        </Typography>
        
        <AnimatedBox delay={0.1}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mr: 2 }}
              >
                Upload File
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                />
              </Button>
              {file && (
                <Typography variant="body2">
                  {file.name}
                </Typography>
              )}
            </Box>
            <TextField 
              fullWidth 
              variant="outlined" 
              placeholder="Or enter website link"
              sx={{ mb: 2 }}
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <TextField 
              fullWidth 
              variant="outlined" 
              placeholder="Enter one-line prompt (specific topic)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </Paper>
        </AnimatedBox>

        <AnimatedBox delay={0.2}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <FormControlLabel control={<Checkbox />} label="Most Important Q" />
            <FormControlLabel control={<Checkbox />} label="Summary" />
            <FormControlLabel control={<Checkbox />} label="Notes" />
            <FormControlLabel control={<Checkbox />} label="Additional Info" />
          </Paper>
        </AnimatedBox>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>

        {responseData && (
          <>
            <AnimatedBox delay={0.3}>
              <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
                Most Important Questions
              </Typography>
              {responseData.importantQuestions.map((q, index) => (
                <Accordion key={index} sx={{ mb: 2, backgroundColor: 'background.paper' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{q.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{q.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </AnimatedBox>

            <AnimatedBox delay={0.4}>
              <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Summary
                </Typography>
                <Typography>{responseData.summary}</Typography>
              </Paper>
            </AnimatedBox>

            <AnimatedBox delay={0.5}>
              <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Notes
                </Typography>
                <List>
                  {responseData.notes.map((note, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={note} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </AnimatedBox>

            <AnimatedBox delay={0.6}>
              <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Additional Info
                </Typography>
                <Typography>{responseData.additionalInfo}</Typography>
              </Paper>
            </AnimatedBox>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

SummaryAI.propTypes = {
  sampleData: PropTypes.shape({
    importantQuestions: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string.isRequired,
        answer: PropTypes.string.isRequired,
      })
    ).isRequired,
    summary: PropTypes.string.isRequired,
    notes: PropTypes.arrayOf(PropTypes.string).isRequired,
    additionalInfo: PropTypes.string.isRequired,
  }).isRequired,
};

export default SummaryAI;