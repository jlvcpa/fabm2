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
    topic: "Freight-in and Freight Out (FOB Destination/Shipping)",
    content: `<div class="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
    <p class="font-bold text-indigo-900">Learning Goal</p>
    <p class="text-indigo-800">Master the accounting for transportation costs (Freight) and understand the legal implications of FOB Shipping Point vs. FOB Destination under both Periodic and Perpetual systems.</p>
</div>

<h3 class="text-xl font-bold mb-4 mt-6">Topic Focus</h3>
<ul class="list-none space-y-8 mb-6">

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">1. The Golden Rule: Ownership Determines Responsibility</h3>
        <div class="text-gray-700 mb-4">
            <p class="mb-3">
                In accounting, the party who owns the goods while they are in transit is the party responsible for paying the freight (shipping) costs. This ownership is determined by the <strong>F.O.B. (Free On Board)</strong> terms.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="bg-blue-50 p-4 rounded border border-blue-200">
                    <h4 class="font-bold text-blue-900 mb-2">FOB Shipping Point</h4>
                    <ul class="text-sm text-blue-800 space-y-2 list-disc pl-4">
                        <li><strong>Ownership Transfers:</strong> At the seller's shipping dock (Shipping Point).</li>
                        <li><strong>Owner in Transit:</strong> The <span class="font-bold underline">BUYER</span>.</li>
                        <li><strong>Who Pays Freight:</strong> The Buyer.</li>
                        <li><strong>Account Used:</strong> <span class="font-mono">Freight-In</span> (Cost of purchasing).</li>
                    </ul>
                </div>
                <div class="bg-green-50 p-4 rounded border border-green-200">
                    <h4 class="font-bold text-green-900 mb-2">FOB Destination</h4>
                    <ul class="text-sm text-green-800 space-y-2 list-disc pl-4">
                        <li><strong>Ownership Transfers:</strong> At the buyer's receiving dock (Destination).</li>
                        <li><strong>Owner in Transit:</strong> The <span class="font-bold underline">SELLER</span>.</li>
                        <li><strong>Who Pays Freight:</strong> The Seller.</li>
                        <li><strong>Account Used:</strong> <span class="font-mono">Freight-Out</span> (Operating Expense).</li>
                    </ul>
                </div>
            </div>
        </div>
    </li>

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">2. Accounting for Freight Costs</h3>
        <p class="text-gray-700 mb-4">
            How we record these costs depends on whether we use the Periodic or Perpetual system.
        </p>

        <h4 class="font-bold text-gray-800 mt-4 mb-2">A. Freight-In (Buyer Pays)</h4>
        <p class="text-sm text-gray-600 mb-2">This is a cost of acquiring inventory.</p>
        <table class="w-full text-sm text-left text-gray-700 mb-6 border border-gray-300">
            <thead class="bg-gray-100 uppercase">
                <tr>
                    <th class="px-4 py-2 border-r">System</th>
                    <th class="px-4 py-2">Treatment</th>
                    <th class="px-4 py-2">Journal Entry</th>
                </tr>
            </thead>
            <tbody>
                <tr class="border-b">
                    <td class="px-4 py-2 border-r font-bold">Perpetual</td>
                    <td class="px-4 py-2">Added directly to Inventory asset.</td>
                    <td class="px-4 py-2 font-mono">Dr. Inventory<br>Cr. Cash</td>
                </tr>
                <tr>
                    <td class="px-4 py-2 border-r font-bold">Periodic</td>
                    <td class="px-4 py-2">Recorded in a separate "Freight-in" account.</td>
                    <td class="px-4 py-2 font-mono">Dr. Freight-in<br>Cr. Cash</td>
                </tr>
            </tbody>
        </table>

        <h4 class="font-bold text-gray-800 mt-4 mb-2">B. Freight-Out (Seller Pays)</h4>
        <p class="text-sm text-gray-600 mb-2">This is a selling expense (Operating Expense). It is NEVER part of COGS or Inventory cost.</p>
        <table class="w-full text-sm text-left text-gray-700 mb-4 border border-gray-300">
            <thead class="bg-gray-100 uppercase">
                <tr>
                    <th class="px-4 py-2 border-r">System</th>
                    <th class="px-4 py-2">Treatment</th>
                    <th class="px-4 py-2">Journal Entry</th>
                </tr>
            </thead>
            <tbody>
                <tr class="border-b">
                    <td class="px-4 py-2 border-r font-bold">Perpetual</td>
                    <td class="px-4 py-2">Expense Account (Delivery Expense).</td>
                    <td class="px-4 py-2 font-mono">Dr. Freight-Out / Delivery Expense<br>Cr. Cash</td>
                </tr>
                <tr>
                    <td class="px-4 py-2 border-r font-bold">Periodic</td>
                    <td class="px-4 py-2">Expense Account (Delivery Expense).</td>
                    <td class="px-4 py-2 font-mono">Dr. Freight-Out / Delivery Expense<br>Cr. Cash</td>
                </tr>
            </tbody>
        </table>
        <div class="bg-yellow-50 p-3 rounded text-sm text-yellow-800 border border-yellow-200">
            <strong>Note:</strong> Freight-Out is treated exactly the same in both systems. It is always an expense.
        </div>
    </li>
</ul>`,
    exercises: [
        // --- THEORY QUESTIONS (5) ---
        {
            type: "mcq",
            question: "Under FOB Shipping Point, at what moment does the title (ownership) of the goods pass to the buyer?",
            options: ["When the goods arrive at the buyer's warehouse", "When the goods are delivered to the carrier/shipper", "When the invoice is paid", "When the goods are ordered"],
            correctIndex: 1,
            explanation: "FOB Shipping Point means title transfers as soon as the seller puts the goods on the truck/ship."
        },
        {
            type: "mcq",
            question: "Which of the following statements about 'Freight-Out' is TRUE?",
            options: ["It is part of the Cost of Goods Sold.", "It is an administrative expense.", "It is a selling expense.", "It increases the value of merchandise inventory."],
            correctIndex: 2,
            explanation: "Freight-out is the cost of delivering goods to customers, making it a selling expense."
        },
        {
            type: "mcq",
            question: "In a Perpetual Inventory System, how is 'Freight-In' recorded by the buyer?",
            options: ["Debit Freight-In", "Debit Delivery Expense", "Debit Inventory", "Debit Cost of Goods Sold"],
            correctIndex: 2,
            explanation: "In Perpetual, costs to acquire inventory (like freight-in) are capitalized directly into the 'Inventory' asset account."
        },
        {
            type: "mcq",
            question: "In a Periodic Inventory System, how is 'Freight-In' recorded by the buyer?",
            options: ["Debit Inventory", "Debit Freight-In", "Debit Purchases", "Debit Delivery Expense"],
            correctIndex: 1,
            explanation: "The Periodic system uses a specific temporary account called 'Freight-In' to track these costs separately from purchases."
        },
        {
            type: "mcq",
            question: "If goods are sold FOB Destination, who bears the shipping cost?",
            options: ["The Buyer", "The Seller", "The Carrier", "The Broker"],
            correctIndex: 1,
            explanation: "FOB Destination means the Seller owns the goods until delivery, so the Seller pays the freight."
        },

        // --- PROBLEM SOLVING QUESTIONS (5) ---
        {
            type: "problem",
            question: "PROBLEM 1: PERPETUAL SYSTEM (FOB Shipping Point)\nRecord the following transactions for 'TechRetail' using the Perpetual Inventory System.\n\n1. Jan 5: Purchased 100 laptops from Dell for $500 each on account, terms 2/10, n/30, FOB Shipping Point.\n2. Jan 6: Paid Fedex $200 cash for shipping the laptops.\n3. Jan 8: Returned 5 defective laptops to Dell.\n4. Jan 15: Paid Dell the full amount due within the discount period.\n5. Jan 20: Sold 50 laptops for $800 each on account. (Cost to TechRetail was $502/unit including freight).",
            answer: `1. Jan 5 (Purchase):
   Dr. Inventory           50,000
       Cr. Accounts Payable    50,000

2. Jan 6 (Freight-In):
   Dr. Inventory              200  (Added to asset in Perpetual)
       Cr. Cash                   200

3. Jan 8 (Return):
   Dr. Accounts Payable     2,500  (5 units * $500)
       Cr. Inventory            2,500

4. Jan 15 (Payment):
   Dr. Accounts Payable    47,500  (50,000 - 2,500)
       Cr. Inventory              950  (2% of 47,500 - Discount reduces asset cost)
       Cr. Cash                46,550

5. Jan 20 (Sale):
   Dr. Accounts Receivable 40,000
       Cr. Sales Revenue       40,000
   (AND)
   Dr. Cost of Goods Sold  25,100  (50 units * $502)
       Cr. Inventory           25,100`,
            explanation: "Note how Freight and Discounts affect the 'Inventory' account directly in Perpetual."
        },
        {
            type: "problem",
            question: "PROBLEM 2: PERIODIC SYSTEM (FOB Shipping Point)\nRecord the exact same transactions as Problem 1, but for a company using the PERIODIC Inventory System.\n\n1. Jan 5: Purchased 100 laptops @ $500, terms 2/10, n/30, FOB Shipping Point.\n2. Jan 6: Paid Fedex $200 cash for shipping.\n3. Jan 8: Returned 5 defective laptops.\n4. Jan 15: Paid Dell in full (with discount).\n5. Jan 20: Sold 50 laptops for $800 each.",
            answer: `1. Jan 5 (Purchase):
   Dr. Purchases           50,000
       Cr. Accounts Payable    50,000

2. Jan 6 (Freight-In):
   Dr. Freight-In             200  (Separate expense account)
       Cr. Cash                   200

3. Jan 8 (Return):
   Dr. Accounts Payable     2,500
       Cr. Purchase Returns & Allowances  2,500

4. Jan 15 (Payment):
   Dr. Accounts Payable    47,500
       Cr. Purchase Discounts     950  (Contra-expense account)
       Cr. Cash                46,550

5. Jan 20 (Sale):
   Dr. Accounts Receivable 40,000
       Cr. Sales Revenue       40,000
   (No entry for COGS/Inventory in Periodic system at time of sale)`,
            explanation: "In Periodic, we use temporary accounts (Purchases, Freight-In, Purchase Returns) and do not update Inventory/COGS until the end of the period."
        },
        {
            type: "problem",
            question: "PROBLEM 3: PERPETUAL SYSTEM (FOB Destination)\nRecord these transactions for 'FurnitureCo' (Seller) using Perpetual System.\n\n1. Mar 1: Sold Office Desks to a client on account for $10,000. The Cost of Goods Sold was $6,000. Terms FOB Destination.\n2. Mar 2: Paid shipping company $300 cash for delivery to client.\n3. Mar 5: Client returned damaged desks worth $1,000 (Cost was $600). The desks were scrapped (Inventory value $0).\n4. Mar 10: Received payment from client for the balance (no discount).",
            answer: `1. Mar 1 (Sale):
   Dr. Accounts Receivable 10,000
       Cr. Sales Revenue       10,000
   (AND)
   Dr. Cost of Goods Sold   6,000
       Cr. Inventory            6,000

2. Mar 2 (Freight-Out):
   Dr. Delivery Expense       300  (Or Freight-Out)
       Cr. Cash                   300

3. Mar 5 (Return - Scrapped):
   Dr. Sales Returns & Allowances 1,000
       Cr. Accounts Receivable        1,000
   (No entry to restore Inventory because goods were scrapped/worthless)

4. Mar 10 (Receipt):
   Dr. Cash                 9,000
       Cr. Accounts Receivable      9,000`,
            explanation: "Since terms were FOB Destination, the Seller (FurnitureCo) pays the $300 freight, recording it as an operating expense."
        },
        {
            type: "problem",
            question: "PROBLEM 4: PERIODIC SYSTEM (Buyer & Seller Mix)\nJournalize the following for Company A (The Buyer) using PERIODIC system.\n\n1. Apr 1: Purchased goods from Company B for $5,000, FOB Destination.\n2. Apr 2: Paid $150 freight charges upon arrival (Wait! Terms were FOB Destination, but Buyer paid cash on arrival as a courtesy to Seller).\n3. Apr 5: Returned $500 of goods.\n4. Apr 10: Paid the balance due to Company B, deducting the freight paid on their behalf.",
            answer: `1. Apr 1 (Purchase):
   Dr. Purchases            5,000
       Cr. Accounts Payable     5,000

2. Apr 2 (Freight Payment):
   Dr. Accounts Payable       150  (Reduces amount owed to Seller)
       Cr. Cash                   150
   *Note: Since terms were FOB Destination, this is the Seller's cost. The Buyer paying it reduces the liability to the Seller.*

3. Apr 5 (Return):
   Dr. Accounts Payable       500
       Cr. Purchase Returns & Allw.   500

4. Apr 10 (Payment):
   Dr. Accounts Payable     4,350  (5,000 - 150 prepaid - 500 return)
       Cr. Cash                 4,350`,
            explanation: "Crucial concept: If the Buyer pays freight on FOB Destination goods, they are essentially 'loaning' that cash to the Seller. It reduces Accounts Payable, it is NOT Freight-In."
        },
        {
            type: "problem",
            question: "PROBLEM 5: COMPREHENSIVE (Perpetual)\nRecord for 'Global Traders'.\n\n1. May 1: Purchased inventory $20,000, FOB Shipping Point.\n2. May 2: Paid freight $500.\n3. May 5: Sold 40% of the inventory for $15,000 on account, FOB Shipping Point.\n4. May 6: Paid $200 freight on the sales shipment (Wait! Terms were FOB Shipping Point, but we prepaid it for the customer).\n5. May 10: Customer returned $1,000 of goods (Cost $600) to inventory.",
            answer: `1. May 1:
   Dr. Inventory            20,000
       Cr. Accounts Payable     20,000

2. May 2:
   Dr. Inventory               500
       Cr. Cash                    500
   *Total Cost of Inv = 20,500*

3. May 5:
   Dr. Accounts Receivable  15,000
       Cr. Sales Revenue        15,000
   (AND)
   Dr. Cost of Goods Sold    8,200  (40% of 20,500)
       Cr. Inventory             8,200

4. May 6:
   Dr. Accounts Receivable     200  (We bill the customer for this)
       Cr. Cash                    200

5. May 10:
   Dr. Sales Returns & Allw  1,000
       Cr. Accounts Receivable   1,000
   (AND)
   Dr. Inventory               600
       Cr. Cost of Goods Sold      600`,
            explanation: "Transaction 4 is tricky. FOB Shipping Point means the CUSTOMER should pay. If we (Seller) pay it, we increase the amount the customer owes us (Accounts Receivable), rather than recording an expense."
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
