// src/content/dsa-sheets/twoPointer.ts
//
// Two Pointer sheet. Same ordering contract as src/data/dpSections.js.
//
// Three distinct motions live under the "two pointer" name and mixing them up
// is why the technique feels unreliable:
//   converging  (left/right walk toward each other on sorted data) — §1-3
//   same-direction (slow/fast over one array, in-place rewriting) — §4-5
//   two-sequence (one pointer per array, merge-style)             — §6-7
// Fast/slow cycle detection (§8) is the same idea on a linked list.
//
// Numbered families kept contiguous: Two Sum I..II, 3Sum -> 3Sum Closest ->
// 4Sum, Remove Duplicates I..II, Trapping Rain Water I..II.

import type { SheetSection } from "@/types";

const twoPointerSections: SheetSection[] = [
  {
    title: "1. Converging Pointers — Two Sum Family on Sorted Data",
    description:
      "Sorted input, one pointer at each end: too small means move left up, too big means move right down. Two Sum II is the pure form; 3Sum and 4Sum are that loop nested inside a fixed outer index.",
    links: [
      "https://leetcode.com/problems/two-sum/",
      "https://leetcode.com/problems/count-pairs-whose-sum-is-less-than-target/",
      "https://leetcode.com/problems/number-of-arithmetic-triplets/",
      "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
      "https://cses.fi/problemset/task/1640",
      "https://leetcode.com/problems/3sum/",
      "https://leetcode.com/problems/3sum-closest/",
      "https://cses.fi/problemset/task/1641",
      "https://leetcode.com/problems/4sum/",
      "https://cses.fi/problemset/task/1642",
      "https://leetcode.com/problems/number-of-subsequences-that-satisfy-the-given-sum-condition/",
      "https://leetcode.com/problems/sum-of-square-numbers/",
      "https://leetcode.com/problems/count-the-number-of-fair-pairs/",
    ],
  },
  {
    title: "2. Converging Pointers — Palindromes & String Symmetry",
    description:
      "Walk in from both ends and compare. The interview twist is always the same: what happens when one mismatch is allowed, and can you still stay O(n)?",
    links: [
      "https://leetcode.com/problems/valid-palindrome/",
      "https://leetcode.com/problems/reverse-string/",
      "https://leetcode.com/problems/reverse-vowels-of-a-string/",
      "https://leetcode.com/problems/reverse-words-in-a-string-iii/",
      "https://leetcode.com/problems/valid-palindrome-ii/",
      "https://leetcode.com/problems/reverse-only-letters/",
      "https://leetcode.com/problems/remove-palindromic-subsequences/",
      "https://leetcode.com/problems/shortest-distance-to-a-character/",
      "https://leetcode.com/problems/minimum-length-of-string-after-deleting-similar-ends/",
      "https://leetcode.com/problems/longest-palindromic-substring/",
      "https://leetcode.com/problems/palindromic-substrings/",
      "https://leetcode.com/problems/shortest-palindrome/",
    ],
  },
  {
    title: "3. Converging Pointers — Area, Water & Interval Geometry",
    description:
      "The greedy exchange argument matters more than the code here: you always move the *limiting* pointer, because moving the other one can never help. Container With Most Water then Trapping Rain Water, in that order.",
    links: [
      "https://leetcode.com/problems/container-with-most-water/",
      "https://leetcode.com/problems/boats-to-save-people/",
      "https://leetcode.com/problems/maximum-distance-between-a-pair-of-values/",
      "https://leetcode.com/problems/trapping-rain-water/",
      "https://leetcode.com/problems/trapping-rain-water-ii/",
      "https://leetcode.com/problems/maximum-number-of-visible-points/",
    ],
  },
  {
    title: "4. Same-Direction Pointers — In-Place Array Rewriting",
    description:
      "A write pointer trails a read pointer. Everything before the write pointer is finished output. This is the single most common 'do it in O(1) extra space' follow-up in phone screens.",
    links: [
      "https://leetcode.com/problems/move-zeroes/",
      "https://leetcode.com/problems/remove-element/",
      "https://leetcode.com/problems/squares-of-a-sorted-array/",
      "https://leetcode.com/problems/sort-array-by-parity/",
      "https://leetcode.com/problems/apply-operations-to-an-array/",
      "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
      "https://leetcode.com/problems/merge-strings-alternately/",
      "https://leetcode.com/problems/sort-array-by-parity-ii/",
      "https://leetcode.com/problems/di-string-match/",
      "https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/",
      "https://leetcode.com/problems/sort-colors/",
      "https://leetcode.com/problems/rearrange-array-elements-by-sign/",
      "https://leetcode.com/problems/next-permutation/",
      "https://leetcode.com/problems/string-compression/",
      "https://leetcode.com/problems/partition-array-according-to-given-pivot/",
      "https://leetcode.com/problems/rotate-array/",
      "https://leetcode.com/problems/pancake-sorting/",
      "https://leetcode.com/problems/push-dominoes/",
    ],
  },
  {
    title: "5. Same-Direction Pointers — Subsequence Matching",
    description:
      "One pointer scans the candidate, one scans the target, and only the target pointer advances on a match. Simple in isolation, and the base case for the harder 'match many patterns at once' variants.",
    links: [
      "https://leetcode.com/problems/is-subsequence/",
      "https://leetcode.com/problems/long-pressed-name/",
      "https://leetcode.com/problems/find-all-k-distant-indices-in-an-array/",
      "https://leetcode.com/problems/number-of-matching-subsequences/",
      "https://leetcode.com/problems/longest-word-in-dictionary-through-deleting/",
      "https://leetcode.com/problems/append-characters-to-string-to-make-subsequence/",
      "https://leetcode.com/problems/compare-strings-by-frequency-of-the-smallest-character/",
      "https://leetcode.com/problems/maximum-number-of-non-overlapping-substrings/",
    ],
  },
  {
    title: "6. Two-Sequence Pointers — Merge & Intersection",
    description:
      "One pointer per sorted sequence, advance whichever is behind. Merge Sorted Array backwards-in-place is the version interviewers ask; the intersection problems are the same loop with a different emit rule.",
    links: [
      "https://leetcode.com/problems/merge-sorted-array/",
      "https://leetcode.com/problems/intersection-of-two-arrays/",
      "https://leetcode.com/problems/intersection-of-two-arrays-ii/",
      "https://leetcode.com/problems/find-the-difference-of-two-arrays/",
      "https://leetcode.com/problems/merge-two-sorted-lists/",
      "https://leetcode.com/problems/intersection-of-multiple-arrays/",
      "https://leetcode.com/problems/minimum-index-sum-of-two-lists/",
      "https://leetcode.com/problems/interval-list-intersections/",
      "https://leetcode.com/problems/most-profit-assigning-work/",
      "https://codeforces.com/problemset/problem/279/B",
    ],
  },
  {
    title: "7. Pointers After Sorting — Pairing & Assignment",
    description:
      "Sort first, then a single linear sweep pairs things off optimally. Half greedy, half two-pointer — the exchange argument for *why* the pairing is optimal is usually the follow-up question.",
    links: [
      "https://leetcode.com/problems/assign-cookies/",
      "https://leetcode.com/problems/two-city-scheduling/",
      "https://leetcode.com/problems/minimum-operations-to-make-array-equal-ii/",
      "https://leetcode.com/problems/maximum-matching-of-players-with-trainers/",
      "https://leetcode.com/problems/advantage-shuffle/",
      "https://codeforces.com/problemset/problem/1462/E1",
      "https://leetcode.com/problems/max-number-of-k-sum-pairs/",
      "https://leetcode.com/problems/minimize-maximum-pair-sum-in-array/",
      "https://leetcode.com/problems/bag-of-tokens/",
      "https://codeforces.com/problemset/problem/1400/D",
    ],
  },
  {
    title: "8. Fast & Slow Pointers — Cycle Detection",
    description:
      "Floyd's tortoise and hare. Beyond linked lists it detects cycles in any functional graph — Find the Duplicate Number is the famous disguise, and Happy Number is the same idea on a number sequence.",
    links: [
      "https://leetcode.com/problems/middle-of-the-linked-list/",
      "https://leetcode.com/problems/linked-list-cycle/",
      "https://leetcode.com/problems/happy-number/",
      "https://leetcode.com/problems/palindrome-linked-list/",
      "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
      "https://leetcode.com/problems/linked-list-cycle-ii/",
      "https://leetcode.com/problems/reorder-list/",
      "https://leetcode.com/problems/find-the-duplicate-number/",
      "https://leetcode.com/problems/circular-array-loop/",
    ],
  },
];

export default twoPointerSections;
