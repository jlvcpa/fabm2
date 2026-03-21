import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm';
import { renderCell } from './previewUtils.js';

const html = htm.bind(React.createElement);

export function renderIntegratedScePreview(q, qIdx, liveQ, studentAns, renderData) {
    if (!renderData) return html`<div key=${q.uiId}>Loading data...</div>`;

    const { scores, jeEvals, sceEvals, expectedSce } = renderData;
    const isMemo = liveQ.topic && liveQ.topic.toLowerCase().includes('memorandum');

    return html`
        <div key=${q.uiId} className="border rounded p-4 bg-white mb-6 shadow-sm">
            <div className="font-bold text-gray-800 text-lg mb-2 border-b pb-2">Activity Set ${qIdx + 1}</div>
            <div className="text-sm italic text-gray-600 mb-6 bg-blue-50 p-3 rounded border border-blue-100">${liveQ.question || "Journalize and prepare SCE."}</div>
            
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-gray-700 uppercase tracking-wide">Part 1: Journalizing</h4>
                <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded border border-indigo-200">Score: ${scores.jeScore} / ${scores.jeMax} pts</span>
            </div>
            
            ${(liveQ.transactions || []).map((trans, tIdx) => {
                const solRows = trans.solution || [];
                const rowCount = trans.rows || (solRows.length > 0 ? solRows.length : 3);
                
                const rawStudentRows = [];
                for(let r=0; r < rowCount; r++) {
                    const cellKey = `t${tIdx}_r${r}`;
                    const sr = (studentAns && studentAns.JE && studentAns.JE[cellKey]) ? studentAns.JE[cellKey] : {};
                    rawStudentRows.push(sr);
                }

                const results = jeEvals[tIdx] || new Array(rowCount).fill({});

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
                                        const isDesc = (r === rowCount - 1);
                                        const acctText = isDesc && sr.acct ? "        " + sr.acct : sr.acct;
                                        const acctClasses = isDesc ? "italic text-gray-500" : "";
                                        
                                        return html`
                                            <tr key=${r} className="border-b border-gray-100">
                                                <td className="p-1 w-20 align-top border-r font-mono">${renderCell(sr.date, res.dateCorrect, res.expDate, 'date')}</td>
                                                <td className="p-1 align-top border-r font-mono">${renderCell(acctText, res.acctCorrect, res.expAcct, 'acct', acctClasses)}</td>
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
                                        const isDesc = sol.isExplanation;
                                        const indent = isDesc ? '        ' : (sol.credit ? '   ' : '');
                                        const acctClasses = isDesc ? 'italic text-gray-500' : 'text-gray-700 font-bold';
                                        
                                        let displaySolDate = sol.date || '';
                                        if (displaySolDate && tIdx > 0 && !isDesc) {
                                            const parts = displaySolDate.split(' ');
                                            displaySolDate = parts[parts.length - 1];
                                        }

                                        return html`
                                            <tr key=${r} className="border-b border-gray-100 bg-green-50/30">
                                                <td className="p-1 w-20 align-top text-right border-r font-mono text-gray-500 pr-2">${displaySolDate}</td>
                                                <td className=${"p-1 align-top text-left border-r font-mono whitespace-pre " + acctClasses}>${indent}${sol.account || ''}</td>
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

            <div className="flex justify-between items-center mt-8 mb-3 border-t pt-6">
                <h4 className="font-bold text-gray-700 uppercase tracking-wide">Part 2: Statement of Changes in Equity</h4>
                <span className="text-sm font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded border border-purple-200">Score: ${scores.sceScore} / ${scores.sceMax} pts</span>
            </div>
            
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
                            ${sceEvals.map((res, rIdx) => {
                                const sr = (studentAns && studentAns.SCE && studentAns.SCE[`r${rIdx}`]) ? studentAns.SCE[`r${rIdx}`] : {};
                                
                                const sColRender = (colKey) => {
                                    const val = sr[colKey.toLowerCase()] || '';
                                    const colRes = res.cols[colKey.toLowerCase()] || {};
                                    return html`<td className="border-r border-gray-200 p-1 font-mono">${renderCell(val, colRes.correct, colRes.exp, 'amount')}</td>`;
                                };

                                return html`
                                    <tr key=${rIdx} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="border-r border-gray-200 p-1 font-mono">${renderCell(sr.date, res.dateCorrect, res.expDate, 'date')}</td>
                                        <td className="border-r border-gray-200 p-1 font-mono">${renderCell(sr.desc, res.descCorrect, res.expDesc, 'desc')}</td>
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
