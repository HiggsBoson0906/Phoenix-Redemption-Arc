// src/content/cs-fundamentals/os/articles/synchronization.ts

import type { Article } from "@/types";

const synchronizationArticle: Article = {
  slug: "synchronization",
  title: "Synchronization",
  summary:
    "Synchronization primitives (locks, semaphores, monitors) coordinate concurrent access to shared data so threads don't corrupt each other's work.",
  readingTimeMins: 9,
  beginnerExplanation:
    "Imagine two people editing the same shared spreadsheet cell at the exact same instant, each unaware of the other's edit — whoever saves last silently overwrites the other's work. That's a race condition. Synchronization primitives are like a 'one editor at a time' rule enforced by a lock: whoever wants to edit that cell must first grab a token, make their edit, then hand the token back, guaranteeing edits never interleave badly.",
  detailedBreakdown:
    "A race condition occurs when the outcome of concurrent execution depends on the unpredictable timing/interleaving of operations on shared data — the classic example is two threads both executing `counter++`, which is really three machine steps (read, increment, write) that can interleave badly and lose an update. The section of code that accesses shared data and must not be executed by more than one thread at a time is called a critical section.\n\nA mutex (mutual exclusion lock) is the simplest primitive: only one thread can hold it at a time; others block until it's released. A semaphore is a more general integer counter with atomic increment (signal/V) and decrement (wait/P) operations — a binary semaphore (0 or 1) behaves like a mutex, while a counting semaphore (arbitrary non-negative integer) is used to limit concurrent access to a pool of N interchangeable resources (e.g. allowing at most 5 threads into a connection pool at once). A key distinction: a semaphore can be signaled by a different thread than the one that waited on it, while a mutex is conventionally owned and released by the same thread that acquired it — this makes semaphores suitable for signaling between threads, not just mutual exclusion.\n\nA monitor is a higher-level construct that bundles shared data, the procedures that operate on it, and the synchronization logic into one abstraction (implemented via language support, like Java's `synchronized` methods) — a condition variable is typically paired with a monitor's lock to let a thread wait until some condition becomes true (e.g. 'the queue is non-empty') and be woken by another thread via signal/notify once it does, avoiding busy-waiting.\n\nThe classic synchronization problems — Producer-Consumer (a bounded buffer shared between producing and consuming threads), Readers-Writers (many readers can read concurrently, but writers need exclusive access), and Dining Philosophers (illustrating deadlock/circular-wait risk in resource acquisition) — exist specifically to teach the subtle bugs that arise when synchronization is done carelessly.",
  realWorldExamples:
    "Every thread-safe collection in a standard library (Java's `ConcurrentHashMap`, Python's `queue.Queue`) is built on these primitives internally. Database connection pools use counting semaphores to cap how many concurrent connections are checked out. Producer-consumer queues power real message brokers and background job systems — a web server's request queue feeding a fixed pool of worker threads is a textbook bounded-buffer problem.",
  useCases: [
    "Protecting shared data structures from concurrent read/write corruption",
    "Limiting concurrent access to a finite resource pool (connections, threads, licenses)",
    "Coordinating producer/consumer threads through a shared buffer without busy-waiting",
  ],
  advantages: [
    "Prevents race conditions and data corruption in concurrent programs",
    "Semaphores/monitors let threads efficiently wait for conditions instead of busy-polling, saving CPU",
  ],
  disadvantages: [
    "Incorrect use (inconsistent lock ordering, forgetting to release) directly causes deadlocks",
    "Over-synchronization (locking too broadly or too often) kills the very parallelism you introduced threads for",
    "Concurrency bugs from missing/incorrect synchronization are notoriously hard to reproduce and debug",
  ],
  commonMisconceptions: [
    "\"A single atomic increment instruction makes counter++ safe without a lock\" — true only if the underlying hardware/language guarantees atomicity (e.g. `AtomicInteger` in Java, `std::atomic` in C++); a plain `counter++` in most languages is NOT atomic.",
    "\"Mutex and binary semaphore are always interchangeable\" — semantically similar, but mutexes have ownership (only the locking thread should unlock it) while semaphores don't, making semaphores usable for cross-thread signaling in ways a mutex isn't designed for.",
    "\"More locking is always safer\" — excessive or overly coarse locking causes contention and can even reintroduce correctness bugs like deadlock, on top of killing performance.",
  ],
  interviewPerspective:
    "Expect to explain race conditions with a concrete broken-counter example, define critical section/mutex/semaphore precisely, and articulate the mutex-vs-semaphore distinction beyond 'they're similar' — specifically ownership and cross-thread signaling. Producer-Consumer is a very common live-coding or pseudocode question ('implement a thread-safe bounded queue using a mutex and two condition variables').",
  oaPerspective:
    "OA MCQs test definitions (race condition, critical section, deadlock vs starvation recap) and semaphore mechanics (what wait()/signal() do to the counter, when a thread blocks). Some OAs include short code snippets asking you to spot the race condition or missing lock.",
  keyTakeaways: [
    "A race condition happens when concurrent access to shared data isn't properly synchronized — outcome depends on timing.",
    "A critical section is code that must run with mutual exclusion; mutexes/semaphores/monitors enforce that.",
    "Semaphores generalize mutexes (counting resources, cross-thread signaling); monitors bundle data + logic + synchronization at a language level.",
    "Classic problems (Producer-Consumer, Readers-Writers, Dining Philosophers) each teach a specific synchronization pitfall.",
  ],
  summaryClosing:
    "Synchronization is what makes threads' shared-memory model usable rather than a landmine — and getting it wrong (or overusing it) is exactly what leads to the deadlocks covered in the previous article, so the two topics are best understood together.",
  relatedTopics: ["Deadlocks", "Threads", "Processes"],
  furtherReading: [
    { label: "OSTEP: Locks, Condition Variables, Semaphores chapters", note: "Worked implementations of each primitive from first principles." },
    { label: "The Little Book of Semaphores (Downey)", note: "Free book entirely devoted to classic synchronization puzzles." },
  ],
};

export default synchronizationArticle;
