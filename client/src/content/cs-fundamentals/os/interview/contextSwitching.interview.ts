// src/content/cs-fundamentals/os/interview/contextSwitching.interview.ts

import type { InterviewQuestion } from "@/types";

const contextSwitchingInterviewQuestions: InterviewQuestion[] = [
  {
    id: "cs-iv-1",
    question: "What exactly happens during a context switch?",
    difficulty: "Easy",
    detailedAnswer:
      "The OS saves the currently running process/thread's CPU state (program counter, registers, stack pointer) into its PCB, updates its process state, invokes the scheduler to pick the next process to run, loads that process's saved state from its PCB back into the CPU, and (for a process switch, not a thread switch) updates memory management state like the page table base register, which can trigger a TLB flush.",
    idealAnswer:
      "It's a four-step handoff: save the outgoing process's registers and program counter to its PCB, ask the scheduler who runs next, load that process's saved registers back into the CPU, and if it's a different process (not just a different thread of the same one) also switch page tables, which invalidates the TLB and costs extra cycles as the new process's memory translations get re-cached.",
    interviewerExpectations: [
      "Mentions PCB as the save/restore location",
      "Names the scheduler's role",
      "Distinguishes process switch (page table change) from thread switch",
    ],
    followUpQuestions: [
      "Why is a thread switch cheaper than a process switch?",
      "What triggers a context switch?",
      "Roughly how expensive is a context switch (order of magnitude)?",
    ],
    commonMistakes: ["Describing it vaguely as 'the OS switches processes' without naming what state moves"],
    discussionPoints: ["PCB", "TLB flush", "Scheduler invocation"],
  },
  {
    id: "cs-iv-2",
    question: "Why is a thread context switch cheaper than a process context switch?",
    difficulty: "Medium",
    detailedAnswer:
      "Threads of the same process share the address space, so switching between them only requires saving/restoring registers, the program counter, and the stack pointer — no page table switch is needed, and the TLB (which caches virtual-to-physical address translations) stays valid. A process switch, by contrast, must also swap page tables, invalidating the TLB and forcing the new process to re-populate it via page faults on next access, which is a real and measurable cost.",
    idealAnswer:
      "Because threads in the same process already share the exact same memory mappings, a thread switch is just a register/stack swap. A process switch has to additionally change the page table base register, which invalidates the TLB — so the next several memory accesses in the newly scheduled process incur extra translation lookups until the TLB warms back up. That's the concrete reason thread switches are consistently cheaper.",
    interviewerExpectations: [
      "Correctly identifies the TLB/page table as the key cost difference",
      "Doesn't just say 'threads are lighter' without explaining why",
    ],
    followUpQuestions: [
      "What is a TLB and what does it cache?",
      "How would you measure context switch cost on a real system?",
      "Does this cost difference matter for a highly threaded server application?",
    ],
    commonMistakes: ["Vague answer without mentioning TLB or page tables specifically"],
    discussionPoints: ["TLB", "Page table base register", "Address translation cost"],
  },
  {
    id: "cs-iv-3",
    question: "How would you measure or reason about context switch overhead on a real production system?",
    difficulty: "Hard",
    detailedAnswer:
      "On Linux, tools like `vmstat` (the 'cs' column), `pidstat -w`, or `perf sched` can report context switches per second system-wide or per-process. High voluntary context switches usually indicate lots of blocking I/O or lock contention; high involuntary context switches indicate CPU contention (too many runnable processes competing for cores, or too-aggressive preemption). I'd correlate this with application-level latency metrics — if p99 latency spikes correlate with involuntary switch spikes, that points to CPU oversubscription rather than an application bug, and the fix might be reducing thread pool size, pinning critical threads to dedicated cores, or reducing the number of competing processes rather than optimizing application code.",
    idealAnswer:
      "I'd start with `vmstat 1` or `pidstat -w` to see the raw context-switch rate, then split voluntary vs involuntary switches — voluntary usually means the process is blocking a lot (I/O, lock waits), involuntary means the scheduler is preempting it because too many things want the CPU. If I saw high involuntary switches correlating with latency spikes, I'd suspect CPU oversubscription — too many threads/processes for the available cores — and look at reducing thread pool sizes or using core pinning for latency-sensitive work, rather than assuming it's an application-level bug.",
    interviewerExpectations: [
      "Names concrete diagnostic tools, not just theory",
      "Distinguishes voluntary vs involuntary switches and what each implies",
      "Connects the metric to an actionable fix",
    ],
    followUpQuestions: [
      "What's the difference between a voluntary and involuntary context switch?",
      "How would you decide if a service is CPU oversubscribed?",
      "What's core pinning and when would you use it?",
    ],
    commonMistakes: [
      "Only naming a tool without explaining what the numbers mean",
      "Not distinguishing voluntary from involuntary switches",
    ],
    discussionPoints: ["vmstat/pidstat", "Voluntary vs involuntary switches", "CPU oversubscription", "Core pinning"],
    scenarioBased: true,
  },
  {
    id: "cs-iv-4",
    question: "Does increasing the number of threads in an application always improve throughput? Why or why not?",
    difficulty: "Medium",
    detailedAnswer:
      "No — beyond the number of available CPU cores (adjusted for how much of each thread's time is spent blocked on I/O), additional threads add context-switching and scheduling overhead without adding real parallel execution capacity, and can actually reduce throughput past a certain point (a phenomenon sometimes called thread thrashing). For CPU-bound work, the sweet spot is usually close to the core count; for I/O-bound work, more threads than cores can help because threads spend much of their time blocked, not competing for CPU, but even then there's a point of diminishing (and eventually negative) returns from memory and scheduling overhead.",
    idealAnswer:
      "Not always — it depends on whether the work is CPU-bound or I/O-bound. For CPU-bound work, once you have as many active threads as cores, adding more just adds context-switch overhead without more real parallelism. For I/O-bound work, more threads than cores can genuinely help because most of them are blocked waiting on I/O rather than competing for CPU time — but even there, too many threads eventually hurts from memory overhead (each thread's stack) and scheduler overhead.",
    interviewerExpectations: [
      "Distinguishes CPU-bound vs I/O-bound reasoning",
      "Names the mechanism (context-switch/scheduling overhead) for why more isn't always better",
    ],
    followUpQuestions: [
      "How would you pick an initial thread pool size for a CPU-bound service?",
      "What's a reasonable thread pool sizing heuristic for I/O-bound work?",
      "How does this relate to Amdahl's Law?",
    ],
    commonMistakes: ["Giving a flat 'yes, more threads = more throughput' answer without any caveat"],
    discussionPoints: ["CPU-bound vs I/O-bound", "Thread pool sizing", "Diminishing returns"],
  },
];

export default contextSwitchingInterviewQuestions;
