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
  const existingSlugs = new Set();
  const existingUrls = new Set();

  return sections.map((sec) => {
    const rawLinks = sec.links || [];
    const problems = [];
    rawLinks.forEach((url, linkIdx) => {
      const slug = extractSlugFromUrl(url);
      const norm = normalizeUrl(url);
      const slugKey = slug ? slug.toLowerCase() : '';

      if (slugKey && existingSlugs.has(slugKey)) return;
      if (norm && existingUrls.has(norm)) return;

      if (slugKey) existingSlugs.add(slugKey);
      if (norm) existingUrls.add(norm);

      const title = getProblemTitle(url, slug);
      const diff = inferDifficulty(slug, linkIdx, rawLinks.length);
      problems.push([slug, diff, title, url]);
    });

    return {
      name: sec.title,
      description: sec.description || '',
      problems,
    };
  }).filter(cat => cat.problems.length > 0);
}

/**
 * Merges PrepForge sections into existing AlgoAtlas categories while deduplicating problems.
 * Keeps all original problems intact and appends only unique non-duplicated questions
 * (e.g., Codeforces, AtCoder, CSES, GfG, etc.).
 */
/**
 * Merges PrepForge sections into existing AlgoAtlas categories while deduplicating problems.
 * Unifies duplicate and overlapping categories into single coherent topics.
 */
function mergeUnifiedSections(baseCategories, additionalSections, categoryMapping = {}, canonicalOrder = []) {
  const existingSlugs = new Set();
  const existingUrls = new Set();

  const categoryMap = new Map();

  const getCanonicalName = (rawName) => {
    return categoryMapping[rawName] || rawName;
  };

  const getOrCreateCategory = (canonicalName, description = '') => {
    if (!categoryMap.has(canonicalName)) {
      categoryMap.set(canonicalName, {
        name: canonicalName,
        description: description || '',
        problems: [],
      });
    }
    return categoryMap.get(canonicalName);
  };

  // 1. Process base categories
  baseCategories.forEach(cat => {
    const canonicalName = getCanonicalName(cat.name);
    const targetCat = getOrCreateCategory(canonicalName, cat.description);

    cat.problems.forEach(p => {
      const slug = Array.isArray(p) ? p[0] : p.slug;
      const url = Array.isArray(p) ? p[3] : p.url;
      const slugKey = slug ? slug.toLowerCase() : '';
      const urlKey = url ? normalizeUrl(url) : '';

      if (slugKey && existingSlugs.has(slugKey)) return;
      if (urlKey && existingUrls.has(urlKey)) return;

      if (slugKey) existingSlugs.add(slugKey);
      if (urlKey) existingUrls.add(urlKey);

      targetCat.problems.push(p);
    });
  });

  // 2. Process additional sections
  additionalSections.forEach(sec => {
    const canonicalName = getCanonicalName(sec.title);
    const targetCat = getOrCreateCategory(canonicalName, sec.description);

    const rawLinks = sec.links || [];
    rawLinks.forEach((url, linkIdx) => {
      const slug = extractSlugFromUrl(url);
      const norm = normalizeUrl(url);
      const slugKey = slug ? slug.toLowerCase() : '';

      if (slugKey && existingSlugs.has(slugKey)) return;
      if (norm && existingUrls.has(norm)) return;

      if (slugKey) existingSlugs.add(slugKey);
      if (norm) existingUrls.add(norm);

      const title = getProblemTitle(url, slug);
      const diff = inferDifficulty(slug, linkIdx, rawLinks.length);
      targetCat.problems.push([slug, diff, title, url]);
    });
  });

  // 3. Order categories deterministically
  const orderedList = [];
  const addedNames = new Set();

  canonicalOrder.forEach(name => {
    if (categoryMap.has(name)) {
      const cat = categoryMap.get(name);
      if (cat.problems.length > 0) {
        orderedList.push(cat);
      }
      addedNames.add(name);
    }
  });

  categoryMap.forEach((cat, name) => {
    if (!addedNames.has(name) && cat.problems.length > 0) {
      orderedList.push(cat);
    }
  });

  return orderedList;
}

// DP Mappings & Canonical Order
const DP_CATEGORY_MAPPING = {
  'Linear DP': 'Linear DP — One-Dimensional Recurrences',
  '1. Linear DP — One-Dimensional Recurrences': 'Linear DP — One-Dimensional Recurrences',
  'Classic DP — Kadane\'s Algorithm': 'Kadane\'s Algorithm & Maximum Subarray Family',
  '2. Kadane & Maximum Subarray Family': 'Kadane\'s Algorithm & Maximum Subarray Family',
  'Knapsack': '0/1 Knapsack & Subset Sum Family',
  '3. 0/1 Knapsack & Subset Sum Family': '0/1 Knapsack & Subset Sum Family',
  '4. Unbounded Knapsack & Coin Change Family': 'Unbounded Knapsack & Coin Change Family',
  'Classic DP — LIS Family': 'Longest Increasing Subsequence (LIS) Family',
  '5. Longest Increasing Subsequence (LIS) Family': 'Longest Increasing Subsequence (LIS) Family',
  'Classic DP — LCS Family': 'Two-Sequence DP — LCS & Edit Distance Family',
  '6. Two-Sequence DP — LCS & Edit Distance Family': 'Two-Sequence DP — LCS & Edit Distance Family',
  'Classic DP — 2D Grid Traversal': 'Grid & Multi-Dimensional DP',
  'Multi-Dimensional DP': 'Grid & Multi-Dimensional DP',
  '7. Grid & 2D Path DP': 'Grid & Multi-Dimensional DP',
  '8. State-Machine DP — Buy & Sell Stock Family': 'State-Machine DP — Buy & Sell Stock Family',
  '9. Partition DP & Palindrome Partitioning Family': 'Partition DP & Palindrome Partitioning Family',
  'Interval DP': 'Interval DP — MCM & Burst Balloons',
  '10. Interval DP — MCM & Burst Balloons': 'Interval DP — MCM & Burst Balloons',
  '11. Game Theory DP — Stone Game Family': 'Game Theory DP — Stone Game Family',
  'Bitmask DP': 'Bitmask DP',
  '12. Bitmask DP': 'Bitmask DP',
  'Digit DP': 'Digit DP',
  '13. Digit DP': 'Digit DP',
  'DP on Trees': 'DP on Trees',
  '14. DP on Trees': 'DP on Trees',
  'Graph DP': 'DP on Graphs & DAGs',
  '15. DP on Graphs & DAGs': 'DP on Graphs & DAGs',
  'Probability DP': 'Probability & Expected-Value DP',
  '16. Probability & Expected-Value DP': 'Probability & Expected-Value DP',
  '17. Counting & Combinatorial DP': 'Counting & Combinatorial DP',
  '18. Tiling DP — Domino & Polyomino Counting': 'Tiling DP — Domino & Polyomino Counting',
  'String DP': 'String DP & Regex Matching',
  '19. String DP & Regex Matching': 'String DP & Regex Matching',
  '20. DP Optimisations — Deque, Matrix Power, Meet in the Middle': 'DP Optimisations — Deque, Matrix Power, Meet in the Middle',
  'Classic DP — Cumulative Sum': 'Prefix Sums & Subarray DP Techniques',
  'Classic DP — Hashmap (Subarray)': 'Prefix Sums & Subarray DP Techniques',
  'DP + Alpha (Tricks / DS)': 'Advanced DP Techniques & Memoization',
  'Insertion DP': 'Advanced DP Techniques & Memoization',
  'Memoization': 'Advanced DP Techniques & Memoization',
  'Binary Lifting': 'Advanced DP Techniques & Memoization',
  'Math': 'Advanced DP Techniques & Memoization',
};

const DP_CANONICAL_ORDER = [
  'Linear DP — One-Dimensional Recurrences',
  'Kadane\'s Algorithm & Maximum Subarray Family',
  '0/1 Knapsack & Subset Sum Family',
  'Unbounded Knapsack & Coin Change Family',
  'Longest Increasing Subsequence (LIS) Family',
  'Two-Sequence DP — LCS & Edit Distance Family',
  'Grid & Multi-Dimensional DP',
  'State-Machine DP — Buy & Sell Stock Family',
  'Partition DP & Palindrome Partitioning Family',
  'Interval DP — MCM & Burst Balloons',
  'Game Theory DP — Stone Game Family',
  'Bitmask DP',
  'Digit DP',
  'DP on Trees',
  'DP on Graphs & DAGs',
  'Probability & Expected-Value DP',
  'Counting & Combinatorial DP',
  'Tiling DP — Domino & Polyomino Counting',
  'String DP & Regex Matching',
  'DP Optimisations — Deque, Matrix Power, Meet in the Middle',
  'Prefix Sums & Subarray DP Techniques',
  'Advanced DP Techniques & Memoization',
];

// Tree Mappings & Canonical Order
const TREE_CATEGORY_MAPPING = {
  'Binary Tree Traversals': 'Binary Tree Traversals — Recursive & Iterative',
  '1. Traversals — Recursive, then Iterative': 'Binary Tree Traversals — Recursive & Iterative',
  'Tree Properties and Views': 'Level-Order BFS & Tree Views',
  '2. Level-Order BFS & Tree Views': 'Level-Order BFS & Tree Views',
  'Tree Comparison and Subtrees': 'Tree Properties — Depth, Balance, Symmetry',
  '3. Tree Properties — Depth, Balance, Symmetry': 'Tree Properties — Depth, Balance, Symmetry',
  'Tree Path Problems': 'Path Problems — Path Sum Family',
  '4. Path Problems — Path Sum Family': 'Path Problems — Path Sum Family',
  'Tree Construction and Serialization': 'Tree Construction from Traversals',
  '5. Tree Construction from Traversals': 'Tree Construction from Traversals',
  'Binary Search Tree (BST) Operations': 'Binary Search Tree — Validate, Insert, Delete',
  '6. Binary Search Tree — Validate, Insert, Delete': 'Binary Search Tree — Validate, Insert, Delete',
  '7. BST as an Ordered Multiset — Order Statistics & Range Queries': 'BST as an Ordered Multiset — Order Statistics & Range Queries',
  '8. Lowest Common Ancestor Family': 'Lowest Common Ancestor (LCA) Family',
  '9. Serialize, Deserialize & Subtree Hashing': 'Serialize, Deserialize & Subtree Hashing',
  'Tree Modifications and Transformations': 'Tree Modifications & Transformations',
  '10. Tree DP on Binary Trees': 'Tree DP on Binary Trees',
  '11. Rooted Tree Queries — Euler Tour, LCA & Binary Lifting': 'Rooted Tree Queries — Euler Tour, LCA & Binary Lifting',
  '12. Centroid Decomposition & Path Counting': 'Centroid Decomposition & Path Counting',
  '13. Trie (Prefix Tree) Family': 'Trie (Prefix Tree) Family',
};

const TREE_CANONICAL_ORDER = [
  'Binary Tree Traversals — Recursive & Iterative',
  'Level-Order BFS & Tree Views',
  'Tree Properties — Depth, Balance, Symmetry',
  'Path Problems — Path Sum Family',
  'Tree Construction from Traversals',
  'Binary Search Tree — Validate, Insert, Delete',
  'BST as an Ordered Multiset — Order Statistics & Range Queries',
  'Lowest Common Ancestor (LCA) Family',
  'Serialize, Deserialize & Subtree Hashing',
  'Tree Modifications & Transformations',
  'Tree DP on Binary Trees',
  'Rooted Tree Queries — Euler Tour, LCA & Binary Lifting',
  'Centroid Decomposition & Path Counting',
  'Trie (Prefix Tree) Family',
];

// Graph Mappings & Canonical Order
const GRAPH_CATEGORY_MAPPING = {
  '1. Grid Traversal — DFS & Flood Fill': 'Grid Traversal — DFS & Flood Fill',
  'Graph Traversal (BFS/DFS)': 'Graph Traversal — Adjacency Lists, BFS & DFS',
  '2. Graph Traversal — Adjacency Lists, BFS & DFS': 'Graph Traversal — Adjacency Lists, BFS & DFS',
  '3. Multi-Source BFS & Shortest Path on Unweighted Graphs': 'Multi-Source BFS & Shortest Path on Unweighted Graphs',
  '4. BFS on Implicit State Graphs': 'BFS on Implicit State Graphs',
  'Graph Coloring and Bipartite Graphs': 'Cycle Detection, Bipartite Graphs & Graph Coloring',
  '5. Cycle Detection & Bipartite Checking': 'Cycle Detection, Bipartite Graphs & Graph Coloring',
  'Topological Sorting': 'Topological Sort — Course Schedule Family',
  '6. Topological Sort — Course Schedule Family': 'Topological Sort — Course Schedule Family',
  'Union Find (Disjoint Set Union - DSU)': 'Union-Find (Disjoint Set Union - DSU)',
  '7. Union-Find (Disjoint Set Union)': 'Union-Find (Disjoint Set Union - DSU)',
  'Minimum Spanning Tree (MST)': 'Minimum Spanning Tree — Kruskal & Prim',
  '8. Minimum Spanning Tree — Kruskal & Prim': 'Minimum Spanning Tree — Kruskal & Prim',
  'Shortest Path Algorithms': 'Shortest Path Algorithms (Dijkstra - Weighted)',
  '9. Dijkstra — Weighted Shortest Path': 'Shortest Path Algorithms (Dijkstra - Weighted)',
  '10. Bellman-Ford, Floyd-Warshall & Bounded-Hop Paths': 'Bellman-Ford, Floyd-Warshall & Bounded-Hop Paths',
  'Graph Components and Connectivity': 'Bridges, Articulation Points & Strongly Connected Components',
  '11. Bridges, Articulation Points & Strongly Connected Components': 'Bridges, Articulation Points & Strongly Connected Components',
  '12. Functional Graphs & Successor Paths': 'Functional Graphs & Successor Paths',
  '13. Eulerian Paths & Graph Reconstruction': 'Eulerian Paths & Graph Reconstruction',
  '14. Max Flow & Bipartite Matching': 'Max Flow & Bipartite Matching',
  '15. Graph Modelling — Problems That Do Not Look Like Graphs': 'Graph Modelling — Problems That Do Not Look Like Graphs',
};

const GRAPH_CANONICAL_ORDER = [
  'Grid Traversal — DFS & Flood Fill',
  'Graph Traversal — Adjacency Lists, BFS & DFS',
  'Multi-Source BFS & Shortest Path on Unweighted Graphs',
  'BFS on Implicit State Graphs',
  'Cycle Detection, Bipartite Graphs & Graph Coloring',
  'Topological Sort — Course Schedule Family',
  'Union-Find (Disjoint Set Union - DSU)',
  'Minimum Spanning Tree — Kruskal & Prim',
  'Shortest Path Algorithms (Dijkstra - Weighted)',
  'Bellman-Ford, Floyd-Warshall & Bounded-Hop Paths',
  'Bridges, Articulation Points & Strongly Connected Components',
  'Functional Graphs & Successor Paths',
  'Eulerian Paths & Graph Reconstruction',
  'Max Flow & Bipartite Matching',
  'Graph Modelling — Problems That Do Not Look Like Graphs',
];

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
    categories: mergeUnifiedSections(baseDpCategories, dpSections, DP_CATEGORY_MAPPING, DP_CANONICAL_ORDER),
  },
  tree: {
    slug: 'tree',
    title: 'Binary Trees & BST',
    shortLabel: 'Trees',
    categories: mergeUnifiedSections(baseTreeCategories, treeSections, TREE_CATEGORY_MAPPING, TREE_CANONICAL_ORDER),
  },
  graph: {
    slug: 'graph',
    title: 'Graph Algorithms',
    shortLabel: 'Graphs',
    categories: mergeUnifiedSections(baseGraphCategories, prepforgeGraphSections, GRAPH_CATEGORY_MAPPING, GRAPH_CANONICAL_ORDER),
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
