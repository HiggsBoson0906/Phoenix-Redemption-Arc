// src/content/cs-fundamentals/os/articles/deadlocks.ts

import type { Article } from "@/types";

const deadlocksArticle: Article = {
  slug: "deadlocks",
  title: "Deadlocks",
  summary:
    "A deadlock is a state where two or more processes are permanently stuck, each waiting for a resource held by another — nobody can proceed, forever.",
  readingTimeMins: 9,
  beginnerExplanation:
    "Picture two people at a narrow doorway, each insisting the other go first, neither willing to step aside — total gridlock. In OS terms, replace people with processes and 'going first' with 'acquiring a resource' (a lock, a file, a printer): if Process A holds Resource 1 and wants Resource 2, while Process B holds Resource 2 and wants Resource 1, both wait forever. That's a deadlock.",
  detailedBreakdown:
    "A deadlock requires all four Coffman conditions to hold simultaneously: (1) Mutual Exclusion — at least one resource is held in a non-shareable mode; (2) Hold and Wait — a process holding at least one resource is waiting to acquire additional resources held by others; (3) No Preemption — resources can't be forcibly taken away, only voluntarily released; (4) Circular Wait — a cycle exists in the wait-for graph (P1 waits for a resource held by P2, which waits for one held by P3, ... which waits for one held by P1).\n\nThere are four general strategies for handling deadlocks: Prevention (structurally break one of the four conditions — e.g. always acquire resources in a fixed global order to eliminate circular wait), Avoidance (allow requests but check if granting them could ever lead to an unsafe state, using algorithms like Banker's Algorithm which requires processes to declare maximum resource needs upfront), Detection and Recovery (let deadlocks happen, periodically check the wait-for graph for cycles, then recover by killing/rolling back a process or preempting a resource), and Ignorance (the 'ostrich algorithm' — most general-purpose OSes like Linux and Windows actually do this for most resources, betting that deadlocks are rare enough in practice that the overhead of prevention/detection isn't worth it, and rebooting/restarting is an acceptable recovery).\n\nBanker's Algorithm, the classic avoidance approach, works by simulating whether granting a resource request would leave the system in a 'safe state' — one where there still exists some ordering of processes that can all complete given the resources currently available plus what they'll release.",
  realWorldExamples:
    "Database systems face deadlocks constantly when two transactions each hold a lock the other needs (e.g. Transaction A locks Row 1 then wants Row 2; Transaction B locks Row 2 then wants Row 1) — production databases run automatic deadlock detectors that pick a 'victim' transaction to abort and roll back. In application code, acquiring two mutexes in inconsistent order across different code paths is a classic real-world deadlock bug, which is why style guides mandate a fixed lock-acquisition order.",
  useCases: [
    "Understanding why concurrent systems (databases, multi-threaded applications) need careful lock-ordering discipline",
    "Designing resource-allocation systems that must guarantee forward progress (e.g. real-time or safety-critical systems using avoidance)",
  ],
  advantages: [
    "N/A — deadlock itself is a failure mode, not a feature; understanding it is what lets you design systems that avoid it",
  ],
  disadvantages: [
    "A deadlocked system makes zero progress on the affected processes — often requiring a kill/restart to recover",
    "Deadlocks can be extremely hard to reproduce and debug since they depend on precise timing/ordering",
  ],
  commonMisconceptions: [
    "\"Deadlock and starvation are the same thing\" — starvation means a process is repeatedly passed over but the system as a whole keeps making progress; deadlock means a set of processes make zero progress, permanently.",
    "\"Deadlocks require exactly 2 processes\" — a circular wait can involve any number of processes in a cycle.",
    "\"Preventing deadlocks always requires expensive detection algorithms\" — the cheapest fix is usually just breaking one Coffman condition, like enforcing a global lock-acquisition order (breaking circular wait), with zero runtime overhead.",
  ],
  interviewPerspective:
    "Interviewers expect you to recite all four Coffman conditions cold, explain how breaking any ONE of them prevents deadlock, and ideally walk through a wait-for-graph cycle detection example. A live coding-adjacent favorite: 'here's code that locks mutex A then B in one thread, and B then A in another — what's wrong and how do you fix it?' (answer: inconsistent lock ordering; fix by always acquiring in the same global order).",
  oaPerspective:
    "OA MCQs test the four Coffman conditions directly and Banker's Algorithm safe-state calculations (given Allocation, Max, and Available matrices, determine if a state is safe or find a safe sequence). These matrix problems are very mechanical once practiced — expect at least one in most product-company OA sets.",
  keyTakeaways: [
    "Deadlock requires all four Coffman conditions: mutual exclusion, hold-and-wait, no preemption, circular wait.",
    "Breaking any single condition prevents deadlock — enforcing lock order (breaks circular wait) is the cheapest common fix.",
    "Strategies: prevention, avoidance (Banker's Algorithm), detection+recovery, or ignoring it (ostrich algorithm, used by most general OSes).",
    "Deadlock ≠ starvation: deadlock is permanent zero progress for a set of processes; starvation is a process being repeatedly, but not permanently, skipped.",
  ],
  summaryClosing:
    "Deadlocks are the sharpest edge of concurrent resource management — a single inconsistent lock order can silently freeze a production system. The next article, Synchronization, covers the primitives (mutexes, semaphores, monitors) whose misuse is exactly what causes deadlocks in the first place.",
  relatedTopics: ["Synchronization", "Processes", "Scheduling Algorithms"],
  furtherReading: [
    { label: "OSTEP: Concurrency Bugs chapter", note: "Covers real deadlock bug patterns found in production codebases." },
    { label: "Banker's Algorithm worked examples", note: "Practice safe-state / safe-sequence calculations by hand." },
  ],
};

export default deadlocksArticle;
