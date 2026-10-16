// src/constants/platforms.js

import lcLogo from "@/assets/lc.svg";
import gfgLogo from "@/assets/gfg.svg";
import csesLogo from "@/assets/cses.svg";
import cfLogo from "@/assets/cf.svg";
import atcoderLogo from "@/assets/atcoder.svg";
import codechefLogo from "@/assets/codechef.svg";
import spojLogo from "@/assets/spoj.svg";
import hackerrankLogo from "@/assets/hackerrank.svg";
import interviewbitLogo from "@/assets/interviewbit.svg";
import code360Logo from "@/assets/code360.svg";
import uvaLogo from "@/assets/uva.svg";
import timusLogo from "@/assets/timus.svg";
import kattisLogo from "@/assets/kattis.svg";

/**
 * Maps the platform keys returned by getPlatform() in utils/url.js to their
 * logo assets. A key with no entry here simply renders without a logo.
 *
 * @type {Record<string, string>}
 */
const platformLogos = {
    lc: lcLogo,                     // LeetCode
    gfg: gfgLogo,                   // GeeksforGeeks
    cses: csesLogo,                 // CSES Problem Set
    cf: cfLogo,                     // Codeforces
    atcoder: atcoderLogo,           // AtCoder
    codechef: codechefLogo,         // CodeChef
    spoj: spojLogo,                 // SPOJ
    hackerrank: hackerrankLogo,     // HackerRank
    interviewbit: interviewbitLogo, // InterviewBit
    code360: code360Logo,           // Naukri Code360 (formerly Coding Ninjas)
    uva: uvaLogo,                   // UVa Online Judge
    timus: timusLogo,               // Timus Online Judge
    kattis: kattisLogo,             // Kattis
    // Lower-volume judges (SGU, oj.uz, LightOJ, e-olymp, Szkopul, TopCoder,
    // vjudge, HackerEarth, DevSkill) intentionally have no logo — getPlatform
    // still labels them, and ProblemItem simply renders no image.
};

export default platformLogos;
