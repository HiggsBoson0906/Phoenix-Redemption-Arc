// src/content/cs-fundamentals/os/interview/paging.interview.ts

import type { InterviewQuestion } from "@/types";

const pagingInterviewQuestions: InterviewQuestion[] = [
  {
    id: "paging-iv-1",
    question: "Explain how virtual-to-physical address translation works in a paged system.",
    difficulty: "Medium",
    detailedAnswer:
      "A virtual address is split into a page number (the high-order bits) and an offset (the low-order bits, whose width is determined by the page size). The page number is used to index into the process's page table, which returns a physical frame number; the offset is copied unchanged, and the final physical address is (frame number × page size) + offset. This happens on every memory access, so hardware (the MMU) does it in hardware, and a TLB caches recent translations since walking the page table in memory for every access would be far too slow.",
    idealAnswer:
      "The virtual address splits into a page number and an offset, where the offset width is fixed by the page size — say 12 bits for a 4KB page. The page number looks up a frame number in the page table, and you glue that frame number together with the unchanged offset to get the physical address. Since this needs to happen on literally every memory reference, it's done in hardware via the MMU, and a TLB caches the recent lookups so most accesses don't need a full page table walk.",
    interviewerExpectations: [
      "Correctly splits the address into page number + offset",
      "Explains the frame-number lookup and offset preservation",
      "Mentions the MMU/TLB for performance",
    ],
    followUpQuestions: [
      "How would you calculate the number of offset bits given a page size?",
      "What happens on a TLB miss?",
      "Walk through a numeric example: given a virtual address, page size, and page table, compute the physical address.",
    ],
    commonMistakes: ["Forgetting that the offset is unchanged between virtual and physical addresses"],
    discussionPoints: ["Page number vs offset split", "MMU", "TLB caching"],
  },
  {
    id: "paging-iv-2",
    question: "Why do modern CPUs need a TLB? What happens without one?",
    difficulty: "Medium",
    detailedAnswer:
      "Without a TLB, every single memory access — which happens constantly, multiple times per instruction — would require walking the page table in memory (potentially multiple levels deep for hierarchical tables), turning every memory reference into 2-5+ actual memory accesses just for translation, which would be catastrophically slow. The TLB caches recently used page-to-frame translations in a small, extremely fast hardware cache, so the vast majority of accesses (given typical locality of reference) hit the TLB and skip the page table walk entirely, making paging's overhead tolerable in practice.",
    idealAnswer:
      "Every memory access needs address translation, and without caching that, you'd be walking a (possibly multi-level) page table in memory for literally every single reference — multiplying your effective memory access count several times over just for translation. The TLB solves this by caching recent translations in fast on-chip hardware, so thanks to typical locality of reference, most accesses hit the TLB and skip the page table walk, which is the only reason paging's overhead is acceptable at all in real systems.",
    interviewerExpectations: [
      "Explains the cost without a TLB concretely (multiple memory accesses per reference)",
      "Connects to locality of reference as why caching works",
    ],
    followUpQuestions: [
      "What happens to the TLB on a context switch?",
      "What is a TLB shootdown in a multicore system?",
      "How do huge pages help reduce TLB misses?",
    ],
    commonMistakes: ["Vague answer without quantifying why an unaided page table walk is expensive"],
    discussionPoints: ["Locality of reference", "TLB flush on context switch", "Huge pages"],
  },
  {
    id: "paging-iv-3",
    question: "What's the trade-off between using a small page size versus a large page size?",
    difficulty: "Hard",
    detailedAnswer:
      "Small pages reduce internal fragmentation (less wasted space in a partially-used final page) and give finer-grained memory protection/sharing, but they mean more page table entries for a given address space (larger page tables, more memory overhead) and more TLB entries needed to cover a given working set (more TLB misses for large working sets). Large pages (huge pages, 2MB/1GB) drastically reduce the number of TLB entries needed to cover the same amount of memory, cutting TLB miss rates for large working sets (important for databases, JVMs), but increase internal fragmentation and can waste physical memory if allocations don't need the full large page.",
    idealAnswer:
      "It's fundamentally a fragmentation-versus-TLB-coverage trade-off. Small pages waste less memory to internal fragmentation and give you finer-grained protection, but you need way more page table entries and TLB entries to cover the same amount of memory, so large working sets suffer more TLB misses. Large pages, like Linux's huge pages, drastically cut TLB miss rates for big working sets — which is why databases and JVMs often explicitly opt into them — at the cost of more wasted space when an allocation doesn't need the full page.",
    interviewerExpectations: [
      "Names both directions of the trade-off, not just one",
      "Connects large pages to a real production use case (huge pages)",
    ],
    followUpQuestions: [
      "Why would a database specifically want huge pages?",
      "How does page size affect page table size for a fixed address space?",
      "Can page size vary within a single system? How?",
    ],
    commonMistakes: ["Only discussing fragmentation without mentioning the TLB-coverage angle"],
    discussionPoints: ["Internal fragmentation", "TLB coverage", "Huge pages in production systems"],
  },
  {
    id: "paging-iv-4",
    question: "You're optimizing a latency-sensitive service and profiling shows a significant fraction of CPU time going into TLB misses. What would you investigate and how would you fix it?",
    difficulty: "Hard",
    detailedAnswer:
      "High TLB miss overhead usually means the process's working set (the memory it's actively touching) spans more pages than the TLB can cache translations for, causing frequent evictions and re-walks. I'd first confirm this with hardware performance counters (e.g. `perf stat` on Linux showing dTLB-load-misses) to quantify the actual miss rate. The most direct fix is switching hot memory regions to huge pages (2MB or 1GB instead of the standard 4KB) — Linux supports this via Transparent Huge Pages or explicit `hugetlbfs` — since one huge page TLB entry covers 512x (or more) the memory of a standard page entry, drastically cutting the number of distinct translations needed for the same working set. I'd also look at improving data locality (keeping hot data physically close/compact in memory, reducing the number of distinct pages touched per operation) and check whether NUMA effects are compounding the problem if this is a multi-socket machine.",
    idealAnswer:
      "I'd first confirm the diagnosis with hardware counters — `perf stat -e dTLB-load-misses` on Linux — to see the actual miss rate rather than guessing from symptoms. If it's confirmed, the highest-leverage fix is usually switching the hot memory region to huge pages, since each huge-page TLB entry covers hundreds of times more memory than a standard 4KB page entry, so the same working set needs far fewer TLB entries to stay fully cached. Alongside that I'd look at improving data locality so the working set touches fewer distinct pages in the first place, and check for NUMA effects if it's a multi-socket server, since cross-socket memory access compounds this kind of latency issue.",
    interviewerExpectations: [
      "Proposes a concrete diagnostic (perf counters), not just theory",
      "Names huge pages as the primary fix with correct reasoning",
      "Considers locality/NUMA as secondary factors",
    ],
    followUpQuestions: [
      "What's the difference between Transparent Huge Pages and explicit hugetlbfs?",
      "What downside might huge pages introduce here?",
      "How would NUMA affect this analysis on a multi-socket server?",
    ],
    commonMistakes: [
      "Proposing to 'add more RAM' without addressing the actual TLB coverage problem",
      "Not naming a concrete profiling tool/counter",
    ],
    discussionPoints: ["perf / hardware counters", "Huge pages", "Data locality", "NUMA"],
    scenarioBased: true,
  },
];

export default pagingInterviewQuestions;
