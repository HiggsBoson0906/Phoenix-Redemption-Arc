// src/content/cs-fundamentals/os/oa/schedulingAlgorithms.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const schedulingAlgorithmsRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "FCFS: run in arrival order, non-preemptive; suffers the convoy effect.",
    "SJF/SRTF: shortest burst first; minimizes average waiting time but needs burst-time knowledge.",
    "Priority scheduling: needs aging to prevent starvation of low-priority processes.",
    "Round Robin: fixed time quantum, preemptive, fair; quantum size is the key tuning knob.",
    "MLFQ: multiple queues, processes migrate based on observed CPU/I/O behavior.",
  ],
  importantFacts: [
    "Waiting time = Start time − Arrival time (accumulated if preempted multiple times).",
    "Turnaround time = Completion time − Arrival time.",
    "Response time = Time of first CPU burst − Arrival time (matters most for interactive systems).",
  ],
  formulas: [
    "Average Waiting Time = (Σ Waiting time of all processes) / n",
    "Average Turnaround Time = (Σ Turnaround time of all processes) / n",
    "Turnaround Time = Waiting Time + Burst Time",
  ],
  shortcuts: [
    "For FCFS, just simulate arrival order directly — no need for a Gantt chart shortcut, arrival order IS the run order.",
    "For SJF, at every decision point pick the shortest burst among processes that have already arrived.",
  ],
};

export const schedulingAlgorithmsOAQuestions: OAQuestion[] = [
  {
    id: "sched-oa-1",
    question:
      "Given processes P1(Arrival=0, Burst=6), P2(Arrival=1, Burst=8), P3(Arrival=2, Burst=7), P4(Arrival=3, Burst=3), scheduled FCFS, what is the average waiting time?",
    options: ["5.75", "8.75", "6.25", "10.0"],
    correctAnswerIndex: 1,
    explanation:
      "FCFS order = P1,P2,P3,P4. P1: 0-6 (wait 0). P2: starts at 6 (arrived at 1), ends 14 (wait 5). P3: starts at 14 (arrived at 2), ends 21 (wait 12). P4: starts at 21 (arrived at 3), ends 24 (wait 18). Average = (0+5+12+18)/4 = 8.75.",
    difficulty: "Medium",
    topicTags: ["FCFS", "numerical"],
    companyStyle: "TCS NQT",
  },
  {
    id: "sched-oa-2",
    question:
      "Using the same processes as above — P1(AT=0,BT=6), P2(AT=1,BT=8), P3(AT=2,BT=7), P4(AT=3,BT=3) — scheduled with non-preemptive SJF, what is the average waiting time?",
    options: ["8.75", "5.0", "6.25", "7.5"],
    correctAnswerIndex: 2,
    explanation:
      "At t=0 only P1 is available, so it runs 0-6 (wait 0). At t=6, P2/P3/P4 have all arrived; shortest is P4(BT3), runs 6-9 (wait 6-3=3). At t=9, remaining P2(BT8),P3(BT7); shortest is P3, runs 9-16 (wait 9-2=7). Finally P2 runs 16-24 (wait 16-1=15). Average = (0+3+7+15)/4 = 6.25.",
    difficulty: "Hard",
    topicTags: ["SJF", "numerical"],
    companyStyle: "Amazon OA",
  },
  {
    id: "sched-oa-3",
    question: "What is the 'convoy effect' in CPU scheduling?",
    options: [
      "Processes moving in a synchronized line",
      "A long CPU-bound process causing all shorter processes behind it to wait, under FCFS",
      "Multiple CPUs failing simultaneously",
      "A deadlock between two processes",
    ],
    correctAnswerIndex: 1,
    explanation: "The convoy effect describes how one long process at the head of a FCFS queue delays every shorter process queued behind it.",
    difficulty: "Easy",
    topicTags: ["FCFS", "convoy effect"],
  },
  {
    id: "sched-oa-4",
    question: "Which scheduling algorithm is provably optimal for minimizing average waiting time (given accurate burst-time knowledge)?",
    options: ["FCFS", "Round Robin", "Shortest Job First", "Priority Scheduling"],
    correctAnswerIndex: 2,
    explanation: "SJF is mathematically optimal for average waiting time among non-preemptive algorithms, assuming burst times are known in advance.",
    difficulty: "Medium",
    topicTags: ["SJF"],
  },
  {
    id: "sched-oa-5",
    question: "What technique prevents starvation in priority scheduling?",
    options: ["Aging", "Paging", "Segmentation", "Caching"],
    correctAnswerIndex: 0,
    explanation: "Aging gradually increases the priority of processes that have waited a long time, guaranteeing they eventually run.",
    difficulty: "Easy",
    topicTags: ["priority scheduling", "starvation"],
  },
  {
    id: "sched-oa-6",
    question: "In Round Robin scheduling, what happens if the time quantum is set extremely large?",
    options: [
      "The algorithm behaves like SJF",
      "The algorithm effectively degenerates into FCFS",
      "Starvation becomes guaranteed",
      "Context switches increase dramatically",
    ],
    correctAnswerIndex: 1,
    explanation: "If the quantum exceeds every process's burst time, each process runs to completion before the next gets a turn — identical to FCFS behavior.",
    difficulty: "Medium",
    topicTags: ["round robin", "quantum"],
  },
  {
    id: "sched-oa-7",
    question: "Which metric measures the time between a process's arrival and its FIRST time on the CPU?",
    options: ["Turnaround time", "Waiting time", "Response time", "Burst time"],
    correctAnswerIndex: 2,
    explanation: "Response time specifically measures time-to-first-execution, which is what matters most for interactive system feel.",
    difficulty: "Easy",
    topicTags: ["metrics"],
  },
  {
    id: "sched-oa-8",
    question: "SRTF (Shortest Remaining Time First) is best described as:",
    options: [
      "The non-preemptive version of SJF",
      "The preemptive version of SJF, which can interrupt a running process if a shorter one arrives",
      "A synonym for Round Robin",
      "A priority-based algorithm unrelated to burst time",
    ],
    correctAnswerIndex: 1,
    explanation: "SRTF preempts the currently running process whenever a newly arrived process has a shorter remaining burst time.",
    difficulty: "Medium",
    topicTags: ["SRTF"],
  },
  {
    id: "sched-oa-9",
    question: "What does Turnaround Time equal, in terms of Waiting Time and Burst Time?",
    options: [
      "Turnaround Time = Waiting Time − Burst Time",
      "Turnaround Time = Waiting Time + Burst Time",
      "Turnaround Time = Burst Time only",
      "Turnaround Time = Arrival Time + Burst Time",
    ],
    correctAnswerIndex: 1,
    explanation: "By definition, a process's total time in the system equals how long it waited plus how long it actually ran.",
    difficulty: "Easy",
    topicTags: ["formulas"],
  },
  {
    id: "sched-oa-10",
    question: "A Multilevel Feedback Queue (MLFQ) scheduler primarily distinguishes itself from a plain Multilevel Queue by:",
    options: [
      "Using only one queue",
      "Allowing processes to move between queues based on their observed behavior",
      "Not using priorities at all",
      "Only working for single-core systems",
    ],
    correctAnswerIndex: 1,
    explanation: "MLFQ's key feature is dynamically demoting/promoting processes between queues based on how they actually behave (CPU-hungry vs I/O-bound).",
    difficulty: "Medium",
    topicTags: ["MLFQ"],
  },
  {
    id: "sched-oa-11",
    question: "Which real-time scheduling algorithm assigns the highest priority to the task with the closest deadline?",
    options: ["Round Robin", "Earliest Deadline First (EDF)", "FCFS", "SJF"],
    correctAnswerIndex: 1,
    explanation: "EDF dynamically prioritizes tasks by how soon their deadline is, which is standard in real-time scheduling theory.",
    difficulty: "Hard",
    topicTags: ["real-time scheduling"],
  },
];
