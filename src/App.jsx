import PropTypes from 'prop-types';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SummaryAI from './Components/InputForm';
import History from './Components/history';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const uid = localStorage.getItem('uid');
  if (!uid) {
    return <Navigate to="/" replace />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  const [resetForm, setResetForm] = useState(false);

  const handleResetForm = () => {
    setResetForm(true);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SummaryAI resetForm={resetForm} setResetForm={setResetForm} />} />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <History onNewClick={handleResetForm} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;