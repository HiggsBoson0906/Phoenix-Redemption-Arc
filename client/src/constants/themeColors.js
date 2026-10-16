// client/src/constants/themeColors.js
// Distinct, vibrant color palettes for every DSA sheet and Company sheet

export const COMPANY_THEMES = {
  'de-shaw': {
    name: 'DE Shaw',
    accent: '#10b981',       // Emerald
    glow: 'rgba(16, 185, 129, 0.25)',
    bgGlow: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.4)',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    barGradient: 'linear-gradient(90deg, #10b981, #059669)',
    text: '#34d399',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
  },
  'rippling': {
    name: 'Rippling',
    accent: '#f97316',       // Sunset Coral/Orange
    glow: 'rgba(249, 115, 22, 0.25)',
    bgGlow: 'rgba(249, 115, 22, 0.08)',
    border: 'rgba(249, 115, 22, 0.4)',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    barGradient: 'linear-gradient(90deg, #f97316, #ea580c)',
    text: '#fb923c',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
  },
  'titan': {
    name: 'Titan',
    accent: '#06b6d4',       // Electric Cyan
    glow: 'rgba(6, 182, 212, 0.25)',
    bgGlow: 'rgba(6, 182, 212, 0.08)',
    border: 'rgba(6, 182, 212, 0.4)',
    gradient: 'linear-gradient(135deg, #06b6d4, #0284c7)',
    barGradient: 'linear-gradient(90deg, #06b6d4, #0ea5e9)',
    text: '#22d3ee',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
  },
  'tekion': {
    name: 'Tekion',
    accent: '#eab308',       // Golden Amber
    glow: 'rgba(234, 179, 8, 0.25)',
    bgGlow: 'rgba(234, 179, 8, 0.08)',
    border: 'rgba(234, 179, 8, 0.4)',
    gradient: 'linear-gradient(135deg, #eab308, #d97706)',
    barGradient: 'linear-gradient(90deg, #eab308, #f59e0b)',
    text: '#fde047',
    badgeBg: 'rgba(234, 179, 8, 0.15)',
  },
};

export const DSA_SHEET_THEMES = {
  'dp': {
    accent: '#8b5cf6',       // Vivid Purple
    glow: 'rgba(139, 92, 246, 0.25)',
    bgGlow: 'rgba(139, 92, 246, 0.08)',
    border: 'rgba(139, 92, 246, 0.4)',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    barGradient: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
    text: '#a78bfa',
  },
  'graph': {
    accent: '#10b981',       // Emerald
    glow: 'rgba(16, 185, 129, 0.25)',
    bgGlow: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.4)',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    barGradient: 'linear-gradient(90deg, #10b981, #34d399)',
    text: '#34d399',
  },
  'tree': {
    accent: '#22c55e',       // Spring Green
    glow: 'rgba(34, 197, 94, 0.25)',
    bgGlow: 'rgba(34, 197, 94, 0.08)',
    border: 'rgba(34, 197, 94, 0.4)',
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    barGradient: 'linear-gradient(90deg, #22c55e, #4ade80)',
    text: '#4ade80',
  },
  'binary-search': {
    accent: '#06b6d4',       // Cyan
    glow: 'rgba(6, 182, 212, 0.25)',
    bgGlow: 'rgba(6, 182, 212, 0.08)',
    border: 'rgba(6, 182, 212, 0.4)',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    barGradient: 'linear-gradient(90deg, #06b6d4, #22d3ee)',
    text: '#22d3ee',
  },
  'two-pointer': {
    accent: '#f97316',       // Sunset Orange
    glow: 'rgba(249, 115, 22, 0.25)',
    bgGlow: 'rgba(249, 115, 22, 0.08)',
    border: 'rgba(249, 115, 22, 0.4)',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    barGradient: 'linear-gradient(90deg, #f97316, #fb923c)',
    text: '#fb923c',
  },
  'sliding-window': {
    accent: '#3b82f6',       // Blue
    glow: 'rgba(59, 130, 246, 0.25)',
    bgGlow: 'rgba(59, 130, 246, 0.08)',
    border: 'rgba(59, 130, 246, 0.4)',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    barGradient: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
    text: '#60a5fa',
  },
  'greedy': {
    accent: '#eab308',       // Golden
    glow: 'rgba(234, 179, 8, 0.25)',
    bgGlow: 'rgba(234, 179, 8, 0.08)',
    border: 'rgba(234, 179, 8, 0.4)',
    gradient: 'linear-gradient(135deg, #eab308, #ca8a04)',
    barGradient: 'linear-gradient(90deg, #eab308, #fde047)',
    text: '#fde047',
  },
  'backtracking': {
    accent: '#f43f5e',       // Rose
    glow: 'rgba(244, 63, 94, 0.25)',
    bgGlow: 'rgba(244, 63, 94, 0.08)',
    border: 'rgba(244, 63, 94, 0.4)',
    gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
    barGradient: 'linear-gradient(90deg, #f43f5e, #fb7185)',
    text: '#fb7185',
  },
  'range-query': {
    accent: '#ef4444',       // Crimson Red
    glow: 'rgba(239, 68, 68, 0.25)',
    bgGlow: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.4)',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    barGradient: 'linear-gradient(90deg, #ef4444, #f87171)',
    text: '#f87171',
  },
  'string': {
    accent: '#14b8a6',       // Aqua Teal
    glow: 'rgba(20, 184, 166, 0.25)',
    bgGlow: 'rgba(20, 184, 166, 0.08)',
    border: 'rgba(20, 184, 166, 0.4)',
    gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    barGradient: 'linear-gradient(90deg, #14b8a6, #2dd4bf)',
    text: '#2dd4bf',
  },
  'math': {
    accent: '#6366f1',       // Indigo
    glow: 'rgba(99, 102, 241, 0.25)',
    bgGlow: 'rgba(99, 102, 241, 0.08)',
    border: 'rgba(99, 102, 241, 0.4)',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    barGradient: 'linear-gradient(90deg, #6366f1, #818cf8)',
    text: '#818cf8',
  },
  'bit-manipulation': {
    accent: '#84cc16',       // Cyber Lime
    glow: 'rgba(132, 204, 22, 0.25)',
    bgGlow: 'rgba(132, 204, 22, 0.08)',
    border: 'rgba(132, 204, 22, 0.4)',
    gradient: 'linear-gradient(135deg, #84cc16, #65a30d)',
    barGradient: 'linear-gradient(90deg, #84cc16, #a3e635)',
    text: '#a3e635',
  },
  'stack': {
    accent: '#ec4899',       // Hot Pink
    glow: 'rgba(236, 72, 153, 0.25)',
    bgGlow: 'rgba(236, 72, 153, 0.08)',
    border: 'rgba(236, 72, 153, 0.4)',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    barGradient: 'linear-gradient(90deg, #ec4899, #f472b6)',
    text: '#f472b6',
  },
  'queue': {
    accent: '#38bdf8',       // Light Sky
    glow: 'rgba(56, 189, 248, 0.25)',
    bgGlow: 'rgba(56, 189, 248, 0.08)',
    border: 'rgba(56, 189, 248, 0.4)',
    gradient: 'linear-gradient(135deg, #38bdf8, #0284c7)',
    barGradient: 'linear-gradient(90deg, #38bdf8, #7dd3fc)',
    text: '#7dd3fc',
  },
  'deque': {
    accent: '#d946ef',       // Fuchsia
    glow: 'rgba(217, 70, 239, 0.25)',
    bgGlow: 'rgba(217, 70, 239, 0.08)',
    border: 'rgba(217, 70, 239, 0.4)',
    gradient: 'linear-gradient(135deg, #d946ef, #c026d3)',
    barGradient: 'linear-gradient(90deg, #d946ef, #e879f9)',
    text: '#e879f9',
  },
  'linked-list': {
    accent: '#0d9488',       // Deep Teal
    glow: 'rgba(13, 148, 136, 0.25)',
    bgGlow: 'rgba(13, 148, 136, 0.08)',
    border: 'rgba(13, 148, 136, 0.4)',
    gradient: 'linear-gradient(135deg, #0d9488, #0f766e)',
    barGradient: 'linear-gradient(90deg, #0d9488, #14b8a6)',
    text: '#2dd4bf',
  },
  'trie': {
    accent: '#fbbf24',       // Warm Amber
    glow: 'rgba(251, 191, 36, 0.25)',
    bgGlow: 'rgba(251, 191, 36, 0.08)',
    border: 'rgba(251, 191, 36, 0.4)',
    gradient: 'linear-gradient(135deg, #fbbf24, #d97706)',
    barGradient: 'linear-gradient(90deg, #fbbf24, #fcd34d)',
    text: '#fcd34d',
  },
  'heap': {
    accent: '#ea580c',       // Rust Orange
    glow: 'rgba(234, 88, 12, 0.25)',
    bgGlow: 'rgba(234, 88, 12, 0.08)',
    border: 'rgba(234, 88, 12, 0.4)',
    gradient: 'linear-gradient(135deg, #ea580c, #c2410c)',
    barGradient: 'linear-gradient(90deg, #ea580c, #fb923c)',
    text: '#fdba74',
  },
  'array': {
    accent: '#0284c7',       // Ocean Blue
    glow: 'rgba(2, 132, 199, 0.25)',
    bgGlow: 'rgba(2, 132, 199, 0.08)',
    border: 'rgba(2, 132, 199, 0.4)',
    gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
    barGradient: 'linear-gradient(90deg, #0284c7, #38bdf8)',
    text: '#38bdf8',
  },
  'matrix': {
    accent: '#059669',       // Forest Green
    glow: 'rgba(5, 150, 105, 0.25)',
    bgGlow: 'rgba(5, 150, 105, 0.08)',
    border: 'rgba(5, 150, 105, 0.4)',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
    barGradient: 'linear-gradient(90deg, #059669, #10b981)',
    text: '#34d399',
  },
  'game-theory': {
    accent: '#c084fc',       // Lavender Purple
    glow: 'rgba(192, 132, 252, 0.25)',
    bgGlow: 'rgba(192, 132, 252, 0.08)',
    border: 'rgba(192, 132, 252, 0.4)',
    gradient: 'linear-gradient(135deg, #c084fc, #a855f7)',
    barGradient: 'linear-gradient(90deg, #c084fc, #e9d5ff)',
    text: '#d8b4fe',
  },
  'concurrency': {
    accent: '#e11d48',       // Crimson Ruby
    glow: 'rgba(225, 29, 72, 0.25)',
    bgGlow: 'rgba(225, 29, 72, 0.08)',
    border: 'rgba(225, 29, 72, 0.4)',
    gradient: 'linear-gradient(135deg, #e11d48, #be123c)',
    barGradient: 'linear-gradient(90deg, #e11d48, #fb7185)',
    text: '#fb7185',
  },
};

export function getCompanyTheme(slug) {
  const norm = (slug || 'de-shaw').toLowerCase();
  return COMPANY_THEMES[norm] || COMPANY_THEMES['de-shaw'];
}

export function getDsaSheetTheme(slug) {
  const norm = (slug || 'dp').toLowerCase();
  return DSA_SHEET_THEMES[norm] || DSA_SHEET_THEMES.dp;
}

export default {
  COMPANY_THEMES,
  DSA_SHEET_THEMES,
  getCompanyTheme,
  getDsaSheetTheme,
};
