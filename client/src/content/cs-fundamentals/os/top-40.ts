// src/content/cs-fundamentals/os/top-40.ts
// The 40 highest-frequency Operating Systems interview questions across
// product companies, startups, service companies, and FAANG-style loops.

import type { Top40Question } from "@/types";

const osTop40: Top40Question[] = [
  {
    id: "os-top40-1",
    rank: 1,
    question: "What is an Operating System, and what are its core responsibilities?",
    difficulty: "Easy",
    frequency: "Very High",
    shortAnswer:
      "An OS is the system software that manages hardware resources and provides a stable, convenient interface for applications — handling process management, memory management, file systems, I/O, and security/protection.",
    detailedAnswer:
      "The OS sits between raw hardware and applications, acting as both a resource manager (allocating CPU time, memory, disk, and I/O devices among competing processes fairly and efficiently) and an abstraction layer (giving programs a simple, consistent interface — files, processes, sockets — instead of forcing every application to speak directly to disk controllers or network cards).",
    deepExplanation:
      "Its five core responsibility areas are: process management (creation, scheduling, termination, IPC), memory management (allocation, virtual memory, protection between processes), file system management (organizing persistent storage), I/O management (device drivers, buffering), and security/protection (user permissions, process isolation). Everything else in OS coursework is a deep dive into one of these five areas.",
    realWorldRelevance:
      "Every device you use — phone, laptop, server, car infotainment system — runs an OS doing exactly this job, even though the OS itself (Linux, Windows, iOS, Android, a real-time OS) varies enormously by use case.",
    keywords: ["resource manager", "abstraction", "process management", "memory management"],
    commonMistakes: ["Giving only a one-line dictionary definition without naming concrete responsibilities"],
    relatedTopics: ["Processes", "File Systems", "Virtual Memory"],
    followUpQuestions: ["What's the difference between an OS kernel and the OS as a whole?", "Name a responsibility the OS does NOT handle directly."],
    tags: ["Must Know"],
    companyStyleTags: ["Startup-style", "Amazon-style"],
  },
  {
    id: "os-top40-2",
    rank: 2,
    question: "What is the difference between a process and a thread?",
    difficulty: "Easy",
    frequency: "Very High",
    shortAnswer:
      "A process has its own isolated memory space and is the OS's resource-allocation unit; a thread lives inside a process and shares its memory with sibling threads, keeping only its own registers and stack private.",
    detailedAnswer:
      "Processes are isolated and expensive to create/switch (full address space setup); threads are cheap and share code/data/heap/files, making communication trivial but introducing shared-memory risks like race conditions.",
    deepExplanation:
      "A crash in one thread can corrupt or crash the entire process, since they share memory; a crash in one process doesn't directly affect sibling processes. This isolation-versus-sharing trade-off is the single most important framing for this question.",
    realWorldRelevance:
      "Chrome runs each browser tab as a separate process specifically for crash isolation, while a single tab's rendering, JS execution, and compositing use multiple threads within that process for cheap, fast internal concurrency.",
    keywords: ["shared memory", "isolation", "PCB", "TCB"],
    commonMistakes: ["Saying they're 'basically the same', missing the isolation/crash-blast-radius distinction"],
    relatedTopics: ["Threads", "Processes", "Context Switching"],
    followUpQuestions: ["What does a thread keep private?", "Why is thread creation cheaper than process creation?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Google-style", "Amazon-style", "Startup-style"],
  },
  {
    id: "os-top40-3",
    rank: 3,
    question: "Explain the process state diagram (New, Ready, Running, Waiting, Terminated).",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "A process moves New → Ready → Running → (Waiting ↔ Ready) → Terminated, with the scheduler controlling Ready→Running and preemption/blocking controlling the other transitions.",
    detailedAnswer:
      "Ready→Running happens on scheduler dispatch; Running→Ready happens on preemption; Running→Waiting happens on a blocking call; Waiting→Ready (never directly to Running) happens once the awaited event completes.",
    deepExplanation:
      "The trap most candidates fall into is claiming Waiting connects directly to Running — it doesn't; a woken process must re-enter the Ready queue and be scheduled like any other ready process, which matters when reasoning about fairness and priority.",
    realWorldRelevance:
      "Understanding this diagram is prerequisite to understanding scheduling algorithms, context switching cost, and why blocking I/O calls affect system responsiveness.",
    keywords: ["process states", "PCB", "preemption"],
    commonMistakes: ["Claiming Waiting→Running is a direct transition"],
    relatedTopics: ["Processes", "Scheduling Algorithms", "Context Switching"],
    followUpQuestions: ["What triggers Running→Ready specifically?", "Where does 'Suspended' fit in extended models?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Microsoft-style", "Startup-style"],
  },
  {
    id: "os-top40-4",
    rank: 4,
    question: "What happens under the hood during a context switch?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "The OS saves the current process/thread's registers and program counter to its PCB, invokes the scheduler, then restores the next process's saved state — a process switch additionally swaps page tables, flushing the TLB.",
    detailedAnswer:
      "Thread switches (same process) skip the page-table/TLB step since threads share an address space, making them meaningfully cheaper than full process switches.",
    deepExplanation:
      "Context switching is pure overhead — no application instructions execute during it — which is exactly why scheduling quantum size is a real engineering trade-off between responsiveness and switching cost.",
    realWorldRelevance:
      "Tools like `vmstat`/`pidstat` let engineers diagnose excessive context switching (voluntary vs involuntary) as a real production performance issue on overloaded servers.",
    keywords: ["PCB", "TLB flush", "scheduler"],
    commonMistakes: ["Not distinguishing thread-switch cost from process-switch cost"],
    relatedTopics: ["Context Switching", "Processes", "Paging"],
    followUpQuestions: ["Why is a thread switch cheaper?", "What triggers a context switch?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "os-top40-5",
    rank: 5,
    question: "Explain fork(), exec(), and wait() and how they're commonly used together.",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "fork() duplicates the calling process (via copy-on-write); exec() replaces the calling process's program image with a new one; wait() lets a parent block until a child terminates and reap its exit status.",
    detailedAnswer:
      "The classic 'fork+exec' pattern — fork a child, then have the child immediately exec() a different program — is how shells launch commands: it lets the child inherit and modify its environment (file descriptors, working directory) before becoming an entirely different program.",
    deepExplanation:
      "fork() returns 0 in the child and the child's PID in the parent; forgetting to wait() on children risks leaving zombie processes, since the OS keeps a terminated child's PCB entry until its exit status is reaped.",
    realWorldRelevance:
      "Every time you run a command in a Unix shell, the shell forks itself and the child execs the command you typed — this exact mechanism runs constantly on every Unix-like system.",
    keywords: ["fork", "exec", "wait", "copy-on-write"],
    commonMistakes: ["Confusing fork()'s return value semantics between parent and child"],
    relatedTopics: ["Processes", "Virtual Memory"],
    followUpQuestions: ["What is copy-on-write and how does it make fork() cheap?", "What's a zombie process?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Startup-style"],
  },
  {
    id: "os-top40-6",
    rank: 6,
    question: "What is a zombie process, and how is it different from an orphan process?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A zombie has terminated but its exit status hasn't been reaped by its parent yet, so its PCB entry lingers. An orphan's parent terminated first, so it gets reparented to init/systemd.",
    detailedAnswer:
      "A single zombie is harmless, but a parent that never calls wait() can accumulate zombies indefinitely, eventually exhausting PID/process-table slots — a real, if slow, resource leak.",
    deepExplanation:
      "Orphans are automatically handled by the OS reparenting them to PID 1, which periodically reaps its adopted children, so orphans generally resolve themselves; zombies require the ORIGINAL parent to act, which is why they're the more common production concern.",
    realWorldRelevance:
      "Long-running servers that fork worker processes are a classic real-world source of zombie accumulation if they don't properly wait()/handle SIGCHLD.",
    keywords: ["zombie", "orphan", "wait()", "SIGCHLD"],
    commonMistakes: ["Confusing zombie with a hung/frozen process"],
    relatedTopics: ["Processes"],
    followUpQuestions: ["How would you detect zombies on a live system?", "What's the fix for zombie accumulation?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Startup-style", "Microsoft-style"],
  },
  {
    id: "os-top40-7",
    rank: 7,
    question: "Compare user-level and kernel-level threads.",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "User-level threads are managed by a userspace library, invisible to the kernel — fast but can't achieve true multicore parallelism and can stall on blocking calls. Kernel-level threads are OS-managed, enabling real parallelism at higher per-switch cost.",
    detailedAnswer:
      "Most production systems (pthreads, Java) use a 1:1 model mapping each user thread to a kernel thread, combining reasonable performance with true concurrency.",
    deepExplanation:
      "Many-to-many models multiplex many user threads onto fewer kernel threads for flexibility; green threads/goroutines are a modern evolution optimized for extremely lightweight, massively concurrent workloads.",
    realWorldRelevance:
      "Go's goroutines and Erlang's lightweight processes are modern takes on user-level-style threading, engineered specifically to avoid OS thread overhead at massive concurrency scale.",
    keywords: ["1:1 model", "many-to-many", "green threads"],
    commonMistakes: ["Not knowing which model pthreads/Java actually use in practice"],
    relatedTopics: ["Threads", "Scheduling Algorithms"],
    followUpQuestions: ["What happens if a user-level thread blocks in a many-to-one model?", "How do goroutines differ from OS threads?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Uber-style"],
  },
  {
    id: "os-top40-8",
    rank: 8,
    question: "What are the four necessary conditions for deadlock (Coffman conditions)?",
    difficulty: "Medium",
    frequency: "Very High",
    shortAnswer:
      "Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait — all four must hold simultaneously for deadlock to occur.",
    detailedAnswer:
      "Breaking any single one of the four is sufficient to prevent deadlock entirely; the cheapest common fix is eliminating circular wait via a consistent global lock-acquisition order.",
    deepExplanation:
      "Each condition maps to a concrete prevention technique: eliminate hold-and-wait by requiring all resources be requested upfront; eliminate no-preemption by allowing forced resource reclamation; eliminate circular wait via ordering; mutual exclusion is rarely the one broken since many resources are inherently non-shareable.",
    realWorldRelevance:
      "Inconsistent lock-ordering across code paths is one of the most common real-world production deadlock bugs in multi-threaded services and databases.",
    keywords: ["Coffman conditions", "circular wait", "lock ordering"],
    commonMistakes: ["Missing or misnaming one of the four conditions"],
    relatedTopics: ["Deadlocks", "Synchronization"],
    followUpQuestions: ["Which condition is cheapest to break, and how?", "Give a real code example of circular wait."],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style", "Microsoft-style"],
  },
  {
    id: "os-top40-9",
    rank: 9,
    question: "Explain Banker's Algorithm and what 'safe state' means.",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "Banker's Algorithm is a deadlock-avoidance technique: a resource request is only granted if the resulting state remains 'safe' — meaning some ordering still exists where every process can eventually finish given available resources.",
    detailedAnswer:
      "It requires every process to declare its maximum possible resource need upfront; the algorithm simulates whether granting a request could ever lead to an unsafe (potentially deadlocked) state before actually granting it.",
    deepExplanation:
      "Its major practical limitation is that most real applications can't accurately predict their maximum resource needs in advance, which is why it's mostly a teaching/theoretical tool rather than something used in general-purpose production OSes.",
    realWorldRelevance:
      "The underlying 'simulate before committing' philosophy shows up in other systems too, like database systems doing optimistic concurrency checks before committing a transaction.",
    keywords: ["safe state", "Need = Max - Allocation", "deadlock avoidance"],
    commonMistakes: ["Confusing avoidance (Banker's) with detection — they're distinct strategies"],
    relatedTopics: ["Deadlocks"],
    followUpQuestions: ["Walk through computing Need for a given process table.", "Why isn't this used in general-purpose OSes?"],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "os-top40-10",
    rank: 10,
    question: "What is a race condition, and how do you prevent one?",
    difficulty: "Medium",
    frequency: "Very High",
    shortAnswer:
      "A race condition occurs when the outcome of concurrent operations on shared data depends on unpredictable timing/interleaving. It's prevented by synchronizing access to the shared data via a mutex, semaphore, or atomic operation.",
    detailedAnswer:
      "The classic example is two threads both executing `counter++`, which is really a read-increment-write sequence that can interleave badly and silently lose an update.",
    deepExplanation:
      "The fix is wrapping the critical section (the code touching shared state) in mutual exclusion, or using a hardware-atomic operation (like compare-and-swap) for simple cases like counters, which avoids locking overhead entirely.",
    realWorldRelevance:
      "Race conditions are among the most common and hardest-to-reproduce bugs in real concurrent production systems, since they depend on precise, rare timing.",
    keywords: ["race condition", "critical section", "atomicity"],
    commonMistakes: ["Assuming a single ++ operation is atomic by default"],
    relatedTopics: ["Synchronization", "Threads"],
    followUpQuestions: ["Is counter++ atomic? Why not?", "What's the difference between a mutex and an atomic operation here?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Google-style", "Amazon-style", "Startup-style"],
  },
  {
    id: "os-top40-11",
    rank: 11,
    question: "What's the difference between a mutex and a semaphore?",
    difficulty: "Medium",
    frequency: "Very High",
    shortAnswer:
      "A mutex is a binary lock with ownership (locked/unlocked by the same thread); a semaphore is a general integer counter with wait()/signal() and no ownership, usable to limit access to N resources or signal across threads.",
    detailedAnswer:
      "A binary semaphore behaves like a mutex, but a counting semaphore's real strength is allowing a different thread to signal() than the one that called wait() — enabling general inter-thread coordination, not just mutual exclusion.",
    deepExplanation:
      "This ownership distinction is the detail interviewers actually want to hear, not just 'they're similar' — mutexes are for protecting a resource, semaphores are more general synchronization/signaling primitives.",
    realWorldRelevance:
      "Database connection pools commonly use counting semaphores to cap concurrent connections at N, a use case a plain mutex can't express.",
    keywords: ["ownership", "counting semaphore", "binary semaphore"],
    commonMistakes: ["Saying they're 'basically the same' without the ownership/signaling distinction"],
    relatedTopics: ["Synchronization", "Deadlocks"],
    followUpQuestions: ["When would you need a counting semaphore over a mutex?", "How would you implement a mutex using a semaphore?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "os-top40-12",
    rank: 12,
    question: "Design a thread-safe bounded buffer for the Producer-Consumer problem.",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "Use a mutex to protect the buffer's shared state plus two condition variables ('not full' for producers, 'not empty' for consumers), or equivalently two counting semaphores (empty slots, full slots) plus a mutex.",
    detailedAnswer:
      "A producer locks the mutex, waits on 'not full' while the buffer is at capacity (atomically releasing the lock while waiting), inserts, signals 'not empty', then unlocks; the consumer mirrors this.",
    deepExplanation:
      "The key correctness detail is that condition_variable.wait() atomically releases the lock and begins waiting, closing the race window that would otherwise cause a lost wakeup.",
    realWorldRelevance:
      "This exact pattern underlies real message queues and worker-pool architectures — a web server's request queue feeding a fixed pool of workers is a textbook bounded buffer.",
    keywords: ["condition variables", "bounded buffer", "lost wakeup"],
    commonMistakes: ["Proposing busy-waiting/polling instead of a blocking wait"],
    relatedTopics: ["Synchronization", "Threads"],
    followUpQuestions: ["What's a lost wakeup and how do condition variables prevent it?", "How would multiple producers/consumers change this?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Uber-style"],
  },
  {
    id: "os-top40-13",
    rank: 13,
    question: "Compare FCFS, SJF, Priority, and Round Robin CPU scheduling algorithms.",
    difficulty: "Medium",
    frequency: "Very High",
    shortAnswer:
      "FCFS is simple but suffers the convoy effect; SJF minimizes average waiting time but needs burst-time estimates and can starve long jobs; Priority scheduling needs aging to avoid starvation; Round Robin is fair and preemptive, the standard for interactive systems.",
    detailedAnswer:
      "Each algorithm optimizes a different metric — FCFS optimizes simplicity/order-fairness, SJF optimizes average waiting time, Round Robin optimizes response-time fairness — so the right choice depends on the workload.",
    deepExplanation:
      "SJF is provably optimal for minimizing average waiting time given accurate burst estimates; real systems approximate it via exponential-average burst prediction since true burst times aren't known in advance.",
    realWorldRelevance:
      "Linux's CFS and Windows' priority scheduler are real-world hybrids that borrow ideas from several of these (fairness from RR, priority-awareness from priority scheduling) rather than using any one textbook algorithm in pure form.",
    keywords: ["convoy effect", "starvation", "quantum"],
    commonMistakes: ["Only defining each algorithm without stating a genuine use-case trade-off"],
    relatedTopics: ["Scheduling Algorithms", "Context Switching"],
    followUpQuestions: ["Compute average waiting time for a given process table under FCFS/SJF.", "How do you choose a Round Robin quantum?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style", "Startup-style"],
  },
  {
    id: "os-top40-14",
    rank: 14,
    question: "What is starvation, and how does aging solve it?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Starvation is when a process is repeatedly passed over by the scheduler because something else always looks more urgent. Aging fixes it by gradually raising a waiting process's priority the longer it waits, guaranteeing it eventually runs.",
    detailedAnswer:
      "Starvation is distinct from deadlock: the system as a whole keeps making progress, just not for the starved process specifically.",
    deepExplanation:
      "Aging is a general fairness technique that can be layered onto any priority-based scheduling scheme without abandoning priority-based decision-making altogether.",
    realWorldRelevance:
      "Real-world job schedulers (e.g. in HPC clusters or batch processing systems) implement aging-like fairness mechanisms to prevent low-priority jobs from waiting indefinitely behind a constant stream of higher-priority ones.",
    keywords: ["starvation", "aging", "priority scheduling"],
    commonMistakes: ["Confusing starvation with deadlock"],
    relatedTopics: ["Scheduling Algorithms", "Deadlocks"],
    followUpQuestions: ["Can SJF cause starvation? How?", "Is starvation possible under pure Round Robin?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Microsoft-style", "Startup-style"],
  },
  {
    id: "os-top40-15",
    rank: 15,
    question: "What is a Multilevel Feedback Queue (MLFQ) scheduler?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "MLFQ uses multiple priority queues and lets processes migrate between them based on observed behavior — CPU-hungry processes get demoted to lower-priority, longer-quantum queues, while processes that yield quickly (typical of interactive/I/O-bound work) stay high-priority.",
    detailedAnswer:
      "It approximates 'give the right algorithm to the right kind of process' without needing to know a process's type in advance, purely from observing its behavior over time.",
    deepExplanation:
      "MLFQ needs careful tuning (queue count, quantum per level, promotion/demotion rules, periodic priority boosts to prevent starvation) to work well — it's a design philosophy more than one fixed algorithm.",
    realWorldRelevance:
      "Windows' scheduler and several Unix schedulers historically implement MLFQ-style designs; Linux's modern CFS takes a different, fairness-share-based approach but solves a similar underlying problem.",
    keywords: ["MLFQ", "queue migration", "priority boost"],
    commonMistakes: ["Describing it as identical to a plain multilevel queue, missing the 'feedback'/migration aspect"],
    relatedTopics: ["Scheduling Algorithms"],
    followUpQuestions: ["Why does MLFQ need periodic priority boosts?", "How does Linux's CFS differ from a classic MLFQ?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Microsoft-style"],
  },
  {
    id: "os-top40-16",
    rank: 16,
    question: "How does virtual-to-physical address translation work in a paged system?",
    difficulty: "Medium",
    frequency: "Very High",
    shortAnswer:
      "A virtual address splits into a page number and offset; the page number indexes the page table to get a frame number; the physical address is (frame number × page size) + offset.",
    detailedAnswer:
      "This happens on every memory access, so the Memory Management Unit (MMU) does it in hardware, and a TLB caches recent translations to avoid a slow page table walk each time.",
    deepExplanation:
      "Multi-level page tables split the page number further so large, sparse address spaces don't need one giant flat table — unused regions simply have no allocated entries.",
    realWorldRelevance:
      "x86-64 uses a 4-level page table; understanding this translation chain is foundational to reasoning about TLB misses and huge-page optimizations in performance-sensitive production systems.",
    keywords: ["page table", "MMU", "TLB"],
    commonMistakes: ["Forgetting the offset is unchanged between virtual and physical addresses"],
    relatedTopics: ["Paging", "Virtual Memory"],
    followUpQuestions: ["Compute a physical address given a page size and page table.", "What happens on a TLB miss?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "os-top40-17",
    rank: 17,
    question: "What is a TLB, and why is it necessary?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "A Translation Lookaside Buffer is a small, fast hardware cache of recent virtual-to-physical translations, avoiding a slow in-memory page table walk on every memory access.",
    detailedAnswer:
      "Without it, every memory access — happening constantly — would need a full (possibly multi-level) page table walk, multiplying real memory traffic several times over just for address translation.",
    deepExplanation:
      "TLB effectiveness relies on locality of reference; a context switch typically flushes or partially invalidates the TLB since the new process's translations differ, which is a real, measurable cost of process (not thread) switching.",
    realWorldRelevance:
      "Huge pages are a real production optimization (used by databases, JVMs) specifically to reduce TLB miss rates for large working sets, since one huge-page entry covers far more memory than a standard page entry.",
    keywords: ["TLB", "locality of reference", "huge pages"],
    commonMistakes: ["Not quantifying why an unaided page table walk would be expensive"],
    relatedTopics: ["Paging", "Context Switching"],
    followUpQuestions: ["What happens to the TLB on a context switch?", "How do huge pages help reduce TLB misses?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "os-top40-18",
    rank: 18,
    question: "Compare paging and segmentation. What's the fundamental trade-off?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "Paging uses fixed-size units, eliminating external fragmentation but causing internal fragmentation; segmentation uses variable-sized, logically meaningful units, eliminating internal fragmentation but causing external fragmentation.",
    detailedAnswer:
      "Segmentation naturally maps to a program's logical structure (code, data, stack) enabling per-segment protection, while paging's arbitrary fixed-size chunks are simpler to allocate without fragmentation concerns.",
    deepExplanation:
      "Modern systems mostly combine both ideas (paged segmentation) or use paging alone, since external fragmentation's unpredictable allocation failures are generally considered worse than paging's bounded, predictable internal fragmentation.",
    realWorldRelevance:
      "x86-64 hardware still technically supports segment registers for backward compatibility, though modern OSes configure them as flat/unbounded and rely on paging exclusively for real memory management.",
    keywords: ["internal vs external fragmentation", "base and limit", "paged segmentation"],
    commonMistakes: ["Swapping which scheme causes which fragmentation type"],
    relatedTopics: ["Segmentation", "Paging"],
    followUpQuestions: ["Why is internal fragmentation more acceptable than external?", "What is paged segmentation?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Microsoft-style", "Amazon-style"],
  },
  {
    id: "os-top40-19",
    rank: 19,
    question: "What is demand paging, and what happens on a page fault?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "Demand paging loads a page into physical memory only when it's actually accessed. A page fault is the hardware trap raised when a process accesses a page not currently resident, prompting the OS to load it.",
    detailedAnswer:
      "On a fault, the OS finds (or evicts) a free frame, loads the page from the backing store (disk/swap or the executable file), updates the page table, and resumes the faulting instruction.",
    deepExplanation:
      "A page fault is not inherently an error — it's the normal lazy-loading mechanism; it only becomes a performance problem when it happens excessively (thrashing).",
    realWorldRelevance:
      "Memory-mapped files (`mmap`) rely entirely on demand paging to load file contents lazily as they're actually touched, rather than reading an entire large file upfront.",
    keywords: ["demand paging", "page fault", "backing store"],
    commonMistakes: ["Treating a page fault as always being an error/crash"],
    relatedTopics: ["Virtual Memory", "Paging"],
    followUpQuestions: ["What's the difference between a minor and major page fault?", "Walk through the fault handler's steps."],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "os-top40-20",
    rank: 20,
    question: "Explain FIFO, LRU, and Optimal page replacement algorithms.",
    difficulty: "Hard",
    frequency: "Very High",
    shortAnswer:
      "FIFO evicts the oldest-loaded page; LRU evicts the least-recently-used page (approximating future behavior via past locality); Optimal evicts whichever page won't be needed for the longest time (a theoretical benchmark, since it requires future knowledge).",
    detailedAnswer:
      "LRU is the practical workhorse, implemented approximately (via reference bits / clock algorithm) since perfect LRU tracking is expensive; FIFO is simplest but can suffer Belady's Anomaly.",
    deepExplanation:
      "Given a reference string and frame count, you should be able to simulate all three by hand and count faults — this is one of the most commonly asked OA numerical question types in the entire OS subject.",
    realWorldRelevance:
      "Real OS page replacement (like Linux's) uses a clock/second-chance approximation of LRU, balancing accuracy against the cost of perfectly tracking access recency for every page.",
    keywords: ["FIFO", "LRU", "Optimal", "clock algorithm"],
    commonMistakes: ["Miscounting faults by forgetting a page already in memory doesn't cause a fault (a hit)"],
    relatedTopics: ["Virtual Memory"],
    followUpQuestions: ["Simulate FIFO and LRU faults for a given reference string.", "What is the clock/second-chance algorithm?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "os-top40-21",
    rank: 21,
    question: "What is Belady's Anomaly?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "Under FIFO page replacement, increasing the number of physical frames can, for certain reference strings, counter-intuitively INCREASE the number of page faults.",
    detailedAnswer:
      "This happens because FIFO evicts based purely on load-time order, not actual usage, so it lacks the 'stack property' that guarantees more memory can never hurt.",
    deepExplanation:
      "LRU and Optimal both possess the stack property (pages resident with N frames are always a subset of pages resident with N+1 frames), making them immune to this anomaly — this is a strong signal-quality follow-up point.",
    realWorldRelevance:
      "It's mostly a theoretical curiosity, but it's a favorite conceptual interview and OA question specifically because it's counter-intuitive and tests real understanding rather than memorized definitions.",
    keywords: ["Belady's Anomaly", "stack property", "FIFO"],
    commonMistakes: ["Claiming this happens for all replacement algorithms, not specifically FIFO"],
    relatedTopics: ["Virtual Memory"],
    followUpQuestions: ["Why are LRU/Optimal immune to this?", "Demonstrate it with a small reference string."],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "os-top40-22",
    rank: 22,
    question: "What is thrashing, and how do you fix it?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "Thrashing is when the system spends most of its time servicing page faults instead of doing useful work because combined working sets exceed physical memory. The fix is reducing memory pressure — fewer concurrent processes, more RAM, or right-sizing memory footprints.",
    detailedAnswer:
      "A thrashing system shows HIGH CPU/disk activity but LOW real throughput — busy doesn't mean productive, which is the key diagnostic insight.",
    deepExplanation:
      "In production, this is diagnosed via swap-in/swap-out activity (`vmstat`'s si/so columns) or major page fault counts, and fixed by reducing the degree of multiprogramming or, in containerized environments, setting tighter memory limits so one runaway process gets isolated (OOM-killed) instead of thrashing the whole host.",
    realWorldRelevance:
      "A server showing high latency with high CPU+disk but low throughput is a classic real-world thrashing symptom that ops teams diagnose with exactly these tools.",
    keywords: ["thrashing", "working set", "vmstat"],
    commonMistakes: ["Confusing thrashing's high-activity symptom with the system being 'productively busy'"],
    relatedTopics: ["Virtual Memory"],
    followUpQuestions: ["How would you diagnose thrashing on a live server?", "What's a container's OOM killer's role here?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Uber-style"],
  },
  {
    id: "os-top40-23",
    rank: 23,
    question: "How does copy-on-write make fork() efficient?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Instead of eagerly copying the parent's memory, fork() shares the same physical pages between parent and child, marked read-only; a real copy of just one page happens lazily, only when either process writes to it.",
    detailedAnswer:
      "The write triggers a protection-fault, distinct from a not-present fault, and the OS's handler copies only that single page and remaps it writable for the faulting process.",
    deepExplanation:
      "This is especially valuable for the extremely common fork()+exec() pattern, where the child immediately replaces its memory image anyway — COW means almost nothing was ever actually copied.",
    realWorldRelevance:
      "Shell command execution (fork the shell, exec the command) relies on COW being cheap; without it, every command launch would be dramatically slower.",
    keywords: ["copy-on-write", "protection fault", "fork+exec"],
    commonMistakes: ["Saying fork() never copies anything — it does, just lazily and only on write"],
    relatedTopics: ["Virtual Memory", "Processes"],
    followUpQuestions: ["Why is COW especially valuable for fork+exec?", "What kind of fault does a COW write trigger?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "os-top40-24",
    rank: 24,
    question: "What is an inode, and why doesn't it store the filename?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "An inode stores a file's metadata (size, permissions, timestamps, block pointers) but not its name — names live in directory entries, which map names to inode numbers.",
    detailedAnswer:
      "This separation is exactly what makes hard links possible: multiple directory entries can point to the same inode, meaning they're genuinely the same file under different names, not copies.",
    deepExplanation:
      "A file's data is only actually freed once its link count drops to zero, which is why deleting one hard-linked name doesn't remove the underlying data if other links still exist.",
    realWorldRelevance:
      "Understanding inodes explains real Unix behavior like why `mv` within the same filesystem is instant (just a directory-entry rename, no data copy) but `mv` across filesystems requires a real copy.",
    keywords: ["inode", "directory entry", "hard link"],
    commonMistakes: ["Assuming the inode stores the filename directly"],
    relatedTopics: ["File Systems"],
    followUpQuestions: ["What happens to data when the last hard link is removed?", "How is a symlink fundamentally different?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "os-top40-25",
    rank: 25,
    question: "Compare contiguous, linked, and indexed file allocation. Which do modern file systems use?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Contiguous is fastest but fragments externally; linked avoids fragmentation but has slow random access; indexed (used by ext4 and most real systems, via the inode's block pointers) balances both.",
    detailedAnswer:
      "Indexed allocation's index structure (direct/indirect/doubly-indirect blocks) lets small files stay compact in metadata while still supporting arbitrarily large files.",
    deepExplanation:
      "This mirrors the paging-vs-segmentation trade-off discussion structurally — fixed simplicity vs. flexible-but-fragmenting — which is a good pattern to notice and mention if asked to compare the two topics.",
    realWorldRelevance:
      "ext4's inode structure and NTFS's Master File Table both implement indexed-allocation-style designs in real, widely deployed production file systems.",
    keywords: ["contiguous", "linked", "indexed allocation"],
    commonMistakes: ["Not knowing which allocation method real file systems actually use"],
    relatedTopics: ["File Systems"],
    followUpQuestions: ["How do direct/indirect/doubly-indirect blocks work together?", "Why does indexed allocation still cost some space?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Microsoft-style", "Startup-style"],
  },
  {
    id: "os-top40-26",
    rank: 26,
    question: "How does journaling protect a file system from crash-induced corruption?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "A journaling file system logs the intended change to an append-only journal before applying it to the real metadata structures; on crash recovery, it replays fully-logged operations and discards partial ones, avoiding structural corruption.",
    detailedAnswer:
      "This is conceptually the same idea as database write-ahead logging, applied to file system metadata instead of table rows.",
    deepExplanation:
      "It avoids the old-style full-disk fsck consistency scan after every unclean shutdown, since the journal already precisely identifies what needs fixing.",
    realWorldRelevance:
      "ext4 and NTFS are both journaling file systems used in production at massive scale specifically for this crash-safety guarantee.",
    keywords: ["journaling", "write-ahead log", "fsck"],
    commonMistakes: ["Not explaining the log-before-apply ordering specifically"],
    relatedTopics: ["File Systems"],
    followUpQuestions: ["What's the performance cost of journaling?", "How does this relate to database WAL?"],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "os-top40-27",
    rank: 27,
    question: "What is the difference between user mode and kernel mode?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "User mode is a restricted CPU execution mode where applications run, unable to directly access hardware or privileged instructions; kernel mode is the privileged mode the OS runs in, with full hardware access.",
    detailedAnswer:
      "A system call is the controlled mechanism for a user-mode process to request a kernel-mode operation (like reading a file) — the CPU traps into kernel mode, executes the privileged operation, then returns to user mode.",
    deepExplanation:
      "This hardware-enforced separation is fundamental to OS security and stability — without it, any application bug or malicious code could directly corrupt hardware state or other processes' memory.",
    realWorldRelevance:
      "Every file read, network call, or memory allocation in your application code ultimately triggers a user-to-kernel mode transition via a system call, even though it's invisible at the application level.",
    keywords: ["user mode", "kernel mode", "system call", "privilege levels"],
    commonMistakes: ["Not explaining why the separation exists (protection/security), just that it exists"],
    relatedTopics: ["Processes"],
    followUpQuestions: ["What is a system call and how does the mode transition happen?", "What's the performance cost of a mode switch?"],
    tags: ["Must Know"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "os-top40-28",
    rank: 28,
    question: "What's the difference between multiprogramming, multitasking, and multithreading?",
    difficulty: "Easy",
    frequency: "Medium",
    shortAnswer:
      "Multiprogramming keeps multiple processes in memory so the CPU always has work when one blocks on I/O; multitasking rapidly switches between multiple processes to give the illusion of simultaneous execution; multithreading runs multiple threads within a single process.",
    detailedAnswer:
      "Multiprogramming is about maximizing CPU utilization by overlapping I/O wait with useful computation from another process; multitasking is specifically about time-sharing for responsiveness/interactivity.",
    deepExplanation:
      "These terms are historically layered — multiprogramming (batch-era focus on utilization) predates multitasking (time-sharing era focus on interactivity), which predates widespread multithreading (shared-memory concurrency within one process).",
    realWorldRelevance:
      "Modern desktop OSes do all three simultaneously: multiprogramming/multitasking across many applications, and multithreading within each application for internal concurrency.",
    keywords: ["multiprogramming", "multitasking", "multithreading"],
    commonMistakes: ["Treating all three terms as synonyms"],
    relatedTopics: ["Processes", "Threads", "Scheduling Algorithms"],
    followUpQuestions: ["Which of these three specifically requires shared memory?", "How does multiprogramming improve CPU utilization?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Startup-style", "Microsoft-style"],
  },
  {
    id: "os-top40-29",
    rank: 29,
    question: "What's the difference between interrupts and polling for I/O?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Polling repeatedly checks a device's status in a loop, wasting CPU cycles while waiting; interrupts let a device signal the CPU asynchronously when it's ready, so the CPU can do other work in the meantime.",
    detailedAnswer:
      "Interrupts are more efficient for infrequent or unpredictable events, while polling can actually be more efficient for extremely high-frequency, predictable I/O where interrupt handling overhead itself becomes the bottleneck.",
    deepExplanation:
      "Real high-performance I/O systems (like modern NVMe drivers or high-throughput networking) sometimes deliberately use polling under heavy, sustained load specifically because interrupt overhead per-event becomes worse than a tight polling loop at very high event rates — a nuanced, senior-level point.",
    realWorldRelevance:
      "Linux's NAPI networking driver framework dynamically switches between interrupt-driven and polling modes depending on traffic load, getting the best of both approaches.",
    keywords: ["interrupts", "polling", "I/O efficiency"],
    commonMistakes: ["Claiming interrupts are unconditionally better than polling in every scenario"],
    relatedTopics: ["Processes"],
    followUpQuestions: ["When might polling actually outperform interrupts?", "What is an interrupt handler / ISR?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Uber-style"],
  },
  {
    id: "os-top40-30",
    rank: 30,
    question: "What is the Readers-Writers problem and how is it typically solved?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Multiple readers can safely access shared data concurrently, but a writer needs exclusive access — the challenge is coordinating this without starving either readers or writers.",
    detailedAnswer:
      "A common solution uses a mutex protecting a reader count plus a second lock for write access — the first reader locks out writers, the last reader unlocks for writers, and readers in between just increment/decrement the count.",
    deepExplanation:
      "A naive reader-preferring solution can starve writers indefinitely under constant read load, so production-grade solutions often add fairness (e.g. a writer that's waiting blocks new readers from jumping the queue).",
    realWorldRelevance:
      "Reader-writer locks are a standard concurrency primitive (e.g. Java's ReentrantReadWriteLock, Rust's RwLock) used constantly in read-heavy production systems like caches and configuration stores.",
    keywords: ["readers-writers", "reader-writer lock", "starvation"],
    commonMistakes: ["Not addressing the writer-starvation risk of a naive solution"],
    relatedTopics: ["Synchronization"],
    followUpQuestions: ["How would you prevent writer starvation?", "When would a reader-writer lock actually hurt performance?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "os-top40-31",
    rank: 31,
    question: "What is the Dining Philosophers problem, and what does it illustrate?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Five philosophers alternate thinking and eating, each needing both forks shared with their neighbors — if all pick up their left fork simultaneously, none can get a right fork, and all wait forever. It illustrates deadlock from circular resource acquisition.",
    detailedAnswer:
      "Standard fixes include breaking symmetry (one philosopher picks up forks in the opposite order), introducing a resource hierarchy/ordering, or using a waiter/arbitrator that limits how many philosophers can attempt to eat simultaneously.",
    deepExplanation:
      "This maps directly onto the Coffman conditions: each fork is a non-shareable resource (mutual exclusion), a philosopher holds one fork while waiting for the other (hold-and-wait), forks can't be taken by force (no preemption), and the circular neighbor structure creates circular wait.",
    realWorldRelevance:
      "It's a teaching abstraction, but the underlying pattern — multiple threads needing multiple shared locks — is exactly what causes real production deadlocks in multi-lock code.",
    keywords: ["dining philosophers", "circular wait", "resource ordering"],
    commonMistakes: ["Not connecting the puzzle back to the Coffman conditions explicitly"],
    relatedTopics: ["Deadlocks", "Synchronization"],
    followUpQuestions: ["How would breaking symmetry prevent deadlock here?", "Map this problem onto the four Coffman conditions."],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Microsoft-style"],
  },
  {
    id: "os-top40-32",
    rank: 32,
    question: "What's the difference between internal and external fragmentation?",
    difficulty: "Easy",
    frequency: "High",
    shortAnswer:
      "Internal fragmentation is wasted space WITHIN an allocated fixed-size unit (e.g. the unused remainder of a page); external fragmentation is wasted space BETWEEN allocated variable-sized units, scattered as unusable free chunks.",
    detailedAnswer:
      "Paging causes internal fragmentation (fixed-size pages); segmentation causes external fragmentation (variable-sized segments) — this mapping is one of the most tested facts in this whole subject.",
    deepExplanation:
      "Internal fragmentation is bounded and predictable (at most one page's worth of waste per allocation); external fragmentation is unbounded and can cause allocation failures even when total free memory is technically sufficient.",
    realWorldRelevance:
      "This exact trade-off reasoning explains why virtually every modern general-purpose OS chose paging (bounded internal fragmentation) over pure segmentation (unbounded external fragmentation) as its primary memory management mechanism.",
    keywords: ["internal fragmentation", "external fragmentation", "compaction"],
    commonMistakes: ["Swapping which type applies to paging vs segmentation"],
    relatedTopics: ["Paging", "Segmentation"],
    followUpQuestions: ["Which type is generally considered 'cheaper' to accept, and why?", "What is compaction and when is it needed?"],
    tags: ["Must Know"],
    companyStyleTags: ["Amazon-style", "Startup-style"],
  },
  {
    id: "os-top40-33",
    rank: 33,
    question: "What is priority inversion, and how is it fixed?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "Priority inversion occurs when a high-priority task is blocked waiting on a lock held by a low-priority task, while a medium-priority task preempts the low-priority one, indirectly delaying the high-priority task. Priority inheritance fixes it by temporarily boosting the lock-holder's priority to match the highest-priority waiter.",
    detailedAnswer:
      "This is distinct from starvation and from deadlock — it's specifically about priority ordering being effectively violated due to a lock dependency chain interacting with a scheduler.",
    deepExplanation:
      "The famous real-world instance was NASA's Mars Pathfinder mission, which experienced system resets in 1997 due to unbounded priority inversion, later fixed by enabling priority inheritance on the affected mutex.",
    realWorldRelevance:
      "Real-time operating systems (used in aerospace, automotive, medical devices) implement priority inheritance protocols specifically to bound and prevent this exact failure mode.",
    keywords: ["priority inversion", "priority inheritance", "Mars Pathfinder"],
    commonMistakes: ["Confusing priority inversion with plain starvation"],
    relatedTopics: ["Scheduling Algorithms", "Synchronization"],
    followUpQuestions: ["Explain the Mars Pathfinder priority inversion incident.", "How does priority inheritance work mechanically?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Uber-style"],
  },
  {
    id: "os-top40-34",
    rank: 34,
    question: "What is spooling, and how does it differ from buffering?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Buffering temporarily holds data to smooth out speed mismatches between a producer and consumer (e.g. between disk and application); spooling uses disk storage to queue up entire jobs for a device that can only serve one job at a time (e.g. a printer), letting producers proceed without waiting for the device.",
    detailedAnswer:
      "Spooling is essentially 'buffering at the job level' for exclusive-access devices, allowing multiple processes to submit print jobs without blocking on the printer being busy.",
    deepExplanation:
      "The print spooler queue you see in every OS's print management UI is a direct, visible example of spooling — jobs queue up and are dispatched to the physical printer one at a time.",
    realWorldRelevance:
      "Batch job scheduling systems on shared computing clusters use spooling-like queuing to manage access to a limited number of expensive shared devices/resources.",
    keywords: ["spooling", "buffering", "print queue"],
    commonMistakes: ["Treating spooling and buffering as identical concepts"],
    relatedTopics: ["File Systems"],
    followUpQuestions: ["Give another real-world example of spooling.", "Why can't you just use a simple buffer for a printer instead?"],
    tags: ["Advanced"],
    companyStyleTags: ["Startup-style"],
  },
  {
    id: "os-top40-35",
    rank: 35,
    question: "What is the boot process of an operating system, at a high level?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Power-on triggers firmware (BIOS/UEFI) to run hardware self-checks, then load a small bootloader from disk, which loads the OS kernel into memory and transfers control to it; the kernel then initializes drivers, mounts the root file system, and starts the init/systemd process.",
    detailedAnswer:
      "The bootloader (like GRUB on Linux) exists as a small intermediate step because the firmware itself is too limited to understand full file systems or load a large, complex kernel directly.",
    deepExplanation:
      "This process explains why boot failures fall into distinct categories (firmware/hardware issue, bootloader misconfiguration, kernel panic, or init/service failure) each requiring a different diagnostic approach.",
    realWorldRelevance:
      "Understanding this sequence is directly useful for diagnosing real 'my server won't boot' incidents by figuring out which stage is actually failing.",
    keywords: ["BIOS/UEFI", "bootloader", "kernel initialization", "init/systemd"],
    commonMistakes: ["Skipping the bootloader stage and assuming firmware loads the kernel directly"],
    relatedTopics: ["Processes", "File Systems"],
    followUpQuestions: ["What's the difference between BIOS and UEFI?", "What does init/systemd do once the kernel hands off control?"],
    tags: ["Advanced"],
    companyStyleTags: ["Startup-style"],
  },
  {
    id: "os-top40-36",
    rank: 36,
    question: "What's the difference between a monolithic kernel and a microkernel?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "A monolithic kernel runs almost all OS services (drivers, file systems, networking) in kernel space as one large program — fast (no mode-switch overhead between services) but a bug in any component can crash the whole system. A microkernel keeps only the bare minimum (IPC, basic scheduling, memory management) in kernel space, running most services as separate user-space processes — more robust/modular but with added IPC overhead between services.",
    detailedAnswer:
      "Linux is a (largely) monolithic kernel (with loadable modules for flexibility); QNX and seL4 are examples of microkernels prioritizing fault isolation and formal verifiability.",
    deepExplanation:
      "This is a genuine, long-running systems design debate (Tanenbaum-Torvalds debate) with real performance-vs-robustness trade-offs, not a settled 'one is objectively better' answer — the right choice depends on whether raw performance or fault isolation matters more for the target use case.",
    realWorldRelevance:
      "seL4's microkernel design, with formally verified isolation guarantees, is used in real safety/security-critical systems (aerospace, defense) precisely because a driver bug provably cannot crash the whole system.",
    keywords: ["monolithic kernel", "microkernel", "IPC overhead"],
    commonMistakes: ["Claiming one design is unconditionally better without discussing the actual trade-off"],
    relatedTopics: ["Processes"],
    followUpQuestions: ["Why might a microkernel be preferred for safety-critical systems?", "What is a hybrid kernel, and where does Windows NT fit?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Microsoft-style"],
  },
  {
    id: "os-top40-37",
    rank: 37,
    question: "What's the difference between a hard link and a symbolic (soft) link?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A hard link is another directory entry pointing directly to the same inode as the original file — they're indistinguishable, genuinely the same file. A symbolic link is a separate small file containing a path string, resolved at access time.",
    detailedAnswer:
      "Deleting the original file behind a hard link does nothing to the data (the inode persists until link count reaches zero); deleting the original behind a symlink leaves the symlink 'dangling', pointing at nothing.",
    deepExplanation:
      "Hard links generally can't cross file system boundaries (since inode numbers are only unique within one file system) and typically can't point to directories (to avoid tree cycles); symlinks have neither restriction since they're just stored paths.",
    realWorldRelevance:
      "Version managers and deployment tools often use symlinks (e.g. a 'current' symlink pointing at the latest deployed release directory) specifically because they're cheap to atomically repoint.",
    keywords: ["hard link", "symbolic link", "inode", "dangling link"],
    commonMistakes: ["Treating hard and soft links as interchangeable"],
    relatedTopics: ["File Systems"],
    followUpQuestions: ["Why can't hard links cross file systems?", "Why are hard links to directories generally disallowed?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Startup-style"],
  },
  {
    id: "os-top40-38",
    rank: 38,
    question: "How would you diagnose a production deadlock from a thread dump?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "Look for a cycle in the thread dump: each thread's held lock and waited-on lock should form a loop back to the first thread; once confirmed, trace every code path acquiring both locks to find the inconsistent ordering causing it.",
    detailedAnswer:
      "The fix is enforcing one consistent global lock-acquisition order; a stopgap for production is try-lock with timeout and retry, converting a permanent hang into a recoverable (if degraded) retry loop.",
    deepExplanation:
      "Intermittent deadlocks (rather than constant ones) usually indicate a rare interleaving triggered by an uncommon code path, like an error-handling branch that acquires locks in a different order than the main path.",
    realWorldRelevance:
      "Java's `jstack` and similar thread-dump tools in other languages directly show BLOCKED threads and what they're waiting on, making this diagnostic workflow a real, practiced production debugging skill.",
    keywords: ["thread dump", "wait-for graph", "lock ordering"],
    commonMistakes: ["Jumping to 'just restart the service' without root-causing the lock-ordering bug"],
    relatedTopics: ["Deadlocks", "Synchronization"],
    followUpQuestions: ["What's a stopgap production mitigation while the real fix is being deployed?", "How would you catch this class of bug before it ships?"],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Uber-style", "Google-style"],
  },
  {
    id: "os-top40-39",
    rank: 39,
    question: "Why might increasing the number of threads NOT improve your application's throughput?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "For CPU-bound work, once you have as many active threads as available cores, more threads just add context-switching/scheduling overhead without more real parallel capacity — and can even reduce throughput past a point.",
    detailedAnswer:
      "For I/O-bound work, more threads than cores can genuinely help since most sit blocked on I/O rather than competing for CPU, but even there, excessive threads eventually hurt from per-thread memory (stack) and scheduling overhead.",
    deepExplanation:
      "This connects to Amdahl's Law more broadly — the maximum speedup from parallelism is fundamentally bounded by a workload's inherently sequential portion, regardless of how many threads/cores you throw at the parallelizable part.",
    realWorldRelevance:
      "Thread pool sizing is a real, common production tuning exercise — oversized pools waste memory and add context-switch overhead, undersized pools underutilize available cores; the right size depends on the actual CPU-bound vs I/O-bound ratio of the workload.",
    keywords: ["thread pool sizing", "CPU-bound vs I/O-bound", "Amdahl's Law"],
    commonMistakes: ["Giving a flat 'more threads = more throughput, always' answer"],
    relatedTopics: ["Threads", "Context Switching", "Scheduling Algorithms"],
    followUpQuestions: ["How would you size a thread pool for a CPU-bound service?", "How does this relate to Amdahl's Law?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Google-style", "Amazon-style", "Uber-style"],
  },
  {
    id: "os-top40-40",
    rank: 40,
    question: "Design considerations: how would a scheduler handle a mix of real-time, interactive, and batch workloads on the same machine?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "Use separate scheduling classes: a strict, preemptive real-time class (like Linux's SCHED_FIFO) for deadline-sensitive work, a high-priority short-quantum queue for interactive tasks, and a low-priority larger-quantum queue (with aging) for batch work.",
    detailedAnswer:
      "This is effectively a multilevel feedback queue design with a hard real-time tier layered on top — exactly what production general-purpose OSes actually implement.",
    deepExplanation:
      "Priority inversion becomes a real risk in such a mixed system (a low-priority batch task holding a lock needed by a real-time task), which is why priority inheritance protocols matter alongside the scheduling class design itself.",
    realWorldRelevance:
      "Linux explicitly exposes SCHED_FIFO/SCHED_RR (real-time), SCHED_OTHER/CFS (normal/interactive), and SCHED_IDLE (lowest priority, batch-like) scheduling classes precisely to support this kind of mixed-workload machine in production.",
    keywords: ["scheduling classes", "SCHED_FIFO", "priority inheritance"],
    commonMistakes: ["Proposing a single flat algorithm for all three workload types instead of separate classes"],
    relatedTopics: ["Scheduling Algorithms", "Deadlocks"],
    followUpQuestions: ["What's the difference between SCHED_FIFO and SCHED_RR?", "How does priority inheritance mitigate risk here?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Uber-style"],
  },
];

export default osTop40;
