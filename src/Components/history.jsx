// Components/History.jsx
import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
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

const History = () => {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

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

  const handleOpenResponse = (responseId) => {
    navigate(`/response/${responseId}`);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Summary AI
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')} sx={{ mx: 1 }}>New</Button>
          <Button color="inherit" sx={{ mx: 1 }}>History</Button>
          {user && (
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
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 3, maxWidth: 800, margin: 'auto' }} className="history-container">
        <Typography variant="h4" gutterBottom>Your History</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {history.map((item, index) => (
              <Paper key={index} elevation={3} sx={{ mb: 2, p: 2 }} className="history-item">
                <ListItem 
                  alignItems="flex-start" 
                  button 
                  onClick={() => handleOpenResponse(item.response_id)}
                >
                  <ListItemText
                    primary={item.prompt_text}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Created at: {new Date(item.created_at).toLocaleString()}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default History;