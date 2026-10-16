// src/content/cs-fundamentals/dbms/interview/concurrencyControl.interview.ts

import type { InterviewQuestion } from "@/types";

const concurrencyControlInterviewQuestions: InterviewQuestion[] = [
  {
    id: "concurrency-control-iv-1",
    question: "What is the difference between a shared lock and an exclusive lock?",
    difficulty: "Easy",
    detailedAnswer:
      "A shared (S) lock is acquired to read a data item and is compatible with other shared locks — many transactions can hold an S-lock on the same row simultaneously since concurrent reads don't corrupt anything. An exclusive (X) lock is acquired to write a data item and is incompatible with every other lock (S or X) on that item — while one transaction holds an X-lock, no other transaction can read or write that item until the lock is released.",
    idealAnswer:
      "Shared locks are for reading and let multiple transactions read the same row at once — readers don't block readers. Exclusive locks are for writing and are fully exclusive — no other transaction can read or write that row while the X-lock is held. The compatibility rule is simple: S is compatible with S, but X is compatible with nothing.",
    interviewerExpectations: [
      "States the compatibility rule correctly (S-S compatible, X incompatible with all)",
      "Connects lock type to read vs write operations",
    ],
    followUpQuestions: [
      "Can a transaction upgrade a shared lock to an exclusive lock? What's the risk?",
      "What happens if two transactions both try to upgrade S to X on the same row at the same time?",
    ],
    commonMistakes: [
      "Saying exclusive locks block only writers, not readers",
      "Not knowing that S-locks can be held concurrently by multiple transactions",
    ],
    discussionPoints: ["Lock compatibility matrix", "Read vs write locking"],
  },
  {
    id: "concurrency-control-iv-2",
    question: "Explain Two-Phase Locking and why the growing/shrinking phase distinction matters.",
    difficulty: "Medium",
    detailedAnswer:
      "2PL requires every transaction to acquire all the locks it will ever need before releasing any lock. Formally, a transaction has a growing phase (only lock acquisitions allowed) followed by a shrinking phase (only lock releases allowed) — once it releases a single lock, it can never acquire another. This ordering matters because it prevents a transaction from releasing a lock, letting another transaction modify that data, and then acquiring a new lock based on stale assumptions about what else has changed — which is exactly the pattern that breaks serializability. It can be formally shown that any schedule where every transaction obeys 2PL is conflict-serializable.",
    idealAnswer:
      "2PL splits each transaction into two phases: grow (acquire locks, never release) and shrink (release locks, never acquire). The moment you release your first lock you're locked into shrinking mode. This matters because if you were allowed to interleave acquiring and releasing freely, you could release a lock on row A, another transaction could sneak in and change row A, and then you could go acquire a lock on row B whose value now depends on an outdated view of A — breaking the illusion that transactions ran one-at-a-time. 2PL closes that hole and guarantees conflict-serializability, though plain 2PL can still suffer cascading aborts, which is why strict/rigorous 2PL are used in practice.",
    interviewerExpectations: [
      "Correctly defines growing and shrinking phases",
      "Explains WHY this ordering guarantees serializability, not just states the rule",
      "Mentions that plain 2PL doesn't solve cascading aborts (bonus: knows strict/rigorous 2PL)",
    ],
    followUpQuestions: [
      "What's the difference between Strict 2PL and Rigorous 2PL?",
      "Does 2PL prevent deadlocks? Why or why not?",
      "What is a cascading abort and how does Strict 2PL avoid it?",
    ],
    commonMistakes: [
      "Thinking '2-phase' means exactly 2 locks are taken",
      "Claiming 2PL prevents deadlocks (it doesn't — it guarantees serializability, which is a separate property)",
    ],
    discussionPoints: ["Growing vs shrinking phase", "Conflict-serializability", "Strict vs Rigorous 2PL"],
  },
  {
    id: "concurrency-control-iv-3",
    question: "How does a database detect and resolve a deadlock between two transactions?",
    difficulty: "Medium",
    detailedAnswer:
      "The database periodically (or on each lock wait) builds a wait-for graph, with a directed edge from Ti to Tj whenever Ti is blocked waiting for a lock held by Tj. If this graph contains a cycle, a deadlock exists. The database then picks a 'victim' transaction from the cycle — usually based on a policy like least work done, fewest locks held, or lowest rollback cost — and forcibly aborts it, releasing its locks so the remaining transactions can proceed. An alternative to detection is prevention: schemes like wait-die and wound-wait use transaction timestamps at request time to decide whether a transaction should wait or be aborted immediately, avoiding cycles from forming in the first place, at the cost of some transactions being aborted more aggressively than strictly necessary.",
    idealAnswer:
      "Most systems build a wait-for graph and check for cycles — if T1 waits on T2 and T2 waits on T1, that's a cycle and a deadlock. The DB picks a victim, usually the one that's done the least work, and aborts it to break the cycle. The alternative is prevention rather than detection: wait-die and wound-wait use timestamps so that, for example, an older transaction can force-abort a younger one holding a lock it needs, which guarantees no cycles ever form, trading some unnecessary aborts for never having to run cycle detection.",
    interviewerExpectations: [
      "Describes the wait-for graph and cycle detection correctly",
      "Knows victim selection is policy-based, not arbitrary",
      "Can name at least one prevention scheme (wait-die or wound-wait) as an alternative",
    ],
    followUpQuestions: [
      "What's the difference between wait-die and wound-wait?",
      "What are the trade-offs of detection versus prevention?",
      "How often should the database run deadlock detection, and what's the cost of running it too often or too rarely?",
    ],
    commonMistakes: [
      "Confusing deadlock with livelock or starvation",
      "Assuming the first transaction to request a lock is always the one aborted",
    ],
    discussionPoints: ["Wait-for graph", "Victim selection policy", "Detection vs prevention"],
  },
  {
    id: "concurrency-control-iv-4",
    question: "When would you choose optimistic concurrency control over pessimistic locking, and vice versa?",
    difficulty: "Hard",
    detailedAnswer:
      "The decision hinges on expected contention. OCC lets transactions run without acquiring any locks and only checks for conflicts at commit time — this avoids all lock-management overhead, which is a big win when conflicts are rare, because most transactions will validate successfully on the first try. But if contention is high, OCC wastes real work: transactions do all their reads/writes and then get aborted and retried at commit, potentially repeatedly. Pessimistic locking (2PL) acquires locks up front, which adds overhead and can cause blocking/deadlocks, but avoids wasted work under high contention because conflicting transactions are simply forced to wait rather than doing full work and then failing. A concrete rule of thumb: a flash-sale 'buy the last unit of a hot item' scenario has extremely high contention on one row, favoring pessimistic locking (or even a dedicated atomic decrement); updating a user's own profile fields has essentially zero contention with other users, favoring OCC or plain MVCC.",
    idealAnswer:
      "I'd look at contention. If most transactions touch disjoint data or conflicts are rare — like users editing their own profile — I'd reach for OCC or rely on MVCC, since there's no lock overhead and validation will almost always succeed. If I expect heavy contention on the same rows — like a limited-inventory flash sale where thousands of transactions race for the same few rows — I'd use pessimistic locking, because OCC there would mean most transactions do all their work and then get thrown away at validation, which wastes CPU and creates a thundering-herd retry pattern. In practice a lot of production systems default to MVCC precisely because it gives you lock-free reads without fully committing to either extreme.",
    interviewerExpectations: [
      "Frames the decision around expected contention, not personal preference",
      "Gives a concrete example for each side",
      "Understands the failure mode of the wrong choice (wasted retries vs unnecessary blocking)",
    ],
    followUpQuestions: [
      "How would you measure contention in a real system before making this decision?",
      "How does MVCC change this trade-off?",
      "What would you do if OCC retries kept failing repeatedly for the same transaction?",
    ],
    commonMistakes: [
      "Treating OCC as strictly 'better' because it avoids locks",
      "Not connecting the choice back to a concrete workload characteristic (contention level)",
    ],
    discussionPoints: ["Contention level as the deciding factor", "Retry storms under OCC", "MVCC as a middle ground"],
    scenarioBased: true,
  },
  {
    id: "concurrency-control-iv-5",
    question: "A checkout service uses Strict 2PL and you're seeing a sharp rise in transaction timeouts during a flash sale as thousands of users try to buy the same 50 units of a product. Walk through how you'd diagnose and fix this.",
    difficulty: "Hard",
    detailedAnswer:
      "This is classic hot-row lock contention: thousands of transactions are all trying to acquire an exclusive lock on the same inventory row (or a small number of rows) to decrement stock, so almost all of them queue up waiting for the X-lock and start timing out once the queue grows faster than it can drain. First step is confirming the diagnosis — check the database's lock-wait statistics or 'blocked sessions' view to see many transactions all waiting on the same row/page, not spread across many rows. Once confirmed, the fix is to reduce the time each transaction holds the exclusive lock and/or reduce the number of transactions contending for the exact same row: shorten the transaction so the lock is held for the minimum time (do all non-critical work before touching the inventory row, not after), consider a queue-based or single-writer approach for that specific hot item (e.g. route decrements through a lightweight in-memory counter or a message queue that serializes just that item's updates), or shard the counter (e.g. maintain the 50 units as multiple sub-counters that get combined) so contention spreads across multiple rows instead of one. Switching that specific operation to an atomic 'UPDATE ... SET stock = stock - 1 WHERE stock > 0' single-statement decrement (rather than read-then-write in application code) also collapses the lock hold time to a single statement instead of an entire transaction.",
    idealAnswer:
      "I'd first confirm it's lock contention and not something else — pull the database's lock-wait or blocked-sessions view during the spike and check whether many sessions are queued behind the same row, which would confirm a hot-row problem rather than, say, a missing index or CPU saturation. Given it's a flash sale on 50 units, this is expected: everyone wants the same row. My fix would be to shrink the critical section — do a single atomic decrement statement guarded by a stock > 0 check instead of a read-modify-write spread across the transaction — so the exclusive lock is held for microseconds instead of the whole checkout flow. I'd also move anything that doesn't need to be in that transaction, like payment authorization or shipping calculation, outside the lock-holding window. If contention is still too high at that scale, I'd consider a queue in front of that one hot item so requests are serialized cheaply before ever touching the database lock.",
    interviewerExpectations: [
      "Correctly identifies hot-row lock contention as the likely root cause",
      "Names a concrete diagnostic step (lock-wait / blocked-sessions monitoring) before jumping to a fix",
      "Proposes shrinking the critical section and/or reducing contention as the fix, not just 'add more hardware'",
    ],
    followUpQuestions: [
      "How would you distinguish lock contention from a missing index causing slow queries?",
      "What would change about your approach if this needed to scale to millions of units instead of 50?",
      "How does switching to OCC change this specific scenario — would it help or hurt?",
    ],
    commonMistakes: [
      "Jumping straight to 'add more database replicas' without diagnosing that it's write contention on one row (replicas don't help write scaling)",
      "Not considering that OCC would likely make this worse, not better, given how high contention is on this specific row",
    ],
    discussionPoints: ["Hot-row contention diagnosis", "Shrinking critical sections", "Atomic decrement vs read-modify-write", "OCC vs pessimistic locking under extreme contention"],
    scenarioBased: true,
  },
];

export default concurrencyControlInterviewQuestions;
