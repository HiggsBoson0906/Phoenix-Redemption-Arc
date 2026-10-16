// src/content/cs-fundamentals/os/interview/fileSystems.interview.ts

import type { InterviewQuestion } from "@/types";

const fileSystemsInterviewQuestions: InterviewQuestion[] = [
  {
    id: "fs-iv-1",
    question: "What is an inode, and why doesn't it store the filename?",
    difficulty: "Medium",
    detailedAnswer:
      "An inode is the metadata structure Unix-style file systems use per file: it holds size, permissions, owner, timestamps, link count, and the block pointers needed to locate the file's actual data — but deliberately not the filename. Filenames instead live in directory entries, which are just mappings from a name to an inode number, stored in the parent directory (itself a special kind of file). This separation is precisely what makes hard links possible: multiple directory entries, potentially in different directories with different names, can all point to the very same inode, meaning they're not copies but literally the same file accessed via different names.",
    idealAnswer:
      "An inode holds a file's metadata and where its data blocks are, but not its name — the name lives in a directory entry, which is just a name-to-inode-number mapping. That separation is exactly why hard links work: you can have two different names, even in two different directories, both pointing to the same inode, and they're genuinely the same file, not copies — editing through either name edits the same underlying data.",
    interviewerExpectations: [
      "Correctly states what an inode does and doesn't contain",
      "Connects this directly to why hard links are possible",
    ],
    followUpQuestions: [
      "What happens to an inode's data when the last hard link to it is removed?",
      "How is a symbolic link fundamentally different from this model?",
      "What's stored in a directory 'file' itself?",
    ],
    commonMistakes: ["Assuming the inode stores the filename"],
    discussionPoints: ["Inode structure", "Directory entries", "Hard link mechanics"],
  },
  {
    id: "fs-iv-2",
    question: "Compare contiguous, linked, and indexed file allocation. Which does ext4/most modern file systems actually use?",
    difficulty: "Medium",
    detailedAnswer:
      "Contiguous allocation stores a file's blocks in one unbroken run — fastest for sequential AND random access, but suffers external fragmentation and makes growing a file in place hard. Linked allocation chains blocks via pointers — eliminates external fragmentation and files grow trivially, but random access requires walking the chain from the start, which is slow, and a corrupted pointer breaks everything downstream. Indexed allocation gives each file an index structure (the inode's direct/indirect/doubly-indirect block pointers) listing its blocks directly — this is what modern file systems like ext4 actually use, since it gets fast random access (look up the index, not a chain) without contiguous allocation's fragmentation problem, at the modest cost of extra space for the index structure itself.",
    idealAnswer:
      "Contiguous is fastest but fragments badly and makes file growth awkward. Linked avoids fragmentation entirely and grows easily but random access means walking a pointer chain, which is slow. Indexed — what ext4 and most real systems actually use via the inode's block-pointer structure — gets you fast random access like contiguous allocation without its fragmentation downside, since the index itself can live anywhere and just point at wherever the data blocks actually are.",
    interviewerExpectations: [
      "Names the correct trade-off for each of the three methods",
      "Correctly identifies indexed allocation as what real systems use",
    ],
    followUpQuestions: [
      "How do direct, indirect, and doubly-indirect blocks work together in an inode?",
      "Why does indexed allocation still have some space overhead cost?",
      "How does this compare structurally to multi-level page tables in memory management?",
    ],
    commonMistakes: ["Not knowing which method real file systems actually use"],
    discussionPoints: ["Allocation trade-offs", "Inode indexing structure", "Direct/indirect/doubly-indirect blocks"],
  },
  {
    id: "fs-iv-3",
    question: "How does journaling protect a file system from corruption during a crash?",
    difficulty: "Hard",
    detailedAnswer:
      "A journaling file system writes a description of an intended change to an append-only journal log before actually applying that change to the main file system's metadata/data structures. If the system crashes mid-operation — say, halfway through updating a directory entry and its inode — on reboot the file system can replay the journal to complete any operation that was fully logged but not yet applied, or discard any operation that was only partially logged, guaranteeing the file system always ends up in a consistent state reflecting either the operation's complete effect or none of it at all (a property analogous to database transaction atomicity), without needing a slow full-disk consistency check (like the old fsck) after every unclean shutdown.",
    idealAnswer:
      "The idea is essentially database-style write-ahead logging applied to file system metadata: before actually changing anything, the system writes down what it INTENDS to change into a journal. If it crashes mid-operation, on reboot it just looks at the journal — any fully-logged operation gets replayed to completion, anything only partially logged gets discarded — so you always end up either fully applying a change or not applying it at all, never stuck halfway. That's what avoids the old-school full-disk fsck scan after every unclean shutdown, since the journal already tells you exactly what needs fixing.",
    interviewerExpectations: [
      "Explains the write-ahead-log mechanism clearly",
      "Connects it to atomicity/consistency guarantees",
      "Bonus: contrasts with pre-journaling fsck-based recovery",
    ],
    followUpQuestions: [
      "What's the performance cost of journaling, and why?",
      "What are the different journaling modes (e.g. ext4's data=journal vs data=ordered)?",
      "How does this relate to write-ahead logging in databases?",
    ],
    commonMistakes: ["Vague answer without explaining the log-before-apply ordering specifically"],
    discussionPoints: ["Write-ahead logging", "Crash consistency", "fsck vs journal replay"],
  },
  {
    id: "fs-iv-4",
    question: "You're designing a file system for an application that stores millions of small (a few KB) files. What allocation and metadata design considerations matter most, and why?",
    difficulty: "Hard",
    detailedAnswer:
      "At millions of small files, per-file metadata overhead dominates: every file needs an inode (or equivalent), and inode table size/lookup cost, plus directory-entry lookup cost for name resolution, become the real bottleneck rather than raw data throughput. I'd favor an allocation and indexing scheme optimized for small-file density — e.g. inlining very small file data directly into the inode itself (avoiding a separate data block allocation and the extra seek that implies) if the file system supports it, and using an efficient directory structure (a B-tree or hashed directory index, like ext4's htree, rather than a flat linear directory listing) so lookups in a directory with huge numbers of entries stay fast. I'd also seriously consider whether a traditional file system is even the right tool versus an object store or embedded key-value store (like storing many small blobs inside a single larger file backed by an index, or using something like RocksDB) which is specifically what many real systems (e.g. Git's packfiles, or Facebook's Haystack photo storage) do to avoid the per-file metadata overhead of the underlying general-purpose file system entirely.",
    idealAnswer:
      "With millions of tiny files, the bottleneck shifts from raw data throughput to metadata overhead — every file costs an inode and a directory entry, so I'd want a directory structure that scales well with entry count, like a B-tree/hashed index rather than a flat list, and ideally a file system that can inline very small file data directly into the inode to skip a separate block allocation and seek. But honestly, at that scale I'd also question whether a general-purpose file system is the right tool at all — a lot of real production systems facing this exact problem, like Facebook's Haystack for photo storage or Git's packfiles, instead pack many small objects into fewer large files with their own lightweight index, specifically to sidestep per-file file-system metadata overhead entirely.",
    interviewerExpectations: [
      "Identifies metadata/inode overhead as the core scaling problem, not raw I/O",
      "Names a concrete directory-indexing improvement (B-tree/hashed directories)",
      "Considers alternatives to a raw file system (packing/object storage) as a valid answer",
    ],
    followUpQuestions: [
      "What is ext4's htree directory indexing and how does it help here?",
      "How does Git's packfile approach solve a similar small-object problem?",
      "What's the trade-off of inlining small file data into the inode?",
    ],
    commonMistakes: [
      "Only discussing disk space efficiency, missing the metadata/lookup bottleneck",
      "Not considering that a non-file-system storage design might be the better answer at this scale",
    ],
    discussionPoints: ["Inode/metadata overhead at scale", "Directory indexing structures", "Object-store alternatives"],
    scenarioBased: true,
  },
];

export default fileSystemsInterviewQuestions;
