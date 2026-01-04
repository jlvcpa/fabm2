// Content for Unit 2: Merchandising Business
// FIXED: We use 'export const' to create a named export.

export const unit2Data = {
    week1: [
        {
            day: "Day 1",
            topic: "Foundations of Merchandising",
            content:
                <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p class="font-bold text-blue-900">Learning Goal</p>
                    <p class="text-blue-800">Students understand why inventory systems are critical in merchandising operations.</p>
                </div>
                <h3 class="text-xl font-bold mb-4">Topic Focus</h3>
                <ul class="list-disc pl-5 space-y-2 mb-6">
                    <li><strong>Definition:</strong> Merchandising businesses buy and sell goods without changing their form.</li>
                    <li><strong>Comparison:</strong> Service (sells time/skills) vs. Merchandising (sells tangible goods).</li>
                    <li><strong>Inventory:</strong> The lifeblood of merchandising; the primary asset for generating revenue.</li>
                    <li><strong>Flow:</strong> Purchase &rarr; Storage &rarr; Sale</li>
                </ul>`
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
