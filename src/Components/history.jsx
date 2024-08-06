import PropTypes from 'prop-types';
import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Menu,
  MenuItem,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './History.css';

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
});

const History = ({ onNewClick }) => {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchHistory(user.uid);
      } else {
        setLoading(false);
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate, auth]);

  const fetchHistory = async (uid) => {
    try {
      const response = await fetch(`https://summarizer-ai-backend.vercel.app/history/get/${uid}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      setHistory(data.history);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('uid');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleOpenResponse = async (responseId) => {
    try {
      const response = await fetch(`https://summarizer-ai-backend.vercel.app/history/get/response/${responseId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }
      const data = await response.json();
      setSelectedResponse(data.response);
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNewClick = () => {
    onNewClick();
    navigate('/');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
            Summary AI
          </Typography>
          {user && (
            <>
              {!isMobile && (
                <>
                  <Button color="inherit" onClick={handleNewClick} sx={{ mx: 1 }}>New</Button>
                  <Button color="inherit" sx={{ mx: 1 }}>History</Button>
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
                      <MenuItem onClick={handleNewClick}>New</MenuItem>
                      <MenuItem onClick={handleMenuClose}>History</MenuItem>
                    </>
                  )}
                  <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                </Menu>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 3, maxWidth: '100%', margin: 'auto' }} className="history-container">
        <Typography variant="h4" gutterBottom>Your History</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {history.map((item, index) => (
              <Paper key={index} elevation={3} sx={{ mb: 2 }} className="history-item">
                <ListItem
                  alignItems="center"
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                  onClick={() => handleOpenResponse(item.response_id)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ minWidth: 30, mr: 2 }}>
                      {index + 1}.
                    </Typography>
                    <ListItemText
                      primary={item.prompt_text}
                      secondary={formatDate(item.created_at)}
                    />
                  </Box>
                  <IconButton edge="end" aria-label="open response">
                    <ArrowForwardIosIcon />
                  </IconButton>
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
        {selectedResponse && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Selected Response</Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Most Important Questions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {selectedResponse.important_questions.map((q, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="h6">{formatText(q.question)}</Typography>
                    <Typography variant="subtitle1">Topic: {q.topic}</Typography>
                    <Typography>{formatText(q.answer)}</Typography>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Summary</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6">Main Idea:</Typography>
                <Typography>{formatText(selectedResponse.summary.main_idea)}</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Key Points:</Typography>
                <List>
                  {selectedResponse.summary.key_points.map((point, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={formatText(point)} />
                    </ListItem>
                  ))}
                </List>
                <Typography variant="h6" sx={{ mt: 2 }}>Conclusion:</Typography>
                <Typography>{formatText(selectedResponse.summary.conclusion)}</Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Notes</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {selectedResponse.notes.map((note, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={formatText(note)} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            {selectedResponse.additional_info && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Additional Info</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h6">Related Topics:</Typography>
                  <List>
                    {selectedResponse.additional_info.related_topics.map((topic, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={topic} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="h6">Resources:</Typography>
                  <List>
                    {selectedResponse.additional_info.resources.map((resource, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={resource} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="h6">Further Study:</Typography>
                  <List>
                    {selectedResponse.additional_info.further_study.map((topic, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={topic} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

History.propTypes = {
  onNewClick: PropTypes.func.isRequired,
};

export default History;