// src/data/treeSections.js
//
// Tree sheet. Same ordering contract as src/data/dpSections.js: sections in
// learning order, problems easy -> hard inside a section, numbered families
// (Path Sum I..III, LCA of BST -> of Binary Tree, My Calendar I..III,
// Cousins in Binary Tree I..II) contiguous and in order.
//
// Heavier tree DP on general (non-binary) trees — rerooting, Tree Distances,
// AtCoder EDPC V — lives in section 14 of the DP sheet. What stays here is the
// binary-tree DP that interview loops actually ask for.
//
/** @type {import("@/types").SheetSection[]} */
const treeSections = [
    {
        title: "1. Traversals — Recursive, then Iterative",
        description:
            "Write all three orders recursively until they are reflex, then rewrite them with an explicit stack. The iterative versions are what interviewers use to check you actually understand the call stack.",
        links: [
            "https://leetcode.com/problems/binary-tree-preorder-traversal/",
            "https://leetcode.com/problems/binary-tree-inorder-traversal/",
            "https://leetcode.com/problems/binary-tree-postorder-traversal/",
            "https://leetcode.com/problems/n-ary-tree-preorder-traversal/",
            "https://leetcode.com/problems/n-ary-tree-postorder-traversal/",
            "https://cses.fi/problemset/task/1702",
            "https://leetcode.com/problems/find-a-corresponding-node-of-a-binary-tree-in-a-clone-of-that-tree/",
            "https://leetcode.com/problems/binary-search-tree-iterator/",
            "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
        ],
    },
    {
        title: "2. Level-Order BFS & Tree Views",
        description:
            "One queue, one level at a time. Every 'view' question — right side, top, bottom, vertical — is level-order with a different bookkeeping key, so learn the skeleton once.",
        links: [
            "https://leetcode.com/problems/average-of-levels-in-binary-tree/",
            "https://leetcode.com/problems/cousins-in-binary-tree/",
            "https://leetcode.com/problems/binary-tree-level-order-traversal/",
            "https://leetcode.com/problems/binary-tree-level-order-traversal-ii/",
            "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
            "https://leetcode.com/problems/find-largest-value-in-each-tree-row/",
            "https://leetcode.com/problems/binary-tree-right-side-view/",
            "https://leetcode.com/problems/deepest-leaves-sum/",
            "https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/",
            "https://leetcode.com/problems/add-one-row-to-tree/",
            "https://leetcode.com/problems/cousins-in-binary-tree-ii/",
            "https://leetcode.com/problems/even-odd-tree/",
            "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/",
            "https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/",
            "https://leetcode.com/problems/find-bottom-left-tree-value/",
            "https://leetcode.com/problems/maximum-width-of-binary-tree/",
            "https://leetcode.com/problems/reverse-odd-levels-of-binary-tree/",
            "https://leetcode.com/problems/kth-largest-sum-in-a-binary-tree/",
            "https://leetcode.com/problems/minimum-number-of-operations-to-sort-a-binary-tree-by-level/",
            "https://leetcode.com/problems/check-completeness-of-a-binary-tree/",
            "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/",
        ],
    },
    {
        title: "3. Tree Properties — Depth, Balance, Symmetry",
        description:
            "Single post-order DFS returning one number per subtree. The recurring idea: compute the child answers first, then combine — and return a sentinel to abort early once a property has already failed.",
        links: [
            "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
            "https://leetcode.com/problems/same-tree/",
            "https://leetcode.com/problems/invert-binary-tree/",
            "https://leetcode.com/problems/symmetric-tree/",
            "https://leetcode.com/problems/minimum-depth-of-binary-tree/",
            "https://leetcode.com/problems/sum-of-left-leaves/",
            "https://leetcode.com/problems/leaf-similar-trees/",
            "https://leetcode.com/problems/merge-two-binary-trees/",
            "https://leetcode.com/problems/univalued-binary-tree/",
            "https://leetcode.com/problems/balanced-binary-tree/",
            "https://leetcode.com/problems/diameter-of-binary-tree/",
            "https://leetcode.com/problems/subtree-of-another-tree/",
            "https://leetcode.com/problems/binary-tree-tilt/",
            "https://leetcode.com/problems/second-minimum-node-in-a-binary-tree/",
            "https://leetcode.com/problems/count-good-nodes-in-binary-tree/",
            "https://leetcode.com/problems/maximum-difference-between-node-and-ancestor/",
            "https://leetcode.com/problems/count-complete-tree-nodes/",
            "https://cses.fi/problemset/task/1700",
            "https://leetcode.com/problems/sum-of-nodes-with-even-valued-grandparent/",
            "https://leetcode.com/problems/binary-tree-pruning/",
        ],
    },
    {
        title: "4. Path Problems — Path Sum Family",
        description:
            "Root-to-leaf paths need a running prefix; any-to-any paths need each node to combine its two best downward arms. Path Sum III is where the prefix-sum-hashmap trick meets trees — a very common follow-up.",
        links: [
            "https://leetcode.com/problems/path-sum/",
            "https://leetcode.com/problems/binary-tree-paths/",
            "https://leetcode.com/problems/path-sum-ii/",
            "https://leetcode.com/problems/sum-root-to-leaf-numbers/",
            "https://leetcode.com/problems/smallest-string-starting-from-leaf/",
            "https://leetcode.com/problems/path-sum-iii/",
            "https://leetcode.com/problems/pseudo-palindromic-paths-in-a-binary-tree/",
            "https://leetcode.com/problems/longest-univalue-path/",
            "https://leetcode.com/problems/longest-zigzag-path-in-a-binary-tree/",
            "https://leetcode.com/problems/insufficient-nodes-in-root-to-leaf-paths/",
            "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
            "https://leetcode.com/problems/longest-path-with-different-adjacent-characters/",
        ],
    },
    {
        title: "5. Tree Construction from Traversals",
        description:
            "Preorder/postorder gives you the root, inorder tells you where the split is. Build the index map first — it is the difference between O(n) and O(n²), and interviewers do look for it.",
        links: [
            "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/",
            "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
            "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",
            "https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/",
            "https://leetcode.com/problems/maximum-binary-tree/",
            "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/",
            "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/",
            "https://leetcode.com/problems/all-possible-full-binary-trees/",
            "https://leetcode.com/problems/create-binary-tree-from-descriptions/",
            "https://leetcode.com/problems/maximum-binary-tree-ii/",
        ],
    },
    {
        title: "6. Binary Search Tree — Validate, Insert, Delete",
        description:
            "The BST invariant is a *range* on each node, not a comparison with the parent — that single misunderstanding is the most common wrong answer to Validate BST. Delete Node is the one worth writing out by hand.",
        links: [
            "https://leetcode.com/problems/search-in-a-binary-search-tree/",
            "https://leetcode.com/problems/minimum-absolute-difference-in-bst/",
            "https://leetcode.com/problems/range-sum-of-bst/",
            "https://leetcode.com/problems/increasing-order-search-tree/",
            "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/",
            "https://leetcode.com/problems/find-mode-in-binary-search-tree/",
            "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
            "https://leetcode.com/problems/validate-binary-search-tree/",
            "https://leetcode.com/problems/trim-a-binary-search-tree/",
            "https://leetcode.com/problems/convert-bst-to-greater-tree/",
            "https://leetcode.com/problems/delete-node-in-a-bst/",
            "https://leetcode.com/problems/balance-a-binary-search-tree/",
            "https://leetcode.com/problems/recover-binary-search-tree/",
        ],
    },
    {
        title: "7. BST as an Ordered Multiset — Order Statistics & Range Queries",
        description:
            "Using a balanced BST or ordered set as a live index: k-th smallest, predecessor, count-in-range. This section overlaps most with quant screens, where running median and online inversion counting are stock questions.",
        links: [
            "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
            "https://leetcode.com/problems/my-calendar-i/",
            "https://leetcode.com/problems/my-calendar-ii/",
            "https://leetcode.com/problems/my-calendar-iii/",
            "https://leetcode.com/problems/find-median-from-data-stream/",
            "https://leetcode.com/problems/contains-duplicate-iii/",
            "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
            "https://www.spoj.com/problems/INVCNT/",
            "https://leetcode.com/problems/count-of-range-sum/",
            "https://leetcode.com/problems/reverse-pairs/",
        ],
    },
    {
        title: "8. Lowest Common Ancestor Family",
        description:
            "On a BST the LCA is the first node that sits between the two values. On a general binary tree it is the first node that sees both sides return non-null. Do them in that order — the BST version explains the general one.",
        links: [
            "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
            "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
            "https://leetcode.com/problems/lowest-common-ancestor-of-deepest-leaves/",
            "https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes/",
            "https://leetcode.com/problems/step-by-step-directions-from-a-binary-tree-node-to-another/",
            "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/",
            "https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected/",
        ],
    },
    {
        title: "9. Serialize, Deserialize & Subtree Hashing",
        description:
            "Encode a tree as a string and get it back. The same canonical-encoding idea powers duplicate-subtree detection, which is the harder follow-up interviewers jump to.",
        links: [
            "https://leetcode.com/problems/construct-string-from-binary-tree/",
            "https://leetcode.com/problems/verify-preorder-serialization-of-a-binary-tree/",
            "https://leetcode.com/problems/find-duplicate-subtrees/",
            "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
            "https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst/",
        ],
    },
    {
        title: "10. Tree DP on Binary Trees",
        description:
            "Each node returns a small tuple — usually (best if I am used, best if I am not). House Robber III is the gateway; Binary Tree Cameras is the one that forces three states instead of two.",
        links: [
            "https://leetcode.com/problems/house-robber-iii/",
            "https://leetcode.com/problems/count-nodes-equal-to-average-of-subtree/",
            "https://leetcode.com/problems/delete-nodes-and-return-forest/",
            "https://leetcode.com/problems/distribute-coins-in-binary-tree/",
            "https://leetcode.com/problems/number-of-good-leaf-nodes-pairs/",
            "https://leetcode.com/problems/count-nodes-with-the-highest-score/",
            "https://leetcode.com/problems/number-of-nodes-in-the-sub-tree-with-the-same-label/",
            "https://leetcode.com/problems/maximum-score-after-applying-operations-on-a-tree/",
            "https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/",
            "https://leetcode.com/problems/binary-tree-cameras/",
            "https://leetcode.com/problems/create-components-with-same-value/",
        ],
    },
    {
        title: "11. Rooted Tree Queries — Euler Tour, LCA & Binary Lifting",
        description:
            "Flatten the tree with an Euler tour and subtree queries become range queries. Binary lifting then answers k-th ancestor and LCA in O(log n). This is the CP-grade toolkit behind most 'queries on a tree' problems.",
        links: [
            "https://leetcode.com/problems/operations-on-tree/",
            "https://cses.fi/problemset/task/1674",
            "https://leetcode.com/problems/kth-ancestor-of-a-tree-node/",
            "https://cses.fi/problemset/task/1687",
            "https://cses.fi/problemset/task/1688",
            "https://cses.fi/problemset/task/1135",
            "https://cses.fi/problemset/task/1137",
            "https://cses.fi/problemset/task/1138",
            "https://cses.fi/problemset/task/1136",
            "https://cses.fi/problemset/task/1139",
            "https://cses.fi/problemset/task/2134",
        ],
    },
    {
        title: "12. Centroid Decomposition & Path Counting",
        description:
            "The last tier: split the tree at its centroid so every path is handled once across O(log n) levels of recursion. Only worth reaching for after sections 10 and 11 feel routine.",
        links: [
            "https://cses.fi/problemset/task/2079",
            "https://cses.fi/problemset/task/2080",
            "https://leetcode.com/problems/number-of-good-paths/",
            "https://leetcode.com/problems/count-pairs-of-nodes/",
        ],
    },
    {
        title: "13. Trie (Prefix Tree) Family",
        description:
            "A tree keyed by characters instead of comparisons. Build Implement Trie by hand once, then everything after it is that same node plus one extra field — a count, a word flag, or a wildcard branch.",
        links: [
            "https://leetcode.com/problems/longest-common-prefix/",
            "https://leetcode.com/problems/implement-trie-prefix-tree/",
            "https://leetcode.com/problems/replace-words/",
            "https://leetcode.com/problems/longest-word-in-dictionary/",
            "https://leetcode.com/problems/search-suggestions-system/",
            "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
            "https://leetcode.com/problems/extra-characters-in-a-string/",
            "https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii/",
            "https://leetcode.com/problems/sum-of-prefix-scores-of-strings/",
            "https://leetcode.com/problems/word-search-ii/",
            "https://leetcode.com/problems/prefix-and-suffix-search/",
            "https://leetcode.com/problems/stream-of-characters/",
        ],
    },
];

export default treeSections;
