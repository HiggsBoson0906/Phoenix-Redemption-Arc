// src/content/dsa-sheets/stack.ts
//
// Stack sheet. Same ordering contract as src/data/dpSections.js.
//
// Kept deliberately separate from Queue and Deque (see queue.ts, deque.ts)
// even though most sheets bundle "Stack & Queue" as one topic — the two
// structures solve different shapes of problem (LIFO matching vs FIFO
// processing) and merging them just hides which one a problem actually needs.
//
// Sections 1-2 are "the stack undoes itself" — matching and monotonic
// pruning. Section 3 is the stack as a call-stack simulator. Section 4 is
// stack-backed design questions.

import type { SheetSection } from "@/types";

const stackSections: SheetSection[] = [
  {
    title: "1. Matching & Cancellation — the Bracket Family",
    description:
      "Push what might need to be undone, pop when you see its match. Valid Parentheses is the whole idea in miniature; everything else here is that same push/pop-on-match loop with a different cancellation rule.",
    links: [
      "https://leetcode.com/problems/valid-parentheses/",
      "https://leetcode.com/problems/remove-outermost-parentheses/",
      "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/",
      "https://leetcode.com/problems/backspace-string-compare/",
      "https://leetcode.com/problems/make-the-string-great/",
      "https://leetcode.com/problems/clear-digits/",
      "https://leetcode.com/problems/minimum-string-length-after-removing-substrings/",
      "https://leetcode.com/problems/removing-stars-from-a-string/",
      "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/",
      "https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/",
      "https://leetcode.com/problems/check-if-word-is-valid-after-substitutions/",
      "https://leetcode.com/problems/score-of-parentheses/",
      "https://leetcode.com/problems/longest-valid-parentheses/",
    ],
  },
  {
    title: "2. Monotonic Stack — Next Greater / Smaller Element",
    description:
      "Keep the stack increasing (or decreasing) and pop whenever the new element breaks that order — every pop is a 'this is your next greater element' answer, discovered in O(1) amortised per element. Daily Temperatures is the cleanest first example; do it before Next Greater Element.",
    links: [
      "https://leetcode.com/problems/next-greater-element-i/",
      "https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/",
      "https://leetcode.com/problems/daily-temperatures/",
      "https://leetcode.com/problems/next-greater-element-ii/",
      "https://leetcode.com/problems/online-stock-span/",
      "https://leetcode.com/problems/remove-k-digits/",
      "https://leetcode.com/problems/sum-of-subarray-minimums/",
      "https://leetcode.com/problems/asteroid-collision/",
      "https://leetcode.com/problems/car-fleet/",
      "https://leetcode.com/problems/132-pattern/",
      "https://cses.fi/problemset/task/1645",
    ],
  },
  {
    title: "3. Monotonic Stack over Histograms — Area & Span Problems",
    description:
      "The same increasing-stack idea, but each pop now closes off a rectangle instead of answering a single query. Largest Rectangle in Histogram is the load-bearing problem of this whole sheet — Maximal Rectangle and Trapping Rain Water are it applied row-by-row or from both ends.",
    links: [
      "https://leetcode.com/problems/sum-of-subarray-ranges/",
      "https://leetcode.com/problems/maximum-width-ramp/",
      "https://leetcode.com/problems/remove-duplicate-letters/",
      "https://leetcode.com/problems/smallest-subsequence-of-distinct-characters/",
      "https://leetcode.com/problems/largest-rectangle-in-histogram/",
      "https://leetcode.com/problems/maximal-rectangle/",
      "https://leetcode.com/problems/trapping-rain-water/",
    ],
  },
  {
    title: "4. Stack as an Expression Evaluator",
    description:
      "A stack is the natural machine for anything with nested precedence — operators wait on the stack until something of lower precedence forces them to fire. Basic Calculator I/II/III form a deliberate ladder: no parens, no parens but * and /, then both together.",
    links: [
      "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
      "https://leetcode.com/problems/basic-calculator-ii/",
      "https://leetcode.com/problems/decode-string/",
      "https://leetcode.com/problems/exclusive-time-of-functions/",
      "https://leetcode.com/problems/ternary-expression-parser/",
      "https://leetcode.com/problems/basic-calculator/",
      "https://leetcode.com/problems/basic-calculator-iii/",
    ],
  },
  {
    title: "5. Stack for Iterative Traversal & Path Simulation",
    description:
      "Anywhere recursion implicitly uses a call stack, an explicit stack turns it iterative and gives you control over the order — pause, resume, or bound the depth. Simplify Path is the same idea applied to directory navigation instead of a tree.",
    links: [
      "https://leetcode.com/problems/binary-tree-preorder-traversal/",
      "https://leetcode.com/problems/binary-tree-inorder-traversal/",
      "https://leetcode.com/problems/binary-tree-postorder-traversal/",
      "https://leetcode.com/problems/crawler-log-folder/",
      "https://leetcode.com/problems/evaluate-boolean-binary-tree/",
      "https://leetcode.com/problems/simplify-path/",
      "https://leetcode.com/problems/flatten-nested-list-iterator/",
    ],
  },
  {
    title: "6. Stack-Backed Design Questions",
    description:
      "Interviewers like a stack for design problems because 'support this in O(1)' usually means 'store the answer redundantly on every push.' Min Stack is the canonical trick — carry the running minimum alongside each element instead of recomputing it.",
    links: [
      "https://leetcode.com/problems/implement-stack-using-queues/",
      "https://leetcode.com/problems/min-stack/",
      "https://leetcode.com/problems/design-a-stack-with-increment-operation/",
      "https://leetcode.com/problems/design-browser-history/",
      "https://leetcode.com/problems/maximum-frequency-stack/",
      "https://leetcode.com/problems/dinner-plate-stacks/",
    ],
  },
];

export default stackSections;
