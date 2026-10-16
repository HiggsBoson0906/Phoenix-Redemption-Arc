// src/content/cs-fundamentals/os/articles/contextSwitching.ts

import type { Article } from "@/types";

const contextSwitchingArticle: Article = {
  slug: "context-switching",
  title: "Context Switching",
  summary:
    "Context switching is how the OS pauses one process/thread and resumes another on the same CPU core — the mechanism that makes multitasking possible on limited hardware.",
  readingTimeMins: 7,
  beginnerExplanation:
    "Imagine reading two books at once by reading a page of one, bookmarking it, then reading a page of the other. You're not reading them simultaneously — you're switching fast enough that it feels concurrent. That bookmark is exactly what the OS saves during a context switch: enough state (the 'context') to resume a process later exactly where it left off.",
  detailedBreakdown:
    "A context switch happens when the CPU moves from executing one process/thread to another. The OS must: (1) save the current process's context — CPU registers, program counter, stack pointer — into its PCB; (2) update the process's state (e.g. Running → Ready or Waiting); (3) select the next process to run via the scheduler; (4) load that process's saved context from its PCB back into the CPU registers; (5) update memory management state, like switching page tables, which can trigger a TLB flush since the old process's cached address translations are no longer valid.\n\nContext switches happen for several reasons: a time-slice/quantum expiring (preemptive scheduling), a higher-priority process becoming ready, a process blocking on I/O or a synchronization primitive, or an interrupt/system call needing kernel attention. Note that thread switches within the same process are cheaper than process switches — since threads share an address space, there's no page table switch or TLB flush needed, only register/stack state changes.\n\nContext switching is pure overhead from the CPU's perspective — no useful application work happens during the switch itself. This is why the OS tries to minimize switch frequency (larger time quanta) while balancing responsiveness (smaller quanta feel more interactive but switch more often).",
  realWorldExamples:
    "Every time you alt-tab between a dozen open apps that all appear to run 'simultaneously' on a 4-8 core laptop, the OS is context-switching dozens of times per second per core. Real-time systems (like flight control software) are extremely sensitive to context-switch latency and jitter, which is why RTOS schedulers are designed for bounded, predictable switch times.",
  useCases: [
    "Enabling time-sharing so many processes appear to run concurrently on limited CPU cores",
    "Letting the OS immediately respond to higher-priority work (e.g. an interrupt) by preempting lower-priority work",
    "Allowing a blocked process to yield the CPU to useful work instead of spinning idle",
  ],
  advantages: [
    "Makes multitasking and responsive multi-user systems possible on finite hardware",
    "Enables priority-based scheduling — urgent work can preempt less urgent work",
  ],
  disadvantages: [
    "Pure overhead — no application progress happens during the switch itself",
    "Frequent switching hurts cache/TLB locality, since a new process's working set displaces the old one's cached data",
    "Too-frequent switching (thrashing) can reduce overall throughput despite feeling 'responsive'",
  ],
  commonMisconceptions: [
    "\"Context switches are free/instant\" — they cost real CPU cycles (typically microseconds) for register save/restore plus indirect costs from cache/TLB pollution.",
    "\"Thread switches and process switches cost the same\" — thread switches within a process skip the page table switch and TLB flush, making them meaningfully cheaper.",
    "\"More context switches always mean better responsiveness\" — beyond a point, switching overhead reduces actual throughput (this is the trade-off behind choosing a scheduling quantum).",
  ],
  interviewPerspective:
    "Interviewers ask this to see if you understand *why* multitasking has overhead and can name what specifically makes it expensive (register save/restore, TLB flush, cache pollution) — not just that 'the OS switches between processes.' Comparing thread-switch cost to process-switch cost is a very common differentiator question.",
  oaPerspective:
    "OA questions test what triggers a context switch (interrupt, syscall, time quantum expiry, higher-priority arrival) and what state must be saved/restored. Expect a direct MCQ on 'which of these is NOT part of a context switch.'",
  keyTakeaways: [
    "A context switch saves the current process's state and restores another's so execution can resume later exactly where it left off.",
    "Triggers: time quantum expiry, I/O blocking, higher-priority process arrival, interrupts/syscalls.",
    "Thread switches (same process) are cheaper than process switches because they skip page table/TLB changes.",
    "Context switching is pure overhead — it's the cost paid for multitasking, not useful work itself.",
  ],
  summaryClosing:
    "Context switching is the low-level mechanism underneath every scheduling decision the OS makes — understanding its real cost is what connects the abstract idea of 'the OS runs many things at once' to why scheduling algorithms (next topic) are designed the way they are.",
  relatedTopics: ["Processes", "Threads", "Scheduling Algorithms"],
  furtherReading: [
    { label: "OSTEP: Scheduling: Introduction", note: "Explains the mechanism (context switch) before the policy (scheduling algorithm)." },
  ],
};

export default contextSwitchingArticle;
