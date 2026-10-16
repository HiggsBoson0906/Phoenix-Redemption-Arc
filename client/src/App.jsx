import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings/Settings';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Routes>
          {/* Main Questions Sheets (Accessible to everyone) */}
          <Route path="/" element={<Dashboard defaultTab="dp" />} />
          <Route path="/questions" element={<Dashboard defaultTab="dp" />} />
          <Route path="/dashboard" element={<Dashboard defaultTab="dp" />} />
          <Route path="/dp" element={<Dashboard defaultTab="dp" />} />
          <Route path="/tree" element={<Dashboard defaultTab="tree" />} />
          <Route path="/graph" element={<Dashboard defaultTab="graph" />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* User Settings (Protected) */}
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
