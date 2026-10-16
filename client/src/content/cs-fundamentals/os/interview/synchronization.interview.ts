// src/content/cs-fundamentals/os/interview/synchronization.interview.ts

import type { InterviewQuestion } from "@/types";

const synchronizationInterviewQuestions: InterviewQuestion[] = [
  {
    id: "sync-iv-1",
    question: "What's the difference between a mutex and a semaphore?",
    difficulty: "Medium",
    detailedAnswer:
      "A mutex enforces mutual exclusion for a single resource with ownership semantics — only the thread that locked it is expected to unlock it, making it purely a mutual-exclusion tool. A semaphore is a general integer counter with atomic wait()/signal() operations and no ownership requirement — a binary semaphore behaves like a mutex, but a counting semaphore can allow up to N threads concurrent access to a resource pool, and critically, one thread can signal() a semaphore that a completely different thread is waiting on, which makes semaphores usable for general inter-thread signaling (e.g. 'wake up when data is ready'), not just mutual exclusion.",
    idealAnswer:
      "A mutex is a lock for one resource, with the rule that whoever locks it should be the one to unlock it. A semaphore is a more general counter — a binary semaphore acts like a mutex, but a counting semaphore lets you cap concurrent access at N, like limiting a connection pool to 10 simultaneous connections. The other key difference is ownership: a semaphore can be signaled by a different thread than the one that waited on it, which is exactly what makes it useful for signaling between threads, not just protecting a critical section.",
    interviewerExpectations: [
      "States the ownership distinction, not just 'they're similar'",
      "Explains counting semaphore's resource-pool use case",
      "Mentions cross-thread signaling as a semaphore-specific capability",
    ],
    followUpQuestions: [
      "When would you specifically need a counting semaphore over a mutex?",
      "How would you implement a mutex using a semaphore?",
      "What is a spinlock, and how does it differ from both?",
    ],
    commonMistakes: ["Saying they're 'basically the same thing' without explaining the ownership/signaling distinction"],
    discussionPoints: ["Ownership semantics", "Counting vs binary semaphores", "Cross-thread signaling"],
  },
  {
    id: "sync-iv-2",
    question: "Design a thread-safe bounded buffer (the Producer-Consumer problem) — what synchronization primitives would you use and why?",
    difficulty: "Hard",
    detailedAnswer:
      "I'd use one mutex to protect the buffer's internal state (head/tail indices, count) plus two condition variables: 'notFull' for producers to wait on when the buffer is full, and 'notEmpty' for consumers to wait on when it's empty. A producer acquires the mutex, waits on notFull while the buffer is full (releasing the mutex while waiting, reacquiring on wake), inserts the item, signals notEmpty, then releases the mutex; a consumer does the mirror image. Using condition variables (rather than busy-polling a boolean flag) avoids wasting CPU cycles and avoids the lost-wakeup race that can occur without atomic release-and-wait. An alternative classic solution uses two counting semaphores (empty slots, full slots) plus a mutex, which avoids condition variables altogether — both are valid, textbook-standard solutions.",
    idealAnswer:
      "I'd protect the buffer with a mutex and add two condition variables — one signaling 'not full' for producers and one signaling 'not empty' for consumers. A producer locks the mutex, waits on 'not full' if the buffer's at capacity, inserts, signals 'not empty', unlocks. A consumer mirrors that. The key detail interviewers usually want to hear is that condition_variable.wait() atomically releases the lock while sleeping and reacquires it on wake — that atomicity is what prevents the classic lost-wakeup bug where a signal happens in the tiny window between checking the condition and actually sleeping.",
    interviewerExpectations: [
      "Names concrete primitives (mutex + condition variables, or semaphores)",
      "Explains WHY condition variables over busy-waiting",
      "Understands the atomic release-and-wait property and why it matters",
    ],
    followUpQuestions: [
      "What's a lost wakeup and how do condition variables prevent it?",
      "How would you solve this with semaphores instead of condition variables?",
      "What happens with multiple producers and multiple consumers — does your design still work?",
    ],
    commonMistakes: [
      "Proposing busy-waiting/polling instead of blocking wait",
      "Forgetting the buffer needs protection even when checking full/empty",
    ],
    discussionPoints: ["Condition variables", "Lost wakeup problem", "Semaphore-based alternative solution"],
    scenarioBased: true,
  },
  {
    id: "sync-iv-3",
    question: "What causes a 'lost wakeup' bug, and how do you prevent it?",
    difficulty: "Hard",
    detailedAnswer:
      "A lost wakeup happens when a thread checks a condition (finds it false), but before it actually goes to sleep, another thread changes the condition and signals — since the first thread wasn't asleep yet, it misses the signal and then sleeps forever waiting for a wakeup that already happened. This is why condition variables are designed to atomically release the associated lock and begin waiting as one indivisible operation (rather than 'unlock, then separately call wait()') — this closes the race window entirely, since the signaling thread can't run and change the condition until the waiting thread's lock-release-and-sleep has fully completed.",
    idealAnswer:
      "It's the race where a thread checks a condition, finds it not yet true, but before it can actually start sleeping, another thread flips the condition and signals — that signal has nowhere to land since nobody's asleep yet, so it's lost, and the first thread ends up waiting forever for a wakeup that already happened. The fix built into condition variables is that releasing the lock and beginning to wait is one atomic operation, so there's no gap where a signal can slip through unseen.",
    interviewerExpectations: [
      "Correctly explains the race window that causes it",
      "Knows the fix is baked into condition variable semantics (atomic unlock+wait)",
    ],
    followUpQuestions: [
      "Why must you always re-check the condition in a while loop, not an if, after waking from wait()?",
      "Does this problem apply to semaphores too? Why or why not?",
      "What is a 'spurious wakeup' and how does it relate to this?",
    ],
    commonMistakes: ["Not connecting the fix to the atomicity of condition variable wait()"],
    discussionPoints: ["Race window", "Atomic unlock-and-wait", "Spurious wakeups", "while vs if for condition rechecking"],
  },
  {
    id: "sync-iv-4",
    question: "Your team profiled a multi-threaded service and found it's spending a huge fraction of time contending on a single global lock, even though only a small part of each request actually needs synchronized access. How would you fix it?",
    difficulty: "Hard",
    detailedAnswer:
      "This is classic lock contention from overly coarse-grained locking — the fix is reducing the critical section's scope and/or the lock's granularity. First, I'd shrink the critical section itself to hold the lock only around the truly shared-state mutation, moving any independent computation outside the locked region. Second, I'd consider splitting one global lock into multiple finer-grained locks (e.g. lock striping — partitioning a shared hash map into N buckets each with its own lock) so unrelated operations don't contend at all. Third, for read-heavy workloads I'd consider a reader-writer lock so concurrent reads don't block each other, only writes need exclusivity. Finally, for simple counters/flags, lock-free atomic operations (compare-and-swap based) can eliminate the lock entirely for that specific piece of state. The right fix depends on profiling exactly which shared state is contended and whether it's read-heavy, write-heavy, or genuinely needs full serialization.",
    idealAnswer:
      "That's classic coarse-grained lock contention. I'd first shrink the critical section to the absolute minimum — only the actual shared-state mutation, moving everything else outside the lock. Then I'd look at splitting the single global lock into multiple finer-grained locks, like lock striping a shared map into buckets so unrelated keys don't contend. If the access pattern is read-heavy, a reader-writer lock lets concurrent reads proceed without blocking each other. And for something as simple as a counter, I'd consider replacing the lock entirely with an atomic compare-and-swap operation. I'd validate whichever fix with profiling data, not guesswork, since the right answer depends on the actual read/write ratio and contention pattern.",
    interviewerExpectations: [
      "Identifies the root cause as granularity, not 'need more hardware'",
      "Proposes multiple concrete techniques (shrink critical section, lock striping, RW locks, lock-free atomics)",
      "Emphasizes profiling to pick the right fix rather than guessing",
    ],
    followUpQuestions: [
      "What is lock striping and what's a risk of doing it incorrectly?",
      "When would a reader-writer lock make things worse, not better?",
      "What is compare-and-swap and why does it avoid blocking?",
    ],
    commonMistakes: [
      "Proposing 'just remove the lock' without addressing correctness",
      "Only naming one technique instead of reasoning about which fits the access pattern",
    ],
    discussionPoints: ["Lock granularity", "Lock striping", "Reader-writer locks", "Lock-free/CAS techniques"],
    scenarioBased: true,
  },
];

export default synchronizationInterviewQuestions;
