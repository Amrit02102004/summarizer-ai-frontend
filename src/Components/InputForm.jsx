import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
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

// Define keyframes
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

// Define theme
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
          animation: `${keyframes`
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          `} 3s ease infinite`,
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

AnimatedBox.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number.isRequired,
};

const SummaryAI = () => {
  const [file, setFile] = useState(null);
  const [websiteLink, setWebsiteLink] = useState('');
  const [promptText, setPromptText] = useState('');
  const [checkboxes, setCheckboxes] = useState([false, false, false, false]);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleCheckboxChange = (index) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index] = !newCheckboxes[index];
    setCheckboxes(newCheckboxes);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('website_link', websiteLink);
      formData.append('prompt_text', promptText);
      formData.append('checkboxes', checkboxes.map(cb => cb ? '1' : '0').join(','));
  
      const response = await axios.post('http://localhost:8000/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponseData(response.data);
    } catch (error) {
      console.error('Error submitting data:', error);
    } finally {
      setLoading(false);
    }
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
              value={websiteLink}
              onChange={(e) => setWebsiteLink(e.target.value)}
            />
            <TextField 
              fullWidth 
              variant="outlined" 
              placeholder="Enter one-line prompt (specific topic)"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
          </Paper>
        </AnimatedBox>

        <AnimatedBox delay={0.2}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <FormControlLabel 
              control={<Checkbox checked={checkboxes[0]} onChange={() => handleCheckboxChange(0)} />} 
              label="Most Important Q" 
            />
            <FormControlLabel 
              control={<Checkbox checked={checkboxes[1]} onChange={() => handleCheckboxChange(1)} />} 
              label="Summary" 
            />
            <FormControlLabel 
              control={<Checkbox checked={checkboxes[2]} onChange={() => handleCheckboxChange(2)} />} 
              label="Notes" 
            />
            <FormControlLabel 
              control={<Checkbox checked={checkboxes[3]} onChange={() => handleCheckboxChange(3)} />} 
              label="Additional Info" 
            />
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
              {responseData.important_questions.map((q, index) => (
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
                <Typography>{responseData.additional_info}</Typography>
              </Paper>
            </AnimatedBox>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default SummaryAI;