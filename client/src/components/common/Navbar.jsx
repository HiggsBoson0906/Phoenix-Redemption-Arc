import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import {
  Flame,
  Code2,
  Building2,
  Menu,
  X,
  LogOut,
  Settings,
  LogIn,
  Sun,
  Moon,
  Terminal
} from 'lucide-react';
import '../../pages/Home/Home.css';

const NAV_ITEMS = [
  {
    id: 'dsa',
    label: 'DSA Sheets',
    path: '/dsa',
    shortcut: 'Alt+1',
    icon: Code2,
    matcher: (pathname) =>
      pathname === '/' ||
      pathname.startsWith('/dsa') ||
      pathname === '/questions' ||
      pathname === '/dp' ||
      pathname === '/tree' ||
      pathname === '/graph' ||
      pathname === '/dashboard',
  },
  {
    id: 'company-prep',
    label: 'Company Wise',
    path: '/company-prep',
    shortcut: 'Alt+2',
    icon: Building2,
    matcher: (pathname) => pathname.startsWith('/company-prep'),
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, loading } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Global Keyboard Shortcuts: Alt+1 for DSA Sheets, Alt+2 for Company Wise
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is actively typing in an input or textarea
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      // Check Alt+1 or Alt+2
      if (e.altKey && (e.key === '1' || e.code === 'Digit1')) {
        e.preventDefault();
        navigate('/dsa');
      } else if (e.altKey && (e.key === '2' || e.code === 'Digit2')) {
        e.preventDefault();
        navigate('/company-prep');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/', { replace: true });
  };

  const currentPath = location.pathname + location.search;
  const isCompanySection = location.pathname.startsWith('/company-prep');

  return (
    <nav className="top-navbar">
      <div className="nav-header-row">
        {/* Brand with Git Bash Terminal Cue */}
        <Link to="/dsa" className="nav-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="terminal-window-dots" title="Git Bash Terminal UI">
            <span className="terminal-dot red" />
            <span className="terminal-dot yellow" />
            <span className="terminal-dot green" />
          </div>
          <div className="brand-icon-wrap">
            <Flame size={20} className="brand-icon" />
          </div>
          <span className="brand-title">Phoenix Odyssey</span>
          <span className="terminal-prompt-badge" style={{ minWidth: 108, justifyContent: 'center' }}>
            <Terminal size={11} />
            <span>bash:~/{isCompanySection ? 'company' : 'dsa'}</span>
          </span>
        </Link>

        {/* Mobile Header Actions: Hidden on Desktop */}
        <div className="mobile-nav-actions">
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Terminal Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Terminal Dark Mode'}
          >
            {isDark ? <Sun size={17} style={{ color: '#ffbd2e' }} /> : <Moon size={17} style={{ color: '#0969da' }} />}
          </button>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Navigation Tabs (DSA Sheets & Company Wise only) with Alt Shortcuts */}
      <div className={`nav-tabs ${mobileOpen ? 'mobile-open' : ''}`}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.matcher(location.pathname);

          return (
            <button
              key={item.id}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                setMobileOpen(false);
                navigate(item.path);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '0.92rem',
                fontWeight: isActive ? '700' : '600',
              }}
              title={`Open ${item.label} (${item.shortcut})`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              <kbd className="nav-shortcut-kbd">{item.shortcut}</kbd>
            </button>
          );
        })}

        {/* Mobile Auth Row */}
        {!loading && (
          <div className="mobile-user-row">
            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', padding: '10px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name || 'User'}
                      style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--accent)', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'var(--accent-glow)',
                        border: '1px solid var(--accent)',
                        color: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 14
                      }}
                    >
                      {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-hi)' }}>
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate('/settings');
                    }}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: 12, gap: 6, flex: 1 }}
                  >
                    <Settings size={14} />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="btn-secondary danger"
                    style={{ padding: '6px 12px', fontSize: 12, gap: 6, flex: 1 }}
                  >
                    <LogOut size={13} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, width: '100%', padding: '10px 0' }}>
                <Link
                  to="/login"
                  state={{ from: currentPath }}
                  className="btn-secondary"
                  style={{ textDecoration: 'none', padding: '8px 14px', fontSize: 13, flex: 1, textAlign: 'center' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  state={{ from: currentPath }}
                  className="nav-cta"
                  style={{ flex: 1, textAlign: 'center' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop Auth Controls & Exactly One Theme Switcher */}
      <div className="desktop-user-profile">
        {/* Single Sun / Moon Theme Toggle Button on Desktop */}
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Terminal Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Terminal Dark Mode'}
        >
          {isDark ? <Sun size={17} style={{ color: '#ffbd2e' }} /> : <Moon size={17} style={{ color: '#0969da' }} />}
        </button>

        {!loading && (
          isAuthenticated ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      border: '2px solid var(--accent)',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: 'var(--accent-glow)',
                      border: '1px solid var(--accent)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 14
                    }}
                  >
                    {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                )}
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || user?.email?.split('@')[0]}
                </span>
              </div>

              <button
                onClick={() => navigate('/settings')}
                className="btn-secondary"
                style={{
                  padding: '7px 10px',
                  fontSize: 12.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                title="Settings"
                aria-label="Settings"
              >
                <Settings size={15} />
              </button>

              <button
                onClick={handleLogout}
                className="btn-secondary danger"
                style={{ padding: '7px 12px', fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                title="Log out"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link
                to="/login"
                state={{ from: currentPath }}
                style={{
                  color: 'var(--text)',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                  padding: '7px 13px',
                  borderRadius: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'var(--panel)',
                  border: '1px solid var(--line)',
                  transition: 'all 0.15s ease',
                }}
              >
                <LogIn size={13} />
                <span>Log In</span>
              </Link>
              <Link
                to="/signup"
                state={{ from: currentPath }}
                className="nav-cta"
                style={{ padding: '7px 15px', fontSize: 13 }}
              >
                Sign Up →
              </Link>
            </div>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
export { Navbar as NavBar };
