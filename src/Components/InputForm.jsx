import  { useState } from 'react';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
        },
      },
    },
  },
});

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
    // Simulating API call with setTimeout
    setTimeout(() => {
      setResponseData(sampleData);
      setLoading(false);
    }, 2000); // Simulating a 2-second delay
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ padding: 3, maxWidth: 800, margin: 'auto' }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
          Summary AI
        </Typography>
        
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

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <FormControlLabel control={<Checkbox />} label="Most Important Q" />
          <FormControlLabel control={<Checkbox />} label="Summary" />
          <FormControlLabel control={<Checkbox />} label="Notes" />
          <FormControlLabel control={<Checkbox />} label="Additional Info" />
        </Paper>

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

            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Summary
              </Typography>
              <Typography>{responseData.summary}</Typography>
            </Paper>

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

            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Additional Info
              </Typography>
              <Typography>{responseData.additionalInfo}</Typography>
            </Paper>
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