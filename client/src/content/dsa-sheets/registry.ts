// src/content/dsa-sheets/registry.ts
// Single source of truth for every DSA sheet card shown on the Home page and
// the /cp page. Supersedes the old src/constants/sheets.js + cpTopics.js,
// which advertised 7 routes that had no page/route registered at all.

import type { SheetMeta } from "@/types";

export const dsaSheets: SheetMeta[] = [
  {
    slug: "dp",
    title: "DP Sheet",
    description: "Master Dynamic Programming with a curated set of essential problems.",
    icon: "🧮",
    link: "/sheets/dp",
  },
  {
    slug: "graph",
    title: "Graph Sheet",
    description: "Explore graph algorithms and problem-solving techniques.",
    icon: "🔗",
    link: "/sheets/graph",
  },
  {
    slug: "tree",
    title: "Tree Sheet",
    description: "Practice tree data structures and related algorithms.",
    icon: "🌳",
    link: "/sheets/tree",
  },
  {
    slug: "range-query",
    title: "Range Query Sheet",
    description: "Tackle problems involving segment trees, BITs, and range queries.",
    icon: "📏",
    link: "/sheets/range-query",
  },
  {
    slug: "binary-search",
    title: "Binary Search Sheet",
    description: "Master binary search techniques and applications.",
    icon: "🔍",
    link: "/sheets/binary-search",
  },
  {
    slug: "two-pointer",
    title: "Two Pointer Sheet",
    description: "Learn efficient two-pointer techniques for array problems.",
    icon: "👆",
    link: "/sheets/two-pointer",
  },
  {
    slug: "greedy",
    title: "Greedy Sheet",
    description: "Solve problems using greedy algorithms and strategies.",
    icon: "💰",
    link: "/sheets/greedy",
  },
  {
    slug: "sliding-window",
    title: "Sliding Window Sheet",
    description: "Master sliding window technique for subarray problems.",
    icon: "🪟",
    link: "/sheets/sliding-window",
  },
  {
    slug: "backtracking",
    title: "Backtracking Sheet",
    description: "Explore backtracking algorithms for constraint satisfaction.",
    icon: "🔙",
    link: "/sheets/backtracking",
  },
  {
    slug: "string",
    title: "String Algorithms Sheet",
    description: "Master string manipulation and pattern matching algorithms.",
    icon: "📝",
    link: "/sheets/string",
  },
  {
    slug: "math",
    title: "Math & Number Theory Sheet",
    description: "Solve mathematical problems and number theory challenges.",
    icon: "🔢",
    link: "/sheets/math",
  },
  {
    slug: "bit-manipulation",
    title: "Bit Manipulation Sheet",
    description: "Master bitwise operations and bit manipulation tricks.",
    icon: "⚡",
    link: "/sheets/bit-manipulation",
  },
  {
    slug: "stack",
    title: "Stack Sheet",
    description: "Master LIFO problem-solving with monotonic stacks, matching, and stack-backed design.",
    icon: "🥞",
    link: "/sheets/stack",
  },
  {
    slug: "queue",
    title: "Queue Sheet",
    description: "Master FIFO processing, level-order BFS mechanics, and queue-backed design.",
    icon: "🚶",
    link: "/sheets/queue",
  },
  {
    slug: "deque",
    title: "Deque Sheet",
    description: "Master the double-ended queue for monotonic windows and two-ended scanning.",
    icon: "↔️",
    link: "/sheets/deque",
  },
  {
    slug: "linked-list",
    title: "Linked List Sheet",
    description: "Master pointer rewiring, in-place reversal, merging, and linked-list-backed design.",
    icon: "🔗",
    link: "/sheets/linked-list",
  },
  {
    slug: "trie",
    title: "Trie Sheet",
    description: "Master the prefix tree for search, autocomplete, and prefix statistics.",
    icon: "🔤",
    link: "/sheets/trie",
  },
  {
    slug: "heap",
    title: "Heap / Priority Queue Sheet",
    description: "Master order statistics, running medians, and k-way merges with a heap.",
    icon: "⛰️",
    link: "/sheets/heap",
  },
  {
    slug: "array",
    title: "Array & Ad-Hoc Techniques Sheet",
    description: "Master the one-off tricks — Boyer–Moore voting, cyclic sort, pigeonhole and Bézout.",
    icon: "🎯",
    link: "/sheets/array",
  },
  {
    slug: "matrix",
    title: "Matrix & Grid Sheet",
    description: "Master 2D index arithmetic — rotation, spiral and diagonal traversal, and grid simulation.",
    icon: "🧊",
    link: "/sheets/matrix",
  },
  {
    slug: "game-theory",
    title: "Game Theory Sheet",
    description: "Master optimal play — parity arguments, Nim, Sprague–Grundy, and adversarial search.",
    icon: "♟️",
    link: "/sheets/game-theory",
  },
  {
    slug: "concurrency",
    title: "Concurrency & Multithreading Sheet",
    description: "Master thread ordering, semaphores, bounded buffers, and deadlock-free lock design.",
    icon: "🧵",
    link: "/sheets/concurrency",
  },
];

/** The first 4 sheets are shown on the Home page; the rest are shown on /cp. */
export const homeSheets: SheetMeta[] = dsaSheets.filter((s) =>
  ["dp", "graph", "tree", "range-query"].includes(s.slug)
);
