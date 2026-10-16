// src/content/dsa-sheets/trie.ts
//
// Trie (prefix tree) sheet. Same ordering contract as src/data/dpSections.js.
//
// The Tree sheet's section 13 already covers the trie as a tree variant —
// that section stays put (this file is additive, not a replacement for it);
// this sheet gives the structure its own front door since "trie" is asked
// about as its own topic far more often than "tree, subtype 13." Sections
// here go one layer deeper than that overview: search systems, prefix
// statistics, and the trie-as-DP-accelerator combo.
//
// The *bitwise* trie (walking a number bit by bit to maximise XOR) is a
// different structure with a different job — it stays on the Bit
// Manipulation sheet's "Bitwise Trie" section, not duplicated here.

import type { SheetSection } from "@/types";

const trieSections: SheetSection[] = [
  {
    title: "1. Trie Fundamentals — Insert, Search, Prefix Match",
    description:
      "Build Implement Trie by hand before anything else on this sheet — every later problem is that same node (a children map plus an end-of-word flag) with one extra field bolted on. Design Add and Search Words adds the wrinkle of a '.' wildcard, which forces a DFS over children instead of a single lookup.",
    links: [
      "https://leetcode.com/problems/implement-trie-prefix-tree/",
      "https://leetcode.com/problems/longest-common-prefix/",
      "https://leetcode.com/problems/replace-words/",
      "https://leetcode.com/problems/longest-word-in-dictionary/",
      "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
      "https://leetcode.com/problems/implement-magic-dictionary/",
    ],
  },
  {
    title: "2. Trie for Search & Autocomplete Systems",
    description:
      "The interview-favourite application: type-ahead. Each keystroke walks one more level down the trie instead of re-scanning the whole dictionary, which is the entire reason the structure exists. Word Search II is the trie's classic pairing with backtracking — the trie prunes branches the grid search would otherwise explore blindly.",
    links: [
      "https://leetcode.com/problems/search-suggestions-system/",
      "https://leetcode.com/problems/design-search-autocomplete-system/",
      "https://leetcode.com/problems/stream-of-characters/",
      "https://leetcode.com/problems/word-search-ii/",
      "https://leetcode.com/problems/palindrome-pairs/",
    ],
  },
  {
    title: "3. Trie for Prefix & Suffix Statistics",
    description:
      "Once every node can carry a count, not just a boolean, the trie answers 'how many words share this prefix' in O(prefix length) instead of a linear scan. Prefix and Suffix Search is the one worth the extra thought — it needs a trie keyed on `word + '#' + suffix` to search both ends at once.",
    links: [
      "https://leetcode.com/problems/sum-of-prefix-scores-of-strings/",
      "https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii/",
      "https://leetcode.com/problems/prefix-and-suffix-search/",
      "https://leetcode.com/problems/map-sum-pairs/",
      "https://leetcode.com/problems/camelcase-matching/",
    ],
  },
  {
    title: "4. Trie as a DP / Segmentation Accelerator",
    description:
      "Word-break-style DP is O(n²) if every substring gets a naive dictionary lookup; inserting the dictionary into a trie and walking it alongside the DP index collapses the inner loop to the trie's branching factor. Build the plain DP first (DP sheet's string-segmentation section), then swap the lookup for a trie walk here.",
    links: [
      "https://leetcode.com/problems/extra-characters-in-a-string/",
      "https://leetcode.com/problems/concatenated-words/",
      "https://leetcode.com/problems/index-pairs-of-a-string/",
      "https://leetcode.com/problems/short-encoding-of-words/",
    ],
  },
];

export default trieSections;
