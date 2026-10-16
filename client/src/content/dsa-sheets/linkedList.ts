// src/content/dsa-sheets/linkedList.ts
//
// Linked List sheet. Same ordering contract as src/data/dpSections.js.
//
// Deliberate boundary: fast/slow pointer work — cycle detection, the middle
// node, palindrome checking, remove-nth-from-end — is a two-pointer
// technique first and a linked-list problem second, so it stays on the Two
// Pointer sheet's "Fast & Slow Pointers" section and isn't repeated here.
// This sheet is for what's specific to the structure itself: rewiring
// pointers in place, merging/sorting without random access, and the
// pointer-manipulation design questions (LRU/LFU) that only make sense
// because a linked list gives O(1) splice.

import type { SheetSection } from "@/types";

const linkedListSections: SheetSection[] = [
  {
    title: "1. In-Place Reversal — Rewiring Pointers",
    description:
      "The one skill this whole sheet is built on: walk the list with prev/curr/next and redirect one pointer per step without ever losing the rest of the chain. Reverse Linked List is the baseline; K-Group is the same loop run in chunks with a manual boundary check.",
    links: [
      "https://leetcode.com/problems/reverse-linked-list/",
      "https://leetcode.com/problems/reverse-linked-list-ii/",
      "https://leetcode.com/problems/swap-nodes-in-pairs/",
      "https://leetcode.com/problems/reverse-nodes-in-k-group/",
      "https://leetcode.com/problems/rotate-list/",
      "https://leetcode.com/problems/odd-even-linked-list/",
    ],
  },
  {
    title: "2. Merging & Sorting Without Random Access",
    description:
      "Arrays sort with random access to any index; a linked list only gives you the next pointer, so merge sort (splitting at the midpoint, merging two sorted halves) is the natural algorithm here — not quicksort, which needs in-place swaps at arbitrary positions.",
    links: [
      "https://leetcode.com/problems/merge-two-sorted-lists/",
      "https://leetcode.com/problems/merge-k-sorted-lists/",
      "https://leetcode.com/problems/sort-list/",
      "https://leetcode.com/problems/insertion-sort-list/",
      "https://leetcode.com/problems/partition-list/",
    ],
  },
  {
    title: "3. Two-List Arithmetic & Structural Comparison",
    description:
      "Walk two lists in lockstep instead of one. Add Two Numbers is digit-by-digit addition with a carry; Intersection of Two Linked Lists is the elegant two-pointer-across-two-lists trick — swap heads on reaching null and the pointers meet at the intersection in exactly the same number of steps either way.",
    links: [
      "https://leetcode.com/problems/add-two-numbers/",
      "https://leetcode.com/problems/add-two-numbers-ii/",
      "https://leetcode.com/problems/intersection-of-two-linked-lists/",
      "https://leetcode.com/problems/remove-duplicates-from-sorted-list/",
      "https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/",
    ],
  },
  {
    title: "4. Deep Copies & Multilevel Structures",
    description:
      "Once a node can point somewhere other than 'next,' you need a map from old node to new node before you can copy anything — otherwise a random/child pointer might target a node that doesn't exist yet in your copy. Build that map first, wire pointers second.",
    links: [
      "https://leetcode.com/problems/copy-list-with-random-pointer/",
      "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/",
      "https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list/",
      "https://leetcode.com/problems/design-linked-list/",
      "https://leetcode.com/problems/delete-node-in-a-linked-list/",
    ],
  },
  {
    title: "5. Linked-List-Backed Design — LRU/LFU Caches",
    description:
      "The interview-favourite design pairing: a hash map for O(1) lookup plus a doubly linked list for O(1) reordering, since only a linked list lets you splice a node from the middle to an end without shifting anything else. LRU Cache first — LFU adds a second dimension (frequency buckets) once the eviction-order trick is second nature.",
    links: [
      "https://leetcode.com/problems/lru-cache/",
      "https://leetcode.com/problems/lfu-cache/",
      "https://leetcode.com/problems/all-oone-data-structure/",
      "https://leetcode.com/problems/design-a-text-editor/",
    ],
  },
];

export default linkedListSections;
