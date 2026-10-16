// src/data/binarySearchSections.js
//
// Binary Search sheet. Same ordering contract as src/data/dpSections.js.
//
// The spine of this sheet is one idea: binary search does not need a sorted
// array, it needs a *monotone predicate*. Sections 1-3 search an array,
// sections 4-7 search the answer space, and sections 8-11 search structures
// where the monotonicity has to be discovered first.
//
// Numbered families kept contiguous: Search in Rotated Sorted Array I..II,
// Find Minimum in Rotated Sorted Array I..II, Kth Smallest variants.
//
/** @type {import("@/types").SheetSection[]} */
const binarySearchSections = [
    {
        title: "1. Exact Search & the Two Boundary Templates",
        description:
            "Get lower_bound and upper_bound right once and most of this sheet becomes mechanical. Pick one loop invariant (half-open [lo, hi) is the least error-prone) and use it everywhere instead of re-deriving mid each time.",
        links: [
            "https://leetcode.com/problems/binary-search/",
            "https://leetcode.com/problems/search-insert-position/",
            "https://www.geeksforgeeks.org/problems/floor-in-a-sorted-array-1587115620/1",
            "https://leetcode.com/problems/first-bad-version/",
            "https://leetcode.com/problems/guess-number-higher-or-lower/",
            "https://leetcode.com/problems/find-smallest-letter-greater-than-target/",
            "https://leetcode.com/problems/kth-missing-positive-number/",
            "https://leetcode.com/problems/find-target-indices-after-sorting-array/",
            "https://leetcode.com/problems/special-array-with-x-elements-greater-than-or-equal-x/",
            "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
            "https://leetcode.com/problems/find-k-closest-elements/",
            "https://leetcode.com/problems/single-element-in-a-sorted-array/",
        ],
    },
    {
        title: "2. Searching Rotated & Mountain Arrays",
        description:
            "The array is not sorted, but one half of every split always is — that is enough. Do I before II in each pair: duplicates are exactly what break the O(log n) guarantee, and knowing why is the interview answer.",
        links: [
            "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
            "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/",
            "https://leetcode.com/problems/search-in-rotated-sorted-array/",
            "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
            "https://www.geeksforgeeks.org/problems/rotation4723/1",
            "https://leetcode.com/problems/peak-index-in-a-mountain-array/",
            "https://leetcode.com/problems/find-peak-element/",
            "https://leetcode.com/problems/find-in-mountain-array/",
        ],
    },
    {
        title: "3. Binary Search on 2D & Implicit Matrices",
        description:
            "Either flatten a row-sorted matrix into one virtual array, or walk the staircase from a corner. The second idea generalises to matrices that are only sorted along each axis.",
        links: [
            "https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/",
            "https://leetcode.com/problems/search-a-2d-matrix/",
            "https://leetcode.com/problems/search-a-2d-matrix-ii/",
            "https://leetcode.com/problems/find-a-peak-element-ii/",
            "https://www.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1",
            "https://codeforces.com/problemset/problem/448/D",
            "https://leetcode.com/problems/kth-smallest-number-in-multiplication-table/",
        ],
    },
    {
        title: "4. Binary Search on Answer — Minimise the Maximum",
        description:
            "The single highest-yield pattern in this sheet. Guess an answer, write a linear feasibility check, and binary search the guess. Koko Eating Bananas is the cleanest first one; Split Array Largest Sum is the same problem as a DP you no longer need.",
        links: [
            "https://leetcode.com/problems/koko-eating-bananas/",
            "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
            "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/",
            "https://leetcode.com/problems/minimum-limit-of-balls-in-a-bag/",
            "https://leetcode.com/problems/minimum-speed-to-arrive-on-time/",
            "https://leetcode.com/problems/minimized-maximum-of-products-distributed-to-any-store/",
            "https://leetcode.com/problems/minimum-time-to-complete-trips/",
            "https://leetcode.com/problems/minimum-time-to-repair-cars/",
            "https://www.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1",
            "https://www.spoj.com/problems/PRATA/",
            "https://leetcode.com/problems/minimize-the-maximum-difference-of-pairs/",
            "https://leetcode.com/problems/minimum-number-of-seconds-to-make-mountain-height-zero/",
            "https://leetcode.com/problems/split-array-largest-sum/",
            "https://leetcode.com/problems/minimum-number-of-days-to-disconnect-island/",
        ],
    },
    {
        title: "5. Binary Search on Answer — Maximise the Minimum",
        description:
            "The mirror image: the predicate flips, so the boundary you keep flips too. Aggressive Cows is the canonical version and it is worth doing on both SPOJ and GFG until the check function writes itself.",
        links: [
            "https://www.geeksforgeeks.org/problems/aggressive-cows/1",
            "https://www.spoj.com/problems/AGGRCOW/",
            "https://leetcode.com/problems/magnetic-force-between-two-balls/",
            "https://www.spoj.com/problems/EKO/",
            "https://leetcode.com/problems/maximum-candies-allocated-to-k-children/",
            "https://leetcode.com/problems/maximum-tastiness-of-candy-basket/",
            "https://leetcode.com/problems/maximum-number-of-removable-characters/",
            "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/",
            "https://leetcode.com/problems/maximum-number-of-alloys/",
            "https://leetcode.com/problems/maximum-beauty-of-an-array-after-applying-operation/",
            "https://leetcode.com/problems/maximum-running-time-of-n-computers/",
            "https://leetcode.com/problems/maximize-the-minimum-powered-city/",
        ],
    },
    {
        title: "6. Binary Search + Greedy or DP Feasibility Check",
        description:
            "Same outer search, but the check is now itself an algorithm. This is where interviewers separate 'knows binary search' from 'can compose two techniques' — expect it at the harder end of FAANG onsites.",
        links: [
            "https://codeforces.com/problemset/problem/165/B",
            "https://codeforces.com/problemset/problem/1183/C",
            "https://leetcode.com/problems/house-robber-iv/",
            "https://leetcode.com/problems/maximum-value-at-a-given-index-in-a-bounded-array/",
            "https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/",
            "https://leetcode.com/problems/minimum-space-wasted-from-packaging/",
            "https://codeforces.com/problemset/problem/1370/D",
            "https://leetcode.com/problems/find-the-maximum-sum-of-node-values/",
            "https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign/",
        ],
    },
    {
        title: "7. Median, Kth Element & Order Statistics",
        description:
            "Rank queries answered by searching the value space instead of the index space. Median of Two Sorted Arrays is the hardest classic here and still gets asked; do the k-th smallest problems first so the partition idea is already familiar.",
        links: [
            "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/",
            "https://leetcode.com/problems/k-th-smallest-prime-fraction/",
            "https://leetcode.com/problems/count-the-number-of-fair-pairs/",
            "https://leetcode.com/problems/find-k-th-smallest-pair-distance/",
            "https://leetcode.com/problems/find-the-kth-smallest-sum-of-a-matrix-with-sorted-rows/",
            "https://www.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1",
            "https://leetcode.com/problems/median-of-two-sorted-arrays/",
            "https://leetcode.com/problems/kth-smallest-product-of-two-sorted-arrays/",
        ],
    },
    {
        title: "8. Binary Search over Prefix Sums & Sorted Queries",
        description:
            "Build a monotone array first (prefix sums, sorted potions, cumulative chalk), then every query is a lower_bound. Recognising that the preprocessing step is the real work is the skill being tested.",
        links: [
            "https://leetcode.com/problems/find-the-student-that-will-replace-the-chalk/",
            "https://leetcode.com/problems/successful-pairs-of-spells-and-potions/",
            "https://leetcode.com/problems/random-pick-with-weight/",
            "https://leetcode.com/problems/time-based-key-value-store/",
            "https://leetcode.com/problems/snapshot-array/",
            "https://leetcode.com/problems/most-beautiful-item-for-each-query/",
            "https://codeforces.com/problemset/problem/1462/E1",
            "https://leetcode.com/problems/number-of-subsequences-that-satisfy-the-given-sum-condition/",
            "https://leetcode.com/problems/valid-triangle-number/",
            "https://leetcode.com/problems/find-the-maximum-number-of-marked-indices/",
            "https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended-ii/",
            "https://leetcode.com/problems/count-of-range-sum/",
        ],
    },
    {
        title: "9. Binary Search Hidden Inside Another Algorithm",
        description:
            "Problems whose headline technique is DP or greedy, but whose speedup is a binary search in the inner loop. LIS in O(n log n) is the archetype — the tails array is a binary search you maintain as you scan.",
        links: [
            "https://leetcode.com/problems/longest-increasing-subsequence/",
            "https://leetcode.com/problems/maximum-length-of-pair-chain/",
            "https://leetcode.com/problems/maximum-length-of-repeated-subarray/",
            "https://leetcode.com/problems/longest-chunked-palindrome-decomposition/",
            "https://leetcode.com/problems/russian-doll-envelopes/",
            "https://leetcode.com/problems/maximum-profit-in-job-scheduling/",
            "https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position/",
            "https://leetcode.com/problems/longest-increasing-subsequence-ii/",
        ],
    },
    {
        title: "10. Binary Search on Real Numbers & Ternary Search",
        description:
            "Fixed iteration count instead of an exact boundary, because floats never converge cleanly. Ternary search is the sibling for unimodal functions where you are minimising rather than testing a predicate.",
        links: [
            "https://www.geeksforgeeks.org/problems/square-root/1",
            "https://leetcode.com/problems/sqrtx/",
            "https://leetcode.com/problems/valid-perfect-square/",
            "https://www.geeksforgeeks.org/problems/find-nth-root-of-m5843/1",
            "https://leetcode.com/problems/minimize-the-maximum-of-two-arrays/",
            "https://codeforces.com/problemset/problem/1301/B",
            "https://codeforces.com/problemset/problem/439/D",
            "https://leetcode.com/problems/minimum-cost-to-hire-k-workers/",
        ],
    },
    {
        title: "11. Monotonicity You Have to Prove First",
        description:
            "The hardest tier: nothing is sorted and no answer range is obvious until you argue that some function is monotone. Nth Magical Number and Preimage Size of Factorial Zeroes are the two that teach the habit.",
        links: [
            "https://leetcode.com/problems/arranging-coins/",
            "https://leetcode.com/problems/h-index-ii/",
            "https://leetcode.com/problems/find-the-duplicate-number/",
            "https://leetcode.com/problems/sum-of-mutated-array-closest-to-target/",
            "https://leetcode.com/problems/nth-magical-number/",
            "https://leetcode.com/problems/preimage-size-of-factorial-zeroes-function/",
            "https://leetcode.com/problems/swim-in-rising-water/",
            "https://leetcode.com/problems/max-value-of-equation/",
            "https://leetcode.com/problems/find-building-where-alice-and-bob-can-meet/",
        ],
    },
];

export default binarySearchSections;
