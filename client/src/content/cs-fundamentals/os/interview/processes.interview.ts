// src/content/cs-fundamentals/os/interview/processes.interview.ts

import type { InterviewQuestion } from "@/types";

const processesInterviewQuestions: InterviewQuestion[] = [
  {
    id: "processes-iv-1",
    question: "What is a process, and how is it different from a program?",
    difficulty: "Easy",
    detailedAnswer:
      "A program is a static, passive set of compiled instructions stored on disk. A process is a program in execution: the OS has loaded it into memory, allocated it an address space, and it now has dynamic state — a program counter, CPU register values, a call stack, a heap, and an entry in the process table (PCB). The same program can be launched as many independent processes simultaneously, each with its own isolated memory.",
    idealAnswer:
      "I'd describe a program as a recipe and a process as the act of cooking it — the recipe is static, but once a chef starts following it with real ingredients, you get a live, stateful activity. A process is exactly that: an instance of a program with its own memory space, registers, and a PCB entry in the kernel tracking its state.",
    interviewerExpectations: [
      "Clear distinction between 'static code' and 'running instance'",
      "Mention of the OS's role in creating and tracking the process",
      "Awareness that memory/state is per-process, not shared",
    ],
    followUpQuestions: [
      "What's stored in a PCB?",
      "Can two processes run the same program at once? What differs between them?",
      "What's the difference between a process and a thread?",
    ],
    commonMistakes: [
      "Using 'process' and 'program' interchangeably",
      "Forgetting to mention the OS's role in resource allocation",
    ],
    discussionPoints: [
      "Address space isolation",
      "Process Control Block",
      "Process vs thread as a natural follow-up",
    ],
  },
  {
    id: "processes-iv-2",
    question: "Explain the process state diagram. Can a process go directly from Waiting to Running?",
    difficulty: "Medium",
    detailedAnswer:
      "The canonical states are New, Ready, Running, Waiting (Blocked), and Terminated. New→Ready happens once the OS finishes setting up the process; Ready→Running happens when the scheduler dispatches it to a CPU; Running→Waiting happens on a blocking I/O or event call; Running→Ready happens on preemption (time slice expiry or a higher-priority process arriving); Waiting→Ready happens when the awaited event/I/O completes; Running→Terminated happens on exit. A process cannot go directly from Waiting to Running — once its event completes it must re-enter the Ready queue and wait to be scheduled, even if that wait is momentary.",
    idealAnswer:
      "I'd draw the five states and walk through the arrows: creation puts you in Ready, the scheduler picks you for Running, and from Running you either finish (Terminated), get preempted (back to Ready), or block on I/O (Waiting). The one trap people fall into is assuming Waiting connects straight to Running — it doesn't; you always land back in Ready and wait your turn on the scheduler, which matters a lot when explaining priority inversion or scheduling fairness later.",
    interviewerExpectations: [
      "Can draw/describe the full 5-state diagram unprompted",
      "Correctly identifies Waiting→Ready (not Waiting→Running) as the real transition",
      "Connects preemption to Running→Ready",
    ],
    followUpQuestions: [
      "What triggers a Running→Ready transition specifically?",
      "How does this diagram change for a multi-core system?",
      "Where does 'Suspended' fit into extended state diagrams?",
    ],
    commonMistakes: [
      "Claiming Waiting→Running is a direct transition",
      "Omitting the New state entirely",
    ],
    discussionPoints: ["Preemption", "Scheduler dispatch", "I/O blocking"],
    scenarioBased: false,
  },
  {
    id: "processes-iv-3",
    question: "Walk me through what happens in the kernel when a program calls fork().",
    difficulty: "Medium",
    detailedAnswer:
      "The kernel allocates a new PCB and PID for the child, duplicates the parent's memory mappings (using copy-on-write so physical pages aren't actually copied until either process writes to them), duplicates open file descriptors (so both processes share the same underlying file offsets initially), and copies CPU register state. Both parent and child then resume execution at the instruction right after fork() — the only difference is the return value: 0 in the child, the child's PID in the parent (or -1 on failure in the parent, with no child created).",
    idealAnswer:
      "fork() essentially clones the calling process: same code, same data (via copy-on-write pages, not an actual full copy), same open files, but a brand-new PID and PCB. Both the parent and the child then continue running from the exact same point in the code, and the only way the program can tell them apart is the return value of fork() itself — 0 means 'I'm the child,' a positive PID means 'I'm the parent, and this is my child's PID.'",
    interviewerExpectations: [
      "Mentions copy-on-write, not naive full memory duplication",
      "Correctly states the three return-value cases",
      "Understands both processes resume from the same point",
    ],
    followUpQuestions: [
      "Why is copy-on-write used instead of an eager copy?",
      "What happens to open file descriptors after fork()?",
      "How does exec() interact with a freshly forked child (the classic fork+exec pattern)?",
    ],
    commonMistakes: [
      "Saying fork() immediately copies all memory (ignoring copy-on-write)",
      "Getting the return-value semantics backwards",
    ],
    discussionPoints: ["Copy-on-write", "fork+exec pattern", "File descriptor sharing"],
  },
  {
    id: "processes-iv-4",
    question: "What is a zombie process and why can too many of them be a problem?",
    difficulty: "Medium",
    detailedAnswer:
      "A zombie is a process that has finished executing (called exit()) but whose parent hasn't yet called wait()/waitpid() to read its exit status, so its PCB entry — including PID, exit code, and resource usage stats — is kept around by the kernel. A single zombie is harmless, but if a long-running parent (like a poorly written server that forks workers) never reaps its children, zombies accumulate and can exhaust the finite PID space or process table slots, effectively causing a resource leak even though the zombie itself uses almost no memory.",
    idealAnswer:
      "It's a process that's done running but is still occupying a slot in the process table because its exit status hasn't been collected. The fix is straightforward — the parent needs to call wait() (or set up a SIGCHLD handler that reaps automatically) — but if that never happens, you slowly leak PIDs and process-table entries, which is a real production bug I'd want to check for with `ps aux | grep Z` if I saw process-table exhaustion symptoms.",
    interviewerExpectations: [
      "Correct definition (exited but not reaped)",
      "Understands it's a lightweight-but-real resource leak, not a 'stuck' process",
      "Knows the fix: wait()/waitpid() or SIGCHLD handling",
    ],
    followUpQuestions: [
      "How would you detect zombie processes on a live system?",
      "What's the difference between a zombie and an orphan?",
      "Can you kill a zombie process directly with kill -9?",
    ],
    commonMistakes: [
      "Confusing zombie with a hung/frozen process",
      "Not knowing the fix involves the parent, not the zombie itself",
    ],
    discussionPoints: ["Process table exhaustion", "SIGCHLD", "wait()/waitpid()"],
  },
  {
    id: "processes-iv-5",
    question: "Your web server forks a new worker process per incoming request. Under high load you notice memory usage spiking far more than expected. How would you investigate, and what OS-level concepts explain what's happening?",
    difficulty: "Hard",
    detailedAnswer:
      "First I'd check whether copy-on-write is actually being preserved — if the parent process touches a lot of its own memory (e.g. logging, large in-memory caches) between forks, or if workers write to large shared data structures, COW pages get duplicated, multiplying real memory usage per worker. I'd inspect per-process RSS vs PSS (proportional set size, which accounts for shared pages) using tools like smem or /proc/[pid]/smaps to see how much memory is genuinely private per worker versus shared. I'd also check whether the fork-per-request model itself is the issue — process creation is expensive (full PCB, memory mapping setup, TLB flush effects), so at high request rates a process pool / pre-fork model or switching to a thread-based or event-driven (async I/O) architecture would reduce both memory and creation overhead.",
    idealAnswer:
      "I'd start by distinguishing real per-worker memory from shared copy-on-write pages using PSS instead of RSS, since RSS double-counts shared memory across every worker. If PSS shows genuinely high private memory, I'd look for what's touching memory between the fork and the request handling (a large cache, logging buffers) that's breaking copy-on-write sharing. Separately, I'd question the architecture itself — forking a full OS process per request is expensive both in memory and creation latency, and at scale most production systems move to a pre-forked worker pool (like Gunicorn/Unicorn) or a threaded/event-loop model (like Node.js or async workers) specifically to avoid this cost.",
    interviewerExpectations: [
      "Distinguishes RSS vs PSS / understands copy-on-write breakage",
      "Proposes concrete diagnostic tools, not just theory",
      "Connects the OS concept back to an architectural recommendation",
    ],
    followUpQuestions: [
      "What's the difference between RSS and PSS?",
      "Would switching to threads instead of processes fix this? What would you give up?",
      "How does a pre-fork worker pool (like Gunicorn) avoid this problem?",
    ],
    commonMistakes: [
      "Jumping straight to 'add more RAM' without diagnosing the cause",
      "Not knowing that fork-per-request has real, measurable overhead",
    ],
    discussionPoints: ["Copy-on-write breakage", "RSS vs PSS", "Process pool architectures", "Fork cost vs threads"],
    scenarioBased: true,
  },
];

export default processesInterviewQuestions;
