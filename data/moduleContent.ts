export interface Concept {
  id: string;
  title: string;
  explanation: string;
  keyTakeaway: string;
  example?: string;
  table?: {
    headers: string[];
    rows: (string | number)[][];
  };
  visual?: string; // For ASCII art or image placeholder
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  inputs: string[]; // Account names the user needs to input
  correctChanges: Record<string, number>; // The change in value, e.g., Cash: -18000
  explanation: string;
  hint?: string; // Optional hint for the user
}

export type PracticeContent = 
  | {
      type: 'transaction-simulation';
      title: string;
      context: string;
      startingBalances: Record<string, number>;
      transactions: Transaction[];
    }
  | {
      type: 'analysis';
      title: string;
      scenarios: {
        id: string;
        title?: string;
        context: string;
        tables?: {
          title: string;
          headers: string[];
          rows: (string | number)[][];
          footer?: string[];
        }[];
        questions: {
          id: string;
          text: string;
          type: 'number' | 'text' | 'select';
          options?: string[];
          correctAnswer: string | number;
          explanation: string;
          prefix?: string;
          suffix?: string;
          hint?: string; // Optional hint
        }[];
      }[];
    };

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  feedbackCorrect: string;
  feedbackWrong: string;
}

export interface ModuleContent {
  meta: {
    title: string;
    subtitle: string;
    time: string;
    icon: string;
  };
  concepts: Concept[];
  practice: PracticeContent;
  quiz: QuizQuestion[];
}

export const module1Content: ModuleContent = {
  meta: {
    title: "The Language of Business",
    subtitle: "Understanding accounting fundamentals",
    time: "20 min",
    icon: "📊"
  },
  concepts: [
    {
      id: "m1-c1",
      title: "1. Why Accounting Matters for Data Analysts",
      explanation: "Accounting is the language businesses use to communicate financial performance. As a data analyst working with B2B clients, understanding this language helps you interpret their data correctly, identify pain points in their financial processes, and design better analytics products.",
      keyTakeaway: "Every number in a client's data connects to an accounting concept. Understanding these concepts prevents misinterpretation.",
      example: "When a Wise B2B client asks about 'revenue trends,' they might mean recognized revenue (accounting) or cash received (banking) — these can be very different numbers!"
    },
    {
      id: "m1-c2",
      title: "2. Cash vs Accrual Accounting",
      explanation: "There are two ways to record transactions. Cash accounting records money when it physically moves — received or paid. Accrual accounting records transactions when they're earned or incurred, regardless of when cash moves. Most businesses use accrual accounting because it better matches revenues with the expenses that generated them.",
      table: {
        headers: ["Aspect", "Cash Basis", "Accrual Basis"],
        rows: [
          ["Revenue recorded", "When cash received", "When earned/delivered"],
          ["Expenses recorded", "When cash paid", "When incurred"],
          ["Used by", "Small businesses, personal", "Most companies, required for public"],
          ["Timing", "Immediate", "May differ from cash flow"]
        ]
      },
      keyTakeaway: "Accrual accounting separates 'when money moves' from 'when value is exchanged'.",
      example: "A client pays £12,000 upfront for 12 months of service. Cash accounting shows £12,000 revenue immediately. Accrual accounting shows £1,000 revenue each month."
    },
    {
      id: "m1-c3",
      title: "3. The Accounting Equation",
      explanation: "Every business transaction must keep this equation balanced: Assets = Liabilities + Shareholders' Equity. Assets are what the company owns (cash, equipment, receivables). Liabilities are what it owes (loans, payables, deferred revenue). Equity is the owners' stake (invested capital + retained profits).",
      visual: `
┌─────────────────────────────────────────────┐
│                BALANCE SHEET                │
├─────────────────┬───────────────────────────┤
│                 │        LIABILITIES        │
│     ASSETS      │       (What we owe)       │
│    (What we     ├───────────────────────────┤
│      own)       │          EQUITY           │
│                 │      (Owner's stake)      │
├─────────────────┴───────────────────────────┤
│       Assets = Liabilities + Equity         │
└─────────────────────────────────────────────`,
      keyTakeaway: "Double-entry bookkeeping means every transaction affects at least two accounts while keeping the equation balanced.",
      example: "Company buys a £10,000 server with cash: Assets stay the same (cash ↓£10,000, equipment ↑£10,000). If bought with a loan: Assets ↑£10,000 (equipment), Liabilities ↑£10,000 (loan)."
    },
    {
      id: "m1-c4",
      title: "4. Four Types of Adjusting Entries",
      explanation: "At period end, accountants make adjusting entries to ensure revenues and expenses are recorded in the correct period. There are four main types:",
      table: {
        headers: ["Type", "What Happens", "Example"],
        rows: [
          ["Prepaid Expenses", "Cash paid before expense incurred", "Pay 6 months rent upfront, expense 1 month at a time"],
          ["Deferred Revenue", "Cash received before revenue earned", "Customer pays annual subscription upfront"],
          ["Accrued Expenses", "Expense incurred before cash paid", "Employees worked December, paid in January"],
          ["Accrued Revenue", "Revenue earned before cash received", "Service delivered, invoice sent, payment pending"]
        ]
      },
      keyTakeaway: "Adjusting entries align the timing of accounting records with economic reality.",
      example: "Your B2B client shows high 'Deferred Revenue' — this means customers have paid upfront but service hasn't been delivered yet. It's a liability, not revenue!"
    }
  ],
  practice: {
    type: 'transaction-simulation',
    title: "Exercise: CloudPay Solutions Monthly Close",
    context: "CloudPay Solutions is a B2B payments platform. You're helping their finance team understand the accounting impact of January transactions. Record each transaction's effect on the accounts.",
    startingBalances: {
      "Cash": 50000,
      "Accounts Receivable": 15000,
      "Prepaid Expenses": 0,
      "Equipment": 30000,
      "Deferred Revenue": 0,
      "Accounts Payable": 8000,
      "Share Capital": 70000,
      "Retained Earnings": 17000
    },
    transactions: [
      {
        id: 1,
        date: "Jan 1",
        description: "CloudPay receives £24,000 cash from Enterprise Corp for a 12-month software subscription starting January 1.",
        inputs: ["Cash", "Deferred Revenue", "Revenue"],
        correctChanges: { "Cash": 24000, "Deferred Revenue": 24000, "Revenue": 0 },
        explanation: "Cash is received but revenue isn't earned yet — the service period hasn't started. We record a liability (Deferred Revenue) representing our obligation to provide 12 months of service.",
        hint: "We received cash, so Cash goes up. But since we haven't done the work yet, we owe them service (Liability)."
      },
      {
        id: 2,
        date: "Jan 31",
        description: "Month-end: Recognize January's portion of the Enterprise Corp subscription.",
        inputs: ["Deferred Revenue", "Revenue"],
        correctChanges: { "Deferred Revenue": -2000, "Revenue": 2000 },
        explanation: "After delivering one month of service (£24,000 ÷ 12 = £2,000), we can recognize that portion as revenue and reduce our liability.",
        hint: "Divide the total contract value by 12 months. Move that amount from Liability to Revenue."
      },
      {
        id: 3,
        date: "Jan 5",
        description: "CloudPay pays £18,000 for 6 months of office rent (January–June).",
        inputs: ["Cash", "Prepaid Expenses", "Rent Expense"],
        correctChanges: { "Cash": -18000, "Prepaid Expenses": 18000, "Rent Expense": 0 },
        explanation: "We've paid for 6 months but only 'used' the office in January so far. The payment is an asset (Prepaid Expenses) until we consume each month's rent.",
        hint: "Cash is leaving. Is this an expense immediately, or an asset we will use over 6 months?"
      },
      {
        id: 4,
        date: "Jan 31",
        description: "Month-end: Record January's rent expense.",
        inputs: ["Prepaid Expenses", "Rent Expense"],
        correctChanges: { "Prepaid Expenses": -3000, "Rent Expense": 3000 },
        explanation: "One month's rent (£18,000 ÷ 6 = £3,000) has been 'used up', so we move it from the asset to an expense.",
        hint: "Take the total prepaid amount and divide by 6. Move that from the Asset to the Expense."
      },
      {
        id: 5,
        date: "Jan 20",
        description: "CloudPay provides £8,000 of consulting services to a client. Invoice sent, payment due in 30 days.",
        inputs: ["Accounts Receivable", "Revenue", "Cash"],
        correctChanges: { "Accounts Receivable": 8000, "Revenue": 8000, "Cash": 0 },
        explanation: "Under accrual accounting, revenue is recognized when earned (service delivered), not when cash is received. The receivable represents the client's obligation to pay.",
        hint: "We earned the money (Revenue), but haven't received cash yet. What asset represents a customer's promise to pay?"
      },
      {
        id: 6,
        date: "Jan 25",
        description: "CloudPay receives £10,000 payment from a different client for an invoice sent in December.",
        inputs: ["Cash", "Accounts Receivable", "Revenue"],
        correctChanges: { "Cash": 10000, "Accounts Receivable": -10000, "Revenue": 0 },
        explanation: "This payment relates to December's revenue (already recognized). We're just converting the receivable to cash — no new revenue.",
        hint: "Revenue was already recorded last month. We are just swapping one asset (Receivable) for another (Cash)."
      }
    ]
  },
  quiz: [
    {
      id: 1,
      question: "Under accrual accounting, when is revenue recognized?",
      options: [
        "A) When cash is received",
        "B) When the invoice is sent",
        "C) When goods or services are delivered",
        "D) At the end of the financial year"
      ],
      correctAnswer: 2,
      feedbackCorrect: "Exactly! Accrual accounting recognizes revenue when it's earned — when you've fulfilled your obligation to the customer.",
      feedbackWrong: "Not quite. Accrual accounting focuses on when value is exchanged, not when cash moves. Revenue is recognized when goods/services are delivered."
    },
    {
      id: 2,
      question: "A customer pays £36,000 upfront for a 3-year service contract. How much revenue should be recognized in Year 1?",
      options: [
        "A) £36,000",
        "B) £12,000",
        "C) £0",
        "D) £24,000"
      ],
      correctAnswer: 1,
      feedbackCorrect: "Correct! £36,000 ÷ 3 years = £12,000 per year. The rest remains as Deferred Revenue.",
      feedbackWrong: "Remember: revenue is recognized as you deliver the service. £36,000 over 3 years = £12,000 per year."
    },
    {
      id: 3,
      question: "Which account increases when a company pays rent 6 months in advance?",
      options: [
        "A) Rent Expense",
        "B) Cash",
        "C) Prepaid Expenses",
        "D) Accounts Payable"
      ],
      correctAnswer: 2,
      feedbackCorrect: "Right! Prepaid Expenses is an asset representing future benefit. It converts to Rent Expense as each month passes.",
      feedbackWrong: "When you pay in advance, you're creating an asset (Prepaid Expenses), not an expense. The expense is recognized as you 'use' each month."
    },
    {
      id: 4,
      question: "The accounting equation is:",
      options: [
        "A) Assets = Revenue − Expenses",
        "B) Assets = Liabilities + Equity",
        "C) Profit = Revenue − Costs",
        "D) Cash = Income − Outflows"
      ],
      correctAnswer: 1,
      feedbackCorrect: "Correct! This equation must always balance. Every transaction affects at least two accounts to maintain this balance.",
      feedbackWrong: "The fundamental accounting equation is Assets = Liabilities + Equity. This is the foundation of double-entry bookkeeping."
    },
    {
      id: 5,
      question: "Deferred Revenue is classified as:",
      options: [
        "A) An asset",
        "B) Revenue",
        "C) A liability",
        "D) An expense"
      ],
      correctAnswer: 2,
      feedbackCorrect: "Yes! Deferred Revenue is a liability because you owe the customer future goods/services. You've received their money but haven't delivered yet.",
      feedbackWrong: "Deferred Revenue is a liability — it represents your obligation to deliver goods/services in the future. It becomes revenue only when you fulfill that obligation."
    },
    {
      id: 6,
      question: "A company delivers consulting services worth £5,000 in December but receives payment in January. Under accrual accounting, when is revenue recorded?",
      options: [
        "A) January (when cash received)",
        "B) December (when service delivered)",
        "C) Split between December and January",
        "D) At year-end only"
      ],
      correctAnswer: 1,
      feedbackCorrect: "Exactly! Revenue is recognized when earned (service delivered), regardless of when cash is received.",
      feedbackWrong: "Under accrual accounting, the timing of cash doesn't determine revenue recognition. Revenue is recognized when earned — in this case, December."
    },
    {
      id: 7,
      question: "Which of these is an example of an Accrued Expense?",
      options: [
        "A) Paying rent 3 months in advance",
        "B) Receiving customer payment before delivering service",
        "C) Employee salaries earned in December but paid in January",
        "D) Buying equipment with cash"
      ],
      correctAnswer: 2,
      feedbackCorrect: "Correct! Accrued Expenses are costs you've incurred but haven't paid yet. The expense is recognized when incurred, with a matching liability.",
      feedbackWrong: "Accrued Expenses are expenses incurred before cash is paid. Employees working in December creates December expense, even if paid in January."
    }
  ]
};

export const module2Content: ModuleContent = {
  meta: {
    title: "Reading Financial Statements",
    subtitle: "Connecting the three core statements",
    time: "25 min",
    icon: "📋"
  },
  concepts: [
    {
      id: "m2-c1",
      title: "1. The Balance Sheet",
      explanation: "The Balance Sheet is a snapshot of what a company owns and owes at a specific point in time. It has three sections: Assets (ordered by liquidity), Liabilities (ordered by due date), and Equity (residual value).",
      table: {
        headers: ["Section", "Contains", "Examples"],
        rows: [
          ["Assets", "What the company owns", "Cash, Receivables, Inventory"],
          ["Liabilities", "What the company owes", "Payables, Loans, Deferred Revenue"],
          ["Equity", "Owner's residual stake", "Share Capital, Retained Earnings"]
        ]
      },
      keyTakeaway: "The Balance Sheet answers: 'What is our financial position right now?'"
    },
    {
      id: "m2-c2",
      title: "2. The Income Statement",
      explanation: "The Income Statement (P&L) shows performance over a period — how much was earned and spent. It flows from Top Line (Revenue) down to Bottom Line (Net Income).",
      visual: `
Revenue (Sales)
 − Cost of Goods Sold (COGS)
 ────────────────────────────
 = Gross Profit
 − Operating Expenses (SG&A)
 ────────────────────────────
 = Operating Income (EBIT)
 − Interest & Taxes
 ────────────────────────────
 = Net Income`,
      keyTakeaway: "The Income Statement answers: 'How profitable were we this period?'"
    },
    {
      id: "m2-c3",
      title: "3. The Cash Flow Statement",
      explanation: "The Cash Flow Statement explains why cash changed between two Balance Sheet dates. It separates cash movements into three categories: Operating, Investing, and Financing.",
      table: {
        headers: ["Section", "Shows", "Examples"],
        rows: [
          ["Operating", "Cash from core business", "Customer payments, salaries"],
          ["Investing", "Cash for long-term assets", "Equipment purchases, acquisitions"],
          ["Financing", "Cash from/to investors", "Loans, dividends, share issuance"]
        ]
      },
      keyTakeaway: "Net Income ≠ Cash Flow. Profitable companies can run out of cash."
    },
    {
      id: "m2-c4",
      title: "4. How the Three Statements Connect",
      explanation: "The statements form an integrated system. Net Income flows to Retained Earnings (Balance Sheet). Cash Flow reconciles Net Income to actual Cash change, and the ending Cash matches the Balance Sheet.",
      keyTakeaway: "You cannot change one statement without impacting the others."
    }
  ],
  practice: {
    type: 'analysis',
    title: "Exercise: FastTransfer Ltd Financial Analysis",
    scenarios: [
      {
        id: "s1",
        title: "FastTransfer Ltd - Q4 Financials",
        context: "FastTransfer Ltd is a cross-border payments company. Review their Q4 financial statements below to answer the analysis questions.",
        tables: [
          {
            title: "Balance Sheet (31 Dec)",
            headers: ["Assets", "£000", "Liabilities & Equity", "£000"],
            rows: [
              ["Cash", "2,400", "Accounts Payable", "1,200"],
              ["Accounts Receivable", "1,800", "Deferred Revenue", "800"],
              ["Prepaid Expenses", "300", "Bank Loan", "2,000"],
              ["Equipment (net)", "3,500", "Total Liabilities", "4,000"],
              ["Total Assets", "8,000", "Total Equity", "4,000"]
            ]
          },
          {
            title: "Income Statement (Q4)",
            headers: ["Line Item", "£000"],
            rows: [
              ["Revenue", "5,200"],
              ["Cost of Services", "(2,600)"],
              ["Gross Profit", "2,600"],
              ["Operating Expenses", "(1,800)"],
              ["Operating Income", "800"],
              ["Net Income", "600"]
            ]
          }
        ],
        questions: [
          {
            id: "q1",
            text: "What is FastTransfer's Gross Profit Margin? (Enter as a number only, e.g. 50)",
            type: "number",
            correctAnswer: 50,
            suffix: "%",
            explanation: "Gross Profit (£2,600) ÷ Revenue (£5,200) = 0.50 or 50%.",
            hint: "Divide Gross Profit by Revenue and multiply by 100."
          },
          {
            id: "q2",
            text: "What is the Current Ratio? (Current Assets ÷ Current Liabilities)",
            type: "number",
            correctAnswer: 2.25,
            explanation: "Current Assets (2,400 + 1,800 + 300 = 4,500) ÷ Current Liabilities (1,200 + 800 = 2,000) = 2.25.",
            hint: "Current Assets are Cash, AR, Prepaid. Current Liabilities are AP, Deferred Revenue."
          },
          {
            id: "q3",
            text: "If Net Income was £600k and Retained Earnings started at £900k, ending at £1,500k, were dividends paid?",
            type: "select",
            options: ["Yes", "No", "Cannot determine"],
            correctAnswer: "No",
            explanation: "Starting RE (£900) + Net Income (£600) = Ending RE (£1,500). The math balances exactly, so no dividends were distributed.",
            hint: "Check if Start RE + Net Income equals End RE."
          }
        ]
      }
    ]
  },
  quiz: [
    { id: 1, question: "Which statement shows performance over a period of time?", options: ["Balance Sheet", "Income Statement", "Statement of Equity", "Notes"], correctAnswer: 1, feedbackCorrect: "Correct! The P&L covers a period (e.g., a quarter).", feedbackWrong: "The Balance Sheet is a point-in-time snapshot. The Income Statement covers a period." },
    { id: 2, question: "'Accounts Receivable' represents:", options: ["Money owed to suppliers", "Money owed by customers", "Cash in bank", "Future expenses"], correctAnswer: 1, feedbackCorrect: "Correct! It is an asset representing cash waiting to be collected.", feedbackWrong: "Receivables are assets: money customers owe you." },
    { id: 3, question: "Net Income flows to which Balance Sheet line?", options: ["Cash", "Share Capital", "Retained Earnings", "Payables"], correctAnswer: 2, feedbackCorrect: "Yes, profit increases Retained Earnings.", feedbackWrong: "Net Income flows into Retained Earnings (Equity)." },
    { id: 4, question: "Rev £500k, Gross Profit £200k. What is COGS?", options: ["£200k", "£300k", "£500k", "£700k"], correctAnswer: 1, feedbackCorrect: "Rev - COGS = GP. 500 - 300 = 200.", feedbackWrong: "Revenue - COGS = Gross Profit. £500k - X = £200k, so COGS is £300k." },
    { id: 5, question: "Where do equipment purchases go on Cash Flow?", options: ["Operating", "Investing", "Financing", "Nowhere"], correctAnswer: 1, feedbackCorrect: "Buying long-term assets is an Investing activity.", feedbackWrong: "Capital expenditures (CapEx) are Investing activities." },
    { id: 6, question: "Current Liabilities are due within:", options: ["30 days", "90 days", "12 months", "5 years"], correctAnswer: 2, feedbackCorrect: "Correct.", feedbackWrong: "Current means due within one year (12 months)." }
  ]
};

export const module3Content: ModuleContent = {
  meta: {
    title: "Revenue Recognition",
    subtitle: "When and how to record revenue",
    time: "25 min",
    icon: "💰"
  },
  concepts: [
    {
      id: "m3-c1",
      title: "1. The 5-Step Revenue Recognition Model",
      explanation: "Under IFRS 15 / ASC 606, revenue recognition follows five steps: 1. Identify contract, 2. Identify obligations, 3. Determine price, 4. Allocate price, 5. Recognize when delivered.",
      keyTakeaway: "You can't recognize revenue just because a customer paid — you must have delivered what was promised."
    },
    {
      id: "m3-c2",
      title: "2. Point-in-Time vs Over-Time",
      explanation: "Recognition depends on transfer of control. 'Point-in-time' is for one-off sales (e.g., selling a phone). 'Over-time' is for continuous service (e.g., SaaS subscription).",
      keyTakeaway: "Most B2B software companies use over-time recognition."
    },
    {
      id: "m3-c3",
      title: "3. Deferred Revenue Deep Dive",
      explanation: "Deferred Revenue arises when a customer pays before delivery. It is a LIABILITY. As you deliver the service, you reduce the liability and record revenue.",
      keyTakeaway: "Deferred Revenue represents an obligation to perform, not income."
    },
    {
      id: "m3-c4",
      title: "4. Principal vs Agent (Gross vs Net)",
      explanation: "If you control the good before transfer, you are Principal (record Gross). If you just arrange for another party to provide it, you are Agent (record Net fee only).",
      keyTakeaway: "Payment processors often record Net revenue (their fee), not the total payment volume."
    }
  ],
  practice: {
    type: 'analysis',
    title: "Exercise: PayStream Pro Contract Analysis",
    scenarios: [
      {
        id: "cA",
        title: "Contract A: Annual Subscription",
        context: "GlobalRetail Inc pays £48,000 upfront on Jan 1 for 12 months of platform access (Jan-Dec).",
        questions: [
          { id: "a1", text: "Revenue recognized in January?", type: "number", correctAnswer: 4000, prefix: "£", explanation: "£48,000 / 12 months = £4,000.", hint: "Divide total contract value by duration." },
          { id: "a2", text: "Deferred Revenue balance on March 31?", type: "number", correctAnswer: 36000, prefix: "£", explanation: "Original £48,000 - (3 months * £4,000) = £36,000.", hint: "Original amount minus revenue recognized for Jan, Feb, Mar." }
        ]
      },
      {
        id: "cB",
        title: "Contract B: Multi-Element Deal",
        context: "MegaCorp pays £54,000 upfront. Includes: Platform (Standalone £36k), Implementation (Standalone £12k), Reports (Standalone £12k). Total Standalone = £60k. Discount = 10%. Implementation done Jan 15. Reports done Jan 30.",
        questions: [
          { id: "b1", text: "Revenue recognized in January?", type: "number", correctAnswer: 24300, prefix: "£", explanation: "Impl (£10.8k) + Reports (£10.8k) + 1mo Platform (£2.7k) = £24,300.", hint: "Discount all items by 10%. Recognize Impl and Reports fully (completed) + 1/12th of Platform." }
        ]
      },
      {
        id: "cC",
        title: "Contract C: Principal vs Agent",
        context: "PayStream processes £500,000 volume for SmallBiz Co. Fee is 0.8%. PayStream acts as Agent.",
        questions: [
          { id: "c1", text: "What revenue does PayStream recognize?", type: "number", correctAnswer: 4000, prefix: "£", explanation: "£500,000 * 0.008 = £4,000. (Net recognition).", hint: "As an Agent, only recognize the fee %." }
        ]
      }
    ]
  },
  quiz: [
    { id: 1, question: "What must exist before revenue recognition?", options: ["Cash receipt", "Invoice sent", "Performance obligation satisfied", "Contract signed"], correctAnswer: 2, feedbackCorrect: "Correct.", feedbackWrong: "Delivery (satisfying the obligation) is key." },
    { id: 2, question: "£60k for 2-year sub. Year 1 revenue?", options: ["£60k", "£30k", "£0", "£15k"], correctAnswer: 1, feedbackCorrect: "£60k / 2 = £30k.", feedbackWrong: "Spread evenly over the term." },
    { id: 3, question: "Deferred Revenue is a:", options: ["Asset", "Liability", "Revenue", "Expense"], correctAnswer: 1, feedbackCorrect: "Correct, it's an obligation.", feedbackWrong: "It's a liability (obligation to deliver)." },
    { id: 4, question: "Over-time recognition applies to:", options: ["Laptop sale", "Monthly retainer", "One-time install", "Furniture sale"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Services delivered continuously use over-time." },
    { id: 5, question: "Agent processes £1M, fee 1%. Revenue?", options: ["£1M", "£100k", "£10k", "£1k"], correctAnswer: 2, feedbackCorrect: "1% of £1M is £10k.", feedbackWrong: "Agents record net fee only." },
    { id: 6, question: "Full refund rights exist. Recognize when?", options: ["Cash received", "Contract signed", "Rights expire", "Year end"], correctAnswer: 2, feedbackCorrect: "Correct.", feedbackWrong: "Wait until the refund period expires." }
  ]
};

export const module4Content: ModuleContent = {
  meta: {
    title: "Assets & Depreciation",
    subtitle: "Recording and expensing long-term assets",
    time: "20 min",
    icon: "🏗️"
  },
  concepts: [
    {
      id: "m4-c1",
      title: "1. Types of Assets",
      explanation: "Assets are classified by how quickly they convert to cash or are consumed. Current Assets (<12 months) vs Non-Current Assets (>12 months). Non-current are split into Tangible (PP&E) and Intangible (Patents, Software).",
      table: {
        headers: ["Category", "Timeframe", "Examples"],
        rows: [
          ["Current Assets", "< 12 months", "Cash, Receivables, Inventory"],
          ["Non-Current Assets", "> 12 months", "Equipment, Buildings, Patents"]
        ]
      },
      keyTakeaway: "Current vs Non-Current classification affects liquidity ratios and balance sheet presentation."
    },
    {
      id: "m4-c2",
      title: "2. Capitalize vs Expense",
      explanation: "When you spend money, should it be an Asset or an Expense? Capitalize if it provides benefit > 1 year and is significant. Expense immediately if benefit is consumed within period or amount is minor.",
      table: {
        headers: ["Capitalize (Asset)", "Expense Immediately"],
        rows: [
          ["Provides benefit > 1 year", "Benefit consumed within period"],
          ["Significant amount", "Minor amount"],
          ["Creates/improves asset", "Maintains existing asset"]
        ]
      },
      keyTakeaway: "Capitalizing spreads the cost over the asset's useful life; expensing hits profit immediately."
    },
    {
      id: "m4-c3",
      title: "3. Straight-Line Depreciation",
      explanation: "Depreciation allocates an asset's cost over its useful life. Formula: Annual Depreciation = (Cost − Salvage Value) ÷ Useful Life.",
      keyTakeaway: "Depreciation is a non-cash expense — it reduces profit but doesn't use cash."
    },
    {
      id: "m4-c4",
      title: "4. Net Book Value (NBV)",
      explanation: "NBV shows an asset's current accounting value. Formula: Net Book Value = Original Cost − Accumulated Depreciation.",
      table: {
        headers: ["Year", "Depreciation", "Accumulated", "Net Book Value"],
        rows: [
           ["0", "—", "—", "£50,000"],
           ["1", "£9,000", "£9,000", "£41,000"],
           ["2", "£9,000", "£18,000", "£32,000"],
           ["3", "£9,000", "£27,000", "£23,000"],
           ["4", "£9,000", "£36,000", "£14,000"],
           ["5", "£9,000", "£45,000", "£5,000"]
        ]
      },
      keyTakeaway: "NBV ≠ Market Value. NBV is accounting value; market value is what someone would pay."
    }
  ],
  practice: {
    type: 'analysis',
    title: "Exercise: GlobalPay Infrastructure Asset Management",
    scenarios: [
      {
        id: "s1",
        title: "Asset 1: Server Farm",
        context: "Purchase date: Jan 1, 2025. Cost: £240,000. Installation: £20,000. Useful life: 8 years. Salvage value: £20,000.",
        questions: [
          { id: "q1", text: "Total capitalizable cost?", type: "number", correctAnswer: 260000, prefix: "£", explanation: "£240,000 + £20,000 installation = £260,000." },
          { id: "q2", text: "Annual straight-line depreciation?", type: "number", correctAnswer: 30000, prefix: "£", explanation: "(£260,000 - £20,000) / 8 = £30,000." },
          { id: "q3", text: "NBV on Dec 31, 2027 (after 3 years)?", type: "number", correctAnswer: 170000, prefix: "£", explanation: "£260,000 - (3 * £30,000) = £170,000." },
          { id: "q4", text: "Gain/Loss if sold Jan 1, 2028 for £150,000? (Use negative for loss)", type: "number", correctAnswer: -20000, prefix: "£", explanation: "£150,000 - £170,000 = -£20,000 loss." }
        ]
      },
      {
        id: "s2",
        title: "Asset 2: Payment Software License",
        context: "Purchase date: July 1, 2025. Cost: £90,000. Useful life: 3 years. No salvage value.",
        questions: [
          { id: "q5", text: "Monthly amortization?", type: "number", correctAnswer: 2500, prefix: "£", explanation: "£90,000 / 36 months = £2,500." },
          { id: "q6", text: "Amortization recognized in 2025 (6 months)?", type: "number", correctAnswer: 15000, prefix: "£", explanation: "6 * £2,500 = £15,000." },
          { id: "q7", text: "NBV on Dec 31, 2026?", type: "number", correctAnswer: 45000, prefix: "£", explanation: "£90,000 - (18 months * £2,500) = £45,000." }
        ]
      },
      {
        id: "s3",
        title: "Classify Expenditures",
        context: "Determine whether to Capitalize or Expense the following items:",
        questions: [
          { id: "q8", text: "New security system for data center (£35,000)", type: "select", options: ["Capitalize", "Expense"], correctAnswer: "Capitalize", explanation: "Significant improvement with long-term benefit." },
          { id: "q9", text: "Annual software license renewal (£5,000)", type: "select", options: ["Capitalize", "Expense"], correctAnswer: "Expense", explanation: "Period cost, benefits only current year." },
          { id: "q10", text: "Upgrade that doubles server capacity (£80,000)", type: "select", options: ["Capitalize", "Expense"], correctAnswer: "Capitalize", explanation: "Enhances asset value/utility." },
          { id: "q11", text: "Routine server maintenance (£2,000)", type: "select", options: ["Capitalize", "Expense"], correctAnswer: "Expense", explanation: "Maintenance keeps asset in working order, does not improve it." },
          { id: "q12", text: "Legal fees to acquire competitor (£50,000)", type: "select", options: ["Capitalize", "Expense"], correctAnswer: "Capitalize", explanation: "Part of the acquisition cost of assets." },
          { id: "q13", text: "Staff training on new system (£8,000)", type: "select", options: ["Capitalize", "Expense"], correctAnswer: "Expense", explanation: "Training is generally expensed as incurred." }
        ]
      }
    ]
  },
  quiz: [
    { id: 1, question: "A delivery van costs £40,000, has 5-year life and £5,000 salvage. Annual depreciation is:", options: ["£8,000", "£7,000", "£9,000", "£5,000"], correctAnswer: 1, feedbackCorrect: "Correct! (£40,000 - £5,000) / 5 = £7,000.", feedbackWrong: "(Cost - Salvage) / Useful Life." },
    { id: 2, question: "Which expenditure should be capitalized?", options: ["Office cleaning", "New roof extending life by 10 years", "Monthly utility bills", "Employee salaries"], correctAnswer: 1, feedbackCorrect: "Extending life creates long-term benefit.", feedbackWrong: "Capitalize major improvements that extend useful life." },
    { id: 3, question: "Net Book Value equals:", options: ["Market value", "Cost * rate", "Cost - Accumulated Depreciation", "Salvage value + depreciation"], correctAnswer: 2, feedbackCorrect: "Correct.", feedbackWrong: "NBV is historical cost minus all depreciation taken so far." },
    { id: 4, question: "Depreciation is a:", options: ["Cash expense", "Non-cash expense", "Liability", "Asset"], correctAnswer: 1, feedbackCorrect: "It reduces profit but no cash leaves.", feedbackWrong: "It's a non-cash allocation of cost." },
    { id: 5, question: "Equipment with NBV of £25,000 is sold for £30,000. The result is:", options: ["£5,000 loss", "£5,000 gain", "No gain/loss", "£30,000 revenue"], correctAnswer: 1, feedbackCorrect: "Sale Price - NBV = Gain/Loss. £30k - £25k = £5k Gain.", feedbackWrong: "Compare Sale Price to NBV." },
    { id: 6, question: "Intangible assets include:", options: ["Buildings", "Inventory", "Patents and software", "Cash"], correctAnswer: 2, feedbackCorrect: "Correct.", feedbackWrong: "Intangibles lack physical substance." }
  ]
};

export const module5Content: ModuleContent = {
  meta: {
    title: "Cash Flow Statements",
    subtitle: "Following the money",
    time: "25 min",
    icon: "💸"
  },
  concepts: [
    {
      id: "m5-c1",
      title: "1. The Three Sections",
      explanation: "The Cash Flow Statement has three sections: Operating (core business), Investing (long-term assets), and Financing (funding).",
      table: {
        headers: ["Section", "Inflows", "Outflows"],
        rows: [
          ["Operating", "Customer payments", "Supplier payments, Salaries"],
          ["Investing", "Asset sales", "Equipment purchases"],
          ["Financing", "Loans received, Shares issued", "Loan repayments, Dividends"]
        ]
      },
      keyTakeaway: "Operating is the most important — it shows if the core business generates cash."
    },
    {
      id: "m5-c2",
      title: "2. Indirect Method (Operating Section)",
      explanation: "Most companies start with Net Income and adjust for non-cash items (like depreciation) and changes in working capital.",
      visual: `
Net Income
 + Depreciation/Amortization
 − Increase in Current Assets
 + Decrease in Current Assets
 + Increase in Current Liabilities
 − Decrease in Current Liabilities
 ──────────────────────────────────
 = Operating Cash Flow`,
      keyTakeaway: "Assets UP = Cash DOWN. Liabilities UP = Cash UP."
    },
    {
      id: "m5-c3",
      title: "3. Free Cash Flow (FCF)",
      explanation: "FCF measures cash available for investors after maintaining the business. Formula: Free Cash Flow = Operating Cash Flow − Capital Expenditures.",
      keyTakeaway: "FCF is what's truly 'free' for dividends or expansion."
    },
    {
      id: "m5-c4",
      title: "4. Why Net Income ≠ Cash Flow",
      explanation: "Differences arise from non-cash expenses (depreciation) and timing differences (revenue recorded before cash received).",
      table: {
        headers: ["Item", "Net Income Impact", "Cash Flow Impact"],
        rows: [
          ["Depreciation", "Reduces NI", "No cash impact"],
          ["Receivables increase", "Increases Revenue", "No cash received"],
          ["Inventory purchase", "No impact", "Cash paid"]
        ]
      },
      keyTakeaway: "Profitable companies can run out of cash."
    }
  ],
  practice: {
    type: 'analysis',
    title: "Exercise: B2B Payments Inc Cash Flow Construction",
    scenarios: [
      {
        id: "s1",
        title: "Construct Operating Cash Flow",
        context: "Build the Operating Cash Flow section using the indirect method based on the data below.",
        tables: [
           {
             title: "Given Information",
             headers: ["Item", "Amount"],
             rows: [
               ["Net Income", "£800,000"],
               ["Depreciation", "£120,000"],
               ["Amortization", "£40,000"],
               ["Accounts Receivable", "Increased £75,000"],
               ["Inventory", "Decreased £25,000"],
               ["Prepaid Expenses", "Increased £15,000"],
               ["Accounts Payable", "Increased £45,000"],
               ["Accrued Liabilities", "Decreased £30,000"],
               ["Deferred Revenue", "Increased £60,000"]
             ]
           }
        ],
        questions: [
          { id: "q1", text: "Calculate the total Operating Cash Flow.", type: "number", correctAnswer: 970000, prefix: "£", explanation: "800k + 120k + 40k - 75k + 25k - 15k + 45k - 30k + 60k = 970k." },
          { id: "q2", text: "Why is Depreciation added back?", type: "select", options: ["It used cash", "It is non-cash but reduced NI"], correctAnswer: "It is non-cash but reduced NI", explanation: "Depreciation reduced Net Income but didn't use cash." },
          { id: "q3", text: "Why does an increase in A/R reduce Operating Cash Flow?", type: "select", options: ["Cash received", "Revenue recorded but no cash yet"], correctAnswer: "Revenue recorded but no cash yet", explanation: "You booked revenue (profit) but haven't collected the cash." },
          { id: "q4", text: "If CAPEX was £200,000, what is Free Cash Flow?", type: "number", correctAnswer: 770000, prefix: "£", explanation: "OCF (£970k) - CAPEX (£200k) = £770k." },
          { id: "q5", text: "Where do dividends paid appear?", type: "select", options: ["Operating", "Investing", "Financing"], correctAnswer: "Financing", explanation: "Dividends are a return to shareholders (Financing)." }
        ]
      }
    ]
  },
  quiz: [
    { id: 1, question: "Equipment purchase appears in which section?", options: ["Operating", "Investing", "Financing", "None"], correctAnswer: 1, feedbackCorrect: "Investing covers long-term assets.", feedbackWrong: "Long-term assets = Investing." },
    { id: 2, question: "In indirect method, depreciation is:", options: ["Subtracted from NI", "Added to NI", "Ignored", "Investing"], correctAnswer: 1, feedbackCorrect: "Added back because it's non-cash.", feedbackWrong: "Add back non-cash expenses." },
    { id: 3, question: "Accounts Receivable increased £50k. Impact?", options: ["+£50k cash", "-£50k cash vs revenue", "No impact", "Write off"], correctAnswer: 1, feedbackCorrect: "Revenue recorded but cash not collected means -Adjustment.", feedbackWrong: "Asset increase = Cash decrease adjustment." },
    { id: 4, question: "Free Cash Flow formula:", options: ["NI - Dep", "OCF - CAPEX", "Rev - Exp", "Inflows - Outflows"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "OCF minus Capital Expenditures." },
    { id: 5, question: "Dividends paid appear in:", options: ["Operating", "Investing", "Financing", "Not shown"], correctAnswer: 2, feedbackCorrect: "Correct.", feedbackWrong: "Financing activities." },
    { id: 6, question: "NI £100k, OCF £60k. Could indicate:", options: ["Great cash flow", "Receivables growing faster than revenue", "Strong profit", "Low depreciation"], correctAnswer: 1, feedbackCorrect: "Growing receivables reduce OCF relative to NI.", feedbackWrong: "Cash is lower than profit, suggesting cash is tied up (e.g. in A/R)." },
    { id: 7, question: "Increase in Accounts Payable:", options: ["Uses cash", "Conserves cash", "No impact", "Reduces NI"], correctAnswer: 1, feedbackCorrect: "You haven't paid cash yet, so it's a +Adjustment.", feedbackWrong: "Liability Increase = Cash Increase adjustment." }
  ]
};

export const module6Content: ModuleContent = {
  meta: { title: "Liabilities & Provisions", subtitle: "Managing obligations", time: "20 min", icon: "⚠️" },
  concepts: [
    { id: "m6-c1", title: "1. Current vs Long-term Liabilities", explanation: "Liabilities are debts or obligations. Current = Due within 12 months (Payables, short-term loans). Long-term = Due after 12 months (Bonds, mortgages).", keyTakeaway: "Classification affects working capital and solvency ratios." },
    { id: "m6-c2", title: "2. Provisions", explanation: "A provision is a liability of uncertain timing or amount. Recognized when: (a) Present obligation exists, (b) Probable outflow of resources, (c) Reliably measurable.", keyTakeaway: "Provisions reduce profit now to cover future probable costs." },
    { id: "m6-c3", title: "3. Contingent Liabilities", explanation: "Possible obligations (not probable) or ones that can't be measured reliably. They are NOT recorded on the Balance Sheet but disclosed in notes.", keyTakeaway: "If it's only 'possible', it's a footnote, not a number." }
  ],
  practice: {
    type: 'analysis',
    title: "Scenario Evaluation: Provision or Contingent?",
    scenarios: [{
      id: "s1", title: "Legal & Warranty Cases", context: "Determine the correct accounting treatment for each situation.",
      questions: [
        { id: "q1", text: "Lawsuit with 70% chance of £300k loss", type: "select", options: ["Recognize Provision", "Disclose Only", "No Action"], correctAnswer: "Recognize Provision", explanation: "Probable (>50%) and measurable." },
        { id: "q2", text: "Product warranty: 2% defect rate on £2M sales (Est £40k)", type: "select", options: ["Recognize Provision", "Disclose Only", "No Action"], correctAnswer: "Recognize Provision", explanation: "Probable outflow based on history, reliably measurable." },
        { id: "q3", text: "Potential fine from regulator: 25% probability", type: "select", options: ["Recognize Provision", "Disclose Only", "No Action"], correctAnswer: "Disclose Only", explanation: "Possible but not probable." },
        { id: "q4", text: "Environmental cleanup required by law (£500k est)", type: "select", options: ["Recognize Provision", "Disclose Only", "No Action"], correctAnswer: "Recognize Provision", explanation: "Legal obligation exists." },
        { id: "q5", text: "Customer threatens to sue (remote chance)", type: "select", options: ["Recognize Provision", "Disclose Only", "No Action"], correctAnswer: "No Action", explanation: "Remote possibility requires no disclosure." }
      ]
    }]
  },
  quiz: [
    { id: 1, question: "A provision is recognized when outflow is:", options: ["Possible", "Probable", "Remote", "Certain"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Must be probable (>50%)." },
    { id: 2, question: "Contingent liabilities are:", options: ["Recorded on Balance Sheet", "Disclosed in notes", "Ignored", "Deducted from Revenue"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "They go in the notes." },
    { id: 3, question: "Current liabilities are due within:", options: ["3 months", "6 months", "12 months", "2 years"], correctAnswer: 2, feedbackCorrect: "Correct.", feedbackWrong: "12 months." },
    { id: 4, question: "Warranty costs should be recorded:", options: ["When claim made", "At time of sale", "When cash paid", "Never"], correctAnswer: 1, feedbackCorrect: "Matching principle: expense matched to revenue.", feedbackWrong: "Record provision at time of sale." },
    { id: 5, question: "Remote lawsuit possibility?", options: ["Provision", "Disclosure", "No Action", "Asset"], correctAnswer: 2, feedbackCorrect: "Correct.", feedbackWrong: "Remote means do nothing." }
  ]
};

export const module7Content: ModuleContent = {
  meta: { title: "Cost Behavior Analysis", subtitle: "Fixed vs Variable Costs", time: "25 min", icon: "📊" },
  concepts: [
    { id: "m7-c1", title: "1. Fixed vs Variable Costs", explanation: "Fixed costs (Rent, Salaries) don't change with volume. Variable costs (Transaction fees, AWS usage) increase with volume.", keyTakeaway: "Knowing your cost structure helps prediction." },
    { id: "m7-c2", title: "2. Contribution Margin", explanation: "Revenue minus Variable Costs. This is the money left to cover Fixed Costs and generate profit.", keyTakeaway: "CM Ratio = (Rev - VC) / Rev." },
    { id: "m7-c3", title: "3. Break-Even Analysis", explanation: "The point where Total Revenue = Total Costs (Profit = 0). Formula: Break-Even Units = Fixed Costs / (Price - Variable Cost per Unit).", keyTakeaway: "Sales below this point = Loss. Above = Profit." }
  ],
  practice: {
    type: 'analysis',
    title: "Break-Even Calculation",
    scenarios: [{
      id: "s1", title: "SaaS Product Launch", context: "Fixed Costs: £100,000/year. Price per user: £50. Variable cost per user: £10.",
      questions: [
        { id: "q1", text: "What is the Contribution Margin per user?", type: "number", correctAnswer: 40, prefix: "£", explanation: "£50 - £10 = £40." },
        { id: "q2", text: "How many users needed to break even?", type: "number", correctAnswer: 2500, explanation: "£100,000 / £40 = 2,500 users." },
        { id: "q3", text: "If price drops to £30, new break-even?", type: "number", correctAnswer: 5000, explanation: "CM is now £20. £100,000 / £20 = 5,000 users." }
      ]
    }]
  },
  quiz: [
    { id: 1, question: "Fixed costs:", options: ["Change with volume", "Stay constant with volume", "Are always zero", "Are variable"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "They stay constant." },
    { id: 2, question: "Contribution Margin is:", options: ["Rev - Fixed", "Rev - Variable", "Profit - Tax", "Rev + VC"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Revenue minus Variable Costs." },
    { id: 3, question: "To lower break-even point, you could:", options: ["Increase Fixed Costs", "Decrease Price", "Reduce Variable Costs", "Sell less"], correctAnswer: 2, feedbackCorrect: "Lower VC increases margin.", feedbackWrong: "Reducing VC or Fixed Costs helps." },
    { id: 4, question: "Rent is usually:", options: ["Fixed", "Variable", "Mixed", "None"], correctAnswer: 0, feedbackCorrect: "Correct.", feedbackWrong: "Rent is typically fixed." },
    { id: 5, question: "AWS hosting for high traffic:", options: ["Fixed", "Variable", "Sunk", "Opportunity"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Usage-based, so variable." }
  ]
};

export const module8Content: ModuleContent = {
  meta: { title: "Customer Profitability", subtitle: "Who makes you money?", time: "25 min", icon: "👥" },
  concepts: [
    { id: "m8-c1", title: "1. Activity-Based Costing (ABC)", explanation: "Assigns overheads to customers based on their actual consumption of resources (support calls, custom reports) rather than just revenue volume.", keyTakeaway: "Revenue ≠ Profit." },
    { id: "m8-c2", title: "2. Cost-to-Serve", explanation: "The hidden costs of serving customers. High maintenance customers can destroy profitability even with high revenue.", keyTakeaway: "Track support and customization costs." },
    { id: "m8-c3", title: "3. Whale Curves", explanation: "A graph showing that often the top 20% of customers generate 150% of profits, while the bottom percentage destroys value.", keyTakeaway: "Fire your worst customers or reprice them." }
  ],
  practice: {
    type: 'analysis',
    title: "Profitability Analysis",
    scenarios: [{
      id: "s1", title: "FastTransfer Customer Review", context: "Service Call cost: £200. Custom Report cost: £500. Calculate profit for each.",
      tables: [{
        title: "Customer Data", headers: ["Customer", "Revenue", "Prod Cost", "Calls", "Reports"],
        rows: [
          ["Alpha", "£500k", "£200k", "50", "12"],
          ["Beta", "£300k", "£150k", "120", "24"],
          ["Gamma", "£800k", "£400k", "20", "4"]
        ]
      }],
      questions: [
        { id: "q1", text: "Alpha Corp Profit?", type: "number", correctAnswer: 284000, prefix: "£", explanation: "500k - 200k - (50*200) - (12*500) = 284k." },
        { id: "q2", text: "Beta Inc Profit?", type: "number", correctAnswer: 114000, prefix: "£", explanation: "300k - 150k - (120*200) - (24*500) = 114k." },
        { id: "q3", text: "Gamma Ltd Profit?", type: "number", correctAnswer: 394000, prefix: "£", explanation: "800k - 400k - (20*200) - (4*500) = 394k." },
        { id: "q4", text: "Which customer has highest margin %?", type: "select", options: ["Alpha", "Beta", "Gamma"], correctAnswer: "Gamma", explanation: "Gamma has high revenue and very low service costs." }
      ]
    }]
  },
  quiz: [
    { id: 1, question: "Activity Based Costing allocates costs based on:", options: ["Revenue", "Activities consumed", "Headcount", "Randomly"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Based on actual usage." },
    { id: 2, question: "Whale curve typically shows:", options: ["All customers equal", "Top 20% generate most profit", "Losses are impossible", "Revenue equals profit"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Pareto principle: few generate most." },
    { id: 3, question: "Cost-to-Serve includes:", options: ["Product material", "Sales commissions", "Support calls & customization", "Tax"], correctAnswer: 2, feedbackCorrect: "Correct.", feedbackWrong: "Non-product costs like support." },
    { id: 4, question: "High revenue customer with high support costs is:", options: ["Always profitable", "Potentially unprofitable", "Ideal", "Best for growth"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Can be unprofitable." },
    { id: 5, question: "Action for unprofitable customers?", options: ["Give discount", "Raise price or reduce service", "Ignore", "Promote"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Reprice or reduce cost to serve." }
  ]
};

export const module9Content: ModuleContent = {
  meta: { title: "Performance Measurement", subtitle: "Budget vs Actual", time: "25 min", icon: "📈" },
  concepts: [
    { id: "m9-c1", title: "1. Budget vs Actual", explanation: "Comparing what happened to the plan. Variances alert management to problems or opportunities.", keyTakeaway: "Variance = Actual - Budget." },
    { id: "m9-c2", title: "2. Variance Types", explanation: "Volume (sold more/less), Price (sold higher/lower), Efficiency (used more/less input).", keyTakeaway: "Drill down to find the 'Why'." },
    { id: "m9-c3", title: "3. Favorable vs Unfavorable", explanation: "Favorable (F) increases profit (Higher Rev, Lower Cost). Unfavorable (U) decreases profit.", keyTakeaway: "Don't just look at the sign, look at the impact on profit." }
  ],
  practice: {
    type: 'analysis',
    title: "Variance Analysis",
    scenarios: [{
      id: "s1", title: "PayFlow Quarterly Review", context: "Budget: 10,000 units @ £50. Actual: 11,000 units @ £48.",
      questions: [
        { id: "q1", text: "Budgeted Revenue?", type: "number", correctAnswer: 500000, prefix: "£", explanation: "10,000 * 50 = 500k." },
        { id: "q2", text: "Actual Revenue?", type: "number", correctAnswer: 528000, prefix: "£", explanation: "11,000 * 48 = 528k." },
        { id: "q3", text: "Total Revenue Variance?", type: "number", correctAnswer: 28000, prefix: "£", explanation: "528k - 500k = 28k Favorable." },
        { id: "q4", text: "Is the price variance Favorable or Unfavorable?", type: "select", options: ["Favorable", "Unfavorable"], correctAnswer: "Unfavorable", explanation: "Sold at £48 instead of £50." }
      ]
    }]
  },
  quiz: [
    { id: 1, question: "Favorable revenue variance means:", options: ["Actual < Budget", "Actual > Budget", "Actual = Budget", "Loss"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Revenue higher than plan is favorable." },
    { id: 2, question: "Unfavorable cost variance:", options: ["Actual Cost < Budget", "Actual Cost > Budget", "Actual Cost = 0", "Saving money"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Costs higher than plan reduces profit." },
    { id: 3, question: "Selling more units than budget creates:", options: ["Volume Variance", "Price Variance", "Cost Variance", "None"], correctAnswer: 0, feedbackCorrect: "Correct.", feedbackWrong: "It's a volume effect." },
    { id: 4, question: "Lowering price to sell more might cause:", options: ["Unfavorable Price Var, Favorable Volume Var", "Favorable Price, Unfavorable Volume", "All Favorable", "All Unfavorable"], correctAnswer: 0, feedbackCorrect: "Correct.", feedbackWrong: "Price down (U), Volume up (F)." },
    { id: 5, question: "Budgeting helps:", options: ["Restrict spending only", "Plan and measure performance", "Increase taxes", "Stop growth"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "It's a planning tool." }
  ]
};

export const module10Content: ModuleContent = {
  meta: { title: "B2B Finance in Practice", subtitle: "Final Assessment", time: "30 min", icon: "🎓" },
  concepts: [
    { id: "m10-c1", title: "1. Key Fintech Metrics", explanation: "TPV (Total Payment Volume), Take Rate (Revenue/TPV), Net Revenue Retention (NRR).", keyTakeaway: "Industry specific metrics matter." },
    { id: "m10-c2", title: "2. Reading Fintech Financials", explanation: "Look for Gross Margin (Scalability), CAC Payback (Efficiency), and Churn.", keyTakeaway: "Context is king." },
    { id: "m10-c3", title: "3. Applying Knowledge", explanation: "Synthesizing accounting, revenue recognition, and cost analysis to make strategic decisions.", keyTakeaway: "Finance is a tool for decision making." }
  ],
  practice: {
    type: 'analysis',
    title: "Course Review",
    scenarios: [{
      id: "s1", title: "Review", context: "You have completed the learning journey. Review your notes before taking the final assessment.",
      questions: [
        { id: "q1", text: "Ready for the final exam?", type: "select", options: ["Yes"], correctAnswer: "Yes", explanation: "Good luck!" }
      ]
    }]
  },
  quiz: [
    { id: 1, question: "Accrual accounting records revenue when:", options: ["Cash received", "Earned", "Invoiced", "Planned"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "When earned." },
    { id: 2, question: "Balance sheet equation:", options: ["A = L + E", "A = L - E", "A + L = E", "R - E = P"], correctAnswer: 0, feedbackCorrect: "Correct.", feedbackWrong: "Assets = Liabilities + Equity." },
    { id: 3, question: "Cash received before service is:", options: ["Revenue", "Deferred Revenue", "Asset", "Expense"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Deferred Revenue (Liability)." },
    { id: 4, question: "Which is a non-cash expense?", options: ["Rent", "Salaries", "Depreciation", "Marketing"], correctAnswer: 2, feedbackCorrect: "Correct.", feedbackWrong: "Depreciation." },
    { id: 5, question: "Statement showing profitability:", options: ["Balance Sheet", "Income Statement", "Cash Flow", "Equity"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Income Statement." },
    { id: 6, question: "Investing cash flow includes:", options: ["Selling goods", "Buying equipment", "Issuing shares", "Paying wages"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Equipment (CapEx)." },
    { id: 7, question: "Provision requires:", options: ["Probable outflow", "Possible outflow", "Remote outflow", "No outflow"], correctAnswer: 0, feedbackCorrect: "Correct.", feedbackWrong: "Probable (>50%)." },
    { id: 8, question: "Fixed costs:", options: ["Vary with sales", "Stay same", "Disappear", "Increase monthly"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "They stay the same." },
    { id: 9, question: "ABC stands for:", options: ["Always Be Closing", "Activity Based Costing", "Asset Base Calculation", "Audit Board Control"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Activity Based Costing." },
    { id: 10, question: "Favorable variance:", options: ["Increases profit", "Decreases profit", "Neutral", "Bad"], correctAnswer: 0, feedbackCorrect: "Correct.", feedbackWrong: "Increases profit." },
    { id: 11, question: "Current Ratio formula:", options: ["CA / CL", "CA - CL", "A / E", "Rev / Cost"], correctAnswer: 0, feedbackCorrect: "Correct.", feedbackWrong: "Current Assets / Current Liabilities." },
    { id: 12, question: "Net Book Value:", options: ["Cost - Accum Dep", "Market Value", "Salvage Value", "Cost"], correctAnswer: 0, feedbackCorrect: "Correct.", feedbackWrong: "Cost - Accumulated Depreciation." },
    { id: 13, question: "Operating Cash Flow starts with:", options: ["Revenue", "Net Income", "Cash", "Sales"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Net Income (Indirect method)." },
    { id: 14, question: "Free Cash Flow:", options: ["OCF - CapEx", "NI + Dep", "Rev - Exp", "Cash - Debt"], correctAnswer: 0, feedbackCorrect: "Correct.", feedbackWrong: "Operating Cash Flow - CapEx." },
    { id: 15, question: "Contingent Liability is:", options: ["Recorded", "Disclosed", "Asset", "Revenue"], correctAnswer: 1, feedbackCorrect: "Correct.", feedbackWrong: "Disclosed in notes." },
    { id: 16, question: "Break-even point:", options: ["Profit = 0", "Rev = 0", "Cost = 0", "Loss"], correctAnswer: 0, feedbackCorrect: "Correct.", feedbackWrong: "Where TR = TC." },
    { id: 17, question: "Whale curve relates to:", options: ["Customer Profitability", "Stock Market", "HR", "Legal"], correctAnswer: 0, feedbackCorrect: "Correct.", feedbackWrong: "Customer Profitability." },
    { id: 18, question: "Principal vs Agent affects:", options: ["Gross vs Net Rev", "Tax", "Rent", "Equity"], correctAnswer: 0, feedbackCorrect: "Correct.", feedbackWrong: "Gross vs Net revenue recording." },
    { id: 19, question: "Prepaid Expense is an:", options: ["Asset", "Liability", "Income", "Equity"], correctAnswer: 0, feedbackCorrect: "Correct.", feedbackWrong: "Asset (future benefit)." },
    { id: 20, question: "Finance Fluency is:", options: ["Awesome", "Okay", "Bad", "Meh"], correctAnswer: 0, feedbackCorrect: "Thanks!", feedbackWrong: "It is Awesome." }
  ]
};

export const getModuleContent = (id: number): ModuleContent | null => {
  if (id === 1) return module1Content;
  if (id === 2) return module2Content;
  if (id === 3) return module3Content;
  if (id === 4) return module4Content;
  if (id === 5) return module5Content;
  if (id === 6) return module6Content;
  if (id === 7) return module7Content;
  if (id === 8) return module8Content;
  if (id === 9) return module9Content;
  if (id === 10) return module10Content;
  return null;
};