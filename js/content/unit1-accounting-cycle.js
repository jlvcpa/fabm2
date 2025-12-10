    // Content for Unit 1: Review of Accounting Cycle
// Covers the 10 Steps for a Sole Proprietorship Service Business

export const unit1Data = {
    week1: [
        {
            day: "Day 1",
            topic: "Review: The Recording Phase (Steps 1–5)",
            content: `
                <div class="space-y-8 animate-fade-in">
                    <div class="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-500 shadow-sm">
                        <h3 class="text-lg font-bold text-indigo-900 mb-2">Phase Overview</h3>
                        <p class="text-indigo-800">Focus: Capturing economic events, analyzing necessary changes, and drafting the preliminary results on a worksheet.</p>
                        
                    </div>

                    <!-- STEP 1 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 1: Analyze Business Transactions</h3>
                        <p class="mb-4 text-gray-600">Financial accounting begins with identifying economic events. Only transactions measurable in monetary terms affecting financial position are recorded. This relies on <strong>source documents</strong> (invoices, receipts) as objective evidence.</p>
                        
                            <div class="mb-6">
                              <h4 class="font-bold text-slate-700 mb-2">The Accounting Equation</h4>
                                  <p class="text-sm text-gray-600 mb-2">
                                    <strong>Assets = Liabilities + Equity</strong>. Every transaction must keep this in balance.
                                  </p>

                      <!-- Accounting Equation Visual (Balance Scale) -->
                          <div class="img-box" 
                               style="width: 100%; max-width: 450px; margin: 10px auto; display: flex; justify-content: center;">
                                <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
                          <!-- Background -->
                              <rect width="400" height="220" fill="#f8fafc" rx="8" />

                      <!-- SCALE STRUCTURE -->
                      <!-- Base -->
                          <path d="M170 190 L230 190 L200 140 Z" fill="#64748b" />
                          <rect x="140" y="190" width="120" height="10" rx="3" fill="#475569" />
                      <!-- Beam -->
                          <rect x="40" y="135" width="320" height="8" rx="4" fill="#94a3b8" />
                      <!-- Center Pivot Circle -->
                          <circle cx="200" cy="140" r="6" fill="#cbd5e0" />

                      <!-- LEFT SIDE: ASSETS (Blue) -->
                           <g transform="translate(60, 60)">
                            <line x1="50" y1="0" x2="50" y2="75" stroke="#cbd5e0" stroke-width="2" />
                            <rect x="0" y="25" width="100" height="80" rx="4" fill="#0038a8" />
                            <text x="50" y="65" font-family="Arial, sans-serif" font-weight="bold" font-size="14" text-anchor="middle" fill="#ffffff">ASSETS</text>
                            <text x="50" y="80" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#bfdbfe">Use of Funds</text>
                          </g>

                      <!-- RIGHT SIDE: LIABILITIES & EQUITY -->
                          <g transform="translate(240, 60)">
                            <line x1="50" y1="0" x2="50" y2="75" stroke="#cbd5e0" stroke-width="2" />
                            <rect x="0" y="25" width="100" height="38" rx="2" fill="#ce1126" />
                            <text x="50" y="48" font-family="Arial, sans-serif" font-weight="bold" font-size="11" text-anchor="middle" fill="#ffffff">LIABILITIES</text>
                            <rect x="0" y="67" width="100" height="38" rx="2" fill="#fbbf24" />
                            <text x="50" y="90" font-family="Arial, sans-serif" font-weight="bold" font-size="11" text-anchor="middle" fill="#78350f">EQUITY</text>

                        <!-- Bracket Label -->
                            <text x="110" y="70" font-family="Arial, sans-serif" font-size="10" fill="#64748b" font-style="italic">
                              <tspan x="110" dy="0">Source</tspan>
                              <tspan x="110" dy="12">of Funds</tspan>
                            </text>
                            <path d="M105 30 L108 30 L108 100 L105 100" fill="none" stroke="#94a3b8" stroke-width="1"/>
                          </g>

                      <!-- VISUAL EQUAL SIGN -->
                         <g transform="translate(200, 90)">
                        <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#cbd5e0" stroke-width="2"/>
                        <text x="0" y="6" font-family="Arial, sans-serif" font-weight="bold" font-size="22" text-anchor="middle" fill="#334155">=</text>
                      </g>
                    </svg>
                  </div>
                </div>

                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-bold text-blue-800 text-sm uppercase mb-2"><i class="fas fa-list-ol mr-2"></i>Step-by-Step Guide</h4>
                            <ul class="space-y-1 text-sm text-blue-900 list-disc list-inside">
                                <li><strong>Gather Source Documents:</strong> Collect receipts, invoices, checks.</li>
                                <li><strong>Identify Accounts:</strong> Ask "What did we get? What did we give up?"</li>
                                <li><strong>Classify Accounts:</strong> Asset, Liability, Equity, Revenue, or Expense?</li>
                                <li><strong>Determine Direction:</strong> Increase or Decrease?</li>
                                <li><strong>Apply Rules:</strong> Use Normal Balance rules (e.g., Asset Increase = Debit).</li>
                            </ul>
                        </div>
                    </section>

                    <!-- STEP 2 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 2: Journalize Transactions</h3>
                        <p class="mb-4 text-gray-600">Recording in the <strong>General Journal</strong> (Book of Original Entry). This provides a chronological record using the <strong>Double-Entry System</strong> (Debits = Credits).</p>
                        [Image of general journal entry format]

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                            <div class="bg-yellow-50 p-3 rounded border border-yellow-200">
                              <span class="font-bold text-yellow-800 block mb-1">Formatting Rules</span>
                              <ul class="list-disc list-inside text-sm text-yellow-900 space-y-1">
                                <li>Debits are listed first, left aligned.</li>
                                <li>Credits are listed below debits and <strong>indented</strong> to the right.</li>
                                <li>Each entry must include a clear <strong>date</strong> at the top.</li>
                                <li>Provide a brief <strong>description</strong> or explanation under the entry.</li>
                                <li>Amounts should be aligned in a single column for clarity.</li>
                                <li>Total debits must always equal total credits.</li>
                              </ul>
                            </div>
                            <div class="bg-yellow-50 p-3 rounded border border-yellow-200">
  <span class="font-bold text-yellow-800 block mb-1">Compound Entry</span>
  <ul class="list-disc list-inside text-sm text-yellow-900 space-y-1">
    <li>Affects three or more accounts in one transaction.</li>
    <li>May include multiple debits and/or multiple credits.</li>
    <li>Total debits must equal total credits for balance.</li>
    <li>Used to record complex transactions (e.g., payroll, asset purchase with financing).</li>
    <li>Provides a single, organized record instead of separate simple entries.</li>
  </ul>
</div>
                        </div>
                    </section>

                    <!-- STEP 3 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 3: Post to the Ledger</h3>
                        <p class="mb-4 text-gray-600">Transferring data to the <strong>General Ledger</strong> (Book of Final Entry). While the journal is chronological, the ledger is <strong>topical</strong> (organized by account) to show running balances.</p>
                        [Image of general ledger T-account posting process]

                        <div class="bg-green-50 p-4 rounded-lg mt-4">
                            <h4 class="font-bold text-green-800 text-sm uppercase mb-2">Cross-Referencing (PR)</h4>
                            <p class="text-sm text-green-900">Write the Journal Page (e.g., J1) in the Ledger, and the Account Number in the Journal's PR column. This "bookmark" prevents double-posting.</p>
                        </div>
                    </section>

                    <!-- STEP 4 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 4: Unadjusted Trial Balance</h3>
                        <p class="mb-4 text-gray-600">An internal working paper proving <strong>mathematical equality</strong> (Debits = Credits). It is a checkpoint before adjustments.</p>
                        
                        <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                            <h4 class="font-bold text-red-800 text-sm">Limitations</h4>
                            <p class="text-xs text-red-900 mt-1">A balanced TB does not guarantee accuracy. It misses errors of principle (wrong account), omission (skipped entry), or compensating errors.</p>
                        </div>
                    </section>

                    <!-- STEP 5 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 5: Adjustments & Worksheet</h3>
                        <p class="mb-4 text-gray-600">Adhering to the <strong>Accrual Basis</strong>. Adjustments update accounts for time passage (Deferrals) or unrecorded activities (Accruals) to meet the Matching Principle.</p>
                        
                        <p class="text-sm text-gray-500 mt-2">The <strong>10-Column Worksheet</strong> is a rough draft tool. It includes: Unadjusted TB, Adjustments, Adjusted TB, Income Statement, and Balance Sheet columns.</p>
                    </section>
                </div>
            `,
            exercises: [
                {
                    type: "mcq",
                    question: "Which principle is violated if a personal withdrawal is recorded as a business expense?",
                    options: ["Matching Principle", "Business Entity Principle", "Revenue Recognition", "Cost Principle"],
                    correctIndex: 1,
                    explanation: "The Business Entity Principle separates personal affairs from business affairs."
                },
                {
                    type: "mcq",
                    question: "In the General Journal, how should Credit entries be formatted?",
                    options: ["Listed first, left aligned", "Listed second, left aligned", "Listed first, indented", "Listed second, indented to the right"],
                    correctIndex: 3,
                    explanation: "Credits are always listed below debits and indented to visually distinguish them."
                }
            ]
        },
        {
            day: "Day 2",
            topic: "Review: Reporting & Closing (Steps 6–10)",
            content: `
                <div class="space-y-8 animate-fade-in">
                    <div class="bg-emerald-50 p-6 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                        <h3 class="text-lg font-bold text-emerald-900 mb-2">Phase Overview</h3>
                        <p class="text-emerald-800">Focus: Formal reporting to external parties, updating official books, and closing temporary accounts.</p>
                        [Image of financial statement preparation flow]
                    </div>

                    <!-- STEP 6 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 6: Prepare Financial Statements</h3>
                        <p class="mb-4 text-gray-600">The primary product for stakeholders, prepared directly from the Worksheet columns.</p>
                        
                        <div class="space-y-3">
                            <div class="flex items-start">
                                <div class="bg-blue-100 text-blue-700 font-bold rounded px-2 py-1 text-xs mr-3 mt-1">1</div>
                                <div><strong class="text-slate-700">Income Statement:</strong> Revenue - Expenses = Net Income.</div>
                            </div>
                            <div class="flex items-start">
                                <div class="bg-blue-100 text-blue-700 font-bold rounded px-2 py-1 text-xs mr-3 mt-1">2</div>
                                <div><strong class="text-slate-700">Statement of Changes in Equity:</strong> Beg. Capital + Net Income - Withdrawals = End. Capital.</div>
                            </div>
                            <div class="flex items-start">
                                <div class="bg-blue-100 text-blue-700 font-bold rounded px-2 py-1 text-xs mr-3 mt-1">3</div>
                                <div><strong class="text-slate-700">Balance Sheet:</strong> Assets = Liabilities + End. Equity.</div>
                            </div>
                        </div>
                    </section>

                    <!-- STEP 7 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 7: Adjusting Entries (Journalize & Post)</h3>
                        <p class="mb-4 text-gray-600">Making the Worksheet adjustments official. Without this, the Ledger would not match the Financial Statements.</p>
                        <div class="bg-gray-50 p-4 rounded text-sm font-mono text-gray-700 border-l-4 border-gray-400">
                            Example: <br>
                            Dr. Depreciation Expense<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;Cr. Accumulated Depreciation
                        </div>
                    </section>

                    <!-- STEP 8 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 8: Closing Entries</h3>
                        <p class="mb-4 text-gray-600">Resetting <strong>Temporary (Nominal)</strong> accounts to zero (Revenue, Expense, Withdrawals). Permanent (Real) accounts remain open.</p>
                        
                        
                        <div class="grid grid-cols-2 gap-4 mt-4">
                            <div class="bg-purple-50 p-3 rounded text-center">
                                <span class="block font-bold text-purple-800">R</span> Revenue -> Income Summary
                            </div>
                            <div class="bg-purple-50 p-3 rounded text-center">
                                <span class="block font-bold text-purple-800">E</span> Expenses -> Income Summary
                            </div>
                            <div class="bg-purple-50 p-3 rounded text-center">
                                <span class="block font-bold text-purple-800">I</span> Income Summary -> Capital
                            </div>
                            <div class="bg-purple-50 p-3 rounded text-center">
                                <span class="block font-bold text-purple-800">D</span> Drawings -> Capital
                            </div>
                        </div>
                    </section>

                    <!-- STEP 9 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 9: Post-Closing Trial Balance</h3>
                        <p class="mb-4 text-gray-600">Proves the ledger is balanced for the new period. Contains <strong>only Real Accounts</strong> (Assets, Liabilities, Capital). No Revenue or Expenses should appear here.</p>
                    </section>

                    <!-- STEP 10 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 10: Reversing Entries (Optional)</h3>
                        <p class="mb-4 text-gray-600">Performed on Day 1 of the new period. Exact opposite of adjusting entries for Accruals. Used for convenience in recording future cash flows.</p>
                    </section>
                </div>
            `,
            exercises: [
                {
                    type: "mcq",
                    question: "Which of the following accounts appears on a Post-Closing Trial Balance?",
                    options: ["Service Revenue", "Rent Expense", "Accounts Receivable", "Owner's Withdrawals"],
                    correctIndex: 2,
                    explanation: "Only Permanent (Real) accounts appear post-closing. Revenue, Expenses, and Withdrawals are closed to zero."
                },
                {
                    type: "mcq",
                    question: "What is the correct order for closing entries (REID)?",
                    options: ["Revenue, Expenses, Income Summary, Drawings", "Revenue, Equity, Income, Debt", "Rent, Expenses, Interest, Drawings", "Revenue, Expenses, Investments, Drawings"],
                    correctIndex: 0,
                    explanation: "Close Revenue, then Expenses, then Income Summary (Net Income/Loss), then Drawings."
                }
            ]
        },
        {
            day: "Day 3",
            topic: "Practical: Journalizing to Trial Balance",
            content: `
                <div class="space-y-6">
                    <div class="bg-blue-600 text-white p-8 rounded-xl shadow-lg text-center">
                        <h2 class="text-3xl font-bold mb-2">Practical Activity 1</h2>
                        <p class="text-blue-100 text-lg">From Transactions to Unadjusted Trial Balance</p>
                    </div>

                    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-xl font-bold text-slate-800 mb-4">Activity Objectives</h3>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>Analyze source documents and determine account effects.</li>
                            <li>Record journal entries with proper formatting.</li>
                            <li>Post entries to T-accounts and calculate running balances.</li>
                            <li>Prove equality by preparing an Unadjusted Trial Balance.</li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 class="text-xl font-bold text-slate-800 mb-4">Scenario: "Speedy Tech Services"</h3>
                        <p class="mb-4 text-gray-600">You are the bookkeeper for Speedy Tech. The following transactions occurred in Jan 2024:</p>
                        <ul class="space-y-2 font-mono text-sm text-slate-700 bg-white p-4 rounded border border-gray-200">
                            <li><strong>Jan 1:</strong> Owner invested ₱50,000 cash.</li>
                            <li><strong>Jan 5:</strong> Purchased equipment for ₱20,000 on account.</li>
                            <li><strong>Jan 10:</strong> Performed services for ₱15,000 cash.</li>
                            <li><strong>Jan 15:</strong> Paid ₱5,000 for salaries.</li>
                            <li><strong>Jan 30:</strong> Owner withdrew ₱2,000 for personal use.</li>
                        </ul>
                        <p class="mt-4 text-gray-600 italic">Use the Practice Questions tab to simulate recording these entries.</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    type: "problem",
                    question: "Prepare the Journal Entry for Jan 5: Purchased equipment for ₱20,000 on account.",
                    answer: "Jan 5  Equipment           20,000\n       Accounts Payable        20,000\n       (Purchased equipment on account)",
                    explanation: "Equipment (Asset) increases, so we Debit. Accounts Payable (Liability) increases, so we Credit."
                }
            ]
        },
        {
            day: "Day 4",
            topic: "Practical: Worksheet & Statements",
            content: `
                <div class="space-y-6">
                    <div class="bg-blue-600 text-white p-8 rounded-xl shadow-lg text-center">
                        <h2 class="text-3xl font-bold mb-2">Practical Activity 2</h2>
                        <p class="text-blue-100 text-lg">The Worksheet & Financial Statements</p>
                    </div>

                    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-xl font-bold text-slate-800 mb-4">Activity Objectives</h3>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>Identify necessary adjustments (Depreciation, Accruals).</li>
                            <li>Complete a 10-Column Worksheet.</li>
                            <li>Extend balances to Income Statement and Balance Sheet columns.</li>
                            <li>Draft the formal Financial Statements.</li>
                        </ul>
                    </div>

                    <div class="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                        <h3 class="text-xl font-bold text-yellow-900 mb-2">Required Adjustments</h3>
                        <p class="text-yellow-800 mb-4">Proceeding with Speedy Tech Services (from Day 3):</p>
                        <ul class="list-disc list-inside space-y-1 text-yellow-900 text-sm">
                            <li><strong>a.</strong> Equipment depreciates at ₱500 per month.</li>
                            <li><strong>b.</strong> Unpaid salaries at month-end amount to ₱1,000.</li>
                        </ul>
                    </div>
                </div>
            `,
            exercises: [
                {
                    type: "problem",
                    question: "Calculate Net Income given: Revenue ₱15,000, Paid Salaries ₱5,000, Accrued Salaries ₱1,000, Depreciation ₱500.",
                    answer: "Net Income = ₱8,500",
                    explanation: "Revenue (15,000) - Expenses (5,000 Paid + 1,000 Accrued + 500 Depreciation) = 15,000 - 6,500 = 8,500."
                }
            ]
        },
        {
            day: "Day 5",
            topic: "Practical: Closing the Books",
            content: `
                <div class="space-y-6">
                    <div class="bg-blue-600 text-white p-8 rounded-xl shadow-lg text-center">
                        <h2 class="text-3xl font-bold mb-2">Practical Activity 3</h2>
                        <p class="text-blue-100 text-lg">Adjusting, Closing, and Reversing</p>
                    </div>

                    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-xl font-bold text-slate-800 mb-4">Activity Objectives</h3>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>Journalize and Post the adjustments from the worksheet.</li>
                            <li>Prepare and post Closing Entries (REID).</li>
                            <li>Generate a Post-Closing Trial Balance.</li>
                            <li>Determine if Reversing Entries are needed.</li>
                        </ul>
                    </div>

                     <div class="bg-purple-50 p-6 rounded-xl border border-purple-200">
                        <h3 class="text-xl font-bold text-purple-900 mb-2">Closing Challenge</h3>
                        <p class="text-purple-800">Use the T-account method to verify that the Income Summary balance equals the Net Income before closing it to Capital.</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    type: "problem",
                    question: "Prepare the entry to close the Service Revenue account (Balance: ₱15,000).",
                    answer: "Service Revenue       15,000\n       Income Summary          15,000",
                    explanation: "Revenue has a Credit balance. To close it (make it zero), we Debit it for the full amount and Credit Income Summary."
                }
            ]
        }
    ]
};
