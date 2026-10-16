// src/utils/url.js

import problemTitles from "@/constants/problemTitles";

/**
 * Canonical key for a problem URL: lowercase, no protocol, no "www.", no
 * trailing slash, no hash, and with LeetCode's optional "/description" suffix
 * removed. Used both to look up problemTitles and to make two spellings of the
 * same problem compare equal.
 *
 * The query string is dropped EXCEPT when it carries the problem id — UVa,
 * Timus and friends put the whole identity in the query, so stripping it would
 * collapse every one of their problems onto the same key.
 *
 * @param {string} url
 * @returns {string}
 */
export function normalizeUrl(url) {
    const lower = String(url).trim().toLowerCase();
    const keepsQuery = /[?&](problem|num|task)=/.test(lower);

    const base = lower
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/#.*$/, "");

    return (keepsQuery ? base : base.replace(/\?.*$/, ""))
        .replace(/\/description\/?$/, "")
        .replace(/\/+$/, "");
}

/** kebab-or-snake-case slug -> "Title Case With Spaces". */
function titleCase(slug) {
    return slug
        .split(/[-_%]/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

// Slug-bearing platforms: the URL itself contains a readable problem name, so
// the title is derived instead of being listed in problemTitles.
const SLUG_PATTERNS = [
    // https://leetcode.com/problems/two-sum/
    { re: /leetcode\.com\/problems\/([a-z0-9-]+)/i, name: (s) => titleCase(s) },
    // https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1
    // GFG appends an opaque id to most slugs, sometimes hyphenated
    // ("...-1611555638") and sometimes glued on ("articulation-point2616").
    { re: /geeksforgeeks\.org\/problems\/([a-z0-9-]+)/i, name: (s) => titleCase(s.replace(/-?\d{4,}$/, "")) },
    // https://www.interviewbit.com/problems/max-sum-contiguous-subarray/
    { re: /interviewbit\.com\/problems\/([a-z0-9-]+)/i, name: (s) => titleCase(s) },
    // https://www.hackerrank.com/challenges/crush/problem and the
    // /contests/<contest>/challenges/<slug> form used by contest archives.
    { re: /hackerrank\.com\/(?:contests\/[a-z0-9-]+\/)?challenges\/([a-z0-9-]+)/i, name: (s) => titleCase(s) },
    // https://www.hackerearth.com/practice/algorithms/graphs/.../problem-name/
    { re: /hackerearth\.com\/(?:practice|problem)\/[a-z0-9-/]*?([a-z0-9-]+)\/?$/i, name: (s) => titleCase(s) },
    // https://www.naukri.com/code360/problems/ninja-and-the-tree_3125618
    { re: /(?:naukri\.com\/code360|codingninjas\.com)\/problems\/([a-z0-9-_]+)/i, name: (s) => titleCase(s.replace(/_\d+$/, "")) },
    // https://open.kattis.com/problems/coast
    { re: /open\.kattis\.com\/problems\/([a-z0-9-]+)/i, name: (s) => `Kattis — ${titleCase(s)}` },
    // https://oj.uz/problem/view/IOI15_teams
    { re: /oj\.uz\/problem\/view\/([a-z0-9-_]+)/i, name: (s) => `oj.uz — ${titleCase(s)}` },
    // https://lightoj.com/problem/the-monkey-and-the-oiled-bamboo and the
    // legacy https://lightoj.com/volume_showproblem.php?problem=1086 form.
    { re: /lightoj\.com\/problem\/([a-z0-9-]+)/i, name: (s) => `LightOJ — ${titleCase(s)}` },
    { re: /lightoj\.com\/.*[?&]problem=(\d+)/i, name: (s) => `LightOJ ${s}` },
    // https://devskill.com/CodingProblems/ViewProblem/150 (usually via Wayback)
    { re: /devskill\.com(?::\d+)?\/codingproblems\/viewproblem\/(\d+)/i, name: (s) => `DevSkill problem ${s}` },
    // https://www.e-olymp.com/en/problems/1435
    { re: /e-olymp\.com\/(?:[a-z]{2}\/)?problems\/(\d+)/i, name: (s) => `e-olymp ${s}` },
    // https://vjudge.net/problem/UVA-10305
    { re: /vjudge\.net\/problem\/([a-z0-9-_]+)/i, name: (s) => `vjudge — ${s.toUpperCase()}` },
    // UVa / LiveArchive: the identity lives in ?problem=NNNN
    { re: /(?:uva|livearchive)\.onlinejudge\.org\/.*[?&]problem=(\d+)/i, name: (s) => `UVa problem ${s}` },
    { re: /onlinejudge\.org\/.*[?&]problem=(\d+)/i, name: (s) => `UVa problem ${s}` },
    // http://acm.timus.ru/problem.aspx?space=1&num=1002
    { re: /acm\.timus\.ru\/problem\.aspx\?.*num=(\d+)/i, name: (s) => `Timus ${s}` },
    // http://acm.sgu.ru/problem.php?contest=0&problem=110
    { re: /acm\.sgu\.ru\/problem\.php\?.*problem=(\d+)/i, name: (s) => `SGU ${s}` },
    // https://szkopul.edu.pl/problemset/problem/<hash>/site/
    { re: /szkopul\.edu\.pl\/problemset\/problem\/([a-z0-9_-]+)/i, name: (s) => `Szkopul ${s.slice(0, 8)}` },
    // https://community.topcoder.com/stat?c=problem_statement&pm=10744
    { re: /topcoder\.com\/.*[?&]pm=(\d+)/i, name: (s) => `TopCoder pm${s}` },
];

/**
 * Human-readable problem name for a URL.
 *
 * Resolution order: explicit title registry (for id-only URLs such as CSES 1633
 * or Codeforces 455/A) -> a slug or id derived from the URL -> a
 * "<Platform> — <last path segment>" best effort. Never returns a bare URL,
 * because a raw URL in the problem list is unreadable.
 *
 * @param {string} url - The problem URL.
 * @returns {string} - The formatted problem name.
 */
export function extractProblemName(url) {
    // Wayback-archived links wrap the real URL; resolve against the original.
    const archived = String(url).match(/web\.archive\.org\/web\/[^/]+\/(https?:\/\/.+)$/i);
    if (archived) return extractProblemName(archived[1]);

    const registered = problemTitles[normalizeUrl(url)];
    if (registered) return registered;

    for (const { re, name } of SLUG_PATTERNS) {
        const match = url.match(re);
        if (match) return name(match[1]);
    }

    return fallbackName(url);
}

/** Best-effort readable label for a judge we have no specific rule for. */
function fallbackName(url) {
    const label = PLATFORM_LABELS[getPlatform(url)];
    const path = String(url).replace(/^https?:\/\//, "").replace(/[?#].*$/, "");
    const segment = path.split("/").filter(Boolean).pop();
    if (!segment || segment === path) return label;
    return `${label} — ${titleCase(segment.replace(/\.(html?|php|aspx)$/i, ""))}`;
}

// Ordered longest-host-first so that e.g. naukri.com/code360 is matched before
// any broader rule could claim it.
const PLATFORM_PATTERNS = [
    ["lc", /leetcode\.com/i],
    ["gfg", /geeksforgeeks\.org/i],
    ["cses", /cses\.fi/i],
    ["cf", /codeforces\.com/i],
    ["atcoder", /atcoder\.jp/i],
    ["codechef", /codechef\.com/i],
    ["spoj", /spoj\.com/i],
    ["hackerrank", /hackerrank\.com/i],
    ["hackerearth", /hackerearth\.com/i],
    ["interviewbit", /interviewbit\.com/i],
    ["code360", /naukri\.com\/code360|codingninjas\.com/i],
    ["uva", /(?:uva|livearchive)?\.?onlinejudge\.org/i],
    ["timus", /acm\.timus\.ru/i],
    ["sgu", /acm\.sgu\.ru/i],
    ["kattis", /open\.kattis\.com/i],
    ["ojuz", /oj\.uz/i],
    ["lightoj", /lightoj\.com/i],
    ["eolymp", /e-olymp\.com/i],
    ["szkopul", /szkopul\.edu\.pl/i],
    ["topcoder", /topcoder\.com/i],
    ["vjudge", /vjudge\.net/i],
    ["devskill", /devskill\.com/i],
];

/**
 * Returns a short key for the platform, e.g. "lc", "gfg", "cses", "cf".
 * Falls back to "other" for anything unrecognised.
 *
 * @param {string} url - The problem URL.
 * @returns {string}
 */
export function getPlatform(url) {
    const archived = String(url).match(/web\.archive\.org\/web\/[^/]+\/(https?:\/\/.+)$/i);
    const target = archived ? archived[1] : url;
    for (const [key, re] of PLATFORM_PATTERNS) {
        if (re.test(target)) return key;
    }
    return "other";
}

/** Display label for a platform key, used for logo alt text and tooltips. */
export const PLATFORM_LABELS = {
    lc: "LeetCode",
    gfg: "GeeksforGeeks",
    cses: "CSES",
    cf: "Codeforces",
    atcoder: "AtCoder",
    codechef: "CodeChef",
    spoj: "SPOJ",
    hackerrank: "HackerRank",
    hackerearth: "HackerEarth",
    interviewbit: "InterviewBit",
    code360: "Naukri Code360",
    uva: "UVa Online Judge",
    timus: "Timus",
    sgu: "SGU",
    kattis: "Kattis",
    ojuz: "oj.uz",
    lightoj: "LightOJ",
    eolymp: "e-olymp",
    szkopul: "Szkopul",
    topcoder: "TopCoder",
    vjudge: "vjudge",
    devskill: "DevSkill",
    other: "External",
};
