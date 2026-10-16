// src/content/company-wise/tekion.ts
// Curated from the supplied Tekion SDE-1 preparation guide. The guide's
// direct practice links prioritize the tree, array, stack, and design patterns
// repeatedly reported for Tekion SDE-1 interviews.

import type { SheetSection } from "@/types";

const tekionSections: SheetSection[] = [
  {
    title: "Tier A Core — Arrays, Pointers & Windows",
    description: "Start here. These are the mandatory array and string fundamentals; explain the invariant before writing code.",
    links: [
      "https://leetcode.com/problems/two-sum/",
      "https://leetcode.com/problems/product-of-array-except-self/",
      "https://leetcode.com/problems/longest-consecutive-sequence/",
      "https://leetcode.com/problems/3sum/",
      "https://leetcode.com/problems/container-with-most-water/",
      "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      "https://leetcode.com/problems/minimum-window-substring/",
    ],
  },
  {
    title: "Stacks, Binary Search & Data Structures",
    description: "Monotonic-stack boundaries, sorted-half and slope invariants, plus the core linked-list and heap patterns.",
    links: [
      "https://leetcode.com/problems/valid-parentheses/",
      "https://leetcode.com/problems/daily-temperatures/",
      "https://leetcode.com/problems/largest-rectangle-in-histogram/",
      "https://leetcode.com/problems/search-in-rotated-sorted-array/",
      "https://leetcode.com/problems/find-peak-element/",
      "https://leetcode.com/problems/koko-eating-bananas/",
      "https://leetcode.com/problems/reverse-linked-list/",
      "https://leetcode.com/problems/lru-cache/",
      "https://leetcode.com/problems/top-k-frequent-elements/",
    ],
  },
  {
    title: "Trees & BST",
    description: "A high-signal Tekion area: recursive bounds, height-based DP, BFS level boundaries, and LCA return values.",
    links: [
      "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
      "https://leetcode.com/problems/diameter-of-binary-tree/",
      "https://leetcode.com/problems/maximum-width-of-binary-tree/",
      "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
      "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    ],
  },
  {
    title: "Graphs, Intervals & Backtracking",
    description: "Practice traversal choices, topological cycle detection, object-graph memoization, sweep-line merging, and decision trees.",
    links: [
      "https://leetcode.com/problems/number-of-islands/",
      "https://leetcode.com/problems/course-schedule/",
      "https://leetcode.com/problems/clone-graph/",
      "https://leetcode.com/problems/merge-intervals/",
      "https://leetcode.com/problems/meeting-rooms-ii/",
      "https://leetcode.com/problems/subsets/",
      "https://leetcode.com/problems/combination-sum/",
    ],
  },
  {
    title: "Dynamic Programming",
    description: "Core state-definition practice: a linear recurrence, minimum-state DP with unreachable cases, and the n log n LIS invariant.",
    links: [
      "https://leetcode.com/problems/house-robber/",
      "https://leetcode.com/problems/coin-change/",
      "https://leetcode.com/problems/longest-increasing-subsequence/",
    ],
  },
  {
    title: "Company Signals & High-Value Follow-ups",
    description: "Reported or closely aligned Tekion follow-ups. Revisit Valid Parentheses here in interview mode because a recent candidate report specifically mentioned it.",
    links: [
      "https://leetcode.com/problems/find-leaves-of-binary-tree/",
      "https://leetcode.com/problems/next-greater-element-iii/",
      "https://leetcode.com/problems/reformat-the-string/",
      "https://leetcode.com/problems/valid-parentheses/",
    ],
  },
  {
    title: "Design-Flavored Data Structures",
    description: "Use these to practise clean APIs, data modelling, ownership, and the invariants behind O(1) operations.",
    links: [
      "https://leetcode.com/problems/design-twitter/",
      "https://leetcode.com/problems/insert-delete-getrandom-o1/",
      "https://leetcode.com/problems/implement-trie-prefix-tree/",
    ],
  },
  {
    title: "Greedy, Matrix & Prefix Sums",
    description: "Explain reachability and feasibility proofs, in-place transformations, and the prefix-frequency-map invariant.",
    links: [
      "https://leetcode.com/problems/jump-game/",
      "https://leetcode.com/problems/gas-station/",
      "https://leetcode.com/problems/set-matrix-zeroes/",
      "https://leetcode.com/problems/rotate-image/",
      "https://leetcode.com/problems/subarray-sum-equals-k/",
    ],
  },
  {
    title: "Strings & Stretch Practice",
    description: "Finish with robust encodings and advanced partition/BFS problems after the Tier A set is consistently interview-ready.",
    links: [
      "https://leetcode.com/problems/group-anagrams/",
      "https://leetcode.com/problems/encode-and-decode-strings/",
      "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      "https://leetcode.com/problems/word-ladder/",
    ],
  },
];

export default tekionSections;
