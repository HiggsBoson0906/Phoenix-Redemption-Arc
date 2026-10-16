// src/content/cs-fundamentals/os/articles/fileSystems.ts

import type { Article } from "@/types";

const fileSystemsArticle: Article = {
  slug: "file-systems",
  title: "File Systems",
  summary:
    "A file system organizes how data is named, stored, and retrieved on persistent storage — the layer that turns a raw disk into named files and folders.",
  readingTimeMins: 9,
  beginnerExplanation:
    "A disk, at the hardware level, is just a giant array of fixed-size blocks with no inherent concept of 'files' or 'folders' — it's like a warehouse full of identical numbered boxes with no labels. A file system is the organizational layer on top: it decides which boxes belong to which file, remembers file names and where their contents live, and lets you navigate a human-friendly folder hierarchy instead of tracking raw block numbers yourself.",
  detailedBreakdown:
    "Every file system needs to solve the same core problem: given a file, find which disk blocks hold its data. Contiguous allocation stores a file's blocks sequentially — fast to read (one seek, then sequential scan) but suffers external fragmentation and makes files hard to grow in place. Linked allocation stores each block with a pointer to the next — no external fragmentation and files grow easily, but random access is slow (must traverse the chain) and a single corrupted pointer breaks the rest of the chain. Indexed allocation (used by most real file systems, including a form in ext4 and historically Unix's inode-based approach) gives each file an index block listing all its data block numbers — enables fast random access and avoids fragmentation issues, at the cost of needing extra space for index blocks; multi-level/mixed indexing (direct, indirect, and doubly-indirect blocks, exactly what the classic Unix inode uses) lets small files stay compact while still supporting arbitrarily large files.\n\nAn inode (index node) is the core metadata structure in Unix-style file systems: it stores a file's metadata (size, permissions, owner, timestamps, link count) and the block pointers needed to locate its data — notably, the inode does NOT store the filename; that mapping lives in the containing directory, which is itself just a special file mapping names to inode numbers. This is exactly why hard links work — multiple directory entries (even in different directories) can point to the same inode, and the file's data isn't actually deleted until its link count drops to zero.\n\nFree space on disk is tracked via a free space management scheme — commonly a bitmap (one bit per block, 1=free) or a free list (a linked list of free blocks) — consulted whenever a new block needs to be allocated.\n\nJournaling file systems (ext4, NTFS) write intended changes to a append-only journal log before applying them to the main file system structures; if the system crashes mid-operation, the journal lets the OS replay or roll back incomplete operations on reboot, avoiding the file system corruption that could otherwise result from a crash mid-write.",
  realWorldExamples:
    "ext4 (Linux), NTFS (Windows), and APFS (macOS) are all real-world indexed, journaling file systems. Hard links (`ln` without `-s` on Unix) share the same inode and data, so editing via either path edits the same underlying file; symbolic links are a different mechanism — a small file whose content is just a path string, resolved at access time. Cloud storage systems like S3 conceptually resemble a flat, hugely-scaled key-value analog of a file system without a true hierarchical directory structure underneath, despite showing 'folders' in the UI.",
  useCases: [
    "Organizing persistent storage into human-navigable named files and hierarchical directories",
    "Providing crash-consistency guarantees via journaling so a power loss doesn't corrupt the whole disk",
    "Supporting efficient file sharing (hard links) and referencing (symbolic links) without data duplication",
  ],
  advantages: [
    "Abstracts raw block storage into a usable, named, hierarchical interface applications and users can navigate",
    "Indexed allocation (inodes) balances fast random access with support for arbitrarily large files",
    "Journaling provides crash consistency without needing a full filesystem check after every unclean shutdown",
  ],
  disadvantages: [
    "Different allocation strategies trade off fragmentation, random-access speed, and space overhead — no single scheme wins everywhere",
    "Journaling adds write overhead (writing to the journal, then the real location) for crash safety",
    "Metadata-heavy workloads (many small files) can bottleneck on inode/free-space-management overhead",
  ],
  commonMisconceptions: [
    "\"A file's name is stored in its inode\" — the name lives in the containing directory entry, which maps names to inode numbers; the inode itself only stores metadata and block pointers.",
    "\"Deleting a file immediately frees its data\" — with hard links, data is only freed once the link count reaches zero; even then, many file systems just mark blocks free without immediately overwriting data (which is why 'deleted' files are often recoverable).",
    "\"Symbolic links and hard links are basically the same thing\" — hard links point to the same inode/data directly; symlinks are a separate file containing a path, resolved at access time, and can dangle if the target is removed.",
  ],
  interviewPerspective:
    "The inode vs directory-entry relationship (and why hard links work because of it) is a very common differentiator question. Be ready to explain indexed allocation with direct/indirect/doubly-indirect blocks, and to compare contiguous/linked/indexed allocation trade-offs directly, similar to the paging-vs-segmentation comparison pattern.",
  oaPerspective:
    "OA MCQs test allocation method trade-offs, what an inode does and doesn't store, hard link vs symbolic link behavior, and free space management schemes (bitmap vs free list). Expect a question distinguishing what happens to disk blocks when a hard-linked file is deleted via one of its names.",
  keyTakeaways: [
    "Allocation strategies: contiguous (fast, fragments), linked (flexible, slow random access), indexed/inode-based (used by most real systems, balances both).",
    "An inode stores metadata and block pointers, NOT the filename — filenames live in directory entries, which is why hard links work.",
    "Free space is tracked via a bitmap or free list.",
    "Journaling file systems log intended changes before applying them, enabling crash recovery without full disk scans.",
  ],
  summaryClosing:
    "File systems are where operating system theory meets the physical reality of persistent storage — every concept here (indexed allocation, journaling, free space management) exists to answer one question reliably and efficiently: given a name, find the right bytes on disk, even after a crash.",
  relatedTopics: ["Virtual Memory", "Paging", "Processes"],
  furtherReading: [
    { label: "OSTEP: File System Implementation chapters", note: "Covers inodes, journaling, and free space management with real ext-family examples." },
  ],
};

export default fileSystemsArticle;
