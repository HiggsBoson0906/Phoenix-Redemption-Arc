// src/content/cs-fundamentals/os/oa/segmentation.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const segmentationRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "Segmentation divides memory into variable-sized, logically meaningful segments (code, data, stack).",
    "Segment table entries store base (start address) and limit (length, for bounds checking).",
    "Physical address = base + offset, valid only if offset < limit.",
    "Segmentation → external fragmentation. Paging → internal fragmentation.",
  ],
  importantFacts: [
    "A logical address in segmentation is (segment number, offset), not a single flat number.",
    "The limit field prevents a process from accessing memory beyond its own segment.",
    "Modern systems mostly use paging or paged segmentation, not pure segmentation.",
  ],
  formulas: ["Physical Address = Segment Base + Offset (valid only if Offset < Limit)"],
};

export const segmentationOAQuestions: OAQuestion[] = [
  {
    id: "seg-oa-1",
    question: "In segmentation, what does the 'limit' field in a segment table entry represent?",
    options: [
      "The maximum number of segments allowed",
      "The length of the segment, used to bounds-check offsets",
      "The segment's priority",
      "The number of processes sharing the segment",
    ],
    correctAnswerIndex: 1,
    explanation: "The limit defines how large the segment is, letting hardware reject any offset that would fall outside the segment's valid range.",
    difficulty: "Easy",
    topicTags: ["segment table"],
  },
  {
    id: "seg-oa-2",
    question: "A segment has base = 4000 and limit = 1000. Is an access at offset 800 valid, and if so what is the physical address?",
    options: ["Invalid, offset exceeds limit", "Valid, physical address 4800", "Valid, physical address 800", "Invalid, base is too small"],
    correctAnswerIndex: 1,
    explanation: "800 < 1000 (limit), so it's valid. Physical address = base + offset = 4000 + 800 = 4800.",
    difficulty: "Medium",
    topicTags: ["numerical", "address translation"],
  },
  {
    id: "seg-oa-3",
    question: "A segment has base = 2000 and limit = 500. Is an access at offset 600 valid?",
    options: ["Valid, physical address 2600", "Invalid — a segmentation fault, since 600 ≥ limit (500)", "Valid, physical address 600", "Valid, physical address 500"],
    correctAnswerIndex: 1,
    explanation: "Since 600 ≥ 500 (the limit), this offset falls outside the segment and triggers a protection violation, not a valid translation.",
    difficulty: "Medium",
    topicTags: ["numerical", "bounds checking"],
    companyStyle: "Wipro",
  },
  {
    id: "seg-oa-4",
    question: "Which type of fragmentation is segmentation primarily susceptible to?",
    options: ["Internal fragmentation", "External fragmentation", "Both equally", "Neither"],
    correctAnswerIndex: 1,
    explanation: "Because segments are variable-sized, free memory can become scattered into chunks too small to fit new segments — external fragmentation.",
    difficulty: "Easy",
    topicTags: ["fragmentation"],
  },
  {
    id: "seg-oa-5",
    question: "How is a logical address structured in a pure segmentation scheme?",
    options: [
      "A single flat integer",
      "A pair: (segment number, offset)",
      "A triple: (page number, segment number, offset)",
      "A hash of the memory location",
    ],
    correctAnswerIndex: 1,
    explanation: "Segmentation addresses are inherently two-dimensional — which segment, and where within it — unlike paging's single page-number-plus-offset split which behaves similarly but over fixed-size units.",
    difficulty: "Medium",
    topicTags: ["address structure"],
  },
  {
    id: "seg-oa-6",
    question: "What is 'paged segmentation'?",
    options: [
      "A scheme using only paging with no segments",
      "A hybrid scheme where each segment is itself internally divided into pages",
      "A deprecated term with no modern meaning",
      "A synonym for virtual memory",
    ],
    correctAnswerIndex: 1,
    explanation: "Paged segmentation combines segmentation's logical organization/protection with paging's fragmentation-free allocation within each segment.",
    difficulty: "Hard",
    topicTags: ["paged segmentation"],
  },
  {
    id: "seg-oa-7",
    question: "Compared to paging, segmentation's key advantage is:",
    options: [
      "It completely eliminates fragmentation",
      "It naturally maps to a program's logical structure, enabling per-segment protection",
      "It uses less hardware support",
      "It is always faster",
    ],
    correctAnswerIndex: 1,
    explanation: "Segmentation's variable, logically meaningful units make protection (e.g. read-only code segment) and independent growth more natural than paging's arbitrary fixed-size chunks.",
    difficulty: "Medium",
    topicTags: ["paging vs segmentation"],
  },
  {
    id: "seg-oa-8",
    question: "Compaction, in the context of segmentation, refers to:",
    options: [
      "Compressing file data",
      "Rearranging segments in memory to consolidate scattered free space into one contiguous block",
      "Reducing the number of running processes",
      "Shrinking the page table",
    ],
    correctAnswerIndex: 1,
    explanation: "Compaction is the (expensive) process of moving segments together to eliminate external fragmentation, freeing up one large contiguous block.",
    difficulty: "Medium",
    topicTags: ["compaction"],
  },
];
