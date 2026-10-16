import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  X,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Quote
} from 'lucide-react';
import { behavioralCategories } from '@/content/behavioral/categories';
import { behavioralQuestions } from '@/content/behavioral/questions';
import { useProgress } from '@/context/ProgressContext';
import Navbar from '@/components/common/Navbar.jsx';
import Footer from '@/components/common/Footer.jsx';

export default function InterviewPrepPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { checkedState, toggleProblem } = useProgress();

  const [activeCategory, setActiveCategory] = useState(categorySlug || 'all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Sync category param if route changes
  React.useEffect(() => {
    if (categorySlug) {
      setActiveCategory(categorySlug);
    }
  }, [categorySlug]);

  const handleSelectCategory = (slug) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      navigate('/interview-prep');
    } else {
      navigate(`/interview-prep/${slug}`);
    }
  };

  const filteredQuestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return behavioralQuestions.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.categorySlug === activeCategory;
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.sampleAnswer.toLowerCase().includes(q) ||
        item.starFramework.situation.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, search]);

  const totalQuestions = behavioralQuestions.length;
  const doneCount = behavioralQuestions.filter((item) => !!checkedState[item.id]).length;
  const pctDone = totalQuestions > 0 ? Math.round((doneCount / totalQuestions) * 100) : 0;

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
              background: 'rgba(99, 102, 241, 0.15)',
              borderRadius: '16px',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8'
            }}>
              <Users size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#f3f4f6', margin: 0 }}>
                Behavioral & HR Interview Preparation
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: '4px 0 0' }}>
                Master behavioral questions with battle-tested STAR frameworks, complete sample answers, pitfalls to avoid, and interview tips.
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
                  {doneCount} / {totalQuestions} Questions Prepared
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  {pctDone}% ready for behavioral rounds
                </div>
              </div>
            </div>

            <div style={{ flex: '1', minWidth: '180px', maxWidth: '300px' }}>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pctDone}%`,
                    background: 'linear-gradient(90deg, #6366f1, #10b981)',
                    borderRadius: '999px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls: Search and Category Pills */}
        <div style={{ marginBottom: '24px' }}>
          <div className="search-wrap" style={{ marginBottom: '16px' }}>
            <Search className="search-icon" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search behavioral questions by keyword, topic, or story..."
              style={{ width: '100%' }}
            />
            {search && (
              <X className="clear-icon" size={16} onClick={() => setSearch('')} title="Clear search" />
            )}
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
              All Categories ({totalQuestions})
            </button>
            {behavioralCategories.map((cat) => {
              const count = behavioralQuestions.filter((q) => q.categorySlug === cat.slug).length;
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
            No questions found matching your search.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredQuestions.map((qItem, idx) => {
              const isChecked = !!checkedState[qItem.id];
              const isExpanded = expandedId === qItem.id;
              const catMeta = behavioralCategories.find((c) => c.slug === qItem.categorySlug);

              return (
                <div
                  key={qItem.id}
                  style={{
                    background: '#141722',
                    borderRadius: '14px',
                    border: `1px solid ${isChecked ? 'rgba(16, 185, 129, 0.3)' : isExpanded ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Card Header */}
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
                          sheet: 'behavioral',
                          category: qItem.categorySlug,
                          difficulty: 'M',
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: '#a5b4fc',
                          fontWeight: '600'
                        }}>
                          {catMeta?.icon} {catMeta?.title || qItem.categorySlug}
                        </span>
                        {isChecked && (
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#34d399',
                            fontWeight: '600'
                          }}>
                            Prepared ✓
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
                      {/* STAR Framework Grid */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0 10px', color: '#c7d2fe', fontWeight: '700', fontSize: '0.95rem' }}>
                          <Sparkles size={16} color="#818cf8" />
                          STAR Framework Breakdown
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '12px'
                        }}>
                          <div style={{ padding: '12px 14px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '10px', borderLeft: '3px solid #6366f1' }}>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '800', color: '#818cf8', marginBottom: '4px' }}>
                              Situation
                            </div>
                            <div style={{ fontSize: '0.88rem', color: '#d1d5db', lineHeight: '1.45' }}>
                              {qItem.starFramework.situation}
                            </div>
                          </div>

                          <div style={{ padding: '12px 14px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: '10px', borderLeft: '3px solid #06b6d4' }}>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '800', color: '#22d3ee', marginBottom: '4px' }}>
                              Task
                            </div>
                            <div style={{ fontSize: '0.88rem', color: '#d1d5db', lineHeight: '1.45' }}>
                              {qItem.starFramework.task}
                            </div>
                          </div>

                          <div style={{ padding: '12px 14px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '800', color: '#34d399', marginBottom: '4px' }}>
                              Action
                            </div>
                            <div style={{ fontSize: '0.88rem', color: '#d1d5db', lineHeight: '1.45' }}>
                              {qItem.starFramework.action}
                            </div>
                          </div>

                          <div style={{ padding: '12px 14px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '10px', borderLeft: '3px solid #f59e0b' }}>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '800', color: '#fbbf24', marginBottom: '4px' }}>
                              Result
                            </div>
                            <div style={{ fontSize: '0.88rem', color: '#d1d5db', lineHeight: '1.45' }}>
                              {qItem.starFramework.result}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sample Answer */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.07)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#f3f4f6', fontWeight: '700', fontSize: '0.95rem' }}>
                          <Quote size={16} color="#60a5fa" />
                          Ideal Sample Response (60–90 Seconds)
                        </div>
                        <p style={{ margin: 0, color: '#e5e7eb', fontSize: '0.92rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                          "{qItem.sampleAnswer}"
                        </p>
                      </div>

                      {/* Tips & Mistakes */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '16px'
                      }}>
                        {/* Tips */}
                        <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: '700', fontSize: '0.88rem', marginBottom: '8px' }}>
                            <Lightbulb size={15} /> Pro Tips
                          </div>
                          <ul style={{ margin: 0, paddingLeft: '18px', color: '#d1d5db', fontSize: '0.85rem', lineHeight: '1.5' }}>
                            {qItem.tips.map((tip, tIdx) => (
                              <li key={tIdx} style={{ marginBottom: '6px' }}>{tip}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Common Mistakes */}
                        <div style={{ background: 'rgba(239, 68, 68, 0.05)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontWeight: '700', fontSize: '0.88rem', marginBottom: '8px' }}>
                            <AlertTriangle size={15} /> Mistakes to Avoid
                          </div>
                          <ul style={{ margin: 0, paddingLeft: '18px', color: '#d1d5db', fontSize: '0.85rem', lineHeight: '1.5' }}>
                            {qItem.commonMistakes.map((mistake, mIdx) => (
                              <li key={mIdx} style={{ marginBottom: '6px' }}>{mistake}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Follow-up Questions */}
                      {qItem.followUpQuestions && qItem.followUpQuestions.length > 0 && (
                        <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#93c5fd', fontWeight: '700', fontSize: '0.88rem', marginBottom: '8px' }}>
                            <HelpCircle size={15} /> Likely Follow-Up Questions
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
