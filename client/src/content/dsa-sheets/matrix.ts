// src/content/dsa-sheets/matrix.ts
//
// Matrix & Grid sheet. Same ordering contract as src/data/dpSections.js.
//
// A 2D array is not a topic in the algorithmic sense, which is exactly why it
// gets skipped — and then Rotate Image or Spiral Matrix shows up in round one
// and eats fifteen minutes on off-by-one errors. Everything here is index
// arithmetic and boundary discipline under interview pressure: the algorithm
// is obvious, the implementation is not.
//
// Deliberate boundaries — a grid is a *substrate* for several other sheets,
// and those keep ownership of their techniques:
//   - Grid traversal as a graph (islands, flood fill, shortest path on a
//     board, multi-source BFS) lives on the Graph sheet.
//   - Grid path counting and maximal-square/rectangle DP live on the DP sheet,
//     sections 7 and 9-10.
//   - 2D prefix sums and submatrix-sum queries live on the Range Query sheet,
//     section 1.
//   - Binary search on a sorted matrix (Search a 2D Matrix I/II, Kth Smallest
//     in a Sorted Matrix, Find a Peak Element II) lives on the Binary Search
//     sheet, section 3.
//   - Backtracking on a board (N-Queens, Word Search, Sudoku Solver) lives on
//     the Backtracking sheet.

import type { SheetSection } from "@/types";

const matrixSections: SheetSection[] = [
  {
    title: "1. In-Place Transformations",
    description:
      "Rotate Image is the one to have memorised as a decomposition rather than a formula: transpose, then reverse each row, gives a 90° clockwise rotation with no extra matrix. Set Matrix Zeroes is the same discipline applied to bookkeeping — the O(1)-space version stores the row/column flags in the matrix's own first row and column, which is the follow-up the interviewer is actually waiting for.",
    links: [
      "https://leetcode.com/problems/rotate-image/",
      "https://leetcode.com/problems/set-matrix-zeroes/",
      "https://leetcode.com/problems/transpose-matrix/",
      "https://leetcode.com/problems/flipping-an-image/",
      "https://leetcode.com/problems/determine-whether-matrix-can-be-obtained-by-rotation/",
      "https://leetcode.com/problems/rotating-the-box/",
      "https://leetcode.com/problems/shift-2d-grid/",
      "https://leetcode.com/problems/reshape-the-matrix/",
      "https://leetcode.com/problems/convert-1d-array-into-2d-array/",
    ],
  },
  {
    title: "2. Traversal Orders — Spiral & Diagonal",
    description:
      "Write Spiral Matrix with four explicit boundaries (top, bottom, left, right) that shrink after each pass, and re-check that top ≤ bottom and left ≤ right before the third and fourth legs — that single guard is what breaks on non-square inputs. Diagonals are simpler than they look: every cell on an anti-diagonal shares the same i + j, so bucketing by that sum and reversing alternate buckets is the whole algorithm.",
    links: [
      "https://leetcode.com/problems/spiral-matrix/",
      "https://leetcode.com/problems/spiral-matrix-ii/",
      "https://leetcode.com/problems/spiral-matrix-iii/",
      "https://leetcode.com/problems/spiral-matrix-iv/",
      "https://leetcode.com/problems/diagonal-traverse/",
      "https://leetcode.com/problems/diagonal-traverse-ii/",
      "https://leetcode.com/problems/sort-the-matrix-diagonally/",
      "https://leetcode.com/problems/matrix-diagonal-sum/",
      "https://leetcode.com/problems/toeplitz-matrix/",
    ],
  },
  {
    title: "3. Grid Simulation & Rule Application",
    description:
      "Apply a rule to every cell simultaneously, which means you may not read your own writes. Game of Life is the standard test of that: the O(1)-space solution encodes the next state in a second bit (0 → 1 becomes 2, 1 → 0 becomes 3) and shifts everything down in a final pass, so every read still sees the original board.",
    links: [
      "https://leetcode.com/problems/game-of-life/",
      "https://leetcode.com/problems/image-smoother/",
      "https://leetcode.com/problems/minesweeper/",
      "https://leetcode.com/problems/battleships-in-a-board/",
      "https://leetcode.com/problems/available-captures-for-rook/",
      "https://leetcode.com/problems/queens-that-can-attack-the-king/",
      "https://leetcode.com/problems/cells-with-odd-values-in-a-matrix/",
    ],
  },
  {
    title: "4. Row/Column Aggregates & Constructive Grids",
    description:
      "Precompute per-row and per-column extremes or sums in one pass, then answer everything from those two arrays instead of rescanning the grid — Lucky Numbers and Max Increase to Keep City Skyline are both O(mn) only because of that. Find Valid Matrix Given Row and Column Sums is the constructive counterpart, and the greedy min(row, col) fill is provably correct even though it looks too simple to be.",
    links: [
      "https://leetcode.com/problems/lucky-numbers-in-a-matrix/",
      "https://leetcode.com/problems/max-increase-to-keep-city-skyline/",
      "https://leetcode.com/problems/find-valid-matrix-given-row-and-column-sums/",
      "https://leetcode.com/problems/count-servers-that-communicate/",
      "https://leetcode.com/problems/special-positions-in-a-binary-matrix/",
      "https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/",
      "https://leetcode.com/problems/sort-the-students-by-their-kth-score/",
      "https://leetcode.com/problems/richest-customer-wealth/",
    ],
  },
];

export default matrixSections;
