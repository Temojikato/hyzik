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
import { CampaignProvider } from './contexts/CampaignContext';
import AdminRoute from './components/AdminRoute';
import AdminPortal from './components/AdminPortal';
import AdminPlayerPreview from './components/AdminPlayerPreview';
import PrivateMessageCenter from './components/PrivateMessageCenter';
import TranslatorPreview from './components/TranslatorPreview';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CustomThemeProvider>
        <CampaignProvider>
          <Router>
            <PrivateMessageCenter />
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
            <Route path="/admin" element={<PrivateRoute><AdminRoute><AdminPortal /></AdminRoute></PrivateRoute>} />
            <Route path="/admin/players/:playerId" element={<PrivateRoute><AdminRoute><AdminPlayerPreview /></AdminRoute></PrivateRoute>} />
            {process.env.NODE_ENV === 'development' && <Route path="/__design/admin" element={<AdminPortal previewMode />} />}
            {process.env.NODE_ENV === 'development' && <Route path="/__design/translator" element={<TranslatorPreview />} />}
            </Routes>
          </Router>
        </CampaignProvider>
      </CustomThemeProvider>
    </AuthProvider>
  );
};

export default App;
