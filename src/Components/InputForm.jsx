import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PropTypes from 'prop-types';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  CircularProgress,
  Avatar,
  Tooltip,
  IconButton,
  Container,
  Menu,
  MenuItem,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Animation keyframes
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

// Dark theme configuration
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

const formatText = (text) => {
  return text.split('\n').map((line, index) => (
    <span key={index}>
      {line.split(/(\*\*.*?\*\*)/).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
      <br />
    </span>
  ));
};

// Animated box component
const AnimatedBox = ({ children, delay }) => (
  <Box sx={{
    animation: `${fadeInUp} 0.5s ease-out forwards`,
    animationDelay: `${delay}s`,
    opacity: 0,
  }}>
    {children}
  </Box>
);
const Footer = () => (
  <Box
    component="footer"
    sx={{
      py: 3,
      px: 2,
      mt: 'auto',
      backgroundColor: (theme) =>
        theme.palette.mode === 'light'
          ? theme.palette.grey[200]
          : theme.palette.grey[800],
    }}
  >
    <Container maxWidth="sm">
      <Typography variant="body1" align="center">
        Developed with <FavoriteIcon sx={{ color: 'red', verticalAlign: 'middle' }} /> by Amrit Sundarka
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <IconButton
          color="inherit"
          href="https://www.linkedin.com/in/amrit-sundarka"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon />
        </IconButton>
        <IconButton
          color="inherit"
          href="https://github.com/Amrit02102004"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </IconButton>
        <IconButton
          color="inherit"
          href="https://amritsundarka.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LanguageIcon />
        </IconButton>
      </Box>
    </Container>
  </Box>
);
AnimatedBox.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number.isRequired,
};

// New components for Additional Info section
const RelatedTopics = ({ topics }) => (
  <Box>
    <Typography variant="h6" sx={{ mt: 2 }}>Related Topics:</Typography>
    <List>
      {topics.map((topic, index) => (
        <ListItem key={index}>
          <ListItemText primary={topic} />
        </ListItem>
      ))}
    </List>
  </Box>
);

const Resources = ({ resources }) => (
  <Box>
    <Typography variant="h6" sx={{ mt: 2 }}>Resources:</Typography>
    <List>
      {resources.map((resource, index) => (
        <ListItem key={index}>
          <ListItemText primary={resource} />
        </ListItem>
      ))}
    </List>
  </Box>
);

const FurtherStudy = ({ topics }) => (
  <Box>
    <Typography variant="h6" sx={{ mt: 2 }}>Further Study:</Typography>
    <List>
      {topics.map((topic, index) => (
        <ListItem key={index}>
          <ListItemText primary={topic} />
        </ListItem>
      ))}
    </List>
  </Box>
);

RelatedTopics.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Resources.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.string).isRequired,
};

FurtherStudy.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// Main component
const SummaryAI = ({ resetForm, setResetForm }) => {
  const [file, setFile] = useState(null);
  const [promptText, setPromptText] = useState('');
  const [checkboxes, setCheckboxes] = useState([false, false, false, false]);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [uid, setUid] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        const userUid = user.uid;
        setUid(userUid);
        localStorage.setItem('uid', userUid);
        document.cookie = `uid=${userUid}; path=/; max-age=3600`;
      } else {
        setUid(null);
        localStorage.removeItem('uid');
        document.cookie = 'uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (resetForm) {
      handleReset();
      setResetForm(false);
    }
  }, [resetForm, setResetForm]);

  const handleReset = () => {
    setFile(null);
    setPromptText('');
    setCheckboxes([false, false, false, false]);
    setResponseData(null);
    setError(null);
  };

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
    setError(null);
    try {
      setResponseData(null);
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('prompt_text', promptText);
      formData.append('checkboxes', checkboxes.map(cb => cb ? '1' : '0').join(','));

      const response = await fetch('https://airesponse.onrender.com/ai/submit/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.content || Object.keys(data.content).length === 0) {
        setError('Something went wrong. If the PDF word length is too long, it might not respond. Please try again.');
        return;
      }
      const response_id = data.response_id;
      setResponseData(data.content);

      // Send request to history endpoint if user is logged in
      if (uid) {
        await fetch('https://summarizer-ai-backend.vercel.app/history/set/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: uid,
            promptText: promptText,
            response_id: response_id
          }),
        });
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setError('Failed to submit data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();
      console.log(idToken);

      const response = await fetch('https://summarizer-ai-backend.vercel.app/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: idToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      auth.onIdTokenChanged(async (user) => {
        if (user) {
          const newToken = await user.getIdToken();
          console.log("Token refreshed:", newToken);
        }
      });

    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      handleMenuClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHistoryClick = () => {
    navigate('/history');
    handleMenuClose();
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
            Summary AI
          </Typography>
          {user ? (
            <>
              {!isMobile && (
                <>
                  <Button color="inherit" onClick={handleReset} sx={{ mx: 1 }}>New</Button>
                  <Button color="inherit" onClick={handleHistoryClick} sx={{ mx: 1 }}>History</Button>
                </>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
                  Hi, {user.displayName}
                </Typography>
                <Tooltip title={isMobile ? "Menu" : "Account"}>
                  <IconButton color="inherit" onClick={handleMenuOpen}>
                    <Avatar
                      src={user.photoURL}
                      alt={user.displayName}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {isMobile && (
                    <>
                      <MenuItem onClick={handleReset}>New</MenuItem>
                      <MenuItem onClick={handleHistoryClick}>History</MenuItem>
                    </>
                  )}
                  <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={handleSignIn}
              startIcon={<AccountCircleIcon />}
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 3, maxWidth: 800, margin: 'auto' }}>
        <AnimatedBox delay={0.1}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              Welcome to Summary AI, your advanced document analysis tool.
              To begin, please upload your PDF document and provide a specific prompt related to the content. Select the desired output options using the checkboxes below to customize your results.
              {!user && (
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                  Sign in to access your response history and manage your previous analyses.
                </Typography>
              )}
            </Typography>
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

        {error && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {responseData && (
          <>
            {responseData.important_questions && (
              <AnimatedBox delay={0.3}>
                <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
                  Most Important Questions
                </Typography>
                {responseData.important_questions.map((q, index) => (
                  <Accordion key={index} sx={{ mb: 2, backgroundColor: 'background.paper' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{formatText(q.question)}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="subtitle1">Topic: {q.topic}</Typography>
                      <Typography>{formatText(q.answer)}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AnimatedBox>
            )}

            {responseData.summary && (
              <AnimatedBox delay={0.4}>
                <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                  <Typography variant="h5" gutterBottom>
                    Summary
                  </Typography>
                  <Typography variant="h6">Main Idea:</Typography>
                  <Typography>{formatText(responseData.summary.main_idea)}</Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>Key Points:</Typography>
                  <List>
                    {responseData.summary.key_points.map((point, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={formatText(point)} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="h6" sx={{ mt: 2 }}>Conclusion:</Typography>
                  <Typography>{formatText(responseData.summary.conclusion)}</Typography>
                </Paper>
              </AnimatedBox>
            )}

            {responseData.notes && (
              <AnimatedBox delay={0.5}>
                <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                  <Typography variant="h5" gutterBottom>
                    Notes
                  </Typography>
                  <List>
                    {responseData.notes.map((note, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={formatText(note)} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </AnimatedBox>
            )}

            {responseData.additional_info && (
              <AnimatedBox delay={0.6}>
                <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                  <Typography variant="h5" gutterBottom>
                    Additional Info
                  </Typography>
                  {responseData.additional_info.related_topics && (
                    <RelatedTopics topics={responseData.additional_info.related_topics} />
                  )}
                  {responseData.additional_info.resources && (
                    <Resources resources={responseData.additional_info.resources} />
                  )}
                  {responseData.additional_info.further_study && (
                    <FurtherStudy topics={responseData.additional_info.further_study} />
                  )}
                </Paper>
              </AnimatedBox>
            )}
          </>
        )}
        <Footer/>
      </Box>
    </ThemeProvider>
  );
};

SummaryAI.propTypes = {
  resetForm: PropTypes.bool.isRequired,
  setResetForm: PropTypes.func.isRequired,
};

export default SummaryAI;