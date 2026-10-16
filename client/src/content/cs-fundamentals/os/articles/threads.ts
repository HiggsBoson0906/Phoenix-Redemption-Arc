// src/content/cs-fundamentals/os/articles/threads.ts

import type { Article } from "@/types";

const threadsArticle: Article = {
  slug: "threads",
  title: "Threads",
  summary:
    "A thread is the smallest unit of CPU scheduling within a process — multiple threads in one process share memory but each gets its own execution path.",
  readingTimeMins: 8,
  beginnerExplanation:
    "If a process is a kitchen, threads are multiple chefs working in that same kitchen simultaneously, sharing the same ingredients, counters, and fridge (the process's memory), but each chopping their own vegetables independently (their own instruction stream). Because they share memory, one chef can see and modify what another just changed — powerful, but also the source of most concurrency bugs.\n\nEvery process has at least one thread (the main thread). A multi-threaded process just means the OS is running several independent instruction streams inside the same address space.",
  detailedBreakdown:
    "Each thread has its own program counter, its own register set, and its own stack — this is what lets it execute independently. But it shares the process's code (text segment), global/static data, heap, and open file descriptors with every other thread in the process. This shared-memory model is exactly why threads are cheaper than processes (no separate address space to set up) and exactly why they're dangerous (a bug in one thread can corrupt data another thread depends on).\n\nThreads come in two flavors depending on who manages them: user-level threads are scheduled entirely in userspace by a threading library, invisible to the kernel — fast to create/switch but if one blocks on I/O, the whole process can block (in a naive 1:N model). Kernel-level threads are scheduled by the OS itself, visible in the process table, and can truly run in parallel on separate cores — more overhead per switch but proper preemption and true multicore parallelism. Most modern systems use a 1:1 model (each user thread maps to one kernel thread), which is what pthreads and Java threads use today.\n\nA critical Python-specific wrinkle worth knowing: CPython has a Global Interpreter Lock (GIL) that allows only one thread to execute Python bytecode at a time, even on a multicore machine — so Python threads give you concurrency for I/O-bound work but not true parallelism for CPU-bound work (multiprocessing is used instead for that).",
  realWorldExamples:
    "A word processor uses separate threads for the UI (staying responsive), spell-checking in the background, and auto-saving — all sharing the same open document in memory. Web servers like Apache (in threaded MPM mode) spawn a thread per connection to handle many clients concurrently without the overhead of a full process per connection. Game engines commonly run rendering, physics, and audio on separate threads that all read/write shared game-world state.",
  useCases: [
    "Keeping a UI responsive while heavy work happens in the background",
    "Handling many concurrent I/O-bound connections cheaply (one thread per connection)",
    "Parallelizing CPU-bound work across cores (outside of GIL-limited runtimes)",
  ],
  advantages: [
    "Much cheaper to create and context-switch than a full process",
    "Shared memory makes data sharing between threads trivial (no IPC needed)",
    "Enables true parallel speedup on multicore hardware for CPU-bound work",
  ],
  disadvantages: [
    "Shared memory means race conditions, deadlocks, and other concurrency bugs are easy to introduce",
    "A crash or memory corruption in one thread can take down the entire process (unlike isolated processes)",
    "Debugging concurrency issues (race conditions, especially) is notoriously harder than debugging sequential code",
  ],
  commonMisconceptions: [
    "\"Threads always run in true parallel\" — on a single core, threads are time-sliced just like processes; parallelism requires multiple cores.",
    "\"More threads always means better performance\" — beyond the number of available cores, extra threads add scheduling and context-switch overhead without added throughput, and can even slow things down (thrashing).",
    "\"Threads are always safer/simpler than processes\" — the opposite is usually true for correctness; processes trade performance for safety via isolation.",
  ],
  interviewPerspective:
    "Process vs thread is one of the single most-asked OS questions in any SDE interview — always be ready with a crisp table: memory sharing, creation cost, isolation/crash-blast-radius, and communication mechanism. Interviewers also love asking you to name real concurrency bugs (race condition, deadlock) that only threads are susceptible to, and asking what a GIL is if you mention Python.",
  oaPerspective:
    "OA MCQs test the shared-vs-private resource table (code/data/heap shared; registers/stack/PC private) and definitions like 'what makes a thread lightweight.' Expect direct comparison questions ('which of the following is true about threads vs processes') and questions about user-level vs kernel-level threading models.",
  keyTakeaways: [
    "Threads share code, data, heap, and files; each has its own stack, registers, and program counter.",
    "Threads are cheaper to create/switch than processes because there's no new address space.",
    "User-level threads are fast but invisible to the kernel; kernel-level threads enable true multicore parallelism.",
    "Shared memory is threads' biggest strength and biggest risk — it enables race conditions and deadlocks.",
  ],
  summaryClosing:
    "Threads let a single process do multiple things concurrently (or in true parallel on multicore hardware) far more cheaply than spinning up separate processes, at the cost of needing explicit synchronization to keep shared memory consistent — which is exactly the subject of the next two articles.",
  relatedTopics: ["Processes", "Context Switching", "Synchronization"],
  furtherReading: [
    { label: "POSIX Threads (pthreads) documentation", note: "The de facto standard threading API on Unix systems." },
    { label: "OSTEP: Concurrency chapters", note: "Deep dive into thread APIs and the bugs they introduce." },
  ],
};

export default threadsArticle;
