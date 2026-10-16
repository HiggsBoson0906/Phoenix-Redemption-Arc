// src/content/dsa-sheets/concurrency.ts
//
// Concurrency & Multithreading sheet. Same ordering contract as
// src/data/dpSections.js.
//
// The one interview axis this site had no *coding* practice for. Every
// low-latency desk (HFT, market making) and every FAANG systems loop asks a
// candidate to write correct multithreaded code, not just to recite what a
// mutex is — and LeetCode's concurrency set is the only mainstream judge that
// grades it, because it actually runs your solution against a scheduler that
// will interleave threads in the order that breaks a wrong answer.
//
// The theory side already lives on the CS Fundamentals side of the site and
// is not repeated here: /learn/os/threads, /learn/os/synchronization and
// /learn/os/deadlocks cover the models (mutex vs semaphore vs condition
// variable, the critical-section problem, and the four Coffman conditions).
// Read those first, then write the code here.
//
// A note on the judge: several of these are LeetCode Premium, as is Meeting
// Rooms II on the Heap sheet. The problem statements are worth working
// through on paper even without a subscription — the pattern matters more
// than the submission.

import type { SheetSection } from "@/types";

const concurrencySections: SheetSection[] = [
  {
    title: "1. Ordering Threads with Signals",
    description:
      "The entry point: several threads, a required output order, and no control over which one the scheduler runs first. The mental model to build is that you never enforce order by sleeping or spinning — you block on a condition and let another thread signal you. Print in Order is the two-semaphore version; Print FooBar and Print Zero Even Odd add a second and third participant, which is where a single lock stops being enough and you need one signal per hand-off edge.",
    links: [
      "https://leetcode.com/problems/print-in-order/",
      "https://leetcode.com/problems/print-foobar-alternately/",
      "https://leetcode.com/problems/print-zero-even-odd/",
      "https://leetcode.com/problems/fizz-buzz-multithreaded/",
    ],
  },
  {
    title: "2. Bounded Buffers & Counting Resources",
    description:
      "Where semaphores stop being interchangeable with mutexes: a counting semaphore tracks how many units of a resource remain, so the producer blocks on 'empty slots' and the consumer on 'filled slots'. Design Bounded Blocking Queue is the classic producer/consumer statement, and Building H2O is the same idea with a grouping constraint — release two hydrogen and one oxygen per barrier, in any order within the group.",
    links: [
      "https://leetcode.com/problems/design-bounded-blocking-queue/",
      "https://leetcode.com/problems/building-h2o/",
      "https://leetcode.com/problems/traffic-light-controlled-intersection/",
    ],
  },
  {
    title: "3. Deadlock, Lock Ordering & Parallel Work",
    description:
      "The Dining Philosophers is on every syllabus for one reason: it is the smallest program that deadlocks for a non-obvious reason, and each fix maps to breaking one of the four Coffman conditions — impose a global lock order (no circular wait), grab both forks or neither (no hold-and-wait), or cap concurrent diners at n−1. Web Crawler Multithreaded is the practical end of the same skill: a shared visited-set and a work queue, where the hard part is knowing when every thread is genuinely finished rather than momentarily idle.",
    links: [
      "https://leetcode.com/problems/the-dining-philosophers/",
      "https://leetcode.com/problems/web-crawler-multithreaded/",
    ],
  },
];

export default concurrencySections;
