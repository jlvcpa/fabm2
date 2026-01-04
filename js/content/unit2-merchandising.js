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
                    <p class="text-blue-800">Students understand why inventory systems are critical in merchandising operations.</p>
                </div>
                <h3 class="text-xl font-bold mb-4">Topic Focus</h3>
                <ul class="list-none space-y-8 mb-6">
    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">1. Definition: The Business of "Buying and Selling"</h3>
        <p class="text-gray-700 mb-4">
            <strong>Merchandising businesses buy and sell goods without changing their form.</strong> Unlike manufacturers who create products or service providers who offer skills, merchandisers operate on <em>arbitrage</em>—buying finished goods and reselling them at a higher price to add value through distribution and accessibility.
        </p>
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
            <li><strong>Revenue Generation:</strong> You cannot sell what you do not have. Stockouts lead to lost customers.</li>
            <li><strong>Carrying Costs:</strong> Inventory is expensive to hold due to storage rent, insurance, and the risk of obsolescence or theft (shrinkage).</li>
            <li><strong>The Goal:</strong> Sell inventory as quickly as possible without running out.</li>
        </ul>
    </li>

    <li class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-3">4. The Operating Cycle</h3>
        <p class="text-gray-700 mb-4">
            <strong>Flow: Purchase &rarr; Storage &rarr; Sale.</strong> This cycle is longer for merchandisers than service providers because cash is tied up in inventory.
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
                    <text x="0" y="-10" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="white">Sell on</text>
                    <text x="0" y="10" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="white">Credit</text>
                </g>
                <line x1="390" y1="130" x2="510" y2="170" stroke="#555" stroke-width="2" marker-end="url(#arrowhead)"/>
                <line x1="510" y1="230" x2="390" y2="270" stroke="#555" stroke-width="2" marker-end="url(#arrowhead)"/>
                <line x1="310" y1="270" x2="190" y2="230" stroke="#555" stroke-width="2" marker-end="url(#arrowhead)"/>
                <line x1="190" y1="170" x2="310" y2="130" stroke="#555" stroke-width="2" marker-end="url(#arrowhead)"/>
                <text x="490" y="140" font-family="Arial" font-size="12" fill="#666">Accounts Payable</text>
                <text x="200" y="140" font-family="Arial" font-size="12" fill="#666">Collections</text>
            </svg>
        </div>
        <p class="text-sm text-gray-500 mt-2 italic">
            <strong>Step 1:</strong> Buy Inventory &rarr; <strong>Step 2:</strong> Hold/Display Inventory &rarr; <strong>Step 3:</strong> Sell for Cash or Credit.
        </p>
    </li>
</ul>   
            `,
            exercises: [{ type: "mcq", question: "Primary source of revenue?", options: ["Service Fees", "Sales", "Interest", "Rent"], correctIndex: 1, explanation: "Merchandising = Sales of goods." }]
        },
        {
            day: "Day 2",
            topic: "The Periodic Inventory System",
            content: `<h3 class="text-xl font-bold mb-4">Topic Focus</h3><p>Mechanisms of periodic updates and physical counts.</p>`,
            exercises: [{ type: "mcq", question: "COGS is determined when?", options: ["Daily", "End of Period", "Never", "Hourly"], correctIndex: 1, explanation: "Periodic system updates at period end." }]
        },
        {
            day: "Day 3",
            topic: "The Perpetual Inventory System",
            content: `<h3 class="text-xl font-bold mb-4">Topic Focus</h3><p>Continuous updates and real-time tracking.</p>`,
            exercises: [{ type: "mcq", question: "Records COGS at time of sale?", options: ["Periodic", "Perpetual", "Both", "Neither"], correctIndex: 1, explanation: "Perpetual tracks cost immediately." }]
        },
        {
            day: "Day 4",
            topic: "Comparison & Applications",
            content: `<h3 class="text-xl font-bold mb-4">Topic Focus</h3><p>Choosing the right system for business size/type.</p>`,
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
