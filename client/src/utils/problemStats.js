// client/src/utils/problemStats.js
// Aggregator and LeetCode-style metrics engine across all DSA & Company sheets

import ALL_SHEETS_REGISTRY, { getAllDsaSheetsMeta } from './dsaAdapter';
import { getCompanyMetaList, getCompanySheet } from './companyAdapter';

/**
 * Normalizes problem difficulty into 'Easy', 'Medium', or 'Hard'.
 */
export function normalizeDifficulty(diff) {
  if (!diff) return 'Medium';
  const d = String(diff).trim().toUpperCase();
  if (d === 'E' || d === 'EASY') return 'Easy';
  if (d === 'H' || d === 'HARD') return 'Hard';
  return 'Medium'; // default for 'M', 'Medium', or unknown
}

let cachedRegistry = null;

/**
 * Collects all unique problems across all sheets and company sheets.
 * Deduplicates by problem slug.
 */
export function getAllUniqueProblemsRegistry() {
  if (cachedRegistry) return cachedRegistry;

  const problemsMap = new Map();
  const sheetsBreakdown = [];

  // 1. Process all 22 DSA Sheets
  const dsaMeta = getAllDsaSheetsMeta();
  dsaMeta.forEach((sheetMeta) => {
    const sheetData = ALL_SHEETS_REGISTRY[sheetMeta.slug];
    if (!sheetData || !sheetData.categories) return;

    let sheetTotal = 0;
    const sheetSlugs = [];

    sheetData.categories.forEach((cat) => {
      (cat.problems || []).forEach((prob) => {
        const slug = Array.isArray(prob) ? prob[0] : prob.slug;
        const diffRaw = Array.isArray(prob) ? prob[1] : (prob.diff || 'E');
        const title = Array.isArray(prob) ? prob[2] : (prob.title || slug);
        const url = Array.isArray(prob) ? prob[3] : prob.url;

        if (!slug) return;
        sheetTotal++;
        sheetSlugs.push(slug);

        if (!problemsMap.has(slug)) {
          problemsMap.set(slug, {
            slug,
            title,
            diff: normalizeDifficulty(diffRaw),
            url,
            primarySheet: sheetData.title,
            sheetSlug: sheetMeta.slug,
          });
        }
      });
    });

    sheetsBreakdown.push({
      slug: sheetMeta.slug,
      title: sheetData.title || sheetMeta.name,
      shortLabel: sheetData.shortLabel || sheetMeta.name,
      total: sheetTotal,
      slugs: sheetSlugs,
      type: 'dsa',
    });
  });

  // 2. Process Company Sheets
  const companies = getCompanyMetaList();
  companies.forEach((comp) => {
    const sheetData = getCompanySheet(comp.slug);
    if (!sheetData || !sheetData.categories) return;

    let compTotal = 0;
    const compSlugs = [];

    sheetData.categories.forEach((cat) => {
      (cat.problems || []).forEach((prob) => {
        const slug = Array.isArray(prob) ? prob[0] : prob.slug;
        const diffRaw = Array.isArray(prob) ? prob[1] : (prob.diff || 'E');
        const title = Array.isArray(prob) ? prob[2] : (prob.title || slug);
        const url = Array.isArray(prob) ? prob[3] : prob.url;

        if (!slug) return;
        compTotal++;
        compSlugs.push(slug);

        if (!problemsMap.has(slug)) {
          problemsMap.set(slug, {
            slug,
            title,
            diff: normalizeDifficulty(diffRaw),
            url,
            primarySheet: sheetData.title,
            sheetSlug: comp.slug,
          });
        }
      });
    });

    sheetsBreakdown.push({
      slug: comp.slug,
      title: sheetData.title,
      shortLabel: comp.name || sheetData.title,
      total: compTotal,
      slugs: compSlugs,
      type: 'company',
    });
  });

  cachedRegistry = {
    problemsMap,
    allProblems: Array.from(problemsMap.values()),
    sheetsBreakdown,
  };

  return cachedRegistry;
}

/**
 * Computes live LeetCode stats based on checkedState, starredState, and registry data
 */
export function computeLeetCodeStats(checkedState = {}, starredState = {}, registryData) {
  const reg = registryData || getAllUniqueProblemsRegistry();
  const { allProblems, sheetsBreakdown } = reg;

  const total = allProblems.length;
  let solved = 0;

  const diffCounts = {
    Easy: { total: 0, solved: 0 },
    Medium: { total: 0, solved: 0 },
    Hard: { total: 0, solved: 0 },
  };

  allProblems.forEach((p) => {
    const isSolved = !!checkedState[p.slug];
    const diff = p.diff || 'Medium';

    if (diffCounts[diff]) {
      diffCounts[diff].total++;
      if (isSolved) {
        diffCounts[diff].solved++;
      }
    }

    if (isSolved) {
      solved++;
    }
  });

  const starredCount = Object.keys(starredState).filter((k) => starredState[k]).length;

  const totalPercentage = total > 0 ? ((solved / total) * 100).toFixed(1) : '0.0';
  const easyPercentage =
    diffCounts.Easy.total > 0
      ? ((diffCounts.Easy.solved / diffCounts.Easy.total) * 100).toFixed(1)
      : '0.0';
  const mediumPercentage =
    diffCounts.Medium.total > 0
      ? ((diffCounts.Medium.solved / diffCounts.Medium.total) * 100).toFixed(1)
      : '0.0';
  const hardPercentage =
    diffCounts.Hard.total > 0
      ? ((diffCounts.Hard.solved / diffCounts.Hard.total) * 100).toFixed(1)
      : '0.0';

  const perSheetStats = sheetsBreakdown.map((s) => {
    let sheetSolved = 0;
    s.slugs.forEach((slug) => {
      if (checkedState[slug]) sheetSolved++;
    });
    const pct = s.total > 0 ? Math.round((sheetSolved / s.total) * 100) : 0;
    return {
      slug: s.slug,
      title: s.title,
      shortLabel: s.shortLabel,
      total: s.total,
      solved: sheetSolved,
      percentage: pct,
      type: s.type,
    };
  });

  return {
    total,
    solved,
    totalPercentage,
    easy: {
      total: diffCounts.Easy.total,
      solved: diffCounts.Easy.solved,
      percentage: easyPercentage,
    },
    medium: {
      total: diffCounts.Medium.total,
      solved: diffCounts.Medium.solved,
      percentage: mediumPercentage,
    },
    hard: {
      total: diffCounts.Hard.total,
      solved: diffCounts.Hard.solved,
      percentage: hardPercentage,
    },
    starredCount,
    perSheetStats,
  };
}
