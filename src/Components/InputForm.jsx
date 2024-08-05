import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { initializeApp } from 'firebase/app';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  CircularProgress,
  Avatar,
  Tooltip,
  IconButton,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

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

// Function to convert Markdown-style text to JSX
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
const SummaryAI = () => {
  const [file, setFile] = useState(null);
  const [promptText, setPromptText] = useState('');
  const [checkboxes, setCheckboxes] = useState([false, false, false, false]);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [uid, setUid] = useState(null);

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
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Summary AI
          </Typography>
          {user ? (
            <>
              <Button color="inherit" sx={{ mx: 1 }}>New</Button>
              <Button color="inherit" sx={{ mx: 1 }}>History</Button>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                  Hi, {user.displayName}
                </Typography>
                <Avatar
                  src={user.photoURL}
                  alt={user.displayName}
                  sx={{ mr: 1 }}
                />
                <Tooltip title="Sign Out">
                  <IconButton color="inherit" onClick={handleSignOut}>
                    <ArrowDropDownIcon />
                  </IconButton>
                </Tooltip>
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
  Welcome to Summary AI, your advanced document analysis tool. <br></br>
  To begin, please upload your PDF document and provide a specific prompt related to the content. Select the desired output options using the checkboxes below to customize your results.
  {!user && (
    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
      Sign in to access your response history and manage your previous analyses.<br></br>
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

            {responseData.additional_info && (
              <AnimatedBox delay={0.6}>
                <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                  <Typography variant="h5" gutterBottom>
                    Additional Info
                  </Typography>
                  <RelatedTopics topics={responseData.additional_info.related_topics} />
                  <Resources resources={responseData.additional_info.resources} />
                  <FurtherStudy topics={responseData.additional_info.further_study} />
                </Paper>
              </AnimatedBox>
            )}
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default SummaryAI;