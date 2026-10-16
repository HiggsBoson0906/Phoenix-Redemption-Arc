// src/content/cs-fundamentals/os/articles/segmentation.ts

import type { Article } from "@/types";

const segmentationArticle: Article = {
  slug: "segmentation",
  title: "Segmentation",
  summary:
    "Segmentation divides a process's memory into logically meaningful, variable-sized units (code, data, stack, heap) rather than the fixed-size chunks paging uses.",
  readingTimeMins: 7,
  beginnerExplanation:
    "Where paging chops memory into equal-sized pieces regardless of what's in them, segmentation instead respects the program's own logical structure — it keeps 'the code,' 'the global data,' 'the stack' as separate, independently-sized regions (segments), each of which can grow or be protected independently. It's the difference between slicing a cake into equal squares (paging) versus cutting it along its natural layers (segmentation).",
  detailedBreakdown:
    "In pure segmentation, a virtual (logical) address is a pair: (segment number, offset within segment). A segment table maps each segment number to a base address (where that segment starts in physical memory) and a limit (the segment's length, used to bounds-check the offset and catch invalid accesses). Physical address = base + offset, with a hardware check that offset < limit before the translation is allowed.\n\nBecause segments have different, variable sizes, allocating them in physical memory is subject to external fragmentation — over time, memory gets divided into scattered free chunks too small individually to fit a new segment, even though the total free memory would be sufficient. This is the core weakness paging was designed to solve, since paging's fixed-size units eliminate external fragmentation entirely.\n\nSegmentation's real strength is that it naturally maps to how programs are structured: each segment can have its own protection bits (code segments read/execute-only, data segments read/write, so a program can't accidentally jump into and execute its own data), and segments can grow independently (the stack growing down, the heap growing up) without touching unrelated regions. In practice, virtually no modern general-purpose OS uses pure segmentation anymore — instead, systems like x86-64 combine both ideas as paged segmentation, using segments for logical protection/organization while each segment itself is paged internally to get paging's fragmentation-free allocation.",
  realWorldExamples:
    "Historically, x86 (32-bit) processors exposed real segment registers (CS, DS, SS, ES) used by early operating systems and are still present today for backward-compatibility, though modern OSes mostly configure them as flat, unbounded segments and rely on paging exclusively. The logical division you see in any process's memory map — Text, Data, Heap, Stack — is a segmentation-flavored concept even on today's purely paged systems, because it's such a natural way to reason about a program's memory even where the hardware no longer directly enforces it via segment registers.",
  useCases: [
    "Giving different, independently-sized regions of a process's memory distinct protection permissions",
    "Modeling a program's natural logical memory structure (code, data, stack, heap) directly in hardware",
    "Sharing a specific segment (e.g. a read-only code segment/shared library) between multiple processes",
  ],
  advantages: [
    "Matches the program's logical structure, making protection and sharing more natural to reason about",
    "Each segment can grow independently without affecting unrelated regions",
    "No internal fragmentation within a segment (segments are exactly as large as needed)",
  ],
  disadvantages: [
    "Suffers external fragmentation since segments are variable-sized",
    "Compaction (defragmenting memory by moving segments) is expensive if needed",
    "Pure segmentation is largely obsolete in modern hardware — mostly superseded by paging or paged segmentation",
  ],
  commonMisconceptions: [
    "\"Segmentation and paging are mutually exclusive alternatives\" — modern systems typically combine them (paged segmentation), using segments for logical organization/protection and paging within each segment for allocation.",
    "\"A 'segmentation fault' means the OS is actively using segmentation\" — on modern paged x86-64 Linux, a segfault is a generic invalid-memory-access signal, a historical name surviving from earlier segmented architectures.",
    "\"Segments and pages are the same size\" — the defining difference is that segments are variable-sized and logically meaningful, while pages are fixed-size and logically arbitrary.",
  ],
  interviewPerspective:
    "The most common question is a direct paging vs segmentation comparison table: fragmentation type (internal vs external), unit size (fixed vs variable), meaning (arbitrary vs logical), and address structure. Interviewers use this to check you understand fragmentation deeply, not just the definitions.",
  oaPerspective:
    "OA MCQs test the segment table's base+limit fields, the bounds-check purpose of the limit field, and direct paging-vs-segmentation comparison questions ('which memory management scheme suffers from external fragmentation?').",
  keyTakeaways: [
    "Segmentation divides memory into variable-sized, logically meaningful segments (code, data, stack) using a segment table of base+limit pairs.",
    "Segmentation suffers external fragmentation; paging suffers internal fragmentation — this is the key trade-off to remember.",
    "The limit field enables bounds-checking, catching out-of-segment accesses.",
    "Modern systems mostly use paging alone or paged segmentation, not pure segmentation.",
  ],
  summaryClosing:
    "Segmentation and paging represent two different philosophies for dividing memory — logical meaning versus fixed-size simplicity — and understanding both, plus why real systems blend them, sets up the Virtual Memory article's discussion of how demand paging lets a paged system use more memory than physically exists.",
  relatedTopics: ["Paging", "Virtual Memory", "Processes"],
  furtherReading: [
    { label: "OSTEP: Segmentation chapter", note: "Explains the base+limit mechanism and external fragmentation in depth." },
  ],
};

export default segmentationArticle;
