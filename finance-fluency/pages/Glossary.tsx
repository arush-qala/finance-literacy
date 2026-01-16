import React, { useState } from 'react';
import { Search } from 'lucide-react';

const TERMS = [
  { t: "Accrual Accounting", d: "Recording transactions when earned/incurred, regardless of cash timing" },
  { t: "Accounts Payable", d: "Money owed to suppliers for goods/services received" },
  { t: "Accounts Receivable", d: "Money owed by customers for goods/services delivered" },
  { t: "Amortization", d: "Spreading intangible asset cost over useful life" },
  { t: "Assets", d: "Resources owned by a company" },
  { t: "Balance Sheet", d: "Financial statement showing assets, liabilities, equity at a point in time" },
  { t: "Break-even Point", d: "Sales level where revenue equals total costs" },
  { t: "Capital Expenditure (CAPEX)", d: "Spending on long-term assets" },
  { t: "Cash Flow Statement", d: "Shows sources and uses of cash over a period" },
  { t: "Contribution Margin", d: "Revenue minus variable costs" },
  { t: "Cost of Goods Sold (COGS)", d: "Direct costs of producing goods sold" },
  { t: "Current Assets", d: "Assets convertible to cash within 12 months" },
  { t: "Current Liabilities", d: "Debts due within 12 months" },
  { t: "Deferred Revenue", d: "Cash received for services not yet delivered" },
  { t: "Depreciation", d: "Spreading tangible asset cost over useful life" },
  { t: "EBIT", d: "Earnings Before Interest and Taxes" },
  { t: "EBITDA", d: "EBIT plus Depreciation and Amortization" },
  { t: "Equity", d: "Owner's stake (Assets minus Liabilities)" },
  { t: "Fixed Costs", d: "Costs that don't change with volume" },
  { t: "Free Cash Flow", d: "Operating cash flow minus capital expenditures" },
  { t: "Gross Profit", d: "Revenue minus Cost of Goods Sold" },
  { t: "Income Statement", d: "Shows revenue, expenses, profit over a period" },
  { t: "Liabilities", d: "Company's debts and obligations" },
  { t: "Net Book Value", d: "Asset cost minus accumulated depreciation" },
  { t: "Net Income", d: "Bottom-line profit after all expenses" },
  { t: "Operating Cash Flow", d: "Cash generated from core business operations" },
  { t: "Operating Expenses", d: "Costs of running the business (SG&A)" },
  { t: "Prepaid Expenses", d: "Cash paid for future benefits" },
  { t: "Provision", d: "Liability with uncertain timing or amount" },
  { t: "Retained Earnings", d: "Accumulated profits not distributed as dividends" },
  { t: "Revenue", d: "Income from goods/services sold" },
  { t: "Salvage Value", d: "Expected value of asset at end of useful life" },
  { t: "Variable Costs", d: "Costs that change with volume" },
  { t: "Working Capital", d: "Current Assets minus Current Liabilities" },
];

export const Glossary: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredTerms = TERMS.filter(term => 
    term.t.toLowerCase().includes(search.toLowerCase()) || 
    term.d.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.t.localeCompare(b.t));

  return (
    <div className="animate-fade-in pb-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Financial Glossary</h1>
                <p className="text-slate-500">Key terms and definitions for data analysts.</p>
            </div>
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search terms..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTerms.length > 0 ? (
                filteredTerms.map((term, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all">
                        <h3 className="font-bold text-indigo-700 text-lg mb-2">{term.t}</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">{term.d}</p>
                    </div>
                ))
            ) : (
                <div className="col-span-full text-center py-12 text-slate-400">
                    No terms found matching "{search}"
                </div>
            )}
        </div>
    </div>
  );
};