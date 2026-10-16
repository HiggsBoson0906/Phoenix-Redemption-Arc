// src/content/dsa-sheets/rangeQuery.ts
//
// Range Query sheet. Same ordering contract as src/data/dpSections.js.
//
// The sheet climbs one axis: how much the array is allowed to change.
//   static array, offline           -> prefix sums / sparse table   (§1-3)
//   point updates                   -> Fenwick tree / segment tree  (§4-6)
//   range updates                   -> lazy propagation             (§7)
//   structural / persistent queries -> advanced                     (§8-9)
// CSES is the backbone here because its Range Queries section is the cleanest
// graded ladder for this topic that exists anywhere.

import type { SheetSection } from "@/types";

const rangeQuerySections: SheetSection[] = [
  {
    title: "1. Prefix Sums — Static Range Sums",
    description:
      "One precomputation, O(1) per query. Also the section where you meet the difference array: adding v to every element of [l, r] is two point updates on the difference array, not r−l+1 writes.",
    links: [
      "https://leetcode.com/problems/running-sum-of-1d-array/",
      "https://leetcode.com/problems/find-pivot-index/",
      "https://leetcode.com/problems/range-sum-query-immutable/",
      "https://cses.fi/problemset/task/1646",
      "https://leetcode.com/problems/left-and-right-sum-differences/",
      "https://leetcode.com/problems/minimum-value-to-get-positive-step-by-step-sum/",
      "https://leetcode.com/problems/find-the-highest-altitude/",
      "https://leetcode.com/problems/product-of-array-except-self/",
      "https://leetcode.com/problems/range-sum-query-2d-immutable/",
      "https://cses.fi/problemset/task/1652",
      "https://leetcode.com/problems/corporate-flight-bookings/",
      "https://cses.fi/problemset/task/1651",
      "https://leetcode.com/problems/car-pooling/",
      "https://leetcode.com/problems/matrix-block-sum/",
      "https://leetcode.com/problems/maximum-sum-of-an-hourglass/",
      "https://leetcode.com/problems/subrectangle-queries/",
      "https://leetcode.com/problems/sum-of-absolute-differences-in-a-sorted-array/",
      "https://leetcode.com/problems/shifting-letters-ii/",
      "https://leetcode.com/problems/zero-array-transformation-i/",
      "https://leetcode.com/problems/stamping-the-grid/",
    ],
  },
  {
    title: "2. Prefix Sums with a Hash Map — Subarray Counting",
    description:
      "The trick behind an entire genre: a subarray sums to k exactly when two prefix sums differ by k. Store prefix sums seen so far in a map. Subarray Sum Equals K is the one that shows up in real interviews most.",
    links: [
      "https://leetcode.com/problems/subarray-sum-equals-k/",
      "https://cses.fi/problemset/task/1660",
      "https://leetcode.com/problems/continuous-subarray-sum/",
      "https://cses.fi/problemset/task/1662",
      "https://leetcode.com/problems/subarray-sums-divisible-by-k/",
      "https://leetcode.com/problems/contiguous-array/",
      "https://leetcode.com/problems/binary-subarrays-with-sum/",
      "https://leetcode.com/problems/number-of-ways-to-split-array/",
      "https://leetcode.com/problems/make-sum-divisible-by-p/",
      "https://leetcode.com/problems/count-of-interesting-subarrays/",
      "https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/",
      "https://leetcode.com/problems/number-of-submatrices-that-sum-to-target/",
    ],
  },
  {
    title: "3. Sparse Table — Idempotent Static Queries",
    description:
      "O(n log n) build, O(1) query, no updates ever. Works for min/max/gcd because overlapping ranges do not corrupt the answer. This is the right tool whenever the array is read-only and the query is a range minimum.",
    links: [
      "https://cses.fi/problemset/task/1647",
      "https://leetcode.com/problems/range-frequency-queries/",
      "https://leetcode.com/problems/find-the-power-of-k-size-subarrays-i/",
      "https://leetcode.com/problems/range-product-queries-of-powers/",
      "https://leetcode.com/problems/maximum-strength-of-k-disjoint-subarrays/",
    ],
  },
  {
    title: "4. Fenwick Tree (BIT) — Point Update, Prefix Query",
    description:
      "Twenty lines, O(log n) both ways. Once you can build it, the real skill is *recognising* it: 'count elements smaller than x seen so far' is a Fenwick tree over values, which is how inversion counting works.",
    links: [
      "https://cses.fi/problemset/task/1648",
      "https://leetcode.com/problems/range-sum-query-mutable/",
      "https://www.spoj.com/problems/INVCNT/",
      "https://leetcode.com/problems/queries-on-a-permutation-with-key/",
      "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
      "https://leetcode.com/problems/reverse-pairs/",
      "https://leetcode.com/problems/create-sorted-array-through-instructions/",
      "https://cses.fi/problemset/task/1749",
      "https://cses.fi/problemset/task/1144",
      "https://leetcode.com/problems/count-of-range-sum/",
      "https://leetcode.com/problems/longest-increasing-subsequence-ii/",
    ],
  },
  {
    title: "5. Segment Tree — Point Update, Range Query",
    description:
      "The general-purpose answer: any associative merge works, not just sums. Write build/update/query recursively once and reuse it forever — most interview segment-tree questions only change the merge function.",
    links: [
      "https://cses.fi/problemset/task/1649",
      "https://cses.fi/problemset/task/1650",
      "https://www.spoj.com/problems/KGSS/",
      "https://codeforces.com/problemset/problem/339/D",
      "https://leetcode.com/problems/xor-queries-of-a-subarray/",
      "https://leetcode.com/problems/maximum-sum-queries/",
      "https://cses.fi/problemset/task/2166",
      "https://www.spoj.com/problems/GSS1/",
      "https://codeforces.com/problemset/problem/380/C",
      "https://cses.fi/problemset/task/1190",
      "https://leetcode.com/problems/longest-substring-of-one-repeating-character/",
      "https://leetcode.com/problems/peaks-in-array/",
    ],
  },
  {
    title: "6. Descending the Tree — Search Inside a Segment Tree",
    description:
      "Instead of querying a range, walk down the tree to find the first position satisfying a predicate — 'first hotel with enough rooms', 'k-th one in a bitset'. Turns an O(log² n) binary-search-over-queries into O(log n).",
    links: [
      "https://cses.fi/problemset/task/1143",
      "https://cses.fi/problemset/task/2206",
      "https://cses.fi/problemset/task/2416",
      "https://leetcode.com/problems/booking-concert-tickets-in-groups/",
      "https://leetcode.com/problems/handling-sum-queries-after-update/",
    ],
  },
  {
    title: "7. Lazy Propagation — Range Update, Range Query",
    description:
      "Push updates down only when you actually need to look at a child. The bookkeeping is where bugs live, so do Range Update Queries and Horrible Queries before anything with two composed update types.",
    links: [
      "https://leetcode.com/problems/maximum-white-tiles-covered-by-a-carpet/",
      "https://www.spoj.com/problems/HORRIBLE/",
      "https://cses.fi/problemset/task/1735",
      "https://codeforces.com/problemset/problem/52/C",
      "https://cses.fi/problemset/task/1739",
      "https://cses.fi/problemset/task/1736",
      "https://leetcode.com/problems/range-module/",
      "https://leetcode.com/problems/my-calendar-iii/",
      "https://leetcode.com/problems/falling-squares/",
    ],
  },
  {
    title: "8. Offline Queries — Sort the Questions, Not the Data",
    description:
      "When queries can be reordered, sorting them by right endpoint or by threshold collapses a hard online problem into a single sweep. Distinct Values Queries is the archetype and a common quant-round question.",
    links: [
      "https://cses.fi/problemset/task/1734",
      "https://codeforces.com/problemset/problem/1234/D",
      "https://cses.fi/problemset/task/1664",
      "https://leetcode.com/problems/number-of-flowers-in-full-bloom/",
      "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/",
      "https://leetcode.com/problems/checking-existence-of-edge-length-limited-paths/",
      "https://leetcode.com/problems/minimum-interval-to-include-each-query/",
      "https://cses.fi/problemset/task/2169",
    ],
  },
  {
    title: "9. Monotonic Stack — Range Queries Without a Tree",
    description:
      "Previous/next smaller element in O(n) total. Half the 'range minimum' problems never need a segment tree at all once you see the stack solution — Largest Rectangle in Histogram is the one to master.",
    links: [
      "https://leetcode.com/problems/next-greater-element-i/",
      "https://leetcode.com/problems/daily-temperatures/",
      "https://cses.fi/problemset/task/1645",
      "https://leetcode.com/problems/next-greater-element-ii/",
      "https://leetcode.com/problems/online-stock-span/",
      "https://leetcode.com/problems/sum-of-subarray-minimums/",
      "https://leetcode.com/problems/maximum-subarray-min-product/",
      "https://leetcode.com/problems/next-greater-node-in-linked-list/",
      "https://leetcode.com/problems/remove-k-digits/",
      "https://leetcode.com/problems/132-pattern/",
      "https://leetcode.com/problems/sum-of-subarray-ranges/",
      "https://leetcode.com/problems/largest-rectangle-in-histogram/",
      "https://leetcode.com/problems/maximal-rectangle/",
      "https://leetcode.com/problems/sum-of-total-strength-of-wizards/",
    ],
  },
];

export default rangeQuerySections;
