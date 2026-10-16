// src/content/cs-fundamentals/os/interview/schedulingAlgorithms.interview.ts

import type { InterviewQuestion } from "@/types";

const schedulingAlgorithmsInterviewQuestions: InterviewQuestion[] = [
  {
    id: "sched-iv-1",
    question: "Compare FCFS, SJF, and Round Robin scheduling. When would you use each?",
    difficulty: "Medium",
    detailedAnswer:
      "FCFS is the simplest — strictly arrival order, non-preemptive — good for batch systems where fairness of order matters more than efficiency, but it suffers the convoy effect where one long job delays everyone behind it. SJF minimizes average waiting time and is provably optimal given accurate burst estimates, making it good for batch scheduling where job lengths are predictable (e.g. compile jobs), but it requires knowing burst times ahead of time and can starve long jobs. Round Robin is preemptive with a fixed time quantum, giving every process a fair, bounded-latency share of the CPU, making it the standard choice for interactive/time-sharing systems where responsiveness matters more than raw average-case efficiency.",
    idealAnswer:
      "I'd pick FCFS only for simple batch pipelines where job order fairness matters and jobs are roughly similar length. SJF is great when you can estimate burst times (like a compile farm) and want to minimize average wait, but it's unusable for truly interactive systems since you can't predict how long a user's session will need, and it can starve long jobs. Round Robin is the default for interactive time-sharing systems — it guarantees every process gets CPU time within a bounded window, which is what makes a desktop OS feel responsive.",
    interviewerExpectations: [
      "States a genuine use case for each rather than just definitions",
      "Names each algorithm's characteristic weakness (convoy effect / starvation / quantum tuning)",
    ],
    followUpQuestions: [
      "How would you choose a Round Robin quantum size?",
      "What is starvation and how does aging fix it?",
      "How does Linux's CFS differ from a textbook Round Robin?",
    ],
    commonMistakes: ["Reciting definitions without connecting them to when you'd actually pick each one"],
    discussionPoints: ["Convoy effect", "Starvation", "Quantum tuning", "Interactive vs batch workloads"],
  },
  {
    id: "sched-iv-2",
    question: "How would you choose the time quantum for a Round Robin scheduler, and what happens if you get it wrong?",
    difficulty: "Medium",
    detailedAnswer:
      "The quantum trades off responsiveness against overhead: too small and the system spends a large fraction of its time context-switching rather than doing useful work (context-switch overhead can dominate if the quantum approaches the switch cost itself); too large and Round Robin degenerates toward FCFS, reintroducing the convoy effect and hurting interactive responsiveness. A common rule of thumb is choosing a quantum where 80% of CPU bursts are shorter than the quantum, so most processes finish their burst within one turn while the system still preempts long-running processes reasonably often.",
    idealAnswer:
      "It's a direct trade-off: too short and you burn CPU time on context switches instead of real work; too long and it starts behaving like FCFS, so a long process can hog the CPU and hurt responsiveness for everyone else. A practical target is picking a quantum where most typical bursts finish within one or two turns — often cited as around 10-100ms in real systems, and Linux's CFS actually sidesteps fixed quanta altogether by using a dynamically computed 'target latency' divided fairly among runnable tasks.",
    interviewerExpectations: [
      "Explains both failure directions (too small / too large), not just one",
      "Gives a reasoning heuristic, not just a number",
    ],
    followUpQuestions: [
      "What does Linux's CFS do instead of a fixed quantum?",
      "How does quantum size interact with I/O-bound vs CPU-bound processes?",
      "What's the relationship between quantum size and context-switch overhead specifically?",
    ],
    commonMistakes: ["Only mentioning one failure direction (e.g. only 'too small is bad')"],
    discussionPoints: ["Quantum sizing trade-off", "Context-switch overhead", "CFS's dynamic approach"],
  },
  {
    id: "sched-iv-3",
    question: "What is starvation in scheduling, and how does priority aging solve it?",
    difficulty: "Medium",
    detailedAnswer:
      "Starvation happens when a process never gets scheduled because there's always some other process with higher priority (or a shorter job, under SJF) ready to run instead — the process is technically ready but perpetually passed over. Aging fixes this by gradually increasing a waiting process's priority the longer it sits in the ready queue, so eventually even a low-priority process's effective priority surpasses everything else and it gets scheduled — guaranteeing forward progress (eventual fairness) without abandoning priority-based scheduling altogether.",
    idealAnswer:
      "Starvation is when a low-priority (or long) process keeps getting skipped because something else always looks more urgent to the scheduler — technically ready, but never actually run. Aging fixes it by slowly bumping up a waiting process's priority the longer it's been waiting, so no matter how low its starting priority, it eventually becomes the highest-priority ready process and gets its turn — it's essentially a built-in fairness guarantee layered on top of priority scheduling.",
    interviewerExpectations: ["Correct definition of starvation", "Clear mechanism for how aging counters it"],
    followUpQuestions: [
      "Can SJF also cause starvation? How?",
      "How would you tune the aging rate?",
      "Is starvation possible under pure Round Robin? Why not?",
    ],
    commonMistakes: ["Confusing starvation with deadlock — they're different problems"],
    discussionPoints: ["Priority inversion vs starvation (distinct concepts)", "Aging mechanism", "Fairness guarantees"],
  },
  {
    id: "sched-iv-4",
    question: "You're designing a scheduler for a mixed workload of interactive UI tasks, background batch jobs, and a few real-time audio processing threads. How would you approach it?",
    difficulty: "Hard",
    detailedAnswer:
      "This calls for a multilevel approach rather than one flat algorithm: real-time audio needs strict, bounded-latency guarantees, so it belongs in a dedicated real-time priority class (e.g. Linux's SCHED_FIFO/SCHED_RR real-time policies) that always preempts everything else and is scheduled with deadline-awareness (missing an audio deadline causes an audible glitch, which is worse than most other failures). Interactive UI tasks want low response time but not hard real-time guarantees — they fit well in a high-priority, small-quantum Round Robin or MLFQ-style queue that rewards processes which yield quickly (typical of UI event handling). Background batch jobs should run in a low-priority queue with a larger quantum and can tolerate being starved briefly, though aging should still apply to guarantee eventual progress. This is essentially the design philosophy behind MLFQ combined with a separate real-time class, which is exactly what production OSes like Linux actually implement.",
    idealAnswer:
      "I wouldn't use a single algorithm — I'd separate them into priority classes. The real-time audio threads need a dedicated real-time scheduling class with strict priority that preempts everything else, similar to Linux's SCHED_FIFO, because missing a deadline there is audibly bad. Interactive UI tasks go into a high-priority, short-quantum queue so they stay snappy. Background batch work goes into a low-priority, larger-quantum queue, with aging so it's not starved indefinitely. That's basically a multilevel feedback queue design with a hard real-time tier bolted on top, which mirrors what real operating systems actually do.",
    interviewerExpectations: [
      "Recognizes this needs multiple scheduling classes, not one algorithm",
      "Correctly prioritizes real-time work above interactive above batch",
      "Mentions aging or a fairness mechanism for the lowest tier",
    ],
    followUpQuestions: [
      "What's the difference between SCHED_FIFO and SCHED_RR in Linux?",
      "How would you prevent the real-time class from starving everything else if misconfigured?",
      "How does priority inversion become a risk here, and how would you mitigate it (priority inheritance)?",
    ],
    commonMistakes: [
      "Proposing one single algorithm for all three workload types",
      "Not recognizing the real-time class needs strict preemption guarantees",
    ],
    discussionPoints: ["Multilevel queues", "Real-time scheduling classes", "Priority inversion & inheritance", "MLFQ design philosophy"],
    scenarioBased: true,
  },
];

export default schedulingAlgorithmsInterviewQuestions;
