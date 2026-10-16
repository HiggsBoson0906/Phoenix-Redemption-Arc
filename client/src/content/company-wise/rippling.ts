// src/content/company-wise/rippling.ts
// Curated from the Rippling SDE interview question bank — OA patterns, the
// "story chain" DSA round, and the stateful-service/LLD family, mapped to
// their closest LeetCode/GfG analogues.

import type { SheetSection } from "@/types";

const ripplingSections: SheetSection[] = [
  {
    title: "OA — Recurring Patterns",
    description: "Practice drills for the six recurring OA patterns reported at Rippling: tree DP / diameter, graph traversal & topo sort, binary search on answer, sliding window, interval/game DP, and digit DP.",
    links: [
      "https://leetcode.com/problems/diameter-of-binary-tree/",
      "https://leetcode.com/problems/tree-diameter/",
      "https://leetcode.com/problems/house-robber-iii/",
      "https://leetcode.com/problems/sum-of-distances-in-tree/",
      "https://leetcode.com/problems/longest-path-with-different-adjacent-characters/",
      "https://leetcode.com/problems/course-schedule/",
      "https://leetcode.com/problems/course-schedule-ii/",
      "https://leetcode.com/problems/parallel-courses/",
      "https://leetcode.com/problems/parallel-courses-iii/",
      "https://leetcode.com/problems/find-eventual-safe-states/",
      "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
      "https://leetcode.com/problems/split-array-largest-sum/",
      "https://leetcode.com/problems/magnetic-force-between-two-balls/",
      "https://leetcode.com/problems/maximum-candies-allocated-to-k-children/",
      "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/",
      "https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/",
      "https://leetcode.com/problems/subarrays-with-k-different-integers/",
      "https://leetcode.com/problems/max-consecutive-ones-iii/",
      "https://leetcode.com/problems/count-subarrays-with-fixed-bounds/",
      "https://leetcode.com/problems/minimum-window-substring/",
      "https://leetcode.com/problems/predict-the-winner/",
      "https://leetcode.com/problems/stone-game/",
      "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/",
      "https://leetcode.com/problems/burst-balloons/",
      "https://leetcode.com/problems/minimum-cost-to-merge-stones/",
      "https://leetcode.com/problems/numbers-at-most-n-given-digit-set/",
      "https://leetcode.com/problems/numbers-with-repeated-digits/",
      "https://leetcode.com/problems/count-special-integers/",
      "https://leetcode.com/problems/number-of-digit-one/",
      "https://leetcode.com/problems/non-negative-integers-without-consecutive-ones/",
      "https://www.geeksforgeeks.org/problems/optimal-strategy-for-a-game-dp-31/",
    ],
  },
  {
    title: "DSA Interview Round — Reported Problems",
    description: "Confirmed onsite \"story chain\" problems — each question is a follow-up that reuses the previous part's insight, so solve these in sequence.",
    links: [
      "https://leetcode.com/problems/evaluate-division/",
      "https://leetcode.com/problems/alien-dictionary/",
      "https://leetcode.com/problems/satisfiability-of-equality-equations/",
      "https://leetcode.com/problems/accounts-merge/",
      "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
      "https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/",
      "https://leetcode.com/problems/merge-intervals/",
      "https://leetcode.com/problems/longest-valid-parentheses/",
      "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      "https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden/",
      "https://leetcode.com/problems/longest-duplicate-substring/",
      "https://leetcode.com/problems/matrix-block-sum/",
      "https://leetcode.com/problems/longest-consecutive-sequence/",
      "https://leetcode.com/problems/data-stream-as-disjoint-intervals/",
      "https://leetcode.com/problems/number-of-islands/",
    ],
  },
  {
    title: "Stateful-Service & LLD Practice",
    description: "Closest LeetCode analogues for the delivery-cost-tracking family and the stateful-service/LLD rounds: incremental aggregates, sweep-line concurrency, caches and snapshotting.",
    links: [
      "https://leetcode.com/problems/car-pooling/",
      "https://leetcode.com/problems/meeting-rooms-ii/",
      "https://leetcode.com/problems/meeting-rooms-iii/",
      "https://leetcode.com/problems/my-calendar-ii/",
      "https://leetcode.com/problems/lfu-cache/",
      "https://leetcode.com/problems/lru-cache/",
      "https://leetcode.com/problems/time-based-key-value-store/",
      "https://leetcode.com/problems/snapshot-array/",
    ],
  },
];

export default ripplingSections;
