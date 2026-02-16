// --- js/content/activityResultPreview.js ---
import React, { useState, useEffect, useMemo } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import htm from 'https://esm.sh/htm';
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { Check, X, Save } from 'https://esm.sh/lucide-react@0.263.1';
import { getLetterGrade, ActivityHelper } from './accountingCycle/utils.js';

// --- IMPORTS FOR ACCOUNTING CYCLE ---
import Step01Analysis from './accountingCycle/steps/Step01Analysis.js';
import Step02Journalizing from './accountingCycle/steps/Step02Journalizing.js';
import Step03Posting from './accountingCycle/steps/Step03Posting.js';
import Step04TrialBalance from './accountingCycle/steps/Step04TrialBalance.js';
import Step05Worksheet from './accountingCycle/steps/Step05Worksheet.js';
import Step06FinancialStatements from './accountingCycle/steps/Step06FinancialStatements.js';
import Step07AdjustingEntries from './accountingCycle/steps/Step07AdjustingEntries.js';
import Step08ClosingEntries from './accountingCycle/steps/Step08ClosingEntries.js';
import Step09PostClosingTB from './accountingCycle/steps/Step09PostClosingTB.js';
import Step10ReversingEntries from './accountingCycle/steps/Step10ReversingEntries.js';

import { adaptStaticDataToSimulator } from './accountingCycleActivity.js';
import { merchTransactionsExamData } from './questionBank/qbMerchTransactions.js';

const html = htm.bind(React.createElement);
const db = getFirestore();

const STEP_COMPONENTS = {
    1: Step01Analysis, 2: Step02Journalizing, 3: Step03Posting, 4: Step04TrialBalance,
    5: Step05Worksheet, 6: Step06FinancialStatements, 7: Step07AdjustingEntries,
    8: Step08ClosingEntries, 9: Step09PostClosingTB, 10: Step10ReversingEntries
};

// --- COMPONENT: ACCOUNTING CYCLE VIEW ---
const AccountingCycleResultView = ({ resultData, activityConfig }) => {
    const [simData, setSimData] = useState(null);

    useEffect(() => {
        const qId = resultData.questionId;
        if (qId) {
            const rawQ = merchTransactionsExamData.find(q => q.id === qId);
            if (rawQ) {
                const dateTaken = new Date(resultData.lastUpdated || resultData.startedAt || resultData.timestamp || new Date());
                const year = dateTaken.getFullYear() || new Date().getFullYear();
                const qCopy = JSON.parse(JSON.stringify(rawQ));
                if (qCopy.transactions) qCopy.transactions.forEach(t => t.date = `${t.date}, ${year}`);
                setSimData(adaptStaticDataToSimulator(qCopy));
            }
        }
    }, [resultData]);

    if (!simData) return html`<div className="p-8 text-center text-gray-500">Loading scenario data...</div>`;

    return html`
        <div className="flex flex-col gap-8">
            ${activityConfig.tasks.map((task, idx) => {
                const stepId = idx + 1;
                const StepComponent = STEP_COMPONENTS[stepId];
                const studentAnswer = resultData[`answers.${stepId}`] || {};
                const scoreData = resultData[`scores.${stepId}`] || { score: 0, maxScore: 0 };
                const status = resultData[`stepStatus.${stepId}`] || {};
                
                if (!status.completed && (!studentAnswer || Object.keys(studentAnswer).length === 0)) return null;

                return html`
                    <div key=${stepId} className="bg-white border rounded shadow-sm overflow-hidden">
                        <div className="bg-slate-800 text-white p-3 flex justify-between items-center">
                            <h3 className="font-bold text-sm">Step ${stepId}: ${task.stepName}</h3>
                            <div className="text-right font-bold text-yellow-400">${scoreData.score} / ${scoreData.maxScore}</div>
                        </div>
                        <div className="p-4 bg-gray-50">
                            <${StepComponent} activityData=${simData} transactions=${simData.transactions} data=${studentAnswer} showFeedback=${true} isReadOnly=${true} />
                        </div>
                    </div>
                `;
            })}
        </div>
    `;
};

// --- COMPONENT: STANDARD QUIZ VIEW ---
const StandardQuizResultView = ({ resultData, activityConfig }) => {
    // ... [Logic for MCQ/Problem/Journalizing remains same as your provided version] ...
    // Note: Ensure it uses resultData['answers.X'] logic for keys
    return html`<div className="p-4 bg-white border rounded">Standard Quiz Preview Logic (Placeholder)</div>`;
};

// --- THE MAIN EXPORTED VIEWER ---
const ResultDetailViewer = ({ resultData, activityConfig, currentUser, collectionName, docId }) => {
    const [pendingScores, setPendingScores] = useState(null);

    const handleSaveScores = async () => {
        if (!confirm("Overwrite scores?")) return;
        try {
            await updateDoc(doc(db, collectionName, docId), { sectionScores: pendingScores });
            alert("Updated!");
        } catch (e) { alert(e.message); }
    };

    return html`
        <div className="max-w-5xl mx-auto py-4">
            <div className="bg-white rounded border-l-4 border-blue-600 p-4 mb-6 shadow-sm flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">${resultData.studentName}</h2>
                    <p className="text-xs text-gray-500">ID: ${resultData.studentId} | Submitted: ${new Date(resultData.timestamp).toLocaleString()}</p>
                </div>
                ${currentUser.role === 'teacher' && activityConfig.type !== 'accounting_cycle' && html`
                    <button onClick=${handleSaveScores} className="px-3 py-1.5 bg-yellow-600 text-white text-xs font-bold rounded shadow flex items-center gap-2 hover:bg-yellow-700">
                        <${Save} size=${14}/> Update Scores
                    </button>
                `}
            </div>

            ${(activityConfig.type === 'accounting_cycle' || activityConfig.tasks)
                ? html`<${AccountingCycleResultView} resultData=${resultData} activityConfig=${activityConfig} />`
                : html`<${StandardQuizResultView} resultData=${resultData} activityConfig=${activityConfig} onScoreUpdate=${setPendingScores} />`
            }
        </div>
    `;
};

export function renderStudentResultDetail(container, currentUser, activityConfig, resultData, collectionName, docId) {
    if (!container._reactRoot) container._reactRoot = createRoot(container);
    container._reactRoot.render(html`
        <${ResultDetailViewer} 
            resultData=${resultData} 
            activityConfig=${activityConfig} 
            currentUser=${currentUser}
            collectionName=${collectionName}
            docId=${docId}
        />
    `);
}
