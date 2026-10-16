// src/content/cs-fundamentals/os/interview/threads.interview.ts

import type { InterviewQuestion } from "@/types";

const threadsInterviewQuestions: InterviewQuestion[] = [
  {
    id: "threads-iv-1",
    question: "What's the difference between a process and a thread?",
    difficulty: "Easy",
    detailedAnswer:
      "A process has its own isolated address space (code, data, heap, stack) and is the OS's unit of resource allocation; a thread lives inside a process and shares that process's code, data, heap, and open files with any sibling threads, but keeps its own stack, registers, and program counter. Processes are isolated and expensive to create/switch; threads are cheap but share fate — a crash or corruption in one thread can affect the whole process.",
    idealAnswer:
      "I'd frame it as isolation versus sharing: a process gets its own private memory space, so it's safe but expensive to create and communicate with (needs IPC). A thread is a lighter-weight execution unit inside a process that shares that process's memory with other threads, making it cheap to create and easy to share data with — but that shared memory is exactly what causes race conditions and makes threads riskier to get correct.",
    interviewerExpectations: [
      "Clear shared-vs-private resource breakdown",
      "Mentions cost trade-off (creation/switching)",
      "Mentions correctness trade-off (isolation vs shared-memory bugs)",
    ],
    followUpQuestions: [
      "What does a thread keep private that a process doesn't share with other threads?",
      "Why might you choose processes over threads even though threads are cheaper?",
      "What is the GIL and how does it affect this trade-off in Python?",
    ],
    commonMistakes: [
      "Saying threads and processes are basically the same thing at different scales",
      "Forgetting that threads share the heap and can therefore see each other's dynamically allocated memory",
    ],
    discussionPoints: ["Shared vs private resources", "IPC vs direct memory sharing", "Crash blast radius"],
  },
  {
    id: "threads-iv-2",
    question: "What is the difference between user-level and kernel-level threads?",
    difficulty: "Medium",
    detailedAnswer:
      "User-level threads are created, scheduled, and switched entirely by a userspace threading library, with the kernel unaware they exist — fast to manage but a blocking syscall from one can stall the whole process in the naive many-to-one model, and they can't achieve true multicore parallelism since the kernel only schedules the one underlying process. Kernel-level threads are created and scheduled by the OS itself, appear in the kernel's scheduling tables, cost more per context switch (kernel-mode transition), but can run truly in parallel across cores and don't block siblings on I/O.",
    idealAnswer:
      "User-level threads are managed in userspace by a library — cheap, but the kernel has no idea they exist, so it schedules the whole process as one unit, which means you can't get true multicore parallelism and one blocking call can freeze all of them. Kernel-level threads are visible to the OS scheduler directly, so they cost a bit more to switch but you get real parallelism and proper preemption. Most production systems today use a 1:1 model — pthreads and Java threads map one user thread to one kernel thread — to get the best of both.",
    interviewerExpectations: [
      "Correctly explains kernel visibility as the key differentiator",
      "Connects visibility to blocking behavior and parallelism capability",
      "Knows the 1:1 model is what's actually used in practice today",
    ],
    followUpQuestions: [
      "What is the many-to-many model and why would you use it?",
      "How does green threads (like old Go runtime or Erlang) fit into this?",
      "Why can't user-level threads achieve true parallelism on their own?",
    ],
    commonMistakes: [
      "Confusing 'user-level' with 'less important' rather than 'kernel-invisible'",
      "Not knowing which model modern pthreads/Java actually use",
    ],
    discussionPoints: ["Kernel visibility", "Blocking behavior", "1:1 vs many:1 vs many:many models"],
  },
  {
    id: "threads-iv-3",
    question: "Why might you choose multiple processes over multiple threads for a given design, even knowing threads are cheaper?",
    difficulty: "Medium",
    detailedAnswer:
      "Isolation is the main reason: if one worker crashes or corrupts memory, a separate process contains the damage, while a thread crash can take down the entire application (this is precisely why browsers run each tab as its own process). Processes also give the OS finer-grained resource control (per-process memory/CPU limits via cgroups), avoid shared-memory bugs entirely for that unit of work, and sidestep language-level concurrency limitations like Python's GIL for CPU-bound parallelism. The cost is heavier IPC and slower creation, which is worth paying when correctness/fault-isolation matters more than raw throughput.",
    idealAnswer:
      "I'd pick processes when I need real fault isolation — like Chrome running each tab as its own process so one crashing tab doesn't kill the browser — or when I need per-unit resource limits, or when I'm in a language like Python where CPU-bound threads don't actually run in parallel due to the GIL, so multiprocessing is the only way to use multiple cores for that kind of work. The trade-off is slower creation and needing explicit IPC instead of just sharing memory.",
    interviewerExpectations: [
      "Names fault isolation as the primary driver",
      "Gives a concrete real-world example",
      "Mentions at least one language/runtime-specific reason (GIL) if relevant",
    ],
    followUpQuestions: [
      "How would two processes communicate if they need to share data?",
      "What's the overhead difference in practice between spawning a process vs a thread?",
      "How does Chrome's multi-process architecture affect its memory usage?",
    ],
    commonMistakes: [
      "Claiming threads are always strictly better because they're cheaper",
      "Not being able to name a concrete real-world case for process-per-unit isolation",
    ],
    discussionPoints: ["Fault isolation", "Resource limiting via cgroups", "GIL-driven multiprocessing"],
  },
  {
    id: "threads-iv-4",
    question: "You're building a web server that needs to handle 10,000 concurrent connections. Would you use a thread-per-connection model? What are the alternatives?",
    difficulty: "Hard",
    detailedAnswer:
      "A naive thread-per-connection model at 10,000 connections runs into real limits — each thread needs its own stack (often 1-8MB reserved, though usually not all committed), and the OS scheduler starts to spend a meaningful fraction of time just context-switching between thousands of mostly-idle threads (most connections are I/O-bound, waiting on network reads). The more scalable alternative is an event-driven / async I/O model (epoll on Linux, kqueue on BSD, IOCP on Windows) using a small, fixed pool of threads that multiplex many connections via non-blocking I/O and callbacks/coroutines — this is exactly what Nginx, Node.js, and async frameworks like Python's asyncio or Go's goroutines (a hybrid, extremely lightweight green-thread model) are built around. A hybrid worker-pool model — a small number of worker threads/processes each handling many connections via an event loop — is the common production pattern (e.g. Nginx workers, Node.js clusters).",
    idealAnswer:
      "At that scale I'd steer away from raw thread-per-connection because of memory overhead (each thread's stack) and scheduler/context-switch overhead once you have thousands of mostly-idle threads. I'd use an event-driven, non-blocking I/O model — epoll-based on Linux — with a small fixed pool of worker threads or processes, similar to how Nginx or Node.js handle this. If the runtime supports lightweight green threads like Go's goroutines, that's another strong option since they get you thread-like ergonomics without the OS-thread cost per connection.",
    interviewerExpectations: [
      "Identifies thread-per-connection's memory/scheduling cost at scale",
      "Names a concrete alternative (event loop / epoll / async I/O)",
      "Can cite a real system that uses this pattern",
    ],
    followUpQuestions: [
      "What is epoll and how does it differ from select()/poll()?",
      "How do goroutines achieve lightweight concurrency compared to OS threads?",
      "What happens to CPU-bound work in a pure event-loop model?",
    ],
    commonMistakes: [
      "Assuming thread-per-connection scales fine because 'threads are cheap'",
      "Not knowing any concrete async I/O mechanism by name",
    ],
    discussionPoints: ["epoll/kqueue/IOCP", "Event loop architecture", "Green threads/goroutines", "Thread stack memory cost"],
    scenarioBased: true,
  },
];

export default threadsInterviewQuestions;
