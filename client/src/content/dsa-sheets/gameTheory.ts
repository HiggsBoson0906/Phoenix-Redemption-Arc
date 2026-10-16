// src/content/dsa-sheets/gameTheory.ts
//
// Game Theory sheet. Same ordering contract as src/data/dpSections.js.
//
// Combinatorial game theory is the topic quant desks and top-tier product
// interviews both reach for, because it is impossible to fake: "who wins with
// optimal play" has a yes/no answer, and either you can prove it or you are
// guessing. The ladder to climb is parity -> Nim/XOR -> Sprague-Grundy ->
// minimax search, and the skill being drilled is knowing which rung a given
// problem sits on before writing any code.
//
// Additive by design — the three places the site already touches games all
// stay exactly as they are, and this sheet points at them rather than
// re-listing them:
//   - Math sheet, section 8: the Nim/Grundy number-theory ladder (Nim Game,
//     Divisor Game, and the CSES Stick Game / Nim Game I & II / Stair Game /
//     Grundy's Game set). Do that section first — it is the foundation.
//   - DP sheet, section 11: minimax over game states (the full Stone Game
//     ladder, Predict the Winner, Cat and Mouse, EDPC K "Stones" and
//     L "Deque"). That is where the memoised-search framing is taught.
//   - Greedy sheet, section 6: the games that collapse to sorting and
//     counting rather than search (Stone Game VI and IX).

import type { SheetSection } from "@/types";

const gameTheorySections: SheetSection[] = [
  {
    title: "1. Take-Away Games & Parity Arguments",
    description:
      "Always try parity before search. In most interview games the state space is irrelevant — what matters is whether some quantity (the count of moves, the number of stones mod k, the difference between two totals) is fixed regardless of how either side plays, at which point the winner is decided before the first move. Sum Game is the cleanest example: pair the question marks off, and the answer is pure arithmetic on the two halves.",
    links: [
      "https://leetcode.com/problems/sum-game/",
      "https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color/",
      "https://leetcode.com/problems/determine-the-winner-of-a-bowling-game/",
      "https://leetcode.com/problems/minimum-number-game/",
      "https://leetcode.com/problems/find-the-winner-of-an-array-game/",
    ],
  },
  {
    title: "2. Nim, XOR & the Sprague–Grundy Theorem",
    description:
      "Every impartial game is equivalent to a single Nim pile whose size is its Grundy number, computed as the mex (minimum excluded value) of the Grundy numbers of all reachable positions; a sum of independent games is losing for the player to move exactly when the XOR of their Grundy numbers is zero. Compute the first ~20 values by hand before generalising — the pattern is almost always a short cycle, which is what 1-2-K Game and Palindrome Game both reward.",
    links: [
      "https://leetcode.com/problems/chalkboard-xor-game/",
      "https://cses.fi/problemset/task/2208",
      "https://codeforces.com/problemset/problem/1194/D",
      "https://codeforces.com/problemset/problem/1537/D",
      "https://codeforces.com/problemset/problem/1527/B1",
    ],
  },
  {
    title: "3. Games on Boards & Trees",
    description:
      "Two different questions get asked about boards: 'is this position reachable at all' and 'who wins from here'. Valid Tic-Tac-Toe State is the first — a pure invariant argument about move counts and who could have won last — and it catches far more candidates than the search-based version does. Binary Tree Coloring Game is the second, and it reduces to a single observation: the second player picks a neighbour of the first player's node and wins if any one of the three resulting components holds more than half the nodes.",
    links: [
      "https://leetcode.com/problems/valid-tic-tac-toe-state/",
      "https://leetcode.com/problems/find-winner-on-a-tic-tac-toe-game/",
      "https://leetcode.com/problems/check-if-move-is-legal/",
      "https://leetcode.com/problems/binary-tree-coloring-game/",
    ],
  },
  {
    title: "4. Adversarial Play & Interactive Queries",
    description:
      "Games against an opponent who answers rather than moves. Guess the Word is the canonical minimax-under-uncertainty question — you get 10 guesses against a hidden word and an adversarial feedback model, so the winning strategy is to pick the guess that minimises the worst-case size of the remaining candidate set, which is exactly the reasoning trading interviews probe with their 'how would you price this' follow-ups.",
    links: [
      "https://leetcode.com/problems/guess-the-word/",
      "https://leetcode.com/problems/mice-and-cheese/",
      "https://leetcode.com/problems/count-the-number-of-winning-sequences/",
    ],
  },
  {
    title: "5. Elimination & Circular Games",
    description:
      "The Josephus family: n players in a circle, every kth eliminated, who survives. The recurrence J(n) = (J(n−1) + k) mod n is O(n) and worth deriving once from scratch; Josephus Problem II raises n past the point where simulation works, which forces the order-statistic tree or BIT version. (The LeetCode phrasing, Find the Winner of the Circular Game, is already on the Math and Deque sheets.)",
    links: [
      "https://leetcode.com/problems/find-the-losers-of-the-circular-game/",
      "https://cses.fi/problemset/task/2163",
    ],
  },
];

export default gameTheorySections;
