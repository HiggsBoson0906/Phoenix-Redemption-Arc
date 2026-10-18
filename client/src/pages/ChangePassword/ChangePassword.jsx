import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import * as authService from '../../services/authService.js';
import {
  Lock,
  Flame,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  EyeOff,
  Shield,
  Key,
  Sun,
  Moon,
  Terminal,
  UserCheck
} from 'lucide-react';
import './ChangePassword.css';

// ─── Password Strength Helper ───────────────────────────────────────────
function calcStrength(val) {
  let s = 0;
  if (val.length > 5) s++;
  if (val.length >= 8) s++;
  if (/[A-Z]/.test(val)) s++;
  if (/[0-9]/.test(val)) s++;
  if (/[^A-Za-z0-9]/.test(val)) s++;
  return Math.min(s, 4);
}

const strengthColors = ['', '#f87171', '#fbbf24', '#34d399', '#60a5fa'];
const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

function StrengthMeter({ password }) {
  if (!password) return null;
  const s = calcStrength(password);
  return (
    <div className="strength-meter">
      <div className="strength-bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="strength-bar"
            style={{
              backgroundColor: i <= Math.max(1, s) ? strengthColors[s] : 'rgba(255,255,255,0.1)'
            }}
          />
        ))}
      </div>
      <span className="strength-label" style={{ color: strengthColors[s] }}>
        {strengthLabels[s] || 'Weak'}
      </span>
    </div>
  );
}

// ─── Password Input Field ────────────────────────────────────────────────
function PasswordInput({ id, label, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="security-form-group">
      <label htmlFor={id}>{label}</label>
      <div className="security-input-wrap">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete || 'current-password'}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="security-eye-btn"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const [passwordSet, setPasswordSet] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const hasPassword = user?.hasPassword === true || passwordSet;

  // Handle Set Password (for Google users without password)
  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.setPassword({
        password: newPassword,
        confirmPassword,
      });

      if (!data.success) {
        setError(data.message || 'Failed to set password.');
        return;
      }

      setPasswordSet(true);
      setSuccessMsg(data.message || 'Password created successfully! You can now log in with either Google or email & password.');
      if (updateUser) {
        updateUser({ hasPassword: true, authProvider: 'both' });
      }
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Change Password (for users with existing password)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (currentPassword === newPassword) {
      setError('New password cannot be the same as the current password.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!data.success) {
        setError(data.message || 'Failed to change password.');
        return;
      }

      setSuccessMsg(data.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="security-page">
      {/* ── Top Header ── */}
      <header className="security-header">
        <div className="security-header-inner">
          <Link to="/" className="security-brand">
            <div className="terminal-window-dots">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
            </div>
            <div className="brand-icon-wrap" style={{ width: 32, height: 32 }}>
              <Flame size={18} className="brand-icon" />
            </div>
            <span className="brand-title">Phoenix Odyssey</span>
            <span className="terminal-prompt-badge">
              <Terminal size={11} />
              <span>bash:~/security</span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Terminal Dark Mode'}
            >
              {isDark ? <Sun size={17} style={{ color: '#ffbd2e' }} /> : <Moon size={17} style={{ color: '#0969da' }} />}
            </button>

            <button onClick={() => navigate('/profile')} className="security-back-btn">
              <ArrowLeft size={16} />
              <span>Back to Profile</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="security-container">
        <div className="security-card">
          <div className="security-card-header">
            <div className="security-header-badge">
              <Shield size={24} color="var(--accent)" />
            </div>
            <h1>Password & Security</h1>
            <p className="security-subtitle">
              {hasPassword
                ? 'Update your account password to keep your progress and account safe.'
                : 'Set a password to enable email & password login alongside Google.'}
            </p>
          </div>

          <div className="security-card-body">
            {successMsg && (
              <div className="security-alert success">
                <CheckCircle size={20} className="alert-icon" />
                <div>
                  <strong>Success!</strong>
                  <p style={{ margin: '4px 0 0', fontSize: 13 }}>{successMsg}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="security-alert error">
                <AlertCircle size={20} className="alert-icon" />
                <div>
                  <strong>Error</strong>
                  <p style={{ margin: '4px 0 0', fontSize: 13 }}>{error}</p>
                </div>
              </div>
            )}

            {!hasPassword ? (
              // Form for Google user without password
              <form onSubmit={handleSetPassword}>
                <div className="security-alert info">
                  <Info size={20} className="alert-icon" />
                  <div>
                    <strong>Google Account Connected</strong>
                    <p style={{ margin: '4px 0 0', fontSize: 13 }}>
                      You originally authenticated via Google ({user?.email}). Create a password below so you can sign in directly with your email and password whenever you want.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <PasswordInput
                    id="sp-new"
                    label="Choose a New Password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                  />
                  <StrengthMeter password={newPassword} />
                </div>

                <div style={{ marginTop: 16 }}>
                  <PasswordInput
                    id="sp-confirm"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="security-submit-btn"
                >
                  {loading ? 'Setting Password...' : 'Create Password'}
                </button>
              </form>
            ) : (
              // Form for existing password change
              <form onSubmit={handleChangePassword}>
                <PasswordInput
                  id="cp-current"
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                />

                <div style={{ marginTop: 16 }}>
                  <PasswordInput
                    id="cp-new"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                  />
                  <StrengthMeter password={newPassword} />
                </div>

                <div style={{ marginTop: 16 }}>
                  <PasswordInput
                    id="cp-confirm"
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="security-submit-btn"
                >
                  {loading ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            )}

            <div className="security-footer-links">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="security-secondary-link"
              >
                ← Return to Profile
              </button>
              <button
                type="button"
                onClick={() => navigate('/dsa')}
                className="security-secondary-link"
              >
                Go to Problem Sheets →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
