import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm';
import { cleanAmt, renderCell } from './previewUtils.js';

const html = htm.bind(React.createElement);

export function evaluateJournalizing(liveQ, studentAns) {
    let secScore = 0;
    let secMax = 0;
    const transEvals = [];

    const transactions = liveQ.transactions || [];
    transactions.forEach((trans, tIdx) => {
        const solRows = trans.solution || [];
        const rowCount = trans.rows || 2;
        const isMemoEntry = solRows.length > 0 && !!solRows[0].account && solRows[0].account.trim().toLowerCase() === 'memo entry';

        const rawStudentRows = [];
        for(let r = 0; r < rowCount; r++){
            const cellKey = `t${tIdx}_r${r}`;
            rawStudentRows.push((studentAns && studentAns[cellKey]) ? studentAns[cellKey] : { date:'', acct:'', dr:'', cr:'' });
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
                    if (sDate.match(expectedRegex) && sDate === expDateStr) { transScore++; dateCorrect = true; }
                } else if (sDate === '') { transScore++; dateCorrect = true; }
            } else {
                dateCorrect = (sDate === '');
            }

            if (isMemoEntry) {
                if (r === 0) {
                    expAcct = true;
                    if (sAcct.trim().toLowerCase() === 'memo entry' && !sAcct.startsWith(' ')) { transScore++; acctCorrect = true; }
                } else if (r === 1) {
                    expAcct = true;
                    if (sAcct.match(/^\s{8,}\S/)) { transScore++; acctCorrect = true; }
                }
                drCorrect = (rawDr === '');
                crCorrect = (rawCr === '');
            } else {
                if (sAcct.match(/^\s{5,8}\S/) && isNaN(sDr) && isNaN(sCr)) {
                    expAcct = true;
                    acctCorrect = true;
                    transScore++;
                    drCorrect = (rawDr === '');
                    crCorrect = (rawCr === '');
                } else if (sAcct.trim().length > 0 || rawDr !== '' || rawCr !== '') {
                    const matchIdx = solRows.findIndex((sol, idx) => !sol.isExplanation && !matchedSolIndices.has(idx) && sol.account?.trim().toLowerCase() === sAcct.trim().toLowerCase());
                    if (matchIdx !== -1) {
                        matchedSolIndices.add(matchIdx);
                        const match = solRows[matchIdx];
                        
                        expAcct = true;
                        expDr = !!match.debit;
                        expCr = !!match.credit;

                        const solIsCredit = !!match.credit;
                        const sIsIndented = sAcct.startsWith('   ');
                        if (solIsCredit === sIsIndented) { transScore++; acctCorrect = true; }

                        if (expDr && sDr === cleanAmt(match.debit)) {
                            if (isValidOrder) transScore++;
                            drCorrect = true;
                        } else drCorrect = (rawDr === '');

                        if (expCr && sCr === cleanAmt(match.credit)) {
                            if (isValidOrder) transScore++;
                            crCorrect = true;
                        } else crCorrect = (rawCr === '');
                    } else {
                        expAcct = true; 
                        acctCorrect = false; drCorrect = false; crCorrect = false;
                    }
                } else {
                    acctCorrect = true; drCorrect = true; crCorrect = true;
                }
            }
            results[r] = { dateCorrect, acctCorrect, drCorrect, crCorrect, expDate, expAcct, expDr, expCr };
        });

        secScore += transScore;
        transEvals.push({ results });
    });

    return { secScore, secMax, transEvals };
}

export function renderJournalizingPreview(q, qIdx, liveQ, studentAns, transEvals) {
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

                const results = transEvals[tIdx]?.results || new Array(rowCount).fill({});

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
