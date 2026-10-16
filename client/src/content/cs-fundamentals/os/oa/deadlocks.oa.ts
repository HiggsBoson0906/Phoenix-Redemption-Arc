// src/content/cs-fundamentals/os/oa/deadlocks.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const deadlocksRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "Four Coffman conditions (ALL required for deadlock): Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
    "Breaking any ONE condition prevents deadlock.",
    "Handling strategies: Prevention, Avoidance (Banker's Algorithm), Detection + Recovery, Ignorance (ostrich algorithm).",
    "Safe state = a sequence exists where every process can eventually get its max need and finish.",
  ],
  importantFacts: [
    "Need = Max − Allocation for each process, in Banker's Algorithm.",
    "A request can only be granted if Request ≤ Need and Request ≤ Available.",
    "Deadlock detection uses a wait-for graph; a cycle in it (for single-instance resources) indicates deadlock.",
  ],
  formulas: [
    "Need[i] = Max[i] − Allocation[i]",
    "System is safe if Work can be incremented to satisfy every process's Need in some order",
  ],
};

export const deadlocksOAQuestions: OAQuestion[] = [
  {
    id: "deadlock-oa-1",
    question: "Which of the following is NOT one of the four necessary conditions for deadlock?",
    options: ["Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait"],
    correctAnswerIndex: 2,
    explanation: "The actual condition is 'No Preemption' (resources can't be forcibly taken) — 'Preemption' (allowing forced resource removal) is the opposite, and prevents deadlock rather than causing it.",
    difficulty: "Easy",
    topicTags: ["Coffman conditions"],
  },
  {
    id: "deadlock-oa-2",
    question: "A system has resources: Available = (3,3,2). A process's Need is (1,2,2). Can this process's request be granted immediately if it requests exactly its full need?",
    options: ["Yes, since Need ≤ Available in every dimension", "No, never", "Only if no other process is running", "Cannot be determined"],
    correctAnswerIndex: 0,
    explanation: "1≤3, 2≤3, 2≤2 — every dimension of Need is within Available, so the request can be granted immediately (subject to the resulting state also being safe).",
    difficulty: "Medium",
    topicTags: ["Banker's Algorithm"],
  },
  {
    id: "deadlock-oa-3",
    question:
      "Given Allocation P0=(0,1,0), P1=(2,0,0), P2=(3,0,2), P3=(2,1,1), P4=(0,0,2); Max P0=(7,5,3), P1=(3,2,2), P2=(9,0,2), P3=(2,2,2), P4=(4,3,3); Available=(3,3,2) — which is a valid safe sequence?",
    options: ["P0,P1,P2,P3,P4", "P2,P0,P1,P3,P4", "P1,P3,P4,P0,P2", "No safe sequence exists"],
    correctAnswerIndex: 2,
    explanation:
      "Need = Max−Allocation gives P0=(7,4,3), P1=(1,2,2), P2=(6,0,0), P3=(0,1,1), P4=(4,3,1). Starting Work=(3,3,2): P1's need (1,2,2) fits, Work→(5,3,2); P3's need (0,1,1) fits, Work→(7,4,3); P4's need (4,3,1) fits, Work→(7,4,5); P0's need (7,4,3) fits, Work→(7,5,5); P2's need (6,0,0) fits, Work→(10,5,7). Sequence P1,P3,P4,P0,P2 is safe.",
    difficulty: "Hard",
    topicTags: ["Banker's Algorithm", "safe sequence"],
    companyStyle: "Amazon OA",
  },
  {
    id: "deadlock-oa-4",
    question: "What is the 'ostrich algorithm' in the context of deadlock handling?",
    options: [
      "A cycle-detection algorithm named after its inventor",
      "Ignoring the possibility of deadlock entirely, assuming it's rare enough not to be worth preventing",
      "A method to preempt resources forcibly",
      "A priority-based resource allocation scheme",
    ],
    correctAnswerIndex: 1,
    explanation: "The ostrich algorithm — 'stick your head in the sand' — is what most general-purpose OSes actually do: ignore deadlocks and let a reboot/restart handle rare occurrences.",
    difficulty: "Medium",
    topicTags: ["deadlock strategies"],
  },
  {
    id: "deadlock-oa-5",
    question: "Which strategy for handling deadlock allows requests to happen but checks whether granting them could lead to an unsafe state?",
    options: ["Prevention", "Avoidance", "Detection and Recovery", "Ignorance"],
    correctAnswerIndex: 1,
    explanation: "Avoidance (e.g. Banker's Algorithm) grants requests only if the resulting state remains safe, unlike prevention which structurally forbids one of the Coffman conditions.",
    difficulty: "Medium",
    topicTags: ["deadlock strategies"],
  },
  {
    id: "deadlock-oa-6",
    question: "How can 'circular wait' be prevented structurally?",
    options: [
      "By enforcing a fixed global order in which resources must be acquired",
      "By making all resources shareable",
      "By disabling context switching",
      "By running only one process at a time",
    ],
    correctAnswerIndex: 0,
    explanation: "If every process must acquire resources in the same fixed order, a cycle in the wait-for graph becomes structurally impossible.",
    difficulty: "Medium",
    topicTags: ["deadlock prevention"],
  },
  {
    id: "deadlock-oa-7",
    question: "What data structure is commonly used for deadlock DETECTION (as opposed to avoidance)?",
    options: ["Wait-for graph", "B-tree", "Hash table", "Linked list"],
    correctAnswerIndex: 0,
    explanation: "A cycle in the wait-for graph (for single-instance resource types) directly indicates a deadlock exists.",
    difficulty: "Medium",
    topicTags: ["deadlock detection"],
  },
  {
    id: "deadlock-oa-8",
    question: "Deadlock and starvation differ in that:",
    options: [
      "They are exactly the same phenomenon",
      "Deadlock means permanent zero progress for a set of processes; starvation means a process is repeatedly delayed but the system overall may still progress",
      "Starvation only happens with more than 2 processes",
      "Deadlock only happens with I/O operations",
    ],
    correctAnswerIndex: 1,
    explanation: "Deadlock is a permanent standstill for the involved processes; starvation is indefinite postponement of one process while others continue.",
    difficulty: "Medium",
    topicTags: ["deadlock vs starvation"],
  },
  {
    id: "deadlock-oa-9",
    question: "If a request from a process exceeds its declared Max need in Banker's Algorithm, the system should:",
    options: [
      "Grant it anyway",
      "Treat it as an error condition, since it violates the process's declared maximum claim",
      "Automatically kill a random other process",
      "Ignore the Max value entirely",
    ],
    correctAnswerIndex: 1,
    explanation: "Banker's Algorithm relies on every process honestly declaring its maximum possible need upfront; a request beyond that is invalid input.",
    difficulty: "Hard",
    topicTags: ["Banker's Algorithm"],
  },
  {
    id: "deadlock-oa-10",
    question: "Recovery from a detected deadlock commonly involves:",
    options: [
      "Waiting indefinitely for the deadlock to resolve itself",
      "Killing/rolling back one or more processes, or preempting resources from them",
      "Increasing the scheduling quantum",
      "Disabling the file system",
    ],
    correctAnswerIndex: 1,
    explanation: "Once a deadlock is detected, recovery requires breaking it by terminating a 'victim' process or forcibly reclaiming (preempting) a resource.",
    difficulty: "Medium",
    topicTags: ["deadlock recovery"],
  },
];
