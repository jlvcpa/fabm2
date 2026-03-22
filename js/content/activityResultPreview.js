import React, { useState, useEffect, useMemo, useCallback } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import htm from 'https://esm.sh/htm';
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { Save, Printer } from 'https://esm.sh/lucide-react@0.263.1';
import { getLetterGrade, ActivityHelper } from './accountingCycle/utils.js';

import { qbMerchMultipleChoice } from "./questionBank/qbMerchMultipleChoice.js";
import { qbMerchProblemSolving } from "./questionBank/qbMerchProblemSolving.js";
import { qbMerchJournalizing } from "./questionBank/qbMerchJournalizing.js";

import { gradeIntegratedSce } from './activityHandlers/integratedSceHandler.js';

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

// Modular preview handlers
import { cleanAmt } from './previewHandlers/previewUtils.js';
import { evaluateMultipleChoice, renderMultipleChoicePreview } from './previewHandlers/multipleChoiceResultPreviewHandler.js';
import { evaluateProblemSolving, renderProblemSolvingPreview } from './previewHandlers/problemSolvingResultPreviewHandler.js';
import { evaluateJournalizing, renderJournalizingPreview } from './previewHandlers/journalizingResultPreviewHandler.js';
import { renderIntegratedScePreview } from './previewHandlers/integratedSceResultPreviewHandler.js';

// Modular Print Handler
import { handlePrint } from './printHandlers/printResultPreview.js';

const html = htm.bind(React.createElement);
const db = getFirestore();

const STEP_COMPONENTS = {
    1: Step01Analysis, 2: Step02Journalizing, 3: Step03Posting, 4: Step04TrialBalance,
    5: Step05Worksheet, 6: Step06FinancialStatements, 7: Step07AdjustingEntries,
    8: Step08ClosingEntries, 9: Step09PostClosingTB, 10: Step10ReversingEntries
};

const globalQuestionMap = new Map();
function buildQuestionMap() {
    if (globalQuestionMap.size > 0) return;
    const allSources = [qbMerchMultipleChoice, qbMerchProblemSolving, qbMerchJournalizing];
    allSources.forEach(sourceArray => {
        if(Array.isArray(sourceArray)) {
            sourceArray.forEach(item => {
                const id = Object.keys(item)[0];
                globalQuestionMap.set(id, { id, ...item[id] });
            });
        }
    });
}
buildQuestionMap();

const AccountingCycleResultView = ({ resultData, activityConfig, printMode, onPrint }) => {
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
                const adapted = adaptStaticDataToSimulator(qCopy);
                setSimData(adapted);
            }
        }
    }, [resultData]);

    if (!simData) return html`<div className="p-8 text-center text-gray-500">Loading scenario data...</div>`;

    return html`
        <div className="flex flex-col gap-12">
            ${activityConfig.tasks.map((task, idx) => {
                const stepId = idx + 1;
                const StepComponent = STEP_COMPONENTS[stepId];
                
                const studentAnswer = resultData[`answers.${stepId}`] || {};
                const scoreData = resultData[`scores.${stepId}`] || { score: 0, maxScore: 0 };
                const status = resultData[`stepStatus.${stepId}`] || {};
                
                if (!status.completed && (!studentAnswer || Object.keys(studentAnswer).length === 0)) return null;

                const letterGrade = getLetterGrade(scoreData.score, scoreData.maxScore);
                const rubricHtml = ActivityHelper.getRubricHTML(stepId, task.stepName);
                
                const sectionId = `step-${stepId}`;
                const hideInPrintClass = (printMode !== 'all' && printMode !== sectionId) ? 'hide-in-print' : '';

                return html`
                    <div key=${stepId} className="bg-white border rounded-lg shadow-sm overflow-hidden break-inside-avoid mb-8 ${hideInPrintClass}">
                        <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-bold">Step ${stepId}: ${task.stepName}</h3>
                                    <div className="text-xs text-slate-300">Attempts: ${status.attempts || 0}</div>
                                </div>
                                <button type="button" onClick=${() => onPrint(sectionId)} className="print:hidden p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-white flex items-center shadow-sm transition" title="Print this step only">
                                    <${Printer} size=${14}/> <span className="ml-1 text-xs">Print Part</span>
                                </button>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-yellow-400">
                                    ${scoreData.score} <span className="text-sm text-slate-400">/ ${scoreData.maxScore}</span>
                                </div>
                                <div className="text-xs font-bold px-2 py-0.5 bg-slate-600 rounded inline-block">
                                    ${letterGrade}
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="mb-6 flex flex-col gap-4">
                                ${task.instructions || task.description ? html`
                                    <div className="p-4 bg-indigo-50 text-sm text-indigo-900 rounded border border-indigo-100">
                                        <h4 className="font-bold mb-1">Instructions:</h4>
                                        <div dangerouslySetInnerHTML=${{ __html: task.instructions || task.description }}></div>
                                    </div>
                                ` : ''}
                                <div className="p-4 bg-blue-50 text-sm text-blue-900 rounded border border-blue-100">
                                    <h4 className="font-bold mb-1">Rubric:</h4>
                                    <div dangerouslySetInnerHTML=${{ __html: rubricHtml }}></div>
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded p-2 bg-gray-50">
                                <${StepComponent} 
                                    activityData=${simData} 
                                    transactions=${simData.transactions} 
                                    data=${studentAnswer} 
                                    onChange=${() => {}} 
                                    showFeedback=${true} 
                                    isReadOnly=${true} 
                                />
                            </div>
                        </div>
                    </div>
                `;
            })}
        </div>
    `;
};

const StandardQuizResultView = ({ resultData, activityConfig, onScoreUpdate, printMode, onPrint }) => {
    
    const getQuestionsTaken = () => {
        let qt = resultData.questionsTaken;
        if (!qt || Object.keys(qt).length === 0) {
            qt = {};
            const answers = resultData.answers || {};
            Object.keys(answers).forEach(k => {
                const parts = k.split('_');
                if (parts.length < 2) return;
                const sectionIdx = parseInt(parts[0].replace('s',''));
                const qKey = `${parts[0]}_${parts[1]}`;
                const sectionType = activityConfig.testQuestions[sectionIdx]?.type || 'Unknown';
                
                if (!qt[qKey]) {
                    qt[qKey] = {
                        uiId: qKey, type: sectionType,
                        questionText: "Legacy Question (Ref Unavailable)", correctAnswer: "N/A",
                        options: [], transactions: [], instructions: null
                    };
                }
                
                if (sectionType === 'Journalizing' && parts.length >= 4) {
                    const tIdx = parseInt(parts[2].replace('t',''));
                    const rIdx = parseInt(parts[3].replace('r',''));
                    if (!qt[qKey].transactions[tIdx]) qt[qKey].transactions[tIdx] = { date: `Trans ${tIdx+1}`, description: "Legacy", rows: 0 };
                    if (rIdx >= qt[qKey].transactions[tIdx].rows) qt[qKey].transactions[tIdx].rows = rIdx + 1;
                }
            });
        }
        return qt;
    };

    const questionsTaken = useMemo(() => getQuestionsTaken(), [resultData]);
    const [liveScores, setLiveScores] = useState({});
    const [integratedRenderData, setIntegratedRenderData] = useState({});
    const [journalizingRenderData, setJournalizingRenderData] = useState({});

    useEffect(() => {
        const newScores = {};
        const newRenderData = {};
        const newJournalizingData = {};
        
        activityConfig.testQuestions.forEach((section, idx) => {
            const sectionQs = Object.keys(questionsTaken)
                .filter(key => key.startsWith(`s${idx}_`))
                .map(key => ({ uiId: key, ...questionsTaken[key] }));

            let secScore = 0;
            let secMax = 0;

            sectionQs.forEach(q => {
                const studentAns = resultData.answers?.[q.uiId];
                const liveQ = (q.dbId && globalQuestionMap.has(q.dbId)) ? globalQuestionMap.get(q.dbId) : q;

                if (section.type === "Multiple Choice") {
                    const ev = evaluateMultipleChoice(liveQ, studentAns);
                    secMax += ev.maxScore;
                    secScore += ev.score;
                } 
                else if (section.type === "Problem Solving") {
                    const ev = evaluateProblemSolving(liveQ, studentAns);
                    secMax += ev.maxScore;
                    secScore += ev.score;
                }
                else if (section.type === "Journalizing") {
                    const ev = evaluateJournalizing(liveQ, studentAns, cleanAmt);
                    secMax += ev.secMax;
                    secScore += ev.secScore;
                    newJournalizingData[q.uiId] = ev.transEvals;
                }
                else if (section.type === "Journalizing and Preparing SCE (Corp)") {
                    const evalResult = gradeIntegratedSce(studentAns, liveQ);
                    secScore += evalResult.scores.score;
                    secMax += evalResult.scores.maxScore;
                    newRenderData[q.uiId] = evalResult;
                }
            });

            newScores[idx] = { 
                score: secScore, 
                maxScore: secMax, 
                letterGrade: getLetterGrade(secScore, secMax),
                percentage: secMax > 0 ? (secScore / secMax) * 100 : 0 
            };
        });

        setLiveScores(newScores);
        setIntegratedRenderData(newRenderData);
        setJournalizingRenderData(newJournalizingData);
        if (onScoreUpdate) onScoreUpdate(newScores);

    }, [resultData, questionsTaken]);

    return html`
        <div className="flex flex-col gap-8">
            ${activityConfig.testQuestions.map((section, idx) => {
                const live = liveScores[idx] || { score: 0, maxScore: 0, letterGrade: 'N/A' };
                const sectionQs = Object.keys(questionsTaken)
                    .filter(key => key.startsWith(`s${idx}_`))
                    .sort((a, b) => {
                        const aIdx = parseInt(a.split('_')[1].replace('q',''));
                        const bIdx = parseInt(b.split('_')[1].replace('q',''));
                        return aIdx - bIdx;
                    })
                    .map(key => ({ uiId: key, ...questionsTaken[key] }));

                const sectionId = `test-${idx}`;
                const hideInPrintClass = (printMode !== 'all' && printMode !== sectionId) ? 'hide-in-print' : '';

                return html`
                    <div key=${idx} className="bg-white border rounded-lg shadow-sm overflow-hidden mb-8 ${hideInPrintClass}">
                        <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold uppercase">Test ${idx + 1}: ${section.type}</h3>
                                <button type="button" onClick=${() => onPrint(sectionId)} className="print:hidden p-1.5 bg-blue-800 hover:bg-blue-700 rounded text-white flex items-center shadow-sm transition" title="Print this test only">
                                    <${Printer} size=${14}/> <span className="ml-1 text-xs">Print Part</span>
                                </button>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-bold text-yellow-300">${live.score} / ${live.maxScore}</span>
                                <span className="ml-2 text-xs bg-blue-800 px-2 py-1 rounded">${live.letterGrade}</span>
                            </div>
                        </div>

                        <div className="px-6 pt-6 flex flex-col gap-4">
                            ${section.instructions ? html`
                                <div className="p-4 bg-indigo-50 text-sm text-indigo-900 rounded border border-indigo-100">
                                    <h4 className="font-bold mb-1">Instructions:</h4>
                                    <div dangerouslySetInnerHTML=${{ __html: section.instructions }}></div>
                                </div>
                            ` : ''}
                            ${section.gradingRubrics ? html`
                                <div className="p-4 bg-blue-50 text-sm text-blue-900 rounded border border-blue-100">
                                    <h4 className="font-bold mb-1">Rubric:</h4>
                                    <div dangerouslySetInnerHTML=${{ __html: section.gradingRubrics }}></div>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div className="px-0 py-6 flex flex-col gap-6">
                            ${sectionQs.map((q, qIdx) => {
                                const studentAns = resultData.answers?.[q.uiId];
                                const liveQ = (q.dbId && globalQuestionMap.has(q.dbId)) ? globalQuestionMap.get(q.dbId) : q;

                                if (section.type === "Journalizing") {
                                    return renderJournalizingPreview(q, qIdx, liveQ, studentAns, journalizingRenderData[q.uiId] || []);
                                }
                                else if (section.type === "Journalizing and Preparing SCE (Corp)") {
                                    return renderIntegratedScePreview(q, qIdx, liveQ, studentAns, integratedRenderData[q.uiId]);
                                }
                                else if (section.type === "Multiple Choice") {
                                    return renderMultipleChoicePreview(q, qIdx, liveQ, studentAns);
                                }
                                else if (section.type === "Problem Solving") {
                                    return renderProblemSolvingPreview(q, qIdx, liveQ, studentAns);
                                }
                                return null;
                            })}
                        </div>
                    </div>
                `;
            })}
        </div>
    `;
};

const ResultDetailViewer = ({ currentUser, activityConfig, resultData, collectionName, docId }) => {
    const [pendingScores, setPendingScores] = useState(null);
    const [printMode, setPrintMode] = useState('all');

    const triggerPrint = (mode) => {
        handlePrint(mode, setPrintMode);
    };

    const handleSaveScores = async () => {
        if (!confirm("Overwrite the student's saved scores with these recalculated values?")) return;
        try {
            const ref = doc(db, collectionName, docId);
            await updateDoc(ref, { sectionScores: pendingScores });
            alert("Scores updated successfully!");
        } catch (e) {
            alert("Update failed: " + e.message);
        }
    };

    return html`
    <div className="max-w-5xl mx-auto">
        <div className="flex justify-end gap-2 mb-4 print:hidden">
            <button onClick=${() => triggerPrint('all')} className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded hover:bg-indigo-700 shadow flex items-center gap-2">
                <${Printer} size=${16}/> Print All Parts
            </button>
            ${currentUser.role === 'teacher' && activityConfig.type !== 'accounting_cycle' ? html`
                <button onClick=${handleSaveScores} className="px-4 py-2 bg-yellow-600 text-white text-sm font-bold rounded hover:bg-yellow-700 shadow flex items-center gap-2">
                    <${Save} size=${16}/> Update Scores
                </button>
            ` : ''}
        </div>

        ${(() => {
            const showHeaderInPrint = printMode === 'all' || printMode === 'step-1' || printMode === 'test-0';
            const headerHideClass = !showHeaderInPrint ? 'hide-in-print' : '';
            
            return html`
                <header className="text-center mb-4 pb-4 border-b-4 border-indigo-600 p-4 print:bg-white print:text-black print:border-none ${headerHideClass}">
                    <img src="./shs-adc-logo.png" onError=${(e) => { e.target.style.display='none'; }} alt="School Logo" className="mx-auto mb-2 h-20 w-auto"/>
                    <p className="text-sm mt-1">SY 2025-2026 | 2nd Semester</p>
                    <h1 className="text-3xl font-extrabold text-yellow-300 print:text-black">
                        ${activityConfig.activityname || resultData.activityName || activityConfig.title || 'Activity Results'}
                    </h1>
                </header>

                <div id="student-print-info" className="block mb-4 w-full ${headerHideClass}">
                    <div className="w-full mb-2 text-sm text-black font-bold font-mono border-b-2 border-black pb-2">
                        <div className="flex justify-between items-center">
                            <span className="text-left">CN: ${resultData.CN || resultData.classNumber || resultData.studentId || ''}</span>
                            <span className="text-right">Section: ${resultData.section || resultData.gradeSection || ''}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-left">Name: ${resultData.studentName || ''}</span>
                            <span className="text-right">Date: ${new Date(resultData.timestamp || resultData.lastUpdated).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            `;
        })()}

        ${(activityConfig.type === 'accounting_cycle' || activityConfig.tasks)
            ? html`<${AccountingCycleResultView} resultData=${resultData} activityConfig=${activityConfig} printMode=${printMode} onPrint=${triggerPrint} />`
            : html`<${StandardQuizResultView} 
                resultData=${resultData} 
                activityConfig=${activityConfig} 
                onScoreUpdate=${(scores) => setPendingScores(scores)} 
                printMode=${printMode} 
                onPrint=${triggerPrint} 
              />`
        }
    </div>
`;
};

export function renderStudentResultDetail(container, user, activityConfig, resultData, collectionName, docId) {
    if (!container._reactRoot) {
        container._reactRoot = createRoot(container);
    }
    container._reactRoot.render(html`
        <${ResultDetailViewer} 
            currentUser=${user} 
            activityConfig=${activityConfig} 
            resultData=${resultData} 
            collectionName=${collectionName} 
            docId=${docId} 
        />
    `);
}

export async function renderQuizResultPreview(activityData, user, resultData, db, collectionName, docId) {
    console.warn("Direct renderQuizResultPreview is deprecated. Use renderStudentResultDetail.");
}
