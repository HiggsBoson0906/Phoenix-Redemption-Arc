import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Grid3X3, ChevronUp } from 'lucide-react';
import useAuth from '@/hooks/useAuth.js';
import useProgress from '@/hooks/useProgress.js';

import Navbar from '@/components/common/Navbar.jsx';
import { Header } from '@/components/Header.jsx';
import { StatsCard } from '@/components/StatsCard.jsx';
import { ActivityHeatmap } from '@/components/ActivityHeatmap.jsx';
import { Controls } from '@/components/Controls.jsx';
import { CategoryAccordion } from '@/components/CategoryAccordion.jsx';
import AuthModal from '@/components/common/AuthModal.jsx';
import BackupModal from '@/components/BackupModal.jsx';
import MilestoneToast from '@/components/MilestoneToast.jsx';

import { getDsaSheet, getAllDsaSheetsMeta, titleFromSlug } from '@/utils/dsaAdapter.js';
import { getDsaSheetTheme } from '@/constants/themeColors';
import { getPlatform } from '@/utils/url.js';
import { triggerConfetti } from '@/utils/confetti.js';

/**
 * DSAPage.jsx — Expanded AlgoAtlas DSA Problem Practice Platform.
 * Supports all 22 DSA sheets with unique per-sheet color palettes and progress tracking.
 */
const DSAPage = ({ defaultTab }) => {
  const { user, isAuthenticated } = useAuth();
  const { checkedState, starredState, solveHistory, toggleProblem, toggleStarProblem, resetSheetProgress } = useProgress();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Determine initial sheet slug from param, pathname or defaultTab
  const pathParts = location.pathname.split('/').filter(Boolean);
  let initialTab = defaultTab;
  if (params.sheetSlug) {
    initialTab = params.sheetSlug;
  } else if (pathParts.length > 0) {
    const last = pathParts[pathParts.length - 1];
    if (last !== 'dsa' && last !== 'questions') {
      initialTab = last;
    }
  }
  if (!initialTab) initialTab = 'dp';

  const [activeTab, setActiveTab] = useState(initialTab.toLowerCase());
  const [search, setSearch] = useState('');
  const [selectedDiffs, setSelectedDiffs] = useState([]); // [] means ALL, or ['E'], ['E','M'], etc.
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [hideSolved, setHideSolved] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [heatmapCollapsed, setHeatmapCollapsed] = useState(false);
  const [milestone, setMilestone] = useState(null);
  const [openCategories, setOpenCategories] = useState({});
  const [gridExpanded, setGridExpanded] = useState(false);

  const allSheets = useMemo(() => getAllDsaSheetsMeta(), []);
  const theme = useMemo(() => getDsaSheetTheme(activeTab), [activeTab]);

  const COLLAPSED_COUNT = 7;
  const visibleSheets = useMemo(() => {
    if (gridExpanded) return allSheets;
    const initial = allSheets.slice(0, COLLAPSED_COUNT);
    if (!initial.some((s) => s.slug === activeTab)) {
      const activeSheetObj = allSheets.find((s) => s.slug === activeTab);
      if (activeSheetObj) {
        return [...initial.slice(0, COLLAPSED_COUNT - 1), activeSheetObj];
      }
    }
    return initial;
  }, [allSheets, gridExpanded, activeTab]);

  // Sync activeTab when URL changes
  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      const last = parts[parts.length - 1];
      if (last !== 'dsa' && last !== 'questions') {
        setActiveTab(last.toLowerCase());
      }
    }
  }, [location.pathname]);

  // Apply per-sheet distinct accent colors dynamically to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-glow', theme.glow);
    root.style.setProperty('--accent-dim', theme.border);
    return () => {
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-glow');
      root.style.removeProperty('--accent-dim');
    };
  }, [theme]);

  // Reset category expansion when switching sheet
  useEffect(() => {
    setOpenCategories({});
    setSearch('');
  }, [activeTab]);

  // Retrieve current sheet categories from dsaAdapter
  const currentSheet = useMemo(() => {
    return getDsaSheet(activeTab);
  }, [activeTab]);

  const categories = useMemo(() => {
    return currentSheet.categories || [];
  }, [currentSheet]);

  // Platform problem counts for current sheet (reflecting showStarredOnly if active)
  const platformCounts = useMemo(() => {
    const counts = { ALL: 0, lc: 0, cses: 0, cf: 0, atcoder: 0, gfg: 0, interviewbit: 0, other: 0 };
    categories.forEach((cat) => {
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
  }, [categories, showStarredOnly, starredState]);

  // Total starred questions in current sheet matching platform filter
  const totalStarredInCurrentSheet = useMemo(() => {
    let count = 0;
    categories.forEach((cat) => {
      cat.problems.forEach((prob) => {
        const slug = Array.isArray(prob) ? prob[0] : prob.slug;
        const url = Array.isArray(prob) ? prob[3] : prob.url;

        if (platformFilter !== 'ALL') {
          const p = getPlatform(url);
          if (platformFilter === 'other') {
            if (['lc', 'cf', 'cses', 'atcoder', 'gfg', 'interviewbit'].includes(p)) return;
          } else if (p !== platformFilter) {
            return;
          }
        }

        if (starredState[slug]) count++;
      });
    });
    return count;
  }, [categories, starredState, platformFilter]);

  // Calculate live stats for all sheets (for pills & nav), respecting platformFilter & showStarredOnly
  const sheetStats = useMemo(() => {
    const statsMap = {};
    allSheets.forEach((s) => {
      const d = getDsaSheet(s.slug);
      let total = 0;
      let done = 0;
      (d.categories || []).forEach((cat) => {
        cat.problems.forEach((prob) => {
          const slug = Array.isArray(prob) ? prob[0] : prob.slug;
          const url = Array.isArray(prob) ? prob[3] : prob.url;

          if (showStarredOnly && !starredState[slug]) return;

          if (platformFilter !== 'ALL') {
            const p = getPlatform(url);
            if (platformFilter === 'other') {
              if (['lc', 'cf', 'cses', 'atcoder', 'gfg', 'interviewbit'].includes(p)) return;
            } else if (p !== platformFilter) {
              return;
            }
          }

          total++;
          if (checkedState[slug]) done++;
        });
      });
      statsMap[s.slug] = { done, total };
    });
    return statsMap;
  }, [allSheets, checkedState, starredState, platformFilter, showStarredOnly]);

  // Stats by difficulty for current active sheet, respecting platformFilter & showStarredOnly
  const statsByDiff = useMemo(() => {
    const stats = {
      E: { done: 0, total: 0 },
      M: { done: 0, total: 0 },
      H: { done: 0, total: 0 },
    };

    categories.forEach((cat) => {
      cat.problems.forEach((prob) => {
        const slug = Array.isArray(prob) ? prob[0] : prob.slug;
        const diff = Array.isArray(prob) ? prob[1] : (prob.diff || 'E');
        const url = Array.isArray(prob) ? prob[3] : prob.url;

        if (showStarredOnly && !starredState[slug]) return;

        if (platformFilter !== 'ALL') {
          const p = getPlatform(url);
          if (platformFilter === 'other') {
            if (['lc', 'cf', 'cses', 'atcoder', 'gfg', 'interviewbit'].includes(p)) return;
          } else if (p !== platformFilter) {
            return;
          }
        }

        if (stats[diff]) {
          stats[diff].total++;
          if (checkedState[slug]) stats[diff].done++;
        }
      });
    });

    return stats;
  }, [categories, checkedState, starredState, platformFilter, showStarredOnly]);

  const totalSolvedInCurrentSheet = useMemo(() => {
    return statsByDiff.E.done + statsByDiff.M.done + statsByDiff.H.done;
  }, [statsByDiff]);

  const handleToggleDiff = useCallback((diffKey) => {
    if (diffKey === 'ALL') {
      setSelectedDiffs([]);
      return;
    }
    setSelectedDiffs((prev) => {
      if (prev.length === 0 || prev.length === 3) {
        return [diffKey];
      }
      if (prev.includes(diffKey)) {
        const next = prev.filter((d) => d !== diffKey);
        return next.length === 0 ? [] : next;
      } else {
        const next = [...prev, diffKey];
        return next.length === 3 ? [] : next;
      }
    });
  }, []);

  const handleToggleProblem = useCallback((slug, categoryName, diff) => {
    let catName = categoryName;
    let difficulty = diff;

    if (!catName || !difficulty) {
      for (const cat of categories) {
        const found = cat.problems.find((p) => (Array.isArray(p) ? p[0] : p.slug) === slug);
        if (found) {
          catName = catName || cat.name;
          difficulty = difficulty || (Array.isArray(found) ? found[1] : found.diff);
          break;
        }
      }
    }

    const wasSolved = !!checkedState[slug];
    const willBeSolved = !wasSolved;

    toggleProblem(slug, {
      sheet: activeTab,
      category: catName || '',
      difficulty: difficulty || 'E',
    });

    // Milestone celebrations when solving a problem
    if (willBeSolved) {
      // 1. Check if category is completed
      const targetCat = categories.find((c) => c.name === catName);
      if (targetCat) {
        const isCatComplete = targetCat.problems.every((p) => {
          const s = Array.isArray(p) ? p[0] : p.slug;
          return s === slug || !!checkedState[s];
        });
        if (isCatComplete) {
          triggerConfetti({ particleCount: 75, spread: 75 });
          setMilestone({
            title: 'Category Completed! 🎉',
            message: `Awesome! You solved all problems in "${catName}"!`,
            icon: 'trophy',
          });
          return;
        }
      }

      // 2. Check if total solved reaches milestone
      const newTotal = Object.values(checkedState).filter(Boolean).length + 1;
      if ([10, 25, 50, 100, 150, 200, 250, 300].includes(newTotal)) {
        triggerConfetti({ particleCount: 100, spread: 90 });
        setMilestone({
          title: `Milestone: ${newTotal} Solved! 🚀`,
          message: `Incredible dedication! You've solved ${newTotal} problems across AlgoAtlas!`,
          icon: 'sparkles',
        });
      }
    }
  }, [categories, checkedState, toggleProblem, activeTab]);

  const handlePickRandom = useCallback(() => {
    const candidates = [];
    categories.forEach((cat, catIdx) => {
      cat.problems.forEach((prob) => {
        const slug = Array.isArray(prob) ? prob[0] : prob.slug;
        const diff = Array.isArray(prob) ? prob[1] : (prob.diff || 'E');
        const probTitle = Array.isArray(prob) ? (prob[2] || titleFromSlug(slug)) : (prob.title || titleFromSlug(slug));
        const url = Array.isArray(prob) ? prob[3] : prob.url;

        // Platform filter
        if (platformFilter !== 'ALL') {
          const p = getPlatform(url);
          if (platformFilter === 'other') {
            if (['lc', 'cf', 'cses', 'atcoder', 'gfg', 'interviewbit'].includes(p)) return;
          } else if (p !== platformFilter) {
            return;
          }
        }

        // Starred filter
        if (showStarredOnly && !starredState[slug]) return;

        // Multi-select difficulty filter
        if (selectedDiffs.length > 0 && selectedDiffs.length < 3 && !selectedDiffs.includes(diff)) return;

        // Search query
        if (search) {
          const query = search.toLowerCase();
          if (!probTitle.toLowerCase().includes(query) && !slug.toLowerCase().includes(query)) return;
        }

        candidates.push({
          slug,
          title: probTitle,
          diff,
          catIdx,
          catName: cat.name,
          isSolved: !!checkedState[slug],
        });
      });
    });

    if (candidates.length === 0) {
      setMilestone({
        title: 'No Matching Problems',
        message: 'Try clearing some difficulty, platform, or search filters.',
        icon: 'sparkles',
      });
      return;
    }

    // Prefer unsolved candidates
    const unsolvedCandidates = candidates.filter((c) => !c.isSolved);
    const targetPool = unsolvedCandidates.length > 0 ? unsolvedCandidates : candidates;
    const picked = targetPool[Math.floor(Math.random() * targetPool.length)];

    // Open category
    setOpenCategories((prev) => ({
      ...prev,
      [picked.catIdx]: true,
    }));

    // Scroll & pulse
    setTimeout(() => {
      const el = document.getElementById(`prob-${picked.slug}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('prob-highlight-pulse');
        setTimeout(() => el.classList.remove('prob-highlight-pulse'), 3500);
      }
    }, 180);

    const diffLabel = picked.diff === 'E' ? 'Easy' : picked.diff === 'M' ? 'Medium' : 'Hard';
    setMilestone({
      title: '🎯 Random Problem Picked!',
      message: `${picked.title} (${diffLabel}) in ${picked.catName}`,
      icon: 'sparkles',
    });
  }, [categories, platformFilter, showStarredOnly, starredState, selectedDiffs, search, checkedState]);

  const handleToggleStarProblem = useCallback((slug, categoryName, diff) => {
    let catName = categoryName;
    let difficulty = diff;

    if (!catName || !difficulty) {
      for (const cat of categories) {
        const found = cat.problems.find((p) => (Array.isArray(p) ? p[0] : p.slug) === slug);
        if (found) {
          catName = catName || cat.name;
          difficulty = difficulty || (Array.isArray(found) ? found[1] : found.diff);
          break;
        }
      }
    }

    toggleStarProblem(slug, {
      sheet: activeTab,
      category: catName || '',
      difficulty: difficulty || 'E',
    });
  }, [categories, toggleStarProblem, activeTab]);

  const handleToggleCategory = (index) => {
    setOpenCategories((prev) => ({
      ...prev,
      [index]: prev[index] === undefined ? false : !prev[index],
    }));
  };

  const handleExpandAll = () => {
    const newOpen = {};
    categories.forEach((_, idx) => {
      newOpen[idx] = true;
    });
    setOpenCategories(newOpen);
  };

  const handleCollapseAll = () => {
    const newOpen = {};
    categories.forEach((_, idx) => {
      newOpen[idx] = false;
    });
    setOpenCategories(newOpen);
  };

  const handleResetProgress = () => {
    const sheetSlugs = [];
    categories.forEach((cat) => {
      cat.problems.forEach((prob) => {
        const slug = Array.isArray(prob) ? prob[0] : prob.slug;
        sheetSlugs.push(slug);
      });
    });
    resetSheetProgress(activeTab, sheetSlugs);
  };

  const handleSelectSheet = (slug) => {
    setActiveTab(slug);
    navigate(`/dsa/${slug}`);
  };

  return (
    <div className="wrap" data-sheet={activeTab}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSelectSheet}
        sheetStats={sheetStats}
      />

      {/* DSA 22 Sheets Expandable Grid Selector */}
      <div className="sheet-grid-container" style={{ margin: '14px 0 20px 0' }}>
        <div className="sheet-selector-header">
          <div className="sheet-selector-title">
            <span>Choose DSA Sheet ({allSheets.length} Topic Sheets)</span>
            <button
              type="button"
              onClick={() => setGridExpanded((prev) => !prev)}
              className="grid-toggle-btn"
              title={gridExpanded ? "Collapse Sheets Grid" : "Expand All 22 Sheets Grid"}
            >
              {gridExpanded ? <ChevronUp size={13} /> : <Grid3X3 size={13} />}
              <span>{gridExpanded ? 'Collapse Grid ▴' : `Expand Grid (${allSheets.length}) ▾`}</span>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>
              {sheetStats[activeTab]?.done || 0} / {sheetStats[activeTab]?.total || 0} Solved
            </span>
          </div>
        </div>

        <div className="sheet-grid">
          {visibleSheets.map((sheet) => {
            const isActive = activeTab === sheet.slug;
            const sheetTheme = getDsaSheetTheme(sheet.slug);
            const stats = sheetStats[sheet.slug] || { done: 0, total: 0 };
            const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

            return (
              <button
                key={sheet.slug}
                onClick={() => handleSelectSheet(sheet.slug)}
                className={`sheet-pill-btn ${isActive ? 'active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isActive ? `1px solid ${sheetTheme.accent}` : '1px solid var(--line)',
                  background: isActive ? sheetTheme.bgGlow : 'var(--panel)',
                  color: isActive ? 'var(--text)' : 'var(--text-dim)',
                  boxShadow: isActive ? `0 0 14px ${sheetTheme.glow}` : '0 2px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{sheet.icon || '📄'}</span>
                <span style={{ fontWeight: isActive ? '700' : '600', color: 'var(--text)' }}>
                  {sheet.title.replace(' Sheet', '')}
                </span>
                {stats.total > 0 && (
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 6,
                    background: pct === 100 ? '#10b981' : (isActive ? sheetTheme.border : 'var(--line-soft)'),
                    color: pct === 100 ? '#ffffff' : (isActive ? sheetTheme.text : 'var(--text-dim)'),
                    border: `1px solid ${isActive ? sheetTheme.border : 'var(--line)'}`,
                  }}>
                    {stats.done}/{stats.total}
                  </span>
                )}
              </button>
            );
          })}

          {/* Collapsed mode inline pill button */}
          {!gridExpanded && allSheets.length > visibleSheets.length && (
            <button
              type="button"
              onClick={() => setGridExpanded(true)}
              className="sheet-pill-btn expand-more-pill"
              title="Expand all 22 DSA sheets"
            >
              <Grid3X3 size={13} />
              <span>+{allSheets.length - visibleSheets.length} More Sheets ▾</span>
            </button>
          )}

          {/* Expanded mode inline Collapse pill button */}
          {gridExpanded && (
            <button
              type="button"
              onClick={() => setGridExpanded(false)}
              className="sheet-pill-btn expand-more-pill"
              title="Collapse to compact view"
            >
              <ChevronUp size={13} />
              <span>Collapse Grid ▴</span>
            </button>
          )}
        </div>
      </div>

      <Header
        activeTab={activeTab}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onResetProgress={handleResetProgress}
        totalSolved={totalSolvedInCurrentSheet}
        onOpenBackup={() => setShowBackupModal(true)}
      />

      <StatsCard statsByDiff={statsByDiff} />

      <Controls
        search={search}
        setSearch={setSearch}
        selectedDiffs={selectedDiffs}
        onToggleDiff={handleToggleDiff}
        platformFilter={platformFilter}
        setPlatformFilter={setPlatformFilter}
        platformCounts={platformCounts}
        showStarredOnly={showStarredOnly}
        setShowStarredOnly={setShowStarredOnly}
        starredCount={totalStarredInCurrentSheet}
        hideSolved={hideSolved}
        setHideSolved={setHideSolved}
        onPickRandom={handlePickRandom}
      />

      <div className="categories-list" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {categories.map((category, catIndex) => {
          const filteredProblems = category.problems.filter((prob) => {
            const slug = Array.isArray(prob) ? prob[0] : prob.slug;
            const diff = Array.isArray(prob) ? prob[1] : (prob.diff || 'E');
            const probTitle = Array.isArray(prob) ? (prob[2] || titleFromSlug(slug)) : (prob.title || titleFromSlug(slug));
            const url = Array.isArray(prob) ? prob[3] : prob.url;

            // Hide solved filter
            if (hideSolved && checkedState[slug]) {
              return false;
            }

            // Starred filter
            if (showStarredOnly && !starredState[slug]) {
              return false;
            }

            // Platform filter
            if (platformFilter !== 'ALL') {
              const p = getPlatform(url);
              if (platformFilter === 'other') {
                if (['lc', 'cf', 'cses', 'atcoder', 'gfg', 'interviewbit'].includes(p)) return false;
              } else if (p !== platformFilter) {
                return false;
              }
            }

            // Multi-select difficulty filter
            const matchesDiff =
              selectedDiffs.length === 0 ||
              selectedDiffs.length === 3 ||
              selectedDiffs.includes(diff);

            const titleLower = probTitle.toLowerCase();
            const query = search.toLowerCase();
            const matchesSearch =
              !query || titleLower.includes(query) || slug.toLowerCase().includes(query);
            return matchesDiff && matchesSearch;
          });

          // Keep category open when actively searching or filtering by difficulty/platform/starred/hideSolved
          const isOpen =
            search || selectedDiffs.length > 0 || platformFilter !== 'ALL' || showStarredOnly || hideSolved
              ? (filteredProblems.length > 0 ? (openCategories[catIndex] !== false) : false)
              : openCategories[catIndex] !== false;

          return (
            <CategoryAccordion
              key={category.name || catIndex}
              category={category}
              catIndex={catIndex}
              isOpen={isOpen}
              onToggleOpen={() => handleToggleCategory(catIndex)}
              filteredProblems={filteredProblems}
              checkedState={checkedState}
              onToggleProblem={(slug) => handleToggleProblem(slug, category.name)}
              platformFilter={platformFilter}
              starredState={starredState}
              onToggleStar={(slug) => handleToggleStarProblem(slug, category.name)}
              showStarredOnly={showStarredOnly}
            />
          );
        })}
      </div>

      <BackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
      />

      <MilestoneToast
        notification={milestone}
        onClose={() => setMilestone(null)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="Sign in to save your progress across all devices."
      />
    </div>
  );
};

export default DSAPage;
