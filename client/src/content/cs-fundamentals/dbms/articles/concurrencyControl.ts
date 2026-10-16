// src/content/cs-fundamentals/dbms/articles/concurrencyControl.ts

import type { Article } from "@/types";

const concurrencyControlArticle: Article = {
  slug: "concurrency-control",
  title: "Concurrency Control & Locking",
  summary:
    "Concurrency control is how a database lets many transactions run at the same time without letting them corrupt each other's data — mainly through locking, timestamp ordering, or optimistic validation.",
  readingTimeMins: 9,
  beginnerExplanation:
    "Imagine a shared spreadsheet with no 'someone else is editing this cell' indicator: two people read the same cell value, both add 1 to it, and both write back — the second write silently overwrites the first, and one increment is lost. Concurrency control is the set of rules a database enforces so that when many transactions run at once, the end result is as if they had run one after another in some order (this property is called serializability), even though under the hood they were interleaved for performance.\n\nThe most common mechanism is locking: before a transaction reads or writes a row (or page, or table), it must acquire a lock on it. A shared (read) lock lets other transactions also read the same data but blocks anyone from writing it; an exclusive (write) lock blocks everyone else from reading or writing it until it's released.",
  detailedBreakdown:
    "Shared (S) locks and exclusive (X) locks are the two basic lock modes. Multiple transactions can hold an S-lock on the same item simultaneously (readers don't block readers), but an X-lock is exclusive against everything — no other transaction can hold any lock, S or X, on that item at the same time. This is captured in a lock-compatibility matrix: S is compatible with S, but X is compatible with nothing, including itself.\n\nSimply acquiring and releasing locks whenever convenient isn't enough to guarantee serializability — a transaction could release a lock early, let another transaction sneak in and modify the data, then re-acquire and read stale-relative-to-its-own-earlier-reads data. Two-Phase Locking (2PL) fixes this by splitting every transaction into a growing phase, where it may only acquire locks (never release), and a shrinking phase, where it may only release locks (never acquire). Once a transaction releases even one lock, it has entered the shrinking phase and cannot acquire any new lock. It can be proven that any schedule obeying 2PL is conflict-serializable. Basic 2PL is still vulnerable to cascading aborts (transaction A reads data X wrote, then X aborts, so A must abort too) — Strict 2PL fixes this by holding all exclusive locks until the transaction actually commits or aborts, and Rigorous 2PL (used by most commercial databases) holds both shared and exclusive locks until commit/abort, which also makes transactions trivially recoverable and gives you the effect of serializing transactions in commit order.\n\nLocking introduces its own classic hazard: deadlock. If transaction T1 holds a lock on row A and waits for a lock on row B, while T2 holds a lock on row B and waits for a lock on row A, neither can proceed. Databases handle this either by deadlock detection — periodically building a wait-for graph and aborting a transaction (usually the 'victim' with the least work done) if a cycle is found — or by deadlock prevention schemes like wait-die and wound-wait, which use transaction timestamps to decide whether an older transaction is allowed to wait for a younger one or must force it to abort. As an alternative to locking altogether, Timestamp Ordering (TO) assigns each transaction a unique timestamp at start and enforces the order of conflicting operations to match timestamp order (using read-timestamp and write-timestamp bookkeeping per data item), aborting and restarting any transaction that would violate this order. Optimistic Concurrency Control (OCC) takes yet another approach: transactions execute freely against a private workspace without acquiring any locks, and only at commit time does the system validate that no conflicting transaction committed in the meantime; if validation fails, the transaction is rolled back and retried. OCC is a good fit when conflicts are rare (validation failures are the exception, not the rule) because it avoids lock overhead entirely, but it wastes work when contention is high since transactions can be aborted late, after doing all their work.",
  realWorldExamples:
    "PostgreSQL and Oracle default to Multiversion Concurrency Control (MVCC), a refinement that keeps multiple versions of a row so that readers never block writers and writers never block readers — each transaction sees a consistent snapshot as of when it started, sidestepping most of the need for read locks entirely. MySQL's InnoDB engine uses a combination of MVCC for reads and next-key locking (a blend of row locks and gap locks) to prevent phantom reads under its default REPEATABLE READ isolation level. Airline seat-booking systems are a textbook case for OCC: read the seat's current version number, let the user pick a seat over several seconds of 'thinking time,' and only at the final confirm step check whether the version number still matches — if someone else booked it first, the version mismatch causes a retry rather than holding an exclusive lock on that seat for the entire time the user is deciding.",
  useCases: [
    "Guaranteeing serializable (or snapshot-consistent) results when many transactions touch overlapping rows concurrently",
    "Preventing lost updates, dirty reads, and other anomalies in multi-user OLTP systems (banking, ticketing, inventory)",
    "Choosing OCC for low-contention workloads (e.g. most e-commerce checkouts) to avoid lock overhead",
    "Choosing strict 2PL/locking for high-contention, write-heavy workloads where optimistic retries would thrash",
  ],
  advantages: [
    "Locking (2PL) gives strong, provable serializability guarantees that are easy to reason about",
    "MVCC lets readers proceed without blocking writers, dramatically improving throughput for read-heavy workloads",
    "OCC avoids lock-management overhead entirely when conflicts are genuinely rare",
  ],
  disadvantages: [
    "Lock-based protocols can deadlock and require detection/prevention machinery to recover",
    "Strict/rigorous 2PL can serialize unrelated transactions behind long-held locks, hurting throughput under contention",
    "OCC wastes computation on aborted-and-retried transactions when contention is actually high",
    "Timestamp ordering can cause excessive aborts when transaction timestamps frequently conflict with recency of access",
  ],
  commonMisconceptions: [
    "\"Two-phase locking means a transaction takes exactly two locks\" — the 'two phases' refer to a growing phase (acquiring) and shrinking phase (releasing) that can each involve any number of locks.",
    "\"2PL prevents deadlocks\" — 2PL guarantees serializability, not deadlock-freedom; deadlocks are a separate problem needing separate detection/prevention.",
    "\"MVCC means there's no concurrency control\" — MVCC still enforces isolation rules (e.g. write-write conflicts still need detection), it just avoids read locks by using row versions.",
    "\"Optimistic concurrency control means no checks are done\" — OCC defers all checking to a validation phase at commit time rather than skipping checks.",
  ],
  interviewPerspective:
    "This is one of the highest-yield DBMS interview topics because it connects directly to real production bugs: interviewers love asking you to trace through a lost-update or deadlock scenario step by step, explain the growing/shrinking phase distinction precisely (a very common trip-up), or compare pessimistic locking against optimistic concurrency control and justify which you'd pick for a given workload (e.g. 'a coupon code that only 100 people can redeem' — high contention, favors pessimistic locking or a single atomic counter — versus 'updating a user's profile bio' — low contention, favors OCC or plain MVCC).",
  oaPerspective:
    "OA questions test the lock-compatibility matrix (S-S compatible, X incompatible with everything), the precise definition of the growing/shrinking phase in 2PL, identifying whether a given lock schedule is conflict-serializable, and distinguishing deadlock prevention schemes (wait-die vs wound-wait) by which one aborts the requesting transaction versus the lock holder.",
  keyTakeaways: [
    "Shared locks allow concurrent reads; exclusive locks block all other access — this compatibility rule is the foundation of lock-based concurrency control.",
    "Two-Phase Locking splits a transaction into a growing (acquire-only) and shrinking (release-only) phase and guarantees conflict-serializability.",
    "Strict/Rigorous 2PL hold locks until commit/abort to additionally avoid cascading aborts and simplify recovery.",
    "Deadlocks are handled via detection (wait-for graph + victim abort) or prevention (wait-die, wound-wait using timestamps).",
    "Optimistic Concurrency Control skips locking entirely and validates at commit time — ideal for low-contention workloads.",
    "MVCC (used by PostgreSQL, MySQL/InnoDB, Oracle) lets readers see a consistent snapshot without blocking writers.",
  ],
  summaryClosing:
    "Concurrency control is the mechanism that lets a database honor the 'I' in ACID under real multi-user load — whether via pessimistic locking that blocks conflicting work up front, timestamp ordering that enforces a global sequence, or optimistic validation that only checks for conflicts at the last moment. Picking the right strategy is fundamentally a bet on how much contention your workload actually has.",
  relatedTopics: ["Transactions & ACID Properties", "Database Recovery & Logging", "Indexing (B-Tree, B+Tree, Hashing)"],
  furtherReading: [
    { label: "Database System Concepts (Silberschatz), Concurrency Control chapter", note: "The canonical academic treatment of 2PL, timestamp ordering, and deadlock handling." },
    { label: "PostgreSQL documentation: Concurrency Control (MVCC)", note: "How a production system implements snapshot isolation in practice." },
  ],
};

export default concurrencyControlArticle;
