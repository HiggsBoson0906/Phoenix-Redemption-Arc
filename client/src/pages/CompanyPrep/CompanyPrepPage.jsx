import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Search, X, CheckCircle2, ExternalLink } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { getCompanyMetaList, getCompanySheet } from '@/utils/companyAdapter';
import { getCompanyTheme } from '@/constants/themeColors';
import Navbar from '@/components/common/Navbar.jsx';
import { CategoryAccordion } from '@/components/CategoryAccordion';
import { Controls } from '@/components/Controls';
import { getPlatform } from '@/utils/url';

export default function CompanyPrepPage() {
  const { companySlug } = useParams();
  const navigate = useNavigate();
  const { checkedState, starredState, toggleProblem, toggleStarProblem } = useProgress();

  const companies = useMemo(() => getCompanyMetaList(), []);
  const activeSlug = (companySlug || companies[0]?.slug || 'de-shaw').toLowerCase();
  const currentSheet = useMemo(() => getCompanySheet(activeSlug), [activeSlug]);
  const theme = useMemo(() => getCompanyTheme(activeSlug), [activeSlug]);

  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('ALL');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
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

  // Platform counts in current company sheet (respecting showStarredOnly)
  const platformCounts = useMemo(() => {
    const counts = { ALL: 0, lc: 0, cses: 0, cf: 0, atcoder: 0, gfg: 0, interviewbit: 0, other: 0 };
    currentSheet.categories.forEach((cat) => {
      cat.problems.forEach((prob) => {
        const slug = Array.isArray(prob) ? prob[0] : prob.slug;
        if (showStarredOnly && !starredState[slug]) return;

        const url = Array.isArray(prob) ? prob[3] : prob.url;
        const p = getPlatform(url);
        counts.ALL++;
        if (counts[p] !== undefined) {
          counts[p]++;
        } else {
          counts.other++;
        }
      });
    });
    return counts;
  }, [currentSheet, showStarredOnly, starredState]);

  // Total starred questions in current sheet
  const totalStarredInSheet = useMemo(() => {
    return currentSheet.categories.reduce((acc, cat) => {
      return acc + cat.problems.filter((prob) => {
        const slug = Array.isArray(prob) ? prob[0] : prob.slug;
        const url = Array.isArray(prob) ? prob[3] : prob.url;
        if (!starredState[slug]) return false;
        if (platformFilter === 'ALL') return true;
        const p = getPlatform(url);
        if (platformFilter === 'other') {
          return !['lc', 'cf', 'cses', 'atcoder', 'gfg', 'interviewbit'].includes(p);
        }
        return p === platformFilter;
      }).length;
    }, 0);
  }, [currentSheet, starredState, platformFilter]);

  // Stats calculation respecting platformFilter and showStarredOnly
  const totalInSheet = useMemo(() => {
    return currentSheet.categories.reduce((acc, cat) => {
      return acc + cat.problems.filter((prob) => {
        const slug = Array.isArray(prob) ? prob[0] : prob.slug;
        if (showStarredOnly && !starredState[slug]) return false;

        if (platformFilter === 'ALL') return true;
        const url = Array.isArray(prob) ? prob[3] : prob.url;
        const p = getPlatform(url);
        if (platformFilter === 'other') {
          return !['lc', 'cf', 'cses', 'atcoder', 'gfg', 'interviewbit'].includes(p);
        }
        return p === platformFilter;
      }).length;
    }, 0);
  }, [currentSheet, platformFilter, showStarredOnly, starredState]);

  const doneInSheet = useMemo(() => {
    return currentSheet.categories.reduce((acc, cat) => {
      return acc + cat.problems.filter((prob) => {
        const slug = Array.isArray(prob) ? prob[0] : prob.slug;
        if (!checkedState[slug]) return false;
        if (showStarredOnly && !starredState[slug]) return false;

        if (platformFilter === 'ALL') return true;
        const url = Array.isArray(prob) ? prob[3] : prob.url;
        const p = getPlatform(url);
        if (platformFilter === 'other') {
          return !['lc', 'cf', 'cses', 'atcoder', 'gfg', 'interviewbit'].includes(p);
        }
        return p === platformFilter;
      }).length;
    }, 0);
  }, [currentSheet, checkedState, platformFilter, showStarredOnly, starredState]);

  const pctDone = totalInSheet > 0 ? Math.round((doneInSheet / totalInSheet) * 100) : 0;

  const handleToggleStarProblem = (slug, categoryName, diff) => {
    toggleStarProblem(slug, {
      sheet: 'company',
      category: categoryName || '',
      difficulty: diff || 'E',
    });
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return currentSheet.categories.map((cat, catIdx) => {
      const filtered = cat.problems.filter((prob) => {
        const slug = Array.isArray(prob) ? prob[0] : prob.slug;
        const diff = Array.isArray(prob) ? prob[1] : (prob.diff || 'E');
        const title = Array.isArray(prob) ? (prob[2] || slug) : (prob.title || slug);
        const url = Array.isArray(prob) ? prob[3] : prob.url;

        if (showStarredOnly && !starredState[slug]) return false;

        if (platformFilter !== 'ALL') {
          const p = getPlatform(url);
          if (platformFilter === 'other') {
            if (['lc', 'cf', 'cses', 'atcoder', 'gfg', 'interviewbit'].includes(p)) return false;
          } else if (p !== platformFilter) {
            return false;
          }
        }

        const matchesDiff = diffFilter === 'ALL' || diff === diffFilter;
        const matchesSearch = !q || title.toLowerCase().includes(q) || slug.toLowerCase().includes(q);
        return matchesDiff && matchesSearch;
      });
      return {
        ...cat,
        originalIndex: catIdx,
        filteredProblems: filtered,
      };
    }).filter(c => !search && diffFilter === 'ALL' && platformFilter === 'ALL' && !showStarredOnly ? true : c.filteredProblems.length > 0);
  }, [currentSheet, search, diffFilter, platformFilter, showStarredOnly, starredState]);

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

          {/* Controls Bar: Search, Difficulty, Platform, Starred */}
          <Controls
            search={search}
            setSearch={setSearch}
            diffFilter={diffFilter}
            setDiffFilter={setDiffFilter}
            platformFilter={platformFilter}
            setPlatformFilter={setPlatformFilter}
            platformCounts={platformCounts}
            showStarredOnly={showStarredOnly}
            setShowStarredOnly={setShowStarredOnly}
            starredCount={totalStarredInSheet}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '16px', marginTop: '-12px' }}>
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

          {/* Categories Accordion */}
          {filteredCategories.length === 0 ? (
            <div className="empty-msg">
              {showStarredOnly
                ? 'No starred questions found for this company.'
                : 'No company problems matched your search or filter.'}
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
                platformFilter={platformFilter}
                starredState={starredState}
                onToggleStar={(slug) => handleToggleStarProblem(slug, cat.name)}
                showStarredOnly={showStarredOnly}
              />
            ))
          )}
        </main>
      </div>
    </div>
  );
}
