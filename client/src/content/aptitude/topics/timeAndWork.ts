// src/content/aptitude/topics/timeAndWork.ts

import type { AptitudeTopic } from "@/types";

const timeAndWorkTopic: AptitudeTopic = {
  slug: "time-and-work",
  title: "Time & Work",
  status: "live",
  icon: "⏱️",

  concepts: [
    "The entire job is treated as '1 unit of work'; if a person takes n days to finish it alone, their work rate is 1/n of the work per day.",
    "When people work together, their individual work rates (fractions of work per day) simply add up — this is the single most important idea in the topic.",
    "Efficiency and time taken are inversely proportional: a more 'efficient' worker takes fewer days, and if A is twice as efficient as B, A takes half the time B takes.",
    "Time & Work, Pipes & Cisterns, and Wages-sharing problems are all the same underlying idea — rate × time = work done — just dressed up in different stories.",
    "When wages are to be divided among people who work together, they should be split in the exact ratio of the work each person actually contributed (their individual rates), not equally and not by time.",
    "Using LCM of the given number of days as the 'total work' (instead of treating work as exactly 1 unit) turns fractions into clean whole numbers and dramatically speeds up calculation.",
  ],

  formulas: [
    "Work rate of a person = 1 / (days taken to complete the work alone)",
    "If A and B together can do a work in D days: 1/D = 1/A_days + 1/B_days",
    "Combined time for A and B alone = (A_days × B_days) / (A_days + B_days)",
    "If A, B, C work together: 1/D = 1/A_days + 1/B_days + 1/C_days",
    "Work done = Rate × Time",
    "If M1 men take D1 days to do W1 work, and M2 men take D2 days to do W2 work: M1D1/W1 = M2D2/W2 (also extend with hours per day, H, as M1D1H1/W1 = M2D2H2/W2)",
    "If a person is x times as efficient as another, their time taken is 1/x times the other's time",
    "Wages should be shared in the ratio of the work done, i.e., in the ratio of their individual work rates (equivalently, inverse ratio of the days each would take alone)",
  ],

  tricks: [
    "Assume total work = LCM of all the given number of days (e.g., if A takes 12 days and B takes 15 days, assume total work = LCM(12,15) = 60 units). Then each person's rate becomes a whole number of units/day — much faster than juggling fractions.",
    "For 'A leaves after some days, B finishes the rest' problems, compute work done together first in units, subtract from total units, then divide by the remaining worker's per-day rate.",
    "For efficiency-ratio problems ('A is twice as efficient as B'), directly translate to a rate ratio (rate_A : rate_B = 2 : 1) and work in units — never convert to days first.",
    "For wages-division problems, skip computing money after finding time; just take the ratio of rates (= inverse ratio of days alone) and split the total wage in that ratio directly.",
    "For men-days-work problems, always set up the M×D/W = constant equation instead of trying to reason proportionally in your head — this avoids sign/direction errors when work amount also changes.",
    "When some workers are 'negative' (like an inlet pipe filling and outlet pipe draining), just add their rates algebraically with pipes-draining given a negative sign — it is still the same LCM-of-total-work method.",
  ],

  importantObservations: [
    "Work rates ADD, but the number of DAYS never add directly — a common mistake is averaging or adding days instead of adding rates.",
    "'Twice as efficient' means half the time, not double the time — many students invert this relationship under exam pressure.",
    "When a worker leaves partway through a job, remaining WORK (in units) must be computed first before dividing by the remaining worker's rate — don't just subtract days.",
    "In men-days-work problems, if the amount of work itself changes (e.g., building a wall of a different length), that new work quantity must also enter the M×D/W formula — it isn't purely M×D = constant unless W is unchanged.",
    "Wages must be split by contribution (rate × time actually worked), which, if all workers work the same duration, reduces to splitting in the ratio of their individual one-person rates — not equally among all workers.",
  ],

  solvedExamples: [
    {
      problem: "A can complete a work in 12 days and B can complete the same work in 15 days. In how many days will they complete the work together?",
      steps: [
        "Rate of A = 1/12 work/day, Rate of B = 1/15 work/day",
        "Combined rate = 1/12 + 1/15 = 5/60 + 4/60 = 9/60 = 3/20 work/day",
        "Time taken together = 1 / (3/20) = 20/3 days",
        "= 6 (2/3) days",
      ],
      answer: "6 2/3 days (20/3 days)",
    },
    {
      problem: "A can do a piece of work in 20 days and B can do it in 30 days. They work together with C and finish the whole work in 10 days. In how many days can C alone do the work?",
      steps: [
        "Rate of A = 1/20, Rate of B = 1/30",
        "Combined rate of A, B, C = 1/10",
        "Rate of C = 1/10 − 1/20 − 1/30",
        "LCM of 10, 20, 30 = 60: Rate of C = 6/60 − 3/60 − 2/60 = 1/60",
        "Time for C alone = 60 days",
      ],
      answer: "60 days",
    },
    {
      problem: "A is thrice as efficient as B. Working together, they can complete a work in 20 days. In how many days can A alone complete the work?",
      steps: [
        "Let rate of B = r, then rate of A = 3r (A is thrice as efficient)",
        "Combined rate = r + 3r = 4r, and this equals 1/20 (they finish together in 20 days)",
        "4r = 1/20, so r = 1/80 (B's rate); A's rate = 3/80",
        "Time for A alone = 1 / (3/80) = 80/3 days",
        "= 26 (2/3) days",
      ],
      answer: "26 2/3 days (80/3 days)",
    },
    {
      problem: "A can do a piece of work in 6 days and B can do it in 8 days. They work together and receive a total wage of ₹2,800 for the work. Find A's share of the wages.",
      steps: [
        "Rate of A = 1/6, Rate of B = 1/8",
        "Ratio of work done (since both work for the same time) = ratio of rates = 1/6 : 1/8 = 4 : 3 (multiplying both by 24)",
        "A's share = 4/(4+3) × 2800 = 4/7 × 2800",
        "= 1600",
      ],
      answer: "₹1,600",
    },
  ],

  practiceQuestions: [
    {
      id: "tw-e1",
      question: "A can complete a work in 10 days. What is A's one-day work?",
      options: ["1/5", "1/10", "1/15", "1/20"],
      correctAnswerIndex: 1,
      answer: "1/10",
      difficulty: "Easy",
      solution: "If A finishes the whole work in 10 days, A's one-day work = 1/10 of the total work.",
    },
    {
      id: "tw-e2",
      question: "A can do a work in 8 days and B can do the same work in 8 days. How long will they take working together?",
      options: ["2 days", "4 days", "6 days", "8 days"],
      correctAnswerIndex: 1,
      answer: "4 days",
      difficulty: "Easy",
      solution: "Combined rate = 1/8 + 1/8 = 2/8 = 1/4 work/day. Time = 1 ÷ (1/4) = 4 days.",
    },
    {
      id: "tw-e3",
      question: "If 5 men can complete a task in 12 days, how many days will 10 men take to complete the same task (assuming equal efficiency)?",
      options: ["3 days", "6 days", "8 days", "10 days"],
      correctAnswerIndex: 1,
      answer: "6 days",
      difficulty: "Easy",
      solution: "Using M1D1 = M2D2 (work constant): 5 × 12 = 10 × D2, so D2 = 60/10 = 6 days.",
    },
    {
      id: "tw-e4",
      question: "A can finish a work in 15 days and B can finish the same work in 10 days. If they work together, what fraction of the work do they finish in 1 day?",
      options: ["1/6", "1/25", "5/30", "1/5"],
      correctAnswerIndex: 0,
      answer: "1/6",
      difficulty: "Easy",
      solution: "Combined rate = 1/15 + 1/10 = 2/30 + 3/30 = 5/30 = 1/6 of the work per day.",
    },
    {
      id: "tw-m1",
      question: "A and B can do a piece of work in 15 days and 10 days respectively. They work together for 2 days and then A leaves. In how many more days will B finish the remaining work?",
      options: ["6 days", "6 2/3 days", "7 days", "8 days"],
      correctAnswerIndex: 1,
      answer: "6 2/3 days",
      difficulty: "Medium",
      solution: "Combined rate = 1/15 + 1/10 = 2/30 + 3/30 = 5/30 = 1/6. Work done in 2 days = 2/6 = 1/3. Remaining work = 2/3. B's rate = 1/10, so days needed = (2/3) ÷ (1/10) = 20/3 = 6 2/3 days.",
    },
    {
      id: "tw-m2",
      question: "12 men can complete a piece of work in 18 days. In how many days can 8 men complete the same work?",
      options: ["24 days", "27 days", "30 days", "32 days"],
      correctAnswerIndex: 1,
      answer: "27 days",
      difficulty: "Medium",
      solution: "M1D1 = M2D2: 12 × 18 = 8 × D2, so D2 = 216/8 = 27 days.",
    },
    {
      id: "tw-m3",
      question: "A, B and C can do a piece of work in 20, 30 and 60 days respectively. In how many days can A finish the work if B and C assist him every third day (i.e., all three work together only on every 3rd day, and A works alone on the other two days of each cycle)?",
      answer: "15 days",
      difficulty: "Medium",
      solution: "A's rate = 1/20 per day. Combined rate of A, B, C = 1/20 + 1/30 + 1/60 = 3/60 + 2/60 + 1/60 = 6/60 = 1/10 per day. In each 3-day cycle, A works alone on days 1 and 2, and all three work together on day 3: work done per cycle = 2×(1/20) + 1×(1/10) = 1/10 + 1/10 = 1/5. Since 1/5 of the work is done every 3-day cycle, exactly 5 such cycles (5 × 3 = 15 days) complete the whole work.",
    },
    {
      id: "tw-m4",
      question: "A can do a work in 18 days. He worked for 6 days and then B finished the remaining work in 8 days. In how many days can B alone finish the whole work?",
      options: ["10 days", "12 days", "14 days", "16 days"],
      correctAnswerIndex: 1,
      answer: "12 days",
      difficulty: "Medium",
      solution: "A's rate = 1/18. Work done by A in 6 days = 6/18 = 1/3. Remaining work = 2/3, done by B in 8 days, so B's rate = (2/3)/8 = 1/12. B alone takes 12 days.",
    },
    {
      id: "tw-m5",
      question: "Two pipes A and B can fill a tank in 24 minutes and 32 minutes respectively. If both pipes are opened together, in how many minutes will the tank be full?",
      answer: "13 5/7 minutes",
      difficulty: "Medium",
      solution: "Combined rate = 1/24 + 1/32. LCM of 24 and 32 = 96: rate = 4/96 + 3/96 = 7/96 per minute. Time to fill = 96/7 = 13 5/7 minutes.",
    },
    {
      id: "tw-h1",
      question: "A can do a work in 24 days, B in 30 days, and C in 40 days. All three start the work together, but A leaves 4 days before completion and B leaves 1 day before completion (C works right till the end). Find the total number of days taken to complete the work.",
      answer: "12 days",
      difficulty: "Hard",
      solution: "Take total work = LCM(24, 30, 40) = 120 units. Rates: A = 120/24 = 5 units/day, B = 120/30 = 4 units/day, C = 120/40 = 3 units/day. Let total days = D. A works (D−4) days, B works (D−1) days, C works D days. Equation: 5(D−4) + 4(D−1) + 3D = 120 → 5D−20+4D−4+3D = 120 → 12D−24 = 120 → 12D = 144 → D = 12. So the work is completed in 12 days (A works 8 days, B works 11 days, C works all 12 days: 5×8+4×11+3×12 = 40+44+36 = 120, confirming the total work is exactly finished).",
    },
    {
      id: "tw-h2",
      question: "40 men can complete a project in 60 days working 8 hours a day. How many men are needed to complete the same project in 40 days working 6 hours a day?",
      answer: "80 men",
      difficulty: "Hard",
      solution: "Use M1D1H1 = M2D2H2 (work constant): 40 × 60 × 8 = M2 × 40 × 6. Left side = 19,200. So M2 = 19200/(40×6) = 19200/240 = 80 men.",
    },
    {
      id: "tw-h3",
      question: "A and B can complete a work together in 12 days. After working together for 3 days, B leaves, and A alone completes the remaining work in 18 more days. In how many days can A alone complete the entire work?",
      answer: "24 days",
      difficulty: "Hard",
      solution: "Combined rate of A and B = 1/12. Work done together in 3 days = 3/12 = 1/4. Remaining work = 3/4, done by A alone in 18 days, so A's rate = (3/4)/18 = 1/24. Hence A alone takes 24 days to complete the entire work.",
    },
  ],
};

export default timeAndWorkTopic;
