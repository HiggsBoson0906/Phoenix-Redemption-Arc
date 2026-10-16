// src/content/cs-fundamentals/os/interview/virtualMemory.interview.ts

import type { InterviewQuestion } from "@/types";

const virtualMemoryInterviewQuestions: InterviewQuestion[] = [
  {
    id: "vm-iv-1",
    question: "What is a page fault, and is it always a bad thing?",
    difficulty: "Medium",
    detailedAnswer:
      "A page fault is a hardware trap triggered when a process accesses a page whose page table entry says it's not currently resident in physical memory. It's not inherently an error — it's the normal mechanism demand paging uses to load pages lazily; a 'minor' fault (page exists but isn't mapped, e.g. shared/COW pages) is cheap, while a 'major' fault (page must actually be read from disk) is expensive. It only becomes a real problem when it happens excessively — repeated major faults from an oversized working set is exactly what causes thrashing.",
    idealAnswer:
      "It's a trap the hardware raises when a process touches a page that isn't currently mapped into physical memory, and the OS handles it by loading (or otherwise resolving) that page and resuming execution — so no, it's not inherently bad, it's literally how demand paging and lazy loading work. It only becomes a performance problem when major faults (requiring an actual disk read) happen very frequently, which is the definition of thrashing.",
    interviewerExpectations: [
      "Correctly frames it as a normal mechanism, not an error",
      "Distinguishes minor vs major faults if pushed",
    ],
    followUpQuestions: [
      "What's the difference between a minor and major page fault?",
      "What does the OS do step by step when handling a page fault?",
      "How would you detect excessive page faulting on a live system?",
    ],
    commonMistakes: ["Describing a page fault as always being an error/crash condition"],
    discussionPoints: ["Demand paging", "Minor vs major faults", "Thrashing"],
  },
  {
    id: "vm-iv-2",
    question: "Explain Belady's Anomaly. Which replacement algorithm suffers from it?",
    difficulty: "Hard",
    detailedAnswer:
      "Belady's Anomaly is the counter-intuitive result that, for some reference strings, increasing the number of available physical frames can actually increase the number of page faults under FIFO replacement — the opposite of what you'd expect from having more memory. It happens because FIFO doesn't account for how recently or frequently a page is actually used, only when it was loaded, so adding frames changes eviction timing in a way that isn't guaranteed to be monotonically beneficial. LRU (and Optimal) don't suffer from this because they possess the 'stack property' — the set of pages held with N frames is always a subset of the pages held with N+1 frames, guaranteeing more frames can never increase fault count.",
    idealAnswer:
      "It's the surprising finding that under FIFO, giving a process MORE physical frames can sometimes cause MORE page faults, not fewer — which breaks the intuition that more memory should only ever help. It happens specifically to FIFO because it evicts purely based on load-time order, not actual usage, so it lacks what's called the stack property. LRU and Optimal both have the stack property — the pages resident with N frames are always a subset of what's resident with N+1 — which mathematically guarantees they can never get worse with more memory, so they're immune to this anomaly.",
    interviewerExpectations: [
      "Correctly states it's specific to FIFO, not a universal replacement-algorithm property",
      "Bonus: mentions the stack property as WHY LRU/Optimal are immune",
    ],
    followUpQuestions: [
      "Walk through a small example (reference string) demonstrating the anomaly.",
      "What is the 'stack property' precisely?",
      "Does Belady's Anomaly affect Clock (second-chance) replacement?",
    ],
    commonMistakes: ["Claiming this happens for all replacement algorithms, not specifically FIFO"],
    discussionPoints: ["Stack property", "FIFO-specific behavior", "Reference string simulation"],
  },
  {
    id: "vm-iv-3",
    question: "How does copy-on-write make fork() efficient, and what happens the moment either process writes to memory?",
    difficulty: "Medium",
    detailedAnswer:
      "On fork(), instead of eagerly duplicating the parent's entire physical memory, the OS marks all the parent's (and now the child's) pages as read-only and has both processes' page tables point to the same physical frames. As long as neither process writes, they genuinely share memory with zero duplication cost. The instant either process attempts a write, the read-only protection triggers a page fault (a 'protection fault,' distinct from a not-present fault), and the OS's fault handler responds by allocating a fresh physical frame, copying just that one page's contents into it, updating the faulting process's page table entry to point to the new writable copy, and resuming — so the copy cost is paid lazily, one page at a time, only for pages that actually diverge.",
    idealAnswer:
      "Instead of copying the parent's entire address space on fork(), both parent and child just point to the same physical pages, all marked read-only. That's essentially free. The moment either one tries to write, the CPU sees the read-only protection violated, traps into the OS, and only THEN does the kernel copy that single page to a new frame and remap it as writable for whichever process wrote — so you only ever pay the real copying cost for pages that actually get modified, which is a huge win especially since a lot of forked children just immediately call exec() and never touch most of the parent's memory at all.",
    interviewerExpectations: [
      "Explains the read-only sharing setup clearly",
      "Correctly describes the write-triggered fault-and-copy mechanism",
      "Mentions this is especially valuable for fork+exec patterns",
    ],
    followUpQuestions: [
      "Why is COW especially beneficial for the common fork()+exec() pattern?",
      "What kind of fault does a COW write trigger — the same as a demand-paging fault?",
      "Are there any downsides or edge cases with COW?",
    ],
    commonMistakes: ["Saying fork() 'doesn't copy anything ever' — it does copy, just lazily and only on write"],
    discussionPoints: ["Read-only page sharing", "Protection fault vs not-present fault", "fork+exec efficiency"],
  },
  {
    id: "vm-iv-4",
    question: "A production service starts showing high latency and the ops team reports high disk I/O and high CPU usage, but very low actual request throughput. What would you suspect, and how would you confirm it?",
    difficulty: "Hard",
    detailedAnswer:
      "This symptom pattern — high resource usage but low real throughput — is a classic signature of thrashing: the combined working sets of processes on the box exceed available physical memory, so the system is spending most of its cycles servicing page faults (disk I/O to swap pages in/out) rather than executing application code. I'd confirm with `vmstat` (watching the 'si'/'so' swap-in/swap-out columns for sustained non-zero activity) or `/proc/vmstat`'s pgfault/pgmajfault counters, correlated with memory pressure indicators. The fix is reducing memory pressure — either by reducing the number of concurrent processes/containers on the box, increasing physical memory, right-sizing each process's memory footprint, or (in a containerized environment) tightening memory limits so a runaway process gets OOM-killed rather than dragging the whole host into swap-thrashing, since a single contained failure is far better than one that takes down every co-located service.",
    idealAnswer:
      "That pattern — busy CPU and disk but almost no real work getting done — is the textbook signature of thrashing: too many processes' combined working sets don't fit in physical RAM, so the machine is mostly paging things in and out from disk instead of running code. I'd confirm with `vmstat`, watching the swap-in/swap-out columns for sustained activity, and check major page fault counts. The real fix is relieving memory pressure — add RAM, reduce the number of co-located processes, or in a containerized setup, set tighter memory limits so one runaway workload gets OOM-killed in isolation rather than dragging the whole host into a swap storm that hurts every service on it.",
    interviewerExpectations: [
      "Correctly diagnoses thrashing from the symptom pattern",
      "Names concrete verification tools/metrics (vmstat, swap activity)",
      "Proposes both root-cause and containment-style fixes",
    ],
    followUpQuestions: [
      "What's the difference between 'si/so' and 'pgfault/pgmajfault' as diagnostic signals?",
      "How does an OOM killer relate to preventing this in containerized environments?",
      "How would you right-size a memory limit for a container to avoid both OOM-kills and thrashing?",
    ],
    commonMistakes: [
      "Jumping straight to 'add more RAM' without confirming the diagnosis",
      "Confusing this with a pure CPU-bound performance problem",
    ],
    discussionPoints: ["Thrashing diagnosis", "vmstat swap metrics", "OOM killer", "Container memory limits"],
    scenarioBased: true,
  },
];

export default virtualMemoryInterviewQuestions;
