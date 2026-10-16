// src/content/cs-fundamentals/dbms/interview/recoveryLogging.interview.ts

import type { InterviewQuestion } from "@/types";

const recoveryLoggingInterviewQuestions: InterviewQuestion[] = [
  {
    id: "recovery-logging-iv-1",
    question: "What is Write-Ahead Logging and why is it necessary for durability?",
    difficulty: "Easy",
    detailedAnswer:
      "Write-Ahead Logging requires that a log record describing any change be durably written to stable storage before the corresponding data page is modified on disk, and that a transaction isn't considered committed until its commit log record is itself durable. This is necessary because a database's actual data pages are usually cached in memory and only flushed to disk periodically for performance — if the database crashes before a dirty page is flushed, the only durable record of that change is the log, so the log must always be at least as up to date as the data to make recovery possible at all.",
    idealAnswer:
      "WAL means: before I change the actual data on disk, I first write down what I'm about to do, durably, in a log. The reason this matters is that data pages usually live in memory and only get flushed to disk periodically for performance reasons — so if the database crashes, the log is the only reliable record of what was supposed to have happened. As long as the log is always at least as current as the data, the database can always reconstruct the truth on restart, no matter when the crash happened.",
    interviewerExpectations: [
      "States the ordering rule correctly (log before data)",
      "Explains WHY this ordering enables recovery, not just what the rule is",
    ],
    followUpQuestions: [
      "What would go wrong if data pages could be flushed before their log records?",
      "Does WAL slow down or speed up transaction commits? Why?",
    ],
    commonMistakes: [
      "Getting the ordering backwards (thinking data is written before the log)",
      "Not connecting WAL to durability specifically (as opposed to isolation or consistency)",
    ],
    discussionPoints: ["Log-before-data ordering", "Why in-memory dirty pages need a durable log"],
  },
  {
    id: "recovery-logging-iv-2",
    question: "What is a checkpoint, and why can't a database just replay its entire log from the beginning every time it recovers from a crash?",
    difficulty: "Medium",
    detailedAnswer:
      "A checkpoint is a periodic operation where the database flushes all currently dirty (modified-in-memory) pages to disk and writes a marker into the log recording that this has happened. On restart after a crash, the database only needs to begin its recovery log replay from the earliest checkpoint that could still be relevant, not from the very start of the log's history — because everything before that point is guaranteed to already be safely reflected on disk. Without checkpoints, a database that had been running for months would need to replay potentially years of log history on every restart, which would make recovery time grow unboundedly with the database's age, an unacceptable operational property.",
    idealAnswer:
      "A checkpoint periodically flushes whatever's currently dirty in memory to disk and drops a marker in the log saying 'everything before this point is safely on disk.' That means recovery only has to replay the log from the last checkpoint forward, not from the beginning of time — otherwise a database that's been running for a year would take longer and longer to recover after every crash, since the log just keeps growing. Checkpoints are what keep recovery time bounded and roughly constant regardless of how long the database has been running.",
    interviewerExpectations: [
      "Explains checkpoint mechanism (flush dirty pages + log marker)",
      "Connects checkpoints directly to bounding recovery time",
    ],
    followUpQuestions: [
      "What's the trade-off in choosing how often to checkpoint?",
      "Is a checkpoint the same thing as a backup? Why or why not?",
    ],
    commonMistakes: [
      "Confusing a checkpoint with a full database backup",
      "Not explaining why unbounded log replay would be a real operational problem",
    ],
    discussionPoints: ["Checkpoint mechanism", "Bounded recovery time", "Checkpoint frequency trade-off"],
  },
  {
    id: "recovery-logging-iv-3",
    question: "Walk me through what happens, at a conceptual level, when a database using ARIES-style recovery restarts after a crash.",
    difficulty: "Medium",
    detailedAnswer:
      "Recovery proceeds in three phases. Analysis scans forward through the log starting at the last checkpoint to reconstruct exactly which transactions were active (uncommitted) at the moment of the crash and which data pages were dirty — this rebuilds the bookkeeping the database needs before it can safely act. Redo then replays the log forward from the appropriate point, reapplying every logged change unconditionally — including changes from transactions that will later be undone — so that the database ends up in exactly the physical state it was in the instant before the crash, no more and no less. Undo then works backward through the log, rolling back the changes made by any transaction that was still active (uncommitted) at crash time, using the before-image information in each log record, until all such transactions are fully reversed and the database reflects only the effects of transactions that had actually committed.",
    idealAnswer:
      "Three phases: Analysis figures out what was actually happening at the moment of the crash — which transactions were still in flight, which pages were dirty — by scanning the log from the last checkpoint forward. Redo then replays everything logged since that point, even for transactions that will get undone later, to put the database back exactly where it was the instant before the crash. Then Undo goes backward and rolls back anything that belonged to a transaction that never committed, using the log's before-images to know exactly what to restore. The order matters — you redo first to get to the true crash-time state, then undo only the parts that shouldn't have survived.",
    interviewerExpectations: [
      "Names all three phases in the correct order",
      "Explains that Redo applies unconditionally, even to doomed transactions",
      "Understands Undo uses before-image information from the log",
    ],
    followUpQuestions: [
      "Why does ARIES redo transactions that are just going to be undone anyway?",
      "What happens if the database crashes again during the undo phase itself?",
      "What information does a log record need to contain to make undo possible?",
    ],
    commonMistakes: [
      "Getting the phase order wrong (e.g., undo before redo)",
      "Not knowing why redo applies to doomed transactions too",
    ],
    discussionPoints: ["Analysis phase", "Unconditional redo", "Before-image-based undo"],
  },
  {
    id: "recovery-logging-iv-4",
    question: "Why is the undo process itself logged during recovery (Compensation Log Records), instead of just being applied directly?",
    difficulty: "Hard",
    detailedAnswer:
      "If recovery crashes a second time while in the middle of undoing a transaction, the database needs to know, on the next restart, exactly how much undo work had already been completed, otherwise it risks either re-undoing an already-undone change (corrupting data further) or getting stuck in an infinite loop of repeatedly undoing the same operation. By logging each undo action as a Compensation Log Record (CLR) — which itself is never subsequently undone — the recovery process gains the same crash-safety property for undo that WAL already gives the forward-processing path: recovery of the recovery process becomes idempotent and can always pick up exactly where it left off, no matter how many times it's interrupted.",
    idealAnswer:
      "Because recovery itself needs to be crash-safe — what if the database crashes again while it's in the middle of undoing a transaction? Without logging the undo actions themselves, the next recovery attempt wouldn't know how far the previous undo got, and could end up redoing an undo that already happened, corrupting things further, or looping forever. By writing a Compensation Log Record for every undo action — and making sure CLRs are never themselves undone — the undo process becomes idempotent and resumable, just like the original forward logging made the database's normal operation crash-safe. It's essentially applying the same WAL principle recursively to the recovery process itself.",
    interviewerExpectations: [
      "Identifies the core risk: a second crash during undo without any record of undo progress",
      "Explains that CLRs make undo idempotent/resumable",
      "Recognizes this as applying WAL's own principle to the recovery process itself",
    ],
    followUpQuestions: [
      "Are CLRs themselves ever undone? Why or why not?",
      "How does this connect to the general idea of making any multi-step recovery process idempotent?",
    ],
    commonMistakes: [
      "Not considering the 'crash during recovery' scenario at all",
      "Assuming undo is a single atomic operation that can't itself be interrupted",
    ],
    discussionPoints: ["Crash-during-recovery scenario", "Idempotent/resumable undo", "CLRs are never undone"],
  },
  {
    id: "recovery-logging-iv-5",
    question: "Your team is designing a new service's storage layer and debating whether to build custom durability handling versus relying on the database's built-in WAL and recovery. A teammate argues 'we can just write to the data files directly and skip the log, it'll be faster.' How do you respond?",
    difficulty: "Hard",
    detailedAnswer:
      "I'd push back on the premise that skipping the log is actually faster in the way that matters: WAL doesn't primarily exist to slow things down, it exists because durably committing a transaction requires SOME durable write, and a sequential append to a log is dramatically cheaper than a synchronous random write to scattered data pages — so WAL is usually a performance optimization for achieving durability, not a tax on top of a faster alternative. Writing directly to data files without a log means either (a) you're not actually getting crash-safe durability — a crash mid-write to a data page can leave it in a torn, partially-written, corrupted state with zero way to detect or repair it, which is strictly worse, or (b) you're forced to fsync every data page write synchronously to get real durability, which is typically much slower than sequential log appends since data pages are scattered randomly across the file while log appends are sequential. I'd also point out that reimplementing crash recovery correctly — handling partial writes, torn pages, and crash-during-recovery scenarios — is a notoriously hard problem that mature databases have spent decades hardening; a custom scheme is very likely to have subtle correctness bugs that only surface during rare crash timing windows, which are exactly the scenarios that are hardest to test for. I'd recommend benchmarking the specific bottleneck first — if the concern is genuinely about latency, tuning WAL settings (e.g. group commit, adjusting fsync behavior with an understood risk trade-off) is a much safer lever than abandoning logging altogether.",
    idealAnswer:
      "I'd push back gently but firmly. The log isn't really an extra cost on top of a faster path — it's usually what makes durable commits fast in the first place, because a sequential log append is way cheaper than durably flushing scattered data pages on every write. If we skip the log, either we're not really durable anymore — a crash mid-write can leave a data page half-written with no way to detect or fix it — or we end up fsyncing data pages directly, which is typically slower than what WAL already gives us. I'd also bring up that correctly handling every crash-timing edge case in a custom recovery scheme is genuinely hard — it's taken database implementations decades to get right — so I'd want to see a specific, measured bottleneck before considering reinventing this, and even then I'd look at tuning the existing WAL setup (like batching commits) before abandoning logging entirely.",
    interviewerExpectations: [
      "Correctly reframes WAL as usually a performance win for durable commits, not purely overhead",
      "Explains the concrete risk of skipping the log (torn/corrupted writes with no recovery path)",
      "Recommends measuring the actual bottleneck and tuning existing WAL behavior before considering a custom scheme",
    ],
    followUpQuestions: [
      "What WAL tuning options exist for improving commit latency without giving up durability entirely?",
      "What is a 'torn write' and why is it dangerous?",
      "Are there legitimate cases where an application chooses weaker durability guarantees on purpose? What would that trade-off look like?",
    ],
    commonMistakes: [
      "Agreeing that skipping the log is a valid speed optimization without pushing back",
      "Not identifying torn/corrupted writes as the concrete failure mode of skipping WAL",
    ],
    discussionPoints: ["WAL as a durability performance optimization, not overhead", "Torn writes", "Reinventing recovery is hard", "Tuning vs abandoning WAL"],
    scenarioBased: true,
  },
];

export default recoveryLoggingInterviewQuestions;
