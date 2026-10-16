// src/content/dsa-sheets/bitManipulation.ts
//
// Bit Manipulation sheet. Same ordering contract as src/data/dpSections.js.
//
// Sections 1-3 are the tricks worth memorising outright. Sections 4-6 are where
// bits stop being a party trick and become a data structure — subset
// enumeration, XOR tries, and SOS DP. Bitmask *DP* itself lives in section 12
// of the DP sheet, since the technique being drilled there is the DP.

import type { SheetSection } from "@/types";

const bitManipulationSections: SheetSection[] = [
  {
    title: "1. Core Bit Tricks",
    description:
      "The handful of identities everything else is built on: n & (n-1) clears the lowest set bit, n & -n isolates it, x ^ x = 0. Get these into muscle memory before anything else on this sheet.",
    links: [
      "https://leetcode.com/problems/number-of-1-bits/",
      "https://leetcode.com/problems/power-of-two/",
      "https://leetcode.com/problems/power-of-four/",
      "https://leetcode.com/problems/complement-of-base-10-integer/",
      "https://leetcode.com/problems/number-complement/",
      "https://leetcode.com/problems/reverse-bits/",
      "https://leetcode.com/problems/binary-number-with-alternating-bits/",
      "https://leetcode.com/problems/set-mismatch/",
      "https://leetcode.com/problems/add-two-integers/",
      "https://leetcode.com/problems/convert-a-number-to-hexadecimal/",
      "https://leetcode.com/problems/number-of-steps-to-reduce-a-number-to-zero/",
      "https://leetcode.com/problems/check-if-number-has-equal-digit-count-and-digit-value/",
      "https://leetcode.com/problems/bitwise-and-of-numbers-range/",
      "https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero/",
    ],
  },
  {
    title: "2. Counting Bits & Popcount DP",
    description:
      "Population counts in bulk. Counting Bits is the one-line DP (dp[i] = dp[i >> 1] + (i & 1)) that interviewers like because the naive answer is obviously O(n log n) and the good one is O(n).",
    links: [
      "https://leetcode.com/problems/counting-bits/",
      "https://cses.fi/problemset/task/1146",
      "https://leetcode.com/problems/hamming-distance/",
      "https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits/",
      "https://leetcode.com/problems/count-the-number-of-consistent-strings/",
      "https://leetcode.com/problems/prime-number-of-set-bits-in-binary-representation/",
      "https://leetcode.com/problems/binary-watch/",
      "https://leetcode.com/problems/sum-of-values-at-indices-with-k-set-bits/",
      "https://leetcode.com/problems/total-hamming-distance/",
      "https://cses.fi/problemset/task/2136",
      "https://leetcode.com/problems/concatenation-of-consecutive-binary-numbers/",
      "https://leetcode.com/problems/minimum-flips-to-make-a-or-b-equal-to-c/",
    ],
  },
  {
    title: "3. XOR Properties — Single Number Family",
    description:
      "XOR is its own inverse and it is commutative, so pairs cancel regardless of order. Single Number II (count bits mod 3) and III (split by a differing bit) are the two generalisations worth doing in sequence.",
    links: [
      "https://leetcode.com/problems/single-number/",
      "https://leetcode.com/problems/missing-number/",
      "https://leetcode.com/problems/find-the-difference/",
      "https://leetcode.com/problems/xor-operation-in-an-array/",
      "https://leetcode.com/problems/decode-xored-array/",
      "https://leetcode.com/problems/sum-of-all-subset-xor-totals/",
      "https://leetcode.com/problems/single-number-ii/",
      "https://leetcode.com/problems/single-number-iii/",
      "https://leetcode.com/problems/decode-xored-permutation/",
      "https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/",
      "https://leetcode.com/problems/find-xor-beauty-of-array/",
      "https://leetcode.com/problems/find-the-original-array-of-prefix-xor/",
      "https://leetcode.com/problems/maximum-xor-after-operations/",
      "https://leetcode.com/problems/minimize-xor/",
      "https://leetcode.com/problems/find-the-longest-substring-containing-vowels-in-even-counts/",
      "https://leetcode.com/problems/number-of-wonderful-substrings/",
    ],
  },
  {
    title: "4. Subset Enumeration with Bitmasks",
    description:
      "Iterate all 2ⁿ subsets with a loop over integers, and all submasks of a mask with the `sub = (sub - 1) & mask` idiom. This is the representation trick that unlocks the DP sheet's bitmask section.",
    links: [
      "https://leetcode.com/problems/subsets/",
      "https://leetcode.com/problems/gray-code/",
      "https://cses.fi/problemset/task/2205",
      "https://cses.fi/problemset/task/1617",
      "https://leetcode.com/problems/maximum-product-of-word-lengths/",
      "https://leetcode.com/problems/count-number-of-maximum-bitwise-or-subsets/",
      "https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters/",
      "https://leetcode.com/problems/count-the-number-of-square-free-subsets/",
      "https://leetcode.com/problems/the-number-of-good-subsets/",
      "https://leetcode.com/problems/find-the-shortest-superstring/",
    ],
  },
  {
    title: "5. Bitwise Trie — Maximum XOR Problems",
    description:
      "Insert numbers bit by bit into a binary trie and greedily walk the opposite branch to maximise XOR. One data structure covers this whole family; Maximum XOR of Two Numbers is where to build it.",
    links: [
      "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
      "https://cses.fi/problemset/task/1655",
      "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/",
      "https://leetcode.com/problems/count-pairs-with-xor-in-a-range/",
      "https://leetcode.com/problems/maximum-strong-pair-xor-ii/",
      "https://cses.fi/problemset/task/3191",
    ],
  },
  {
    title: "6. Bitwise Aggregates over Subarrays",
    description:
      "AND/OR/XOR over a sliding or expanding range. The key fact: as a subarray grows, its OR only gains bits and its AND only loses them, so each endpoint has O(log maxVal) distinct values — that bounds the whole search.",
    links: [
      "https://leetcode.com/problems/bitwise-ors-of-subarrays/",
      "https://leetcode.com/problems/longest-nice-subarray/",
      "https://leetcode.com/problems/smallest-subarrays-with-maximum-bitwise-or/",
      "https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-ii/",
      "https://codeforces.com/problemset/problem/1395/C",
      "https://leetcode.com/problems/xor-queries-of-a-subarray/",
      "https://leetcode.com/problems/find-subarray-with-bitwise-or-closest-to-k/",
    ],
  },
  {
    title: "7. Arithmetic Without Arithmetic Operators",
    description:
      "Addition as XOR plus carry, division by repeated subtraction of shifted divisors. Sum of Two Integers and Divide Two Integers are the two that actually get asked — both are really overflow-handling questions.",
    links: [
      "https://leetcode.com/problems/add-binary/",
      "https://leetcode.com/problems/sum-of-two-integers/",
      "https://leetcode.com/problems/divide-two-integers/",
      "https://leetcode.com/problems/minimum-number-of-k-consecutive-bit-flips/",
      "https://leetcode.com/problems/maximum-and-sum-of-array/",
    ],
  },
  {
    title: "8. SOS DP & Subset-Sum over Masks",
    description:
      "Sum-over-subsets: aggregate a function over every submask of every mask in O(2ⁿ · n) instead of O(3ⁿ). The last tier of this sheet, and purely a competitive-programming tool.",
    links: [
      "https://cses.fi/problemset/task/1654",
      "https://cses.fi/problemset/task/3211",
      "https://leetcode.com/problems/number-of-ways-to-wear-different-hats-to-each-other/",
      "https://leetcode.com/problems/minimum-xor-sum-of-two-arrays/",
    ],
  },
];

export default bitManipulationSections;
