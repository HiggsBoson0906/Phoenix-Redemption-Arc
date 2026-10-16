// src/content/dsa-sheets/heap.ts
//
// Heap / Priority Queue sheet. Same ordering contract as
// src/data/dpSections.js.
//
// Deliberate boundary: the Greedy sheet's "Greedy with a Heap" section
// already owns the large family where the heap's only job is "always take
// the current best" for a greedy proof (Task Scheduler, IPO, Reorganize
// String, and ~15 more) — that's a greedy technique that happens to use a
// heap, so it stays there. Dijkstra's and Prim's live on the Graph sheet for
// the same reason — the technique being drilled is graph shortest-path, not
// the heap. This sheet is for problems where maintaining a heap invariant
// *is* the technique: order statistics, running medians, and k-way merges.

import type { SheetSection } from "@/types";

const heapSections: SheetSection[] = [
  {
    title: "1. Heap Fundamentals — Kth Largest / Smallest & Top-K",
    description:
      "Push everything and pop down to size k, or bound the heap at size k as you go — the second is the O(n log k) version worth defaulting to. Kth Largest Element in a Stream forces the 'bounded heap' framing since the structure has to persist across calls.",
    links: [
      "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
      "https://leetcode.com/problems/top-k-frequent-elements/",
      "https://leetcode.com/problems/top-k-frequent-words/",
      "https://leetcode.com/problems/k-closest-points-to-origin/",
      "https://leetcode.com/problems/sort-characters-by-frequency/",
    ],
  },
  {
    title: "2. Two Heaps — Running Median & Balanced Split",
    description:
      "Split the data into a max-heap of the smaller half and a min-heap of the larger half, and keep their sizes within one of each other — the median is then O(1) to read off the top of either heap. Find Median from Data Stream is the problem this pattern was invented for.",
    links: [
      "https://leetcode.com/problems/find-median-from-data-stream/",
      "https://leetcode.com/problems/finding-mk-average/",
      "https://leetcode.com/problems/maximum-subsequence-score/",
      "https://leetcode.com/problems/random-pick-with-weight/",
    ],
  },
  {
    title: "3. Heap for K-Way Merge & Smallest-K Combinations",
    description:
      "When you need the smallest (or largest) k results out of k already-sorted sources — lists, arrays, or pairwise sums — a heap seeded with one candidate per source and refilled on every pop generates them in sorted order without ever materialising the full cross product.",
    links: [
      "https://leetcode.com/problems/merge-k-sorted-lists/",
      "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/",
      "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",
      "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/",
    ],
  },
  {
    title: "4. Heap-Backed Design & Interval Scheduling",
    description:
      "Design questions where 'give me the current best/next item' has to answer in O(log n) after arbitrary insertions. Meeting Rooms II and The Skyline Problem both use a heap to track 'what's still active right now' as a sweep line moves across the timeline.",
    links: [
      "https://leetcode.com/problems/meeting-rooms-ii/",
      "https://leetcode.com/problems/the-skyline-problem/",
      "https://leetcode.com/problems/design-twitter/",
      "https://leetcode.com/problems/minimum-cost-to-connect-sticks/",
    ],
  },
];

export default heapSections;
