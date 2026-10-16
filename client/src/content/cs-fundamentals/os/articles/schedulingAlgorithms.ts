// src/content/cs-fundamentals/os/articles/schedulingAlgorithms.ts

import type { Article } from "@/types";

const schedulingAlgorithmsArticle: Article = {
  slug: "scheduling-algorithms",
  title: "Scheduling Algorithms",
  summary:
    "CPU scheduling algorithms decide which ready process gets the CPU next — the policy layer sitting on top of the context-switching mechanism.",
  readingTimeMins: 10,
  beginnerExplanation:
    "If context switching is the mechanic of swapping who's using the CPU, scheduling is the decision of who goes next — like a queue at a coffee shop where the barista (the CPU) has to pick which order (process) to make first. Different queuing policies (first-come-first-served, shortest order first, VIP priority) give very different customer experiences, which is exactly why OSes offer different scheduling algorithms for different goals.",
  detailedBreakdown:
    "First-Come-First-Served (FCFS): processes run strictly in arrival order, non-preemptive. Simple but suffers from the convoy effect — a long process at the front makes everyone behind it wait, tanking average waiting time.\n\nShortest Job First (SJF): runs whichever ready process has the shortest predicted burst time; provably optimal for minimizing average waiting time, but requires knowing burst times in advance (usually estimated) and can starve long processes. Its preemptive variant, Shortest Remaining Time First (SRTF), can interrupt a running process if a shorter one arrives.\n\nPriority Scheduling: each process gets a priority number; the highest-priority ready process runs next. Simple and flexible, but risks starvation for low-priority processes — commonly fixed with aging, where a waiting process's priority gradually increases the longer it waits.\n\nRound Robin (RR): each process gets a fixed time quantum in circular order; preemptive and fair, the backbone of most interactive time-sharing systems. Quantum size is a critical tuning knob — too large and RR degenerates toward FCFS; too small and context-switch overhead dominates.\n\nMultilevel Queue / Multilevel Feedback Queue (MLFQ): processes are split into multiple queues (e.g. system, interactive, batch) each with its own scheduling policy, and MLFQ additionally lets processes move between queues based on observed behavior (a CPU-hogging process gets demoted to a lower-priority, longer-quantum queue; an I/O-bound process that keeps yielding stays high-priority) — this is the design most real-world general-purpose OS schedulers (Linux's CFS is a related but distinct evolution) approximate in spirit.\n\nKey scheduling metrics: waiting time (time in ready queue), turnaround time (completion − arrival), response time (first CPU burst − arrival, critical for interactive systems), and throughput (processes completed per unit time). Algorithms are usually compared and chosen based on which metric matters most for the workload.",
  realWorldExamples:
    "Linux's Completely Fair Scheduler (CFS) approximates giving every runnable task an equal share of CPU time using a red-black tree ordered by 'virtual runtime.' Windows uses a multilevel feedback-queue-style priority scheduler with dynamic priority boosts for foreground/interactive applications. Real-time OSes (used in cars, medical devices) use deadline-based algorithms like Earliest Deadline First (EDF) or Rate Monotonic Scheduling, prioritizing predictability over average-case efficiency.",
  useCases: [
    "Balancing fairness, responsiveness, and throughput across many competing processes",
    "Giving interactive/foreground applications snappy response times on time-sharing systems",
    "Meeting hard timing deadlines in real-time systems (industrial control, avionics)",
  ],
  advantages: [
    "Well-chosen scheduling dramatically improves perceived responsiveness and system fairness",
    "Priority-based approaches let critical work get CPU time ahead of background work",
  ],
  disadvantages: [
    "No single algorithm is optimal for every metric simultaneously — you trade fairness against throughput against responsiveness",
    "Naive priority scheduling can starve low-priority work without a fix like aging",
    "Getting quantum size or priority tuning wrong can hurt more than it helps",
  ],
  commonMisconceptions: [
    "\"SJF is always achievable in practice\" — it requires knowing burst times in advance, which real systems only estimate.",
    "\"Round Robin is always fair in outcome, not just in CPU-time share\" — I/O-bound processes can still feel sluggish under naive RR since it doesn't account for their different needs, which is exactly what MLFQ tries to fix.",
    "\"Higher priority always means better response time under every scheduler\" — under RR with no priority levels, priority doesn't even factor in; it's algorithm-dependent.",
  ],
  interviewPerspective:
    "This is one of the most heavily tested OS topics — be ready to compute average waiting/turnaround time by hand for FCFS, SJF, and RR given a small process table (arrival time, burst time), and to articulate the trade-offs between algorithms, not just define them. Convoy effect and starvation are near-certain follow-up terms.",
  oaPerspective:
    "Very common OA question type: given 3-5 processes with arrival and burst times, compute average waiting/turnaround time for a named algorithm, or a Gantt chart is given and you identify the algorithm. Practice these by hand — they're mechanical once you know the method but easy to mess up under time pressure.",
  keyTakeaways: [
    "FCFS is simple but suffers the convoy effect; SJF/SRTF minimizes average waiting time but needs burst-time estimates.",
    "Priority scheduling needs aging to avoid starving low-priority processes.",
    "Round Robin is the fairness/interactivity workhorse; quantum size is the critical tuning parameter.",
    "MLFQ approximates 'the right algorithm for the right kind of process' by letting processes migrate between queues based on behavior.",
  ],
  summaryClosing:
    "No scheduling algorithm wins on every metric — the practical skill is matching an algorithm's trade-offs (fairness, responsiveness, throughput, starvation-risk) to the workload, which is exactly why real OS schedulers like Linux's CFS or MLFQ-style designs blend multiple ideas rather than using one textbook algorithm in pure form.",
  relatedTopics: ["Processes", "Context Switching", "Deadlocks"],
  furtherReading: [
    { label: "OSTEP: Scheduling chapters (MLFQ, CFS)", note: "Detailed walkthroughs with worked numeric examples." },
  ],
};

export default schedulingAlgorithmsArticle;
