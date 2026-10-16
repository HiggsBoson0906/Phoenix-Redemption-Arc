// src/content/dsa-sheets/stringAlgorithms.ts
//
// String Algorithms sheet. Same ordering contract as src/data/dpSections.js.
//
// Sections 1-4 are what interviews actually ask; 5-7 are the classical
// algorithms (KMP, Z, hashing) that CP and quant rounds expect; 8 is the tier
// that only matters if you are targeting ICPC-style problems.
//
// String DP (Edit Distance, Regex Matching, Distinct Subsequences) is not
// duplicated here — it lives in sections 6 and 18 of the DP sheet, because the
// technique being drilled there is the DP table, not the string.

import type { SheetSection } from "@/types";

const stringSections: SheetSection[] = [
  {
    title: "1. String Basics & Character Counting",
    description:
      "Frequency arrays, in-place reversal, and the parsing chores every interview opens with. Cheap to solve, easy to fumble — practise them until edge cases (empty string, all-same, unicode-ish input) are automatic.",
    links: [
      "https://leetcode.com/problems/reverse-string/",
      "https://leetcode.com/problems/valid-anagram/",
      "https://leetcode.com/problems/first-unique-character-in-a-string/",
      "https://leetcode.com/problems/ransom-note/",
      "https://leetcode.com/problems/length-of-last-word/",
      "https://codeforces.com/problemset/problem/71/A",
      "https://leetcode.com/problems/longest-common-prefix/",
      "https://leetcode.com/problems/isomorphic-strings/",
      "https://leetcode.com/problems/word-pattern/",
      "https://leetcode.com/problems/detect-capital/",
      "https://leetcode.com/problems/add-strings/",
      "https://leetcode.com/problems/license-key-formatting/",
      "https://leetcode.com/problems/goal-parser-interpretation/",
      "https://leetcode.com/problems/truncate-sentence/",
      "https://leetcode.com/problems/rotate-string/",
      "https://leetcode.com/problems/reverse-words-in-a-string/",
      "https://leetcode.com/problems/zigzag-conversion/",
      "https://www.codechef.com/problems/SNAKPROC",
      "https://leetcode.com/problems/string-to-integer-atoi/",
      "https://leetcode.com/problems/custom-sort-string/",
      "https://leetcode.com/problems/shifting-letters/",
      "https://leetcode.com/problems/find-and-replace-in-string/",
      "https://leetcode.com/problems/valid-number/",
    ],
  },
  {
    title: "2. Palindromes — Checking & Expanding",
    description:
      "Expand-around-centre is the O(n²) workhorse and is almost always the expected answer. Learn Manacher only after that is solid — interviewers ask for it roughly never, but CP judges do.",
    links: [
      "https://leetcode.com/problems/valid-palindrome/",
      "https://leetcode.com/problems/palindrome-number/",
      "https://leetcode.com/problems/valid-palindrome-ii/",
      "https://leetcode.com/problems/longest-palindrome/",
      "https://leetcode.com/problems/palindromic-substrings/",
      "https://leetcode.com/problems/longest-palindromic-substring/",
      "https://cses.fi/problemset/task/1111",
      "https://leetcode.com/problems/palindrome-partitioning/",
      "https://leetcode.com/problems/palindrome-pairs/",
    ],
  },
  {
    title: "3. Anagrams & Frequency Signatures",
    description:
      "Two strings are 'the same' under some canonical form — sorted characters, a 26-count tuple, or a difference pattern. Picking a signature that is cheap to compute and safe to hash is the entire exercise.",
    links: [
      "https://leetcode.com/problems/find-the-difference/",
      "https://leetcode.com/problems/find-resultant-array-after-removing-anagrams/",
      "https://leetcode.com/problems/group-anagrams/",
      "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
      "https://leetcode.com/problems/determine-if-two-strings-are-close/",
      "https://leetcode.com/problems/find-and-replace-pattern/",
      "https://leetcode.com/problems/word-subsets/",
      "https://leetcode.com/problems/count-anagrams/",
    ],
  },
  {
    title: "4. Parsing, Stacks & Expression Evaluation",
    description:
      "Strings that encode structure. A stack turns nesting into iteration — Valid Parentheses first, then decoding, then full expression evaluation with precedence.",
    links: [
      "https://leetcode.com/problems/valid-parentheses/",
      "https://www.spoj.com/problems/ONP/",
      "https://leetcode.com/problems/backspace-string-compare/",
      "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/",
      "https://leetcode.com/problems/split-a-string-in-balanced-strings/",
      "https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/",
      "https://leetcode.com/problems/remove-outermost-parentheses/",
      "https://leetcode.com/problems/decode-string/",
      "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
      "https://leetcode.com/problems/simplify-path/",
      "https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/",
      "https://leetcode.com/problems/basic-calculator-ii/",
      "https://leetcode.com/problems/score-of-parentheses/",
      "https://leetcode.com/problems/check-if-word-is-valid-after-substitutions/",
      "https://leetcode.com/problems/reverse-substrings-between-each-pair-of-parentheses/",
      "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/",
      "https://leetcode.com/problems/longest-happy-string/",
      "https://leetcode.com/problems/basic-calculator/",
      "https://leetcode.com/problems/number-of-atoms/",
      "https://leetcode.com/problems/parsing-a-boolean-expression/",
    ],
  },
  {
    title: "5. Pattern Matching — KMP & Z-Algorithm",
    description:
      "The prefix function (LPS) is the one thing to actually understand: it tells you how far to fall back on a mismatch. Once you have it, KMP, period detection and border finding are three uses of the same array.",
    links: [
      "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
      "https://cses.fi/problemset/task/1753",
      "https://www.spoj.com/problems/NAJPF/",
      "https://leetcode.com/problems/repeated-substring-pattern/",
      "https://cses.fi/problemset/task/1732",
      "https://cses.fi/problemset/task/1733",
      "https://leetcode.com/problems/repeated-string-match/",
      "https://leetcode.com/problems/shortest-palindrome/",
      "https://leetcode.com/problems/longest-happy-prefix/",
      "https://leetcode.com/problems/sum-of-scores-of-built-strings/",
      "https://cses.fi/problemset/task/1110",
    ],
  },
  {
    title: "6. Rolling Hash & Rabin-Karp",
    description:
      "Compare substrings in O(1) after O(n) preprocessing. Use two mods in contests — single-mod hashing is anti-hash-testable. Pairs naturally with binary search on answer length.",
    links: [
      "https://leetcode.com/problems/repeated-dna-sequences/",
      "https://leetcode.com/problems/longest-duplicate-substring/",
      "https://leetcode.com/problems/distinct-echo-substrings/",
      "https://cses.fi/problemset/task/2106",
      "https://cses.fi/problemset/task/2102",
      "https://leetcode.com/problems/longest-common-subpath/",
    ],
  },
  {
    title: "7. String Compression, Encoding & Transformation",
    description:
      "Run-length encoding, serialization formats, and character-mapping puzzles. The recurring interview trap is the length-of-count field — '12' is two characters, not one.",
    links: [
      "https://leetcode.com/problems/string-compression/",
      "https://leetcode.com/problems/count-and-say/",
      "https://leetcode.com/problems/compare-version-numbers/",
      "https://leetcode.com/problems/string-compression-ii/",
      "https://leetcode.com/problems/text-justification/",
      "https://leetcode.com/problems/integer-to-english-words/",
    ],
  },
  {
    title: "8. Suffix Structures & Advanced String Algorithms",
    description:
      "Suffix arrays, suffix automata, Aho-Corasick. Out of scope for most product interviews and standard for ICPC/quant algorithm rounds — treat this section as optional depth, not a prerequisite.",
    links: [
      "https://cses.fi/problemset/task/2105",
      "https://cses.fi/problemset/task/2107",
      "https://cses.fi/problemset/task/2108",
      "https://leetcode.com/problems/stream-of-characters/",
      "https://cses.fi/problemset/task/2103",
      "https://leetcode.com/problems/last-substring-in-lexicographical-order/",
    ],
  },
];

export default stringSections;
