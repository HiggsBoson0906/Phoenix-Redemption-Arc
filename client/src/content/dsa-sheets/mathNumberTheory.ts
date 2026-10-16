// src/content/dsa-sheets/mathNumberTheory.ts
//
// Math & Number Theory sheet. Same ordering contract as src/data/dpSections.js.
//
// Sections 1-4 are placement/OA staples. Sections 5-7 (combinatorics,
// probability, randomised algorithms) are the ones quant desks weight most
// heavily — Jane Street / HRT / Citadel screens lean on expected value and
// sampling far more than on graph theory. Section 8 is geometry, which shows up
// mainly in map/routing-flavoured product interviews.

import type { SheetSection } from "@/types";

const mathSections: SheetSection[] = [
  {
    title: "1. Digit Manipulation & Number Basics",
    description:
      "Extracting digits, reversing, and base conversion, plus the overflow discipline that goes with them. Reverse Integer exists purely to check whether you handle 32-bit overflow without being reminded.",
    links: [
      "https://leetcode.com/problems/palindrome-number/",
      "https://leetcode.com/problems/add-digits/",
      "https://leetcode.com/problems/plus-one/",
      "https://leetcode.com/problems/self-dividing-numbers/",
      "https://leetcode.com/problems/base-7/",
      "https://codeforces.com/problemset/problem/4/A",
      "https://leetcode.com/problems/add-binary/",
      "https://leetcode.com/problems/add-strings/",
      "https://leetcode.com/problems/excel-sheet-column-title/",
      "https://leetcode.com/problems/roman-to-integer/",
      "https://leetcode.com/problems/happy-number/",
      "https://leetcode.com/problems/perfect-number/",
      "https://leetcode.com/problems/excel-sheet-column-number/",
      "https://leetcode.com/problems/count-odd-numbers-in-an-interval-range/",
      "https://leetcode.com/problems/maximum-product-of-three-numbers/",
      "https://leetcode.com/problems/reverse-integer/",
      "https://leetcode.com/problems/integer-to-roman/",
      "https://leetcode.com/problems/multiply-strings/",
      "https://leetcode.com/problems/nth-digit/",
      "https://leetcode.com/problems/fraction-to-recurring-decimal/",
      "https://leetcode.com/problems/smallest-value-of-the-rearranged-number/",
      "https://leetcode.com/problems/angle-between-hands-of-a-clock/",
    ],
  },
  {
    title: "2. Primes, Sieve & Factorisation",
    description:
      "The sieve of Eratosthenes and trial division up to √n. Knowing that a number has at most O(log n) distinct prime factors is what makes several 'impossible-looking' constraints tractable.",
    links: [
      "https://leetcode.com/problems/prime-arrangements/",
      "https://leetcode.com/problems/ugly-number/",
      "https://leetcode.com/problems/count-primes/",
      "https://cses.fi/problemset/task/1713",
      "https://leetcode.com/problems/closest-prime-numbers-in-range/",
      "https://cses.fi/problemset/task/2182",
      "https://leetcode.com/problems/distinct-prime-factors-of-product-of-array/",
      "https://leetcode.com/problems/prime-subtraction-operation/",
      "https://cses.fi/problemset/task/2185",
      "https://leetcode.com/problems/ugly-number-ii/",
      "https://leetcode.com/problems/super-ugly-number/",
      "https://leetcode.com/problems/bulb-switcher/",
      "https://leetcode.com/problems/largest-component-size-by-common-factor/",
      "https://leetcode.com/problems/count-array-pairs-divisible-by-k/",
    ],
  },
  {
    title: "3. GCD, LCM & Divisibility",
    description:
      "Euclid's algorithm and the identities around it. The pattern to internalise: whenever a problem says 'repeat until equal' or 'align two cycles', the answer is usually a gcd or an lcm in disguise.",
    links: [
      "https://leetcode.com/problems/find-greatest-common-divisor-of-array/",
      "https://leetcode.com/problems/smallest-even-multiple/",
      "https://leetcode.com/problems/number-of-common-factors/",
      "https://leetcode.com/problems/greatest-common-divisor-of-strings/",
      "https://cses.fi/problemset/task/1081",
      "https://codeforces.com/problemset/problem/1352/C",
      "https://leetcode.com/problems/water-and-jug-problem/",
      "https://cses.fi/problemset/task/2417",
      "https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/",
      "https://leetcode.com/problems/replace-non-coprime-numbers-in-array/",
      "https://leetcode.com/problems/greatest-common-divisor-traversal/",
      "https://leetcode.com/problems/check-if-it-is-a-good-array/",
    ],
  },
  {
    title: "4. Modular Arithmetic & Fast Exponentiation",
    description:
      "Binary exponentiation, modular inverse via Fermat's little theorem, and the habit of reducing mod at every step. Required background for every counting problem that ends in 'answer modulo 1e9+7'.",
    links: [
      "https://leetcode.com/problems/powx-n/",
      "https://cses.fi/problemset/task/1095",
      "https://leetcode.com/problems/super-pow/",
      "https://cses.fi/problemset/task/1712",
      "https://leetcode.com/problems/factorial-trailing-zeroes/",
      "https://www.codechef.com/problems/FCTRL",
      "https://leetcode.com/problems/count-good-numbers/",
      "https://leetcode.com/problems/integer-replacement/",
      "https://leetcode.com/problems/k-th-symbol-in-grammar/",
      "https://leetcode.com/problems/number-of-ways-to-divide-a-long-corridor/",
    ],
  },
  {
    title: "5. Combinatorics — nCr, Catalan & Counting",
    description:
      "Pascal's triangle, factorials with precomputed inverses, and Catalan numbers. Recognising 'this is just C(n+m, n) paths' saves an entire DP table — Gerald and Giant Chess is the classic exercise.",
    links: [
      "https://leetcode.com/problems/pascals-triangle/",
      "https://leetcode.com/problems/pascals-triangle-ii/",
      "https://leetcode.com/problems/unique-paths/",
      "https://cses.fi/problemset/task/1079",
      "https://cses.fi/problemset/task/1715",
      "https://cses.fi/problemset/task/1716",
      "https://leetcode.com/problems/unique-binary-search-trees/",
      "https://cses.fi/problemset/task/2064",
      "https://leetcode.com/problems/number-of-sets-of-k-non-overlapping-line-segments/",
      "https://leetcode.com/problems/number-of-ways-to-select-buildings/",
      "https://leetcode.com/problems/number-of-boomerangs/",
      "https://codeforces.com/problemset/problem/559/C",
      "https://cses.fi/problemset/task/1717",
    ],
  },
  {
    title: "6. Probability & Expected Value",
    description:
      "The single highest-value section for quant screens. Linearity of expectation first — it converts most 'expected number of X' questions into a sum of simple probabilities with no state space at all.",
    links: [
      "https://cses.fi/problemset/task/1725",
      "https://cses.fi/problemset/task/1727",
      "https://cses.fi/problemset/task/1728",
      "https://leetcode.com/problems/airplane-seat-assignment-probability/",
      "https://leetcode.com/problems/new-21-game/",
      "https://leetcode.com/problems/soup-servings/",
      "https://leetcode.com/problems/knight-probability-in-chessboard/",
      "https://cses.fi/problemset/task/1726",
      "https://leetcode.com/problems/probability-of-a-two-boxes-having-the-same-number-of-distinct-balls/",
    ],
  },
  {
    title: "7. Randomised Algorithms & Sampling",
    description:
      "Design questions where the answer is a distribution, not a number: reservoir sampling for unknown-length streams, rejection sampling to build one uniform generator from another. Common at both FAANG and trading firms.",
    links: [
      "https://leetcode.com/problems/shuffle-an-array/",
      "https://leetcode.com/problems/linked-list-random-node/",
      "https://leetcode.com/problems/random-pick-index/",
      "https://leetcode.com/problems/implement-rand10-using-rand7/",
      "https://leetcode.com/problems/random-pick-with-weight/",
      "https://leetcode.com/problems/generate-random-point-in-a-circle/",
      "https://leetcode.com/problems/random-point-in-non-overlapping-rectangles/",
      "https://leetcode.com/problems/random-flip-matrix/",
      "https://leetcode.com/problems/insert-delete-getrandom-o1/",
      "https://leetcode.com/problems/random-pick-with-blacklist/",
    ],
  },
  {
    title: "8. Game Theory — Nim, Grundy & Parity Arguments",
    description:
      "Impartial games reduce to XOR of Grundy numbers. Before reaching for that, always test the parity/invariant shortcut — most interview versions collapse to 'is n divisible by 4'.",
    links: [
      "https://leetcode.com/problems/nim-game/",
      "https://leetcode.com/problems/divisor-game/",
      "https://cses.fi/problemset/task/1729",
      "https://cses.fi/problemset/task/1730",
      "https://cses.fi/problemset/task/1098",
      "https://cses.fi/problemset/task/1099",
      "https://cses.fi/problemset/task/2207",
      "https://leetcode.com/problems/find-the-winner-of-the-circular-game/",
      "https://cses.fi/problemset/task/2162",
    ],
  },
  {
    title: "9. Geometry & Coordinate Math",
    description:
      "Cross products for orientation, and the standing rule to avoid floating point wherever integers will do. Max Points on a Line is the interview classic; the sweep-line problems are the hard tail.",
    links: [
      "https://leetcode.com/problems/minimum-time-visiting-all-points/",
      "https://leetcode.com/problems/check-if-it-is-a-straight-line/",
      "https://leetcode.com/problems/rectangle-overlap/",
      "https://leetcode.com/problems/rectangle-area/",
      "https://leetcode.com/problems/valid-square/",
      "https://leetcode.com/problems/k-closest-points-to-origin/",
      "https://leetcode.com/problems/minimum-area-rectangle/",
      "https://leetcode.com/problems/detect-squares/",
      "https://leetcode.com/problems/sum-of-square-numbers/",
      "https://leetcode.com/problems/max-points-on-a-line/",
      "https://leetcode.com/problems/erect-the-fence/",
      "https://leetcode.com/problems/the-skyline-problem/",
    ],
  },
];

export default mathSections;
