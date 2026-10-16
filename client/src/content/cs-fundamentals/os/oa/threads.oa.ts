// src/content/cs-fundamentals/os/oa/threads.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const threadsRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "Threads share: code, data, heap, open files. Threads keep private: registers, stack, program counter.",
    "User-level threads: managed by a library, fast, invisible to kernel.",
    "Kernel-level threads: managed by the OS, enable true multicore parallelism.",
    "Python's GIL allows only one thread to run Python bytecode at a time.",
  ],
  importantFacts: [
    "A process always has at least one thread (the main thread).",
    "Thread creation is significantly cheaper than process creation since no new address space is built.",
    "The 1:1 threading model (one kernel thread per user thread) is what pthreads/Java use today.",
  ],
  memoryTricks: [
    "Remember 'CoDHeF stays shared, RSP stays private': Code, Data, Heap, Files shared; Registers, Stack, Program-counter private.",
  ],
};

export const threadsOAQuestions: OAQuestion[] = [
  {
    id: "threads-oa-1",
    question: "Which of the following is NOT shared between threads of the same process?",
    options: ["Code segment", "Global variables", "Register set", "Open file descriptors"],
    correctAnswerIndex: 2,
    explanation: "Each thread has its own register set (and stack, and program counter) so it can execute independently; everything else is shared.",
    difficulty: "Easy",
    topicTags: ["thread basics"],
  },
  {
    id: "threads-oa-2",
    question: "What is the main advantage of user-level threads over kernel-level threads?",
    options: [
      "They enable true parallelism on multicore CPUs",
      "They are faster to create and switch since no kernel involvement is needed",
      "They survive process crashes",
      "They automatically avoid race conditions",
    ],
    correctAnswerIndex: 1,
    explanation: "User-level threads are managed entirely by a userspace library, avoiding costly kernel-mode switches for scheduling.",
    difficulty: "Medium",
    topicTags: ["user vs kernel threads"],
  },
  {
    id: "threads-oa-3",
    question: "In a naive many-to-one (user-level) threading model, what happens if one thread makes a blocking system call?",
    options: [
      "Only that thread blocks; others continue",
      "The entire process blocks, since the kernel only sees one thread",
      "The call is automatically converted to non-blocking",
      "The thread is killed",
    ],
    correctAnswerIndex: 1,
    explanation: "Because the kernel is unaware of individual user-level threads, a blocking syscall from any one of them blocks the whole process.",
    difficulty: "Hard",
    topicTags: ["threading models"],
  },
  {
    id: "threads-oa-4",
    question: "What does the term 'lightweight process' commonly refer to?",
    options: ["A process with low memory usage", "A thread", "A zombie process", "A kernel process"],
    correctAnswerIndex: 1,
    explanation: "Threads are often called 'lightweight processes' because they are cheaper to create/switch than full processes.",
    difficulty: "Easy",
    topicTags: ["terminology"],
  },
  {
    id: "threads-oa-5",
    question: "What is Python's Global Interpreter Lock (GIL)?",
    options: [
      "A lock that prevents any two Python programs from running simultaneously",
      "A mutex that allows only one thread to execute Python bytecode at a time in CPython",
      "A security feature that blocks untrusted code",
      "A garbage collector",
    ],
    correctAnswerIndex: 1,
    explanation: "The GIL is a CPython implementation detail that serializes bytecode execution across threads, limiting CPU-bound thread parallelism.",
    difficulty: "Medium",
    topicTags: ["GIL", "Python"],
  },
  {
    id: "threads-oa-6",
    question: "Which resource does EACH thread maintain independently?",
    options: ["Heap memory", "Stack", "Open file table", "Global variables"],
    correctAnswerIndex: 1,
    explanation: "Each thread gets its own stack for local variables and call frames, since threads execute independent instruction streams.",
    difficulty: "Easy",
    topicTags: ["thread memory"],
  },
  {
    id: "threads-oa-7",
    question: "Multithreading provides the biggest performance benefit for which type of workload on a multicore CPU?",
    options: [
      "Purely sequential single-step computation",
      "CPU-bound work that can be split across cores, or I/O-bound work that overlaps waiting time",
      "Reading a single small file",
      "None — threads never help performance",
    ],
    correctAnswerIndex: 1,
    explanation: "True parallel CPU-bound work benefits from multiple cores, and I/O-bound work benefits because other threads can run while one waits on I/O.",
    difficulty: "Medium",
    topicTags: ["performance"],
  },
  {
    id: "threads-oa-8",
    question: "A many-to-many threading model maps:",
    options: [
      "Many user threads to one kernel thread",
      "One user thread to one kernel thread",
      "Many user threads to a smaller or equal number of kernel threads",
      "Kernel threads to processes only",
    ],
    correctAnswerIndex: 2,
    explanation: "Many-to-many multiplexes many user-level threads onto a pool of kernel threads, balancing flexibility and true concurrency.",
    difficulty: "Hard",
    topicTags: ["threading models"],
  },
  {
    id: "threads-oa-9",
    question: "Which of these is a real risk introduced specifically by multithreading (not single-threaded processes)?",
    options: ["Disk fragmentation", "Race conditions on shared data", "Page faults", "Compiler errors"],
    correctAnswerIndex: 1,
    explanation: "Race conditions arise when multiple threads access shared memory concurrently without proper synchronization.",
    difficulty: "Easy",
    topicTags: ["concurrency risks"],
  },
  {
    id: "threads-oa-10",
    question: "Why is thread creation generally faster than process creation?",
    options: [
      "Threads don't need a program counter",
      "No new address space / memory mappings need to be set up — the thread reuses the process's existing ones",
      "Threads don't require any OS involvement at all",
      "Threads have no stack",
    ],
    correctAnswerIndex: 1,
    explanation: "Since threads share the process's address space, thread creation skips the expensive memory-mapping setup that process creation requires.",
    difficulty: "Medium",
    topicTags: ["performance", "thread vs process"],
    companyStyle: "Infosys",
  },
];
