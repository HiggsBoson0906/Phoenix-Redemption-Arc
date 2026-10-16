// src/content/aptitude/topics/numberSystem.ts

import type { AptitudeTopic } from "@/types";

const numberSystemTopic: AptitudeTopic = {
  slug: "number-system",
  title: "Number System",
  status: "live",
  icon: "🔢",

  concepts: [
    "Natural numbers (1, 2, 3, ...), whole numbers (0, 1, 2, ...), integers (..., −1, 0, 1, ...), rational numbers (p/q form), and real numbers form nested categories — every OA question implicitly assumes you know which set a number belongs to.",
    "A prime number has exactly two distinct factors (1 and itself); a composite number has more than two factors. 1 is neither prime nor composite, and 2 is the only even prime.",
    "HCF (Highest Common Factor) is the largest number that divides two or more numbers exactly; LCM (Lowest Common Multiple) is the smallest number that is divisible by two or more numbers — they are 'opposite' operations on the same set of numbers.",
    "Divisibility rules let you check if a number is divisible by another without doing full division — essential for speed in OA rounds where a calculator often isn't allowed.",
    "The unit digit of a large power follows a repeating cycle (of length at most 4) based on the base's unit digit — this converts an impossible-looking power calculation into simple modular arithmetic.",
    "Remainder problems rely on modular arithmetic: if a number leaves remainder r when divided by d, it can be written as (d × k) + r for some integer k — this representation underlies almost all 'find the remainder/smallest number' problems.",
  ],

  formulas: [
    "For any two numbers a, b: HCF(a, b) × LCM(a, b) = a × b",
    "LCM of fractions = LCM(numerators) / HCF(denominators); HCF of fractions = HCF(numerators) / LCM(denominators)",
    "Divisibility by 2: last digit is even. By 3: sum of digits divisible by 3. By 4: last two digits divisible by 4. By 5: last digit is 0 or 5. By 6: divisible by both 2 and 3. By 8: last three digits divisible by 8. By 9: sum of digits divisible by 9. By 11: (sum of digits at odd places − sum of digits at even places) is divisible by 11 (including 0).",
    "Sum of first n natural numbers = n(n+1)/2",
    "Sum of first n odd numbers = n²",
    "Sum of squares of first n natural numbers = n(n+1)(2n+1)/6",
    "Sum of cubes of first n natural numbers = [n(n+1)/2]²",
    "Number of factors of N = (p1+1)(p2+1)...(pk+1), where N = a1^p1 × a2^p2 × ... × ak^pk is the prime factorization",
    "To find the largest n-digit number divisible by d: subtract (largest n-digit number mod d) from the largest n-digit number",
    "To find the smallest number to be added to N to make it divisible by d: add (d − (N mod d)) if N mod d ≠ 0, else add 0",
  ],

  tricks: [
    "Memorize divisibility rules for 2, 3, 4, 5, 6, 8, 9, 11 cold — they eliminate long division entirely and are used constantly inside bigger problems (factor-finding, remainder problems, HCF/LCM).",
    "For unit-digit-of-a-power questions, find the cyclicity of the base's last digit (cycle length is 1, 2, or 4) — e.g., 7 cycles as 7,9,3,1 repeating every 4 powers, so 7^95 has the same unit digit as 7^(95 mod 4) = 7^3, i.e., 3.",
    "To quickly find HCF of two numbers, use the Euclidean algorithm (repeated division: HCF(a,b) = HCF(b, a mod b)) instead of listing all factors — much faster for large numbers.",
    "For 'smallest/largest number divisible by several numbers' problems, first find the LCM of the given numbers, then adjust up/down to the required digit range.",
    "Remainder problems of the form 'leaves remainder r1 with d1, r2 with d2, ...' are fastest solved by checking if (d1 − r1) = (d2 − r2) = ... = k; if so, the answer is LCM(d1,d2,...) − k.",
    "For counting trailing zeroes in a factorial (n!), count the number of times 5 is a factor (since 2s are always more abundant): trailing zeroes = floor(n/5) + floor(n/25) + floor(n/125) + ...",
  ],

  importantObservations: [
    "1 is neither prime nor composite — a very common trap in 'how many primes in this list' questions.",
    "0 is an even number and is divisible by every non-zero integer — many students wrongly exclude it from divisibility discussions.",
    "HCF of two numbers can never exceed the smaller of the two numbers, while LCM can never be smaller than the larger of the two numbers — a quick sanity check on your final answer.",
    "When a problem says 'a number when divided by x leaves remainder r,' remember the number is of the form (x·k + r); this form must be substituted correctly into any second condition given in the same problem.",
    "For unit digit cyclicity, digits 0, 1, 5, 6 always repeat themselves (cycle length 1); 4 and 9 have cycle length 2; 2, 3, 7, 8 have cycle length 4 — mixing these up is the most common cyclicity mistake.",
  ],

  solvedExamples: [
    {
      problem: "Find the largest 4-digit number exactly divisible by 27.",
      steps: [
        "The largest 4-digit number is 9999",
        "Divide 9999 by 27: 9999 ÷ 27 = 370 remainder 9 (since 27 × 370 = 9990)",
        "Subtract the remainder from 9999: 9999 − 9 = 9990",
        "Verify: 9990 ÷ 27 = 370 exactly",
      ],
      answer: "9990",
    },
    {
      problem: "The product of two numbers is 2160 and their HCF is 12. Find their LCM.",
      steps: [
        "Use the identity: HCF × LCM = Product of the two numbers",
        "12 × LCM = 2160",
        "LCM = 2160 / 12",
        "= 180",
      ],
      answer: "180",
    },
    {
      problem: "Find the remainder when 7^100 is divided by 5.",
      steps: [
        "Find the cyclicity of unit digits of powers of 7 modulo 5: 7 mod 5 = 2, 2^1=2, 2^2=4, 2^3=3, 2^4=1 (mod 5), then it repeats every 4 powers",
        "So we need 100 mod 4 = 0, meaning 7^100 mod 5 behaves like 2^4 mod 5",
        "2^4 = 16, and 16 mod 5 = 1",
        "So the remainder is 1",
      ],
      answer: "1",
    },
    {
      problem: "Find the smallest number which, when divided by 5 and 7, leaves a remainder of 3 in each case.",
      steps: [
        "The number must be of the form (LCM(5,7) × k) + 3",
        "LCM(5, 7) = 35 (since 5 and 7 are co-prime)",
        "For the smallest such number, take k = 0... but we need the smallest POSITIVE number satisfying both conditions with remainder 3, so check k=0 gives 3 itself",
        "Verify 3 ÷ 5 leaves remainder 3, and 3 ÷ 7 leaves remainder 3 — both true since 3 is smaller than both divisors",
        "So the smallest such number is 3 (or, if a number greater than the divisors is required, the next one is 35 + 3 = 38)",
      ],
      answer: "3 (next such number: 38)",
    },
  ],

  practiceQuestions: [
    {
      id: "ns-e1",
      question: "Which of the following is a prime number?",
      options: ["51", "57", "59", "63"],
      correctAnswerIndex: 2,
      answer: "59",
      difficulty: "Easy",
      solution: "51 = 3×17, 57 = 3×19, 63 = 7×9, all composite. 59 has no factors other than 1 and itself, so it is prime.",
    },
    {
      id: "ns-e2",
      question: "Find the HCF and LCM of 24 and 36.",
      options: ["HCF=6, LCM=144", "HCF=12, LCM=72", "HCF=8, LCM=108", "HCF=12, LCM=144"],
      correctAnswerIndex: 1,
      answer: "HCF=12, LCM=72",
      difficulty: "Easy",
      solution: "24 = 2³×3, 36 = 2²×3². HCF = 2²×3 = 12. LCM = 2³×3² = 72. Check: 12 × 72 = 864 = 24 × 36. ✓",
    },
    {
      id: "ns-e3",
      question: "Find the smallest number exactly divisible by 12, 15, and 20.",
      options: ["30", "60", "120", "180"],
      correctAnswerIndex: 1,
      answer: "60",
      difficulty: "Easy",
      solution: "LCM(12, 15, 20): 12=2²×3, 15=3×5, 20=2²×5. LCM = 2²×3×5 = 60.",
    },
    {
      id: "ns-e4",
      question: "What is the remainder when 25 is divided by 4?",
      options: ["0", "1", "2", "3"],
      correctAnswerIndex: 1,
      answer: "1",
      difficulty: "Easy",
      solution: "25 = 4 × 6 + 1, so the remainder is 1.",
    },
    {
      id: "ns-m1",
      question: "Find the unit digit of 7^95.",
      options: ["1", "3", "7", "9"],
      correctAnswerIndex: 1,
      answer: "3",
      difficulty: "Medium",
      solution: "Unit digits of powers of 7 cycle every 4: 7, 9, 3, 1. Find 95 mod 4 = 3 (since 95 = 4×23 + 3), so the unit digit matches the 3rd term in the cycle, which is 3.",
    },
    {
      id: "ns-m2",
      question: "Find the sum of the first 20 odd natural numbers.",
      options: ["350", "380", "400", "420"],
      correctAnswerIndex: 2,
      answer: "400",
      difficulty: "Medium",
      solution: "Sum of first n odd numbers = n². For n = 20, sum = 20² = 400.",
    },
    {
      id: "ns-m3",
      question: "Find the smallest number which, when divided by 5, leaves a remainder of 3, and when divided by 7, leaves a remainder of 4.",
      answer: "18",
      difficulty: "Medium",
      solution: "We need n such that n ≡ 3 (mod 5) and n ≡ 4 (mod 7). Testing numbers of the form 5k+3: 3, 8, 13, 18, 23... Check each against mod 7: 18 mod 7 = 4. So n = 18 is the smallest number satisfying both conditions.",
    },
    {
      id: "ns-m4",
      question: "The HCF and LCM of two numbers are 6 and 210 respectively. If one of the numbers is 42, find the other number.",
      options: ["25", "30", "35", "40"],
      correctAnswerIndex: 1,
      answer: "30",
      difficulty: "Medium",
      solution: "Using HCF × LCM = product of the numbers: 6 × 210 = 42 × (other number). 1260 = 42 × other, so other number = 1260/42 = 30.",
    },
    {
      id: "ns-m5",
      question: "Find the largest 3-digit number divisible by 7.",
      options: ["994", "997", "993", "989"],
      correctAnswerIndex: 0,
      answer: "994",
      difficulty: "Medium",
      solution: "Largest 3-digit number is 999. 999 ÷ 7 = 142 remainder 5 (since 7 × 142 = 994). So 999 − 5 = 994 is the largest 3-digit number divisible by 7.",
    },
    {
      id: "ns-h1",
      question: "Find the total number of factors of 360.",
      answer: "24",
      difficulty: "Hard",
      solution: "Prime factorize 360 = 2³ × 3² × 5¹. Number of factors = (3+1)(2+1)(1+1) = 4 × 3 × 2 = 24.",
    },
    {
      id: "ns-h2",
      question: "Find the remainder when 2^100 is divided by 7.",
      answer: "2",
      difficulty: "Hard",
      solution: "Powers of 2 mod 7 cycle every 3: 2^1=2, 2^2=4, 2^3=1 (mod 7), then repeats. Find 100 mod 3 = 1 (since 100 = 3×33+1), so 2^100 mod 7 matches 2^1 mod 7 = 2.",
    },
    {
      id: "ns-h3",
      question: "Find the smallest number that must be added to 1000 to make it exactly divisible by 23.",
      answer: "12",
      difficulty: "Hard",
      solution: "1000 ÷ 23 = 43 remainder 11 (since 23 × 43 = 989, and 1000 − 989 = 11). To reach the next multiple of 23, we need to add (23 − 11) = 12. Check: 1000 + 12 = 1012, and 1012 ÷ 23 = 44 exactly.",
    },
  ],
};

export default numberSystemTopic;
