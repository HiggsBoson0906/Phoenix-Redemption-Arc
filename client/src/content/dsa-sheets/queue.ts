// src/content/dsa-sheets/queue.ts
//
// Queue sheet. Same ordering contract as src/data/dpSections.js.
//
// Kept separate from Stack and Deque (see stack.ts, deque.ts) — a queue's
// defining property is FIFO order, which is what makes it the right tool for
// "process things in the order they arrived" and "expand outward one layer
// at a time." BFS on a graph properly lives on the Graph sheet since the
// technique being drilled there is graph traversal, not the queue itself;
// this sheet is for problems where the queue mechanics are the whole point.

import type { SheetSection } from "@/types";

const queueSections: SheetSection[] = [
  {
    title: "1. Queue Fundamentals & Simulation",
    description:
      "Model a real-world FIFO process directly: tickets, requests, tasks. No cleverness needed yet — just get comfortable with enqueue/dequeue as the two operations that define the structure.",
    links: [
      "https://leetcode.com/problems/implement-queue-using-stacks/",
      "https://leetcode.com/problems/number-of-recent-calls/",
      "https://leetcode.com/problems/time-needed-to-buy-tickets/",
      "https://leetcode.com/problems/design-circular-queue/",
      "https://leetcode.com/problems/reveal-cards-in-increasing-order/",
    ],
  },
  {
    title: "2. Level-by-Level Processing (BFS Mechanics)",
    description:
      "The queue is what makes 'visit everything at distance 1, then everything at distance 2' possible — snapshot the queue's current size before the inner loop and you get one level per iteration for free. Practice the mechanic here before applying it to graphs on the Graph sheet.",
    links: [
      "https://leetcode.com/problems/average-of-levels-in-binary-tree/",
      "https://leetcode.com/problems/cousins-in-binary-tree/",
      "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
      "https://leetcode.com/problems/binary-tree-right-side-view/",
      "https://leetcode.com/problems/find-largest-value-in-each-tree-row/",
      "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/",
    ],
  },
  {
    title: "3. Multi-Source BFS & Rotting-Process Simulation",
    description:
      "Seed the queue with every starting point at once instead of one — the queue naturally interleaves their frontiers so the first time a cell is reached is guaranteed to be its shortest distance from *any* source.",
    links: [
      "https://leetcode.com/problems/rotting-oranges/",
      "https://leetcode.com/problems/01-matrix/",
      "https://leetcode.com/problems/walls-and-gates/",
      "https://leetcode.com/problems/as-far-from-land-as-possible/",
      "https://leetcode.com/problems/shortest-bridge/",
      "https://leetcode.com/problems/shortest-distance-from-all-buildings/",
    ],
  },
  {
    title: "4. Topological Order via In-Degree Queue (Kahn's Algorithm)",
    description:
      "Push every node with in-degree 0, and every time an edge is 'consumed' by popping its source, decrement the target's in-degree and push it once it hits zero. This is a queue algorithm even though it answers a graph-ordering question — it belongs here for the mechanic, cross-reference the Graph sheet for the underlying theory.",
    links: [
      "https://leetcode.com/problems/course-schedule/",
      "https://leetcode.com/problems/course-schedule-ii/",
      "https://leetcode.com/problems/sequence-reconstruction/",
      "https://leetcode.com/problems/parallel-courses/",
      "https://leetcode.com/problems/alien-dictionary/",
      "https://cses.fi/problemset/task/1679",
    ],
  },
  {
    title: "5. Queue-Based Design & Scheduling",
    description:
      "Interview design questions that reduce to 'process requests in arrival order, but drop or batch them under some rule.' Design Hit Counter and Moving Average both use the same trick: keep only the window that's still relevant and let the queue's FIFO order do the eviction for you.",
    links: [
      "https://leetcode.com/problems/moving-average-from-data-stream/",
      "https://leetcode.com/problems/design-hit-counter/",
      "https://leetcode.com/problems/task-scheduler/",
      "https://leetcode.com/problems/dota2-senate/",
      "https://leetcode.com/problems/design-a-food-rating-system/",
      "https://leetcode.com/problems/design-snake-game/",
    ],
  },
];

export default queueSections;
