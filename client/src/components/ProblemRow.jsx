import React from 'react';
import { Check, ExternalLink, Star } from 'lucide-react';
import { titleFromSlug, DIFF_NAME } from '../data/dpData';
import { extractProblemName, getPlatform, PLATFORM_LABELS } from '@/utils/url';
import platformLogos from '@/constants/platforms';

export function ProblemRow({
  slug,
  diff,
  isChecked,
  onToggle,
  isStarred = false,
  onToggleStar,
  title: customTitle,
  url: customUrl,
}) {
  const problemUrl = customUrl || `https://leetcode.com/problems/${slug}/`;
  const platform = getPlatform(problemUrl);
  const platformLogo = platformLogos[platform];
  const platformLabel = PLATFORM_LABELS[platform] || 'Problem';

  // Use explicit custom title, or extract readable name for CSES/Codeforces/Atcoder, or fallback to slug
  const title = customTitle || extractProblemName(problemUrl) || titleFromSlug(slug);

  const displayDiff = DIFF_NAME[diff] || (diff === 'E' ? 'Easy' : diff === 'M' ? 'Medium' : diff === 'H' ? 'Hard' : diff);

  return (
    <div id={`prob-${slug}`} className={`problem-row ${isChecked ? 'done' : ''} ${isStarred ? 'is-starred' : ''}`}>
      <div
        className={`custom-checkbox ${isChecked ? 'checked' : ''}`}
        onClick={() => onToggle(slug)}
        title={isChecked ? "Mark as unsolved" : "Mark as solved"}
      >
        {isChecked && <Check size={14} strokeWidth={3} />}
      </div>

      <button
        type="button"
        className={`star-btn ${isStarred ? 'starred' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleStar?.(slug);
        }}
        title={isStarred ? "Remove star" : "Star this question"}
        aria-label={isStarred ? "Remove star" : "Star this question"}
      >
        <Star
          size={16}
          fill={isStarred ? '#fbbf24' : 'none'}
          stroke={isStarred ? '#fbbf24' : 'currentColor'}
          strokeWidth={isStarred ? 1.5 : 2}
        />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '22px' }}>
        {platformLogo ? (
          <img
            src={platformLogo}
            alt={platformLabel}
            title={platformLabel}
            style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }}
          />
        ) : (
          <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>
            {platform}
          </span>
        )}
      </div>

      <a
        className="problem-title"
        href={problemUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ flex: 1 }}
      >
        <span>{title}</span>
        <ExternalLink size={13} className="ext-icon" />
      </a>

      <div className={`tag ${diff}`} title={`Difficulty: ${displayDiff}`}>
        {displayDiff}
      </div>
    </div>
  );
}

export default ProblemRow;
