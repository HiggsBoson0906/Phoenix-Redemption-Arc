import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Cpu,
  Calculator,
  Building2,
  Users,
  FolderGit2,
  BrainCircuit,
  Trophy,
  ArrowRight,
  Flame,
  CheckCircle2,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { useProgress } from '@/context/ProgressContext';
import Navbar from '@/components/common/Navbar.jsx';
import Footer from '@/components/common/Footer.jsx';
import manifest from '@/content/import_manifest.json';

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { checkedState } = useProgress();

  // Compute live solved counts across domains
  const stats = useMemo(() => {
    let totalSolved = 0;
    let dsaSolved = 0;
    let csSolved = 0;
    let aptitudeSolved = 0;
    let companySolved = 0;
    let behavioralSolved = 0;
    let projectsSolved = 0;
    let puzzlesSolved = 0;

    Object.keys(checkedState).forEach((key) => {
      if (checkedState[key]) {
        totalSolved++;
        if (key.startsWith('cs-') || key.startsWith('os-') || key.startsWith('cn-') || key.startsWith('dbms-') || key.startsWith('oops-')) {
          csSolved++;
        } else if (key.startsWith('apt-')) {
          aptitudeSolved++;
        } else if (key.startsWith('puzzle-')) {
          puzzlesSolved++;
        } else if (key.includes('tell-me') || key.includes('introduce-') || key.includes('strengths') || key.includes('weakness') || key.includes('leadership') || key.includes('teamwork') || key.includes('conflict') || key.includes('ownership')) {
          behavioralSolved++;
        } else if (key.startsWith('resume-') || key.startsWith('arch-') || key.startsWith('scalability-') || key.startsWith('design-') || key.startsWith('tradeoff-')) {
          projectsSolved++;
        } else if (key.startsWith('company-') || key.startsWith('deshaw-') || key.startsWith('rippling-') || key.startsWith('tekion-') || key.startsWith('titan-')) {
          companySolved++;
        } else {
          // Default to DSA
          dsaSolved++;
        }
      }
    });

    return {
      totalSolved,
      dsaSolved,
      csSolved,
      aptitudeSolved,
      companySolved,
      behavioralSolved,
      projectsSolved,
      puzzlesSolved,
    };
  }, [checkedState]);

  const totalCatalogItems = manifest?.summary?.totalItems || 3408;
  const overallPct = totalCatalogItems > 0 ? Math.min(100, Math.round((stats.totalSolved / totalCatalogItems) * 100)) : 0;

  const domains = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      badge: 'Core Engine',
      description: '1,981 hand-picked problems across 22 topic sheets — DP, Trees, Graphs, Two Pointer, Sliding Window, Greedy, and more.',
      total: 1981,
      solved: stats.dsaSolved,
      icon: <Code2 size={24} color="#3b82f6" />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.05))',
      link: '/dsa',
      actionLabel: 'Solve DSA',
    },
    {
      id: 'cs-fundamentals',
      title: 'CS Fundamentals',
      badge: 'Core Subjects',
      description: '850 high-yield items: OS, Computer Networks, DBMS, and OOPs. Includes Top-40 cheat sheets, OA MCQs, and interview Q&As.',
      total: 850,
      solved: stats.csSolved,
      icon: <Cpu size={24} color="#8b5cf6" />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.05))',
      link: '/cs-fundamentals',
      actionLabel: 'Study CS Core',
    },
    {
      id: 'company-prep',
      title: 'Company Wise Preparation',
      badge: 'Targeted OA',
      description: '364 curated problems from real Online Assessments and technical rounds at DE Shaw, Rippling, Titan, and Tekion.',
      total: 364,
      solved: stats.companySolved,
      icon: <Building2 size={24} color="#10b981" />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.05))',
      link: '/company-prep',
      actionLabel: 'Practice Companies',
    },
    {
      id: 'aptitude',
      title: 'Aptitude & Quantitative Drills',
      badge: 'Campus Placement',
      description: 'Formula cheat sheets, step-by-step worked solutions, and interactive MCQs for Number Systems, Percentages, and Time & Work.',
      total: 48,
      solved: stats.aptitudeSolved,
      icon: <Calculator size={24} color="#f59e0b" />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.05))',
      link: '/aptitude',
      actionLabel: 'Practice Aptitude',
    },
    {
      id: 'interview-prep',
      title: 'Behavioral & HR Interview',
      badge: 'STAR Framework',
      description: '43 in-depth questions across 17 categories with full STAR situation/task/action/result breakdowns, sample answers, and tips.',
      total: 43,
      solved: stats.behavioralSolved,
      icon: <Users size={24} color="#6366f1" />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.05))',
      link: '/interview-prep',
      actionLabel: 'Master HR Questions',
    },
    {
      id: 'projects',
      title: 'Project & Resume Defense',
      badge: 'System Design',
      description: '32 deep-dive questions covering architecture, scalability bottlenecks, trade-offs, security, and production readiness.',
      total: 32,
      solved: stats.projectsSolved,
      icon: <FolderGit2 size={24} color="#06b6d4" />,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(8, 145, 178, 0.05))',
      link: '/projects',
      actionLabel: 'Defend Projects',
    },
    {
      id: 'puzzles',
      title: 'Lateral Thinking & Puzzles',
      badge: 'Brain Teasers',
      description: '90 classic interview puzzles, logical paradoxes, math brainteasers, and spatial arrangement tests.',
      total: 90,
      solved: stats.puzzlesSolved,
      icon: <BrainCircuit size={24} color="#ec4899" />,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(219, 39, 119, 0.05))',
      link: '/puzzles',
      actionLabel: 'Solve Puzzles',
    },
  ];

  const quickLaunch = [
    { title: 'Dynamic Programming', path: '/dsa/dp', tag: 'DSA Sheet', count: '138 Problems' },
    { title: 'Binary Trees & BST', path: '/dsa/tree', tag: 'DSA Sheet', count: '124 Problems' },
    { title: 'Operating Systems', path: '/cs-fundamentals/os', tag: 'CS Core', count: 'Top 40 + OA MCQs' },
    { title: 'DBMS & SQL', path: '/cs-fundamentals/dbms', tag: 'CS Core', count: 'Top 40 + OA MCQs' },
    { title: 'Rippling OA Set', path: '/company-prep/rippling', tag: 'Company', count: 'Story Chains & LLD' },
    { title: 'Tell Me About Yourself', path: '/interview-prep/tell-me-about-yourself', tag: 'Behavioral', count: 'STAR Framework' },
  ];

  return (
    <div className="sheet-page">
      <Navbar />
      <div className="sheet-layout" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '36px 32px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
            <div style={{ maxWidth: '640px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', fontSize: '0.82rem', fontWeight: '700', marginBottom: '14px' }}>
                <Sparkles size={14} /> Comprehensive Tech Interview Platform
              </div>

              <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#f8fafc', margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                Welcome back, <span style={{ background: 'linear-gradient(90deg, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0] || 'Engineer'}</span>
              </h1>

              <p style={{ color: '#94a3b8', fontSize: '1.05rem', margin: 0, lineHeight: '1.6' }}>
                Your complete preparation workspace — covering 3,400+ curated DSA problems, core CS fundamentals, company assessments, aptitude, resume defense, and behavioral frameworks.
              </p>
            </div>

            {/* Readiness Dial Card */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '16px',
              padding: '24px 28px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              minWidth: '240px',
              textAlign: 'center',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
                <Target size={16} /> Interview Readiness
              </div>

              <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#f8fafc', lineHeight: '1' }}>
                {overallPct}%
              </div>

              <div style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '8px 0 14px' }}>
                {stats.totalSolved} of {totalCatalogItems} items completed
              </div>

              <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.max(overallPct, 2)}%`,
                    background: 'linear-gradient(90deg, #38bdf8, #10b981)',
                    borderRadius: '999px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Guest Mode Notice */}
        {!isAuthenticated && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '14px',
            padding: '14px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} color="#f59e0b" />
              <div>
                <span style={{ color: '#fbbf24', fontWeight: '700', fontSize: '0.9rem' }}>Guest Mode Active: </span>
                <span style={{ color: '#d1d5db', fontSize: '0.88rem' }}>Your preparation progress is saving to your browser locally. Log in anytime to sync to your MongoDB cloud account.</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Launch Shortcuts */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Flame size={18} color="#f59e0b" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>
              Popular Jump Points
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '12px'
          }}>
            {quickLaunch.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                style={{
                  background: '#141722',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: '700', textTransform: 'uppercase' }}>
                  {item.tag}
                </div>
                <div style={{ color: '#f3f4f6', fontWeight: '600', fontSize: '0.92rem' }}>
                  {item.title}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>
                  {item.count}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* The 7 Preparation Pillars */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Trophy size={18} color="#10b981" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>
              Preparation Pillars
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '16px'
          }}>
            {domains.map((domain) => {
              const pct = domain.total > 0 ? Math.round((domain.solved / domain.total) * 100) : 0;

              return (
                <div
                  key={domain.id}
                  style={{
                    background: '#141722',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${domain.color}66`;
                    e.currentTarget.style.boxShadow = `0 8px 24px -6px ${domain.color}22`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    {/* Top row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: domain.gradient,
                        border: `1px solid ${domain.color}33`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {domain.icon}
                      </div>

                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: `${domain.color}18`,
                        color: domain.color,
                        border: `1px solid ${domain.color}33`
                      }}>
                        {domain.badge}
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc' }}>
                      {domain.title}
                    </h3>

                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.5' }}>
                      {domain.description}
                    </p>
                  </div>

                  <div>
                    {/* Progress bar */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.82rem' }}>
                        <span style={{ color: '#94a3b8' }}>Progress</span>
                        <span style={{ color: '#f1f5f9', fontWeight: '700' }}>
                          {domain.solved} / {domain.total} ({pct}%)
                        </span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: domain.color,
                            borderRadius: '999px',
                            transition: 'width 0.4s ease'
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => navigate(domain.link)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.09)',
                        color: '#f3f4f6',
                        fontSize: '0.88rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${domain.color}22`;
                        e.currentTarget.style.borderColor = `${domain.color}66`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                      }}
                    >
                      {domain.actionLabel} <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
