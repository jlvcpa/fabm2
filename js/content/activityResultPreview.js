import React, { useState, useEffect, useMemo, useCallback } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import htm from 'https://esm.sh/htm';
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { Check, X, Save, Printer } from 'https://esm.sh/lucide-react@0.263.1';
import { getLetterGrade, ActivityHelper } from './accountingCycle/utils.js';

import { qbMerchMultipleChoice } from "./questionBank/qbMerchMultipleChoice.js";
import { qbMerchProblemSolving } from "./questionBank/qbMerchProblemSolving.js";
import { qbMerchJournalizing } from "./questionBank/qbMerchJournalizing.js";

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

const cleanAmt = (amt) => {
    if (amt === null || amt === undefined) return NaN;
    const str = String(amt).trim();
    if (str === '') return NaN;
    return Number(str.replace(/,/g, ''));
};

// --- HELPER: Expected SCE Generation Logic (Dynamic Memo vs Journal Method) ---
function buildExpectedSce(q) {
    const transactions = q.transactions || [];
    const isMemo = q.topic && q.topic.toLowerCase().includes('memorandum');

    const accountConfig = {
        "Authorized Common Stock": { type: "Credit", category: "Auth", class: "Common" },
        "Authorized Preferred Stock": { type: "Credit", category: "Auth", class: "Preferred" },
        "Unissued Common Stock": { type: "Debit", category: "Unissued", class: "Common" },
        "Unissued Preferred Stock": { type: "Debit", category: "Unissued", class: "Preferred" },
        "Common Stock": { type: "Credit", category: "Cap", class: "Common" },
        "Preferred Stock": { type: "Credit", category: "Cap", class: "Preferred" },
        "Subscribed Common Stock": { type: "Credit", category: "Sub", class: "Common" },
        "Subscribed Preferred Stock": { type: "Credit", category: "Sub", class: "Preferred" },
        "Share Premium - Common": { type: "Credit", category: "Prem", class: "Common" },
        "Share Premium - Preferred": { type: "Credit", category: "Prem", class: "Preferred" },
        "Share Premium - Treasury": { type: "Credit", category: "Prem", class: "Common" },
        "Retained Earnings": { type: "Credit", category: "RE", class: "Common" },
        "Treasury Stock": { type: "Debit", category: "Treasury", class: "Common" }
    };

    let soceRows = [];
    
    let begRow = { desc: "Beginning Balance", date: "" };
    if (isMemo) Object.assign(begRow, { Cap: 0, Sub: 0, Prem: 0, RE: 0, Treasury: 0, Total: 0 });
    else Object.assign(begRow, { Auth: 0, Unissued: 0, Sub: 0, Prem: 0, RE: 0, Treasury: 0, Total: 0 });
    soceRows.push(begRow);

    if (!Array.isArray(transactions)) return soceRows;

    transactions.forEach(tx => {
        let impacts = {
            Common: { desc: "", date: tx.date, Total: 0 },
            Preferred: { desc: "", date: tx.date, Total: 0 }
        };
        
        if (isMemo) {
            Object.assign(impacts.Common, { Cap: 0, Sub: 0, Prem: 0, RE: 0, Treasury: 0 });
            Object.assign(impacts.Preferred, { Cap: 0, Sub: 0, Prem: 0, RE: 0, Treasury: 0 });
        } else {
            Object.assign(impacts.Common, { Auth: 0, Unissued: 0, Sub: 0, Prem: 0, RE: 0, Treasury: 0 });
            Object.assign(impacts.Preferred, { Auth: 0, Unissued: 0, Sub: 0, Prem: 0, RE: 0, Treasury: 0 });
        }

        if(tx.solution) {
            tx.solution.forEach(entry => {
                if (entry.isExplanation || !accountConfig[entry.account]) return;
                const config = accountConfig[entry.account];
                const debitAmt = parseFloat(entry.debit) || 0;
                const creditAmt = parseFloat(entry.credit) || 0;
                
                let equityImpact = creditAmt - debitAmt; 

                if (equityImpact !== 0 || debitAmt !== 0 || creditAmt !== 0) {
                    let classType = config.class;
                    impacts[classType][config.category] += equityImpact;
                    impacts[classType].Total += equityImpact;
                }
            });
        }

        let commonAdded = false;
        let isAuth = tx.description && tx.description.toLowerCase().includes("authoriz");
        let authCommon = isAuth && tx.description.toLowerCase().includes("common");
        let authPref = isAuth && tx.description.toLowerCase().includes("preferred");
        if (isAuth && !authCommon && !authPref) authCommon = true; 

        const determineDesc = (imp, isPref) => {
            if(!isMemo && imp.Auth > 0) return isPref ? "Authorization of Preferred shares" : "Authorization of common shares";
            if(isMemo && isAuth) return isPref ? "Authorization of Preferred shares" : "Authorization of common shares";
            if(imp.Sub > 0) return isPref ? "Subscription of preferred shares" : "Subscription of common shares";
            if((!isMemo && imp.Unissued < 0) || (isMemo && imp.Cap > 0)) return isPref ? "Issuance of preferred shares" : "Issuance of common shares";
            if(imp.Treasury < 0) return "Acquisition of treasury shares";
            if(imp.Treasury > 0) return "Reissuance of treasury shares";
            return "";
        };

        const hasImpact = (imp) => {
            return Object.keys(imp).some(k => k !== 'desc' && k !== 'date' && imp[k] !== 0);
        };

        if (hasImpact(impacts.Common) || authCommon) {
            impacts.Common.desc = determineDesc(impacts.Common, false) || (authCommon ? "Authorization of common shares" : "");
            soceRows.push(impacts.Common);
            commonAdded = true;
        }

        if (hasImpact(impacts.Preferred) || authPref) {
            impacts.Preferred.desc = determineDesc(impacts.Preferred, true) || (authPref ? "Authorization of Preferred shares" : "");
            if (commonAdded) impacts.Preferred.date = "";
            soceRows.push(impacts.Preferred);
        }
    });

    let endRow = { desc: "Ending Balance", date: "" };
    let runningTotals = { Total: 0 };
    if (isMemo) Object.assign(runningTotals, { Cap: 0, Sub: 0, Prem: 0, RE: 0, Treasury: 0 });
    else Object.assign(runningTotals, { Auth: 0, Unissued: 0, Sub: 0, Prem: 0, RE: 0, Treasury: 0 });

    soceRows.forEach(row => {
        Object.keys(runningTotals).forEach(key => {
            runningTotals[key] += (row[key] || 0);
        });
    });

    Object.assign(endRow, runningTotals);
    soceRows.push(endRow);

    return soceRows;
}

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

    // Helper for rendering cells with consistent left/right icon alignment
    const renderCell = (val, isCorrect, isExpected, colType, indent = '') => {
        let icon = null;
        if (isCorrect && val) {
            icon = html`<${Check} size=${14} className="text-green-600 flex-shrink-0"/>`;
        } else if (!isCorrect && (val || isExpected)) {
            icon = html`<${X} size=${14} className="text-red-600 flex-shrink-0"/>`;
        }
        
        let textClass = isCorrect ? "text-green-700 font-bold" : "text-red-600 font-bold";
        if (!val && !isExpected) return '';
        
        if (colType === 'date' || colType === 'amount') {
            return html`<div className="flex w-full items-center">
                <div className="w-4 flex-none flex justify-start">${icon}</div>
                <div className=${"flex-grow text-right " + textClass}>${val}</div>
            </div>`;
        } else if (colType === 'acct' || colType === 'desc') {
            return html`<div className="flex w-full items-center">
                <div className=${"flex-grow text-left whitespace-pre " + textClass}>${indent}${val}</div>
                <div className="w-4 flex-none flex justify-end">${icon}</div>
            </div>`;
        }
    };

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
                        const isMemoEntry = solRows.length > 0 && !!solRows[0].account && solRows[0].account.trim().toLowerCase() === 'memo entry';

                        const rawStudentRows = [];
                        for(let r=0; r<rowCount; r++){
                            rawStudentRows.push((studentAns && studentAns[`t${tIdx}_r${r}`]) ? studentAns[`t${tIdx}_r${r}`] : { date:'', acct:'', dr:'', cr:'' });
                        }

                        let isValidOrder = true;
                        let foundCr = false;
                        rawStudentRows.forEach(sr => {
                            if (!isNaN(cleanAmt(sr.cr)) && cleanAmt(sr.cr) > 0) foundCr = true;
                            if (!isNaN(cleanAmt(sr.dr)) && cleanAmt(sr.dr) > 0 && foundCr) isValidOrder = false;
                        });

                        let transMax = 0;
                        let transScore = 0;

                        solRows.forEach((sol, r) => {
                            if (sol.date || r === 0) transMax++;
                            if (isMemoEntry) transMax++;
                            else {
                                if (sol.isExplanation) transMax++;
                                else transMax += 2;
                            }
                        });
                        secMax += transMax;

                        const matchedSolIndices = new Set();

                        rawStudentRows.forEach((sr, r) => {
                            const sDate = (sr.date || '').trim();
                            const sAcct = (sr.acct || '');
                            const sDr = cleanAmt(sr.dr);
                            const sCr = cleanAmt(sr.cr);

                            if (r === 0) {
                                const solWithDate = solRows.find(s => !!s.date && !s.isExplanation);
                                if (solWithDate) {
                                    const expectedRegex = (tIdx === 0) ? /^[A-Z][a-z]{2}\s\d{1,2}$/ : /^\d{1,2}$/;
                                    const expDateStr = (tIdx === 0) ? solWithDate.date : solWithDate.date.split(' ').pop();
                                    if (sDate.match(expectedRegex) && sDate === expDateStr) transScore++;
                                } else if (sDate === '') transScore++;
                            }

                            if (isMemoEntry) {
                                if (r === 0 && sAcct.trim().toLowerCase() === 'memo entry' && !sAcct.startsWith(' ')) transScore++;
                                else if (r === 1 && sAcct.match(/^\s{8,}\S/)) transScore++;
                            } else {
                                if (sAcct.match(/^\s{5,8}\S/) && isNaN(sDr) && isNaN(sCr)) {
                                    transScore++;
                                } else if (sAcct.trim().length > 0) {
                                    const matchIdx = solRows.findIndex((sol, idx) => !sol.isExplanation && !matchedSolIndices.has(idx) && sol.account?.trim().toLowerCase() === sAcct.trim().toLowerCase());
                                    if (matchIdx !== -1) {
                                        matchedSolIndices.add(matchIdx);
                                        const match = solRows[matchIdx];
                                        
                                        const solIsCredit = !!match.credit;
                                        const sIsIndented = sAcct.startsWith('   ');
                                        if (solIsCredit === sIsIndented) transScore++;

                                        if (!isNaN(sDr) && sDr > 0 && cleanAmt(match.debit) === sDr && isValidOrder) transScore++;
                                        else if (!isNaN(sCr) && sCr > 0 && cleanAmt(match.credit) === sCr && isValidOrder) transScore++;
                                    }
                                }
                            }
                        });
                        secScore += transScore;
                    });
                }
                else if (section.type === "Journalizing and Preparing SCE (Corp)") {
                    const expectedSce = buildExpectedSce(liveQ);
                    const isMemo = liveQ.topic && liveQ.topic.toLowerCase().includes('memorandum');
                    const numericCols = isMemo ? ['Cap', 'Sub', 'Prem', 'RE', 'Treasury', 'Total'] : ['Auth', 'Unissued', 'Sub', 'Prem', 'RE', 'Treasury', 'Total'];
                    
                    let jeScore = 0; let jeMax = 0;
                    let sceScore = 0; let sceMax = 0;
                    
                    // JE Scoring
                    const transactions = liveQ.transactions || [];
                    transactions.forEach((tx, tIdx) => {
                        if (tx.solution) {
                            tx.solution.forEach((row, rIdx) => {
                                if(row.isExplanation) return;
                                const cellKey = `t${tIdx}_r${rIdx}`;
                                const sr = (studentAns && studentAns.JE && studentAns.JE[cellKey]) ? studentAns.JE[cellKey] : {};
                                ['date', 'account', 'debit', 'credit'].forEach(field => {
                                    const expVal = row[field];
                                    if (expVal !== undefined && expVal !== null && String(expVal).trim() !== '') {
                                        jeMax++;
                                        if (field === 'debit' || field === 'credit') {
                                            let sVal = parseFloat(String(sr[field] || '').replace(/,/g, ''));
                                            let eVal = parseFloat(String(expVal).replace(/,/g, ''));
                                            if (!isNaN(sVal) && !isNaN(eVal) && sVal === eVal) jeScore++;
                                        } else {
                                            if (sr[field] && String(sr[field]).trim().toLowerCase() === String(expVal).trim().toLowerCase()) jeScore++;
                                        }
                                    }
                                });
                            });
                        }
                    });

                    // SCE Scoring
                    expectedSce.forEach((expRow, rIdx) => {
                        const sr = (studentAns && studentAns.SCE && studentAns.SCE[`r${rIdx}`]) ? studentAns.SCE[`r${rIdx}`] : {};
                        if (expRow.date !== undefined && expRow.date !== null && String(expRow.date).trim() !== '') {
                            sceMax++;
                            if(sr.date && String(sr.date).trim().toLowerCase() === String(expRow.date).trim().toLowerCase()) sceScore++;
                        }
                        if (expRow.desc && String(expRow.desc).trim() !== '') {
                            sceMax++;
                            if(sr.desc && String(sr.desc).trim().toLowerCase() === String(expRow.desc).trim().toLowerCase()) sceScore++;
                        }
                        numericCols.forEach(col => {
                            const lCol = col.toLowerCase();
                            if (expRow[col] !== 0) {
                                sceMax++;
                                let sVal = parseFloat(String(sr[lCol] || '').replace(/,/g, ''));
                                let eVal = parseFloat(expRow[col]);
                                if (!isNaN(sVal) && !isNaN(eVal) && sVal === eVal) sceScore++;
                            } else if (sr[lCol] !== undefined && sr[lCol] !== '') {
                                let sVal = parseFloat(String(sr[lCol]).replace(/,/g, ''));
                                if(sVal === 0) { sceMax++; sceScore++; } else { sceMax++; }
                            }
                        });
                    });

                    secScore += (jeScore + sceScore);
                    secMax += (jeMax + sceMax);
                    
                    // We can cache these detailed scores if we want to render them later
                    q.computedScores = { jeScore, jeMax, sceScore, sceMax };
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
                                                const isMemoEntry = solRows.length > 0 && !!solRows[0].account && solRows[0].account.trim().toLowerCase() === 'memo entry';
                                                
                                                const rawStudentRows = [];
                                                for(let r=0; r<rowCount; r++) {
                                                    const cellKey = `t${tIdx}_r${r}`;
                                                    rawStudentRows.push((studentAns && studentAns[cellKey]) ? studentAns[cellKey] : { date:'', acct:'', dr:'', cr:'' });
                                                }

                                                let isValidOrder = true;
                                                let foundCr = false;
                                                rawStudentRows.forEach(sr => {
                                                    if (!isNaN(cleanAmt(sr.cr)) && cleanAmt(sr.cr) > 0) foundCr = true;
                                                    if (!isNaN(cleanAmt(sr.dr)) && cleanAmt(sr.dr) > 0 && foundCr) isValidOrder = false;
                                                });

                                                const matchedSolIndices = new Set();
                                                const results = new Array(rowCount).fill(null);

                                                rawStudentRows.forEach((sr, r) => {
                                                    const sDate = (sr.date || '').trim();
                                                    const sAcct = (sr.acct || '');
                                                    const rawDr = (sr.dr || '').trim();
                                                    const rawCr = (sr.cr || '').trim();
                                                    const sDr = cleanAmt(rawDr);
                                                    const sCr = cleanAmt(rawCr);

                                                    let dateCorrect = false, acctCorrect = false, drCorrect = false, crCorrect = false;
                                                    let expDate = false, expAcct = false, expDr = false, expCr = false;

                                                    if (r === 0) {
                                                        expDate = true;
                                                        const solWithDate = solRows.find(s => !!s.date && !s.isExplanation);
                                                        if (solWithDate) {
                                                            const expectedRegex = (tIdx === 0) ? /^[A-Z][a-z]{2}\s\d{1,2}$/ : /^\d{1,2}$/;
                                                            const expDateStr = (tIdx === 0) ? solWithDate.date : solWithDate.date.split(' ').pop();
                                                            dateCorrect = !!sDate.match(expectedRegex) && sDate === expDateStr;
                                                        } else {
                                                            dateCorrect = (sDate === '');
                                                        }
                                                    } else {
                                                        dateCorrect = (sDate === '');
                                                    }

                                                    if (isMemoEntry) {
                                                        if (r === 0) {
                                                            expAcct = true;
                                                            acctCorrect = (sAcct.trim().toLowerCase() === 'memo entry' && !sAcct.startsWith(' '));
                                                        } else if (r === 1) {
                                                            expAcct = true;
                                                            acctCorrect = sAcct.match(/^\s{8,}\S/) !== null;
                                                        }
                                                        drCorrect = (rawDr === '');
                                                        crCorrect = (rawCr === '');
                                                    } else {
                                                        if (sAcct.match(/^\s{5,8}\S/) && isNaN(sDr) && isNaN(sCr)) {
                                                            expAcct = true;
                                                            acctCorrect = true;
                                                            drCorrect = (rawDr === '');
                                                            crCorrect = (rawCr === '');
                                                        } 
                                                        else if (sAcct.trim().length > 0 || rawDr !== '' || rawCr !== '') {
                                                            const matchIdx = solRows.findIndex((sol, idx) => !sol.isExplanation && !matchedSolIndices.has(idx) && sol.account?.trim().toLowerCase() === sAcct.trim().toLowerCase());
                                                            if (matchIdx !== -1) {
                                                                matchedSolIndices.add(matchIdx);
                                                                const match = solRows[matchIdx];
                                                                expAcct = true;
                                                                expDr = !!match.debit;
                                                                expCr = !!match.credit;

                                                                const solIsCredit = !!match.credit;
                                                                const sIsIndented = sAcct.startsWith('   ');
                                                                acctCorrect = (solIsCredit === sIsIndented);

                                                                if (expDr) drCorrect = (sDr === cleanAmt(match.debit)) && isValidOrder;
                                                                else drCorrect = (rawDr === '');

                                                                if (expCr) crCorrect = (sCr === cleanAmt(match.credit)) && isValidOrder;
                                                                else crCorrect = (rawCr === '');
                                                            } else {
                                                                expAcct = true; 
                                                                acctCorrect = false;
                                                                drCorrect = false;
                                                                crCorrect = false;
                                                            }
                                                        } else {
                                                            acctCorrect = true;
                                                            drCorrect = true;
                                                            crCorrect = true;
                                                        }
                                                    }
                                                    results[r] = { dateCorrect, acctCorrect, drCorrect, crCorrect, expDate, expAcct, expDr, expCr };
                                                });

                                                return html`
                                                    <div key=${tIdx} className="mb-4 border border-gray-300 rounded overflow-hidden">
                                                        <div className="bg-gray-100 px-3 py-2 text-sm font-bold border-b border-gray-300">
                                                            Transaction ${tIdx+1}: <span className="font-normal text-gray-600">${trans.date} - ${trans.description}</span>
                                                        </div>
                                                        <div className="flex flex-col text-xs">
                                                            <div className="border-b border-gray-300 bg-white">
                                                                <div className="bg-blue-100 p-1 font-bold text-center text-blue-900 border-b border-blue-200">Your Answer</div>
                                                                <table className="w-full">
                                                                    ${rawStudentRows.map((sr, r) => {
                                                                        const res = results[r];
                                                                        return html`
                                                                            <tr key=${r} className="border-b border-gray-100">
                                                                                <td className="p-1 w-20 align-top border-r font-mono">${renderCell(sr.date, res.dateCorrect, res.expDate, 'date')}</td>
                                                                                <td className="p-1 align-top border-r font-mono">${renderCell(sr.acct, res.acctCorrect, res.expAcct, 'acct')}</td>
                                                                                <td className="p-1 w-28 align-top border-r font-mono">${renderCell(sr.dr, res.drCorrect, res.expDr, 'amount')}</td>
                                                                                <td className="p-1 w-28 align-top font-mono">${renderCell(sr.cr, res.crCorrect, res.expCr, 'amount')}</td>
                                                                            </tr>
                                                                        `;
                                                                    })}
                                                                </table>
                                                            </div>
                                                            <div className="bg-white">
                                                                <div className="bg-green-100 p-1 font-bold text-center text-green-900 border-b border-green-200">Solution</div>
                                                                <table className="w-full">
                                                                    ${solRows.map((sol, r) => {
                                                                        const indent = sol.credit ? '   ' : (sol.isExplanation ? (isMemoEntry ? '        ' : '     ') : '');
                                                                        let displaySolDate = sol.date || '';
                                                                        if (displaySolDate && tIdx > 0 && r === 0) {
                                                                            const parts = displaySolDate.split(' ');
                                                                            displaySolDate = parts[parts.length - 1];
                                                                        }
                                                                        return html`
                                                                            <tr key=${r} className="border-b border-gray-100 bg-green-50/30">
                                                                                <td className="p-1 w-20 align-top text-right border-r font-mono text-gray-500 pr-2">${displaySolDate}</td>
                                                                                <td className="p-1 align-top text-left border-r font-mono whitespace-pre text-gray-700 font-bold">${indent}${sol.account || ''}</td>
                                                                                <td className="p-1 w-28 align-top text-right border-r font-mono text-gray-700 pr-2">${sol.debit || ''}</td>
                                                                                <td className="p-1 w-28 align-top text-right font-mono text-gray-700 pr-2">${sol.credit || ''}</td>
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
                                else if (section.type === "Journalizing and Preparing SCE (Corp)") {
                                    const expectedSce = buildExpectedSce(liveQ);
                                    const isMemo = liveQ.topic && liveQ.topic.toLowerCase().includes('memorandum');
                                    const numericCols = isMemo ? ['Cap', 'Sub', 'Prem', 'RE', 'Treasury', 'Total'] : ['Auth', 'Unissued', 'Sub', 'Prem', 'RE', 'Treasury', 'Total'];

                                    const { jeScore, jeMax, sceScore, sceMax } = q.computedScores || { jeScore: 0, jeMax: 0, sceScore: 0, sceMax: 0 };
                                    
                                    return html`
                                        <div key=${q.uiId} className="border rounded p-4 bg-white mb-6 shadow-sm">
                                            <div className="flex justify-between items-center mb-2 border-b pb-2">
                                                <div className="font-bold text-gray-800 text-lg">Activity Set ${qIdx + 1}</div>
                                                <div className="flex gap-4">
                                                    <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">Journalizing: ${jeScore}/${jeMax} pts</span>
                                                    <span className="text-sm font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">SCE: ${sceScore}/${sceMax} pts</span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-sm italic text-gray-600 mb-6 bg-blue-50 p-3 rounded border border-blue-100">${liveQ.question || "Journalize and prepare SCE."}</div>
                                            
                                            <h4 className="font-bold text-gray-700 mb-3 uppercase tracking-wide">Part 1: Journalizing</h4>
                                            ${(liveQ.transactions || []).map((trans, tIdx) => {
                                                const solRows = trans.solution || [];
                                                
                                                const rawStudentRows = [];
                                                // Assuming max 4 rows per transaction as standard fallback
                                                for(let r=0; r<4; r++) {
                                                    const cellKey = `t${tIdx}_r${r}`;
                                                    const sr = (studentAns && studentAns.JE && studentAns.JE[cellKey]) ? studentAns.JE[cellKey] : {};
                                                    if(r < solRows.length || sr.acct || sr.dr || sr.cr || sr.date) {
                                                        rawStudentRows.push(sr);
                                                    }
                                                }

                                                // Calculate evaluation arrays just for UI rendering checkmarks
                                                const results = new Array(rawStudentRows.length).fill(null);
                                                const matchedSolIndices = new Set();
                                                
                                                rawStudentRows.forEach((sr, r) => {
                                                    let dateCorrect = false, acctCorrect = false, drCorrect = false, crCorrect = false;
                                                    let expDate = false, expAcct = false, expDr = false, expCr = false;

                                                    // Simplifying validation purely for UI mapping in this specific component context:
                                                    const sDate = (sr.date || '').trim();
                                                    const sAcct = (sr.acct || '');
                                                    const sDr = cleanAmt(sr.dr);
                                                    const sCr = cleanAmt(sr.cr);

                                                    if (r < solRows.length) {
                                                        const sol = solRows[r];
                                                        if (sol.isExplanation) return;
                                                        
                                                        if (sol.date !== undefined && sol.date !== null) expDate = true;
                                                        if (sol.account) expAcct = true;
                                                        if (sol.debit) expDr = true;
                                                        if (sol.credit) expCr = true;

                                                        if (sDate && sol.date && sDate.toLowerCase() === String(sol.date).toLowerCase()) dateCorrect = true;
                                                        
                                                        // Account match
                                                        const matchIdx = solRows.findIndex((s, idx) => !s.isExplanation && !matchedSolIndices.has(idx) && s.account?.trim().toLowerCase() === sAcct.trim().toLowerCase());
                                                        if (matchIdx !== -1) {
                                                            matchedSolIndices.add(matchIdx);
                                                            const match = solRows[matchIdx];
                                                            const solIsCredit = !!match.credit;
                                                            const sIsIndented = sAcct.startsWith('   ');
                                                            acctCorrect = (solIsCredit === sIsIndented);

                                                            if (expDr && sDr === cleanAmt(match.debit)) drCorrect = true;
                                                            if (expCr && sCr === cleanAmt(match.credit)) crCorrect = true;
                                                        }
                                                    }
                                                    results[r] = { dateCorrect, acctCorrect, drCorrect, crCorrect, expDate, expAcct, expDr, expCr };
                                                });

                                                return html`
                                                    <div key=${tIdx} className="mb-6 border border-gray-300 rounded overflow-hidden">
                                                        <div className="bg-gray-100 px-3 py-2 text-sm font-bold border-b border-gray-300">
                                                            Transaction ${tIdx+1}: <span className="font-normal text-gray-600">${trans.date} - ${trans.description}</span>
                                                        </div>
                                                        <div className="flex flex-col text-xs">
                                                            <div className="border-b border-gray-300 bg-white">
                                                                <div className="bg-blue-100 p-1 font-bold text-center text-blue-900 border-b border-blue-200">Your Answer</div>
                                                                <table className="w-full">
                                                                    ${rawStudentRows.map((sr, r) => {
                                                                        const res = results[r] || {};
                                                                        return html`
                                                                            <tr key=${r} className="border-b border-gray-100">
                                                                                <td className="p-1 w-20 align-top border-r font-mono">${renderCell(sr.date, res.dateCorrect, res.expDate, 'date')}</td>
                                                                                <td className="p-1 align-top border-r font-mono">${renderCell(sr.acct, res.acctCorrect, res.expAcct, 'acct')}</td>
                                                                                <td className="p-1 w-28 align-top border-r font-mono">${renderCell(sr.dr, res.drCorrect, res.expDr, 'amount')}</td>
                                                                                <td className="p-1 w-28 align-top font-mono">${renderCell(sr.cr, res.crCorrect, res.expCr, 'amount')}</td>
                                                                            </tr>
                                                                        `;
                                                                    })}
                                                                </table>
                                                            </div>
                                                            <div className="bg-white">
                                                                <div className="bg-green-100 p-1 font-bold text-center text-green-900 border-b border-green-200">Solution</div>
                                                                <table className="w-full">
                                                                    ${solRows.map((sol, r) => {
                                                                        const indent = sol.credit ? '   ' : '';
                                                                        return html`
                                                                            <tr key=${r} className="border-b border-gray-100 bg-green-50/30">
                                                                                <td className="p-1 w-20 align-top text-right border-r font-mono text-gray-500 pr-2">${sol.date || ''}</td>
                                                                                <td className="p-1 align-top text-left border-r font-mono whitespace-pre text-gray-700 font-bold">${indent}${sol.account || ''}</td>
                                                                                <td className="p-1 w-28 align-top text-right border-r font-mono text-gray-700 pr-2">${sol.debit || ''}</td>
                                                                                <td className="p-1 w-28 align-top text-right font-mono text-gray-700 pr-2">${sol.credit || ''}</td>
                                                                            </tr>
                                                                        `;
                                                                    })}
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            })}

                                            <h4 className="font-bold text-gray-700 mt-8 mb-3 uppercase tracking-wide">Part 2: Statement of Changes in Equity</h4>
                                            
                                            <div className="border border-gray-300 rounded shadow-sm overflow-hidden text-xs">
                                                <div className="bg-blue-100 p-2 font-bold text-center text-blue-900 border-b border-blue-200">Your Statement</div>
                                                <div className="w-full overflow-x-auto bg-white">
                                                    <table className="w-full text-left whitespace-nowrap min-w-[900px]">
                                                        <thead className="bg-gray-100 text-gray-600 font-bold uppercase border-b border-gray-300">
                                                            <tr>
                                                                <th className="px-2 py-2 border-r border-gray-300 text-center">Date</th>
                                                                <th className="px-2 py-2 border-r border-gray-300 text-left">Transaction / Movement</th>
                                                                ${isMemo 
                                                                    ? html`<th className="px-2 py-2 text-right border-r border-slate-300">Capital<br/>Stock</th>`
                                                                    : html`<th className="px-2 py-2 text-right border-r border-slate-300">Authorized<br/>Capital</th>
                                                                           <th className="px-2 py-2 text-right border-r border-slate-300">Unissued<br/>Capital</th>`
                                                                }
                                                                <th className="px-2 py-2 text-right border-r border-slate-300">Subscribed<br/>Stock</th>
                                                                <th className="px-2 py-2 text-right border-r border-slate-300">Share<br/>Premium</th>
                                                                <th className="px-2 py-2 text-right border-r border-slate-300">Retained<br/>Earnings</th>
                                                                <th className="px-2 py-2 text-right border-r border-slate-300">Treasury<br/>Shares</th>
                                                                <th className="px-2 py-2 text-right font-bold text-indigo-700 bg-indigo-50/50">Total<br/>Equity</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            ${expectedSce.map((expRow, rIdx) => {
                                                                const sr = (studentAns && studentAns.SCE && studentAns.SCE[`r${rIdx}`]) ? studentAns.SCE[`r${rIdx}`] : {};
                                                                
                                                                const dateC = !!(expRow.date && sr.date && sr.date.trim().toLowerCase() === expRow.date.trim().toLowerCase());
                                                                const descC = !!(expRow.desc && sr.desc && sr.desc.trim().toLowerCase() === expRow.desc.trim().toLowerCase());

                                                                const sColRender = (colKey) => {
                                                                    const val = sr[colKey.toLowerCase()] || '';
                                                                    const expVal = expRow[colKey];
                                                                    
                                                                    let isCorrect = false;
                                                                    let isExp = expVal !== 0;
                                                                    
                                                                    if (expVal !== 0) {
                                                                        let sN = parseFloat(String(val).replace(/,/g, ''));
                                                                        if (!isNaN(sN) && sN === parseFloat(expVal)) isCorrect = true;
                                                                    } else if (val !== undefined && val !== '') {
                                                                        let sN = parseFloat(String(val).replace(/,/g, ''));
                                                                        if (sN === 0) { isCorrect = true; isExp = true; }
                                                                    }
                                                                    return html`<td className="border-r border-gray-200 p-1 font-mono">${renderCell(val, isCorrect, isExp, 'amount')}</td>`;
                                                                };

                                                                return html`
                                                                    <tr key=${rIdx} className="border-b border-gray-100 hover:bg-gray-50">
                                                                        <td className="border-r border-gray-200 p-1 font-mono">${renderCell(sr.date, dateC, !!expRow.date, 'date')}</td>
                                                                        <td className="border-r border-gray-200 p-1 font-mono">${renderCell(sr.desc, descC, !!expRow.desc, 'desc')}</td>
                                                                        ${isMemo ? sColRender('Cap') : html`${sColRender('Auth')}${sColRender('Unissued')}`}
                                                                        ${sColRender('Sub')}
                                                                        ${sColRender('Prem')}
                                                                        ${sColRender('RE')}
                                                                        ${sColRender('Treasury')}
                                                                        ${sColRender('Total')}
                                                                    </tr>
                                                                `;
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="bg-green-100 p-2 font-bold text-center text-green-900 border-b border-green-200 border-t border-gray-300">Solution Statement</div>
                                                <div className="w-full overflow-x-auto bg-green-50/30 pb-4">
                                                    <table className="w-full text-left whitespace-nowrap min-w-[900px]">
                                                        <tbody>
                                                            ${expectedSce.map((expRow, rIdx) => {
                                                                const sColRenderExp = (colKey) => html`<td className="border-r border-gray-200 px-2 py-1 text-right font-mono text-gray-700">${expRow[colKey] !== 0 ? expRow[colKey] : '-'}</td>`;
                                                                return html`
                                                                    <tr key=${rIdx} className="border-b border-gray-200">
                                                                        <td className="border-r border-gray-200 px-2 py-1 text-center font-mono text-gray-500">${expRow.date}</td>
                                                                        <td className="border-r border-gray-200 px-2 py-1 font-mono text-gray-700 font-bold">${expRow.desc}</td>
                                                                        ${isMemo ? sColRenderExp('Cap') : html`${sColRenderExp('Auth')}${sColRenderExp('Unissued')}`}
                                                                        ${sColRenderExp('Sub')}
                                                                        ${sColRenderExp('Prem')}
                                                                        ${sColRenderExp('RE')}
                                                                        ${sColRenderExp('Treasury')}
                                                                        <td className="px-2 py-1 text-right font-mono text-indigo-900 font-bold bg-indigo-50/30">${expRow.Total}</td>
                                                                    </tr>
                                                                `;
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
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

const ResultDetailViewer = ({ currentUser, activityConfig, resultData, collectionName, docId }) => {
    const [pendingScores, setPendingScores] = useState(null);
    const [printMode, setPrintMode] = useState('all');

    const handlePrint = (mode) => {
        setPrintMode(mode);
        setTimeout(() => {
            window.print();
            setTimeout(() => setPrintMode('all'), 500); 
        }, 100);
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
        <style>
            @media print {
                /* Hide UI Elements & Isolated Parts */
                #qa-sidebar, #student-sidebar, button, .print\\:hidden, .hide-in-print { 
                    display: none !important; 
                }

                /* Ensure the page uses full width and proper margins */
                @page {
                    size: auto;
                    margin: 10mm;
                }

                /* 1. RESET MAIN WRAPPERS TO PREVENT LEFT-SHIFTING & WHITE SPACE */
                html, body, #root, #qa-runner-container, .flex.h-full.relative.overflow-hidden, .max-w-5xl {
                    height: auto !important;
                    min-height: auto !important;
                    max-height: none !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    overflow: visible !important;
                    position: static !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    display: block !important;
                    background-color: white !important;
                }
                
                /* Remove flex gaps */
                .flex-col.gap-12, .flex-col.gap-8, .flex-col.gap-6 { gap: 0 !important; display: block !important; }
                .mb-8 { margin-bottom: 2rem !important; }

                /* 2. FORCE SCROLLABLE PANELS TO EXPAND */
                .overflow-y-auto, .overflow-x-auto, .overflow-auto, .overflow-hidden,
                .absolute, .relative, .fixed, .inset-0, [class*="max-h-"], [class*="h-"], .flex-1 {
                    height: auto !important;
                    max-height: none !important;
                    min-height: auto !important;
                    overflow: visible !important;
                    position: static !important;
                    flex: none !important;
                }

                .border-gray-200.rounded.p-2.bg-gray-50 *, .border-gray-200.rounded.p-2.bg-gray-50 {
                    position: static !important;
                    overflow: visible !important;
                    height: auto !important;
                    max-height: none !important;
                }

                /* 3. FIX PAGE BREAKS AND REMOVE BULKY CONTAINERS */
                .bg-white.border.rounded-lg, .border.rounded.p-4, .break-inside-avoid, .question-block {
                    page-break-inside: auto !important;
                    break-inside: auto !important;
                    page-break-after: auto !important;
                    page-break-before: auto !important;
                    margin: 0 0 20px 0 !important;
                    border: none !important;
                    box-shadow: none !important;
                }

                /* Clean up headers for print (saves ink, fixes spacing) */
                .bg-slate-800, .bg-blue-900 {
                    background-color: transparent !important;
                    color: black !important;
                    border-bottom: 2px solid black !important;
                    padding: 5px 0 !important;
                }
                .text-yellow-400, .text-yellow-300, .text-white { color: black !important; }

                /* 4. SHRINK AND FIT TABLES TO PREVENT CUTOFF */
                table { 
                    page-break-inside: auto !important; 
                    width: 100% !important; 
                    max-width: 100% !important;
                    border-collapse: collapse !important; 
                    font-size: 10px !important; 
                }
                tr { page-break-inside: avoid !important; page-break-after: auto !important; }
                td, th { page-break-inside: avoid !important; padding: 3px !important; }
                thead { display: table-header-group !important; }
                
                input, textarea {
                    border: none !important;
                    background: transparent !important;
                    font-size: 10px !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    height: auto !important;
                    resize: none !important;
                }
            }
        </style>
        
        <div className="flex justify-end gap-2 mb-4 print:hidden">
            <button onClick=${() => handlePrint('all')} className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded hover:bg-indigo-700 shadow flex items-center gap-2">
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
            ? html`<${AccountingCycleResultView} resultData=${resultData} activityConfig=${activityConfig} printMode=${printMode} onPrint=${handlePrint} />`
            : html`<${StandardQuizResultView} 
                resultData=${resultData} 
                activityConfig=${activityConfig} 
                onScoreUpdate=${(scores) => setPendingScores(scores)} 
                printMode=${printMode} 
                onPrint=${handlePrint} 
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
