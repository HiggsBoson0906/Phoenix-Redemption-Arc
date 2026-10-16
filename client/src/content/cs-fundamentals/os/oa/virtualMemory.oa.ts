// src/content/cs-fundamentals/os/oa/virtualMemory.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const virtualMemoryRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "Demand paging: load a page only when it's actually accessed (on a page fault).",
    "Page replacement algorithms: FIFO (oldest loaded), Optimal (won't be needed longest), LRU (least recently used).",
    "Belady's Anomaly: under FIFO, adding more frames can sometimes INCREASE the number of page faults.",
    "Thrashing: too little physical memory for combined working sets → excessive faulting → throughput collapses.",
    "Copy-on-write: fork() shares pages read-only; a real copy only happens when either process writes.",
  ],
  importantFacts: [
    "A page fault is a trap to the OS, not a fatal error — it's the normal mechanism for demand paging.",
    "LRU approximates Optimal using the principle of locality (recently used pages are likely to be used again soon).",
    "Thrashing shows high CPU/disk activity but LOW actual throughput — busy doesn't mean productive.",
  ],
};

export const virtualMemoryOAQuestions: OAQuestion[] = [
  {
    id: "vm-oa-1",
    question:
      "For reference string 1,2,3,4,1,2,5,1,2,3,4,5 with 3 frames, how many page faults occur under FIFO?",
    options: ["7", "8", "9", "10"],
    correctAnswerIndex: 2,
    explanation:
      "Simulating FIFO with 3 frames: faults occur on 1,2,3,4(evict1),1(evict2),2(evict3),5(evict4) = 7 faults so far with hits on the next 1,2, then 3(evict5),4(evict1) = 2 more faults, then 5 hits. Total = 9 faults.",
    difficulty: "Hard",
    topicTags: ["FIFO", "page faults", "numerical"],
    companyStyle: "TCS NQT",
  },
  {
    id: "vm-oa-2",
    question:
      "Using the SAME reference string 1,2,3,4,1,2,5,1,2,3,4,5 but with 4 frames instead of 3, how many page faults occur under FIFO — and what does this demonstrate?",
    options: [
      "8 faults — fewer than with 3 frames, as expected",
      "10 faults — MORE than with 3 frames, demonstrating Belady's Anomaly",
      "9 faults — the same as with 3 frames",
      "12 faults — a fault on every access",
    ],
    correctAnswerIndex: 1,
    explanation:
      "With 4 frames, FIFO produces 10 faults — more than the 9 faults with only 3 frames, despite having MORE memory. This counter-intuitive result is exactly what Belady's Anomaly refers to, and it's specific to FIFO (LRU does not exhibit it).",
    difficulty: "Hard",
    topicTags: ["Belady's Anomaly", "FIFO", "numerical"],
    companyStyle: "Amazon OA",
  },
  {
    id: "vm-oa-3",
    question: "For reference string 1,2,3,1,2,4,1,2,3,4 with 3 frames, how many page faults occur under LRU?",
    options: ["4", "5", "6", "7"],
    correctAnswerIndex: 2,
    explanation:
      "1,2,3 each fault (3 faults, frames={1,2,3}). 1,2 hit. 4 faults, evicting LRU=3 (frames={1,2,4}, 4 faults total). 1,2 hit. 3 faults, evicting LRU=4 (5 faults total). 4 faults, evicting LRU=1 (6 faults total). Total = 6 faults.",
    difficulty: "Hard",
    topicTags: ["LRU", "page faults", "numerical"],
  },
  {
    id: "vm-oa-4",
    question: "What is 'thrashing'?",
    options: [
      "A hard disk failure",
      "A state where the system spends most of its time handling page faults instead of doing useful work, due to insufficient physical memory for the active working sets",
      "A CPU overheating condition",
      "A type of deadlock",
    ],
    correctAnswerIndex: 1,
    explanation: "Thrashing occurs when combined working sets exceed available physical memory, causing constant faulting and collapsing real throughput.",
    difficulty: "Easy",
    topicTags: ["thrashing"],
  },
  {
    id: "vm-oa-5",
    question: "Which page replacement algorithm is theoretically optimal but not implementable in practice?",
    options: ["FIFO", "LRU", "Optimal (Belady's Algorithm)", "Random"],
    correctAnswerIndex: 2,
    explanation: "Optimal replacement requires knowing future access patterns in advance, making it usable only as a theoretical benchmark to compare other algorithms against.",
    difficulty: "Easy",
    topicTags: ["Optimal algorithm"],
  },
  {
    id: "vm-oa-6",
    question: "What triggers a page fault?",
    options: [
      "A process requests more CPU time",
      "A process accesses a page whose valid/present bit indicates it's not currently in physical memory",
      "A process terminates",
      "A context switch occurs",
    ],
    correctAnswerIndex: 1,
    explanation: "The hardware detects the invalid page table entry and traps into the OS, which then loads the required page from the backing store.",
    difficulty: "Easy",
    topicTags: ["page fault"],
  },
  {
    id: "vm-oa-7",
    question: "What is copy-on-write primarily used to optimize?",
    options: [
      "Disk read speed",
      "The cost of fork(), by sharing pages read-only until either process writes to them",
      "Network latency",
      "CPU scheduling fairness",
    ],
    correctAnswerIndex: 1,
    explanation: "COW avoids eagerly duplicating a parent's entire memory on fork(), only copying individual pages lazily when actually modified.",
    difficulty: "Medium",
    topicTags: ["copy-on-write"],
  },
  {
    id: "vm-oa-8",
    question: "The fix for thrashing typically involves:",
    options: [
      "Increasing the scheduling quantum",
      "Reducing the degree of multiprogramming (fewer concurrently running processes) so each fits its working set in memory",
      "Disabling the page table",
      "Increasing disk speed only",
    ],
    correctAnswerIndex: 1,
    explanation: "Reducing how many processes compete for physical memory at once lets each one's working set actually fit, ending the fault storm.",
    difficulty: "Medium",
    topicTags: ["thrashing fix"],
  },
  {
    id: "vm-oa-9",
    question: "What is a process's 'working set'?",
    options: [
      "All pages the process could ever access",
      "The set of pages the process is actively using in a given time window",
      "The set of processes it depends on",
      "Its scheduling priority",
    ],
    correctAnswerIndex: 1,
    explanation: "Working set specifically refers to the actively-referenced page subset in a recent time window, central to avoiding thrashing.",
    difficulty: "Medium",
    topicTags: ["working set"],
  },
  {
    id: "vm-oa-10",
    question: "LRU (Least Recently Used) approximates Optimal replacement based on which principle?",
    options: ["Round robin fairness", "The principle of locality (recently used data is likely used again soon)", "First-come-first-served ordering", "Random access theory"],
    correctAnswerIndex: 1,
    explanation: "LRU assumes recent access patterns predict near-future access, which usually holds in practice due to temporal locality.",
    difficulty: "Medium",
    topicTags: ["LRU", "locality"],
  },
];
