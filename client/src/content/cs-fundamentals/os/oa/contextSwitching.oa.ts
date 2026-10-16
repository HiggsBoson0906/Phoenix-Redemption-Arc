// src/content/cs-fundamentals/os/oa/contextSwitching.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const contextSwitchingRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "Context switch = save current process/thread state, load the next one's saved state.",
    "Triggers: time quantum expiry, I/O block, higher-priority process arrival, interrupts/syscalls.",
    "Thread switches (same process) skip page table switch + TLB flush, so they're cheaper than process switches.",
  ],
  importantFacts: [
    "Context switch state includes: program counter, CPU registers, stack pointer, and memory management info (for process switches).",
    "Context switching is pure overhead — no useful work is done during the switch itself.",
  ],
};

export const contextSwitchingOAQuestions: OAQuestion[] = [
  {
    id: "cs-oa-1",
    question: "What is saved during a context switch?",
    options: [
      "Only the program's source code",
      "CPU registers, program counter, and stack pointer (plus memory info for process switches)",
      "Only the process ID",
      "Nothing needs to be saved",
    ],
    correctAnswerIndex: 1,
    explanation: "The OS saves enough CPU and memory-management state to resume the process exactly where it left off later.",
    difficulty: "Easy",
    topicTags: ["basics"],
  },
  {
    id: "cs-oa-2",
    question: "Which of these is NOT a typical trigger for a context switch?",
    options: ["Time quantum expiry", "A process blocking on I/O", "A higher-priority process becoming ready", "The process reading a local variable"],
    correctAnswerIndex: 3,
    explanation: "Reading a local variable is normal execution; it doesn't involve the kernel or trigger a switch.",
    difficulty: "Easy",
    topicTags: ["triggers"],
  },
  {
    id: "cs-oa-3",
    question: "Why are thread switches (within the same process) generally cheaper than process switches?",
    options: [
      "Threads don't have registers",
      "No page table switch or TLB flush is needed since threads share the address space",
      "Thread switches don't require the scheduler",
      "Threads are always higher priority",
    ],
    correctAnswerIndex: 1,
    explanation: "Since threads of the same process share memory mappings, switching between them avoids the costly page table/TLB update.",
    difficulty: "Medium",
    topicTags: ["thread switch cost"],
  },
  {
    id: "cs-oa-4",
    question: "What effect does frequent context switching have on cache performance?",
    options: [
      "No effect at all",
      "It generally improves cache hit rate",
      "It tends to worsen cache/TLB locality since a new process's working set evicts the old one's cached data",
      "It clears all cache permanently",
    ],
    correctAnswerIndex: 2,
    explanation: "Each switch risks evicting the previous process's hot cache/TLB entries, a cost known as cache pollution.",
    difficulty: "Medium",
    topicTags: ["performance"],
  },
  {
    id: "cs-oa-5",
    question: "Context switch overhead is best described as:",
    options: [
      "Useful application work",
      "Pure overhead with no direct application progress",
      "A type of I/O operation",
      "A compiler optimization",
    ],
    correctAnswerIndex: 1,
    explanation: "No application instructions execute during the switch itself — it's the 'cost of doing multitasking business.'",
    difficulty: "Easy",
    topicTags: ["overhead"],
  },
  {
    id: "cs-oa-6",
    question: "A smaller scheduling time quantum generally leads to:",
    options: [
      "Fewer context switches and worse responsiveness",
      "More context switches and better responsiveness, at the cost of more overhead",
      "No change in context switch frequency",
      "Elimination of context switching entirely",
    ],
    correctAnswerIndex: 1,
    explanation: "Shorter quanta mean the CPU switches processes more often, improving perceived responsiveness but adding more switching overhead.",
    difficulty: "Medium",
    topicTags: ["scheduling", "quantum"],
  },
  {
    id: "cs-oa-7",
    question: "Which component is responsible for deciding WHICH process runs next after a context switch is triggered?",
    options: ["The linker", "The scheduler", "The compiler", "The file system"],
    correctAnswerIndex: 1,
    explanation: "The scheduler applies the OS's scheduling policy to pick the next process/thread from the ready queue.",
    difficulty: "Easy",
    topicTags: ["scheduler"],
  },
  {
    id: "cs-oa-8",
    question: "A system interrupt (e.g. a hardware timer interrupt) typically causes:",
    options: [
      "The CPU to halt permanently",
      "A trap into the kernel, potentially followed by a context switch",
      "Immediate process termination",
      "A compiler error",
    ],
    correctAnswerIndex: 1,
    explanation: "Interrupts force the CPU into kernel mode; the OS's interrupt handler may then decide to schedule a different process.",
    difficulty: "Medium",
    topicTags: ["interrupts"],
  },
  {
    id: "cs-oa-9",
    question: "Where is a process's saved context stored between switches?",
    options: ["In the CPU cache permanently", "In its Process Control Block (PCB)", "In the file system", "It is discarded"],
    correctAnswerIndex: 1,
    explanation: "The PCB is exactly the structure designed to hold a suspended process's resumable state.",
    difficulty: "Easy",
    topicTags: ["PCB"],
  },
  {
    id: "cs-oa-10",
    question: "Which of these best describes 'thrashing' in the context of scheduling?",
    options: [
      "A CPU running at maximum clock speed",
      "Spending so much time context-switching that little actual useful work gets done",
      "A disk read error",
      "A network timeout",
    ],
    correctAnswerIndex: 1,
    explanation: "Excessive switching overhead (often from too-small quanta or too many runnable processes) can dominate CPU time over useful execution.",
    difficulty: "Hard",
    topicTags: ["thrashing"],
    companyStyle: "Wipro",
  },
];
