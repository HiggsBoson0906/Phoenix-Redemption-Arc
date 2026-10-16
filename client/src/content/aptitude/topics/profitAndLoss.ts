// src/content/aptitude/topics/profitAndLoss.ts

import type { AptitudeTopic } from "@/types";

const profitAndLossTopic: AptitudeTopic = {
  slug: "profit-and-loss",
  title: "Profit & Loss",
  status: "live",
  icon: "💰",

  concepts: [
    "Cost Price (CP) is what the seller paid to acquire/produce the item; Selling Price (SP) is what the buyer pays the seller for it.",
    "Profit occurs when SP > CP, and Loss occurs when SP < CP — profit/loss is always calculated as a percentage of the Cost Price, never of the Selling Price, unless explicitly stated otherwise.",
    "Marked Price (MP) is the label/listed price before any discount; the actual discount is always applied on MP, and SP = MP − Discount.",
    "A trader may manipulate CP or SP using false weights, extra discounts, or dual markdowns — these problems require tracking the ratio of goods actually given vs. paid for.",
    "When multiple items are sold at the same SP but with a profit on one and an equal-percentage loss on the other, the overall result is always a net loss (never break-even), because the CPs are not equal.",
  ],

  formulas: [
    "Profit = SP − CP, Loss = CP − SP",
    "Profit % = (Profit / CP) × 100, Loss % = (Loss / CP) × 100",
    "SP = CP × (100 + Profit%) / 100 (when there's a profit)",
    "SP = CP × (100 − Loss%) / 100 (when there's a loss)",
    "CP = SP × 100 / (100 + Profit%) (when there's a profit)",
    "CP = SP × 100 / (100 − Loss%) (when there's a loss)",
    "Discount = MP − SP, Discount % = (Discount / MP) × 100",
    "SP = MP × (100 − Discount%) / 100",
    "If an article is sold at two successive discounts of d1% and d2%, effective discount % = d1 + d2 − (d1 × d2)/100",
    "When equal SP with x% profit on one item and x% loss on another, net result is always a loss of (x²/100)% of the total CP",
  ],

  tricks: [
    "Use the multiplying-factor method: a 20% profit means SP = 1.20 × CP; a 15% loss means SP = 0.85 × CP — this avoids repeated formula lookups and speeds up chained calculations.",
    "For 'sold at equal SP, one at x% profit, other at x% loss' questions, skip individual CP calculations — the answer is always a net loss of x²/100 % of the sum of CPs (or 2×CP if SP is same and profit/loss % equal).",
    "For successive discounts, convert to multiplying factors and multiply: two discounts of 10% and 20% give an effective single discount of 1 − (0.90 × 0.80) = 1 − 0.72 = 28%, not 30%.",
    "When a shopkeeper uses a false weight (claims to sell 1000g but actually gives less), Profit % = [(True weight − False weight) / False weight] × 100 — treat it like a straightforward CP-SP substitution problem.",
    "For 'marked price above cost price so that after discount there's still a profit' questions, chain the factors: MP = CP × (100+Profit%)/(100−Discount%) × 100, derived by combining the discount and profit formulas.",
    "Always re-read whether the % given is on CP or SP — a small number of questions deliberately state 'profit % on SP' as a trap; convert using Profit%(on SP) → Profit%(on CP) = [P/(100−P)]×100 if needed.",
  ],

  importantObservations: [
    "Profit or loss percentage is calculated on Cost Price by default — using SP as the base without being told to is the most common mistake in this topic.",
    "A discount is always calculated on the Marked Price, not on the Cost Price — MP and CP are two entirely different reference points that many students conflate.",
    "In 'equal SP, x% profit and x% loss' problems, the outcome is always a loss overall, and the loss percentage is x²/100 %, regardless of what x is — this is a fixed, testable identity.",
    "Successive discounts/markups are multiplicative (like successive percentage changes), not additive — combine them using multiplying factors, not by simply adding the percentages.",
    "When false weight or false measurement is used, treat 'goods actually given' as the effective CP base and 'goods claimed/paid for' as the effective SP base to correctly compute the seller's real profit %.",
  ],

  solvedExamples: [
    {
      problem: "A shopkeeper buys a table for ₹1,200 and sells it for ₹1,500. Find his profit percentage.",
      steps: [
        "Profit = SP − CP = 1500 − 1200 = 300",
        "Profit % = (Profit / CP) × 100",
        "= (300 / 1200) × 100",
        "= 25%",
      ],
      answer: "25%",
    },
    {
      problem: "A man sold an article for ₹720 and incurred a loss of 10%. Find the cost price of the article.",
      steps: [
        "SP = CP × (100 − Loss%) / 100",
        "720 = CP × (100 − 10) / 100 = CP × 0.90",
        "CP = 720 / 0.90",
        "= 800",
      ],
      answer: "₹800",
    },
    {
      problem: "A trader marks his goods 40% above the cost price and then allows a discount of 25% on the marked price. Find his profit or loss percentage.",
      steps: [
        "Let CP = 100. Marked Price = 100 × 1.40 = 140",
        "SP = MP × (100 − Discount%)/100 = 140 × 0.75",
        "= 105",
        "Since SP (105) > CP (100), Profit = 105 − 100 = 5",
        "Profit % = (5/100) × 100 = 5%",
      ],
      answer: "5% profit",
    },
    {
      problem: "A dishonest dealer professes to sell his goods at cost price but uses a weight of 900g instead of 1kg. Find his profit percentage.",
      steps: [
        "He claims to give 1000g (charges CP for 1000g) but actually gives only 900g",
        "Effective CP for the dealer = cost of 900g, Effective SP charged = cost of 1000g",
        "Profit = cost of (1000 − 900)g = cost of 100g",
        "Profit % = (100 / 900) × 100",
        "= 11.11%",
      ],
      answer: "11.11% (i.e., 100/9 %)",
    },
  ],

  practiceQuestions: [
    {
      id: "pl-e1",
      question: "A man buys a pen for ₹50 and sells it for ₹60. Find his profit percentage.",
      options: ["10%", "15%", "20%", "25%"],
      correctAnswerIndex: 2,
      answer: "20%",
      difficulty: "Easy",
      solution: "Profit = 60 − 50 = 10. Profit % = (10/50) × 100 = 20%.",
    },
    {
      id: "pl-e2",
      question: "An item bought for ₹800 is sold at a loss of 15%. Find the selling price.",
      options: ["₹660", "₹680", "₹700", "₹720"],
      correctAnswerIndex: 1,
      answer: "₹680",
      difficulty: "Easy",
      solution: "SP = CP × (100 − 15)/100 = 800 × 0.85 = 680.",
    },
    {
      id: "pl-e3",
      question: "A shopkeeper marks an item at ₹500 and offers a discount of 10%. What is the selling price?",
      options: ["₹440", "₹450", "₹460", "₹470"],
      correctAnswerIndex: 1,
      answer: "₹450",
      difficulty: "Easy",
      solution: "SP = MP × (100 − Discount%)/100 = 500 × 0.90 = 450.",
    },
    {
      id: "pl-e4",
      question: "If the cost price of 10 pens equals the selling price of 8 pens, find the profit percentage.",
      options: ["20%", "22.5%", "25%", "30%"],
      correctAnswerIndex: 2,
      answer: "25%",
      difficulty: "Easy",
      solution: "Let CP of 1 pen = ₹1, so CP of 10 pens = ₹10 = SP of 8 pens. SP of 1 pen = 10/8 = 1.25. Profit % = (1.25 − 1)/1 × 100 = 25%.",
    },
    {
      id: "pl-m1",
      question: "A trader allows a discount of 10% on the marked price and still makes a profit of 26%. If the cost price of the article is ₹500, find the marked price.",
      options: ["₹680", "₹700", "₹720", "₹750"],
      correctAnswerIndex: 1,
      answer: "₹700",
      difficulty: "Medium",
      solution: "SP = CP × 1.26 = 500 × 1.26 = 630. MP × 0.90 = 630, so MP = 630/0.90 = 700.",
    },
    {
      id: "pl-m2",
      question: "By selling 45 lemons for ₹40, a woman loses 20%. How many lemons should she sell for ₹24 to gain 20% on the transaction?",
      options: ["10", "12", "15", "18"],
      correctAnswerIndex: 3,
      answer: "18",
      difficulty: "Medium",
      solution: "SP of 45 lemons = 40, which is 80% of CP. So CP of 45 lemons = 40/0.80 = 50, CP per lemon = 50/45 = 10/9. For 20% gain, new SP per lemon = (10/9) × 1.20 = 4/3. Number of lemons for ₹24 = 24 ÷ (4/3) = 18.",
    },
    {
      id: "pl-m3",
      question: "A man sold two watches for ₹1,955 each. On one he gained 15% and on the other he lost 15%. Find his overall gain or loss.",
      options: ["Loss of 2.25%", "Gain of 2.25%", "No profit no loss", "Loss of 4.5%"],
      correctAnswerIndex: 0,
      answer: "Loss of 2.25%",
      difficulty: "Medium",
      solution: "Equal SP with equal % profit and loss always results in a net loss of x²/100 % where x = 15, so loss = 225/100 = 2.25%.",
    },
    {
      id: "pl-m4",
      question: "A shopkeeper sells an article at a 20% discount on the marked price but still gains 20% on the cost price. If the marked price is ₹360, find the cost price.",
      options: ["₹220", "₹230", "₹240", "₹250"],
      correctAnswerIndex: 2,
      answer: "₹240",
      difficulty: "Medium",
      solution: "SP = MP × 0.80 = 360 × 0.80 = 288. Since SP = CP × 1.20, CP = 288/1.20 = 240.",
    },
    {
      id: "pl-m5",
      question: "A retailer buys 20 pens for ₹120 and sells them at the rate of ₹8 per pen. Find his gain percentage.",
      options: ["25%", "30%", "33.33%", "40%"],
      correctAnswerIndex: 2,
      answer: "33.33%",
      difficulty: "Medium",
      solution: "CP per pen = 120/20 = 6. SP per pen = 8. Profit per pen = 2. Profit % = (2/6) × 100 = 33.33%.",
    },
    {
      id: "pl-h1",
      question: "A shopkeeper offers successive discounts of 20% and 10% on an item marked at ₹1,000. A customer instead wants a single equivalent discount. What single discount percentage would give the same selling price?",
      answer: "28%",
      difficulty: "Hard",
      solution: "SP after successive discounts = 1000 × 0.80 × 0.90 = 720. Single equivalent discount = (1000 − 720)/1000 × 100 = 28%.",
    },
    {
      id: "pl-h2",
      question: "A man buys two horses for ₹9,600 total. He sells one at a 20% profit and the other at a 15% loss, and finds he neither gains nor loses overall. Find the cost price of the horse sold at a loss.",
      answer: "₹5,486 (approx.)",
      difficulty: "Hard",
      solution: "Let CP of first horse (sold at profit) = x, second (sold at loss) = 9600 − x. Overall no profit/loss means 0.20x = 0.15(9600 − x). So 0.20x + 0.15x = 1440, 0.35x = 1440, x = 4114.29. CP of horse sold at loss = 9600 − 4114.29 = 5485.71 ≈ ₹5,486.",
    },
    {
      id: "pl-h3",
      question: "A dealer buys goods at 20% discount on the marked price. He wants to sell them at a marked price such that after giving a 10% discount to the customer, he still earns a 25% profit on his cost price. If the original marked price was ₹1,000, find his cost price and required selling price.",
      answer: "CP = ₹800, required SP = ₹1,000",
      difficulty: "Hard",
      solution: "CP = MP × (100 − 20)/100 = 1000 × 0.80 = 800. Required SP for 25% profit = CP × 1.25 = 800 × 1.25 = 1000. Check: this SP should be 90% of the new marked price, so new marked price = 1000/0.90 ≈ 1111.11, but the SP itself (which the customer pays) is ₹1,000.",
    },
  ],
};

export default profitAndLossTopic;
