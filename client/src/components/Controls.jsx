import React from 'react';
import { Search, X, Globe, Layers, Star, Shuffle, EyeOff } from 'lucide-react';
import platformLogos from '@/constants/platforms';

export function Controls({
  search,
  setSearch,
  selectedDiffs = [],
  onToggleDiff,
  // Fallbacks for backward compatibility
  diffFilter,
  setDiffFilter,
  platformFilter = 'ALL',
  setPlatformFilter,
  platformCounts = {},
  showStarredOnly = false,
  setShowStarredOnly,
  starredCount,
  hideSolved = false,
  setHideSolved,
  onPickRandom,
}) {
  const platformDefs = [
    { key: 'ALL', label: 'All', icon: null },
    { key: 'lc', label: 'LeetCode', icon: platformLogos.lc },
    { key: 'cses', label: 'CSES', icon: platformLogos.cses },
    { key: 'cf', label: 'Codeforces', icon: platformLogos.cf },
    { key: 'atcoder', label: 'AtCoder', icon: platformLogos.atcoder },
    { key: 'gfg', label: 'GeeksforGeeks', icon: platformLogos.gfg },
    { key: 'interviewbit', label: 'InterviewBit', icon: platformLogos.interviewbit },
    { key: 'other', label: 'Others', icon: null },
  ];

  const visiblePlatforms = platformDefs.filter(
    (p) => p.key === 'ALL' || (platformCounts && platformCounts[p.key] > 0) || platformFilter === p.key
  );

  // Multi-select difficulty determination
  const isAllDiffs =
    !selectedDiffs ||
    selectedDiffs.length === 0 ||
    selectedDiffs.length === 3 ||
    (diffFilter && diffFilter === 'ALL');

  const handleDiffClick = (diffKey) => {
    if (onToggleDiff) {
      onToggleDiff(diffKey);
    } else if (setDiffFilter) {
      setDiffFilter(diffKey);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
      <div className="controls-container" style={{ margin: 0, flexWrap: 'wrap', gap: '10px' }}>
        <div className="search-wrap">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems by title or slug..."
          />
          {search && (
            <X className="clear-icon" size={16} onClick={() => setSearch('')} title="Clear search" />
          )}
        </div>

        <div className="diff-filter" style={{ flexWrap: 'wrap' }}>
          {['ALL', 'E', 'M', 'H'].map((diffKey) => {
            const labels = { ALL: 'ALL', E: 'EASY', M: 'MEDIUM', H: 'HARD' };
            const isActive =
              diffKey === 'ALL'
                ? isAllDiffs
                : !isAllDiffs &&
                  (selectedDiffs.includes(diffKey) || diffFilter === diffKey);

            return (
              <button
                key={diffKey}
                type="button"
                className={`chip ${isActive ? 'active' : ''}`}
                onClick={() => handleDiffClick(diffKey)}
                title={diffKey === 'ALL' ? "Show all difficulties" : `Toggle ${labels[diffKey]} difficulty`}
              >
                {labels[diffKey]}
              </button>
            );
          })}

          {/* Starred Toggle */}
          {setShowStarredOnly && (
            <button
              type="button"
              className={`chip star-toggle-chip ${showStarredOnly ? 'active' : ''}`}
              onClick={() => setShowStarredOnly(!showStarredOnly)}
              title={showStarredOnly ? "Show all questions" : "Show only starred questions"}
            >
              <Star
                size={13}
                fill={showStarredOnly ? '#fbbf24' : 'none'}
                stroke={showStarredOnly ? '#fbbf24' : 'currentColor'}
                strokeWidth={showStarredOnly ? 1.5 : 2}
              />
              <span>STARRED</span>
              {starredCount !== undefined && (
                <span className="platform-badge" style={{ marginLeft: '4px' }}>
                  {starredCount}
                </span>
              )}
            </button>
          )}

          {/* Hide Solved / Unsolved Only Toggle */}
          {setHideSolved && (
            <button
              type="button"
              className={`chip hide-solved-chip ${hideSolved ? 'active' : ''}`}
              onClick={() => setHideSolved(!hideSolved)}
              title={hideSolved ? "Show all questions" : "Show only unsolved questions"}
            >
              <EyeOff size={13} />
              <span>UNSOLVED ONLY</span>
            </button>
          )}

          {/* Pick Random Unsolved Question */}
          {onPickRandom && (
            <button
              type="button"
              className="chip random-pick-chip"
              onClick={onPickRandom}
              title="Pick a random unsolved problem from active filters"
            >
              <Shuffle size={13} />
              <span>PICK RANDOM</span>
            </button>
          )}
        </div>
      </div>

      {/* Platform Filter Toggle Bar */}
      {setPlatformFilter && (
        <div className="platform-filter-bar">
          <div className="platform-filter-label">
            <Globe size={13} />
            <span>Platform:</span>
          </div>
          <div className="platform-chips">
            {visiblePlatforms.map((plat) => {
              const isActive = platformFilter === plat.key;
              const count = platformCounts[plat.key] ?? 0;
              return (
                <button
                  key={plat.key}
                  type="button"
                  className={`platform-chip ${isActive ? 'active' : ''}`}
                  onClick={() => setPlatformFilter(isActive && plat.key !== 'ALL' ? 'ALL' : plat.key)}
                  title={`Filter by ${plat.label} (${count} problems)`}
                >
                  {plat.icon ? (
                    <img
                      src={plat.icon}
                      alt=""
                      style={{ width: 14, height: 14, objectFit: 'contain' }}
                    />
                  ) : plat.key === 'ALL' ? (
                    <Layers size={13} style={{ opacity: 0.8 }} />
                  ) : null}
                  <span>{plat.label}</span>
                  <span className="platform-badge">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Controls;
