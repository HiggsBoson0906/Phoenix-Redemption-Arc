// src/content/cs-fundamentals/dbms/interview/transactionsAcid.interview.ts

import type { InterviewQuestion } from "@/types";

const transactionsAcidInterviewQuestions: InterviewQuestion[] = [
  {
    id: "transactions-acid-iv-1",
    question: "Explain the four ACID properties with a concrete example for each.",
    difficulty: "Easy",
    detailedAnswer:
      "Atomicity: a transaction's operations are all-or-nothing — in a bank transfer (debit A, credit B), if the credit fails after the debit succeeds, atomicity guarantees the debit is rolled back too, so money is never destroyed. Consistency: a transaction can only move the database from one valid state to another — if a CHECK constraint says balance >= 0, a transaction that would leave balance negative is rejected, keeping the database's declared rules intact. Isolation: concurrent transactions don't see each other's uncommitted intermediate states — if two people are simultaneously booking the last seat on a flight, isolation (at a sufficient level) ensures they can't both see the seat as available and both succeed. Durability: once a transaction commits, the change survives a crash — if the server loses power one millisecond after acknowledging a committed order, that order is still there on restart, because it was already durably logged before the commit was acknowledged.",
    idealAnswer:
      "I like pairing each letter with the failure mode it specifically prevents: Atomicity stops partial writes from a crash mid-transaction, Consistency stops a transaction from leaving the data in a state that violates the database's own rules, Isolation stops concurrent transactions from corrupting each other's view of the data, and Durability stops a crash immediately after commit from losing data the user was already told succeeded. The bank transfer example covers three of the four cleanly, which is why it's the go-to.",
    interviewerExpectations: [
      "Gives a distinct, correct example per property, not one blurred example for all four",
      "Doesn't confuse Consistency (ACID) with Consistency (CAP theorem)",
      "Explains what specifically breaks if each property is absent",
    ],
    followUpQuestions: [
      "What's the difference between ACID Consistency and CAP Consistency?",
      "How is Durability actually implemented under the hood?",
      "Which ACID property is most directly affected by choice of isolation level?",
    ],
    commonMistakes: [
      "Using the exact same vague example for all four letters without differentiating them",
      "Confusing Consistency with Isolation",
    ],
    discussionPoints: ["Bank transfer example", "Constraint enforcement", "Write-ahead logging"],
  },
  {
    id: "transactions-acid-iv-2",
    question: "What is a dirty read, a non-repeatable read, and a phantom read? Which isolation levels prevent each?",
    difficulty: "Medium",
    detailedAnswer:
      "A dirty read is reading another transaction's uncommitted changes — if that transaction later rolls back, you've read data that never truly existed; prevented starting at READ COMMITTED. A non-repeatable read is when re-reading the exact same row within one transaction returns a different value, because another transaction updated and committed a change to that row in between your two reads; prevented starting at REPEATABLE READ. A phantom read is when re-running the same range query (a WHERE condition matching a set of rows, not a single row) within one transaction returns a different set of rows, because another transaction inserted or deleted rows matching that range and committed in between; per the strict SQL standard, only SERIALIZABLE is guaranteed to prevent this (though MySQL's InnoDB REPEATABLE READ also prevents it via MVCC, which is a notable engine-specific exception to the standard's minimum guarantee). The four levels — READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE — form a strict ladder, each preventing a superset of anomalies of the level below.",
    idealAnswer:
      "I keep these straight by what's changing: dirty read is about seeing data that isn't even committed yet. Non-repeatable read is about a single row's *value* changing between two reads in the same transaction. Phantom read is about the *set of rows* changing between two range queries in the same transaction. Each successive isolation level closes off one more of these, in that order, with SERIALIZABLE closing off all three per the standard — though I'd flag that MySQL's InnoDB REPEATABLE READ is actually stronger than the SQL standard requires and also blocks phantoms via MVCC, which is a detail worth knowing if you're working with MySQL specifically.",
    interviewerExpectations: [
      "Correctly and distinctly defines all three anomalies",
      "Correctly maps each anomaly to the minimum isolation level that prevents it",
      "Bonus: knows the MySQL InnoDB REPEATABLE READ exception to the standard",
    ],
    followUpQuestions: [
      "Why is SERIALIZABLE expensive compared to READ COMMITTED?",
      "How does MVCC help implement REPEATABLE READ without heavy locking?",
      "What real-world bug would non-repeatable read cause in an application?",
    ],
    commonMistakes: [
      "Mixing up non-repeatable read (single row value changes) with phantom read (row set changes)",
      "Claiming REPEATABLE READ always prevents phantoms per the standard, without qualification",
    ],
    discussionPoints: ["Isolation level ladder", "MVCC", "Anomaly-to-level mapping"],
  },
  {
    id: "transactions-acid-iv-3",
    question: "Why might a system deliberately choose a weaker isolation level like READ COMMITTED instead of always using SERIALIZABLE?",
    difficulty: "Medium",
    detailedAnswer:
      "SERIALIZABLE guarantees the strongest correctness but at real cost: it typically requires either heavier locking (blocking more concurrent transactions from proceeding) or optimistic conflict detection that aborts and retries transactions when a serialization conflict is detected, which reduces throughput and adds retry complexity to application code under contention. Most application workloads don't actually need serializable guarantees for most of their queries — a typical web request reading a user's profile or writing a single row doesn't have the multi-statement, cross-row consistency requirements that make phantom reads or non-repeatable reads dangerous. READ COMMITTED (the default in PostgreSQL/Oracle) is a pragmatic default: it prevents the most obviously dangerous anomaly (dirty reads) while allowing much higher concurrency, and specific operations that genuinely need stronger guarantees (like a seat-booking check-and-update, or a financial reconciliation report) can explicitly opt into SERIALIZABLE or use targeted row-level locking (SELECT ... FOR UPDATE) just for that operation instead of paying the cost system-wide.",
    idealAnswer:
      "It's a throughput-versus-correctness dial, and most of an application's queries simply don't need the strongest setting — cranking every transaction to SERIALIZABLE would mean more lock contention or more aborted-and-retried transactions under load, for correctness guarantees that only a handful of genuinely sensitive operations (like a seat booking, or a balance transfer) actually require. The better pattern is READ COMMITTED as the system default, with SERIALIZABLE or explicit row locks reserved for the specific transactions where a race condition would actually cause a real bug.",
    interviewerExpectations: [
      "Explains the throughput/correctness trade-off concretely (locking or abort/retry cost)",
      "Recognizes not every operation needs the strongest isolation level",
      "Proposes selectively using stronger isolation only where needed, rather than globally",
    ],
    followUpQuestions: [
      "How would you decide, for a given operation, whether it needs SERIALIZABLE?",
      "What does 'the transaction was aborted due to a serialization failure' mean, and how should application code handle it?",
      "What's the difference between optimistic and pessimistic concurrency control here?",
    ],
    commonMistakes: [
      "Saying 'SERIALIZABLE is always better, just use it everywhere' without acknowledging cost",
      "Not mentioning that stronger isolation can cause more transaction aborts/retries",
    ],
    discussionPoints: ["Throughput vs correctness trade-off", "Selective isolation per operation", "Optimistic vs pessimistic concurrency"],
  },
  {
    id: "transactions-acid-iv-4",
    question: "How is durability actually implemented by a database engine? What happens if the server crashes right after a COMMIT is acknowledged?",
    difficulty: "Medium",
    detailedAnswer:
      "Durability is implemented via write-ahead logging (WAL). Before any change is applied to the actual data files (which may be cached in memory and flushed to disk lazily for performance), the change is first written as a log record to an append-only transaction log, and that log write is forced (fsynced) to durable storage. A COMMIT is only acknowledged back to the client after this log write is confirmed durable — not after the data files themselves are updated, which can happen lazily afterward. If the server crashes immediately after acknowledging a commit, the actual data files might not yet reflect the change, but the log does, since the log write happened first and was confirmed before the commit was acknowledged. On restart, the recovery process replays the log (redo) to reapply any committed changes that hadn't yet made it into the data files, and undoes (rolls back) any changes from transactions that were in-progress but never committed — this two-part recovery (redo committed work, undo uncommitted work) is what guarantees durability alongside atomicity even across a crash.",
    idealAnswer:
      "The key insight is ordering: the log write happens and is confirmed durable *before* the commit is acknowledged to the client, and the actual data-file update can lag behind. So if the server crashes right after acknowledging a commit, the log already has the durable record even if the data files don't yet — recovery replays the log on restart to bring the data files up to date with everything that was actually committed, and rolls back anything that was mid-flight but never committed. That ordering guarantee — log before acknowledge — is really the whole trick behind durability.",
    interviewerExpectations: [
      "Explains write-ahead logging and the specific ordering (log flush before commit acknowledgment)",
      "Explains what recovery does on restart (redo committed, undo uncommitted)",
      "Understands data files can lag behind the log without violating durability",
    ],
    followUpQuestions: [
      "What's the performance cost of forcing a log flush on every commit, and how do databases mitigate it (e.g. group commit)?",
      "How does WAL also help implement Atomicity, not just Durability?",
      "What's the difference between a checkpoint and a WAL record?",
    ],
    commonMistakes: [
      "Saying durability just means 'data is saved to disk' without explaining WAL or the ordering guarantee",
      "Not distinguishing redo (for committed transactions) from undo (for uncommitted ones) during recovery",
    ],
    discussionPoints: ["Write-ahead logging", "Crash recovery (redo/undo)", "fsync and commit acknowledgment ordering"],
  },
  {
    id: "transactions-acid-iv-5",
    question: "Your team's e-commerce checkout flow occasionally oversells the last unit of a popular product — two customers both get a 'purchase successful' confirmation for the same single remaining unit. Diagnose the likely cause and propose a fix.",
    difficulty: "Hard",
    detailedAnswer:
      "This is a textbook lost-update / race-condition bug caused by insufficient isolation around the check-then-act sequence: the checkout flow almost certainly reads the current stock count, checks if it's > 0 in application code, and then issues a separate UPDATE to decrement it — and if two requests both read stock = 1 before either has committed its decrement, both pass the application-level check and both proceed to charge and confirm the customer, even though only one unit exists. Under READ COMMITTED (a common default), this is entirely possible because the read and the subsequent write aren't atomic as a unit — nothing stops two transactions from both reading the same 'stale-but-committed' value before either writes. The fix is to make the check-and-decrement atomic and mutually exclusive: either (a) use a single atomic SQL statement like 'UPDATE Product SET stock = stock - 1 WHERE id = ? AND stock > 0' and check the affected row count — if 0 rows were affected, the purchase fails because someone else already took the last unit, which lets the database's own row-level locking handle the race instead of application code; or (b) explicitly lock the row with 'SELECT stock FROM Product WHERE id = ? FOR UPDATE' inside a transaction before checking and decrementing, which blocks a second concurrent transaction from reading that row until the first transaction commits or rolls back; or (c) use SERIALIZABLE isolation for this specific transaction and handle the resulting serialization-failure errors with an automatic retry. Option (a) — a single atomic conditional UPDATE — is usually the simplest, cheapest fix and avoids holding locks for the duration of a slower application-level check, so I'd start there and only reach for explicit row locking or SERIALIZABLE if the checkout flow genuinely needs to do more between the check and the decrement than a single UPDATE can express.",
    idealAnswer:
      "The root cause is almost certainly a classic check-then-act race: read the stock count, decide it's available in application code, then write the decrement as a separate step — with nothing stopping two concurrent requests from both reading the same value before either commits its write. I'd fix it by collapsing the check and the decrement into one atomic statement — 'UPDATE Product SET stock = stock - 1 WHERE id = ? AND stock > 0' — and checking the affected-rows count to know if the purchase actually succeeded, which lets the database's own atomicity handle the race instead of relying on isolation level tuning or explicit locks. If the flow needs more logic between the check and the write than a single UPDATE can express, I'd reach for SELECT ... FOR UPDATE to explicitly lock the row for the duration of the transaction instead.",
    interviewerExpectations: [
      "Correctly diagnoses this as a check-then-act race condition / lost update, not a vague 'concurrency bug'",
      "Proposes a concrete, correct fix — atomic conditional UPDATE or explicit row locking (SELECT FOR UPDATE) or SERIALIZABLE with retry",
      "Explains why the simplest fix (atomic UPDATE) is usually preferable to heavier-handed locking or isolation changes",
    ],
    followUpQuestions: [
      "How would you handle the 'purchase failed, 0 rows affected' case in the application layer?",
      "What are the trade-offs of SELECT ... FOR UPDATE versus the atomic UPDATE approach?",
      "How would this scale if the check involved multiple products in one order, not just one?",
    ],
    commonMistakes: [
      "Blaming 'the database' vaguely without identifying the check-then-act pattern specifically",
      "Proposing SERIALIZABLE everywhere as the fix without considering the simpler atomic-UPDATE approach",
      "Not addressing what the application should do when the atomic update affects 0 rows",
    ],
    discussionPoints: ["Check-then-act race conditions", "Atomic conditional updates", "SELECT FOR UPDATE row locking", "Overselling/inventory correctness"],
    scenarioBased: true,
  },
];

export default transactionsAcidInterviewQuestions;
