// src/utils/formatters.js

/**
 * Capitalizes the first letter of each word in a dash/kebab-case string.
 * Example: "longest-increasing-subsequence" → "Longest Increasing Subsequence"
 * @param {string} str
 * @returns {string}
 */
export function capitalizeEachWord(str) {
    if (!str || typeof str !== "string") return str;
    return str
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

/**
 * Formats a numeric count summary as "x / y".
 * @param {number} solved
 * @param {number} total
 * @returns {string}
 */
export function progressSummary(solved, total) {
    return `${solved} / ${total}`;
}
