// Content for Unit 2: Merchandising Business
// FIXED: We use 'export const' to create a named export.

export const unit2Data = {
    week1: [
        {
            day: "Day 1",
            topic: "Foundations of Merchandising",
            content:
                `<div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p class="font-bold text-blue-900">Learning Goal</p>
                    <p class="text-blue-800">Understand why inventory systems are critical in merchandising operations.</p>
                </div>
                <h3 class="text-xl font-bold mb-4">Topic Focus</h3>
                <ul class="list-none space-y-8 mb-6">
                    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 class="text-xl font-bold text-gray-800 mb-3">1. Definition: The Business of "Buying and Selling"</h3>
                        <div class="text-gray-700 mb-4">
                    <p class="mb-3">
                        In the vast ecosystem of commerce, merchandising businesses serve as the essential bridge between manufacturers (who create products) and consumers (who use them). Unlike manufacturers who transform raw materials into finished goods, or service providers who offer intangible skills, a merchandising business operates on a simpler, yet high-stakes premise: <strong>Arbitrage of location and convenience</strong>.
                    </p>

                    <h4 class="font-bold mb-1">The Core Concept</h4>
                    <p class="mb-3">
                        A merchandising business generates revenue by purchasing finished goods and reselling them at a higher price. They do not change the form of the product. The value they add is not in creation, but in distribution and accessibility.
                    </p>

                    <ul class="list-disc pl-5 mb-4 space-y-2">
                        <li>
                            <strong>The "No Change" Rule:</strong> If a business buys wood and glue to sell tables, they are a manufacturer. If a business buys completed tables from a factory and sells them in a showroom, they are a merchandiser.
                        </li>
                        <li>
                            <strong>The Economic Utility:</strong> Why do customers pay more to a merchandiser than the factory price?
                            <ul class="list-circle pl-5 mt-1">
                                <li><em>Breaking Bulk:</em> Factories sell in thousands; merchandisers sell in single units.</li>
                                <li><em>Assortment:</em> Merchandisers curate products from multiple factories in one place.</li>
                                <li><em>Immediacy:</em> Merchandisers hold stock so the customer doesn't have to wait for production.</li>
                            </ul>
                        </li>
                    </ul>

                    <h4 class="font-bold mb-1">Types of Merchandisers</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>
                            <strong>Wholesalers:</strong> These are the "middlemen" who buy large quantities directly from producers and sell smaller (but still significant) quantities to retailers. They rarely sell to the end-user.
                        </li>
                        <li>
                            <strong>Retailers:</strong> These businesses sell directly to the final consumer. This ranges from giant big-box stores (like Walmart) to e-commerce sites (like Amazon) to small local convenience stores.
                        </li>
                    </ul>
                    </div>
                        <div class="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
                            <strong>Key Concept:</strong> If a business buys wood and glue to make tables, they are a <em>manufacturer</em>. If they buy completed tables to sell in a showroom, they are a <em>merchandiser</em>.
                        </div>
                    </li>

                    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 class="text-xl font-bold text-gray-800 mb-3">2. Comparison: Service vs. Merchandising</h3>
                        <p class="text-gray-700 mb-4">
                            <strong>Service (sells time/skills) vs. Merchandising (sells tangible goods).</strong> This distinction fundamentally alters the Income Statement. A service business uses a "single-step" flow (Revenue - Expenses), while a merchandising business requires a "multi-step" calculation involving Cost of Goods Sold (COGS).
                        </p>
        
                        <div class="my-6 flex justify-center">
                            <svg width="100%" height="auto" viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg" class="max-w-2xl">
                                <rect x="0" y="0" width="600" height="350" fill="#f9f9f9" rx="10"/>
                                <text x="300" y="30" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="#333">Service vs. Merchandising Income Structure</text>
                                <g transform="translate(50, 60)">
                                    <rect x="0" y="0" width="220" height="260" fill="#e3f2fd" stroke="#2196f3" rx="5"/>
                                    <text x="110" y="30" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="#0d47a1">Service Business</text>
                                    <rect x="20" y="60" width="180" height="40" fill="#4caf50" rx="3"/>
                                    <text x="110" y="85" font-family="Arial" font-size="14" text-anchor="middle" fill="white">Service Revenue</text>
                                    <text x="110" y="125" font-family="Arial" font-size="20" text-anchor="middle" fill="#333">-</text>
                                    <rect x="20" y="140" width="180" height="40" fill="#f44336" rx="3"/>
                                    <text x="110" y="165" font-family="Arial" font-size="14" text-anchor="middle" fill="white">Operating Expenses</text>
                                    <line x1="20" y1="200" x2="200" y2="200" stroke="#333" stroke-width="2"/>
                                    <rect x="20" y="210" width="180" height="40" fill="#2196f3" rx="3"/>
                                    <text x="110" y="235" font-family="Arial" font-size="14" text-anchor="middle" fill="white">Net Income</text>
                                </g>
                                <g transform="translate(330, 60)">
                                    <rect x="0" y="0" width="220" height="260" fill="#fff3e0" stroke="#ff9800" rx="5"/>
                                    <text x="110" y="30" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="#e65100">Merchandising Business</text>
                                    <rect x="20" y="50" width="180" height="30" fill="#4caf50" rx="3"/>
                                    <text x="110" y="70" font-family="Arial" font-size="12" text-anchor="middle" fill="white">Sales Revenue</text>
                                    <text x="110" y="95" font-family="Arial" font-size="14" text-anchor="middle" fill="#333">- Cost of Goods Sold</text>
                                    <rect x="20" y="105" width="180" height="30" fill="#ff9800" rx="3"/>
                                    <text x="110" y="125" font-family="Arial" font-size="12" text-anchor="middle" fill="white">Gross Profit</text>
                                    <text x="110" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="#333">- Operating Expenses</text>
                                    <line x1="20" y1="160" x2="200" y2="160" stroke="#333" stroke-width="1" stroke-dasharray="4"/>
                                    <rect x="20" y="210" width="180" height="40" fill="#2196f3" rx="3"/>
                                    <text x="110" y="235" font-family="Arial" font-size="14" text-anchor="middle" fill="white">Net Income</text>
                                </g>
                            </svg>
                        </div>
                    </li>

                        <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 class="text-xl font-bold text-gray-800 mb-3">3. Inventory: The Lifeblood</h3>
                        <p class="text-gray-700 mb-4">
                            <strong>The lifeblood of merchandising; the primary asset for generating revenue.</strong> Inventory is essentially "frozen cash." It represents the products waiting to be sold.
                        </p>
                        <ul class="list-disc pl-5 space-y-2 text-gray-600">
                    <li>
                        <strong>Revenue Generation:</strong> Inventory is the lifeblood of a merchandising business because it serves as the primary source of incoming revenue. If a customer enters a store looking for a specific item and it is unavailable, the immediate sale is effectively lost. Beyond the single transaction, frequent stockouts damage the company's reputation and reliability in the eyes of the consumer. Frustrated shoppers will often turn to competitors to fulfill their needs, potentially resulting in permanent customer churn. Therefore, maintaining adequate stock levels is not just about logistics, but is a critical component of sales strategy and customer retention.
                    </li>
                    <li>
                            <strong>Carrying Costs:</strong> While inventory is a valuable asset, holding too much of it creates a significant financial burden known as carrying costs. The business must pay for physical requirements, such as warehouse rent, electricity, and security systems to protect the goods. Additionally, capital tied up in unsold inventory cannot be used for other investment opportunities, and the business must often pay premiums for insurance coverage. There is also the inherent risk of shrinkage, where goods are lost due to theft, damage during handling, or administrative errors. Furthermore, products may become obsolete, out of fashion, or spoiled if they sit on the shelves too long, turning a potential profit into a complete write-off.
                    </li>
                    <li>
                        <strong>The Goal:</strong> The ultimate objective of effective inventory management is to achieve a delicate balance between having enough stock to meet demand and minimizing the amount held in storage. Managers aim for a high inventory turnover ratio, which indicates that goods are being sold and replaced rapidly rather than sitting idle. Moving inventory quickly frees up essential cash flow, allowing the business to reinvest in new, profitable products. However, this speed cannot come at the expense of availability, as running out of stock halts the revenue cycle immediately. Success lies in optimizing ordering cycles so that new shipments arrive exactly when the old stock is nearing depletion, minimizing both holding costs and missed sales.
                    </li>
                </ul>
            </li>

                    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 class="text-xl font-bold text-gray-800 mb-3">4. The Operating Cycle & Internal Controls</h3>
                        <p class="text-gray-700 mb-4">
                            <strong>Flow: Purchase &rarr; Storage &rarr; Sale.</strong> This cycle is longer for merchandisers than service providers because cash is tied up in inventory. To protect this "frozen cash," strict internal controls are required at every step.
                        </p>
    
                        <div class="my-6 flex justify-center">
                            <svg width="100%" height="auto" viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" class="max-w-3xl">
                                <rect x="0" y="0" width="700" height="400" fill="#ffffff" stroke="#ddd" rx="10"/>
                                <text x="350" y="40" font-family="Arial" font-size="22" font-weight="bold" text-anchor="middle" fill="#333">The Merchandising Operating Cycle</text>
                                <defs>
                                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#555"/>
                                    </marker>
                                </defs>
                                <g transform="translate(350, 100)">
                                    <circle cx="0" cy="0" r="50" fill="#8bc34a" stroke="#558b2f" stroke-width="3"/>
                                    <text x="0" y="5" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="white">CASH</text>
                                </g>
                                <g transform="translate(550, 200)">
                                    <circle cx="0" cy="0" r="50" fill="#ffb74d" stroke="#ef6c00" stroke-width="3"/>
                                    <text x="0" y="-10" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="white">Buy</text>
                                    <text x="0" y="10" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="white">Inventory</text>
                                </g>
                                <g transform="translate(350, 300)">
                                    <circle cx="0" cy="0" r="50" fill="#4fc3f7" stroke="#0277bd" stroke-width="3"/>
                                    <text x="0" y="-10" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="white">Hold</text>
                                    <text x="0" y="10" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="white">Inventory</text>
                                </g>
                                <g transform="translate(150, 200)">
                                    <circle cx="0" cy="0" r="50" fill="#e57373" stroke="#c62828" stroke-width="3"/>
                                    <text x="0" y="-10" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="white">Sell in Cash </text>
                                    <text x="0" y="10" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="white">/ on Credit</text>
                                </g>
                                <line x1="390" y1="130" x2="510" y2="170" stroke="#555" stroke-width="2" marker-end="url(#arrowhead)"/>
                                <line x1="510" y1="230" x2="390" y2="270" stroke="#555" stroke-width="2" marker-end="url(#arrowhead)"/>
                                <line x1="310" y1="270" x2="190" y2="230" stroke="#555" stroke-width="2" marker-end="url(#arrowhead)"/>
                                <line x1="190" y1="170" x2="310" y2="130" stroke="#555" stroke-width="2" marker-end="url(#arrowhead)"/>
                                <text x="490" y="140" font-family="Arial" font-size="12" fill="#666">Accounts Payable</text>
                                <text x="200" y="140" font-family="Arial" font-size="12" fill="#666">Collections</text>
                            </svg>
                        </div>
                            <p class="text-sm text-gray-500 mt-2 mb-6 italic text-center">
                            <strong>Figure 1:</strong> The cycle of converting cash into goods and back into cash.
                        </p>

                        <div class="space-y-6 border-t border-gray-200 pt-6">
                            <h4 class="font-bold text-gray-800 text-lg">Detailed Policies & Procedures</h4>

                            <div class="bg-slate-50 p-4 rounded-lg border-l-4 border-orange-400">
                                <h5 class="font-bold text-slate-800 mb-2 flex items-center">
                                    <i class="fas fa-shopping-cart mr-2 text-orange-500"></i> Phase 1: Purchasing (Buying)
                                </h5>
                                <ul class="list-disc pl-5 text-sm text-slate-700 space-y-2">
                                <li><strong>Authorization (Purchase Order):</strong> Inventory should never be ordered verbally. A pre-numbered <em>Purchase Order (PO)</em> must be approved by a purchasing manager. This ensures the company only buys what it needs.</li>
                                <li><strong>Buying on Credit:</strong> When buying on account, the supplier must be on an "Approved Vendor List" to prevent fraud. The PO serves as evidence of the contract.</li>
                                <li><strong>Buying with Cash:</strong> For minor purchases, a "Petty Cash Voucher" system is used. For major cash purchases, a check or bank transfer is preferred over physical cash to create a paper trail.</li>
                            </ul>
                        </div>

                        <div class="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-400">
                            <h5 class="font-bold text-slate-800 mb-2 flex items-center">
                                <i class="fas fa-box-open mr-2 text-blue-500"></i> Phase 2: Receiving & Storage
                            </h5>
                            <ul class="list-disc pl-5 text-sm text-slate-700 space-y-2">
                                <li><strong>The Blind Count:</strong> The receiving clerk should count the goods arriving <em>without</em> looking at the quantity on the invoice. This forces an accurate physical count.</li>
                                <li><strong>Receiving Report:</strong> A document is generated listing the item, quantity, and condition. This is matched against the Purchase Order.</li>
                                <li><strong>Storage Security:</strong> Inventory must be stored in a secured area (warehouse) with restricted access. High-value items (like jewelry or electronics) require additional locks.</li>
                                <li><strong>Segregation of Duties:</strong> The person who has custody of the assets (warehouse manager) should not be the same person who maintains the accounting records.</li>
                            </ul>
                        </div>

                        <div class="bg-slate-50 p-4 rounded-lg border-l-4 border-red-400">
                            <h5 class="font-bold text-slate-800 mb-2 flex items-center">
                                <i class="fas fa-cash-register mr-2 text-red-500"></i> Phase 3: Selling
                            </h5>
                            <ul class="list-disc pl-5 text-sm text-slate-700 space-y-2">
                                <li><strong>Cash Sales:</strong> Use cash registers that provide a receipt to the customer and record the transaction internally. At the end of the day, the physical cash in the drawer is reconciled with the register tape.</li>
                                <li><strong>Sales on Account (Credit):</strong> Credit approval must be separated from the sales department. A credit manager must approve the customer's credit limit <em>before</em> the sale is finalized to minimize bad debts.</li>
                                <li><strong>Shipping Documents:</strong> For goods sold, a pre-numbered shipping document (Delivery Receipt) serves as proof that goods left the warehouse.</li>
                            </ul>
                        </div>

                        <div class="bg-slate-50 p-4 rounded-lg border-l-4 border-purple-400">
                            <h5 class="font-bold text-slate-800 mb-2 flex items-center">
                                <i class="fas fa-book mr-2 text-purple-500"></i> Phase 4: Recording & Posting
                            </h5>
                            <ul class="list-disc pl-5 text-sm text-slate-700 space-y-2">
                                <li><strong>The 3-Way Match:</strong> Before paying a supplier, the accountant matches three documents: 
                                    <ol class="list-decimal pl-4 mt-1 text-slate-500">
                                        <li>The Purchase Order (What we ordered)</li>
                                        <li>The Receiving Report (What we got)</li>
                                        <li>The Supplier's Invoice (What we are charged)</li>
                                    </ol>
                                </li>
                                <li><strong>General Journal:</strong> Transactions are recorded chronologically. Automated systems post these simultaneously to the General Ledger to keep account balances (like Accounts Payable) updated in real-time.</li>
                                <li><strong>Monthly Reconciliation:</strong> The General Ledger balance for "Inventory" is compared against a physical count of the stock at least once a year (Periodic) or continuously (Perpetual).</li>
                            </ul>
                        </div>
                    </div>
                </li>
                </ul>   
            `,
            exercises: [{ type: "mcq", question: "Primary source of revenue?", options: ["Service Fees", "Sales", "Interest", "Rent"], correctIndex: 1, explanation: "Merchandising = Sales of goods." }]
        },
        {
            day: "Day 2",
            topic: "The Periodic Inventory System",
            content: `<div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
    <p class="font-bold text-blue-900">Learning Goal</p>
    <p class="text-blue-800">Understand the mechanics of the Periodic Inventory System.</p>
    <p class="Text-blue-800">Analyze how the inventory cost flows from Purchases to Cost of Goods Sold(COGS).</p>
</div>

<h3 class="text-xl font-bold mb-4 mt-6">Topic Focus</h3>
<ul class="list-none space-y-8 mb-6">

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">1. The "Periodic" Approach: The Black Box</h3>
        <div class="text-gray-700 mb-4">
            <p class="mb-3">
                Unlike modern scanning systems that track every item the moment it is sold, the <strong>Periodic Inventory System</strong> takes a simpler, low-tech approach. The business does <em>not</em> keep a running record of the goods on hand or the Cost of Goods Sold (COGS) during the accounting period.
            </p>

            <h4 class="font-bold mb-1">How it Works</h4>
            <p class="mb-3">
                Imagine a "Black Box." during the month, we know what we put into the store (Purchases), but we don't track exactly what leaves (Sales) in terms of cost. We only find out what is left by opening the box and counting everything at the end of the month.
            </p>

            <ul class="list-disc pl-5 mb-4 space-y-2">
                <li>
                    <strong>No "Inventory" Updates:</strong> When goods are bought, they are debited to a temporary account called <em>Purchases</em>, not the Inventory asset account.
                </li>
                <li>
                    <strong>No "COGS" Entry at Sale:</strong> When a sale occurs, the accountant records the Revenue (Sale Price), but <em>does not</em> record the Cost of Goods Sold at that moment.
                </li>
            </ul>
        </div>
        <div class="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
            <strong>Key Difference:</strong> In a Periodic system, the "Inventory" account balance remains unchanged (showing the beginning balance) throughout the entire year until the final closing entries are made.
        </div>
    </li>

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">2. Calculating Cost of Goods Sold (COGS)</h3>
        <p class="text-gray-700 mb-4">
            Since we don't track costs as we sell, we must calculate COGS at the end of the period using a specific logic: <em>"If I had it, and I don't have it now, I must have sold it."</em>
        </p>

        <div class="my-6 flex justify-center">
            <svg width="100%" height="auto" viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" class="max-w-3xl">
                <rect x="0" y="0" width="700" height="300" fill="#ffffff" stroke="#e5e7eb" rx="10"/>
                
                <text x="350" y="30" font-family="Arial" font-size="18" font-weight="bold" text-anchor="middle" fill="#374151">The Flow of Costs (Periodic Formula)</text>

                <g transform="translate(50, 60)">
                    <rect x="0" y="0" width="180" height="60" fill="#e3f2fd" stroke="#2196f3" rx="5"/>
                    <text x="90" y="25" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="#0d47a1">Beginning Inventory</text>
                    <text x="90" y="45" font-family="Arial" font-size="12" text-anchor="middle" fill="#555">(What we started with)</text>
                </g>

                <text x="250" y="95" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle" fill="#333">+</text>

                <g transform="translate(270, 60)">
                    <rect x="0" y="0" width="180" height="60" fill="#e3f2fd" stroke="#2196f3" rx="5"/>
                    <text x="90" y="25" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="#0d47a1">Net Purchases</text>
                    <text x="90" y="45" font-family="Arial" font-size="12" text-anchor="middle" fill="#555">(What we bought)</text>
                </g>

                <text x="470" y="95" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle" fill="#333">=</text>

                <g transform="translate(490, 60)">
                    <rect x="0" y="0" width="180" height="60" fill="#fff3e0" stroke="#ff9800" rx="5"/>
                    <text x="90" y="25" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="#e65100">Total Goods</text>
                    <text x="90" y="45" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="#e65100">Available for Sale</text>
                </g>

                <path d="M 580 130 L 580 160" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
                
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
                    </marker>
                </defs>

                <g transform="translate(490, 170)">
                    <rect x="0" y="0" width="180" height="60" fill="#ffebee" stroke="#f44336" rx="5"/>
                    <text x="90" y="25" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="#b71c1c">- Ending Inventory</text>
                    <text x="90" y="45" font-family="Arial" font-size="12" text-anchor="middle" fill="#555">(Counted physically)</text>
                </g>

                 <text x="580" y="255" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle" fill="#333">=</text>

                 <g transform="translate(250, 220)">
                    <rect x="0" y="0" width="220" height="60" fill="#4caf50" rx="5"/>
                    <text x="110" y="35" font-family="Arial" font-size="18" font-weight="bold" text-anchor="middle" fill="white">Cost of Goods Sold</text>
                </g>
                
                <path d="M 480 250 L 500 200" stroke="#333" stroke-width="0" /> <line x1="490" y1="200" x2="470" y2="250" stroke="none"/>
            </svg>
        </div>
        
        <div class="bg-orange-50 p-4 rounded-md border-l-4 border-orange-400 text-sm text-orange-900">
            <strong>The "Squeeze" Effect:</strong> In this system, any goods missing due to theft or breakage are automatically (and incorrectly) counted as "Sold" because they are not in the Ending Inventory. This is a major disadvantage of the Periodic System.
        </div>
    </li>

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">3. Operational Requirements</h3>
        <p class="text-gray-700 mb-4">
            Because the accounting records are not updated in real-time, strict physical procedures are required to maintain accuracy.
        </p>

        <div class="space-y-6">
            <div class="bg-slate-50 p-4 rounded-lg border-l-4 border-purple-400">
                <h5 class="font-bold text-slate-800 mb-2 flex items-center">
                    <i class="fas fa-clipboard-list mr-2 text-purple-500"></i> Requirement A: The Physical Count
                </h5>
                <ul class="list-disc pl-5 text-sm text-slate-700 space-y-2">
                    <li><strong>Mandatory Shutdown:</strong> Operations often must cease (or occur after hours) while counting happens to ensure no goods are moving in or out.</li>
                    <li><strong>Tagging System:</strong> Items are tagged as they are counted to prevent double-counting or missed items.</li>
                    <li><strong>Use of Teams:</strong> Usually done in two-person teams: one counts, the other records, to minimize error and fraud.</li>
                </ul>
            </div>

            <div class="bg-slate-50 p-4 rounded-lg border-l-4 border-teal-400">
                <h5 class="font-bold text-slate-800 mb-2 flex items-center">
                    <i class="fas fa-file-invoice-dollar mr-2 text-teal-500"></i> Requirement B: Cost Flow Assumptions
                </h5>
                <p class="text-sm text-slate-700 mb-2">
                    Once the physical count reveals <em>how many</em> units are left, the accountant must assign a dollar value to them.
                </p>
                <ul class="list-disc pl-5 text-sm text-slate-700 space-y-2">
                    <li><strong>FIFO (First-In, First-Out):</strong> Assumes the ending inventory consists of the most recently purchased units.</li>
                    <li><strong>Weighted Average:</strong> Calculates an average cost per unit based on Total Cost / Total Units Available.</li>
                </ul>
            </div>
        </div>
    </li>

</ul>
`,
            exercises: [{ type: "mcq", question: "COGS is determined when?", options: ["Daily", "End of Period", "Never", "Hourly"], correctIndex: 1, explanation: "Periodic system updates at period end." }]
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
        <h3 class="text-xl font-bold text-gray-800 mb-3">4. Limitations & Shrinkage</h3>
        <p class="text-gray-700 mb-4">
            If the system tracks everything perfectly, why do we still need to count the inventory physically?
        </p>
        <ul class="list-disc pl-5 space-y-2 text-gray-600">
            <li>
                <strong>The Discrepancy:</strong> The computer record (Perpetual record) shows what <em>should</em> be on the shelf. The physical count shows what <em>is actually</em> on the shelf.
            </li>
            <li>
                <strong>Shrinkage:</strong> The difference between the two is called shrinkage. It represents theft, spoilage, or administrative errors.
            </li>
            <li>
                <strong>The Adjustment:</strong> At the end of the year, if the physical count is lower than the computer record, an adjusting entry is made to lower the Inventory balance and increase COGS.
            </li>
        </ul>
        <div class="mt-4 bg-red-50 p-4 rounded-md text-sm text-red-800 border border-red-200">
            <strong>Formula:</strong> Book Value (Computer) - Physical Count = Shrinkage Expense.
        </div>
    </li>

</ul>`,
            exercises: [{ type: "mcq", question: "Records COGS at time of sale?", options: ["Periodic", "Perpetual", "Both", "Neither"], correctIndex: 1, explanation: "Perpetual tracks cost immediately." }]
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
            exercises: []
        },
        {
            day: "Day 5",
            topic: "Recorded Summary Quiz",
            content: `<h3 class="text-xl font-bold mb-4">Assessment Activity</h3><p>Video/Audio submission.</p>`,
            exercises: []
        }
    ]
};
