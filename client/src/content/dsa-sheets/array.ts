// src/content/dsa-sheets/array.ts
//
// Array & Ad-Hoc Techniques sheet. Same ordering contract as
// src/data/dpSections.js.
//
// This sheet exists for the problems that do NOT belong to a general
// algorithmic family — the ones where the whole difficulty is spotting one
// named result (Boyer-Moore's vote, Bezout's identity, the pigeonhole
// principle) or one throwaway invariant that collapses the problem. They are
// the questions candidates lose offers on, because no amount of "which
// pattern is this" pays off: either you know the trick or you don't.
//
// Deliberate boundaries, so nothing here re-teaches a neighbouring sheet:
//   - Dutch National Flag / in-place rewriting (Sort Colors, Move Zeroes,
//     Rotate Array, Pancake Sorting) lives on the Two Pointer sheet, section 4.
//   - Prefix sums, difference arrays and subarray counting live on the Range
//     Query sheet, sections 1-2.
//   - Kadane and the maximum-subarray family live on the DP sheet, section 2.
//   - Monotonic-stack array problems (Next Greater, histogram spans) live on
//     the Stack sheet.
//   - The number-theory treatment of gcd/Bezout lives on the Math sheet,
//     section 3. Section 7 below borrows its two anchor problems on purpose —
//     the framing here is "which array questions secretly are Bezout", which
//     is the recognition skill being drilled.

import type { SheetSection } from "@/types";

const arraySections: SheetSection[] = [
  {
    title: "1. Boyer–Moore Majority Vote — the ⌊n/k⌋ Family",
    description:
      "One counter and one candidate, in O(1) space: every non-matching element cancels one vote, so a value occurring more than ⌊n/2⌋ times cannot be fully cancelled and survives. The generalisation is the real interview question — for strictly-more-than-⌊n/3⌋ you keep two candidates, and for ⌊n/k⌋ you keep k−1, always with a second pass to verify since the algorithm only guarantees a candidate when a majority actually exists.",
    links: [
      "https://leetcode.com/problems/majority-element/",
      "https://leetcode.com/problems/majority-element-ii/",
      "https://www.geeksforgeeks.org/majority-element/",
      "https://www.interviewbit.com/problems/majority-element/",
    ],
  },
  {
    title: "2. Index-as-Hash & Cyclic Sort — the Array as Its Own Hash Table",
    description:
      "When the values are constrained to 1..n, the array already is a hash table: either negate the number at index v−1 to mark v as seen, or swap each value to its home slot until every position holds its own index. Both give O(1) extra space, which is exactly the constraint First Missing Positive adds to stop you reaching for a set. (Set Mismatch and Missing Number are solved with XOR on the Bit Manipulation sheet, section 3 — worth doing both ways.)",
    links: [
      "https://leetcode.com/problems/first-missing-positive/",
      "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/",
      "https://leetcode.com/problems/find-all-duplicates-in-an-array/",
      "https://leetcode.com/problems/find-missing-and-repeated-values/",
    ],
  },
  {
    title: "3. Permutation Cycles & In-Place Rearrangement",
    description:
      "A permutation decomposes into disjoint cycles, and that single fact answers a whole class of questions: a cycle of length L needs exactly L−1 swaps to fix, so the minimum number of swaps to sort is n minus the number of cycles. Array Nesting is the same observation with the answer being the longest cycle instead of the count.",
    links: [
      "https://leetcode.com/problems/array-nesting/",
      "https://leetcode.com/problems/couples-holding-hands/",
      "https://www.geeksforgeeks.org/minimum-number-swaps-required-sort-array/",
    ],
  },
  {
    title: "4. Running Extrema & Two-Pass Scans",
    description:
      "No data structure, just one or two linear sweeps carrying a running min/max. Increasing Triplet Subsequence is the pattern in miniature — track the smallest value seen and the smallest possible middle element, and an O(n) answer falls out of a problem that looks like it wants an O(n log n) LIS. Shortest Unsorted Continuous Subarray needs the same scan in both directions.",
    links: [
      "https://leetcode.com/problems/increasing-triplet-subsequence/",
      "https://leetcode.com/problems/maximum-difference-between-increasing-elements/",
      "https://leetcode.com/problems/shortest-unsorted-continuous-subarray/",
      "https://leetcode.com/problems/valid-mountain-array/",
      "https://leetcode.com/problems/longest-mountain-in-array/",
    ],
  },
  {
    title: "5. Next Permutation & Lexicographic Order",
    description:
      "The standard-library algorithm worth being able to write cold: scan from the right for the first index that breaks the descending run, swap it with the smallest value to its right that still exceeds it, then reverse the suffix. Maximum Swap and Previous Permutation With One Swap are the same greedy-from-the-right reasoning under different rules. (Next Permutation itself is drilled on the Two Pointer and Backtracking sheets.)",
    links: [
      "https://leetcode.com/problems/next-greater-element-iii/",
      "https://leetcode.com/problems/previous-permutation-with-one-swap/",
      "https://leetcode.com/problems/maximum-swap/",
      "https://leetcode.com/problems/beautiful-arrangement-ii/",
    ],
  },
  {
    title: "6. Counting, Bucketing & the Pigeonhole Principle",
    description:
      "Sorting is O(n log n) only if you compare. When the key space is bounded — digits, ranks, citation counts, letters — count into buckets instead and read them back in order. Maximum Gap is the one to understand properly: pigeonhole says that with n values spread over a range, some bucket of width (max−min)/(n−1) must be empty, so the largest gap has to straddle a bucket boundary and never needs a full sort.",
    links: [
      "https://leetcode.com/problems/maximum-gap/",
      "https://leetcode.com/problems/h-index/",
      "https://leetcode.com/problems/sort-an-array/",
      "https://leetcode.com/problems/degree-of-an-array/",
      "https://leetcode.com/problems/reconstruct-original-digits-from-english/",
      "https://leetcode.com/problems/n-repeated-element-in-size-2n-array/",
      "https://leetcode.com/problems/third-maximum-number/",
    ],
  },
  {
    title: "7. Invariants, Bézout & Constructive Proofs",
    description:
      "The section quant and top-tier interviews actually separate on: the answer is short, but you have to prove why. Bézout's identity says the integers you can reach by adding and subtracting multiples of a set are exactly the multiples of its gcd — which is the whole of Check If It Is a Good Array (gcd == 1) and Water and Jug. Max Chunks to Make Sorted turns on a prefix invariant (a chunk can close only where the running max equals the index), and Global and Local Inversions on the fact that a non-local inversion is the only way to break |perm[i] − i| ≤ 1.",
    links: [
      "https://leetcode.com/problems/check-if-it-is-a-good-array/",
      "https://leetcode.com/problems/water-and-jug-problem/",
      "https://leetcode.com/problems/max-chunks-to-make-sorted/",
      "https://leetcode.com/problems/max-chunks-to-make-sorted-ii/",
      "https://leetcode.com/problems/global-and-local-inversions/",
      "https://leetcode.com/problems/smallest-range-ii/",
      "https://leetcode.com/problems/minimum-moves-to-equal-array-elements/",
      "https://leetcode.com/problems/robot-bounded-in-circle/",
      "https://leetcode.com/problems/beautiful-array/",
    ],
  },
];

export default arraySections;
