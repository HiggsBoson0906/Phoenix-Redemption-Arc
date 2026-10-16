// src/content/dsa-sheets/backtracking.ts
//
// Backtracking sheet. Same ordering contract as src/data/dpSections.js.
//
// Every problem here is the same three lines — choose, recurse, un-choose. What
// changes between sections is the *state* you carry and the pruning rule, so
// the sheet is grouped by those rather than by story.
//
// Numbered families kept contiguous: Subsets I..II, Permutations I..II,
// Combination Sum I..III, N-Queens I..II.

import type { SheetSection } from "@/types";

const backtrackingSections: SheetSection[] = [
  {
    title: "1. Subsets & Combinations — the Include/Exclude Tree",
    description:
      "The base template. Each index is a binary choice, so the recursion tree has 2ⁿ leaves. Subsets II teaches the one skill that carries through the whole sheet: skipping duplicates by sorting and comparing with the previous element.",
    links: [
      "https://leetcode.com/problems/subsets/",
      "https://leetcode.com/problems/subsets-ii/",
      "https://leetcode.com/problems/combinations/",
      "https://leetcode.com/problems/combination-sum/",
      "https://leetcode.com/problems/combination-sum-ii/",
      "https://leetcode.com/problems/combination-sum-iii/",
      "https://cses.fi/problemset/task/1623",
      "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
      "https://leetcode.com/problems/iterator-for-combination/",
      "https://leetcode.com/problems/count-number-of-maximum-bitwise-or-subsets/",
      "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/",
      "https://leetcode.com/problems/letter-tile-possibilities/",
      "https://leetcode.com/problems/non-decreasing-subsequences/",
      "https://leetcode.com/problems/the-k-th-lexicographical-string-of-all-happy-strings-of-length-n/",
      "https://leetcode.com/problems/find-array-given-subset-sums/",
    ],
  },
  {
    title: "2. Permutations & Orderings",
    description:
      "Now position matters, so the branching factor is 'every unused element'. A used[] array beats removing from a list. Permutations II is the duplicate-handling exercise; Next Permutation is the O(n) escape hatch.",
    links: [
      "https://leetcode.com/problems/permutations/",
      "https://leetcode.com/problems/permutations-ii/",
      "https://cses.fi/problemset/task/1622",
      "https://leetcode.com/problems/letter-case-permutation/",
      "https://leetcode.com/problems/beautiful-arrangement/",
      "https://leetcode.com/problems/next-permutation/",
      "https://leetcode.com/problems/find-unique-binary-string/",
      "https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters/",
      "https://leetcode.com/problems/split-array-into-fibonacci-sequence/",
      "https://leetcode.com/problems/sequential-digits/",
      "https://leetcode.com/problems/circular-permutation-in-binary-representation/",
      "https://leetcode.com/problems/permutation-sequence/",
      "https://leetcode.com/problems/number-of-squareful-arrays/",
    ],
  },
  {
    title: "3. String Partitioning & Reconstruction",
    description:
      "Cut a string every possible way and recurse on the rest. The pruning is a validity check on the piece you just cut — palindrome, valid IP octet, dictionary word. Word Break II is where memoisation becomes mandatory.",
    links: [
      "https://leetcode.com/problems/palindrome-partitioning/",
      "https://leetcode.com/problems/restore-ip-addresses/",
      "https://leetcode.com/problems/additive-number/",
      "https://leetcode.com/problems/generate-parentheses/",
      "https://leetcode.com/problems/different-ways-to-add-parentheses/",
      "https://leetcode.com/problems/word-break-ii/",
      "https://leetcode.com/problems/expression-add-operators/",
      "https://leetcode.com/problems/remove-invalid-parentheses/",
      "https://leetcode.com/problems/maximum-score-words-formed-by-letters/",
      "https://leetcode.com/problems/brace-expansion-ii/",
      "https://leetcode.com/problems/split-message-based-on-limit/",
    ],
  },
  {
    title: "4. Grid & Board Search",
    description:
      "Backtracking on a 2D board: mark the cell, recurse, unmark. The interview version is Word Search; the follow-up is Word Search II, where a trie turns 'search each word separately' into one traversal.",
    links: [
      "https://leetcode.com/problems/word-search/",
      "https://leetcode.com/problems/path-with-maximum-gold/",
      "https://leetcode.com/problems/maximum-number-of-moves-in-a-grid/",
      "https://leetcode.com/problems/unique-paths-iii/",
      "https://leetcode.com/problems/word-search-ii/",
      "https://leetcode.com/problems/maximum-path-quality-of-a-graph/",
      "https://leetcode.com/problems/number-of-increasing-paths-in-a-grid/",
      "https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/",
      "https://leetcode.com/problems/escape-a-large-maze/",
    ],
  },
  {
    title: "5. Constraint Satisfaction — N-Queens & Sudoku",
    description:
      "Where pruning stops being an optimisation and becomes the algorithm. Track conflicts in sets/bitmasks so the validity check is O(1), then place cells in most-constrained-first order.",
    links: [
      "https://leetcode.com/problems/valid-sudoku/",
      "https://leetcode.com/problems/matchsticks-to-square/",
      "https://leetcode.com/problems/fair-distribution-of-cookies/",
      "https://leetcode.com/problems/closest-dessert-cost/",
      "https://leetcode.com/problems/n-queens/",
      "https://leetcode.com/problems/n-queens-ii/",
      "https://cses.fi/problemset/task/1624",
      "https://leetcode.com/problems/sudoku-solver/",
      "https://leetcode.com/problems/distribute-repeating-integers/",
      "https://leetcode.com/problems/verbal-arithmetic-puzzle/",
      "https://leetcode.com/problems/number-of-valid-words-for-each-puzzle/",
      "https://leetcode.com/problems/maximum-good-people-based-on-statements/",
    ],
  },
  {
    title: "6. Backtracking Meets Memoisation & Bitmask",
    description:
      "When the same state recurs across branches, cache it and the exponential search becomes a DP. This is the bridge to the DP sheet's bitmask section — if the state fits in an int, you are no longer really backtracking.",
    links: [
      "https://leetcode.com/problems/word-break/",
      "https://leetcode.com/problems/target-sum/",
      "https://leetcode.com/problems/can-i-win/",
      "https://leetcode.com/problems/number-of-ways-to-reach-a-position-after-exactly-k-steps/",
      "https://leetcode.com/problems/split-array-with-same-average/",
      "https://leetcode.com/problems/number-of-ways-to-wear-different-hats-to-each-other/",
      "https://leetcode.com/problems/maximum-students-taking-exam/",
      "https://leetcode.com/problems/the-number-of-good-subsets/",
      "https://leetcode.com/problems/minimum-incompatibility/",
      "https://leetcode.com/problems/stickers-to-spell-word/",
      "https://leetcode.com/problems/minimum-cost-to-connect-two-groups-of-points/",
    ],
  },
];

export default backtrackingSections;
