// src/content/cs-fundamentals/os/articles/paging.ts

import type { Article } from "@/types";

const pagingArticle: Article = {
  slug: "paging",
  title: "Paging",
  summary:
    "Paging divides both physical memory and a process's address space into fixed-size blocks, letting the OS map a process's memory anywhere in RAM without requiring it to be contiguous.",
  readingTimeMins: 9,
  beginnerExplanation:
    "Imagine a book divided into equal-sized pages, and a bookshelf with equal-sized slots — you can put page 1 in slot 47, page 2 in slot 3, page 3 in slot 12, anywhere at all, as long as you keep a table saying which slot holds which page. That's paging: a process's memory is chopped into fixed-size 'pages,' physical RAM is chopped into same-sized 'frames,' and a page table tracks which frame holds which page — so a process's memory doesn't need to sit in one contiguous chunk of physical RAM at all.",
  detailedBreakdown:
    "A virtual (logical) address is split into a page number and an offset within that page. The page number indexes into the process's page table, which returns the physical frame number; the offset is unchanged, giving the final physical address as (frame number × frame size) + offset. This translation happens on every single memory access, which is why hardware support — the Memory Management Unit (MMU) — is essential for performance.\n\nBecause walking the page table in memory on every access would be prohibitively slow, CPUs cache recent virtual-to-physical translations in a Translation Lookaside Buffer (TLB), a small, extremely fast associative cache. A TLB hit means the translation is found instantly; a TLB miss means the CPU (or OS, depending on architecture) must walk the page table in memory, which is dramatically slower — this is exactly why context switches (which change page tables) are expensive: they invalidate the TLB.\n\nFor large address spaces, a single flat page table would itself be enormous, so most systems use multi-level (hierarchical) page tables — a page number is itself split into multiple parts, each indexing into a smaller table, with the final level containing the actual frame numbers. This means unused regions of the address space don't need any page table entries at all, saving memory. x86-64 commonly uses a 4-level page table.\n\nEach page table entry also stores metadata bits beyond the frame number: a valid/present bit (is this page currently in physical memory at all, or does accessing it need to page fault to disk), a dirty bit (has this page been modified since being loaded, relevant for deciding whether it must be written back before eviction), a reference/accessed bit (used by page replacement algorithms), and protection bits (read/write/execute permissions).",
  realWorldExamples:
    "Every modern general-purpose OS (Linux, Windows, macOS) uses paging as the foundation of its memory management. When you see 'Segmentation fault' in practice on a Unix system, it's actually usually a paging-related protection violation (accessing an invalid or protected page), despite the confusingly historical name. Huge Pages (2MB or 1GB pages instead of the standard 4KB) are a real production optimization used by databases and JVMs to reduce TLB misses for large working sets.",
  useCases: [
    "Eliminating external fragmentation by allowing non-contiguous physical memory allocation",
    "Enabling virtual memory (processes can use more address space than physically installed RAM)",
    "Providing memory protection and isolation between processes via separate page tables",
  ],
  advantages: [
    "No external fragmentation — any free frame can hold any page",
    "Simplifies memory allocation since all units (pages/frames) are the same fixed size",
    "Enables clean process isolation and features like copy-on-write and demand paging",
  ],
  disadvantages: [
    "Internal fragmentation — a page is often not fully used, wasting the unused remainder",
    "Extra memory needed for page tables themselves, especially for large or sparse address spaces (mitigated by multi-level tables)",
    "Address translation overhead on every memory access, only made tolerable by TLB caching",
  ],
  commonMisconceptions: [
    "\"Paging eliminates all fragmentation\" — it eliminates external fragmentation but introduces internal fragmentation (wasted space within the last page of an allocation).",
    "\"Every memory access requires a slow page table walk\" — in practice the TLB makes the vast majority of accesses fast; only TLB misses require a walk.",
    "\"Segmentation fault means the segmentation memory model caused the error\" — on modern paged systems, 'segfault' is just the historical name for any invalid memory access, unrelated to true segmentation.",
  ],
  interviewPerspective:
    "Interviewers commonly ask you to compute a physical address given a virtual address, page size, and page table — practice the bit-shifting/division arithmetic. Explaining what a TLB is, why it exists, and why TLB misses are costly is a near-guaranteed follow-up to any paging question. Multi-level page tables ('why not just use one giant table?') is a strong signal question for deeper understanding.",
  oaPerspective:
    "OA MCQs and numericals cover: computing number of bits for page number/offset given address space and page size, TLB hit ratio and effective access time calculations, and page table size calculations. The Effective Access Time (EAT) formula is a favorite: EAT = hit ratio × (TLB access + memory access) + miss ratio × (TLB access + 2×memory access).",
  keyTakeaways: [
    "Paging splits virtual and physical memory into equal fixed-size pages/frames, tracked via a page table.",
    "TLB caches recent translations to avoid a slow page table walk on every access.",
    "Multi-level page tables keep table size manageable for large/sparse address spaces.",
    "Paging trades external fragmentation for internal fragmentation.",
  ],
  summaryClosing:
    "Paging is the mechanism that makes modern virtual memory possible — understanding page tables and the TLB is prerequisite knowledge for the Virtual Memory article, which builds on paging to let processes use more memory than physically exists.",
  relatedTopics: ["Segmentation", "Virtual Memory", "File Systems"],
  furtherReading: [
    { label: "OSTEP: Paging chapters", note: "Covers multi-level tables and TLBs with worked numeric examples." },
  ],
};

export default pagingArticle;
