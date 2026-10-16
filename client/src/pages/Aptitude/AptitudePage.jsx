import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/common/Navbar.jsx';
import Footer from '@/components/common/Footer.jsx';
import useProgress from '@/hooks/useProgress.js';
import { liveAptitudeTopics } from '@/content/aptitude/topics/index.ts';
import { aptitudeTopicsRegistry } from '@/content/aptitude/registry.ts';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Search,
  Sparkles,
  Calculator,
  Lightbulb,
  Award
} from 'lucide-react';

const AptitudePage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { checkedState, toggleProblem } = useProgress();

  const initialSlug = params.topicSlug || 'number-system';
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const [activeTab, setActiveTab] = useState('practice'); // 'practice' | 'formulas' | 'examples'
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('ALL');
  const [selectedOptions, setSelectedOptions] = useState({}); // { [qId]: optionIndex }
  const [openExamples, setOpenExamples] = useState({});

  const currentTopic = useMemo(() => {
    return (
      liveAptitudeTopics.find((t) => t.slug === activeSlug) ||
      liveAptitudeTopics[0]
    );
  }, [activeSlug]);

  const handleSelectTopic = (slug) => {
    setActiveSlug(slug);
    setSelectedOptions({});
    setSearch('');
  };

  const handleSelectOption = (qId, optIdx) => {
    setSelectedOptions((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const topicStats = useMemo(() => {
    if (!currentTopic?.practiceQuestions) return { done: 0, total: 0 };
    let done = 0;
    currentTopic.practiceQuestions.forEach((q) => {
      if (checkedState[q.id]) done++;
    });
    return { done, total: currentTopic.practiceQuestions.length };
  }, [currentTopic, checkedState]);

  const filteredQuestions = useMemo(() => {
    if (!currentTopic?.practiceQuestions) return [];
    return currentTopic.practiceQuestions.filter((q) => {
      const matchesDiff = diffFilter === 'ALL' || q.difficulty === diffFilter;
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        q.question.toLowerCase().includes(query) ||
        q.options.some((o) => o.toLowerCase().includes(query)) ||
        (q.solution && q.solution.toLowerCase().includes(query));
      return matchesDiff && matchesSearch;
    });
  }, [currentTopic, diffFilter, search]);

  return (
    <div className="wrap" data-theme="aptitude">
      <Navbar activeTab="aptitude" />

      {/* Topic Selector Strip */}
      <div style={{ margin: '14px 0 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted, #8b9bb4)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Quantitative & Logical Aptitude
          </span>
          <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>
            {topicStats.done} / {topicStats.total} Questions Solved
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
          {liveAptitudeTopics.map((topic) => {
            const isActive = activeSlug === topic.slug;
            return (
              <button
                key={topic.slug}
                onClick={() => handleSelectTopic(topic.slug)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 16px',
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                  background: isActive ? 'rgba(245, 158, 11, 0.16)' : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#ffffff' : 'var(--text-muted, #94a3b8)',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <span>{topic.icon}</span>
                <span>{topic.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Header Banner */}
      <div className="header-container" style={{ marginBottom: 20 }}>
        <div className="eyebrow-badge">
          <span>{currentTopic.icon}</span>
          <span>Aptitude Practice Module</span>
        </div>
        <h1 className="main-title">{currentTopic.title}</h1>
        <p className="subtitle">
          Master {currentTopic.title.toLowerCase()} concepts, essential short-cut formulas, speed tricks, and real campus/company OA practice questions.
        </p>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
          {[
            { id: 'practice', label: 'Practice Questions', icon: HelpCircle, count: currentTopic.practiceQuestions?.length },
            { id: 'formulas', label: 'Formulas & Tricks', icon: Calculator, count: currentTopic.formulas?.length },
            { id: 'examples', label: 'Solved Walkthroughs', icon: Lightbulb, count: currentTopic.solvedExamples?.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '8px 15px',
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: isActive ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#000000' : 'var(--text-muted, #94a3b8)',
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
                    background: isActive ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.08)',
                    color: isActive ? '#000000' : 'inherit',
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. PRACTICE QUESTIONS VIEW */}
      {activeTab === 'practice' && (
        <div>
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
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder={`Search in ${currentTopic.title}...`}
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

            <div style={{ display: 'flex', gap: 6 }}>
              {['ALL', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDiffFilter(diff)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: diffFilter === diff ? '#f59e0b' : 'rgba(255,255,255,0.04)',
                    color: diffFilter === diff ? '#000000' : '#94a3b8',
                    border: 'none'
                  }}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Question List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredQuestions.map((q, qIdx) => {
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>
                        Q{qIdx + 1}
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
                    </div>

                    <button
                      onClick={() => toggleProblem(q.id, { sheet: `apt-${currentTopic.slug}`, difficulty: q.difficulty || 'M', category: currentTopic.title })}
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

                  {/* 4 Interactive Options */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 12 }}>
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
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            transition: 'all 0.15s ease'
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

                  {/* Immediate Solution Feedback */}
                  {hasAnswered && (
                    <div style={{
                      marginTop: 10,
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                      borderLeft: `3px solid ${isCorrect ? '#10b981' : '#f59e0b'}`,
                      fontSize: 13,
                      color: '#cbd5e1'
                    }}>
                      <div style={{ fontWeight: 700, color: isCorrect ? '#34d399' : '#fbbf24', marginBottom: 4 }}>
                        {isCorrect ? '✓ Correct Answer!' : `✗ Incorrect (Correct Answer: Option ${String.fromCharCode(65 + q.correctAnswerIndex)} - ${q.options[q.correctAnswerIndex]})`}
                      </div>
                      <div>{q.solution}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. FORMULAS & TRICKS VIEW */}
      {activeTab === 'formulas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--bg-card, #141722)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f59e0b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calculator size={18} />
              <span>Key Formulas</span>
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, color: '#e2e8f0', fontSize: 14 }}>
              {(currentTopic.formulas || []).map((f, i) => (
                <li key={i} style={{ lineHeight: 1.6 }}>{f}</li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'var(--bg-card, #141722)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#38bdf8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} />
              <span>Speed Tricks & Shortcuts</span>
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, color: '#e2e8f0', fontSize: 14 }}>
              {(currentTopic.tricks || []).map((t, i) => (
                <li key={i} style={{ lineHeight: 1.6 }}>{t}</li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'var(--bg-card, #141722)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#34d399', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={18} />
              <span>Core Concepts & Observations</span>
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, color: '#e2e8f0', fontSize: 14 }}>
              {(currentTopic.concepts || []).map((c, i) => (
                <li key={i} style={{ lineHeight: 1.6 }}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 3. SOLVED WALKTHROUGHS VIEW */}
      {activeTab === 'examples' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {(currentTopic.solvedExamples || []).map((ex, idx) => {
            const isOpen = openExamples[idx] !== false;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-card, #141722)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: 18,
                }}
              >
                <div
                  onClick={() => setOpenExamples((prev) => ({ ...prev, [idx]: !isOpen }))}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <h4 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', margin: 0 }}>
                    Example {idx + 1}: {ex.problem}
                  </h4>
                  {isOpen ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                </div>

                {isOpen && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ marginBottom: 10, color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>Step-by-Step Solution:</div>
                    <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, color: '#cbd5e1', fontSize: 13.5 }}>
                      {(ex.steps || []).map((s, sIdx) => (
                        <li key={sIdx}>{s}</li>
                      ))}
                    </ol>
                    <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 6, color: '#fbbf24', fontSize: 13, fontWeight: 700 }}>
                      Final Answer: {ex.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AptitudePage;
