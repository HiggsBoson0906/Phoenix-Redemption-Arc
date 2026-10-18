import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Profile from './pages/Profile/Profile';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import Settings from './pages/Settings/Settings';
import DSAPage from './pages/DSA/DSAPage';
import CompanyPrepPage from './pages/CompanyPrep/CompanyPrepPage';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Routes>
          {/* Main DSA Platform (Direct landing) */}
          <Route path="/" element={<DSAPage defaultTab="dp" />} />
          <Route path="/dsa" element={<DSAPage defaultTab="dp" />} />
          <Route path="/dsa/:sheetSlug" element={<DSAPage />} />
          
          {/* Backwards-compatible DSA routes */}
          <Route path="/questions" element={<DSAPage defaultTab="dp" />} />
          <Route path="/dashboard" element={<DSAPage defaultTab="dp" />} />
          <Route path="/dp" element={<DSAPage defaultTab="dp" />} />
          <Route path="/tree" element={<DSAPage defaultTab="tree" />} />
          <Route path="/graph" element={<DSAPage defaultTab="graph" />} />

          {/* Company-Wise Preparation */}
          <Route path="/company-prep" element={<CompanyPrepPage />} />
          <Route path="/company-prep/:companySlug" element={<CompanyPrepPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* User Profile with LeetCode stats & Heatmap */}
          <Route path="/profile" element={<Profile />} />

          {/* Dedicated Security / Password Change (Protected) */}
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/security" element={<Navigate to="/change-password" replace />} />

          {/* Settings Redirect to Profile */}
          <Route path="/settings" element={<Navigate to="/profile" replace />} />

          {/* Fallback redirect to DSA */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
