// Content for Unit 2 Week 2: Merchandising Business
// FIXED: We use 'export const' to create a named export.

export const unit2Week2Data = {
    week2: [
        {
    day: "Day 1",
    topic: "Recording Purchases and Sales & Trade Discounts",
    content: `
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p class="font-bold text-blue-900">Learning Goal</p>
            <p class="text-blue-800">Master the recording of purchases and sales under Perpetual and Periodic systems, including the handling of Trade Discounts.</p>
        </div>

        <h3 class="text-xl font-bold mb-4 mt-6">Topic Focus</h3>
        
        <div class="space-y-8 mb-6">
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 class="text-xl font-bold text-gray-800 mb-3">1. Perpetual vs. Periodic Inventory Systems</h3>
                <p class="text-gray-700 mb-4">
                    Accounting for merchandising businesses relies on how they track inventory.
                </p>
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 class="font-bold text-green-800 mb-2">Perpetual System</h4>
                        <ul class="list-disc pl-5 text-sm text-green-900 space-y-1">
                            <li><strong>Real-time updates:</strong> Records are updated immediately after every transaction.</li>
                            <li><strong>Account used:</strong> "Merchandise Inventory" (Asset).</li>
                            <li><strong>Control:</strong> High control; updates COGS instantly.</li>
                        </ul>
                    </div>
                    <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h4 class="font-bold text-orange-800 mb-2">Periodic System</h4>
                        <ul class="list-disc pl-5 text-sm text-orange-900 space-y-1">
                            <li><strong>Occasional updates:</strong> Inventory updated only at period-end via physical count.</li>
                            <li><strong>Account used:</strong> "Purchases" (Expense-like account).</li>
                            <li><strong>Control:</strong> Lower control; COGS is calculated at month-end.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 class="text-xl font-bold text-gray-800 mb-3">2. Trade Discounts: The "Hidden" Deduction</h3>
                
                <p class="text-gray-700 mb-4">
                    Suppliers often offer a <strong>Trade Discount</strong> to wholesalers or bulk buyers. This is a reduction from the <em>List Price</em> (Catalog Price) to determine the actual price charged.
                </p>
                
                <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <p class="font-bold text-red-800">The Golden Rule of Trade Discounts:</p>
                    <p class="text-red-700 text-sm">
                        Trade discounts are <strong>NEVER recorded</strong> in the journal. We calculate the <strong>Invoice Price</strong> (Net Price) first, and that is the only number we use in our accounting records.
                    </p>
                </div>

                <div class="bg-gray-100 p-4 rounded-md font-mono text-sm text-gray-700">
                    <p><strong>Example:</strong> Item List Price is ₱100,000 with a 20% Trade Discount.</p>
                    <p class="mt-2">List Price: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ₱100,000</p>
                    <p>Less: Discount: &nbsp; (20,000) <span class="text-gray-400 italic"><-- Do not journalize this!</span></p>
                    <p class="border-t border-gray-400 mt-1 pt-1 font-bold">Invoice Price: &nbsp; ₱ 80,000 <span class="text-green-600"><-- Record this amount!</span></p>
                </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 class="text-xl font-bold text-gray-800 mb-3">3. Recording Purchases (Buying)</h3>
                <p class="text-gray-700 mb-4 text-sm">
                    <strong>Scenario:</strong> Purchased goods with a List Price of ₱10,000, Trade Discount of 10%, on account. <br>
                    <strong>Invoice Price to Record:</strong> ₱9,000.
                </p>
                
                <table class="w-full text-sm text-left text-gray-600 border border-gray-300">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th class="px-4 py-3 border-r">System</th>
                            <th class="px-4 py-3">Journal Entry (Amount is ₱9,000)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white border-b">
                            <td class="px-4 py-3 font-medium text-gray-900 border-r">Perpetual</td>
                            <td class="px-4 py-3">
                                <div class="font-mono text-xs">
                                    <div class="text-blue-600">Dr. Merchandise Inventory <span class="text-black">9,000</span></div>
                                    <div class="pl-4 text-red-600">Cr. Accounts Payable <span class="text-black">9,000</span></div>
                                </div>
                            </td>
                        </tr>
                        <tr class="bg-white">
                            <td class="px-4 py-3 font-medium text-gray-900 border-r">Periodic</td>
                            <td class="px-4 py-3">
                                <div class="font-mono text-xs">
                                    <div class="text-blue-600">Dr. Purchases <span class="text-black">9,000</span></div>
                                    <div class="pl-4 text-red-600">Cr. Accounts Payable <span class="text-black">9,000</span></div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 class="text-xl font-bold text-gray-800 mb-3">4. Recording Sales (Selling)</h3>
                <p class="text-gray-700 mb-4 text-sm">
                    <strong>Scenario:</strong> Sold goods with a List Price of ₱20,000, Trade Discount 5%. <br>
                    <strong>Invoice Price (Revenue):</strong> ₱19,000. <br>
                    <strong>Cost of Goods Sold (Cost):</strong> ₱10,000 (Given).
                </p>

                <table class="w-full text-sm text-left text-gray-600 border border-gray-300">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th class="px-4 py-3 border-r">System</th>
                            <th class="px-4 py-3">Journal Entry</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white border-b">
                            <td class="px-4 py-3 font-medium text-gray-900 border-r">Perpetual</td>
                            <td class="px-4 py-3">
                                <div class="font-mono text-xs mb-2">
                                    <div class="text-blue-600">Dr. Accounts Receivable <span class="text-black">19,000</span></div>
                                    <div class="pl-4 text-red-600">Cr. Sales <span class="text-black">19,000</span></div>
                                </div>
                                <div class="font-mono text-xs border-t border-dashed pt-2">
                                    <div class="text-blue-600">Dr. Cost of Goods Sold <span class="text-black">10,000</span></div>
                                    <div class="pl-4 text-red-600">Cr. Mdse. Inventory <span class="text-black">10,000</span></div>
                                </div>
                            </td>
                        </tr>
                        <tr class="bg-white">
                            <td class="px-4 py-3 font-medium text-gray-900 border-r">Periodic</td>
                            <td class="px-4 py-3 align-top">
                                <div class="font-mono text-xs">
                                    <div class="text-blue-600">Dr. Accounts Receivable <span class="text-black">19,000</span></div>
                                    <div class="pl-4 text-red-600">Cr. Sales <span class="text-black">19,000</span></div>
                                </div>
                                <p class="text-xs text-gray-400 mt-2 italic">(No COGS entry is made)</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    exercises: [
        // --- 5 THEORY QUESTIONS ---
        {
            type: "mcq",
            question: "Which of the following best describes how a Trade Discount is recorded in the General Journal?",
            options: [
                "Debit Sales Discount, Credit Accounts Receivable",
                "Debit Trade Discount Expense",
                "It is not recorded; transactions are recorded at the Net (Invoice) Price",
                "It is recorded as a liability"
            ],
            correctIndex: 2,
            explanation: "Trade discounts are deducted mentally or on scratch paper. The journal entry only uses the final Invoice Price."
        },
        {
            type: "mcq",
            question: "In a Periodic System, which account is debited when inventory is purchased?",
            options: ["Merchandise Inventory", "Purchases", "Cost of Goods Sold", "Accounts Payable"],
            correctIndex: 1,
            explanation: "The Periodic system uses the temporary 'Purchases' account for buying goods."
        },
        {
            type: "mcq",
            question: "Why do Perpetual systems require two entries for every sale?",
            options: [
                "To double the revenue recorded.",
                "One entry records the Revenue (Sales), the other records the Expense (COGS) and inventory reduction.",
                "To account for trade discounts separately.",
                "One is for the buyer, one is for the seller."
            ],
            correctIndex: 1,
            explanation: "Perpetual systems match the revenue earned with the cost incurred immediately at the point of sale."
        },
        {
            type: "mcq",
            question: "If a product has a List Price of ₱1,000 and a 10% Trade Discount, what amount appears on the invoice?",
            options: ["₱1,100", "₱1,000", "₱900", "₱100"],
            correctIndex: 2,
            explanation: "List Price (1,000) minus 10% (100) equals the Invoice Price (900)."
        },
        {
            type: "mcq",
            question: "Which account is credited when a company buys inventory on account (credit) in a Perpetual system?",
            options: ["Cash", "Sales", "Accounts Receivable", "Accounts Payable"],
            correctIndex: 3,
            explanation: "Purchasing on account creates a liability, which is recorded by crediting Accounts Payable."
        },

        // --- 5 PROBLEM SOLVING QUESTIONS (Journal Entries with Trade Discounts) ---
        {
            type: "problem",
            question: "<strong>Journalizing (Perpetual - Purchase):</strong> <br>Purchased goods with a List Price of ₱50,000 less a 20% trade discount. The purchase was made on credit.",
            answer: `Calculation:
List Price:    50,000
Less 20%:     (10,000)
Invoice Price: 40,000

Journal Entry:
Dr. Merchandise Inventory   40,000
    Cr. Accounts Payable       40,000`,
            explanation: "We only record the Invoice Price of ₱40,000. The ₱10,000 discount is ignored in the journal."
        },
        {
            type: "problem",
            question: "<strong>Journalizing (Periodic - Purchase):</strong> <br>Purchased goods with a List Price of ₱20,000 less a 10% trade discount. The terms were COD (Cash on Delivery).",
            answer: `Calculation:
List Price:    20,000
Less 10%:      (2,000)
Invoice Price: 18,000

Journal Entry:
Dr. Purchases               18,000
    Cr. Cash                   18,000`,
            explanation: "Under Periodic, we debit 'Purchases'. Since it's COD, we credit Cash. We use the net amount of ₱18,000."
        },
        {
            type: "problem",
            question: "<strong>Journalizing (Perpetual - Sale):</strong> <br>Sold inventory with a List Price of ₱100,000 less a 25% trade discount on account. The cost of the goods sold was ₱40,000.",
            answer: `Calculation:
List Price:    100,000
Less 25%:      (25,000)
Invoice Price:  75,000

Entry 1 (Revenue):
Dr. Accounts Receivable     75,000
    Cr. Sales                  75,000

Entry 2 (Cost):
Dr. Cost of Goods Sold      40,000
    Cr. Mdse. Inventory        40,000`,
            explanation: "Revenue is recorded at the Invoice Price (₱75k). The Cost entry uses the cost given (₱40k)."
        },
        {
            type: "problem",
            question: "<strong>Journalizing (Periodic - Sale):</strong> <br>Sold inventory with a List Price of ₱30,000 less a 5% trade discount for Cash. The cost of the goods sold was ₱15,000.",
            answer: `Calculation:
List Price:    30,000
Less 5%:       (1,500)
Invoice Price: 28,500

Journal Entry:
Dr. Cash                    28,500
    Cr. Sales                  28,500

(No entry for COGS in Periodic)`,
            explanation: "In Periodic, we only record the Sales Revenue at the Invoice Price. The cost is ignored until the end-of-period count."
        },
        {
            type: "problem",
            question: "<strong>Journalizing (Chain Discount):</strong> <br>Purchased inventory (Periodic System) with a List Price of ₱10,000. The supplier offered trade discounts of 20% and 10%. Determine the Invoice Price and the Journal Entry (Credit).",
            answer: `Step 1: 10,000 - 20% = 8,000
Step 2:  8,000 - 10% = 7,200
Invoice Price: ₱7,200

Journal Entry:
Dr. Purchases               7,200
    Cr. Accounts Payable       7,200`,
            explanation: "Apply the discounts sequentially (Chain Discount). 10k minus 2k is 8k. Then 8k minus 800 is 7,200."
        }
    ]
},
        {
  "day": "Day 2",
  "topic": "Discounts, Returns, and Net Calculations (Periodic vs. Perpetual)",
  "content": "<div class=\"bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500\">\n    <p class=\"font-bold text-blue-900\">Learning Goal</p>\n    <p class=\"text-blue-800\">Master the recording of Trade Discounts, Purchase/Sales Discounts, and Returns.</p>\n    <p class=\"text-blue-800\">Differentiate between Periodic and Perpetual entries for these transactions.</p>\n</div>\n\n<h3 class=\"text-xl font-bold mb-4 mt-6\">Topic Focus</h3>\n<ul class=\"list-none space-y-8 mb-6\">\n\n    \n    <li class=\"bg-white p-6 rounded-lg shadow-sm border border-gray-200\">\n        <h3 class=\"text-xl font-bold text-gray-800 mb-3\">1. Types of Discounts</h3>\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n            <div class=\"bg-gray-50 p-4 rounded\">\n                <h4 class=\"font-bold text-purple-700\">Trade Discounts</h4>\n                <p class=\"text-sm text-gray-700 mt-2\">Reductions from the list price given to customers (e.g., wholesalers) before the transaction is recorded.</p>\n                <p class=\"text-sm text-gray-900 font-bold mt-2\">Treatment: Not recorded in the books. Record the transaction at the net price (List - Trade Discount).</p>\n            </div>\n            <div class=\"bg-gray-50 p-4 rounded\">\n                <h4 class=\"font-bold text-green-700\">Cash Discounts (Sales/Purchase Discounts)</h4>\n                <p class=\"text-sm text-gray-700 mt-2\">Incentives for early payment (e.g., 2/10, n/30).</p>\n                <p class=\"text-sm text-gray-900 font-bold mt-2\">Treatment: Recorded in the books when payment is made/received within the discount period.</p>\n            </div>\n        </div>\n    </li>\n\n    \n    <li class=\"bg-white p-6 rounded-lg shadow-sm border border-gray-200\">\n        <h3 class=\"text-xl font-bold text-gray-800 mb-3\">2. Recording Returns & Discounts: System Comparison</h3>\n        <p class=\"text-gray-700 mb-4\">The key difference lies in the <strong>Purchase</strong> side. The <strong>Sales</strong> side is recorded similarly for Revenue, but Cost of Goods Sold (COGS) entries differ.</p>\n\n        <div class=\"overflow-x-auto\">\n            <table class=\"w-full text-sm text-left text-gray-700\">\n                <thead class=\"text-xs text-gray-700 uppercase bg-gray-200\">\n                    <tr>\n                        <th class=\"px-4 py-2\">Transaction</th>\n                        <th class=\"px-4 py-2\">Periodic System (Uses Temporary Accounts)</th>\n                        <th class=\"px-4 py-2\">Perpetual System (Updates Inventory Directly)</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr class=\"bg-white border-b\">\n                        <td class=\"px-4 py-2 font-bold\">Purchase Goods</td>\n                        <td class=\"px-4 py-2\">Dr. <span class=\"text-red-600\">Purchases</span></td>\n                        <td class=\"px-4 py-2\">Dr. <span class=\"text-blue-600\">Inventory</span></td>\n                    </tr>\n                    <tr class=\"bg-gray-50 border-b\">\n                        <td class=\"px-4 py-2 font-bold\">Purchase Return</td>\n                        <td class=\"px-4 py-2\">Cr. <span class=\"text-red-600\">Purchase Returns & Allowances</span></td>\n                        <td class=\"px-4 py-2\">Cr. <span class=\"text-blue-600\">Inventory</span></td>\n                    </tr>\n                    <tr class=\"bg-white border-b\">\n                        <td class=\"px-4 py-2 font-bold\">Purchase Discount Taken</td>\n                        <td class=\"px-4 py-2\">Cr. <span class=\"text-red-600\">Purchase Discounts</span></td>\n                        <td class=\"px-4 py-2\">Cr. <span class=\"text-blue-600\">Inventory</span></td>\n                    </tr>\n                    <tr class=\"bg-gray-50 border-b\">\n                        <td class=\"px-4 py-2 font-bold\">Sales Return</td>\n                        <td class=\"px-4 py-2\">Dr. Sales Returns & Allowances<br>(No COGS entry)</td>\n                        <td class=\"px-4 py-2\">Dr. Sales Returns & Allowances<br><em>AND</em><br>Dr. Inventory / Cr. COGS</td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    </li>\n\n    \n    <li class=\"bg-white p-6 rounded-lg shadow-sm border border-gray-200\">\n        <h3 class=\"text-xl font-bold text-gray-800 mb-3\">3. Net Calculation Formulas</h3>\n        <div class=\"space-y-4\">\n            <div class=\"bg-indigo-50 p-4 rounded border-l-4 border-indigo-400\">\n                <h5 class=\"font-bold text-indigo-900\">Net Purchases</h5>\n                <p class=\"font-mono text-sm mt-1\">Purchases - Purchase Returns & Allowances - Purchase Discounts = <span class=\"font-bold\">Net Purchases</span></p>\n                <p class=\"text-xs text-indigo-700 mt-1\">(Note: Freight-In is added later to get Cost of Goods Purchased)</p>\n            </div>\n            <div class=\"bg-orange-50 p-4 rounded border-l-4 border-orange-400\">\n                <h5 class=\"font-bold text-orange-900\">Net Sales</h5>\n                <p class=\"font-mono text-sm mt-1\">Sales - Sales Returns & Allowances - Sales Discounts = <span class=\"font-bold\">Net Sales</span></p>\n            </div>\n        </div>\n    </li>\n</ul>",
  "exercises": [
    {
      "type": "mcq",
      "question": "Which of the following best describes a 'Trade Discount'?",
      "options": [
        "A reduction given for early payment within a specific period.",
        "A reduction from list price generally defined by trade/quantity, not recorded in accounts.",
        "A refund given to a customer for defective goods.",
        "A discount recorded in the 'Purchase Discounts' account."
      ],
      "correctIndex": 1,
      "explanation": "Trade discounts are deducted from the list price to determine the actual selling price before any entry is made. They are not recorded in the accounting books."
    },
    {
      "type": "mcq",
      "question": "In a PERPETUAL inventory system, when a company returns defective merchandise to a supplier, which account is Credited?",
      "options": [
        "Purchase Returns and Allowances",
        "Cost of Goods Sold",
        "Inventory",
        "Accounts Payable"
      ],
      "correctIndex": 2,
      "explanation": "Under the Perpetual system, the 'Inventory' account is directly reduced (credited) for returns, purchase discounts, and cost of sales."
    },
    {
      "type": "mcq",
      "question": "Identify the formula for Net Sales:",
      "options": [
        "Sales + Sales Returns + Sales Discounts",
        "Sales - Cost of Goods Sold",
        "Sales - Sales Returns and Allowances - Sales Discounts",
        "Gross Profit - Operating Expenses"
      ],
      "correctIndex": 2,
      "explanation": "Net Sales represents the actual revenue generated after deducting any returns, allowances, or discounts granted to customers."
    },
    {
      "type": "mcq",
      "question": "A company uses the PERIODIC system. When they pay for goods within the discount period, the credit to 'Cash' is balanced by a debit to 'Accounts Payable' and a credit to:",
      "options": [
        "Inventory",
        "Purchase Discounts",
        "Sales Discounts",
        "Cost of Goods Sold"
      ],
      "correctIndex": 1,
      "explanation": "In the Periodic system, the savings from early payment are recorded in the specific contra-expense account 'Purchase Discounts'."
    },
    {
      "type": "problem",
      "question": "PERIODIC SYSTEM - PURCHASES SCENARIO\n\nJournalize the following transactions for Company A (Buyer) using the Periodic Inventory System:\n1.  **March 1:** Purchased merchandise with a list price of $5,000, less a 20% trade discount. Terms: 2/10, n/30.\n2.  **March 3:** Returned defective merchandise with a list price of $500 (Gross) to the supplier.\n3.  **March 10:** Paid the full amount due within the discount period.",
      "answer": "March 1 (Purchase):\nDr. Purchases ...................... 4,000\n    Cr. Accounts Payable ................... 4,000\n*(Calculation: $5,000 list - 20% trade discount = $4,000)*\n\nMarch 3 (Return):\nDr. Accounts Payable ............... 400\n    Cr. Purchase Returns & Allowances ...... 400\n*(Calculation: $500 list - 20% trade discount = $400)*\n\nMarch 10 (Payment):\nDr. Accounts Payable ............... 3,600\n    Cr. Purchase Discounts ................. 72\n    Cr. Cash ............................... 3,528\n*(Calculation: AP Balance $4,000 - $400 = $3,600. Discount 2% of $3,600 = $72)*",
      "explanation": "Note that Trade Discounts are deducted immediately. The Purchase Discount (2%) is calculated on the *outstanding Accounts Payable balance* ($3,600) after the return."
    },
    {
      "type": "problem",
      "question": "PERPETUAL SYSTEM - PURCHASES SCENARIO\n\nJournalize the following transactions for Company B (Buyer) using the Perpetual Inventory System:\n1.  **June 1:** Purchased inventory on account for $10,000. Terms 3/10, n/30.\n2.  **June 5:** Received an allowance of $1,000 for slightly damaged goods (kept the goods).\n3.  **June 11:** Paid the balance due within the discount period.",
      "answer": "June 1 (Purchase):\nDr. Inventory ...................... 10,000\n    Cr. Accounts Payable ................... 10,000\n\nJune 5 (Allowance):\nDr. Accounts Payable ............... 1,000\n    Cr. Inventory .......................... 1,000\n\nJune 11 (Payment):\nDr. Accounts Payable ............... 9,000\n    Cr. Inventory .......................... 270\n    Cr. Cash ............................... 8,730\n*(Calculation: AP Balance $9,000 x 3% = $270. In Perpetual, discounts reduce the Inventory asset account)*",
      "explanation": "In a Perpetual system, 'Purchases', 'Returns', and 'Discounts' accounts are replaced by the 'Inventory' account."
    },
    {
      "type": "problem",
      "question": "PERIODIC SYSTEM - SALES SCENARIO\n\nJournalize the following transactions for Company C (Seller) using the Periodic Inventory System:\n1.  **July 1:** Sold merchandise on account for $8,000. Terms 1/15, n/30.\n2.  **July 4:** Customer returned goods with a sales price of $500.\n3.  **July 15:** Received payment in full from the customer.",
      "answer": "July 1 (Sale):\nDr. Accounts Receivable ............ 8,000\n    Cr. Sales Revenue ...................... 8,000\n*(No entry for COGS in Periodic)*\n\nJuly 4 (Return):\nDr. Sales Returns & Allowances ..... 500\n    Cr. Accounts Receivable ................ 500\n*(No entry for Inventory restoration in Periodic)*\n\nJuly 15 (Collection):\nDr. Cash ........................... 7,425\nDr. Sales Discounts ................ 75\n    Cr. Accounts Receivable ................ 7,500\n*(Calculation: AR Balance $8,000 - $500 = $7,500. Discount 1% of $7,500 = $75)*",
      "explanation": "Under Periodic, we record revenue and AR, but we do NOT touch Inventory or COGS at the time of sale or return."
    },
    {
      "type": "problem",
      "question": "PERPETUAL SYSTEM - SALES SCENARIO\n\nJournalize the following transactions for Company D (Seller) using the Perpetual Inventory System. (Cost of goods is 60% of selling price).\n1.  **Aug 1:** Sold goods on credit for $20,000. Terms 2/10, n/30.\n2.  **Aug 5:** Granted a credit allowance of $2,000 to the customer for defects (customer kept goods).\n3.  **Aug 10:** Received payment in full.",
      "answer": "Aug 1 (Sale):\nDr. Accounts Receivable ............ 20,000\n    Cr. Sales Revenue ...................... 20,000\nDr. Cost of Goods Sold ............. 12,000\n    Cr. Inventory .......................... 12,000\n*(Cost = $20,000 * 60%)*\n\nAug 5 (Allowance):\nDr. Sales Returns & Allowances ..... 2,000\n    Cr. Accounts Receivable ................ 2,000\n*(No inventory entry for Allowance as goods were not returned)*\n\nAug 10 (Collection):\nDr. Cash ........................... 17,640\nDr. Sales Discounts ................ 360\n    Cr. Accounts Receivable ................ 18,000\n*(Calculation: AR Balance $18,000. Discount 2% = $360)*",
      "explanation": "Perpetual sales require two entries: one for Revenue (at selling price) and one for COGS (at cost). Allowances reduce AR but do not affect Inventory cost unless goods physically return."
    }
  ]
},
        {
            day: "Day 3",
            topic: "The Perpetual Inventory System",
            content: `<div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
    <p class="font-bold text-blue-900">Learning Goal</p>
    <p class="text-blue-800">Master the mechanics of the Perpetual Inventory System and understand how it tracks costs in real-time.</p>
</div>

<h3 class="text-xl font-bold mb-4 mt-6">Topic Focus</h3>
<ul class="list-none space-y-8 mb-6">

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">1. Definition: Continuous Tracking</h3>
        <div class="text-gray-700 mb-4">
            <p class="mb-3">
                The <strong>Perpetual Inventory System</strong> is a method of accounting that maintains a continuous, real-time record of inventory balances. The word "perpetual" means "never-ending" or "continuous." Under this system, the accounting records are updated <strong>immediately</strong> every time an item is bought, sold, or returned.
            </p>

            <h4 class="font-bold mb-1">The Modern Standard</h4>
            <p class="mb-3">
                Historically, this system was reserved for high-value items (like jewelry or cars) because the record-keeping was tedious. However, with the advent of barcode scanners and Point-of-Sale (POS) software, almost all modern businesses—from grocery stores to Amazon—use the Perpetual system.
            </p>

            <ul class="list-disc pl-5 mb-4 space-y-2">
                <li>
                    <strong>Detailed Records:</strong> The company knows exactly how many units of Product X are on the shelf at any specific moment without going to the warehouse to count them.
                </li>
                <li>
                    <strong>Cost of Goods Sold (COGS):</strong> Unlike the Periodic system, which calculates COGS at the end of the month, the Perpetual system calculates COGS <em>at the moment of the sale</em>.
                </li>
            </ul>
        </div>
        <div class="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
            <strong>Analogy:</strong> Think of the grocery store scanner. When it "beeps," two things happen instantly: 1) The sale is recorded, and 2) The inventory count for that item is reduced by one.
        </div>
    </li>

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">2. The "Two-Entry" Rule</h3>
        <p class="text-gray-700 mb-4">
            The most distinct feature of the Perpetual System is what happens during a sale. Because we are tracking inventory in real-time, <strong>every sale requires two separate journal entries.</strong>
        </p>

        <div class="my-6 flex justify-center">
            <svg width="100%" height="auto" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" class="max-w-2xl">
                <rect x="0" y="0" width="600" height="300" fill="#f9f9f9" rx="10"/>
                <text x="300" y="30" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="#333">The Perpetual Sale Workflow</text>
                
                <g transform="translate(20, 100)">
                    <rect x="0" y="0" width="120" height="80" fill="#37474f" rx="5"/>
                    <text x="60" y="35" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="white">Sale Occurs</text>
                    <text x="60" y="55" font-family="Arial" font-size="12" text-anchor="middle" fill="#cfd8dc">(Scan Item)</text>
                </g>

                <defs>
                    <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#2196f3"/>
                    </marker>
                    <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#f44336"/>
                    </marker>
                </defs>

                <line x1="140" y1="140" x2="220" y2="100" stroke="#2196f3" stroke-width="3" marker-end="url(#arrowhead-blue)"/>
                <line x1="140" y1="140" x2="220" y2="180" stroke="#f44336" stroke-width="3" marker-end="url(#arrowhead-red)"/>

                <g transform="translate(240, 60)">
                    <rect x="0" y="0" width="320" height="80" fill="#e3f2fd" stroke="#2196f3" stroke-width="2" rx="5"/>
                    <text x="10" y="25" font-family="Arial" font-size="14" font-weight="bold" fill="#0d47a1">Entry 1: Record the Revenue</text>
                    <text x="10" y="50" font-family="Arial" font-size="12" fill="#333">Debit: Cash / Accounts Receivable</text>
                    <text x="10" y="65" font-family="Arial" font-size="12" fill="#333">Credit: Sales Revenue</text>
                    <text x="250" y="55" font-family="Arial" font-size="16" font-weight="bold" fill="#0d47a1">Selling Price</text>
                </g>

                <g transform="translate(240, 150)">
                    <rect x="0" y="0" width="320" height="80" fill="#ffebee" stroke="#f44336" stroke-width="2" rx="5"/>
                    <text x="10" y="25" font-family="Arial" font-size="14" font-weight="bold" fill="#b71c1c">Entry 2: Update the Inventory</text>
                    <text x="10" y="50" font-family="Arial" font-size="12" fill="#333">Debit: Cost of Goods Sold (Expense)</text>
                    <text x="10" y="65" font-family="Arial" font-size="12" fill="#333">Credit: Inventory (Asset)</text>
                    <text x="260" y="55" font-family="Arial" font-size="16" font-weight="bold" fill="#b71c1c">Cost Price</text>
                </g>
                
                <text x="300" y="280" font-family="Arial" font-size="12" font-style="italic" text-anchor="middle" fill="#666">Note: The customer sees Entry 1. The company internally records Entry 2.</text>
            </svg>
        </div>
    </li>

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">3. Transaction Flows</h3>
        <p class="text-gray-700 mb-4">
            In a Perpetual system, the "Inventory" account is very active. It increases when we buy goods and decreases when we sell them.
        </p>

        <div class="space-y-6">
            
            <div class="bg-slate-50 p-4 rounded-lg border-l-4 border-orange-400">
                <h5 class="font-bold text-slate-800 mb-2 flex items-center">
                    <i class="fas fa-truck-loading mr-2 text-orange-500"></i> Purchasing Merchandise
                </h5>
                <p class="text-sm text-slate-700 mb-2">When buying goods for resale, we debit the Inventory account directly. We do <strong>not</strong> use a "Purchases" account.</p>
                <div class="bg-white p-3 border border-gray-300 rounded text-sm font-mono">
                    <div class="flex justify-between"><span>Inventory</span> <span>Dr</span></div>
                    <div class="flex justify-between pl-8"><span>Accounts Payable / Cash</span> <span>Cr</span></div>
                </div>
            </div>

            <div class="bg-slate-50 p-4 rounded-lg border-l-4 border-purple-400">
                <h5 class="font-bold text-slate-800 mb-2 flex items-center">
                    <i class="fas fa-shipping-fast mr-2 text-purple-500"></i> Freight In (Shipping Costs)
                </h5>
                <p class="text-sm text-slate-700 mb-2">If the buyer pays for shipping (FOB Shipping Point), this cost is considered part of the asset's value. It makes the inventory more expensive.</p>
                <div class="bg-white p-3 border border-gray-300 rounded text-sm font-mono">
                    <div class="flex justify-between"><span>Inventory</span> <span>Dr</span></div>
                    <div class="flex justify-between pl-8"><span>Cash</span> <span>Cr</span></div>
                </div>
            </div>

            <div class="bg-slate-50 p-4 rounded-lg border-l-4 border-red-400">
                <h5 class="font-bold text-slate-800 mb-2 flex items-center">
                    <i class="fas fa-cash-register mr-2 text-red-500"></i> Selling Merchandise
                </h5>
                <p class="text-sm text-slate-700 mb-2">As detailed in the diagram above, two entries are required.</p>
                <div class="bg-white p-3 border border-gray-300 rounded text-sm font-mono space-y-2">
                    <div>
                        <div class="flex justify-between"><span>Accounts Receivable</span> <span>Dr (Selling Price)</span></div>
                        <div class="flex justify-between pl-8"><span>Sales Revenue</span> <span>Cr (Selling Price)</span></div>
                    </div>
                    <div class="border-t border-dashed border-gray-300 pt-2">
                        <div class="flex justify-between"><span>Cost of Goods Sold</span> <span>Dr (Cost Price)</span></div>
                        <div class="flex justify-between pl-8"><span>Inventory</span> <span>Cr (Cost Price)</span></div>
                    </div>
                </div>
            </div>

        </div>
    </li>

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 class="text-xl font-bold text-gray-800 mb-3">4. Limitations, Internal Control & Costing Methods</h3>
    
    <div class="mb-6">
        <h4 class="font-bold text-gray-700 mb-2">Why Count if We Scan Everything?</h4>
        <p class="text-gray-700 mb-3">
            Even though the Perpetual System tracks every single transaction in real-time, a <strong>Physical Count (Stocktake)</strong> is still mandatory at least once a year. It serves as a critical Internal Control mechanism.
        </p>
        <ul class="list-disc pl-5 space-y-2 text-gray-600">
            <li>
                <strong>Reality Check (The Discrepancy):</strong> The computer record shows what <em>should</em> be on the shelf (Book Value). The physical count reveals what <em>is actually</em> there.
            </li>
            <li>
                <strong>Detecting Shrinkage:</strong> The difference between the computer record and the physical count is called <strong>Shrinkage</strong>. This represents theft (shoplifting or employee theft), spoilage, or administrative errors that the computer missed.
            </li>
            <li>
                <strong>Valuation Accuracy:</strong> Inventory must be reported on the Balance Sheet at the lower of its cost or market value. You cannot accurately value what you do not physically verify exists.
            </li>
        </ul>
        
        <div class="mt-4 bg-red-50 p-4 rounded-md text-sm text-red-800 border border-red-200 flex items-start">
            <i class="fas fa-exclamation-triangle mt-1 mr-2"></i>
            <div>
                <strong>The Adjustment Formula:</strong><br>
                <span class="font-mono">Book Value (Computer) - Physical Count (Actual) = Shrinkage Expense</span>
                <br><span class="text-xs italic mt-1 text-red-600">Note: This amount is recorded as an adjustment, increasing Cost of Goods Sold and decreasing Inventory.</span>
            </div>
        </div>
    </div>

    <div class="border-t border-gray-200 pt-6">
        <h4 class="font-bold text-gray-700 mb-2">Costing in a Perpetual System</h4>
        <p class="text-gray-700 mb-3">
            In a Perpetual system, we don't just count costs at the end of the month. We must assign a cost to <em>every specific unit</em> the moment it is sold. Since identical items are bought at different prices throughout the year, we use specific assumptions to determine which "cost" is moved to Expense (COGS).
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h5 class="font-bold text-blue-900 text-sm">1. FIFO (First-In, First-Out)</h5>
                <p class="text-xs text-blue-800 mt-1">
                    <strong>The Assumption:</strong> The oldest costs on the books are the first ones removed when a sale happens.
                </p>
                <p class="text-xs text-blue-800 mt-2">
                    <strong>Perpetual Impact:</strong> Simple to track. The "balance" always consists of the most recently purchased units.
                </p>
            </div>

            <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h5 class="font-bold text-green-900 text-sm">2. Moving Average</h5>
                <p class="text-xs text-green-800 mt-1">
                    <strong>The Assumption:</strong> We calculate a new average unit cost <em>immediately after every purchase</em>.
                </p>
                <p class="text-xs text-green-800 mt-2">
                    <strong>Perpetual Impact:</strong> Dynamic. Unlike the "Weighted Average" in a periodic system (calculated once at month-end), this average fluctuates daily as you buy new stock.
                </p>
            </div>
        </div>
    </div>
</li>

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 class="text-xl font-bold text-gray-800 mb-3">4. Practice: FIFO vs. Moving Average (Perpetual)</h3>

    <div class="bg-gray-50 p-4 rounded-lg border border-gray-300 mb-6">
        <h4 class="font-bold text-gray-900 mb-2">The Scenario</h4>
        <p class="text-sm text-gray-700 mb-3">
            A tech store tracks its stock of "Wireless Earbuds" (Item #501) during October.
        </p>

        <table class="w-full text-sm text-left text-gray-700 mb-4">
            <thead class="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                    <th class="px-3 py-2">Date</th>
                    <th class="px-3 py-2">Transaction Type</th>
                    <th class="px-3 py-2">Units</th>
                    <th class="px-3 py-2">Unit Cost</th>
                    <th class="px-3 py-2">Total Cost</th>
                </tr>
            </thead>
            <tbody>
                <tr class="bg-white border-b">
                    <td class="px-3 py-2">Oct 1</td>
                    <td class="px-3 py-2 font-semibold">Beginning Inventory</td>
                    <td class="px-3 py-2">100</td>
                    <td class="px-3 py-2">₱500</td>
                    <td class="px-3 py-2">₱50,000</td>
                </tr>
                <tr class="bg-blue-50 border-b">
                    <td class="px-3 py-2">Oct 5</td>
                    <td class="px-3 py-2 text-blue-700">Purchase #1</td>
                    <td class="px-3 py-2">200</td>
                    <td class="px-3 py-2">₱550</td>
                    <td class="px-3 py-2">₱110,000</td>
                </tr>
                <tr class="bg-red-50 border-b">
                    <td class="px-3 py-2">Oct 8</td>
                    <td class="px-3 py-2 text-red-700">Sale #1</td>
                    <td class="px-3 py-2">(150)</td>
                    <td class="px-3 py-2 text-gray-400 italic">--</td>
                    <td class="px-3 py-2 text-gray-400 italic">--</td>
                </tr>
                <tr class="bg-blue-50 border-b">
                    <td class="px-3 py-2">Oct 12</td>
                    <td class="px-3 py-2 text-blue-700">Purchase #2</td>
                    <td class="px-3 py-2">300</td>
                    <td class="px-3 py-2">₱600</td>
                    <td class="px-3 py-2">₱180,000</td>
                </tr>
                <tr class="bg-red-50 border-b">
                    <td class="px-3 py-2">Oct 20</td>
                    <td class="px-3 py-2 text-red-700">Sale #2</td>
                    <td class="px-3 py-2">(250)</td>
                    <td class="px-3 py-2 text-gray-400 italic">--</td>
                    <td class="px-3 py-2 text-gray-400 italic">--</td>
                </tr>
                 <tr class="bg-blue-50 border-b">
                    <td class="px-3 py-2">Oct 25</td>
                    <td class="px-3 py-2 text-blue-700">Purchase #3</td>
                    <td class="px-3 py-2">100</td>
                    <td class="px-3 py-2">₱620</td>
                    <td class="px-3 py-2">₱62,000</td>
                </tr>
                 <tr class="bg-red-50 border-b">
                    <td class="px-3 py-2">Oct 29</td>
                    <td class="px-3 py-2 text-red-700">Sale #3</td>
                    <td class="px-3 py-2">(100)</td>
                    <td class="px-3 py-2 text-gray-400 italic">--</td>
                    <td class="px-3 py-2 text-gray-400 italic">--</td>
                </tr>
            </tbody>
        </table>
        
        <div class="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
             <span class="text-sm font-bold text-gray-800">Ending Inventory Count:</span>
             <span class="text-sm font-mono bg-gray-100 px-2 py-1 rounded">200 Units</span>
        </div>
        <p class="text-xs text-gray-500 mt-2">
           (Math: 100 + 200 - 150 + 300 - 250 + 100 - 100 = 200 units remaining)
        </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div class="bg-blue-50 p-4 rounded-lg border-t-4 border-blue-500">
            <h5 class="font-bold text-blue-900 mb-2 flex items-center">
                <span class="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded mr-2">Method A</span> FIFO
            </h5>
            <p class="text-xs text-blue-800 mb-4 italic">"First Costs In are the First Costs Out."</p>
            
            <div class="space-y-4 text-sm text-blue-900">
                <div>
                    <strong class="block mb-1 text-blue-700 border-b border-blue-200">Cost of Goods Sold (COGS) Breakdown:</strong>
                    <ul class="list-disc pl-4 space-y-1 mt-1 text-xs">
                        <li><strong>Sale Oct 8 (150 units):</strong>
                            <br>100 @ ₱500 (Oldest) + 50 @ ₱550 
                            <br>= ₱50,000 + ₱27,500 = <strong>₱77,500</strong>
                        </li>
                         <li><strong>Sale Oct 20 (250 units):</strong>
                            <br>150 @ ₱550 (Leftover Oct 5) + 100 @ ₱600 (Oct 12)
                            <br>= ₱82,500 + ₱60,000 = <strong>₱142,500</strong>
                        </li>
                        <li><strong>Sale Oct 29 (100 units):</strong>
                            <br>100 @ ₱600 (From Oct 12)
                            <br>= <strong>₱60,000</strong>
                        </li>
                    </ul>
                    <div class="mt-2 font-bold text-right border-t border-blue-300 pt-1">Total COGS: ₱280,000</div>
                </div>

                <div>
                    <strong class="block mb-1 text-blue-700 border-b border-blue-200">Ending Inventory (200 Units):</strong>
                    <p class="text-xs mt-1">
                        We have 200 units left. Under FIFO, these are the <strong>most recent</strong> purchases.
                    </p>
                    <ul class="list-none pl-0 mt-1 text-xs font-mono bg-white p-2 rounded border border-blue-100">
                        <li>100 units @ ₱600 (From Oct 12) = ₱60,000</li>
                        <li>100 units @ ₱620 (From Oct 25) = ₱62,000</li>
                        <li class="border-t border-blue-200 mt-1 pt-1 font-bold">Total: ₱122,000</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="bg-green-50 p-4 rounded-lg border-t-4 border-green-500">
            <h5 class="font-bold text-green-900 mb-2 flex items-center">
                <span class="bg-green-200 text-green-800 text-xs px-2 py-1 rounded mr-2">Method B</span> Moving Average
            </h5>
            <p class="text-xs text-green-800 mb-4 italic">"Recalculate average cost after EVERY purchase."</p>
            
            <div class="space-y-4 text-sm text-green-900">
                <div>
                    <strong class="block mb-1 text-green-700 border-b border-green-200">Unit Cost Calculations:</strong>
                    <ul class="list-decimal pl-4 space-y-2 mt-1 text-xs">
                        <li>
                            <strong>Oct 5 (After Purchase #1):</strong>
                            <br>(100 @ 500 + 200 @ 550) / 300 units = <strong>₱533.33</strong>
                        </li>
                        <li>
                            <strong>Oct 12 (After Purchase #2):</strong>
                            <br><em>(Rem. 150 @ 533.33 + 300 @ 600) / 450 units</em>
                            <br>= (80,000 + 180,000) / 450 = <strong>₱577.78</strong>
                        </li>
                        <li>
                            <strong>Oct 25 (After Purchase #3):</strong>
                            <br><em>(Rem. 200 @ 577.78 + 100 @ 620) / 300 units</em>
                            <br>= (115,556 + 62,000) / 300 = <strong>₱591.85</strong>
                        </li>
                    </ul>
                </div>

                <div>
                     <strong class="block mb-1 text-green-700 border-b border-green-200">Final Results:</strong>
                     
                     <div class="flex justify-between items-center text-xs mt-2">
                        <span>Total COGS:</span>
                        <span class="font-mono font-bold">₱279,667</span>
                     </div>
                     <p class="text-[10px] text-green-700 italic mb-2">(Sum of: 150@533.33 + 250@577.78 + 100@591.85)</p>

                     <div class="flex justify-between items-center text-xs border-t border-green-300 pt-2">
                        <span>Ending Inventory (200 units):</span>
                        <span class="font-mono font-bold">₱118,370</span>
                     </div>
                     <p class="text-[10px] text-green-700 italic">(200 units @ Final Avg ₱591.85)</p>
                </div>
            </div>
        </div>
    </div>
</li>

</ul>`,
            exercises: [
    // --- MULTIPLE CHOICE QUESTIONS (25) ---

    { 
        type: "mcq", 
        question: "In a perpetual inventory system, which account is debited when merchandise is purchased for resale?", 
        options: ["Purchases", "Inventory", "Cost of Goods Sold", "Supplies"], 
        correctIndex: 1, 
        explanation: "Under the perpetual system, purchases are recorded directly into the Inventory asset account, not a Purchases account." 
    },
    { 
        type: "mcq", 
        question: "Which of the following creates two journal entries at the time of transaction?", 
        options: ["Purchase of inventory on credit", "Payment of freight costs", "Sale of merchandise", "Return of damaged goods to supplier"], 
        correctIndex: 2, 
        explanation: "A sale requires two entries: one to record the revenue (Sales) and one to update the inventory and record the expense (COGS)." 
    },
    { 
        type: "mcq", 
        question: "Under the perpetual system, the 'Cost of Goods Sold' account is classified as a(n):", 
        options: ["Asset", "Liability", "Revenue", "Expense"], 
        correctIndex: 3, 
        explanation: "Cost of Goods Sold is an expense account that appears on the Income Statement." 
    },
    { 
        type: "mcq", 
        question: "If a company returns defective goods to a supplier, which account is Credited?", 
        options: ["Purchase Returns and Allowances", "Accounts Payable", "Inventory", "Cost of Goods Sold"], 
        correctIndex: 2, 
        explanation: "Since the inventory balance is tracked continuously, a return reduces the asset directly; therefore, Inventory is credited." 
    },
    { 
        type: "mcq", 
        question: "What does the credit term '2/10, n/30' mean?", 
        options: ["2% interest if paid in 30 days", "2% discount if paid within 10 days, net due in 30", "10% discount if paid within 2 days", "Net due in 10 days, 2% penalty after 30"], 
        correctIndex: 1, 
        explanation: "It stands for a 2% discount is available if paid within 10 days; otherwise, the net (full) amount is due in 30 days." 
    },
    { 
        type: "mcq", 
        question: "When the buyer pays the shipping charges (FOB Shipping Point), the cost is debited to:", 
        options: ["Delivery Expense", "Freight Out", "Inventory", "Sales Expense"], 
        correctIndex: 2, 
        explanation: "Costs to get the inventory ready for sale (like incoming freight) are capitalized as part of the Inventory asset." 
    },
    { 
        type: "mcq", 
        question: "The difference between the physical count of inventory and the accounting records is known as:", 
        options: ["Gross Profit", "Inventory Turnover", "Shrinkage", "Safety Stock"], 
        correctIndex: 2, 
        explanation: "Shrinkage represents the loss of inventory due to theft, damage, or error." 
    },
    { 
        type: "mcq", 
        question: "Which account is debited to record inventory shrinkage?", 
        options: ["Inventory", "Loss on Theft", "Cost of Goods Sold", "Sales Returns"], 
        correctIndex: 2, 
        explanation: "Shrinkage is typically recorded as an increase to Cost of Goods Sold and a decrease to Inventory." 
    },
    { 
        type: "mcq", 
        question: "FOB Destination means ownership transfers when:", 
        options: ["The goods leave the seller's warehouse", "The goods arrive at the buyer's place of business", "The invoice is paid", "The purchase order is signed"], 
        correctIndex: 1, 
        explanation: "FOB Destination means the seller retains ownership (and risk) until the goods reach the buyer." 
    },
    { 
        type: "mcq", 
        question: "Gross Profit is calculated as:", 
        options: ["Net Income - Operating Expenses", "Sales - Operating Expenses", "Sales - Cost of Goods Sold", "Inventory - Accounts Payable"], 
        correctIndex: 2, 
        explanation: "Gross Profit is the direct profit from the goods themselves, calculated as Net Sales minus Cost of Goods Sold." 
    },
    { 
        type: "mcq", 
        question: "Which document authorizes the warehouse to release goods for shipment to a customer?", 
        options: ["Purchase Order", "Receiving Report", "Debit Memo", "Shipping Order / Delivery Receipt"], 
        correctIndex: 3, 
        explanation: "A shipping order or delivery receipt serves as proof that goods have been released and shipped." 
    },
    { 
        type: "mcq", 
        question: "In a perpetual system, the 'Inventory' account generally has a:", 
        options: ["Debit balance", "Credit balance", "Zero balance", "Negative balance"], 
        correctIndex: 0, 
        explanation: "Inventory is an Asset, and assets normally have a Debit balance." 
    },
    { 
        type: "mcq", 
        question: "When a customer returns goods for credit, the seller Debits which account (assuming the goods are returned to inventory)?", 
        options: ["Sales", "Accounts Receivable", "Sales Returns and Allowances", "Cost of Goods Sold"], 
        correctIndex: 2, 
        explanation: "The seller debits Sales Returns and Allowances (a contra-revenue) to reduce net sales." 
    },
    { 
        type: "mcq", 
        question: "Continuing from the previous question, what is the SECOND entry the seller makes for a return?", 
        options: ["Debit Inventory, Credit COGS", "Debit COGS, Credit Inventory", "Debit Cash, Credit Sales", "No second entry needed"], 
        correctIndex: 0, 
        explanation: "The seller must put the item back into the books: Debit Inventory (asset increases) and Credit COGS (expense decreases)." 
    },
    { 
        type: "mcq", 
        question: "Freight Out (shipping to customers) is classified as:", 
        options: ["Part of Cost of Goods Sold", "A Selling/Operating Expense", "An addition to Inventory", "A deduction from Sales"], 
        correctIndex: 1, 
        explanation: "Freight Out is a delivery expense incurred to sell the product, making it an Operating Expense." 
    },
    { 
        type: "mcq", 
        question: "Purchasing inventory on account results in:", 
        options: ["Increase in Assets, Increase in Equity", "Increase in Assets, Increase in Liabilities", "Decrease in Assets, Decrease in Liabilities", "No change in total assets"], 
        correctIndex: 1, 
        explanation: "Inventory (Asset) increases and Accounts Payable (Liability) increases." 
    },
    { 
        type: "mcq", 
        question: "Which of the following accounts is NOT closed at the end of the year?", 
        options: ["Sales Revenue", "Cost of Goods Sold", "Inventory", "Sales Returns"], 
        correctIndex: 2, 
        explanation: "Inventory is a permanent (Balance Sheet) account and is not closed. The others are temporary accounts." 
    },
    { 
        type: "mcq", 
        question: "What is the effect of a Purchase Discount on the inventory cost?", 
        options: ["It increases the cost", "It decreases the cost", "It has no effect", "It is recorded as revenue"], 
        correctIndex: 1, 
        explanation: "A discount reduces the actual cash paid for the item, so it reduces the recorded cost of the Inventory asset." 
    },
    { 
        type: "mcq", 
        question: "If a company has Net Sales of ₱100,000 and a Gross Profit rate of 40%, what is the Cost of Goods Sold?", 
        options: ["₱40,000", "₱60,000", "₱100,000", "₱140,000"], 
        correctIndex: 1, 
        explanation: "If Gross Profit is 40%, COGS must be 60%. ₱100,000 x 60% = ₱60,000." 
    },
    { 
        type: "mcq", 
        question: "Which inventory system requires a physical count to determine Cost of Goods Sold?", 
        options: ["Perpetual", "Periodic", "Just-In-Time", "Automated"], 
        correctIndex: 1, 
        explanation: "The Periodic system relies on a physical count at the end of the period to 'plug' the COGS figure." 
    },
    { 
        type: "mcq", 
        question: "A Debit Memorandum issued by a buyer to a seller indicates:", 
        options: ["The buyer is returning goods or asking for an allowance", "The buyer is paying the invoice", "The seller is charging more", "Shipping is delayed"], 
        correctIndex: 0, 
        explanation: "It effectively 'Debits' (reduces) the Accounts Payable the buyer owes to the seller." 
    },
    { 
        type: "mcq", 
        question: "Merchandise Inventory appears on which financial statement?", 
        options: ["Income Statement", "Statement of Cash Flows", "Balance Sheet", "Retained Earnings Statement"], 
        correctIndex: 2, 
        explanation: "Inventory is a Current Asset on the Balance Sheet." 
    },
    { 
        type: "mcq", 
        question: "If Inventory at the beginning of the year is ₱20,000, Purchases are ₱50,000, and Ending Inventory is ₱10,000, what is COGS? (Formula logic applies to both systems)", 
        options: ["₱40,000", "₱60,000", "₱70,000", "₱80,000"], 
        correctIndex: 1, 
        explanation: "GAS (Goods Available for Sale) = 20k + 50k = 70k. COGS = GAS - Ending Inv (10k) = ₱60,000." 
    },
    { 
        type: "mcq", 
        question: "The operating cycle of a merchandising company is typically:", 
        options: ["Shorter than a service company", "Longer than a service company", "The same as a service company", "Non-existent"], 
        correctIndex: 1, 
        explanation: "It is longer because cash must first be converted to inventory, then sold, then collected." 
    },
    { 
        type: "mcq", 
        question: "Which of the following is considered a 'Contra-Revenue' account?", 
        options: ["Sales", "Inventory", "Sales Returns and Allowances", "Cost of Goods Sold"], 
        correctIndex: 2, 
        explanation: "It has a debit balance and offsets Sales Revenue on the Income Statement." 
    },
                // Q1: FIFO (Simple - 1 Sale)
    { 
        type: "mcq", 
        question: "Using the FIFO Perpetual method, calculate the Cost of Goods Sold (COGS) for the sale on Jan 15.\n\nTransactions:\nJan 1: Beginning Inv (100 units @ ₱10)\nJan 5: Purchase (200 units @ ₱12)\nJan 10: Purchase (100 units @ ₱15)\nJan 15: Sale of 320 units", 
        options: ["₱3,700", "₱3,900", "₱3,840", "₱4,000"], 
        correctIndex: 0, 
        explanation: "FIFO takes the oldest costs first.\n1. 100 units @ ₱10 = ₱1,000 (All Beg Inv)\n2. 200 units @ ₱12 = ₱2,400 (All Jan 5)\n3. 20 units @ ₱15 = ₱300 (From Jan 10)\nTotal: ₱1,000 + ₱2,400 + ₱300 = ₱3,700." 
    },

    // Q2: FIFO (Complex - 3 Purchases, 3 Sales)
    { 
        type: "mcq", 
        question: "Calculate the value of ENDING INVENTORY using FIFO Perpetual.\n\nJan 1: Beg Inv (50 units @ ₱20)\nJan 2: Sale (40 units)\nJan 5: Purchase (50 units @ ₱22)\nJan 8: Sale (20 units)\nJan 10: Purchase (50 units @ ₱24)\nJan 12: Sale (30 units)\nJan 15: Purchase (50 units @ ₱26)", 
        options: ["₱2,660", "₱2,780", "₱2,400", "₱3,000"], 
        correctIndex: 1, 
        explanation: "Track the layers:\n1. After Jan 2 Sale: 10 units @ ₱20 remain.\n2. After Jan 8 Sale (20 total): 10 @ ₱20 sold + 10 @ ₱22 sold. Remaining: 40 units @ ₱22.\n3. After Jan 12 Sale (30 total): 30 @ ₱22 sold. Remaining: 10 units @ ₱22.\n\nEnding Inventory Layers:\n- 10 units @ ₱22 (Oldest remaining)\n- 50 units @ ₱24 (From Jan 10)\n- 50 units @ ₱26 (From Jan 15)\nTotal: ₱220 + ₱1,200 + ₱1,300 = ₱2,780." 
    },

    // Q3: Moving Average (Simple - 1 Sale)
    { 
        type: "mcq", 
        question: "Using the Moving Average method, what is the Cost of Goods Sold for the sale on Jan 15?\n\nJan 1: Beg Inv (100 units @ ₱10)\nJan 5: Purchase (100 units @ ₱14)\nJan 10: Purchase (200 units @ ₱16)\nJan 15: Sale (300 units)", 
        options: ["₱4,200", "₱4,350", "₱4,500", "₱3,900"], 
        correctIndex: 0, 
        explanation: "1. Average after Jan 5: (100@10 + 100@14) = ₱2,400 / 200 units = ₱12/unit.\n2. Average after Jan 10: (200@12 + 200@16) = ₱5,600 / 400 units = ₱14/unit.\n3. COGS: 300 units x ₱14 = ₱4,200." 
    },

    // Q4: Moving Average (Complex - 3 Purchases, 3 Sales)
    { 
        type: "mcq", 
        question: "What is the Moving Average UNIT COST used for the final sale on Jan 14?\n\nJan 1: Beg Inv (100 @ ₱10)\nJan 2: Purchase (100 @ ₱12)\nJan 3: Sale (100 units)\nJan 5: Purchase (100 @ ₱15)\nJan 8: Sale (100 units)\nJan 10: Purchase (100 @ ₱16)\nJan 14: Sale (100 units)", 
        options: ["₱13.00", "₱14.50", "₱16.00", "₱15.00"], 
        correctIndex: 1, 
        explanation: "1. Avg after Jan 2: (100@10 + 100@12)/200 = ₱11. \n2. After Jan 3 Sale: 100 rem @ ₱11.\n3. Avg after Jan 5: (100@11 + 100@15)/200 = 2600/200 = ₱13.\n4. After Jan 8 Sale: 100 rem @ ₱13.\n5. Avg after Jan 10: (100@13 + 100@16)/200 = 2900/200 = ₱14.50." 
    },

    // Q5: Comparison (FIFO vs Moving Average)
    { 
        type: "mcq", 
        question: "Compare the Total Cost of Goods Sold (COGS) between Moving Average and FIFO. What is the difference?\n\nJan 1: Beg Inv (10 units @ ₱100)\nJan 2: Purchase (10 units @ ₱110)\nJan 3: Purchase (10 units @ ₱120)\nJan 4: Sale (15 units)\nJan 5: Purchase (10 units @ ₱130)\nJan 6: Sale (15 units)", 
        options: ["Moving Avg is higher by ₱120", "FIFO is higher by ₱120", "Moving Avg is higher by ₱50", "They are equal"], 
        correctIndex: 0, 
        explanation: "FIFO COGS:\nSale 1 (15): 10@100 + 5@110 = 1,550\nSale 2 (15): 5@110 + 10@120 = 1,750\nTotal FIFO = 3,300.\n\nMoving Avg COGS:\nAvg after Jan 3: (1000+1100+1200)/30 = ₱110.\nSale 1: 15 @ 110 = 1,650. (Rem 15 @ 110).\nAvg after Jan 5: (1650 + 1300)/25 = ₱118.\nSale 2: 15 @ 118 = 1,770.\nTotal Avg = 3,420.\n\nDifference: 3,420 - 3,300 = ₱120 (Moving Avg is higher)." 
    },
    

    // --- OPEN ENDED PROBLEMS (10) ---

    {
        type: "problem",
        question: "Company A purchases 500 units of widgets for ₱10 each on credit. Calculate the total liability recorded and write the journal entry description.",
        answer: `Total Liability: 500 units x ₱10 = ₱5,000.
Journal Entry:
Debit: Inventory ₱5,000
Credit: Accounts Payable ₱5,000`,
        explanation: "The asset (Inventory) and the liability (Accounts Payable) both increase by the total cost of the goods."
    },
    {
        type: "problem",
        question: "A seller sells goods for ₱2,000 cash. The goods originally cost the seller ₱1,200. Provide the two necessary journal entries.",
        answer: `Entry 1 (Revenue):
Debit: Cash ₱2,000
Credit: Sales Revenue ₱2,000

Entry 2 (Cost):
Debit: Cost of Goods Sold ₱1,200
Credit: Inventory ₱1,200`,
        explanation: "The perpetual system requires recognizing revenue and updating inventory/expense immediately upon sale."
    },
    {
        type: "problem",
        question: "Explain the difference between FOB Shipping Point and FOB Destination regarding who pays for shipping.",
        answer: `FOB Shipping Point: The BUYER pays the shipping costs. Ownership transfers when goods leave the seller.
FOB Destination: The SELLER pays the shipping costs. Ownership transfers when goods arrive at the buyer.`,
        explanation: "FOB determines who owns the goods in transit and who bears the cost of transport."
    },
    {
        type: "problem",
        question: "Company B purchased goods for ₱10,000 with terms 3/15, n/45. They returned ₱1,000 worth of defective goods before paying. If they pay the remaining balance within the discount period, how much is the cash payment? Show computation.",
        answer: `Initial Purchase: ₱10,000
Less Return: (₱1,000)
Net Balance Due: ₱9,000
Less Discount (3% of ₱9,000): (₱270)
-------------------------
Cash Paid: ₱8,730`,
        explanation: "The discount is calculated on the Net Balance (after returns), not the original invoice amount."
    },
    {
        type: "problem",
        question: "At year-end, the accounting records show an Inventory balance of ₱105,000. A physical count reveals only ₱102,000 is actually on hand. Prepare the adjusting entry.",
        answer: `Debit: Cost of Goods Sold ₱3,000
Credit: Inventory ₱3,000

(Calculation: ₱105,000 - ₱102,000 = ₱3,000 shortage)`,
        explanation: "This entry records inventory shrinkage, bringing the book balance down to match the physical reality."
    },
    {
        type: "problem",
        question: "Why is 'Freight Out' considered an Operating Expense rather than part of Cost of Goods Sold?",
        answer: `Freight Out is the cost of delivering goods to a customer. It is a selling service provided to the customer, not a cost of acquiring the inventory itself. Therefore, it is an operating expense (specifically a selling expense).`,
        explanation: "Only costs incurred to bring the inventory to the business and get it ready for sale are capitalized as Inventory/COGS."
    },
    {
        type: "problem",
        question: "Calculate the Net Sales: Sales Revenue ₱500,000; Sales Returns ₱20,000; Sales Discounts ₱5,000; Cost of Goods Sold ₱300,000.",
        answer: `Sales Revenue: ₱500,000
Less: Sales Returns (₱20,000)
Less: Sales Discounts (₱5,000)
-----------------------------
Net Sales: ₱475,000`,
        explanation: "Net Sales = Gross Sales minus all contra-revenue accounts (Returns, Allowances, and Discounts). COGS is not part of the Net Sales calculation."
    },
    {
        type: "problem",
        question: "A company uses the Perpetual system. They pay ₱200 cash for freight costs on an incoming shipment (FOB Shipping Point). What is the journal entry?",
        answer: `Debit: Inventory ₱200
Credit: Cash ₱200`,
        explanation: "In a perpetual system, freight-in is added directly to the cost of the Inventory asset."
    },
    {
        type: "problem",
        question: "Why is the Perpetual Inventory System considered to provide better internal control than the Periodic System?",
        answer: `It provides a continuous record of what 'should' be on hand. This allows management to compare the book balance to the physical count to detect theft or errors (shrinkage). The Periodic system has no continuous record to compare against, so theft is buried inside the COGS calculation.`,
        explanation: "The visibility of shrinkage is the key control advantage."
    },
    {
        type: "problem",
        question: "Calculate the Gross Profit Rate: Net Sales ₱200,000; Cost of Goods Sold ₱120,000.",
        answer: `Gross Profit = ₱200,000 - ₱120,000 = ₱80,000.
Gross Profit Rate = (Gross Profit / Net Sales) x 100
Rate = (₱80,000 / ₱200,000) = 40%`,
        explanation: "The rate represents the percentage of each sales dollar that exceeds the cost of the goods sold."
    },
                // --- FIFO: SIMPLE (Beg Inv + 2 Purchases + 1 Sale) ---

    {
        type: "problem",
        question: "Using FIFO Perpetual, calculate the Cost of Goods Sold (COGS) for the sale on Jan 10.\n\nJan 1: Beg Inv (100 units @ ₱50)\nJan 5: Purchase (200 units @ ₱55)\nJan 8: Purchase (50 units @ ₱60)\nJan 10: Sale of 250 units",
        answer: `Sold 250 units total.
Layer 1 (Oldest): 100 units @ ₱50 = ₱5,000
Layer 2 (Next):   150 units @ ₱55 = ₱8,250
-----------------------------------------
Total COGS:       ₱13,250`,
        explanation: "Under FIFO, we sell the oldest units first. We cleared the entire Beginning Inventory (100) and took the remaining 150 needed from the Jan 5 purchase."
    },
    {
        type: "problem",
        question: "Using FIFO Perpetual, determine the value of Ending Inventory after the following transactions.\n\nFeb 1: Beg Inv (20 units @ ₱100)\nFeb 10: Purchase (30 units @ ₱120)\nFeb 15: Purchase (10 units @ ₱130)\nFeb 20: Sale of 40 units",
        answer: `Total Units Available: 60. Units Sold: 40. Units Remaining: 20.
Under FIFO, the remaining units are the NEWEST ones.

From Feb 15 Purchase: 10 units @ ₱130 = ₱1,300
From Feb 10 Purchase: 10 units @ ₱120 = ₱1,200
-----------------------------------------
Ending Inventory:     ₱2,500`,
        explanation: "We sold the oldest 40 (all 20 from Beg Inv + 20 from Feb 10). What remains are the 10 from Feb 15 and the remaining 10 from Feb 10."
    },

    // --- FIFO: COMPLEX (Beg Inv + 3 Purchases + 3 Sales) ---

    {
        type: "problem",
        question: "Track the inventory layers using FIFO to find the Cost of Goods Sold for the FINAL sale on March 25 only.\n\nMar 1: Beg Inv (100 @ ₱10)\nMar 5: Sold 50 units\nMar 8: Purchase (100 @ ₱12)\nMar 10: Sold 80 units\nMar 15: Purchase (100 @ ₱14)\nMar 20: Purchase (50 @ ₱15)\nMar 25: Sold 100 units",
        answer: `Previous balances before Mar 25 sale:
- Remaining from Mar 8: 20 units @ ₱12 (Since 80 were sold on Mar 10, using up the rest of Beg Inv and 30 of Mar 8).
- Full Mar 15 Batch: 100 units @ ₱14.
- Full Mar 20 Batch: 50 units @ ₱15.

Mar 25 Sale (100 units):
1. Take all remaining Mar 8: 20 units @ ₱12 = ₱240
2. Take from Mar 15:         80 units @ ₱14 = ₱1,120
--------------------------------------------------
COGS for Mar 25 Sale:        ₱1,360`,
        explanation: "You must track the 'balance' column carefully. Before the final sale, the oldest layer available was the remainder of the March 8 purchase."
    },
    {
        type: "problem",
        question: "Calculate the total Gross Profit for the month using FIFO.\n\nApr 1: Beg Inv (10 @ ₱200)\nApr 5: Purchase (10 @ ₱220)\nApr 8: Sale (15 units @ ₱400 selling price)\nApr 12: Purchase (10 @ ₱240)\nApr 15: Sale (10 units @ ₱450 selling price)\nApr 20: Purchase (10 @ ₱250)\nApr 25: Sale (5 units @ ₱500 selling price)",
        answer: `Total Revenue:
(15 * 400) + (10 * 450) + (5 * 500) = ₱13,000

Total COGS (FIFO):
Sale 1 (15): (10@200) + (5@220) = 3,100
Sale 2 (10): (5@220 rem) + (5@240) = 2,300
Sale 3 (5):  (5@240 rem) = 1,200
Total COGS = ₱6,600

Gross Profit: ₱13,000 - ₱6,600 = ₱6,400`,
        explanation: "Gross Profit is Total Revenue minus Total COGS. FIFO requires peeling off the cost layers in chronological order for each specific sale."
    },

    // --- MOVING AVERAGE: SIMPLE (Beg Inv + 2 Purchases + 1 Sale) ---

    {
        type: "problem",
        question: "Using the Moving Average method, calculate the new unit cost after the Jan 15 purchase. (Round to 2 decimals).\n\nJan 1: Beg Inv (100 units @ ₱20)\nJan 10: Purchase (100 units @ ₱24)\nJan 15: Purchase (200 units @ ₱28)\nJan 20: Sale (300 units)",
        answer: `1. After Jan 10 Purchase:
(100@20 + 100@24) = 4,400 / 200 units = ₱22.00/unit

2. After Jan 15 Purchase:
Old Balance: 200 units @ ₱22.00 = ₱4,400
New Purchase: 200 units @ ₱28.00 = ₱5,600
Total: 400 units costing ₱10,000

New Average Cost: ₱10,000 / 400 units = ₱25.00`,
        explanation: "In a perpetual moving average, you must re-calculate the average cost immediately after every purchase, before you calculate any sales."
    },
    {
        type: "problem",
        question: "Using Moving Average, calculate the Cost of Goods Sold for the sale on May 20.\n\nMay 1: Beg Inv (500 units @ ₱10)\nMay 5: Purchase (500 units @ ₱14)\nMay 10: Purchase (1,000 units @ ₱16)\nMay 20: Sale (1,500 units)",
        answer: `1. Avg after May 5:
(500@10 + 500@14) / 1000 = 12,000 / 1000 = ₱12.00

2. Avg after May 10:
(1000@12 + 1000@16) / 2000 = 28,000 / 2000 = ₱14.00

3. COGS for Sale:
1,500 units x ₱14.00 = ₱21,000`,
        explanation: "The final average cost calculated before the sale (₱14.00) is applied to all units sold in that transaction."
    },

    // --- MOVING AVERAGE: COMPLEX (Beg Inv + 3 Purchases + 3 Sales) ---

    {
        type: "problem",
        question: "Calculate the value of Ending Inventory using Moving Average. (Round intermediate unit costs to 2 decimals).\n\nJun 1: Beg Inv (100 @ ₱50)\nJun 5: Sold 50 units\nJun 10: Purchase (100 @ ₱60)\nJun 15: Sold 100 units\nJun 20: Purchase (200 @ ₱70)\nJun 25: Sold 50 units\nJun 30: Purchase (100 @ ₱80)",
        answer: `1. Jun 1 Avg: ₱50.
2. Jun 5 Sale: Rem 50 units @ ₱50.
3. Jun 10 Purchase: (50@50 + 100@60) / 150 = 8,500/150 = ₱56.67
4. Jun 15 Sale: Rem 50 units @ ₱56.67. (Value ₱2,833.50)
5. Jun 20 Purchase: (2,833.50 + 200@70) / 250 = 16,833.50/250 = ₱67.33
6. Jun 25 Sale: Rem 200 units @ ₱67.33. (Value ₱13,466)
7. Jun 30 Purchase: (13,466 + 100@80) / 300 = 21,466/300 = ₱71.55

Ending Inventory: 300 units @ ₱71.55 = ₱21,465 (approx)`,
        explanation: "The moving average requires updating the cost per unit after every purchase. This new cost is carried forward to the next transaction."
    },
    {
        type: "problem",
        question: "Calculate the total Cost of Goods Sold for the period using Moving Average.\n\nJul 1: Beg Inv (10 @ ₱10)\nJul 2: Purch (10 @ ₱12)\nJul 3: Sale (10 units)\nJul 4: Purch (10 @ ₱14)\nJul 5: Sale (10 units)\nJul 6: Purch (10 @ ₱16)\nJul 7: Sale (10 units)",
        answer: `1. Avg after Jul 2: (10@10 + 10@12)/20 = ₱11.
COGS Sale 1: 10 x 11 = ₱110. (Rem 10 @ 11).

2. Avg after Jul 4: (10@11 + 10@14)/20 = 250/20 = ₱12.50.
COGS Sale 2: 10 x 12.50 = ₱125. (Rem 10 @ 12.50).

3. Avg after Jul 6: (10@12.50 + 10@16)/20 = 285/20 = ₱14.25.
COGS Sale 3: 10 x 14.25 = ₱142.50.

Total COGS: 110 + 125 + 142.50 = ₱377.50`,
        explanation: "We sum the COGS calculated at each individual sale point based on the weighted average cost active at that specific date."
    },

    // --- COMPARISON: FIFO vs MOVING AVG (Beg Inv + 3 Purchases + 3 Sales) ---

    {
        type: "problem",
        question: "Compare the Ending Inventory value between FIFO and Moving Average. Which is higher and by how much?\n\nAug 1: Beg Inv (100 @ ₱10)\nAug 2: Purch (100 @ ₱20)\nAug 3: Sale (100 units)\nAug 4: Purch (100 @ ₱30)\nAug 5: Sale (100 units)\nAug 6: Purch (100 @ ₱40)\nAug 7: Sale (100 units)",
        answer: `Ending Units: 100.

FIFO (Ending is newest):
100 units @ ₱40 = ₱4,000.

Moving Average:
1. Avg (100@10+100@20)/200 = ₱15. After Sale 1, Rem 100@15.
2. Avg (100@15+100@30)/200 = ₱22.50. After Sale 2, Rem 100@22.50.
3. Avg (100@22.50+100@40)/200 = ₱31.25. After Sale 3, Rem 100@31.25.
MA Ending Inv = ₱3,125.

Difference: ₱4,000 (FIFO) - ₱3,125 (MA) = ₱875.
FIFO is higher by ₱875.`,
        explanation: "In a period of rising prices (inflation), FIFO generally produces a higher ending inventory value because the cheaper, older goods are sold off, leaving expensive goods on the books."
    },
    {
        type: "problem",
        question: "Compare the Total COGS between FIFO and Moving Average. Which method reports higher Net Income?\n\nSept 1: Beg Inv (50 @ ₱100)\nSept 2: Purch (50 @ ₱110)\nSept 3: Sale (50 units)\nSept 4: Purch (50 @ ₱120)\nSept 5: Sale (50 units)\nSept 6: Purch (50 @ ₱130)\nSept 7: Sale (50 units)",
        answer: `FIFO COGS:
1. Sale 1: 50 @ 100 = 5,000
2. Sale 2: 50 @ 110 = 5,500
3. Sale 3: 50 @ 120 = 6,000
Total FIFO COGS = ₱16,500

Moving Avg COGS:
1. Avg (100+110)/2 = 105. COGS = 5,250.
2. Avg (105+120)/2 = 112.5. COGS = 5,625.
3. Avg (112.5+130)/2 = 121.25. COGS = 6,062.5.
Total MA COGS = ₱16,937.5

Conclusion: FIFO has lower COGS (16,500 vs 16,937.5). Therefore, FIFO reports higher Net Income.`,
        explanation: "Since FIFO charges the older (cheaper) costs to expense, the total expense is lower, resulting in higher profit (Net Income) compared to Moving Average."
    }
]
        },
        {
            day: "Day 4",
            topic: "Comparison & Applications",
            content: `<div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
    <p class="font-bold text-blue-900">Learning Goal</p>
    <p class="text-blue-800">Distinguish between Periodic and Perpetual inventory systems and understand how costs are recognized under each method.</p>
</div>

<h3 class="text-xl font-bold mb-4 mt-6">Topic Focus</h3>
<ul class="list-none space-y-8 mb-6">

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">1. The Core Difference: "When do we update?"</h3>
        <div class="text-gray-700 mb-4">
            <p class="mb-3">
                The fundamental difference between these two systems isn't <em>what</em> they sell, but <strong>when</strong> they update their accounting records.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="bg-green-50 p-4 rounded border border-green-200">
                    <h4 class="font-bold text-green-800">Perpetual (Continuous)</h4>
                    <p class="text-sm mt-1">Updates records <strong>continuously</strong> after every transaction. Think of a supermarket scanner: as soon as the barcode is beeped, the system knows one unit is gone.</p>
                </div>
                <div class="bg-orange-50 p-4 rounded border border-orange-200">
                    <h4 class="font-bold text-orange-800">Periodic (Batch)</h4>
                    <p class="text-sm mt-1">Updates records <strong>occasionally</strong> (periodically). The business doesn't track unit-by-unit sales in real-time. They only know what they sold by counting what is left at the end of the month.</p>
                </div>
            </div>
        </div>
    </li>

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">2. The Perpetual System: Real-Time Accuracy</h3>
        <div class="text-gray-700 mb-4">
            <p class="mb-3">
                Under the Perpetual system, the <strong>Inventory</strong> account is "live." It increases immediately when goods are purchased and decreases immediately when goods are sold.
            </p>
            <ul class="list-disc pl-5 mb-4 space-y-2">
                <li><strong>Detailed Control:</strong> The company knows exactly how much inventory is on hand at any specific moment.</li>
                <li><strong>Cost of Goods Sold (COGS):</strong> Calculated and recorded instantly at the time of sale.</li>
                <li><strong>Best For:</strong> High-value items (Cars, Jewelry, Appliances) or high-volume businesses with technology (Amazon, Walmart).</li>
            </ul>
            <div class="bg-gray-100 p-3 rounded text-sm italic">
                <strong>Analogy:</strong> Your bank app. You check it, and it shows your balance <em>right now</em> because every debit card swipe is recorded instantly.
            </div>
        </div>
    </li>

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">3. The Periodic System: The "Physical Count" Method</h3>
        <div class="text-gray-700 mb-4">
            <p class="mb-3">
                Under the Periodic system, the business does not track the cost of items sold during the sale. Instead, they record all buys into a temporary account called <strong>Purchases</strong>.
            </p>
            <p class="mb-3">
                To find out the Cost of Goods Sold (COGS), they must perform a physical count at the end of the period to see what is missing (sold).
            </p>

            

            <div class="bg-slate-800 text-white p-4 rounded-lg my-4 font-mono text-center">
                $$Beginning\ Inventory + Net\ Purchases = Goods\ Available$$
                <br>
                $$Goods\ Available - Ending\ Inventory = Cost\ of\ Goods\ Sold$$
            </div>

            <ul class="list-disc pl-5 mb-4 space-y-2">
                <li><strong>Low Cost:</strong> Requires less technology and effort during the day.</li>
                <li><strong>The Blind Spot:</strong> You don't know if items were stolen or sold until the end of the month count.</li>
                <li><strong>Best For:</strong> Small businesses with low-value items (Sari-sari stores, hardware stores selling loose nails).</li>
            </ul>
        </div>
    </li>

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">4. Side-by-Side Comparison</h3>
        <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm whitespace-nowrap">
                <thead class="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50 text-gray-600">
                    <tr>
                        <th scope="col" class="px-6 py-4">Feature</th>
                        <th scope="col" class="px-6 py-4">Perpetual System</th>
                        <th scope="col" class="px-6 py-4">Periodic System</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-gray-700">
                    <tr>
                        <td class="px-6 py-4 font-bold">Inventory Account</td>
                        <td class="px-6 py-4">Updated continuously</td>
                        <td class="px-6 py-4">Updated only at period end</td>
                    </tr>
                    <tr>
                        <td class="px-6 py-4 font-bold">Purchases Recorded In</td>
                        <td class="px-6 py-4">"Inventory" Account</td>
                        <td class="px-6 py-4">"Purchases" Account</td>
                    </tr>
                    <tr>
                        <td class="px-6 py-4 font-bold">COGS Recognition</td>
                        <td class="px-6 py-4">Recorded at every sale</td>
                        <td class="px-6 py-4">Calculated at end of month</td>
                    </tr>
                    <tr>
                        <td class="px-6 py-4 font-bold">Shrinkage (Theft)</td>
                        <td class="px-6 py-4">Easily detected (Record vs. Count)</td>
                        <td class="px-6 py-4">Hard to detect (Buried in COGS)</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </li>

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">5. Application: Journal Entries</h3>
        <p class="text-gray-700 mb-4">
            The accounting entries differ significantly between the two. Notice how the Perpetual system involves <strong>two entries</strong> during a sale.
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-2">Scenario A: Buying Goods ($1,000)</h4>
                
                <p class="text-xs uppercase font-bold text-gray-500 mt-2">Perpetual Entry</p>
                <div class="font-mono text-sm bg-white p-2 rounded border border-gray-200">
                    Dr. Merchandise Inventory  1,000<br>
                    &nbsp;&nbsp;&nbsp;Cr. Accounts Payable  1,000
                </div>

                <p class="text-xs uppercase font-bold text-gray-500 mt-2">Periodic Entry</p>
                <div class="font-mono text-sm bg-white p-2 rounded border border-gray-200">
                    Dr. Purchases  1,000<br>
                    &nbsp;&nbsp;&nbsp;Cr. Accounts Payable  1,000
                </div>
            </div>

            <div class="bg-green-50 p-4 rounded-lg">
                <h4 class="font-bold text-green-900 mb-2 border-b border-green-200 pb-2">Scenario B: Selling Goods ($1,500 Sales Price, $1,000 Cost)</h4>
                
                <p class="text-xs uppercase font-bold text-gray-500 mt-2">Perpetual Entry (2 Steps)</p>
                <div class="font-mono text-sm bg-white p-2 rounded border border-gray-200">
                    1. Dr. Acc. Receivable  1,500<br>
                    &nbsp;&nbsp;&nbsp;Cr. Sales  1,500<br>
                    <span class="text-red-600">2. Dr. COGS  1,000<br>
                    &nbsp;&nbsp;&nbsp;Cr. Merch. Inventory  1,000</span>
                </div>

                <p class="text-xs uppercase font-bold text-gray-500 mt-2">Periodic Entry (1 Step)</p>
                <div class="font-mono text-sm bg-white p-2 rounded border border-gray-200">
                    1. Dr. Acc. Receivable  1,500<br>
                    &nbsp;&nbsp;&nbsp;Cr. Sales  1,500<br>
                    <span class="text-gray-400 italic">(No COGS entry made yet)</span>
                </div>
            </div>
        </div>
    </li>
</ul>`,
            exercises: [
    // --- MULTIPLE CHOICE QUESTIONS (1-25) ---

    {
        type: "mcq",
        question: "Which inventory system requires a physical count to determine the Cost of Goods Sold (COGS) at the end of the period?",
        options: ["Perpetual System", "Periodic System", "Just-In-Time System", "Automated System"],
        correctIndex: 1,
        explanation: "The Periodic system relies on a physical count because it does not track COGS during sales transactions."
    },
    {
        type: "mcq",
        question: "In a Perpetual inventory system, which account is debited when inventory is purchased?",
        options: ["Purchases", "Merchandise Inventory", "Cost of Goods Sold", "Accounts Payable"],
        correctIndex: 1,
        explanation: "The Perpetual system updates the asset account 'Merchandise Inventory' directly."
    },
    {
        type: "mcq",
        question: "Under the Periodic system, purchases of merchandise are recorded in which account?",
        options: ["Merchandise Inventory", "Cost of Goods Sold", "Purchases", "Sales"],
        correctIndex: 2,
        explanation: "The Periodic system uses a temporary expense-like account called 'Purchases'."
    },
    {
        type: "mcq",
        question: "Which system provides better protection against shrinkage and theft?",
        options: ["Periodic System", "Perpetual System", "Both are equal", "Neither"],
        correctIndex: 1,
        explanation: "Perpetual allows comparison between book records and physical counts, making missing items obvious."
    },
    {
        type: "mcq",
        question: "When selling goods under the Perpetual system, how many journal entries are typically made?",
        options: ["One (for Revenue)", "One (for Cost)", "Two (one for Revenue, one for Cost)", "None"],
        correctIndex: 2,
        explanation: "One entry records the Sale/Receivable, and the second entry records the COGS/Inventory reduction."
    },
    {
        type: "mcq",
        question: "The formula 'Beginning Inventory + Net Purchases - Ending Inventory' is used to calculate:",
        options: ["Gross Profit", "Cost of Goods Sold", "Net Income", "Total Liabilities"],
        correctIndex: 1,
        explanation: "This is the standard formula for deriving COGS in a Periodic system."
    },
    {
        type: "mcq",
        question: "Which account is generally NOT used in a Perpetual inventory system?",
        options: ["Purchases", "Cost of Goods Sold", "Merchandise Inventory", "Sales"],
        correctIndex: 0,
        explanation: "The 'Purchases' account is specific to the Periodic system; Perpetual uses 'Merchandise Inventory' for buys."
    },
    {
        type: "mcq",
        question: "If a company uses the Periodic system, when is the Cost of Goods Sold account updated?",
        options: ["At the time of each sale", "Daily", "At the end of the accounting period", "Never"],
        correctIndex: 2,
        explanation: "COGS is calculated as a lump sum at the end of the period after the physical count."
    },
    {
        type: "mcq",
        question: "Freight costs paid by the buyer (FOB Shipping Point) are treated as part of the inventory cost. In a Perpetual system, this is debited to:",
        options: ["Freight-In Expense", "Merchandise Inventory", "Delivery Expense", "Cost of Goods Sold"],
        correctIndex: 1,
        explanation: "Product costs, including freight-in, are capitalized into the Inventory asset account in Perpetual systems."
    },
    {
        type: "mcq",
        question: "In a Periodic system, 'Freight-In' is recorded as:",
        options: ["A decrease to Sales", "A separate expense account used in COGS calculation", "A debit to Merchandise Inventory", "A credit to Cash only"],
        correctIndex: 1,
        explanation: "In Periodic, Freight-In is a separate temporary account added to Net Purchases."
    },
    {
        type: "mcq",
        question: "A company returns defective goods to a supplier. In a Perpetual system, the credit goes to:",
        options: ["Purchase Returns and Allowances", "Merchandise Inventory", "Accounts Payable", "Sales Returns"],
        correctIndex: 1,
        explanation: "Since the original purchase increased Inventory, the return must decrease (credit) Inventory directly."
    },
    {
        type: "mcq",
        question: "A company returns defective goods to a supplier. In a Periodic system, the credit goes to:",
        options: ["Purchase Returns and Allowances", "Merchandise Inventory", "Cost of Goods Sold", "Cash"],
        correctIndex: 0,
        explanation: "Periodic systems use the contra-expense account 'Purchase Returns and Allowances'."
    },
    {
        type: "mcq",
        question: "Which company is most likely to use a Periodic inventory system?",
        options: ["A car dealership", "A high-end jewelry store", "A local hardware store selling loose nails", "An Apple store"],
        correctIndex: 2,
        explanation: "Periodic is often used for low-value, high-volume items where tracking every unit is not cost-effective."
    },
    {
        type: "mcq",
        question: "The term '2/10, n/30' means:",
        options: ["2% interest if paid in 30 days", "2% discount if paid within 10 days, net due in 30", "10% discount if paid within 2 days", "Net due in 10 days"],
        correctIndex: 1,
        explanation: "This is a standard credit term notation for early payment discounts."
    },
    {
        type: "mcq",
        question: "Gross Profit is calculated as:",
        options: ["Sales - Operating Expenses", "Net Sales - Cost of Goods Sold", "Net Income + Expenses", "Assets - Liabilities"],
        correctIndex: 1,
        explanation: "Gross Profit is the direct profit from the merchandise itself before operating expenses."
    },
    {
        type: "mcq",
        question: "If physical count shows less inventory than the Perpetual records indicate, the difference is recorded as:",
        options: ["Inventory Overturn", "Inventory Shortage/Shrinkage", "Sales Return", "Purchase Discount"],
        correctIndex: 1,
        explanation: "This difference usually represents theft, loss, or errors and is adjusted to COGS."
    },
    {
        type: "mcq",
        question: "Purchase Discounts in a Periodic system is considered a:",
        options: ["Contra-revenue account", "Contra-purchase account", "Liability", "Asset"],
        correctIndex: 1,
        explanation: "It reduces the total cost of purchases."
    },
    {
        type: "mcq",
        question: "When a customer returns goods to the seller, the seller records:",
        options: ["Purchase Return", "Sales Return", "Inventory Loss", "Bad Debt"],
        correctIndex: 1,
        explanation: "From the seller's perspective, this is a Sales Return."
    },
    {
        type: "mcq",
        question: "Which of the following creates a discrepancy between the book balance and physical balance in a Perpetual system?",
        options: ["Sales returns", "Purchases", "Theft or spoilage", "Sales discounts"],
        correctIndex: 2,
        explanation: "Theft removes the item physically but leaves the record unchanged until corrected."
    },
    {
        type: "mcq",
        question: "In the closing process for a Periodic system, the Beginning Inventory is:",
        options: ["Debited to Income Summary", "Credited to Income Summary", "Left alone", "Transferred to Assets"],
        correctIndex: 0,
        explanation: "Beginning Inventory is removed (credited from Inventory, debited to Income Summary) and replaced by Ending Inventory."
    },
    {
        type: "mcq",
        question: "FOB Destination means ownership transfers when:",
        options: ["Goods leave the seller's warehouse", "Goods arrive at the buyer's location", "Payment is made", "Order is placed"],
        correctIndex: 1,
        explanation: "Free on Board (FOB) Destination means the seller owns the goods while they are in transit."
    },
    {
        type: "mcq",
        question: "Who pays for shipping costs in FOB Destination?",
        options: ["The Buyer", "The Seller", "The Carrier", "Split 50/50"],
        correctIndex: 1,
        explanation: "The seller retains ownership during transit and pays the freight costs (Delivery Expense)."
    },
    {
        type: "mcq",
        question: "Net Sales is calculated as:",
        options: ["Sales - COGS", "Sales - Sales Returns - Sales Discounts", "Sales + Interest Revenue", "Gross Profit - Expenses"],
        correctIndex: 1,
        explanation: "Net Sales is the actual revenue realized after deductions for returns and discounts."
    },
    {
        type: "mcq",
        question: "Which system requires more record-keeping effort but provides better management information?",
        options: ["Periodic", "Perpetual", "Single-entry", "Cash basis"],
        correctIndex: 1,
        explanation: "Perpetual offers real-time data but requires recording every transaction's cost impact."
    },
    {
        type: "mcq",
        question: "If Ending Inventory is overstated, what is the effect on Cost of Goods Sold?",
        options: ["Understated", "Overstated", "No effect", "Depends on Sales"],
        correctIndex: 0,
        explanation: "Since 'Goods Available - Ending Inv = COGS', a higher ending inventory number results in a lower (understated) COGS."
    },

    // --- OPEN-ENDED PROBLEMS (26-35) ---

    {
        type: "problem",
        question: "Company A uses a Perpetual System. They sell goods costing ₱3,000 for ₱5,000 on account. Provide the necessary journal entries.",
        answer: `Entry 1 (Revenue):
Dr. Accounts Receivable   5,000
   Cr. Sales                    5,000

Entry 2 (Cost):
Dr. Cost of Goods Sold    3,000
   Cr. Merchandise Inventory    3,000`,
        explanation: "Perpetual systems require two entries: one to recognize the revenue and one to recognize the expense (COGS) and reduce the asset."
    },
    {
        type: "problem",
        question: "Company B uses a Periodic System. Calculate the Cost of Goods Sold given the following data:\nBeginning Inventory: ₱10,000\nPurchases: ₱40,000\nPurchase Returns: ₱2,000\nFreight-In: ₱1,000\nEnding Inventory: ₱8,000",
        answer: `Beginning Inventory:      ₱10,000
+ Purchases:              ₱40,000
- Purchase Returns:      (₱2,000)
+ Freight-In:             ₱1,000
-----------------------------------
Goods Available for Sale: ₱49,000
- Ending Inventory:      (₱8,000)
-----------------------------------
Cost of Goods Sold:       ₱41,000`,
        explanation: "The formula is Beginning Inv + Net Purchases (Purchases - Returns + Freight) - Ending Inv."
    },
    {
        type: "problem",
        question: "Explain why a Periodic Inventory System might result in 'Inventory Shrinkage' being hidden inside Cost of Goods Sold.",
        answer: `In a Periodic system, COGS is a "plug" figure derived by subtracting what is left (Ending Inv) from what was available. 
If items are stolen, they are simply missing from the final count. The formula assumes anything not in the warehouse was sold. Therefore, the cost of stolen goods is automatically included in COGS, making it impossible to separate theft from legitimate sales costs without other data.`,
        explanation: "Without a book record to compare against the physical count, all missing items are assumed sold."
    },
    {
        type: "problem",
        question: "A buyer purchases goods for ₱20,000 FOB Shipping Point. Shipping costs are ₱1,000. The buyer pays cash for shipping. Record the journal entry for the shipping payment under a Perpetual System.",
        answer: `Dr. Merchandise Inventory   1,000
   Cr. Cash                     1,000`,
        explanation: "Under Perpetual, costs necessary to get the inventory ready for sale (like freight-in) are added to the Inventory asset account, not expensed immediately."
    },
    {
        type: "problem",
        question: "A seller offers terms 3/15, n/45 on a ₱10,000 sale. The customer pays on day 12. Calculate the Net Cash Received by the seller.",
        answer: `Invoice Amount:     ₱10,000
Discount (3%):       (₱300)  [10,000 x 0.03]
----------------------------
Net Cash Received:   ₱9,700`,
        explanation: "The customer paid within the 15-day window, so they are entitled to the 3% discount."
    },
    {
        type: "problem",
        question: "Record the journal entry for a RETURN of goods purchased on credit under the PERIODIC system. Amount: ₱500.",
        answer: `Dr. Accounts Payable        500
   Cr. Purchase Returns & Allow.  500`,
        explanation: "In Periodic, we credit the specific contra-account 'Purchase Returns and Allowances' rather than crediting Inventory directly."
    },
    {
        type: "problem",
        question: "Why do car dealerships almost exclusively use Perpetual systems, while small candy shops might use Periodic?",
        answer: `Car dealerships have high unit costs and low sales volume. Losing one car is a financial disaster, so they need real-time tracking (Perpetual). 
Candy shops have low unit costs and high volume. Tracking the cost of every lollipop sold in real-time is not worth the administrative effort; a simple count at the end of the month (Periodic) is sufficient.`,
        explanation: "The choice of system often depends on the Cost-Benefit constraint regarding the value of the items vs. the cost of tracking them."
    },
    {
        type: "problem",
        question: "Calculate Gross Profit:\nSales Revenue: ₱100,000\nSales Returns: ₱5,000\nSales Discounts: ₱2,000\nCost of Goods Sold: ₱60,000",
        answer: `Sales Revenue:       ₱100,000
Less: Returns:        (₱5,000)
Less: Discounts:      (₱2,000)
-----------------------------
Net Sales:            ₱93,000
Less: COGS:          (₱60,000)
-----------------------------
Gross Profit:         ₱33,000`,
        explanation: "Gross Profit = Net Sales - COGS."
    },
    {
        type: "problem",
        question: "In a Perpetual System, a physical count reveals ₱48,000 in inventory, but the books show ₱50,000. Record the adjusting entry.",
        answer: `Dr. Cost of Goods Sold       2,000
   Cr. Merchandise Inventory    2,000`,
        explanation: "The inventory record must be lowered to match the physical reality. The loss is usually expensed to COGS (Inventory Shortage)."
    },
    {
        type: "problem",
        question: "A company purchased ₱2,000 of inventory on credit. A week later, they paid the balance in full within the discount period of 2%. Record the PAYMENT entry under the PERPETUAL system.",
        answer: `Dr. Accounts Payable        2,000
   Cr. Cash                     1,960
   Cr. Merchandise Inventory       40`,
        explanation: "In a Perpetual system, the discount reduces the cost of the asset. Therefore, we credit Inventory for the discount amount (₱40), rather than using a 'Purchase Discounts' revenue account."
    },
                {
    type: "problem",
    question: "Calculate Cost of Goods Sold: A shoe store began the year with an inventory worth ₱50,000. Throughout the year, they made Purchases totaling ₱300,000. At the end of the year, a physical count showed an Ending Inventory of ₱40,000. Calculate the COGS.",
    answer: `Beginning Inventory:   ₱50,000
Add: Purchases:        ₱300,000
------------------------------
Goods Available:       ₱350,000
Less: Ending Inv:     (₱40,000)
------------------------------
Cost of Goods Sold:    ₱310,000`,
    explanation: "The basic formula for COGS is Beginning Inventory + Purchases - Ending Inventory."
},
                {
    type: "problem",
    question: "Calculate Cost of Goods Sold: A hardware shop reports the following figures: Beginning Inventory ₱120,000; Purchases ₱500,000; Freight-In (Transportation In) ₱25,000; and Ending Inventory ₱150,000. Calculate the COGS.",
    answer: `Beginning Inventory:   ₱120,000
Add: Purchases:        ₱500,000
Add: Freight-In:        ₱25,000
------------------------------
Goods Available:       ₱645,000
Less: Ending Inv:     (₱150,000)
------------------------------
Cost of Goods Sold:    ₱495,000`,
    explanation: "Freight-In is added to the cost of purchases because it is a necessary cost to bring the goods to the seller's location."
},
                {
    type: "problem",
    question: "Calculate Cost of Goods Sold: Based on the following ledger balances, compute the COGS: Beginning Inventory ₱200,000; Gross Purchases ₱850,000; Purchase Returns & Allowances ₱35,000; Purchase Discounts ₱15,000; Freight-In ₱40,000; Ending Inventory ₱180,000.",
    answer: `Beginning Inventory:       ₱200,000
Add: Purchases:            ₱850,000
Less: Purch Returns:      (₱35,000)
Less: Purch Discounts:    (₱15,000)
Add: Freight-In:            ₱40,000
-----------------------------------
Net Cost of Purchases:     ₱840,000
-----------------------------------
Goods Available for Sale: ₱1,040,000
Less: Ending Inv:         (₱180,000)
-----------------------------------
Cost of Goods Sold:        ₱860,000`,
    explanation: "You must first determine Net Purchases by subtracting Returns and Discounts from Gross Purchases, then add Freight-In to find the total cost of goods available."
},
                {
    type: "problem",
    question: "Calculate Cost of Goods Sold: The accountant provided the following mixed data for the year: Sales Revenue ₱1,500,000; Beginning Inventory ₱300,000; Purchases ₱900,000; Sales Returns ₱50,000; Freight-Out ₱20,000; Freight-In ₱30,000; Purchase Returns ₱40,000; Ending Inventory ₱250,000. Calculate the COGS.",
    answer: `Beginning Inventory:     ₱300,000
Add: Purchases:          ₱900,000
Less: Purch Returns:    (₱40,000)
Add: Freight-In:          ₱30,000
--------------------------------
Goods Available:       ₱1,190,000
Less: Ending Inv:       (₱250,000)
--------------------------------
Cost of Goods Sold:      ₱940,000`,
    explanation: "This problem contains 'distractors'. Sales Revenue and Sales Returns are income items, not costs. Freight-Out is an operating expense (selling expense), not part of COGS. Only Freight-In and Purchase-related costs are included."
},
                {
    type: "problem",
    question: "Calculate Cost of Goods Sold: A company's records show that the Cost of Goods Available for Sale (COGAS) was ₱1,200,000. The Beginning Inventory was ₱200,000. The Ending Inventory is calculated to be 25% of the Net Cost of Purchases. Calculate the Cost of Goods Sold.",
    answer: `1. Find Net Cost of Purchases:
   COGAS (₱1,200,000) - Beg Inv (₱200,000) = Net Cost of Purchases (₱1,000,000)

2. Calculate Ending Inventory:
   25% of ₱1,000,000 = ₱250,000

3. Calculate COGS:
   COGAS:               ₱1,200,000
   Less: Ending Inv:     (₱250,000)
   -------------------------------
   Cost of Goods Sold:    ₱950,000`,
    explanation: "This requires working backward and understanding relationships. First, isolate the Net Cost of Purchases from the Available for Sale figure, then use that derived number to calculate the Ending Inventory."
}
]
        },
        {
            day: "Day 5",
            topic: "Recorded Summary Quiz",
            content: `<h3 class="text-xl font-bold mb-4">Assessment Activity</h3><p>Video/Audio submission.</p>`,
            exercises: []
        }
    ]
};
