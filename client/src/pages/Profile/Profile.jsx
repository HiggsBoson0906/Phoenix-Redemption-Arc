import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { useProgress } from '../../context/ProgressContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { computeLeetCodeStats, getAllUniqueProblemsRegistry } from '../../utils/problemStats.js';
import ActivityHeatmap from '../../components/ActivityHeatmap.jsx';
import { BackupModal } from '../../components/BackupModal.jsx';
import {
  Flame,
  ArrowLeft,
  Trophy,
  Star,
  CheckCircle2,
  Lock,
  HardDrive,
  ExternalLink,
  Code2,
  Terminal,
  Sun,
  Moon,
  Mail,
  Shield,
  Key,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import './Profile.css';

// ─── Provider Badge Config ───────────────────────────────────────────────
const PROVIDER_BADGE = {
  local: { label: 'Email & Password', icon: Mail, className: 'email' },
  google: { label: 'Google', icon: Shield, className: 'google' },
  both: { label: 'Google + Email', icon: Key, className: 'both' }
};

// ─── Helper to compute streaks from solve history ────────────────────────
function calcStreakStats(solveHistory = {}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const todayStr = today.toISOString().split('T')[0];
  const todaySolved = (solveHistory[todayStr] || 0) > 0;

  let streakDate = new Date(today);
  if (!todaySolved) {
    streakDate.setDate(today.getDate() - 1);
  }

  while (true) {
    const dStr = streakDate.toISOString().split('T')[0];
    if ((solveHistory[dStr] || 0) > 0) {
      currentStreak++;
      streakDate.setDate(streakDate.getDate() - 1);
    } else {
      break;
    }
  }

  const sortedDates = Object.keys(solveHistory).sort();
  sortedDates.forEach((dStr, idx) => {
    if (idx === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(sortedDates[idx - 1]);
      const thisD = new Date(dStr);
      const diffDays = Math.round((thisD - prev) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;
  });

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { theme, setTheme, toggleTheme, isDark } = useTheme();
  const { checkedState, starredState, solveHistory } = useProgress();

  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'dsa' | 'company'

  // 1. Fetch cached unified problems registry
  const registry = useMemo(() => getAllUniqueProblemsRegistry(), []);

  // 2. Compute LeetCode metrics across all unique problems
  const stats = useMemo(() => {
    return computeLeetCodeStats(checkedState, starredState, registry);
  }, [checkedState, starredState, registry]);

  // 3. Compute streaks from solveHistory
  const streakStats = useMemo(() => {
    return calcStreakStats(solveHistory);
  }, [solveHistory]);

  const authProvider = user?.authProvider || 'local';
  const badge = PROVIDER_BADGE[authProvider] || PROVIDER_BADGE.local;
  const BadgeIcon = badge.icon;

  // Donut chart math
  const RADIUS = 50;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~314.159

  const easyRatio = stats.total > 0 ? stats.easy.solved / stats.total : 0;
  const medRatio = stats.total > 0 ? stats.medium.solved / stats.total : 0;
  const hardRatio = stats.total > 0 ? stats.hard.solved / stats.total : 0;

  const easyLen = easyRatio * CIRCUMFERENCE;
  const medLen = medRatio * CIRCUMFERENCE;
  const hardLen = hardRatio * CIRCUMFERENCE;

  // Filter sheets breakdown
  const visibleSheets = useMemo(() => {
    if (activeTab === 'dsa') return stats.perSheetStats.filter(s => s.type === 'dsa');
    if (activeTab === 'company') return stats.perSheetStats.filter(s => s.type === 'company');
    return stats.perSheetStats;
  }, [stats.perSheetStats, activeTab]);

  return (
    <div className="profile-page">
      {/* ── Top Navigation Bar ── */}
      <header className="profile-header">
        <div className="profile-header-inner">
          <Link to="/dsa" className="profile-brand">
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
              <span>bash:~/profile</span>
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

            <button onClick={() => navigate('/dsa')} className="profile-back-btn">
              <ArrowLeft size={16} />
              <span>Back to Problem Sheets</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Profile Container ── */}
      <main className="profile-container">
        {/* ── 1. User Header & Profile Overview ── */}
        <section className="profile-card user-overview-card">
          <div className="user-overview-flex">
            <div className="user-avatar-wrap">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name || 'User'} className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar-fallback">
                  {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
                </div>
              )}
              <span className="user-avatar-badge" title="Active DSA Warrior">
                <Flame size={12} color="#f59e0b" />
              </span>
            </div>

            <div className="user-info-meta">
              <div className="user-name-row">
                <h1>{user?.name || (isAuthenticated ? 'Adventurer' : 'Guest Explorer')}</h1>
                {isAuthenticated && (
                  <div className={`provider-pill ${badge.className}`}>
                    <BadgeIcon size={12} />
                    <span>{badge.label}</span>
                  </div>
                )}
              </div>
              <p className="user-email-text">
                {user?.email || (isAuthenticated ? '—' : 'Progress stored locally. Sign in to sync across devices.')}
              </p>

              <div className="user-quick-badges">
                <span className="badge-item">
                  <Flame size={13} color="#f59e0b" />
                  <strong>{streakStats.currentStreak}</strong> Day Streak
                </span>
                <span className="badge-item">
                  <Trophy size={13} color="#eab308" />
                  <strong>{streakStats.longestStreak}</strong> Max Streak
                </span>
                <span className="badge-item">
                  <Star size={13} color="#eab308" />
                  <strong>{stats.starredCount}</strong> Starred
                </span>
              </div>
            </div>

            <div className="user-actions-cluster">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => navigate('/change-password')}
                  className="profile-action-btn primary"
                >
                  <Lock size={15} />
                  <span>Change Password</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="profile-action-btn primary"
                >
                  <Key size={15} />
                  <span>Sign In to Sync</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setBackupModalOpen(true)}
                className="profile-action-btn secondary"
                title="Backup and Restore your problem solve progress"
              >
                <HardDrive size={15} />
                <span>Backup & Data</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── 2. LeetCode Style "Solved Problems" Section ── */}
        <section className="profile-card leetcode-section-card">
          <div className="leetcode-section-header">
            <div>
              <div className="leetcode-header-pre">
                <Award size={16} color="var(--accent)" />
                <span>Preparation Mastery</span>
              </div>
              <h2>Solved Problems</h2>
            </div>
            <div className="leetcode-header-right">
              <span className="solved-percentage-pill">
                <TrendingUp size={14} />
                {stats.totalPercentage}% Completed
              </span>
            </div>
          </div>

          <div className="leetcode-metrics-grid">
            {/* Left: Circular Donut Gauge */}
            <div className="leetcode-donut-card">
              <div className="donut-wrap">
                <svg width="140" height="140" viewBox="0 0 140 140" className="donut-svg">
                  {/* Background track */}
                  <circle
                    cx="70"
                    cy="70"
                    r={RADIUS}
                    className="donut-bg-track"
                    strokeWidth="9"
                    fill="none"
                  />

                  {/* Easy arc (Teal) */}
                  {easyLen > 0 && (
                    <circle
                      cx="70"
                      cy="70"
                      r={RADIUS}
                      className="donut-arc-easy"
                      strokeWidth="9"
                      fill="none"
                      strokeDasharray={`${easyLen} ${CIRCUMFERENCE - easyLen}`}
                      strokeDashoffset="0"
                      transform="rotate(-90 70 70)"
                    />
                  )}

                  {/* Medium arc (Yellow/Amber) */}
                  {medLen > 0 && (
                    <circle
                      cx="70"
                      cy="70"
                      r={RADIUS}
                      className="donut-arc-medium"
                      strokeWidth="9"
                      fill="none"
                      strokeDasharray={`${medLen} ${CIRCUMFERENCE - medLen}`}
                      strokeDashoffset={-easyLen}
                      transform="rotate(-90 70 70)"
                    />
                  )}

                  {/* Hard arc (Red) */}
                  {hardLen > 0 && (
                    <circle
                      cx="70"
                      cy="70"
                      r={RADIUS}
                      className="donut-arc-hard"
                      strokeWidth="9"
                      fill="none"
                      strokeDasharray={`${hardLen} ${CIRCUMFERENCE - hardLen}`}
                      strokeDashoffset={-(easyLen + medLen)}
                      transform="rotate(-90 70 70)"
                    />
                  )}
                </svg>

                {/* Donut Inner Label */}
                <div className="donut-center-content">
                  <span className="donut-count-bold">{stats.solved}</span>
                  <span className="donut-sub-label">Solved</span>
                  <span className="donut-total-dim">/ {stats.total}</span>
                </div>
              </div>

              <div className="donut-caption">
                <strong>{stats.solved}</strong> of <strong>{stats.total}</strong> unique questions solved
              </div>
            </div>

            {/* Right: LeetCode Easy, Medium, Hard Stacked Bars */}
            <div className="leetcode-bars-column">
              {/* Easy Row */}
              <div className="difficulty-stat-card easy">
                <div className="diff-card-top">
                  <span className="diff-badge easy">Easy</span>
                  <div className="diff-numbers">
                    <span className="diff-solved-bold">{stats.easy.solved}</span>
                    <span className="diff-total-slash">/ {stats.easy.total}</span>
                    <span className="diff-percentage">({stats.easy.percentage}%)</span>
                  </div>
                </div>
                <div className="diff-progress-track">
                  <div
                    className="diff-progress-fill easy"
                    style={{ width: `${Math.min(100, Math.max(stats.easy.solved > 0 ? 3 : 0, stats.easy.percentage))}%` }}
                  />
                </div>
              </div>

              {/* Medium Row */}
              <div className="difficulty-stat-card medium">
                <div className="diff-card-top">
                  <span className="diff-badge medium">Medium</span>
                  <div className="diff-numbers">
                    <span className="diff-solved-bold">{stats.medium.solved}</span>
                    <span className="diff-total-slash">/ {stats.medium.total}</span>
                    <span className="diff-percentage">({stats.medium.percentage}%)</span>
                  </div>
                </div>
                <div className="diff-progress-track">
                  <div
                    className="diff-progress-fill medium"
                    style={{ width: `${Math.min(100, Math.max(stats.medium.solved > 0 ? 3 : 0, stats.medium.percentage))}%` }}
                  />
                </div>
              </div>

              {/* Hard Row */}
              <div className="difficulty-stat-card hard">
                <div className="diff-card-top">
                  <span className="diff-badge hard">Hard</span>
                  <div className="diff-numbers">
                    <span className="diff-solved-bold">{stats.hard.solved}</span>
                    <span className="diff-total-slash">/ {stats.hard.total}</span>
                    <span className="diff-percentage">({stats.hard.percentage}%)</span>
                  </div>
                </div>
                <div className="diff-progress-track">
                  <div
                    className="diff-progress-fill hard"
                    style={{ width: `${Math.min(100, Math.max(stats.hard.solved > 0 ? 3 : 0, stats.hard.percentage))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Activity Heatmap Section (Directly under LeetCode Stats) ── */}
        <section className="profile-card heatmap-section-card">
          <ActivityHeatmap solveHistory={solveHistory} isCollapsed={false} />
        </section>

        {/* ── 4. Sheets Mastery & Topic Progress ── */}
        <section className="profile-card sheets-mastery-card">
          <div className="sheets-mastery-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Layers size={18} color="var(--accent)" />
              <h2>Curated Sheets Mastery</h2>
            </div>

            <div className="sheets-filter-tabs">
              <button
                type="button"
                className={`filter-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Sheets ({stats.perSheetStats.length})
              </button>
              <button
                type="button"
                className={`filter-tab-pill ${activeTab === 'dsa' ? 'active' : ''}`}
                onClick={() => setActiveTab('dsa')}
              >
                DSA Topics (22)
              </button>
              <button
                type="button"
                className={`filter-tab-pill ${activeTab === 'company' ? 'active' : ''}`}
                onClick={() => setActiveTab('company')}
              >
                Company Prep (4)
              </button>
            </div>
          </div>

          <div className="sheets-progress-grid">
            {visibleSheets.map((sheet) => {
              const targetUrl = sheet.type === 'company' ? `/company-prep/${sheet.slug}` : `/dsa/${sheet.slug}`;
              return (
                <Link
                  key={sheet.slug}
                  to={targetUrl}
                  className="sheet-progress-item"
                >
                  <div className="sheet-item-top">
                    <span className="sheet-item-title">{sheet.title}</span>
                    <span className="sheet-item-count">
                      <strong>{sheet.solved}</strong> / {sheet.total}
                    </span>
                  </div>

                  <div className="sheet-item-track">
                    <div
                      className="sheet-item-fill"
                      style={{ width: `${sheet.percentage}%` }}
                    />
                  </div>

                  <div className="sheet-item-footer">
                    <span className="sheet-item-pct">{sheet.percentage}% Solved</span>
                    <span className="sheet-item-arrow">
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      {/* ── Backup & Restore Modal ── */}
      <BackupModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
      />
    </div>
  );
}
