// src/content/cs-fundamentals/os/interview/segmentation.interview.ts

import type { InterviewQuestion } from "@/types";

const segmentationInterviewQuestions: InterviewQuestion[] = [
  {
    id: "seg-iv-1",
    question: "Compare paging and segmentation. What's the fundamental trade-off?",
    difficulty: "Medium",
    detailedAnswer:
      "Paging divides memory into fixed-size, logically arbitrary pages/frames tracked via a page table — this eliminates external fragmentation entirely (any free frame fits any page) but introduces internal fragmentation (a page's unused remainder is wasted). Segmentation divides memory into variable-sized, logically meaningful segments (code, data, stack) tracked via a base+limit segment table — this eliminates internal fragmentation (segments are exactly the size needed) but reintroduces external fragmentation (variable-sized free chunks scattered across memory, some too small to be useful). The fundamental trade-off is fixed-size simplicity (paging) versus logical/protection meaningfulness (segmentation), and most modern systems resolve it by combining both — paged segmentation.",
    idealAnswer:
      "It comes down to fixed-size versus variable-size units. Paging uses fixed-size pages, which kills external fragmentation but wastes some space per allocation (internal fragmentation). Segmentation uses variable-size, logically meaningful units like 'the code' or 'the stack,' which wastes no space internally but can fragment free memory externally since segments come in all different sizes. Most real systems today combine the two — segments for logical protection, paging within each segment for allocation — to get the benefits of both.",
    interviewerExpectations: [
      "Correctly maps fragmentation type to each scheme (this is the single most important fact)",
      "Explains WHY each fragmentation type occurs, not just names it",
      "Mentions paged segmentation as the real-world resolution",
    ],
    followUpQuestions: [
      "Give a concrete example of external fragmentation occurring.",
      "Why is internal fragmentation generally considered 'cheaper' to accept than external fragmentation?",
      "How does x86-64 combine segmentation and paging today?",
    ],
    commonMistakes: ["Swapping which scheme causes which fragmentation type — this is the most common error"],
    discussionPoints: ["Fixed vs variable-size units", "Internal vs external fragmentation", "Paged segmentation"],
  },
  {
    id: "seg-iv-2",
    question: "Why does a segment table need both a base and a limit field?",
    difficulty: "Medium",
    detailedAnswer:
      "The base tells hardware where the segment physically starts, needed to translate any offset within it into a real physical address. The limit tells hardware how large the segment is, and is checked against every incoming offset before translation is allowed — without it, a process could supply an out-of-range offset and read/write memory belonging to a completely different segment or process, so the limit is what enforces memory protection and isolation at the hardware level, not just address translation.",
    idealAnswer:
      "Base gives you the starting physical address so you can actually compute base+offset. Limit is the protection mechanism — hardware checks that the offset is less than the limit before allowing the access at all, which is what stops one process from reading or corrupting memory outside its own segment just by supplying a large offset. Without the limit check, segmentation would just be address translation with zero isolation guarantee.",
    interviewerExpectations: ["Distinguishes base's translation role from limit's protection role clearly"],
    followUpQuestions: [
      "What happens in hardware when offset ≥ limit?",
      "How does this compare to bounds checking in paging?",
      "Could you build memory protection without a limit field? How?",
    ],
    commonMistakes: ["Treating base and limit as interchangeable or not explaining limit's protection purpose"],
    discussionPoints: ["Address translation vs protection", "Hardware bounds checking"],
  },
  {
    id: "seg-iv-3",
    question: "Why did most modern operating systems move away from pure segmentation toward paging (or paged segmentation)?",
    difficulty: "Hard",
    detailedAnswer:
      "Pure segmentation's Achilles heel is external fragmentation — as segments are created and destroyed with different sizes, free memory fractures into scattered chunks, and eventually a new segment request can fail even when total free memory is sufficient, simply because no single free chunk is large enough. Fixing this requires compaction (physically moving segments to consolidate free space), which is expensive and disruptive. Paging sidesteps this problem entirely by using fixed-size units, so any free frame can satisfy any page request with zero external fragmentation — at the cost of some internal fragmentation, which is a much cheaper, more predictable, and more bounded cost (at most one page's worth of waste per allocation) than unpredictable allocation failures from external fragmentation. This is why virtually all modern general-purpose OSes rely on paging as their primary mechanism, sometimes layering logical segment-like organization on top conceptually without needing hardware segment registers for allocation.",
    idealAnswer:
      "External fragmentation is the killer problem — since segments are variable-sized, free memory ends up scattered into pieces too small to be useful individually, even when there's technically enough total free space, and fixing that means expensive compaction. Paging's fixed-size pages sidestep that completely since any free frame fits any page, trading it for internal fragmentation instead, which is bounded and predictable — at worst you waste part of one page per allocation, versus segmentation where an allocation can outright fail despite having enough total free memory. That predictability is exactly why paging won out as the primary mechanism in virtually every modern OS.",
    interviewerExpectations: [
      "Identifies external fragmentation as the core motivating problem",
      "Explains why internal fragmentation (paging's cost) is more acceptable/bounded",
    ],
    followUpQuestions: [
      "What is compaction and why is it expensive?",
      "Does paging have any downside segmentation doesn't?",
      "How does x86-64 hardware still technically support segmentation today?",
    ],
    commonMistakes: ["Not identifying external fragmentation specifically as the deciding factor"],
    discussionPoints: ["External fragmentation", "Compaction cost", "Bounded vs unbounded waste"],
  },
];

export default segmentationInterviewQuestions;
