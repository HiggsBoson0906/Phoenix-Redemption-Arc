import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Search, X, CheckCircle2, ExternalLink } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { getCompanyMetaList, getCompanySheet } from '@/utils/companyAdapter';
import { getCompanyTheme } from '@/constants/themeColors';
import Navbar from '@/components/common/Navbar.jsx';
import { CategoryAccordion } from '@/components/CategoryAccordion';

export default function CompanyPrepPage() {
  const { companySlug } = useParams();
  const navigate = useNavigate();
  const { checkedState, toggleProblem } = useProgress();

  const companies = useMemo(() => getCompanyMetaList(), []);
  const activeSlug = (companySlug || companies[0]?.slug || 'de-shaw').toLowerCase();
  const currentSheet = useMemo(() => getCompanySheet(activeSlug), [activeSlug]);
  const theme = useMemo(() => getCompanyTheme(activeSlug), [activeSlug]);

  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('ALL');
  const [openMap, setOpenMap] = useState({ 0: true });

  const toggleAccordion = (idx) => {
    setOpenMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleExpandAll = () => {
    const next = {};
    currentSheet.categories.forEach((_, i) => { next[i] = true; });
    setOpenMap(next);
  };

  const handleCollapseAll = () => {
    setOpenMap({});
  };

  // Stats calculation
  const totalInSheet = useMemo(() => {
    return currentSheet.categories.reduce((acc, cat) => acc + cat.problems.length, 0);
  }, [currentSheet]);

  const doneInSheet = useMemo(() => {
    return currentSheet.categories.reduce((acc, cat) => {
      return acc + cat.problems.filter(([slug]) => !!checkedState[slug]).length;
    }, 0);
  }, [currentSheet, checkedState]);

  const pctDone = totalInSheet > 0 ? Math.round((doneInSheet / totalInSheet) * 100) : 0;

  // Filtered categories
  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return currentSheet.categories.map((cat, catIdx) => {
      const filtered = cat.problems.filter(([slug, diff, title]) => {
        const matchesDiff = diffFilter === 'ALL' || diff === diffFilter;
        const matchesSearch = !q || title.toLowerCase().includes(q) || slug.toLowerCase().includes(q);
        return matchesDiff && matchesSearch;
      });
      return {
        ...cat,
        originalIndex: catIdx,
        filteredProblems: filtered,
      };
    }).filter(c => !search && diffFilter === 'ALL' ? true : c.filteredProblems.length > 0);
  }, [currentSheet, search, diffFilter]);

  return (
    <div className="wrap" data-sheet="company">
      <Navbar />

      {/* Top Company Selector Pill Bar */}
      <div className="sheet-selector-container" style={{ margin: '14px 0 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-dim)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Choose Target Company ({companies.length} Assessment Sets)
          </span>
          <span style={{ fontSize: '12px', color: theme.accent, fontWeight: '700' }}>
            {doneInSheet} / {totalInSheet} Solved
          </span>
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'thin'
        }}>
          {companies.map((comp) => {
            const isActive = comp.slug === activeSlug;
            const compTheme = getCompanyTheme(comp.slug);

            return (
              <button
                key={comp.slug}
                onClick={() => navigate(`/company-prep/${comp.slug}`)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 18px',
                  borderRadius: '12px',
                  background: isActive ? compTheme.bgGlow : 'var(--panel)',
                  border: `1px solid ${isActive ? compTheme.accent : 'var(--line)'}`,
                  color: isActive ? 'var(--text)' : 'var(--text-dim)',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? `0 0 16px ${compTheme.glow}` : '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{comp.icon}</span>
                <span style={{ fontWeight: isActive ? '700' : '600', color: 'var(--text)' }}>
                  {comp.title.split(' ')[0]}
                </span>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: isActive ? compTheme.badgeBg : 'var(--line-soft)',
                  color: isActive ? compTheme.text : 'var(--text-dim)',
                  border: `1px solid ${isActive ? compTheme.border : 'var(--line)'}`,
                }}>
                  {comp.totalProblems}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sheet-layout" style={{ width: '100%' }}>
        <main className="sheet-main">
          {/* Company Header */}
          <div className="sheet-header" style={{
            marginBottom: '24px',
            background: 'var(--panel)',
            border: `1px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '24px 28px',
            boxShadow: `0 8px 24px -6px ${theme.glow}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '12px' }}>
              <div style={{
                fontSize: '2.2rem',
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.bgGlow,
                borderRadius: '16px',
                border: `1px solid ${theme.border}`,
                boxShadow: `0 0 18px ${theme.glow}`
              }}>
                {currentSheet.icon || '🏢'}
              </div>
              <div>
                <h1 style={{
                  fontSize: '1.9rem',
                  fontWeight: '800',
                  margin: 0,
                  background: `linear-gradient(135deg, var(--text) 40%, ${theme.accent} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em'
                }}>
                  {currentSheet.title}
                </h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.96rem', margin: '6px 0 0' }}>
                  {currentSheet.description}
                </p>
              </div>
            </div>

            {/* Quick Progress Banner */}
            <div style={{
              marginTop: '16px',
              padding: '14px 20px',
              background: 'var(--bg-elev)',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={24} color={theme.accent} />
                <div>
                  <div style={{ color: 'var(--text)', fontWeight: '700', fontSize: '1.1rem' }}>
                    {doneInSheet} / {totalInSheet} Solved
                  </div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    {pctDone}% completed for {currentSheet.title}
                  </div>
                </div>
              </div>

              <div style={{ flex: '1', minWidth: '180px', maxWidth: '340px' }}>
                <div style={{ height: '8px', background: 'var(--line)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pctDone}%`,
                      background: theme.barGradient,
                      borderRadius: '999px',
                      transition: 'width 0.4s ease',
                      boxShadow: `0 0 8px ${theme.glow}`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Controls Bar: Search, Difficulty Chips, Expand/Collapse */}
          <div className="controls-container" style={{ marginBottom: '20px' }}>
            <div className="search-wrap">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company problems..."
              />
              {search && (
                <X className="clear-icon" size={16} onClick={() => setSearch('')} title="Clear search" />
              )}
            </div>

            <div className="diff-filter">
              {['ALL', 'E', 'M', 'H'].map((diffKey) => {
                const labels = { ALL: 'ALL', E: 'EASY', M: 'MEDIUM', H: 'HARD' };
                const isActive = diffFilter === diffKey;
                return (
                  <button
                    key={diffKey}
                    className={`chip ${isActive ? 'active' : ''}`}
                    onClick={() => setDiffFilter(diffKey)}
                    style={isActive ? {
                      background: theme.accent,
                      color: '#090a0f',
                      boxShadow: `0 2px 10px ${theme.glow}`,
                      fontWeight: '700'
                    } : {}}
                  >
                    {labels[diffKey]}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleExpandAll}
                className="chip"
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                title="Expand all categories"
              >
                Expand All
              </button>
              <button
                onClick={handleCollapseAll}
                className="chip"
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                title="Collapse all categories"
              >
                Collapse
              </button>
            </div>
          </div>

          {/* Categories Accordion */}
          {filteredCategories.length === 0 ? (
            <div className="empty-msg">
              No company problems matched your search or filter.
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <CategoryAccordion
                key={cat.name}
                category={cat}
                catIndex={cat.originalIndex}
                isOpen={!!openMap[cat.originalIndex]}
                onToggleOpen={() => toggleAccordion(cat.originalIndex)}
                filteredProblems={cat.filteredProblems}
                checkedState={checkedState}
                onToggleProblem={toggleProblem}
              />
            ))
          )}
        </main>
      </div>
    </div>
  );
}
