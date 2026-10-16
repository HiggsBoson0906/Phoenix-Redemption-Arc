// src/content/cs-fundamentals/os/articles/virtualMemory.ts

import type { Article } from "@/types";

const virtualMemoryArticle: Article = {
  slug: "virtual-memory",
  title: "Virtual Memory",
  summary:
    "Virtual memory lets processes use more address space than physically exists in RAM, by keeping only actively used pages in memory and the rest on disk.",
  readingTimeMins: 10,
  beginnerExplanation:
    "Imagine a library with only 20 desks but a catalog of 10,000 books — you don't need every book on a desk at once, just the ones you're actively reading; the rest stay shelved, fetched only when needed. Virtual memory works the same way: a process might address gigabytes of memory, but the OS only keeps the pages it's actually using in physical RAM right now, fetching the rest from disk on demand and evicting less-needed pages to make room.",
  detailedBreakdown:
    "Demand paging is the core mechanism: a page is loaded into physical memory only when it's actually accessed, not when the process starts. Every page table entry has a valid/present bit; if a process accesses a page whose bit says 'not present,' the hardware triggers a page fault — a trap into the OS, which finds a free frame (or evicts one), loads the required page from disk (the backing store, historically swap space, but modern systems also demand-page directly from the executable file for code/read-only data), updates the page table, and resumes the instruction that faulted.\n\nWhen physical memory is full and a new page must be loaded, the OS needs a page replacement algorithm to pick a victim frame to evict: FIFO (evict the oldest-loaded page, simple but can suffer Belady's Anomaly, where adding more physical frames can paradoxically increase fault count), Optimal (evict the page that won't be used for the longest time in the future — theoretically ideal but requires knowing the future, so it's used only as a theoretical benchmark), and LRU (Least Recently Used — evict the page that hasn't been accessed for the longest time, a strong practical approximation of Optimal based on the principle of locality, usually implemented approximately via reference bits since perfect LRU tracking is expensive).\n\nThrashing is virtual memory's central failure mode: if too many processes (or one process with too large a working set) compete for too little physical memory, the system spends most of its time servicing page faults rather than doing useful work — CPU utilization actually drops even as the system appears maximally busy, because processes are constantly faulting instead of executing. The fix is reducing the degree of multiprogramming (fewer concurrent processes) or ensuring each process's working set (the set of pages it's actively using) fits in its allotted physical frames.\n\nCopy-on-write (COW), used heavily by fork(), is a virtual memory optimization: instead of eagerly copying a parent's pages for a child process, both processes share the same physical pages marked read-only; only when either process attempts to write does a page fault trigger an actual copy of just that one page — dramatically reducing the cost of process creation in the common case where the child immediately calls exec() anyway.",
  realWorldExamples:
    "Every time you open more applications than your RAM could theoretically hold and things still mostly work (if slower), virtual memory and paging to disk (swap) is why. Memory-mapped files (`mmap` on Unix) let a program treat a disk file as if it were directly addressable memory, relying entirely on demand paging to load pages only as they're touched. Container memory limits (Docker/Kubernetes) work by constraining a process's physical frame allocation, and exceeding it triggers the OOM (out-of-memory) killer rather than unlimited swapping in most container setups.",
  useCases: [
    "Running processes whose total memory need exceeds physical RAM",
    "Letting multiple processes share physical memory efficiently by only keeping active pages resident",
    "Enabling cheap process creation via copy-on-write fork()",
    "Memory-mapping files for efficient, lazy file I/O",
  ],
  advantages: [
    "Processes can use more memory than physically installed, simplifying application design",
    "Only active pages consume physical memory, improving overall system memory utilization",
    "Enables powerful features: copy-on-write, memory-mapped files, lazy loading of large executables",
  ],
  disadvantages: [
    "Page faults that require disk I/O are orders of magnitude slower than memory access — heavy paging tanks performance",
    "Thrashing can make a system nearly unusable if physical memory is severely oversubscribed",
    "Added complexity in the OS (fault handling, replacement algorithms, working-set tracking)",
  ],
  commonMisconceptions: [
    "\"Virtual memory and swap space are the same thing\" — swap is one backing store virtual memory can use; virtual memory is the broader abstraction (which also demand-pages directly from executable files).",
    "\"More RAM always eliminates page faults\" — under FIFO specifically, Belady's Anomaly shows more frames can occasionally increase faults, though LRU doesn't suffer this.",
    "\"Thrashing means the CPU is very busy and productive\" — thrashing often shows HIGH CPU/disk activity but LOW actual throughput, since most cycles go to fault handling, not real work.",
  ],
  interviewPerspective:
    "Interviewers commonly ask you to trace an LRU or FIFO page replacement sequence by hand given a reference string and frame count — practice this until it's mechanical. Explaining thrashing's root cause and fix, and articulating copy-on-write's benefit for fork(), are near-guaranteed follow-ups once you've shown paging/virtual memory fundamentals.",
  oaPerspective:
    "OA numericals almost always include a 'given this reference string and N frames, count page faults under FIFO/LRU/Optimal' question — these are very mechanical and high-value to practice since they're common across nearly every product-company OA. Belady's Anomaly is a favorite conceptual MCQ.",
  keyTakeaways: [
    "Demand paging loads pages only when accessed, triggering a page fault (trap to OS) if a needed page isn't resident.",
    "Page replacement algorithms (FIFO, Optimal, LRU) decide which page to evict when memory is full.",
    "Thrashing occurs when too little physical memory is available for the combined working sets of running processes, tanking throughput.",
    "Copy-on-write makes fork() cheap by sharing pages read-only until either process writes.",
  ],
  summaryClosing:
    "Virtual memory is the payoff of everything paging set up — it's what lets modern systems run far more, and far larger, processes than physical RAM alone would allow, at the cost of needing careful replacement-algorithm and working-set management to avoid thrashing.",
  relatedTopics: ["Paging", "Segmentation", "Processes"],
  furtherReading: [
    { label: "OSTEP: Beyond Physical Memory chapters", note: "Deep dive into replacement policies with worked reference-string examples." },
  ],
};

export default virtualMemoryArticle;
