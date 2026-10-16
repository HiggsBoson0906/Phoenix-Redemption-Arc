// src/content/cs-fundamentals/os/interview/deadlocks.interview.ts

import type { InterviewQuestion } from "@/types";

const deadlocksInterviewQuestions: InterviewQuestion[] = [
  {
    id: "deadlock-iv-1",
    question: "What are the four necessary conditions for deadlock? Does breaking one of them actually prevent deadlock?",
    difficulty: "Medium",
    detailedAnswer:
      "The four Coffman conditions are Mutual Exclusion (a resource is held non-shareably), Hold and Wait (a process holds a resource while waiting for another), No Preemption (resources can only be released voluntarily), and Circular Wait (a cycle of processes each waiting on the next). All four must hold simultaneously for deadlock to occur, so structurally breaking any single one — e.g. enforcing a global lock-acquisition order to eliminate circular wait, or requiring processes to request all resources upfront to eliminate hold-and-wait — is sufficient to prevent deadlock entirely.",
    idealAnswer:
      "Mutual exclusion, hold-and-wait, no preemption, and circular wait — and yes, you only need to break one, not all four, since deadlock requires every condition simultaneously. In practice the cheapest one to break is circular wait, just by enforcing a consistent global order for acquiring locks across the whole codebase — it costs nothing at runtime and eliminates an entire class of deadlock bugs.",
    interviewerExpectations: [
      "Recites all four conditions accurately",
      "Understands 'break one, prevent all' logic",
      "Can name a practical, low-cost prevention technique",
    ],
    followUpQuestions: [
      "Which condition is usually cheapest to break in practice, and why?",
      "Give an example of breaking hold-and-wait instead.",
      "Why is mutual exclusion usually NOT the condition you'd choose to break?",
    ],
    commonMistakes: ["Missing or misnaming one of the four conditions", "Not understanding that breaking just ONE condition is sufficient"],
    discussionPoints: ["Coffman conditions", "Lock ordering", "Prevention vs avoidance"],
  },
  {
    id: "deadlock-iv-2",
    question: "Two threads each lock two mutexes in opposite order — Thread A locks Mutex1 then Mutex2, Thread B locks Mutex2 then Mutex1. What's wrong, and how do you fix it?",
    difficulty: "Medium",
    detailedAnswer:
      "This is a textbook circular-wait deadlock: if Thread A acquires Mutex1 and Thread B simultaneously acquires Mutex2, then A blocks waiting for Mutex2 (held by B) while B blocks waiting for Mutex1 (held by A) — neither can proceed, forever. The fix is enforcing a consistent global lock-acquisition order across every code path that needs both mutexes — e.g. always lock the mutex with the lower memory address (or an assigned numeric ID) first, so both threads would acquire Mutex1 before Mutex2, making the interleaving that causes deadlock structurally impossible.",
    idealAnswer:
      "That's a classic inconsistent-lock-ordering deadlock — if the timing lines up so A grabs Mutex1 right as B grabs Mutex2, they'll each be stuck waiting on the other forever. The fix is to always acquire locks in the same global order everywhere in the codebase — say, by mutex ID or memory address — so this bad interleaving simply can't happen, since both threads would always try Mutex1 first.",
    interviewerExpectations: [
      "Correctly identifies this as circular wait specifically",
      "Proposes consistent lock ordering as the fix, not just 'add more locking'",
    ],
    followUpQuestions: [
      "What if the two mutexes don't have an obvious natural order?",
      "How would std::lock (C++) or similar 'lock multiple at once' primitives help here?",
      "How would you detect this bug via testing or static analysis before it ships?",
    ],
    commonMistakes: ["Proposing to 'just add a timeout' as the fix without addressing the root cause"],
    discussionPoints: ["Circular wait", "Global lock ordering", "std::lock / try-lock patterns"],
    scenarioBased: true,
  },
  {
    id: "deadlock-iv-3",
    question: "Explain Banker's Algorithm in your own words. What does it require to work correctly?",
    difficulty: "Hard",
    detailedAnswer:
      "Banker's Algorithm is a deadlock-avoidance technique: every process must declare its maximum possible resource need upfront, and before granting any resource request, the system simulates whether granting it would leave the system in a 'safe state' — meaning some order still exists in which every process could eventually get its full max need and finish (releasing its resources for the next). If granting a request would leave no such safe ordering, the request is denied (or delayed) even if the resources are technically available right now, trading some resource utilization for a guarantee that deadlock can never occur. It requires processes to honestly declare accurate maximum resource needs in advance, which is a significant practical limitation — most real applications don't know their maximum resource needs ahead of time.",
    idealAnswer:
      "It's a deadlock-avoidance strategy where the OS acts like a cautious banker: it only approves a resource request if, after granting it, there's still some guaranteed order in which every currently-active process could finish given the resources left over. The catch is it needs every process to declare its worst-case maximum need upfront and honestly — which is exactly why it's mostly a theoretical/interview tool rather than something used in general-purpose production OSes, since most real programs can't predict their maximum resource usage in advance.",
    interviewerExpectations: [
      "Correctly explains the 'safe state' concept, not just 'it avoids deadlock'",
      "Names the practical requirement (declared max need) as the real-world limitation",
    ],
    followUpQuestions: [
      "Walk through computing Need = Max − Allocation for a given process table.",
      "Why isn't Banker's Algorithm used in most general-purpose OSes?",
      "What's the time complexity of the safety algorithm?",
    ],
    commonMistakes: ["Confusing avoidance (Banker's) with detection — they're different strategies entirely"],
    discussionPoints: ["Safe state", "Need = Max − Allocation", "Practical limitations of avoidance"],
  },
  {
    id: "deadlock-iv-4",
    question: "You're debugging a production service that occasionally hangs completely under load, and thread dumps show several threads each blocked waiting on a lock held by another blocked thread. Walk me through your diagnosis and fix.",
    difficulty: "Hard",
    detailedAnswer:
      "This is a live deadlock, confirmed by the thread dump showing a cycle of BLOCKED threads each waiting on a lock the next one holds — I'd trace the exact lock objects each thread holds versus waits for from the dump to reconstruct the wait-for graph and confirm the cycle and identify which code paths acquire which locks in which order. Since it only happens 'occasionally under load,' it's likely a rare interleaving of two code paths that normally acquire the same locks in a consistent order but have one code path (perhaps a newer or less-common one, like an error-handling branch) that acquires them in reverse order. The fix is auditing every code path that touches both locks and enforcing one consistent global acquisition order; as a stopgap, using try-lock with a timeout and backoff/retry can convert a hang into a recoverable retry while the real ordering fix is deployed, and adding lock-order assertions or a debug-mode lock-order checker to CI would catch this class of bug before it reaches production again.",
    idealAnswer:
      "First I'd confirm it's a real deadlock, not just contention, by checking the thread dump for a genuine cycle — each thread's held-lock and waiting-on-lock forming a loop back to itself. Then I'd trace every code path that acquires both locks involved to find where the ordering is inconsistent — it's 'occasional under load' because it needs a specific rare interleaving, often triggered by an uncommon branch like error handling that acquires locks in a different order than the main path. The real fix is enforcing one consistent lock order everywhere; as an immediate production mitigation I'd consider try-lock with timeout and retry to at least avoid a permanent hang, plus adding a lock-order-checking tool to CI so this class of bug gets caught before shipping again.",
    interviewerExpectations: [
      "Confirms deadlock from the dump rather than assuming",
      "Explains why it's intermittent (rare interleaving / uncommon code path)",
      "Proposes both a root-cause fix and a production mitigation",
    ],
    followUpQuestions: [
      "How would a lock-order checker (like Java's or a custom static analyzer) work?",
      "What's the risk of using try-lock with timeout as a permanent fix rather than a stopgap?",
      "How would you reproduce this bug reliably in a test environment?",
    ],
    commonMistakes: [
      "Jumping to 'just restart the service' without root-causing",
      "Not explaining why the bug is intermittent rather than constant",
    ],
    discussionPoints: ["Thread dump analysis", "Wait-for graph reconstruction", "try-lock with timeout", "Lock-order static analysis"],
    scenarioBased: true,
  },
];

export default deadlocksInterviewQuestions;
