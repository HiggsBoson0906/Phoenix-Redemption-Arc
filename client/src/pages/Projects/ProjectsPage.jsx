import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Search,
  X,
  CheckCircle2,
  ChevronDown,
  Layers,
  ShieldCheck,
  AlertOctagon,
  HelpCircle,
  Award
} from 'lucide-react';
import { projectInterviewCategories } from '@/content/projects-interview/categories';
import { projectInterviewQuestions } from '@/content/projects-interview/questions';
import { useProgress } from '@/context/ProgressContext';
import Navbar from '@/components/common/Navbar.jsx';
import Footer from '@/components/common/Footer.jsx';

export default function ProjectsPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { checkedState, toggleProblem } = useProgress();

  const [activeCategory, setActiveCategory] = useState(categorySlug || 'all');
  const [activeDiff, setActiveDiff] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  React.useEffect(() => {
    if (categorySlug) {
      setActiveCategory(categorySlug);
    }
  }, [categorySlug]);

  const handleSelectCategory = (slug) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      navigate('/projects');
    } else {
      navigate(`/projects/${slug}`);
    }
  };

  const filteredQuestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projectInterviewQuestions.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.categorySlug === activeCategory;
      const matchesDiff = activeDiff === 'ALL' || item.difficulty?.toUpperCase() === activeDiff;
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.detailedAnswer.toLowerCase().includes(q) ||
        item.idealInterviewAnswer.toLowerCase().includes(q);
      return matchesCat && matchesDiff && matchesSearch;
    });
  }, [activeCategory, activeDiff, search]);

  const totalCount = projectInterviewQuestions.length;
  const doneCount = projectInterviewQuestions.filter((item) => !!checkedState[item.id]).length;
  const pctDone = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const getDiffBadgeStyle = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return { background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' };
      case 'medium':
        return { background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' };
      case 'hard':
        return { background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' };
      default:
        return { background: 'rgba(255, 255, 255, 0.08)', color: '#d1d5db', border: '1px solid rgba(255, 255, 255, 0.1)' };
    }
  };

  return (
    <div className="sheet-page">
      <Navbar />
      <div className="sheet-layout" style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{
              fontSize: '2rem',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(16, 185, 129, 0.15)',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399'
            }}>
              <FolderGit2 size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#f3f4f6', margin: 0 }}>
                Project & Resume Defense
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: '4px 0 0' }}>
                Master architecture, scalability, trade-offs, security, and technical deep-dives to defend your resume projects like a pro.
              </p>
            </div>
          </div>

          {/* Progress Tracker */}
          <div style={{
            marginTop: '18px',
            padding: '16px 20px',
            background: 'rgba(20, 23, 34, 0.7)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={22} color="#10b981" />
              <div>
                <div style={{ color: '#f3f4f6', fontWeight: '700', fontSize: '1.05rem' }}>
                  {doneCount} / {totalCount} Questions Mastered
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  {pctDone}% ready for project defense rounds
                </div>
              </div>
            </div>

            <div style={{ flex: '1', minWidth: '180px', maxWidth: '300px' }}>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pctDone}%`,
                    background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                    borderRadius: '999px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls: Search, Difficulty Chips, Category Pills */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div className="search-wrap" style={{ flex: '1', minWidth: '240px' }}>
              <Search className="search-icon" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search project questions (e.g. scalability, db indexing, websockets)..."
              />
              {search && (
                <X className="clear-icon" size={16} onClick={() => setSearch('')} title="Clear search" />
              )}
            </div>

            <div className="diff-filter">
              {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diffKey) => {
                const isActive = activeDiff === diffKey;
                return (
                  <button
                    key={diffKey}
                    className={`chip ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveDiff(diffKey)}
                  >
                    {diffKey}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horizontal scrollable category pill bar */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'thin'
          }}>
            <button
              onClick={() => handleSelectCategory('all')}
              className={`chip ${activeCategory === 'all' ? 'active' : ''}`}
              style={{ whiteSpace: 'nowrap', borderRadius: '999px', padding: '6px 14px' }}
            >
              All Topics ({totalCount})
            </button>
            {projectInterviewCategories.map((cat) => {
              const count = projectInterviewQuestions.filter((q) => q.categorySlug === cat.slug).length;
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleSelectCategory(cat.slug)}
                  className={`chip ${isActive ? 'active' : ''}`}
                  style={{ whiteSpace: 'nowrap', borderRadius: '999px', padding: '6px 14px' }}
                >
                  <span style={{ marginRight: '6px' }}>{cat.icon}</span>
                  {cat.title} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <div className="empty-msg">
            No project defense questions found matching your filters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredQuestions.map((qItem) => {
              const isChecked = !!checkedState[qItem.id];
              const isExpanded = expandedId === qItem.id;
              const catMeta = projectInterviewCategories.find((c) => c.slug === qItem.categorySlug);

              return (
                <div
                  key={qItem.id}
                  style={{
                    background: '#141722',
                    borderRadius: '14px',
                    border: `1px solid ${isChecked ? 'rgba(16, 185, 129, 0.3)' : isExpanded ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : qItem.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleProblem(qItem.id, {
                          sheet: 'projects',
                          category: qItem.categorySlug,
                          difficulty: qItem.difficulty?.charAt(0) || 'M',
                        });
                      }}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: '#10b981',
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: 'rgba(6, 182, 212, 0.15)',
                          color: '#67e8f9',
                          fontWeight: '600'
                        }}>
                          {catMeta?.icon} {catMeta?.title || qItem.categorySlug}
                        </span>

                        <span style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontWeight: '700',
                          ...getDiffBadgeStyle(qItem.difficulty)
                        }}>
                          {qItem.difficulty}
                        </span>

                        {isChecked && (
                          <span style={{
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#34d399',
                            fontWeight: '600'
                          }}>
                            Mastered ✓
                          </span>
                        )}
                      </div>

                      <h3 style={{
                        margin: 0,
                        fontSize: '1.05rem',
                        fontWeight: '600',
                        color: isChecked ? '#9ca3af' : '#f3f4f6',
                        textDecoration: isChecked ? 'line-through' : 'none',
                        lineHeight: '1.4'
                      }}>
                        {qItem.question}
                      </h3>
                    </div>

                    <ChevronDown
                      size={18}
                      color="#9ca3af"
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease'
                      }}
                    />
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div style={{
                      padding: '0 20px 24px 20px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      marginTop: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px'
                    }}>
                      {/* Concept Breakdown */}
                      <div style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#67e8f9', fontWeight: '700', fontSize: '0.92rem' }}>
                          <Layers size={16} /> Why Interviewers Ask This & Concept Breakdown
                        </div>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '10px',
                          padding: '14px 16px',
                          color: '#d1d5db',
                          fontSize: '0.9rem',
                          lineHeight: '1.6',
                          border: '1px solid rgba(255, 255, 255, 0.06)'
                        }}>
                          {qItem.detailedAnswer}
                        </div>
                      </div>

                      {/* Ideal Scripted Answer */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#f3f4f6', fontWeight: '700', fontSize: '0.92rem' }}>
                          <Award size={16} color="#fbbf24" /> Ideal Interview Response Script
                        </div>
                        <div style={{
                          background: 'rgba(245, 158, 11, 0.04)',
                          borderRadius: '10px',
                          padding: '14px 16px',
                          color: '#e5e7eb',
                          fontSize: '0.9rem',
                          lineHeight: '1.6',
                          border: '1px solid rgba(245, 158, 11, 0.15)',
                          fontStyle: 'italic'
                        }}>
                          "{qItem.idealInterviewAnswer}"
                        </div>
                      </div>

                      {/* Interviewer Expectations & Key Points */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '16px'
                      }}>
                        {/* Expectations */}
                        {qItem.interviewerExpectations && (
                          <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: '700', fontSize: '0.88rem', marginBottom: '8px' }}>
                              <ShieldCheck size={15} /> What Interviewers Look For
                            </div>
                            <ul style={{ margin: 0, paddingLeft: '18px', color: '#d1d5db', fontSize: '0.85rem', lineHeight: '1.5' }}>
                              {qItem.interviewerExpectations.map((exp, eIdx) => (
                                <li key={eIdx} style={{ marginBottom: '6px' }}>{exp}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Mistakes */}
                        {qItem.commonMistakes && (
                          <div style={{ background: 'rgba(239, 68, 68, 0.05)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontWeight: '700', fontSize: '0.88rem', marginBottom: '8px' }}>
                              <AlertOctagon size={15} /> Common Pitfalls & Traps
                            </div>
                            <ul style={{ margin: 0, paddingLeft: '18px', color: '#d1d5db', fontSize: '0.85rem', lineHeight: '1.5' }}>
                              {qItem.commonMistakes.map((mis, mIdx) => (
                                <li key={mIdx} style={{ marginBottom: '6px' }}>{mis}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Follow-up Questions */}
                      {qItem.followUpQuestions && qItem.followUpQuestions.length > 0 && (
                        <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#93c5fd', fontWeight: '700', fontSize: '0.88rem', marginBottom: '8px' }}>
                            <HelpCircle size={15} /> Anticipated Follow-Up Probes
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {qItem.followUpQuestions.map((fQ, fIdx) => (
                              <div
                                key={fIdx}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.04)',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.84rem',
                                  color: '#cbd5e1',
                                  border: '1px solid rgba(255, 255, 255, 0.05)'
                                }}
                              >
                                • {fQ}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
