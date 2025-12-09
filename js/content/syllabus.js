import { createPlaceholderDays } from '../utils.js';
// FIXED: Use curly braces for named import
import { unit2Data } from './unit2-merchandising.js'; 

export const courseData = {
    outline: {
        title: "Course Syllabus",
        summary: `
            <div class="max-w-4xl mx-auto space-y-8 fade-in">
                <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h3 class="text-2xl font-bold text-blue-900 mb-4">Course Description</h3>
                    <p class="text-gray-600 leading-relaxed">The course deals with the preparation and analysis of financial statements of a merchandising business and practice of simple taxation. It introduces the nature of accounting for corporations, focusing on the basic structure of equity and shareholder transactions. It also covers the principles of taxation and the preparation of basic income tax returns for individuals and corporations.</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                        <h4 class="font-bold text-blue-900 mb-2">Grading System</h4>
                        <ul class="space-y-2 text-sm text-blue-800">
                            <li class="flex justify-between"><span>Written Work</span> <span class="font-bold">30%</span></li>
                            <li class="flex justify-between"><span>Performance Tasks</span> <span class="font-bold">50%</span></li>
                            <li class="flex justify-between"><span>Term Exams</span> <span class="font-bold">20%</span></li>
                        </ul>
                    </div>
                    <div class="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-600">
                        <h4 class="font-bold text-emerald-900 mb-2">Core Competencies</h4>
                        <ul class="list-disc list-inside text-sm text-emerald-800 space-y-1">
                            <li>Merchandising Accounting Cycle</li>
                            <li>Statement of Comprehensive Income</li>
                            <li>Corporate Equity & Dividends</li>
                            <li>Income Tax Returns (1701/1702)</li>
                        </ul>
                    </div>
                </div>
            </div>
        `,
        full: `
            <div class="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 fade-in prose prose-blue max-w-none">
                <h2 class="text-2xl font-bold text-slate-800 mb-4">Fundamentals of Accountancy, Business, and Management 2 (FABM 2)</h2>
                <p><strong>Grade Level:</strong> 12 | <strong>Strand:</strong> ABM | <strong>Prerequisite:</strong> FABM 1</p>
                
                <hr class="my-6">

                <h3 class="text-xl font-bold text-slate-700 mt-6 mb-3">I. Course Description</h3>
                <p class="text-gray-600">The course deals with the preparation and analysis of financial statements of a merchandising business and practice of simple taxation. It introduces the nature of accounting for corporations, focusing on the basic structure of equity and shareholder transactions. It also covers the principles of taxation and the preparation of basic income tax returns for individuals and corporations.</p>

                <h3 class="text-xl font-bold text-slate-700 mt-8 mb-3">II. Course Learning Objectives</h3>
                <ul class="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Complete the accounting cycle for a service and merchandising business.</li>
                    <li>Prepare and analyze the Statement of Comprehensive Income for a merchandising business.</li>
                    <li>Understand the unique features of a Corporation and record basic equity transactions.</li>
                    <li>Comprehend the principles of taxation and prepare basic Income Tax Returns (BIR Forms 1701 and 1702).</li>
                </ul>

                <h3 class="text-xl font-bold text-slate-700 mt-8 mb-3">III. Detailed Learning Plan</h3>
                <p class="italic text-gray-500">Refer to the weekly modules in the sidebar for daily breakdown.</p>
            </div>
        `
    },
    terms: [
        {
            title: "Term 1 (Midterm)",
            units: [
                {
                    id: "u1",
                    title: "Unit 1: Review of Accounting Cycle",
                    weeks: [
                        {
                            id: "u1w1",
                            title: "Week 1: Service Business Review",
                            days: createPlaceholderDays([
                                "The 10 Steps of Accounting Cycle",
                                "Journalizing Transactions",
                                "Posting & Trial Balance",
                                "Adjusting Entries & Financial Statements"
                            ])
                        }
                    ]
                },
                {
                    id: "u2",
                    title: "Unit 2: Merchandising Business",
                    weeks: [
                        { 
                            id: "u2w1", 
                            title: "Week 1: Intro to Merchandising", 
                            days: unit2Data.week1 
                        },
                        {
                            id: "u2w2",
                            title: "Week 2: Purchases & Accounts",
                            days: createPlaceholderDays([
                                "Recording Purchases",
                                "Purchase Discounts (2/10, n/30)",
                                "Purchase Returns and Allowances",
                                "Freight-In (FOB Destination/Shipping)"
                            ])
                        },
                        { 
                            id: "u2w3", title: "Week 3: Sales Transactions", 
                            days: createPlaceholderDays(["Recording Sales", "Sales Discounts", "Sales Returns & Allowances", "Net Sales Calculation"]) 
                        },
                        { 
                            id: "u2w4", title: "Week 4: COGS & Gross Profit", 
                            days: createPlaceholderDays(["COGS Formula", "Beginning/Ending Inventory", "Gross Profit Calculation", "Shrinkage Adjustments"]) 
                        },
                        { 
                            id: "u2w5", title: "Week 5: Operating Expenses", 
                            days: createPlaceholderDays(["Selling Expenses", "Administrative Expenses", "Freight-Out", "Opex vs COGS"]) 
                        },
                        { 
                            id: "u2w6", title: "Week 6: Income Statement", 
                            days: createPlaceholderDays(["Single-step Format", "Multi-step Format Structure", "Analyzing Margins", "Statement Preparation"]) 
                        },
                        { 
                            id: "u2w7", title: "Week 7: Performance Task", 
                            days: createPlaceholderDays(["Case Study Intro", "Transaction Recording", "Financial Statement Gen", "Final Review"]) 
                        }
                    ]
                }
            ]
        },
        {
            title: "Term 2 (Final Term)",
            units: [
                {
                    id: "u3",
                    title: "Unit 3: Corporation Accounting",
                    weeks: [
                        {
                            id: "u3w8",
                            title: "Week 8: Intro to Corps & Equity",
                            days: createPlaceholderDays([
                                "Nature of Corporations",
                                "Classes of Shares (Common/Preferred)",
                                "Par vs No-Par Value",
                                "Issuance of Share Capital"
                            ])
                        },
                        { 
                            id: "u3w9", title: "Week 9: Dividends & RE", 
                            days: createPlaceholderDays(["Dividend Dates", "Cash Dividends", "Stock Dividends", "Retained Earnings"]) 
                        },
                        { 
                            id: "u3w10", title: "Week 10: Formation & Legal", 
                            days: createPlaceholderDays(["Incorporation Process", "Articles of Incorporation", "By-Laws", "SEC Requirements"]) 
                        },
                        { 
                            id: "u3w11", title: "Week 11: Early Operations", 
                            days: createPlaceholderDays(["Initial Contributions", "Corporate Books", "Equity Section Presentation", "Statement of Changes in Equity"]) 
                        }
                    ]
                },
                {
                    id: "u4",
                    title: "Unit 4: Income Taxation",
                    weeks: [
                        { 
                            id: "u4w12", title: "Week 12: Foundations of Tax", 
                            days: createPlaceholderDays(["Purpose of Taxation", "Principles of Sound Tax System", "Direct vs Indirect Taxes", "Taxpayer Classification"]) 
                        },
                        {
                            id: "u4w13",
                            title: "Week 13: Computation & Compliance",
                            days: createPlaceholderDays([
                                "Gross Income & Exclusions",
                                "Allowable Deductions",
                                "Individual Tax Computation",
                                "Corporate Tax Overview"
                            ])
                        },
                        { 
                            id: "u4w14", title: "Week 14: Tax Returns (Forms)", 
                            days: createPlaceholderDays(["BIR Forms Overview", "Form 1701 Walkthrough", "Form 1702 Walkthrough", "Filing & Payment Deadlines"]) 
                        }
                    ]
                }
            ]
        }
    ]
};
