// --- js/content/activityResultPreview.js ---

import React, { useState, useEffect, useMemo, useCallback } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import htm from 'https://esm.sh/htm';
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { Check, X, Save } from 'https://esm.sh/lucide-react@0.263.1';
import { getLetterGrade, ActivityHelper } from './accountingCycle/utils.js';

// --- IMPORTS FOR STANDARD QUIZZES ---
import { qbMerchMultipleChoice } from "./questionBank/qbMerchMultipleChoice.js";
import { qbMerchProblemSolving } from "./questionBank/qbMerchProblemSolving.js";
import { qbMerchJournalizing } from "./questionBank/qbMerchJournalizing.js";

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

// Map Steps to Components
const STEP_COMPONENTS = {
    1: Step01Analysis, 2: Step02Journalizing, 3: Step03Posting, 4: Step04TrialBalance,
    5: Step05Worksheet, 6: Step06FinancialStatements, 7: Step07AdjustingEntries,
    8: Step08ClosingEntries, 9: Step09PostClosingTB, 10: Step10ReversingEntries
};

// --- GLOBAL QUESTION MAP ---
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

// -------------------------------------------------------------------------
// COMPONENT 1: ACCOUNTING CYCLE RESULT
// -------------------------------------------------------------------------
const AccountingCycleResultView = ({ resultData, activityConfig }) => {
    const [simData, setSimData] = useState(null);

    useEffect(() => {
        const qId = resultData.questionId;
        if (qId) {
            const rawQ = merchTransactionsExamData.find(q => q.id === qId);
            if (rawQ) {
                // Use lastUpdated or startedAt if timestamp is missing
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
                
                // Accessing flat keys "answers.1", "scores.1", etc.
                const studentAnswer = resultData[`answers.${stepId}`] || {};
                const scoreData = resultData[`scores.${stepId}`] || { score: 0, maxScore: 0 };
                const status = resultData[`stepStatus.${stepId}`] || {};
                
                if (!status.completed && (!studentAnswer || Object.keys(studentAnswer).length === 0)) return null;

                const letterGrade = getLetterGrade(scoreData.score, scoreData.maxScore);
                const rubricHtml = ActivityHelper.getRubricHTML(stepId, task.stepName);

                return html`
                    <div key=${stepId} className="bg-white border rounded-lg shadow-sm overflow-hidden break-inside-avoid">
                        <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold">Step ${stepId}: ${task.stepName}</h3>
                                <div className="text-xs text-slate-300">Attempts: ${status.attempts || 0}</div>
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
                            <div className="mb-6 p-4 bg-blue-50 text-sm text-blue-900 rounded border border-blue-100" 
                                 dangerouslySetInnerHTML=${{ __html: rubricHtml }}></div>
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

// -------------------------------------------------------------------------
// COMPONENT 2: STANDARD QUIZ RESULT
// -------------------------------------------------------------------------
const StandardQuizResultView = ({ resultData, activityConfig, onScoreUpdate }) => {
    
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

    // --- RE-CALCULATE SCORES LIVE ---
    useEffect(() => {
        const newScores = {};
        
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
                    secMax++;
                    const correctKey = (liveQ.answer !== undefined) ? liveQ.answer : liveQ.correctAnswer;
                    if (String(studentAns) === String(correctKey)) secScore++;
                } 
                else if (section.type === "Problem Solving") {
                    secMax++;
                    if (studentAns && liveQ.correctAnswer && studentAns.trim().toLowerCase() === liveQ.correctAnswer.trim().toLowerCase()) secScore++;
                }
                else if (section.type === "Journalizing") {
                    const transactions = liveQ.transactions || [];
                    transactions.forEach((trans, tIdx) => {
                        const solRows = trans.solution || [];
                        const rowCount = trans.rows || 2;
                        
                        for(let r=0; r<rowCount; r++) {
                            const cellKey = `t${tIdx}_r${r}`;
                            const cellData = (studentAns && studentAns[cellKey]) ? studentAns[cellKey] : { date:'', acct:'', dr:'', cr:'' };
                            const solRow = solRows[r] || null;
                            const sDate = (cellData.date || '').trim();
                            const sAcct = (cellData.acct || '');
                            const sDr = (cellData.dr || '').trim();
                            const sCr = (cellData.cr || '').trim();

                            // 1. DATE
                            if (solRow && !solRow.isExplanation && (solRow.date || r === 0)) {
                                secMax++;
                                if (r === 0) {
                                    const expectedRegex = (tIdx === 0) ? /^[A-Z][a-z]{2}\s\d{1,2}$/ : /^\d{1,2}$/;
                                    let isDateCorrect = false;
                                    if (tIdx === 0) isDateCorrect = (sDate === solRow.date);
                                    else {
                                        const parts = solRow.date ? solRow.date.split(' ') : [];
                                        isDateCorrect = (sDate === parts[parts.length - 1]);
                                    }
                                    if (sDate.match(expectedRegex) && isDateCorrect) secScore++;
                                } else {
                                    if (sDate === '') secScore++;
                                }
                            } else if (sDate !== '') {
                                secScore--; // Penalty
                            }

                            // 2. ACCOUNT
                            if (solRow) {
                                secMax++;
                                if (solRow.isExplanation) {
                                    if (sAcct.match(/^\s{5,8}\S/)) secScore++;
                                } else {
                                    const cleanInput = sAcct.trim().toLowerCase();
                                    const cleanSol = (solRow.account || '').trim().toLowerCase();
                                    if (cleanInput === cleanSol && cleanSol !== '') {
                                        if (solRow.credit) {
                                            if (sAcct.match(/^\s{3,5}\S/)) secScore++;
                                        } else {
                                            if (sAcct.match(/^\S/)) secScore++;
                                        }
                                    }
                                }
                            }

                            // 3. DEBIT
                            if (solRow && !solRow.isExplanation && solRow.debit) {
                                secMax++;
                                const fmtSol = Number(solRow.debit).toFixed(2);
                                if (sDr === fmtSol) secScore++;
                            } else if (sDr !== '') { secScore--; }

                            // 4. CREDIT
                            if (solRow && !solRow.isExplanation && solRow.credit) {
                                secMax++;
                                const fmtSol = Number(solRow.credit).toFixed(2);
                                if (sCr === fmtSol) secScore++;
                            } else if (sCr !== '') { secScore--; }
                        }
                    });
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

                return html`
                    <div key=${idx} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
                            <h3 className="font-bold uppercase">Test ${idx + 1}: ${section.type}</h3>
                            <div className="text-right">
                                <span className="text-xl font-bold text-yellow-300">${live.score} / ${live.maxScore}</span>
                                <span className="ml-2 text-xs bg-blue-800 px-2 py-1 rounded">${live.letterGrade}</span>
                            </div>
                        </div>
                        
                        <div className="p-6 flex flex-col gap-6">
                            ${sectionQs.map((q, qIdx) => {
                                const studentAns = resultData.answers?.[q.uiId];
                                const liveQ = (q.dbId && globalQuestionMap.has(q.dbId)) ? globalQuestionMap.get(q.dbId) : q;

                                if (section.type === "Journalizing") {
                                    return html`
                                        <div key=${q.uiId} className="border rounded p-4 bg-white">
                                            <div className="font-bold text-gray-800 mb-2">Question ${qIdx + 1}</div>
                                            <div className="text-sm italic text-gray-600 mb-4 bg-blue-50 p-2 rounded">${liveQ.question || "Journalize the following transactions."}</div>
                                            
                                            ${(liveQ.transactions || []).map((trans, tIdx) => {
                                                const solRows = trans.solution || [];
                                                const rowCount = trans.rows || 2;
                                                const rows = [];
                                                
                                                for(let r=0; r<rowCount; r++) {
                                                    const cellKey = `t${tIdx}_r${r}`;
                                                    const cellData = (studentAns && studentAns[cellKey]) ? studentAns[cellKey] : { date:'', acct:'', dr:'', cr:'' };
                                                    const solRow = solRows[r] || null;
                                                    
                                                    const sDate = (cellData.date || '').trim();
                                                    const sAcct = (cellData.acct || '');
                                                    const sDr = (cellData.dr || '').trim();
                                                    const sCr = (cellData.cr || '').trim();

                                                    // --- VISUAL FEEDBACK LOGIC ---
                                                    let dateCorrect = false;
                                                    let acctCorrect = false;
                                                    let drCorrect = false;
                                                    let crCorrect = false;

                                                    // Date
                                                    if (solRow && !solRow.isExplanation && (solRow.date || r === 0)) {
                                                        if (r === 0) {
                                                            const expectedRegex = (tIdx === 0) ? /^[A-Z][a-z]{2}\s\d{1,2}$/ : /^\d{1,2}$/;
                                                            let isDateMatched = false;
                                                            if (tIdx === 0) isDateMatched = (sDate === solRow.date);
                                                            else {
                                                                const parts = solRow.date ? solRow.date.split(' ') : [];
                                                                isDateMatched = (sDate === parts[parts.length - 1]);
                                                            }
                                                            dateCorrect = sDate.match(expectedRegex) && isDateMatched;
                                                        } else {
                                                            dateCorrect = (sDate === '');
                                                        }
                                                    } else {
                                                        dateCorrect = (sDate === '');
                                                    }

                                                    // Account
                                                    if (solRow) {
                                                        if (solRow.isExplanation) {
                                                            acctCorrect = !!sAcct.match(/^\s{5,8}\S/);
                                                        } else {
                                                            const cleanInput = sAcct.trim().toLowerCase();
                                                            const cleanSol = (solRow.account || '').trim().toLowerCase();
                                                            if (cleanInput === cleanSol && cleanSol !== '') {
                                                                if (solRow.credit) acctCorrect = !!sAcct.match(/^\s{3,5}\S/);
                                                                else acctCorrect = !!sAcct.match(/^\S/);
                                                            }
                                                        }
                                                    } else {
                                                        acctCorrect = (sAcct === '');
                                                    }

                                                    // Debit
                                                    if (solRow && !solRow.isExplanation && solRow.debit) {
                                                        drCorrect = (sDr === Number(solRow.debit).toFixed(2));
                                                    } else {
                                                        drCorrect = (sDr === '');
                                                    }

                                                    // Credit
                                                    if (solRow && !solRow.isExplanation && solRow.credit) {
                                                        crCorrect = (sCr === Number(solRow.credit).toFixed(2));
                                                    } else {
                                                        crCorrect = (sCr === '');
                                                    }

                                                    // Render Helper Function
                                                    const renderCell = (val, isCorrect, isExpected) => {
                                                        if (isCorrect) {
                                                            if (!val) return ''; // Safely blank
                                                            return html`<span className="text-green-700 font-bold">${val} <${Check} size=${14} className="inline align-text-bottom ml-1"/></span>`;
                                                        } else {
                                                            if (!val && !isExpected) return '';
                                                            return html`<span className="text-red-600 font-bold">${val || ''} <${X} size=${14} className="inline align-text-bottom ml-1"/></span>`;
                                                        }
                                                    };

                                                    const expDate = solRow && !solRow.isExplanation && (solRow.date || r === 0);
                                                    const expAcct = !!solRow;
                                                    const expDr = solRow && !solRow.isExplanation && solRow.debit;
                                                    const expCr = solRow && !solRow.isExplanation && solRow.credit;

                                                    rows.push({ 
                                                        dateHtml: renderCell(cellData.date, dateCorrect, expDate),
                                                        acctHtml: renderCell(cellData.acct, acctCorrect, expAcct),
                                                        drHtml: renderCell(cellData.dr, drCorrect, expDr),
                                                        crHtml: renderCell(cellData.cr, crCorrect, expCr),
                                                        solRow 
                                                    });
                                                }

                                                return html`
                                                    <div key=${tIdx} className="mb-4 border border-gray-300 rounded overflow-hidden">
                                                        <div className="bg-gray-100 px-3 py-2 text-sm font-bold border-b border-gray-300">
                                                            Transaction ${tIdx+1}: <span className="font-normal text-gray-600">${trans.date} - ${trans.description}</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 text-xs">
                                                            <div className="border-r border-gray-300">
                                                                <div className="bg-blue-100 p-1 font-bold text-center text-blue-900 border-b border-blue-200">Your Answer</div>
                                                                <table className="w-full">
                                                                    ${rows.map((row, r) => html`
                                                                        <tr key=${r} className="border-b border-gray-100">
                                                                            <td className="p-1 w-12 text-center border-r font-mono">${row.dateHtml}</td>
                                                                            <td className="p-1 border-r font-mono whitespace-pre">${row.acctHtml}</td>
                                                                            <td className="p-1 w-16 text-right border-r font-mono">${row.drHtml}</td>
                                                                            <td className="p-1 w-16 text-right font-mono">${row.crHtml}</td>
                                                                        </tr>
                                                                    `)}
                                                                </table>
                                                            </div>
                                                            <div>
                                                                <div className="bg-green-100 p-1 font-bold text-center text-green-900 border-b border-green-200">Solution</div>
                                                                <table className="w-full">
                                                                    ${rows.map((row, r) => {
                                                                        const sol = row.solRow || { account: '', debit: '', credit: '' };
                                                                        const indent = sol.credit ? '   ' : (sol.isExplanation ? '     ' : '');
                                                                        
                                                                        // NEW FIX: Match the displayed solution date to validation expectations
                                                                        let displaySolDate = sol.date || '';
                                                                        if (displaySolDate && tIdx > 0 && r === 0) {
                                                                            const parts = displaySolDate.split(' ');
                                                                            displaySolDate = parts[parts.length - 1]; // Grabs just the day part
                                                                        }

                                                                        return html`
                                                                            <tr key=${r} className="border-b border-gray-100 bg-green-50/30">
                                                                                <td className="p-1 w-12 text-center border-r font-mono text-gray-500">${displaySolDate}</td>
                                                                                <td className="p-1 border-r font-mono whitespace-pre text-gray-700 font-bold">${indent}${sol.account || ''}</td>
                                                                                <td className="p-1 w-16 text-right border-r font-mono text-gray-700">${sol.debit || ''}</td>
                                                                                <td className="p-1 w-16 text-right font-mono text-gray-700">${sol.credit || ''}</td>
                                                                            </tr>
                                                                        `;
                                                                    })}
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            })}
                                        </div>
                                    `;
                                }

                                else if (section.type === "Multiple Choice") {
                                    const correctKey = (liveQ.answer !== undefined) ? liveQ.answer : liveQ.correctAnswer;
                                    return html`
                                        <div key=${q.uiId} className="border rounded p-4 bg-white">
                                            <div className="font-bold text-gray-800 mb-2">${qIdx + 1}. ${liveQ.question}</div>
                                            <div className="flex flex-col gap-1">
                                                ${(liveQ.options || []).map((opt, oIdx) => {
                                                    const isSelected = String(studentAns) === String(oIdx);
                                                    const isOptCorrect = String(correctKey) === String(oIdx);
                                                    let style = "border-gray-200";
                                                    let icon = null;
                                                    if (isSelected && isOptCorrect) { style = "bg-green-100 border-green-500 text-green-900 font-bold"; icon = html`<${Check} size=${16} className="text-green-700"/>`; }
                                                    else if (isSelected && !isOptCorrect) { style = "bg-red-100 border-red-500 text-red-900"; icon = html`<${X} size=${16} className="text-red-700"/>`; }
                                                    else if (!isSelected && isOptCorrect) { style = "bg-green-50 border-green-300 border-dashed text-green-800"; icon = html`<${Check} size=${16} className="text-green-700 opacity-50"/>`; }
                                                    return html`<div className=${`p-2 border rounded text-sm flex justify-between items-center ${style}`}>${opt} ${icon}</div>`;
                                                })}
                                            </div>
                                        </div>
                                    `;
                                }

                                else if (section.type === "Problem Solving") {
                                    const isCorrect = studentAns && liveQ.correctAnswer && studentAns.trim().toLowerCase() === liveQ.correctAnswer.trim().toLowerCase();
                                    return html`
                                        <div key=${q.uiId} className="border rounded p-4 bg-white">
                                            <div className="font-bold text-gray-800 mb-2">${qIdx + 1}. ${liveQ.question}</div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className=${`p-3 rounded border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                                    <div className="text-xs font-bold mb-1 text-gray-500">Student Answer</div>
                                                    <div className="font-mono text-sm whitespace-pre-wrap">${studentAns || '(No Answer)'}</div>
                                                </div>
                                                <div className="p-3 rounded border bg-gray-50 border-gray-200">
                                                    <div className="text-xs font-bold mb-1 text-gray-500">Correct Answer</div>
                                                    <div className="font-mono text-sm whitespace-pre-wrap">${liveQ.correctAnswer}</div>
                                                </div>
                                            </div>
                                        </div>
                                    `;
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

// -------------------------------------------------------------------------
// COMPONENT 3: THE MAIN VIEWER (NO DASHBOARD LOGIC)
// -------------------------------------------------------------------------
const ResultDetailViewer = ({ currentUser, activityConfig, resultData, collectionName, docId }) => {
    const [pendingScores, setPendingScores] = useState(null);

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
        <div className="bg-white rounded-lg shadow p-4 mb-4 border-l-4 border-blue-600 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-0">${resultData.studentName}</h2>
                <div className="flex gap-4 text-xs text-gray-600">
                    <span>ID: <strong>${resultData.studentId}</strong></span>
                    <span>Submitted: <strong>${new Date(resultData.timestamp || resultData.lastUpdated).toLocaleString()}</strong></span>
                </div>
            </div>
            ${currentUser.role === 'teacher' && activityConfig.type !== 'accounting_cycle' && html`
                <button onClick=${handleSaveScores} className="px-4 py-2 bg-yellow-600 text-white text-sm font-bold rounded hover:bg-yellow-700 shadow flex items-center gap-2">
                    <${Save} size=${16}/> Update Scores
                </button>
            `}
        </div>

        ${(activityConfig.type === 'accounting_cycle' || activityConfig.tasks)
            ? html`<${AccountingCycleResultView} resultData=${resultData} activityConfig=${activityConfig} />`
            : html`<${StandardQuizResultView} 
                resultData=${resultData} 
                activityConfig=${activityConfig} 
                onScoreUpdate=${(scores) => setPendingScores(scores)} 
              />`
        }
    </div>
`;
};

// --- EXPORTED RENDERER (RENAMED TO MATCH NEW USE CASE) ---
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

// Keep Legacy Function for safety (Optional - can be removed if not used elsewhere)
export async function renderQuizResultPreview(activityData, user, resultData, db, collectionName, docId) {
    console.warn("Direct renderQuizResultPreview is deprecated. Use renderStudentResultDetail.");
}
