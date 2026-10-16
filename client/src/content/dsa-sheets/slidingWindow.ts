// src/content/dsa-sheets/slidingWindow.ts
//
// Sliding Window sheet. Same ordering contract as src/data/dpSections.js.
//
// The sheet is built around one distinction that decides the template you
// write: a window of FIXED length k (sections 1-2) versus a window that grows
// and shrinks against a validity predicate (sections 3-6). Section 7 is the
// counting trick — "exactly K" = "at most K" minus "at most K-1" — which turns
// a whole class of hard-looking problems into two easy passes.

import type { SheetSection } from "@/types";

const slidingWindowSections: SheetSection[] = [
  {
    title: "1. Fixed-Size Window — Running Aggregate",
    description:
      "Window length is given. Add the entering element, remove the leaving one, never rebuild the window. If you find yourself looping inside the loop, you have written the O(n·k) version by accident.",
    links: [
      "https://leetcode.com/problems/maximum-average-subarray-i/",
      "https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1",
      "https://cses.fi/problemset/task/3220",
      "https://leetcode.com/problems/find-the-k-beauty-of-a-number/",
      "https://leetcode.com/problems/defuse-the-bomb/",
      "https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters/",
      "https://leetcode.com/problems/contains-duplicate-ii/",
      "https://leetcode.com/problems/max-consecutive-ones/",
      "https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/",
      "https://leetcode.com/problems/k-radius-subarray-averages/",
      "https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/",
      "https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/",
      "https://leetcode.com/problems/grumpy-bookstore-owner/",
      "https://leetcode.com/problems/alternating-groups-ii/",
      "https://leetcode.com/problems/sliding-subarray-beauty/",
    ],
  },
  {
    title: "2. Fixed-Size Window — Monotonic Deque",
    description:
      "When the aggregate is min or max you cannot 'subtract' the leaving element, so you keep a deque of candidates in monotone order. Sliding Window Maximum is the one to know cold — it reappears as an optimisation inside DP.",
    links: [
      "https://leetcode.com/problems/sliding-window-maximum/",
      "https://cses.fi/problemset/task/3221",
      "https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/",
      "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/",
      "https://leetcode.com/problems/jump-game-vi/",
      "https://leetcode.com/problems/constrained-subsequence-sum/",
      "https://cses.fi/problemset/task/1076",
      "https://leetcode.com/problems/sliding-window-median/",
      "https://cses.fi/problemset/task/1077",
    ],
  },
  {
    title: "3. Variable Window — Longest Valid Window",
    description:
      "Expand right always; move left only while the window is invalid. Read the answer at every step. Longest Substring Without Repeating Characters is the template — the rest of this section changes only the validity test.",
    links: [
      "https://codeforces.com/problemset/problem/1873/F",
      "https://leetcode.com/problems/longest-harmonious-subsequence/",
      "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      "https://leetcode.com/problems/max-consecutive-ones-iii/",
      "https://leetcode.com/problems/longest-repeating-character-replacement/",
      "https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/",
      "https://leetcode.com/problems/fruit-into-baskets/",
      "https://leetcode.com/problems/maximum-erasure-value/",
      "https://leetcode.com/problems/frequency-of-the-most-frequent-element/",
      "https://leetcode.com/problems/maximize-the-confusion-of-an-exam/",
      "https://leetcode.com/problems/length-of-longest-subarray-with-at-most-k-frequency/",
      "https://codeforces.com/problemset/problem/616/D",
      "https://leetcode.com/problems/longest-nice-subarray/",
      "https://leetcode.com/problems/get-equal-substrings-within-budget/",
      "https://leetcode.com/problems/longest-substring-with-at-least-k-repeating-characters/",
      "https://leetcode.com/problems/maximum-beauty-of-an-array-after-applying-operation/",
      "https://leetcode.com/problems/find-the-longest-equal-subarray/",
      "https://leetcode.com/problems/continuous-subarrays/",
    ],
  },
  {
    title: "4. Variable Window — Shortest Valid Window",
    description:
      "Mirror of section 3: expand until valid, then shrink *while still valid*, recording the answer as you shrink. Minimum Window Substring is the hard classic and shows up in real FAANG loops constantly.",
    links: [
      "https://leetcode.com/problems/minimum-recolors-to-get-k-consecutive-black-blocks/",
      "https://leetcode.com/problems/minimum-size-subarray-sum/",
      "https://leetcode.com/problems/minimum-consecutive-cards-to-pick-up/",
      "https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/",
      "https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii/",
      "https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted/",
      "https://leetcode.com/problems/minimum-size-subarray-in-infinite-array/",
      "https://leetcode.com/problems/take-k-of-each-character-from-left-and-right/",
      "https://leetcode.com/problems/replace-the-substring-for-balanced-string/",
      "https://leetcode.com/problems/minimum-window-substring/",
    ],
  },
  {
    title: "5. Anagram & Permutation Windows",
    description:
      "Fixed-size window plus a frequency table compared against a target. Track a single 'characters currently matched' counter rather than comparing two maps each step — that is the difference between O(n·26) and O(n).",
    links: [
      "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
      "https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram/",
      "https://leetcode.com/problems/permutation-in-string/",
      "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
      "https://leetcode.com/problems/count-substrings-that-differ-by-one-character/",
      "https://leetcode.com/problems/count-anagrams/",
      "https://leetcode.com/problems/substring-with-concatenation-of-all-words/",
    ],
  },
  {
    title: "6. Windows over Streams & Two-Ended Selection",
    description:
      "The window is not contiguous in the obvious way — it wraps, or it is taken from both ends of the array. The fix is almost always to reframe it as an ordinary window on a transformed array.",
    links: [
      "https://leetcode.com/problems/number-of-recent-calls/",
      "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/",
      "https://leetcode.com/problems/maximum-sum-of-almost-unique-subarray/",
      "https://leetcode.com/problems/count-complete-subarrays-in-an-array/",
      "https://leetcode.com/problems/maximum-number-of-robots-within-budget/",
      "https://cses.fi/problemset/task/3222",
      "https://leetcode.com/problems/maximum-sum-of-3-non-overlapping-subarrays/",
    ],
  },
  {
    title: "7. Counting Windows — the 'At Most K' Trick",
    description:
      "Counting subarrays with a property *exactly* K is usually painful; counting 'at most K' is a plain sliding window. Answer = atMost(K) − atMost(K−1). Learn this once and four hard problems become easy.",
    links: [
      "https://leetcode.com/problems/subarray-product-less-than-k/",
      "https://leetcode.com/problems/binary-subarrays-with-sum/",
      "https://leetcode.com/problems/count-number-of-nice-subarrays/",
      "https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/",
      "https://leetcode.com/problems/count-the-number-of-good-subarrays/",
      "https://leetcode.com/problems/count-subarrays-where-max-element-appears-at-least-k-times/",
      "https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/",
      "https://leetcode.com/problems/number-of-zero-filled-subarrays/",
      "https://leetcode.com/problems/count-of-substrings-containing-every-vowel-and-k-consonants-ii/",
      "https://leetcode.com/problems/subarrays-with-k-different-integers/",
      "https://leetcode.com/problems/count-subarrays-with-score-less-than-k/",
      "https://leetcode.com/problems/count-subarrays-with-fixed-bounds/",
    ],
  },
];

export default slidingWindowSections;
