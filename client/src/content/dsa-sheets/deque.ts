// src/content/dsa-sheets/deque.ts
//
// Deque (double-ended queue) sheet. Same ordering contract as
// src/data/dpSections.js.
//
// Kept separate from Stack and Queue (see stack.ts, queue.ts) since a deque's
// whole value is that it is neither — push/pop work at both ends in O(1).
//
// Deliberate boundary: the Sliding Window sheet's "Monotonic Deque" section
// already owns Sliding Window Maximum, the fixed-window min/max drill, and
// the DP-optimisation family (Jump Game VI, Constrained Subsequence Sum,
// Sliding Window Median) — that's where the trick is taught end to end, so
// it isn't re-taught here. This sheet is for the deque as its own structure:
// building/designing one, the variable-window extensions of the monotonic
// trick, and the two-ended scanning problems that need push/pop at both ends
// at once.

import type { SheetSection } from "@/types";

const dequeSections: SheetSection[] = [
  {
    title: "1. Deque Fundamentals & Design",
    description:
      "A deque is a queue that also lets you push/pop at the front. Build one from scratch (array or doubly linked list) before reaching for the built-in — Design Front Middle Back Queue forces you to reason about both ends plus a moving midpoint at once.",
    links: [
      "https://leetcode.com/problems/design-circular-deque/",
      "https://leetcode.com/problems/design-front-middle-back-queue/",
      "https://leetcode.com/problems/product-of-the-last-k-numbers/",
      "https://leetcode.com/problems/find-the-winner-of-the-circular-game/",
    ],
  },
  {
    title: "2. Monotonic Deque Beyond the Fixed Window",
    description:
      "The window no longer has a fixed length k — it grows freely and only the stale end gets evicted once a constraint breaks, so both ends of the deque do real work. Max Value of Equation is the one to internalise: the deque holds candidates in an order that is monotonic in *two* coordinates at once.",
    links: [
      "https://leetcode.com/problems/max-value-of-equation/",
      "https://www.geeksforgeeks.org/problems/first-negative-integer-in-every-window-of-size-k3345/1",
      "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/",
      "https://leetcode.com/problems/sum-of-total-strength-of-wizards/",
    ],
  },
  {
    title: "3. Two-Ended Scanning & Circular Elimination",
    description:
      "Problems where the natural algorithm reads from both ends of a sequence at once, or repeatedly removes from the front and requeues at the back. A deque makes both moves O(1), which is exactly what a plain array or a one-ended stack can't offer.",
    links: [
      "https://leetcode.com/problems/valid-palindrome-ii/",
      "https://leetcode.com/problems/di-string-match/",
      "https://leetcode.com/problems/reverse-vowels-of-a-string/",
    ],
  },
];

export default dequeSections;
