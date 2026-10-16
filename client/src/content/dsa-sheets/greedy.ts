// src/content/dsa-sheets/greedy.ts
//
// Greedy sheet. Same ordering contract as src/data/dpSections.js.
//
// Greedy is the one topic where the code is trivial and the *proof* is the
// interview. Every section here is organised by the exchange argument that
// justifies it, not by the surface story of the problem.
//
// Deliberate placements, per the sheet-wide "technique decides the sheet" rule:
//   Jump Game I and II are greedy and live here; III/IV are BFS (graph sheet)
//   and V/VI are DP (DP sheet).
//   Stone Game VI and IX live here — VI is "sort by combined value" and IX is
//   a counting argument on residues mod 3. Neither is a DP, so neither belongs
//   in the DP sheet's Stone Game section.

import type { SheetSection } from "@/types";

const greedySections: SheetSection[] = [
  {
    title: "1. Sort-Then-Sweep — the Basic Exchange Argument",
    description:
      "Sort by the right key and a single pass is optimal. Before writing code, finish this sentence: 'if the optimal solution disagreed with my choice, I could swap and not get worse.' That sentence is the whole topic.",
    links: [
      "https://leetcode.com/problems/assign-cookies/",
      "https://leetcode.com/problems/array-partition/",
      "https://leetcode.com/problems/maximum-units-on-a-truck/",
      "https://cses.fi/problemset/task/1090",
      "https://cses.fi/problemset/task/1074",
      "https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position/",
      "https://codeforces.com/problemset/problem/977/C",
      "https://leetcode.com/problems/lemonade-change/",
      "https://leetcode.com/problems/can-place-flowers/",
      "https://leetcode.com/problems/maximum-69-number/",
      "https://leetcode.com/problems/minimum-operations-to-make-the-array-increasing/",
      "https://leetcode.com/problems/boats-to-save-people/",
      "https://leetcode.com/problems/reduce-array-size-to-the-half/",
      "https://leetcode.com/problems/maximum-number-of-coins-you-can-get/",
      "https://leetcode.com/problems/largest-number/",
      "https://leetcode.com/problems/queue-reconstruction-by-height/",
      "https://leetcode.com/problems/maximum-ice-cream-bars/",
      "https://leetcode.com/problems/minimum-rounds-to-complete-all-tasks/",
      "https://leetcode.com/problems/minimum-time-to-make-rope-colorful/",
      "https://leetcode.com/problems/wiggle-sort-ii/",
    ],
  },
  {
    title: "2. Interval Scheduling — Sort by End Time",
    description:
      "The canonical greedy proof: to fit the most intervals, always take the one that finishes earliest. Non-Overlapping Intervals and Minimum Arrows are the same algorithm with the answer counted differently.",
    links: [
      "https://cses.fi/problemset/task/1629",
      "https://leetcode.com/problems/merge-intervals/",
      "https://leetcode.com/problems/insert-interval/",
      "https://leetcode.com/problems/non-overlapping-intervals/",
      "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
      "https://leetcode.com/problems/find-right-interval/",
      "https://cses.fi/problemset/task/1164",
      "https://leetcode.com/problems/car-pooling/",
      "https://leetcode.com/problems/divide-intervals-into-minimum-number-of-groups/",
      "https://leetcode.com/problems/count-ways-to-group-overlapping-ranges/",
      "https://codeforces.com/problemset/problem/1029/C",
      "https://leetcode.com/problems/remove-covered-intervals/",
      "https://cses.fi/problemset/task/2168",
      "https://leetcode.com/problems/partition-array-into-disjoint-intervals/",
    ],
  },
  {
    title: "3. Reachability Greedy — Jump Game Family",
    description:
      "Track the furthest index reachable so far instead of simulating every path. Jump Game II is the O(n) BFS-in-disguise version — do it after I so the 'current level end' bookkeeping makes sense.",
    links: [
      "https://leetcode.com/problems/jump-game/",
      "https://leetcode.com/problems/jump-game-ii/",
      "https://www.geeksforgeeks.org/problems/minimum-number-of-jumps-1587115620/1",
      "https://leetcode.com/problems/gas-station/",
      "https://leetcode.com/problems/video-stitching/",
      "https://leetcode.com/problems/maximum-number-of-jumps-to-reach-the-last-index/",
      "https://leetcode.com/problems/jump-game-vii/",
      "https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden/",
    ],
  },
  {
    title: "4. Greedy with a Heap — Always Take the Current Best",
    description:
      "When the 'best remaining option' changes as you go, a priority queue maintains it for you. Task Scheduler and IPO are the two shapes: schedule the most frequent first, or buy the most profitable affordable thing.",
    links: [
      "https://leetcode.com/problems/last-stone-weight/",
      "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      "https://leetcode.com/problems/task-scheduler/",
      "https://leetcode.com/problems/reorganize-string/",
      "https://leetcode.com/problems/maximum-average-pass-ratio/",
      "https://www.geeksforgeeks.org/problems/huffman-encoding3345/1",
      "https://codeforces.com/problemset/problem/1526/C2",
      "https://leetcode.com/problems/find-the-most-competitive-subsequence/",
      "https://leetcode.com/problems/process-tasks-using-servers/",
      "https://leetcode.com/problems/single-threaded-cpu/",
      "https://leetcode.com/problems/remove-stones-to-minimize-the-total/",
      "https://leetcode.com/problems/smallest-number-in-infinite-set/",
      "https://leetcode.com/problems/seat-reservation-manager/",
      "https://leetcode.com/problems/furthest-building-you-can-reach/",
      "https://leetcode.com/problems/maximum-bags-with-full-capacity-of-rocks/",
      "https://leetcode.com/problems/course-schedule-iii/",
      "https://leetcode.com/problems/ipo/",
      "https://leetcode.com/problems/maximum-performance-of-a-team/",
      "https://leetcode.com/problems/minimum-number-of-refueling-stops/",
      "https://leetcode.com/problems/put-marbles-in-bags/",
    ],
  },
  {
    title: "5. Greedy on Digits & Strings",
    description:
      "Build the answer left to right, taking the locally best character and proving you never need to backtrack. Remove K Digits introduces the monotonic stack, which is the workhorse for the rest of the section.",
    links: [
      "https://leetcode.com/problems/split-a-string-in-balanced-strings/",
      "https://leetcode.com/problems/remove-k-digits/",
      "https://leetcode.com/problems/monotone-increasing-digits/",
      "https://leetcode.com/problems/remove-duplicate-letters/",
      "https://leetcode.com/problems/smallest-subsequence-of-distinct-characters/",
      "https://codeforces.com/problemset/problem/1102/D",
      "https://codeforces.com/problemset/problem/1256/D",
      "https://leetcode.com/problems/partition-labels/",
      "https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique/",
      "https://leetcode.com/problems/maximum-score-from-removing-substrings/",
      "https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced/",
      "https://leetcode.com/problems/create-maximum-number/",
    ],
  },
  {
    title: "6. Greedy Game Theory — Stone Game VI & IX",
    description:
      "The Stone Game entries that are NOT dynamic programming. VI sorts by aliceValues[i] + bobValues[i] because that sum is what each pick swings; IX is pure counting on residues mod 3. Everything else in the family is in the DP sheet.",
    links: [
      "https://leetcode.com/problems/minimum-number-of-moves-to-seat-everyone/",
      "https://leetcode.com/problems/stone-game-vi/",
      "https://leetcode.com/problems/stone-game-ix/",
      "https://leetcode.com/problems/maximum-score-from-removing-stones/",
      "https://leetcode.com/problems/find-the-winner-of-the-circular-game/",
      "https://cses.fi/problemset/task/2162",
    ],
  },
  {
    title: "7. Greedy Verified by Counting or Invariants",
    description:
      "No sorting and no heap — the greedy step is justified by an invariant you maintain. Candy and Gas Station are the two that get asked; both look like DP until you spot the two-pass or running-deficit argument.",
    links: [
      "https://codeforces.com/problemset/problem/158/B",
      "https://leetcode.com/problems/valid-parenthesis-string/",
      "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/",
      "https://leetcode.com/problems/wiggle-subsequence/",
      "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
      "https://codeforces.com/problemset/problem/1462/D",
      "https://leetcode.com/problems/minimum-number-of-operations-to-make-array-empty/",
      "https://leetcode.com/problems/minimum-swaps-to-make-strings-equal/",
      "https://leetcode.com/problems/hand-of-straights/",
      "https://leetcode.com/problems/dota2-senate/",
      "https://leetcode.com/problems/candy/",
    ],
  },
  {
    title: "8. Greedy Under a Budget or Deadline",
    description:
      "Scheduling with a hard constraint, where the greedy choice is 'commit now, undo the worst commitment later if it helps'. The undo-with-a-heap pattern in Course Schedule III is the idea worth stealing.",
    links: [
      "https://cses.fi/problemset/task/1630",
      "https://cses.fi/problemset/task/1631",
      "https://cses.fi/problemset/task/1091",
      "https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/",
      "https://leetcode.com/problems/two-city-scheduling/",
      "https://leetcode.com/problems/car-fleet/",
      "https://leetcode.com/problems/minimum-cost-to-hire-k-workers/",
      "https://leetcode.com/problems/maximum-profit-in-job-scheduling/",
      "https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign/",
    ],
  },
];

export default greedySections;
