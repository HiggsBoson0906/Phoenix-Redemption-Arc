// client/src/utils/dsaAdapter.js
// Adapter to normalize all 22 DSA sheets into standard AlgoAtlas categories and problems,
// deduplicating DP, Tree, and Graph sheets against existing AlgoAtlas problems while incorporating all unique links (AtCoder, CSES, Codeforces, GfG, etc.)

import problemTitles from '@/constants/problemTitles';
import { normalizeUrl, extractProblemName } from '@/utils/url';
import { DP_CATEGORIES } from '@/data/dpData';
import { TREE_CATEGORIES } from '@/data/treeData';
import { GRAPH_CATEGORIES } from '@/data/graphData';
import { dsaSheets } from '@/content/dsa-sheets/registry';

// Dynamic imports for sheets
import dpSections from '@/data/dpSections';
import treeSections from '@/data/treeSections';
import prepforgeGraphSections from '@/content/dsa-sheets/graph';
import twoPointerSections from '@/content/dsa-sheets/twoPointer';
import slidingWindowSections from '@/content/dsa-sheets/slidingWindow';
import greedySections from '@/content/dsa-sheets/greedy';
import backtrackingSections from '@/content/dsa-sheets/backtracking';
import rangeQuerySections from '@/content/dsa-sheets/rangeQuery';
import stringSections from '@/content/dsa-sheets/stringAlgorithms';
import mathSections from '@/content/dsa-sheets/mathNumberTheory';
import bitManipulationSections from '@/content/dsa-sheets/bitManipulation';
import stackSections from '@/content/dsa-sheets/stack';
import queueSections from '@/content/dsa-sheets/queue';
import dequeSections from '@/content/dsa-sheets/deque';
import linkedListSections from '@/content/dsa-sheets/linkedList';
import trieSections from '@/content/dsa-sheets/trie';
import heapSections from '@/content/dsa-sheets/heap';
import arraySections from '@/content/dsa-sheets/array';
import matrixSections from '@/content/dsa-sheets/matrix';
import gameTheorySections from '@/content/dsa-sheets/gameTheory';
import concurrencySections from '@/content/dsa-sheets/concurrency';
import binarySearchSections from '@/data/binarySearchSections';

export const ROMANS = new Set(["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"]);
export const LOWER = new Set(["a", "an", "the", "to", "and", "of", "in", "with", "for", "from", "at", "on", "is", "as", "or", "by"]);

export function titleFromSlug(slug) {
  if (!slug) return '';
  return slug
    .split("-")
    .map((w, i) => {
      if (ROMANS.has(w.toLowerCase())) return w.toUpperCase();
      if (/^\d/.test(w)) return w.toUpperCase();
      if (i > 0 && LOWER.has(w.toLowerCase())) return w.toLowerCase();
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

export function extractSlugFromUrl(url) {
  if (!url) return 'problem';
  const norm = normalizeUrl(url);
  
  // Match leetcode problem slug
  const lcMatch = url.match(/leetcode\.com\/problems\/([a-z0-9-]+)/i);
  if (lcMatch) return lcMatch[1];
  
  // GFG
  const gfgMatch = url.match(/geeksforgeeks\.org\/problems\/([a-z0-9-]+)/i);
  if (gfgMatch) return gfgMatch[1].replace(/-?\d{4,}$/, '');

  // InterviewBit
  const ibMatch = url.match(/interviewbit\.com\/problems\/([a-z0-9-]+)/i);
  if (ibMatch) return ibMatch[1];

  // CSES
  const csesMatch = url.match(/cses\.fi\/problemset\/task\/(\d+)/i);
  if (csesMatch) return `cses-${csesMatch[1]}`;

  // Codeforces
  const cfMatch = url.match(/codeforces\.com\/(?:problemset|contest\/\d+)\/problem\/(\d+)\/([a-z0-9]+)/i);
  if (cfMatch) return `cf-${cfMatch[1]}${cfMatch[2]}`;

  // AtCoder
  const atcoderMatch = url.match(/atcoder\.jp\/contests\/([a-z0-9_-]+)\/tasks\/([a-z0-9_-]+)/i);
  if (atcoderMatch) return `atcoder-${atcoderMatch[2]}`;

  // Fallback: last segment of normalized URL
  const parts = norm.split('/').filter(Boolean);
  return parts[parts.length - 1] || 'problem';
}

export function getProblemTitle(url, slug) {
  if (url) {
    const extracted = extractProblemName(url);
    if (extracted && !extracted.startsWith('http')) return extracted;
  }
  const norm = normalizeUrl(url);
  if (problemTitles[norm]) return problemTitles[norm];
  return titleFromSlug(slug);
}

// Deterministic difficulty assigner based on index/slug keywords
export function inferDifficulty(slug, indexInSub = 0, totalInSub = 1) {
  const lower = slug.toLowerCase();
  if (lower.includes('iii') || lower.includes('iv') || lower.includes('hard') || indexInSub > totalInSub * 0.75) {
    return 'H';
  }
  if (lower.includes('ii') || lower.includes('medium') || indexInSub > totalInSub * 0.35) {
    return 'M';
  }
  return 'E';
}

/**
 * Converts SheetSection[] into AlgoAtlas Category format:
 * [ { name: string, description?: string, problems: [ [slug, diff, title, url] ] } ]
 */
export function convertSectionsToAlgoAtlasCategories(sections) {
  return sections.map((sec, secIdx) => {
    const rawLinks = sec.links || [];
    const problems = rawLinks.map((url, linkIdx) => {
      const slug = extractSlugFromUrl(url);
      const title = getProblemTitle(url, slug);
      const diff = inferDifficulty(slug, linkIdx, rawLinks.length);
      return [slug, diff, title, url];
    });

    return {
      name: sec.title,
      description: sec.description || '',
      problems,
    };
  });
}

/**
 * Merges PrepForge sections into existing AlgoAtlas categories while deduplicating problems.
 * Keeps all original problems intact and appends only unique non-duplicated questions
 * (e.g., Codeforces, AtCoder, CSES, GfG, etc.).
 */
function mergeUniqueSections(baseCategories, additionalSections) {
  const existingSlugs = new Set();
  const existingUrls = new Set();

  baseCategories.forEach(cat => {
    cat.problems.forEach(p => {
      const slug = Array.isArray(p) ? p[0] : p.slug;
      const url = Array.isArray(p) ? p[3] : p.url;
      if (slug) existingSlugs.add(slug.toLowerCase());
      if (url) existingUrls.add(normalizeUrl(url));
    });
  });

  const additionalCategories = [];

  additionalSections.forEach(sec => {
    const rawLinks = sec.links || [];
    const uniqueProblems = [];

    rawLinks.forEach((url, linkIdx) => {
      const slug = extractSlugFromUrl(url);
      const norm = normalizeUrl(url);

      if (!existingSlugs.has(slug.toLowerCase()) && !existingUrls.has(norm)) {
        existingSlugs.add(slug.toLowerCase());
        existingUrls.add(norm);

        const title = getProblemTitle(url, slug);
        const diff = inferDifficulty(slug, linkIdx, rawLinks.length);
        uniqueProblems.push([slug, diff, title, url]);
      }
    });

    if (uniqueProblems.length > 0) {
      additionalCategories.push({
        name: sec.title,
        description: sec.description || '',
        problems: uniqueProblems,
      });
    }
  });

  return [...baseCategories, ...additionalCategories];
}

// Base categories with LeetCode URLs
const baseDpCategories = DP_CATEGORIES.map(c => ({
  name: c.name,
  problems: c.problems.map(([slug, diff]) => [slug, diff, titleFromSlug(slug), `https://leetcode.com/problems/${slug}/`])
}));

const baseTreeCategories = TREE_CATEGORIES.map(c => ({
  name: c.name,
  problems: c.problems.map(([slug, diff]) => [slug, diff, titleFromSlug(slug), `https://leetcode.com/problems/${slug}/`])
}));

const baseGraphCategories = GRAPH_CATEGORIES.map(c => ({
  name: c.name,
  problems: c.problems.map(([slug, diff]) => [slug, diff, titleFromSlug(slug), `https://leetcode.com/problems/${slug}/`])
}));

// Registry map of all DSA sheets with their categories
const ALL_SHEETS_REGISTRY = {
  dp: {
    slug: 'dp',
    title: 'Dynamic Programming',
    shortLabel: 'DP',
    categories: mergeUniqueSections(baseDpCategories, dpSections),
  },
  tree: {
    slug: 'tree',
    title: 'Binary Trees & BST',
    shortLabel: 'Trees',
    categories: mergeUniqueSections(baseTreeCategories, treeSections),
  },
  graph: {
    slug: 'graph',
    title: 'Graph Algorithms',
    shortLabel: 'Graphs',
    categories: mergeUniqueSections(baseGraphCategories, prepforgeGraphSections),
  },
  'binary-search': {
    slug: 'binary-search',
    title: 'Binary Search',
    shortLabel: 'Binary Search',
    categories: convertSectionsToAlgoAtlasCategories(binarySearchSections),
  },
  'two-pointer': {
    slug: 'two-pointer',
    title: 'Two Pointer',
    shortLabel: 'Two Pointer',
    categories: convertSectionsToAlgoAtlasCategories(twoPointerSections),
  },
  'sliding-window': {
    slug: 'sliding-window',
    title: 'Sliding Window',
    shortLabel: 'Sliding Window',
    categories: convertSectionsToAlgoAtlasCategories(slidingWindowSections),
  },
  greedy: {
    slug: 'greedy',
    title: 'Greedy Algorithms',
    shortLabel: 'Greedy',
    categories: convertSectionsToAlgoAtlasCategories(greedySections),
  },
  backtracking: {
    slug: 'backtracking',
    title: 'Backtracking',
    shortLabel: 'Backtracking',
    categories: convertSectionsToAlgoAtlasCategories(backtrackingSections),
  },
  'range-query': {
    slug: 'range-query',
    title: 'Range Queries (Segment Tree & BIT)',
    shortLabel: 'Range Query',
    categories: convertSectionsToAlgoAtlasCategories(rangeQuerySections),
  },
  string: {
    slug: 'string',
    title: 'String Algorithms & Pattern Matching',
    shortLabel: 'Strings',
    categories: convertSectionsToAlgoAtlasCategories(stringSections),
  },
  math: {
    slug: 'math',
    title: 'Math & Number Theory',
    shortLabel: 'Math',
    categories: convertSectionsToAlgoAtlasCategories(mathSections),
  },
  'bit-manipulation': {
    slug: 'bit-manipulation',
    title: 'Bit Manipulation',
    shortLabel: 'Bit Manipulation',
    categories: convertSectionsToAlgoAtlasCategories(bitManipulationSections),
  },
  stack: {
    slug: 'stack',
    title: 'Stack & Monotonic Stack',
    shortLabel: 'Stack',
    categories: convertSectionsToAlgoAtlasCategories(stackSections),
  },
  queue: {
    slug: 'queue',
    title: 'Queue & BFS Mechanics',
    shortLabel: 'Queue',
    categories: convertSectionsToAlgoAtlasCategories(queueSections),
  },
  deque: {
    slug: 'deque',
    title: 'Deque & Monotonic Queue',
    shortLabel: 'Deque',
    categories: convertSectionsToAlgoAtlasCategories(dequeSections),
  },
  'linked-list': {
    slug: 'linked-list',
    title: 'Linked List Patterns',
    shortLabel: 'Linked List',
    categories: convertSectionsToAlgoAtlasCategories(linkedListSections),
  },
  trie: {
    slug: 'trie',
    title: 'Trie (Prefix Tree)',
    shortLabel: 'Trie',
    categories: convertSectionsToAlgoAtlasCategories(trieSections),
  },
  heap: {
    slug: 'heap',
    title: 'Heap & Priority Queue',
    shortLabel: 'Heap',
    categories: convertSectionsToAlgoAtlasCategories(heapSections),
  },
  array: {
    slug: 'array',
    title: 'Array & Ad-Hoc Techniques',
    shortLabel: 'Arrays',
    categories: convertSectionsToAlgoAtlasCategories(arraySections),
  },
  matrix: {
    slug: 'matrix',
    title: 'Matrix & 2D Grid Traversals',
    shortLabel: 'Matrix',
    categories: convertSectionsToAlgoAtlasCategories(matrixSections),
  },
  'game-theory': {
    slug: 'game-theory',
    title: 'Game Theory & Optimal Play',
    shortLabel: 'Game Theory',
    categories: convertSectionsToAlgoAtlasCategories(gameTheorySections),
  },
  concurrency: {
    slug: 'concurrency',
    title: 'Concurrency & Multithreading',
    shortLabel: 'Concurrency',
    categories: convertSectionsToAlgoAtlasCategories(concurrencySections),
  },
};

export function getDsaSheet(sheetSlug) {
  const normSlug = (sheetSlug || 'dp').toLowerCase();
  return ALL_SHEETS_REGISTRY[normSlug] || ALL_SHEETS_REGISTRY.dp;
}

export function getAllDsaSheetsMeta() {
  return dsaSheets;
}

export default ALL_SHEETS_REGISTRY;
