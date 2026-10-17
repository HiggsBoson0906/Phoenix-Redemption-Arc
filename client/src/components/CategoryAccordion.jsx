import React, { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { ProblemRow } from './ProblemRow';
import { getPlatform } from '@/utils/url';

export function CategoryAccordion({
  category,
  catIndex,
  isOpen,
  onToggleOpen,
  filteredProblems,
  checkedState,
  onToggleProblem,
  platformFilter = 'ALL',
  starredState = {},
  onToggleStar,
  showStarredOnly = false,
}) {
  // Problems in this category matching active platform & starred filter
  const visibleCategoryProblems = useMemo(() => {
    return category.problems.filter((prob) => {
      const slug = Array.isArray(prob) ? prob[0] : prob.slug;
      const url = Array.isArray(prob) ? prob[3] : prob.url;

      if (showStarredOnly && !starredState[slug]) {
        return false;
      }

      if (platformFilter !== 'ALL') {
        const p = getPlatform(url);
        if (platformFilter === 'other') {
          if (['lc', 'cf', 'cses', 'atcoder', 'gfg', 'interviewbit'].includes(p)) return false;
        } else if (p !== platformFilter) {
          return false;
        }
      }
      return true;
    });
  }, [category.problems, platformFilter, showStarredOnly, starredState]);

  const totalInCat = visibleCategoryProblems.length;
  const doneInCat = visibleCategoryProblems.filter((prob) => {
    const slug = Array.isArray(prob) ? prob[0] : prob.slug;
    return !!checkedState[slug];
  }).length;
  const pct = totalInCat > 0 ? (doneInCat / totalInCat) * 100 : 0;
  const indexLabel = String(catIndex + 1).padStart(2, '0');

  return (
    <div className={`category-card ${totalInCat === 0 ? 'category-empty-filter' : ''}`}>
      <div className="cat-header" onClick={onToggleOpen}>
        <div className="cat-index">{indexLabel}</div>
        <div className="cat-name">{category.name}</div>
        
        <div className="cat-bar-wrap">
          <div className="cat-bar">
            <div className="cat-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="cat-count">
            {doneInCat}/{totalInCat}
          </div>
        </div>

        <ChevronDown className={`chevron-icon ${isOpen ? 'open' : ''}`} size={16} />
      </div>

      {isOpen && (
        <div className="cat-body">
          {filteredProblems.length === 0 ? (
            <div className="empty-msg" style={{ border: 'none', borderRadius: 0, padding: '20px' }}>
              {showStarredOnly
                ? 'No starred problems in this category.'
                : 'No problems match your filters in this category.'}
            </div>
          ) : (
            filteredProblems.map((prob) => {
              const slug = Array.isArray(prob) ? prob[0] : prob.slug;
              const diff = Array.isArray(prob) ? prob[1] : (prob.diff || 'E');
              const title = Array.isArray(prob) ? prob[2] : prob.title;
              const url = Array.isArray(prob) ? prob[3] : prob.url;

              return (
                <ProblemRow
                  key={slug}
                  slug={slug}
                  diff={diff}
                  title={title}
                  url={url}
                  isChecked={!!checkedState[slug]}
                  onToggle={onToggleProblem}
                  isStarred={!!starredState[slug]}
                  onToggleStar={onToggleStar}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
