// src/content/cs-fundamentals/dbms/articles/recoveryLogging.ts

import type { Article } from "@/types";

const recoveryLoggingArticle: Article = {
  slug: "recovery-logging",
  title: "Database Recovery & Logging",
  summary:
    "Recovery and logging are how a database guarantees that committed transactions survive a crash and uncommitted ones vanish completely, by writing every change to a durable log before touching the actual data pages.",
  readingTimeMins: 9,
  beginnerExplanation:
    "Imagine writing a novel with no autosave: if your computer crashes mid-sentence, you lose everything since your last manual save. Databases can't tolerate that kind of loss for committed transactions — once a bank tells you 'transfer complete,' that transfer must survive a server crash a millisecond later. The mechanism that guarantees this is called Write-Ahead Logging (WAL): before the database ever modifies the actual data on disk, it first writes a record of that intended change to an append-only log file, and only considers a transaction committed once that log record is safely on durable storage.\n\nIf the database crashes, recovery works by replaying this log on restart: any change that was logged but not fully applied to the data can be redone, and any change belonging to a transaction that never committed can be undone — restoring the database to a consistent state as if the crash never disturbed a committed transaction and never happened for an uncommitted one.",
  detailedBreakdown:
    "The Write-Ahead Logging rule has a precise meaning: a log record describing a change must be written to stable (durable) storage before the corresponding data page modification is written to disk, and a transaction cannot be considered committed until its commit log record itself is durably written. This ordering is what makes recovery possible at all — if the log always describes changes at least as up-to-date as the data pages, the database can always reconstruct the truth by replaying the log, but if data pages could be written before their log records, a crash could leave data changed with no record of what happened or how to undo it.\n\nCheckpoints exist because replaying the entire log from the beginning of time on every restart would be prohibitively slow as a database runs for months or years. A checkpoint periodically flushes all currently dirty (modified but not yet disk-synced) pages to disk and records a checkpoint marker in the log; on recovery, the database only needs to replay the log starting from the earliest checkpoint that could still contain relevant uncommitted work, not from the very beginning — dramatically bounding recovery time.\n\nARIES (Algorithm for Recovery and Isolation Exploiting Semantics), the recovery algorithm most production databases are conceptually based on, structures recovery into three phases. Analysis scans the log forward from the last checkpoint to determine which transactions were active (uncommitted) at the time of the crash and which data pages were dirty, rebuilding the necessary bookkeeping tables. Redo then replays history forward from the appropriate point, reapplying every logged change (even for transactions that will later be undone) to bring the database back to exactly the state it was in at the moment of the crash — this 'redo everything, even doomed transactions, then undo the doomed ones' approach is what makes ARIES conceptually simple to reason about compared to trying to redo only what's needed. Undo then works backward through the log, rolling back any change made by a transaction that was still active (uncommitted) at crash time, using the log itself to know exactly what the pre-change value was, until each such transaction is fully undone.\n\nEach log record includes enough information to perform both operations: a redo record typically captures the change needed to reproduce an update (often physically, e.g. 'this byte range became this value'), while an undo record captures how to reverse it (the before-image or an inverse operation). Because undo operations are themselves logged (as Compensation Log Records in ARIES) to make the undo process itself crash-safe — if the database crashes again during recovery's undo phase, it can resume correctly rather than re-undoing an already-undone change or getting stuck in a loop. This combination is what gives WAL-based recovery its core guarantee: durability (committed work survives any crash) and atomicity (a transaction's effects are entirely present or entirely absent, never partial) even when the crash happens at the worst possible moment.",
  realWorldExamples:
    "PostgreSQL's WAL is literally named after the concept — every change is written to WAL segment files before the corresponding heap/index pages are flushed, and PostgreSQL's replication and point-in-time recovery features are built directly on shipping and replaying these WAL segments to other servers. MySQL's InnoDB storage engine implements a recovery protocol directly modeled on ARIES, using a redo log (the ib_logfile) for the redo phase and undo log segments (also used to support MVCC snapshots) for the undo phase. Modern journaling file systems (ext4, NTFS) apply the same write-ahead logging principle at the filesystem level to survive power-loss during metadata updates, showing that WAL is a general durability pattern, not a database-specific trick.",
  useCases: [
    "Guaranteeing the Durability and Atomicity properties of ACID transactions across crashes and power loss",
    "Enabling fast crash recovery via checkpointing instead of replaying an unboundedly long log",
    "Powering database replication and point-in-time recovery by shipping/replaying the WAL stream to replicas or a restore target",
    "Supporting MVCC snapshot reads in some engines by reusing undo log information",
  ],
  advantages: [
    "Guarantees committed transactions survive crashes (durability) and uncommitted ones are fully rolled back (atomicity)",
    "Sequential log writes are much faster than random writes to data pages, so WAL improves write performance versus flushing data pages synchronously on every change",
    "Checkpoints bound recovery time to a manageable window instead of the entire database history",
    "The same log stream can be reused for replication and point-in-time recovery, not just crash recovery",
  ],
  disadvantages: [
    "The log itself must be durably written (fsynced) before commit can be acknowledged, which is a real latency cost on every transaction",
    "Log storage grows continuously and must be archived, compacted, or truncated (post-checkpoint) or it will consume unbounded disk space",
    "Recovery, while bounded by checkpoints, still adds startup latency proportional to the amount of log since the last checkpoint",
    "Getting the checkpoint frequency wrong is a real trade-off: too frequent hurts steady-state write throughput, too infrequent lengthens recovery time",
  ],
  commonMisconceptions: [
    "\"Write-ahead logging means the log is written after the data, ahead of something else\" — 'write-ahead' specifically means the log record is written ahead of (before) the corresponding data page modification.",
    "\"A checkpoint is a backup\" — a checkpoint is an internal bookkeeping marker that bounds recovery replay time; it is not a substitute for an actual database backup.",
    "\"Redo and undo are opposites run at the same time\" — ARIES runs redo first (reapplying all logged changes, even from transactions that will be undone) and only then runs undo (rolling back incomplete transactions) — the order matters and is not symmetric.",
    "\"WAL slows down writes because of the extra logging step\" — WAL is actually what enables databases to acknowledge commits quickly, because a sequential log append is much cheaper than durably flushing scattered data pages on every transaction.",
  ],
  interviewPerspective:
    "Interviewers use this topic to test whether a candidate understands durability at a mechanical level rather than just reciting 'ACID means Atomicity Consistency Isolation Durability.' Expect to be asked to explain why logging happens before the data write (the actual WAL rule), what a checkpoint accomplishes and why it's needed, and to reason through a crash scenario — e.g. 'the database crashes mid-transaction; walk me through what happens on restart' — which tests whether you understand the analysis/redo/undo flow, even at a conceptual level without needing ARIES's exact internal data structures memorized.",
  oaPerspective:
    "OA questions test the precise WAL ordering rule (log before data), the purpose of checkpoints (bounding recovery time, not backup), and the distinction between redo (reapply committed/logged changes) and undo (roll back uncommitted changes) operations, along with which one runs first in a standard recovery sequence.",
  keyTakeaways: [
    "Write-Ahead Logging requires a change's log record to be durably written before the corresponding data page modification, and before a transaction is considered committed.",
    "Checkpoints periodically flush dirty pages and mark a point in the log, bounding how far back recovery needs to replay.",
    "ARIES recovery runs Analysis (figure out what was in-flight at crash time), then Redo (reapply all logged changes to reach the exact pre-crash state), then Undo (roll back incomplete transactions).",
    "Redo and undo log records carry enough information to reproduce or reverse a change; undo actions are themselves logged so recovery is crash-safe even if it crashes again mid-recovery.",
    "WAL improves both durability guarantees and write performance, since sequential log appends are cheaper than synchronous random data-page writes.",
  ],
  summaryClosing:
    "Write-ahead logging is the unglamorous mechanism quietly underpinning every 'your transaction was successful' message a database ever gives — by guaranteeing the log is always at least as current as the data, a database can always reconstruct the truth after a crash, no matter how badly timed that crash was.",
  relatedTopics: ["Transactions & ACID Properties", "Concurrency Control & Locking", "Indexing (B-Tree, B+Tree, Hashing)"],
  furtherReading: [
    { label: "ARIES: A Transaction Recovery Method (Mohan et al.)", note: "The original paper describing the analysis/redo/undo recovery algorithm most production databases are based on." },
    { label: "PostgreSQL documentation: Write-Ahead Logging (WAL)", note: "A concrete production implementation of WAL, checkpoints, and their tuning trade-offs." },
  ],
};

export default recoveryLoggingArticle;
