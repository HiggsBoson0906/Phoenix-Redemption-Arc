// src/content/aptitude/topics/percentage.ts

import type { AptitudeTopic } from "@/types";

const percentageTopic: AptitudeTopic = {
  slug: "percentage",
  title: "Percentage",
  status: "live",
  icon: "📊",

  concepts: [
    "Percentage means 'per hundred' — x% is simply the fraction x/100, so it is just another way to write a fraction or a ratio out of 100.",
    "To convert a fraction to a percentage, multiply it by 100. To convert a percentage to a fraction/decimal, divide it by 100.",
    "Percentage change measures how much a quantity has grown or shrunk relative to its original (starting) value — the original value is always the denominator.",
    "Successive percentage changes (one after another) do not simply add up; each change acts on the new value left behind by the previous change.",
    "In OA questions, percentage is rarely asked in isolation — it is the backbone of profit & loss, simple/compound interest, discounts, and data interpretation, so speed here compounds everywhere else.",
    "'Percentage of a percentage' and 'percentage points' are different things — a rise from 20% to 25% is a rise of 5 percentage points, but a 25% relative increase in the rate itself.",
  ],

  formulas: [
    "Percentage value = (Given value / Total value) × 100",
    "Value corresponding to x% of N = (x/100) × N",
    "Percentage change = ((New Value − Old Value) / Old Value) × 100",
    "If A is x% more than B, then B is less than A by [x / (100 + x)] × 100 %",
    "If A is x% less than B, then B is more than A by [x / (100 − x)] × 100 %",
    "Net effect of two successive percentage changes of x% and y%: Net % = x + y + (xy / 100), using negative sign for a decrease",
    "New value after r% increase, applied n times = P × (1 + r/100)ⁿ",
    "If the price of an item increases by x%, quantity consumption must be reduced by [x / (100 + x)] × 100 % to keep expenditure constant",
    "Percentage point change = (New % − Old %), a plain subtraction of two percentages, NOT a ratio",
  ],

  tricks: [
    "Memorize fraction equivalents: 50% = 1/2, 33.33% = 1/3, 25% = 1/4, 20% = 1/5, 16.67% = 1/6, 12.5% = 1/8, 11.11% = 1/9, 10% = 1/10 — converting to fractions makes mental multiplication far faster than long decimal math.",
    "To find x% of N quickly, use the 'flip trick': x% of N = N% of x (e.g., 8% of 50 = 50% of 8 = 4). Pick whichever order is easier to compute mentally.",
    "Break awkward percentages into easy chunks: 17% of 300 = 10% of 300 + 5% of 300 + 2% of 300 = 30 + 15 + 6 = 51.",
    "For successive changes, convert each to a multiplying factor and multiply them together instead of adding percentages: +10% then −10% → 1.10 × 0.90 = 0.99, i.e. a net 1% decrease, not 0%.",
    "When a quantity increases by x% and you need the value that must decrease to restore the original, remember the denominator flips: increase by x% → decrease by [x/(100+x)]×100%.",
    "For 'A is what % more/less than B' questions, always divide the difference by B's value (the one you are comparing against), never by A.",
  ],

  importantObservations: [
    "A percentage increase followed by an equal percentage decrease never brings you back to the original value — there is always a net decrease, because the decrease is calculated on a larger base.",
    "If a value first increases by x% and then decreases by x%, the net change is always −x²/100 % (a loss), which is the same magnitude as decrease-then-increase.",
    "Watch the base carefully in 'increase/decrease from A to B' vs 'B is what percent of A' — swapping numerator and denominator is the single most common error in percentage questions.",
    "'Percentage points' and '%' are not interchangeable: going from a 40% pass rate to a 50% pass rate is a 10 percentage-point rise but a 25% relative rise (10/40 × 100).",
    "When population/value changes every year by a different rate, you cannot average the rates directly — you must apply each year's multiplying factor in sequence (compounding), not just average them.",
  ],

  solvedExamples: [
    {
      problem: "What is 24% of 350?",
      steps: [
        "24% of 350 = (24/100) × 350",
        "= 24 × 3.5",
        "= 84",
      ],
      answer: "84",
    },
    {
      problem: "In an exam, a student scored 462 marks out of 600. What percentage of marks did the student get?",
      steps: [
        "Percentage = (Obtained marks / Total marks) × 100",
        "= (462 / 600) × 100",
        "= 46200 / 600",
        "= 77%",
      ],
      answer: "77%",
    },
    {
      problem: "The price of sugar is increased by 20%. By what percentage must a family reduce its consumption of sugar so that the expenditure remains unchanged?",
      steps: [
        "Use the formula: reduction % = [x / (100 + x)] × 100, where x = 20",
        "= [20 / (100 + 20)] × 100",
        "= [20 / 120] × 100",
        "= 2000/120",
        "= 16.67%",
      ],
      answer: "16.67% (i.e., 1/6 of the original consumption)",
    },
    {
      problem: "A number is first increased by 25% and then decreased by 20%. Find the net percentage change.",
      steps: [
        "Convert each change to a multiplying factor: increase of 25% → 1.25, decrease of 20% → 0.80",
        "Net multiplying factor = 1.25 × 0.80 = 1.00",
        "Net change = (1.00 − 1) × 100 = 0%",
        "So the number returns exactly to its original value — no net change",
      ],
      answer: "0% (no net change)",
    },
  ],

  practiceQuestions: [
    {
      id: "percentage-e1",
      question: "What is 15% of 200?",
      options: ["20", "25", "30", "35"],
      correctAnswerIndex: 2,
      answer: "30",
      difficulty: "Easy",
      solution: "15% of 200 = (15/100) × 200 = 15 × 2 = 30.",
    },
    {
      id: "percentage-e2",
      question: "40 is what percent of 160?",
      options: ["20%", "25%", "30%", "40%"],
      correctAnswerIndex: 1,
      answer: "25%",
      difficulty: "Easy",
      solution: "Required % = (40/160) × 100 = 2500/100 = 25%.",
    },
    {
      id: "percentage-e3",
      question: "A student needs 40% marks to pass. He scored 130 marks and failed by 30 marks. What is the maximum marks for the exam?",
      options: ["350", "375", "400", "425"],
      correctAnswerIndex: 2,
      answer: "400",
      difficulty: "Easy",
      solution: "Passing marks = 130 + 30 = 160. Passing marks = 40% of maximum marks, so maximum marks = 160 / 0.40 = 400.",
    },
    {
      id: "percentage-e4",
      question: "If 60% of a number is 72, what is the number?",
      options: ["100", "110", "120", "130"],
      correctAnswerIndex: 2,
      answer: "120",
      difficulty: "Easy",
      solution: "Let the number be N. 60% of N = 72 → 0.60N = 72 → N = 72/0.60 = 120.",
    },
    {
      id: "percentage-m1",
      question: "The population of a town is 26,250. It increases by 4% in the first year and decreases by 5% in the second year. Find the population after 2 years.",
      options: ["25,935", "25,987", "25,900", "26,000"],
      correctAnswerIndex: 0,
      answer: "25,935",
      difficulty: "Medium",
      solution: "After year 1: 26,250 × 1.04 = 27,300. After year 2: 27,300 × 0.95 = 25,935. So the population after 2 years is 25,935.",
    },
    {
      id: "percentage-m2",
      question: "In an election between two candidates, one candidate got 55% of the total valid votes. 20% of the total votes were invalid. If the total number of votes was 7,500, find the number of valid votes the other candidate got.",
      options: ["2,700", "2,500", "2,600", "2,800"],
      correctAnswerIndex: 0,
      answer: "2,700",
      difficulty: "Medium",
      solution: "Valid votes = 80% of 7,500 = 6,000. Other candidate got 45% of valid votes = 0.45 × 6,000 = 2,700.",
    },
    {
      id: "percentage-m3",
      question: "A's income is 25% more than B's income. By what percentage is B's income less than A's income?",
      options: ["20%", "25%", "16.67%", "22.5%"],
      correctAnswerIndex: 0,
      answer: "20%",
      difficulty: "Medium",
      solution: "Using the formula, if A is x% more than B, B is less than A by [x/(100+x)]×100 = [25/125]×100 = 20%.",
    },
    {
      id: "percentage-m4",
      question: "Two numbers are respectively 20% and 50% more than a third number. What percentage is the first number of the second number?",
      options: ["70%", "80%", "75%", "60%"],
      correctAnswerIndex: 1,
      answer: "80%",
      difficulty: "Medium",
      solution: "Let the third number be 100. First number = 120, second number = 150. Required % = (120/150) × 100 = 80%.",
    },
    {
      id: "percentage-m5",
      question: "A shopkeeper marks up his goods by 40% and then gives a discount of 10% on the marked price. What is his overall percentage gain?",
      options: ["24%", "26%", "30%", "36%"],
      correctAnswerIndex: 1,
      answer: "26%",
      difficulty: "Medium",
      solution: "Net factor = 1.40 × 0.90 = 1.26, i.e., a net gain of 26% over the cost price.",
    },
    {
      id: "percentage-h1",
      question: "In an examination, 35% of total students failed in Math, 45% failed in English, and 20% failed in both subjects. Find the percentage of students who passed in both subjects.",
      options: ["35%", "40%", "45%", "30%"],
      correctAnswerIndex: 1,
      answer: "40%",
      difficulty: "Hard",
      solution: "Failed in at least one subject = 35% + 45% − 20% = 60% (by set union). So passed in both = 100% − 60% = 40%.",
    },
    {
      id: "percentage-h2",
      question: "The salary of an employee is first increased by 20% and then decreased by 20%. If his new salary is ₹19,200, what was his original salary?",
      answer: "₹20,000",
      difficulty: "Hard",
      solution: "Net factor = 1.20 × 0.80 = 0.96 of the original. So original salary = 19,200 / 0.96 = ₹20,000.",
    },
    {
      id: "percentage-h3",
      question: "In a college, 60% of the students are boys and the rest are girls. 75% of the boys and 40% of the girls passed an exam. What percentage of the total students passed?",
      answer: "61%",
      difficulty: "Hard",
      solution: "Assume total students = 100. Boys = 60, girls = 40. Boys passed = 75% of 60 = 45. Girls passed = 40% of 40 = 16. Total passed = 45 + 16 = 61, which is 61% of the total.",
    },
  ],
};

export default percentageTopic;
