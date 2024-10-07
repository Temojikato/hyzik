// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import ReyvateilSelection from './components/ReyvateilSelection';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { CustomThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CustomThemeProvider>
        <Router>
          <Routes>
            {/* Protected Home Route */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />

            {/* Protected Reyvateil Selection Route */}
            <Route
              path="/select-reyvateil"
              element={
                <PrivateRoute>
                  <ReyvateilSelection />
                </PrivateRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </CustomThemeProvider>
    </AuthProvider>
  );
};

export default App;
