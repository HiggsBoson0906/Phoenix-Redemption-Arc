import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Navbar from '@/components/common/Navbar.jsx';
import Footer from '@/components/common/Footer.jsx';
import useProgress from '@/hooks/useProgress.js';
import { csFundamentalsSubjects, getBuiltSubject } from '@/content/cs-fundamentals/registry.ts';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Layers,
  Search,
  Sparkles,
  ExternalLink,
  Award,
  FileText,
  Clock,
  RotateCcw
} from 'lucide-react';

const CSFundamentalsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { checkedState, toggleProblem, resetSheetProgress } = useProgress();

  const subjects = csFundamentalsSubjects.filter((s) => s.status === 'live');
  const initialSubject = params.subjectSlug || 'os';

  const [activeSubjectSlug, setActiveSubjectSlug] = useState(initialSubject);
  const [activeMode, setActiveMode] = useState('top40'); // 'top40' | 'oa' | 'interview' | 'articles'
  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & search
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('ALL'); // 'ALL' | 'Easy' | 'Medium' | 'Hard'
  const [selectedTopicSlug, setSelectedTopicSlug] = useState('all');
  const [openItems, setOpenItems] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({}); // { [questionId]: optionIndex }

  // Load subject content dynamically
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getBuiltSubject(activeSubjectSlug)
      .then((data) => {
        if (isMounted) {
          setSubjectData(data);
          setLoading(false);
          setOpenItems({});
          setSelectedOptions({});
          setSelectedTopicSlug('all');
        }
      })
      .catch((err) => {
        console.error('Failed to load subject:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeSubjectSlug]);

  const handleSubjectChange = (slug) => {
    setActiveSubjectSlug(slug);
    navigate(`/cs-fundamentals/${slug}`);
  };

  const toggleItemOpen = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const next = {};
    if (activeMode === 'top40' && subjectData?.top40) {
      subjectData.top40.forEach((q) => { next[q.id] = true; });
    } else if (activeMode === 'interview' && subjectData?.topics) {
      subjectData.topics.forEach((t) => {
        (t.interview || []).forEach((q) => { next[q.id] = true; });
      });
    }
    setOpenItems(next);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  // Option selection for OA Multiple Choice Questions
  const handleSelectOption = (questionId, optIndex) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optIndex }));
  };

  // Calculate solved counts for this subject
  const subjectStats = useMemo(() => {
    if (!subjectData) return { done: 0, total: 0 };
    let total = 0;
    let done = 0;

    // top40
    (subjectData.top40 || []).forEach((q) => {
      total++;
      if (checkedState[q.id]) done++;
    });

    // oa & interview
    (subjectData.topics || []).forEach((t) => {
      (t.oa?.questions || []).forEach((q) => {
        total++;
        if (checkedState[q.id]) done++;
      });
      (t.interview || []).forEach((q) => {
        total++;
        if (checkedState[q.id]) done++;
      });
    });

    return { done, total };
  }, [subjectData, checkedState]);

  return (
    <div className="wrap" data-theme={activeSubjectSlug}>
      <Navbar activeTab="cs-fundamentals" />

      {/* CS Fundamentals Subject Picker */}
      <div style={{ margin: '14px 0 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted, #8b9bb4)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            CS Core Fundamentals
          </span>
          <span style={{ fontSize: 12, color: 'var(--accent, #6366f1)', fontWeight: 600 }}>
            {subjectStats.done} / {subjectStats.total} Completed in {subjectData?.meta?.shortTitle || 'Subject'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
          {subjects.map((sub) => {
            const isActive = activeSubjectSlug === sub.slug;
            return (
              <button
                key={sub.slug}
                onClick={() => handleSubjectChange(sub.slug)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 16px',
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--accent, #6366f1)' : '1px solid rgba(255,255,255,0.08)',
                  background: isActive ? 'rgba(99, 102, 241, 0.16)' : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#ffffff' : 'var(--text-muted, #94a3b8)',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <span>{sub.icon}</span>
                <span>{sub.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Header Banner */}
      {subjectData && (
        <div className="header-container" style={{ marginBottom: 20 }}>
          <div className="eyebrow-badge">
            <span>{subjectData.meta.icon}</span>
            <span>{subjectData.meta.shortTitle} Mastery Hub</span>
          </div>
          <h1 className="main-title">{subjectData.meta.title}</h1>
          <p className="subtitle">{subjectData.meta.description}</p>

          {/* Mode Selector Tabs (Top-40, OA MCQs, Technical Interview, Articles) */}
          <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
            {[
              { id: 'top40', label: 'Top-40 Questions', icon: Award, count: subjectData.top40?.length },
              {
                id: 'oa',
                label: 'OA Practice (MCQs)',
                icon: HelpCircle,
                count: subjectData.topics?.reduce((acc, t) => acc + (t.oa?.questions?.length || 0), 0)
              },
              {
                id: 'interview',
                label: 'Technical Interview',
                icon: Sparkles,
                count: subjectData.topics?.reduce((acc, t) => acc + (t.interview?.length || 0), 0)
              },
              { id: 'articles', label: 'Theory Articles', icon: FileText, count: subjectData.topics?.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveMode(tab.id); setSearch(''); }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '8px 15px',
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: isActive ? 'var(--accent, #6366f1)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#ffffff' : 'var(--text-muted, #94a3b8)',
                    border: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span style={{
                      fontSize: 11,
                      padding: '1px 5px',
                      borderRadius: 4,
                      background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 20,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-card, #141722)',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder={`Search ${activeMode} in ${subjectData?.meta?.shortTitle || 'CS'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 8,
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ffffff',
              fontSize: 13,
            }}
          />
        </div>

        {/* Topic filter for OA and Interview */}
        {(activeMode === 'oa' || activeMode === 'interview' || activeMode === 'articles') && subjectData?.topics && (
          <select
            value={selectedTopicSlug}
            onChange={(e) => setSelectedTopicSlug(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ffffff',
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            <option value="all">All Topics ({subjectData.topics.length})</option>
            {subjectData.topics.map((t) => (
              <option key={t.meta.slug} value={t.meta.slug}>
                {t.meta.title}
              </option>
            ))}
          </select>
        )}

        {/* Expand / Collapse buttons */}
        {(activeMode === 'top40' || activeMode === 'interview') && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={expandAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 10px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#cbd5e1',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              <ChevronDown size={14} />
              <span>Expand All</span>
            </button>
            <button
              onClick={collapseAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 10px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#cbd5e1',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              <ChevronUp size={14} />
              <span>Collapse</span>
            </button>
          </div>
        )}
      </div>

      {/* CONTENT DISPLAY */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          Loading {activeSubjectSlug.toUpperCase()} curriculum...
        </div>
      ) : (
        <div>
          {/* 1. TOP 40 QUESTIONS MODE */}
          {activeMode === 'top40' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(subjectData.top40 || [])
                .filter((q) => {
                  const query = search.toLowerCase();
                  return (
                    !query ||
                    q.question.toLowerCase().includes(query) ||
                    q.answer.toLowerCase().includes(query) ||
                    (q.topicTags || []).some((t) => t.toLowerCase().includes(query))
                  );
                })
                .map((q, idx) => {
                  const isOpen = !!openItems[q.id];
                  const isChecked = !!checkedState[q.id];

                  return (
                    <div
                      key={q.id}
                      style={{
                        background: 'var(--bg-card, #141722)',
                        border: isChecked ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12,
                        padding: '16px 20px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
                          <button
                            onClick={() => toggleProblem(q.id, { sheet: `cs-${activeSubjectSlug}`, difficulty: q.difficulty || 'M', category: 'Top-40' })}
                            style={{
                              marginTop: 2,
                              width: 22,
                              height: 22,
                              borderRadius: 6,
                              border: isChecked ? 'none' : '2px solid rgba(255,255,255,0.25)',
                              background: isChecked ? '#10b981' : 'transparent',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              flexShrink: 0,
                            }}
                            title={isChecked ? "Mark as unread" : "Mark as mastered"}
                          >
                            {isChecked && <CheckCircle2 size={15} />}
                          </button>

                          <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => toggleItemOpen(q.id)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1' }}>
                                #{idx + 1}
                              </span>
                              {q.difficulty && (
                                <span style={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  padding: '2px 7px',
                                  borderRadius: 5,
                                  background: q.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.15)' : (q.difficulty === 'Medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)'),
                                  color: q.difficulty === 'Easy' ? '#34d399' : (q.difficulty === 'Medium' ? '#fbbf24' : '#f87171'),
                                }}>
                                  {q.difficulty}
                                </span>
                              )}
                              {(q.companies || []).slice(0, 3).map((comp) => (
                                <span key={comp} style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }}>
                                  {comp}
                                </span>
                              ))}
                            </div>
                            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', margin: 0, lineHeight: 1.4 }}>
                              {q.question}
                            </h3>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleItemOpen(q.id)}
                          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
                        >
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>

                      {isOpen && (
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 14, lineHeight: 1.6, color: '#cbd5e1' }}>
                          <div style={{ marginBottom: 12, fontWeight: 500, color: '#e2e8f0', whiteSpace: 'pre-line' }}>
                            {q.answer}
                          </div>
                          {q.explanation && (
                            <div style={{
                              background: 'rgba(0,0,0,0.3)',
                              padding: '12px 14px',
                              borderRadius: 8,
                              fontSize: 13,
                              color: '#94a3b8',
                              borderLeft: '3px solid #6366f1'
                            }}>
                              <strong style={{ color: '#cbd5e1' }}>Explanation & Deep Dive: </strong>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {/* 2. OA PRACTICE MCQS MODE */}
          {activeMode === 'oa' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {subjectData.topics
                .filter((t) => selectedTopicSlug === 'all' || t.meta.slug === selectedTopicSlug)
                .map((topic) => {
                  const questions = (topic.oa?.questions || []).filter((q) => {
                    const query = search.toLowerCase();
                    return !query || q.question.toLowerCase().includes(query) || q.options.some((o) => o.toLowerCase().includes(query));
                  });

                  if (questions.length === 0) return null;

                  return (
                    <div key={topic.meta.slug} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#6366f1' }}>{topic.meta.title}</span>
                        <span style={{ fontSize: 12, color: '#64748b' }}>({questions.length} Questions)</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {questions.map((q) => {
                          const userSelected = selectedOptions[q.id];
                          const hasAnswered = userSelected !== undefined;
                          const isCorrect = userSelected === q.correctAnswerIndex;
                          const isChecked = !!checkedState[q.id];

                          return (
                            <div
                              key={q.id}
                              style={{
                                background: 'var(--bg-card, #141722)',
                                border: isChecked ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 12,
                                padding: '18px 20px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  {q.difficulty && (
                                    <span style={{
                                      fontSize: 11,
                                      fontWeight: 600,
                                      padding: '2px 7px',
                                      borderRadius: 5,
                                      background: q.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                      color: q.difficulty === 'Easy' ? '#34d399' : '#fbbf24',
                                    }}>
                                      {q.difficulty}
                                    </span>
                                  )}
                                  {q.companyStyle && (
                                    <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }}>
                                      {q.companyStyle}
                                    </span>
                                  )}
                                </div>

                                <button
                                  onClick={() => toggleProblem(q.id, { sheet: `cs-${activeSubjectSlug}-oa`, difficulty: q.difficulty || 'M', category: topic.meta.title })}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    fontSize: 12,
                                    background: isChecked ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                                    color: isChecked ? '#34d399' : '#94a3b8',
                                    border: isChecked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 6,
                                    padding: '4px 8px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <CheckCircle2 size={13} />
                                  <span>{isChecked ? 'Solved' : 'Mark Solved'}</span>
                                </button>
                              </div>

                              <p style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 14, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                                {q.question}
                              </p>

                              {/* Options List */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, marginBottom: 12 }}>
                                {q.options.map((opt, optIdx) => {
                                  const isThisSelected = userSelected === optIdx;
                                  const isThisCorrect = q.correctAnswerIndex === optIdx;

                                  let optBg = 'rgba(255,255,255,0.03)';
                                  let optBorder = '1px solid rgba(255,255,255,0.08)';
                                  let optColor = '#cbd5e1';

                                  if (hasAnswered) {
                                    if (isThisCorrect) {
                                      optBg = 'rgba(16, 185, 129, 0.15)';
                                      optBorder = '1px solid #10b981';
                                      optColor = '#34d399';
                                    } else if (isThisSelected && !isThisCorrect) {
                                      optBg = 'rgba(239, 68, 68, 0.15)';
                                      optBorder = '1px solid #ef4444';
                                      optColor = '#f87171';
                                    }
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => handleSelectOption(q.id, optIdx)}
                                      style={{
                                        textAlign: 'left',
                                        padding: '10px 14px',
                                        borderRadius: 8,
                                        background: optBg,
                                        border: optBorder,
                                        color: optColor,
                                        fontSize: 13.5,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                      }}
                                    >
                                      <span style={{ fontWeight: 700, fontSize: 12, opacity: 0.6 }}>
                                        {String.fromCharCode(65 + optIdx)}.
                                      </span>
                                      <span>{opt}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Explanation once answered */}
                              {hasAnswered && q.explanation && (
                                <div style={{
                                  marginTop: 10,
                                  padding: '10px 14px',
                                  borderRadius: 8,
                                  background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                                  borderLeft: `3px solid ${isCorrect ? '#10b981' : '#f59e0b'}`,
                                  fontSize: 13,
                                  color: '#cbd5e1'
                                }}>
                                  <strong>{isCorrect ? '✓ Correct!' : '✗ Explanation:'} </strong>
                                  {q.explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* 3. TECHNICAL INTERVIEW QUESTIONS */}
          {activeMode === 'interview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {subjectData.topics
                .filter((t) => selectedTopicSlug === 'all' || t.meta.slug === selectedTopicSlug)
                .map((topic) => {
                  const questions = (topic.interview || []).filter((q) => {
                    const query = search.toLowerCase();
                    return !query || q.question.toLowerCase().includes(query) || (q.answer && q.answer.toLowerCase().includes(query));
                  });

                  if (questions.length === 0) return null;

                  return (
                    <div key={topic.meta.slug} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#6366f1' }}>{topic.meta.title}</span>
                        <span style={{ fontSize: 12, color: '#64748b' }}>({questions.length} Interview Q&As)</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {questions.map((q) => {
                          const isOpen = !!openItems[q.id];
                          const isChecked = !!checkedState[q.id];

                          return (
                            <div
                              key={q.id}
                              style={{
                                background: 'var(--bg-card, #141722)',
                                border: isChecked ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 12,
                                padding: '16px 20px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
                                  <button
                                    onClick={() => toggleProblem(q.id, { sheet: `cs-${activeSubjectSlug}-int`, difficulty: q.difficulty || 'M', category: topic.meta.title })}
                                    style={{
                                      marginTop: 2,
                                      width: 20,
                                      height: 20,
                                      borderRadius: 5,
                                      border: isChecked ? 'none' : '2px solid rgba(255,255,255,0.25)',
                                      background: isChecked ? '#10b981' : 'transparent',
                                      color: '#ffffff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {isChecked && <CheckCircle2 size={14} />}
                                  </button>

                                  <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => toggleItemOpen(q.id)}>
                                    <h4 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', margin: 0, lineHeight: 1.4 }}>
                                      {q.question}
                                    </h4>
                                  </div>
                                </div>

                                <button onClick={() => toggleItemOpen(q.id)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                              </div>

                              {isOpen && (
                                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 14, lineHeight: 1.6, color: '#cbd5e1' }}>
                                  <div style={{ marginBottom: 12, whiteSpace: 'pre-line' }}>{q.answer}</div>
                                  {q.explanation && (
                                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 8, fontSize: 13, color: '#94a3b8', marginTop: 10 }}>
                                      <strong>Key Insights: </strong>{q.explanation}
                                    </div>
                                  )}
                                  {Array.isArray(q.followUpQuestions) && q.followUpQuestions.length > 0 && (
                                    <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(99, 102, 241, 0.08)', borderLeft: '3px solid #6366f1' }}>
                                      <strong style={{ color: '#818cf8', display: 'block', marginBottom: 4 }}>Common Interviewer Follow-ups:</strong>
                                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
                                        {q.followUpQuestions.map((fu, idx) => (
                                          <li key={idx} style={{ marginBottom: 3 }}>{fu}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* 4. REVISION ARTICLES */}
          {activeMode === 'articles' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {subjectData.topics
                .filter((t) => selectedTopicSlug === 'all' || t.meta.slug === selectedTopicSlug)
                .map((topic) => {
                  const art = topic.article;
                  if (!art) return null;
                  const isChecked = !!checkedState[`art-${topic.meta.slug}`];

                  return (
                    <div
                      key={topic.meta.slug}
                      style={{
                        background: 'var(--bg-card, #141722)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12,
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1' }}>
                            TOPIC REVISION
                          </span>
                          <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={12} />
                            <span>{art.readTime || '8 min read'}</span>
                          </span>
                        </div>

                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
                          {art.title || topic.meta.title}
                        </h3>

                        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, marginBottom: 16 }}>
                          Comprehensive overview of {topic.meta.title.toLowerCase()}, key architectural properties, core trade-offs, and practical interview takeaways.
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                        <button
                          onClick={() => toggleItemOpen(`art-${topic.meta.slug}`)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#6366f1',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <BookOpen size={14} />
                          <span>{openItems[`art-${topic.meta.slug}`] ? 'Collapse Article' : 'Read Deep Dive'}</span>
                        </button>

                        <button
                          onClick={() => toggleProblem(`art-${topic.meta.slug}`, { sheet: `cs-${activeSubjectSlug}-art`, category: 'Articles' })}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 12,
                            padding: '4px 8px',
                            borderRadius: 6,
                            background: isChecked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.04)',
                            color: isChecked ? '#34d399' : '#94a3b8',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <CheckCircle2 size={13} />
                          <span>{isChecked ? 'Read' : 'Mark Read'}</span>
                        </button>
                      </div>

                      {openItems[`art-${topic.meta.slug}`] && (
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 13.5, lineHeight: 1.7, color: '#cbd5e1' }}>
                          {(art.sections || []).map((sec, sIdx) => (
                            <div key={sIdx} style={{ marginBottom: 16 }}>
                              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#818cf8', marginBottom: 6 }}>
                                {sec.heading}
                              </h4>
                              <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{sec.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CSFundamentalsPage;
