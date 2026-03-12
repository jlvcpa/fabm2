const sceDescOptions = [
    "Beginning Balance",
    "Authorization of common shares",
    "Authorization of Preferred shares",
    "Subscription of common shares",
    "Subscription of preferred shares",
    "Issuance of common shares",
    "Issuance of preferred shares",
    "Direct issuance of common shares",
    "Direct issuance of preferred shares",
    "Acquisition of treasury shares",
    "Reissuance of treasury shares",
    "Ending Balance"
];

const cleanAmt = (amt) => {
    if (amt === null || amt === undefined) return NaN;
    const str = String(amt).trim();
    if (str === '') return NaN;
    return Number(str.replace(/,/g, ''));
};

export function buildExpectedSce(q) {
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
            
            if((!isMemo && imp.Unissued > 0) || (isMemo && imp.Cap > 0)) {
                // If Subscribed Stock is reduced, it's an issuance from subscription. Otherwise it's direct.
                if (imp.Sub < 0) return isPref ? "Issuance of preferred shares" : "Issuance of common shares";
                else return isPref ? "Direct issuance of preferred shares" : "Direct issuance of common shares";
            }
            
            if(imp.Treasury < 0) return "Acquisition of treasury shares";
            if(imp.Treasury > 0) return "Reissuance of treasury shares";
            return "";
        };

        const hasImpact = (imp) => {
            return Object.keys(imp).some(k => k !== 'desc' && k !== 'date' && k !== 'Total' && imp[k] !== 0);
        };

        // If transaction has no numerical impact on SCE (like Memo Entry Auth or Partial Collection), do not add a row.
        if (hasImpact(impacts.Common) || (!isMemo && authCommon)) {
            impacts.Common.desc = determineDesc(impacts.Common, false) || (authCommon ? "Authorization of common shares" : "");
            soceRows.push(impacts.Common);
            commonAdded = true;
        }

        if (hasImpact(impacts.Preferred) || (!isMemo && authPref)) {
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

// --- CENTRALIZED GRADING ENGINE ---
export function gradeIntegratedSce(studentAns, liveQ) {
    const expectedSce = buildExpectedSce(liveQ);
    const isMemo = liveQ.topic && liveQ.topic.toLowerCase().includes('memorandum');
    const numericCols = isMemo ? ['Cap', 'Sub', 'Prem', 'RE', 'Treasury', 'Total'] : ['Auth', 'Unissued', 'Sub', 'Prem', 'RE', 'Treasury', 'Total'];

    let jeScore = 0; let jeMax = 0;
    let sceScore = 0; let sceMax = 0;
    
    let jeEvals = [];
    let sceEvals = [];

    // --- 1. JOURNAL GRADING (FLEXIBLE DR/CR ORDER & STRICT DATES) ---
    const transactions = liveQ.transactions || [];
    transactions.forEach((tx, tIdx) => {
        const solRows = tx.solution || [];
        const rowCount = tx.rows || (solRows.length > 0 ? solRows.length : 3);
        let tEval = new Array(rowCount).fill(null).map(() => ({}));
        
        let expDebits = [];
        let expCredits = [];
        let expDesc = "";
        let expectedDateStr = "";

        solRows.forEach((sol, r) => {
            if (sol.isExplanation) {
                jeMax++;
                expDesc = sol.account.trim();
            } else {
                if (sol.date || r === 0) {
                    jeMax++;
                    if (sol.date) expectedDateStr = tIdx === 0 ? sol.date.trim() : sol.date.trim().split(' ').pop();
                }
                if (sol.account) jeMax++;
                if (sol.debit) { jeMax++; expDebits.push({ acct: sol.account.trim().toLowerCase(), amt: cleanAmt(sol.debit), used: false }); }
                if (sol.credit) { jeMax++; expCredits.push({ acct: sol.account.trim().toLowerCase(), amt: cleanAmt(sol.credit), used: false }); }
            }
        });

        // Evaluate Description Row (Last Row)
        const srDesc = (studentAns && studentAns.JE && studentAns.JE[`t${tIdx}_r${rowCount-1}`]) || {};
        const sDescVal = (srDesc.acct || "").trim();
        tEval[rowCount-1] = { 
            expAcct: !!expDesc, 
            acctCorrect: sDescVal && sDescVal === expDesc 
        };
        if (tEval[rowCount-1].acctCorrect) jeScore++;

        // Evaluate Date (Row 0)
        const sDateVal = ((studentAns && studentAns.JE && studentAns.JE[`t${tIdx}_r0`]?.date) || "").trim();
        tEval[0] = tEval[0] || {};
        tEval[0].expDate = !!expectedDateStr || (solRows.length > 0 && !!solRows[0].date);
        tEval[0].expDateStr = expectedDateStr;
        
        if (expectedDateStr) tEval[0].dateCorrect = sDateVal.toLowerCase() === expectedDateStr.toLowerCase();
        else tEval[0].dateCorrect = sDateVal === "";
        
        if (tEval[0].dateCorrect) jeScore++;

        // Evaluate Debits and Credits flexibily
        for (let r=0; r < rowCount - 1; r++) {
            const sr = (studentAns && studentAns.JE && studentAns.JE[`t${tIdx}_r${r}`]) || {};
            const sAcct = (sr.acct || "");
            const sAcctClean = sAcct.trim().toLowerCase();
            const sDr = cleanAmt(sr.dr);
            const sCr = cleanAmt(sr.cr);

            let acctCorrect = false; let drCorrect = false; let crCorrect = false;
            let expAcct = false; let expDr = false; let expCr = false;

            if (sAcctClean || !isNaN(sDr) || !isNaN(sCr)) {
                if (!isNaN(sDr)) {
                    expAcct = true; expDr = true;
                    const match = expDebits.find(ed => !ed.used && ed.acct === sAcctClean);
                    if (match) {
                        match.used = true; acctCorrect = true;
                        if (sDr === match.amt) drCorrect = true;
                    } else {
                        const amtMatch = expDebits.find(ed => !ed.used && ed.amt === sDr);
                        if (amtMatch) { amtMatch.used = true; drCorrect = true; }
                    }
                } else if (!isNaN(sCr)) {
                    expAcct = true; expCr = true;
                    const match = expCredits.find(ec => !ec.used && ec.acct === sAcctClean);
                    if (match) {
                        match.used = true; acctCorrect = sAcct.startsWith("     ");
                        if (sCr === match.amt) crCorrect = true;
                    } else {
                        const amtMatch = expCredits.find(ec => !ec.used && ec.amt === sCr);
                        if (amtMatch) { amtMatch.used = true; crCorrect = true; }
                    }
                } else {
                    expAcct = true;
                    const match = expDebits.find(ed => !ed.used && ed.acct === sAcctClean) || expCredits.find(ec => !ec.used && ec.acct === sAcctClean);
                    if (match) { match.used = true; acctCorrect = true; }
                }
            }
            
            if (acctCorrect) jeScore++;
            if (drCorrect) jeScore++;
            if (crCorrect) jeScore++;

            tEval[r] = { ...tEval[r], acctCorrect, drCorrect, crCorrect, expAcct, expDr, expCr };
        }
        
        // Penalize extra rows
        for (let r=0; r < rowCount - 1; r++) {
            const sr = (studentAns && studentAns.JE && studentAns.JE[`t${tIdx}_r${r}`]) || {};
            const sAcct = (sr.acct || "").trim();
            const sDr = cleanAmt(sr.dr);
            const sCr = cleanAmt(sr.cr);
            if (!tEval[r].acctCorrect && sAcct) { jeMax++; tEval[r].expAcct = true; }
            if (!tEval[r].drCorrect && !isNaN(sDr)) { jeMax++; tEval[r].expDr = true; }
            if (!tEval[r].crCorrect && !isNaN(sCr)) { jeMax++; tEval[r].expCr = true; }
        }

        jeEvals.push(tEval);
    });

    // --- 2. SCE GRADING (STRICT ROW MATCHING + EXTRA ROW PENALTY) ---
    const studentSceRowsObj = (studentAns && studentAns.SCE) ? studentAns.SCE : {};
    let studentMaxRowIdx = -1;
    Object.keys(studentSceRowsObj).forEach(k => {
        const idx = parseInt(k.replace('r',''));
        if (idx > studentMaxRowIdx) studentMaxRowIdx = idx;
    });
    
    const maxRowsToCheck = Math.max(expectedSce.length, studentMaxRowIdx + 1);

    for (let rIdx = 0; rIdx < maxRowsToCheck; rIdx++) {
        const expRow = expectedSce[rIdx];
        const sr = (studentAns && studentAns.SCE && studentAns.SCE[`r${rIdx}`]) ? studentAns.SCE[`r${rIdx}`] : {};
        let sEval = { dateCorrect: false, descCorrect: false, cols: {} };
        
        const isPopulated = sr.date || sr.desc || numericCols.some(c => sr[c.toLowerCase()]);

        if (expRow) {
            // Grade valid expected row
            if (expRow.date !== undefined && expRow.date !== null && String(expRow.date).trim() !== '') {
                sceMax++; sEval.expDate = true;
                
                let expectedFullDate = String(expRow.date).trim().toLowerCase();
                let expectedDayOnly = expectedFullDate.split(' ').pop();
                let studentDate = (sr.date || '').trim().toLowerCase();

                if (rIdx === 1) { // First transaction row needs full date format strictly
                    if (studentDate === expectedFullDate) { sceScore++; sEval.dateCorrect = true; }
                } else { // Subsequent rows can be full Mmm d or just the day d
                    if (studentDate === expectedFullDate || studentDate === expectedDayOnly) { sceScore++; sEval.dateCorrect = true; }
                }
            }
            if (expRow.desc && String(expRow.desc).trim() !== '') {
                sceMax++; sEval.expDesc = true;
                if(sr.desc && String(sr.desc).trim().toLowerCase() === String(expRow.desc).trim().toLowerCase()) { sceScore++; sEval.descCorrect = true; }
            }
            numericCols.forEach(col => {
                const lCol = col.toLowerCase();
                sEval.cols[lCol] = { correct: false, exp: false };
                
                if (expRow[col] !== 0) {
                    sceMax++; sEval.cols[lCol].exp = true;
                    let sVal = parseFloat(String(sr[lCol] || '').replace(/,/g, ''));
                    if (!isNaN(sVal) && sVal === parseFloat(expRow[col])) { sceScore++; sEval.cols[lCol].correct = true; }
                } else if (sr[lCol] !== undefined && sr[lCol] !== '') {
                    let sVal = parseFloat(String(sr[lCol]).replace(/,/g, ''));
                    if(sVal === 0) { sceMax++; sceScore++; sEval.cols[lCol].exp = true; sEval.cols[lCol].correct = true; } 
                    else { sceMax++; sEval.cols[lCol].exp = true; }
                }
            });
        } else {
            // Penalize extra student row natively
            if (isPopulated) {
                if (sr.date) { sceMax++; sEval.expDate = true; }
                if (sr.desc) { sceMax++; sEval.expDesc = true; }
                numericCols.forEach(col => {
                    if (sr[col.toLowerCase()]) { sceMax++; sEval.cols[col.toLowerCase()] = { correct: false, exp: true }; }
                });
            }
        }
        sceEvals.push(sEval);
    }

    return {
        scores: { jeScore, jeMax, sceScore, sceMax, score: jeScore + sceScore, maxScore: jeMax + sceMax },
        jeEvals,
        sceEvals,
        expectedSce
    };
}

export const IntegratedSceHandler = {
    hasTracker: false,
    renderQuestion: (q, qIdx, uiId, savedValue, disabledAttr, dimClass, hiddenClass) => {
        const transactions = q.transactions || [];
        const jHiddenClass = qIdx === 0 ? '' : 'hidden'; 
        
        // Extract all possible unique descriptions for the dropdowns
        const allDescriptions = transactions.flatMap(t => t.solution || []).filter(s => s.isExplanation).map(s => s.account);
        const uniqueDescriptions = [...new Set(allDescriptions)];

        let transContent = '';
        
        // 1. Journal Entries Section
        transactions.forEach((trans, tIdx) => {
            const transUiId = `${uiId}_JE_t${tIdx}`;
            
            const rowCount = trans.rows || (trans.solution ? trans.solution.length : 3);
            const datePlaceholder = tIdx === 0 ? "Mmm d" : "d";

            let rows = '';
            for(let r=0; r < rowCount; r++) {
                const cellKey = `t${tIdx}_r${r}`;
                const cellData = (savedValue && savedValue.JE && savedValue.JE[cellKey]) ? savedValue.JE[cellKey] : { date:'', acct:'', dr:'', cr:'' };
                
                const isRowSaved = Boolean(cellData.date || cellData.acct || cellData.dr || cellData.cr);
                const rowDisabledAttr = (q.isSaved && isRowSaved) ? 'disabled' : '';
                const inputDim = (q.isSaved && isRowSaved) ? 'text-gray-500' : 'text-black';

                let indentStyle = "padding-left: 0.5rem;"; 
                let acctClass = "";
                if (cellData.cr && String(cellData.cr).trim() !== '') {
                    indentStyle = "padding-left: 1.25rem;";
                }

                let dateCellHtml = '';
                let acctCellHtml = '';
                let drCellHtml = '';
                let crCellHtml = '';

                // Last row is strictly mapped to the description dropdown
                if (r === rowCount - 1) {
                    acctCellHtml = `
                        <select name="${transUiId}_r${r}_acct" id="acct-${transUiId}-${r}" class="w-full h-full p-2 text-left outline-none bg-transparent font-mono text-sm transition-all duration-200 ${inputDim} italic text-gray-500" style="padding-left: 2rem;" ${rowDisabledAttr}>
                            <option value="">Select Description...</option>
                            ${uniqueDescriptions.map(d => `<option value="${d}" ${cellData.acct === d ? 'selected' : ''}>${d}</option>`).join('')}
                        </select>
                    `;
                    dateCellHtml = `<input type="hidden" name="${transUiId}_r${r}_date" value="">`;
                    drCellHtml = `<input type="hidden" name="${transUiId}_r${r}_dr" value="">`;
                    crCellHtml = `<input type="hidden" name="${transUiId}_r${r}_cr" value="">`;
                } else {
                    dateCellHtml = `<input type="text" name="${transUiId}_r${r}_date" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${inputDim}" placeholder="${datePlaceholder}" value="${cellData.date}" ${rowDisabledAttr}>`;
                    acctCellHtml = `<input type="text" name="${transUiId}_r${r}_acct" id="acct-${transUiId}-${r}" class="w-full h-full p-2 text-left outline-none bg-transparent font-mono text-sm transition-all duration-200 ${inputDim} ${acctClass}" style="${indentStyle}" placeholder="" value="${cellData.acct}" ${rowDisabledAttr}>`;
                    drCellHtml = `<input type="text" name="${transUiId}_r${r}_dr" id="dr-${transUiId}-${r}" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${inputDim}" placeholder="" value="${cellData.dr}" oninput="window.handleJournalIndent('${transUiId}', ${r})" onblur="window.evaluateMDAS(this)" ${rowDisabledAttr}>`;
                    crCellHtml = `<input type="text" name="${transUiId}_r${r}_cr" id="cr-${transUiId}-${r}" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${inputDim}" placeholder="" value="${cellData.cr}" oninput="window.handleJournalIndent('${transUiId}', ${r})" onblur="window.evaluateMDAS(this)" ${rowDisabledAttr}>`;
                }

                rows += `
                <tr class="border-b border-gray-200 bg-white hover:bg-gray-50">
                    <td class="p-0 border-r border-gray-300 w-24">${dateCellHtml}</td>
                    <td class="p-0 border-r border-gray-300 w-auto relative align-top">${acctCellHtml}</td>
                    <td class="p-0 border-r border-gray-300 w-28">${drCellHtml}</td>
                    <td class="p-0 w-28">${crCellHtml}</td>
                </tr>`;
            }

            transContent += `
                <div id="${transUiId}" class="journal-trans-block w-full mb-6">
                    <div class="bg-blue-50 p-3 rounded mb-2 border border-blue-100 flex justify-between items-center">
                        <div>
                            <span class="text-xs text-blue-500 font-bold uppercase">Transaction ${tIdx + 1}</span>
                            <p class="text-md font-bold text-gray-800">${trans.date} ${trans.description}</p>
                        </div>
                    </div>

                    <div class="w-full overflow-x-auto border border-gray-300 rounded shadow-sm bg-white">
                        <table class="w-full border-collapse table-fixed min-w-[600px]">
                            <thead><tr class="bg-gray-100 text-xs text-gray-600 font-bold uppercase border-b border-gray-300">
                                <th class="py-2 border-r border-gray-300 w-24">Date</th>
                                <th class="py-2 border-r border-gray-300 text-left pl-4 w-auto">Account Titles</th>
                                <th class="py-2 border-r border-gray-300 w-28 text-right pr-2">Debit</th>
                                <th class="py-2 w-28 text-right pr-2">Credit</th>
                            </tr></thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                </div>
            `;
        });

        // 2. SCE Table Section
        const expectedSce = buildExpectedSce(q);
        const expectedSceRowsCount = expectedSce.length;
        let sceRowsHtml = '';
        
        const isMemo = q.topic && q.topic.toLowerCase().includes('memorandum');

        for (let r=0; r < expectedSceRowsCount; r++) {
            const cellKey = `r${r}`;
            const sceData = (savedValue && savedValue.SCE && savedValue.SCE[cellKey]) ? savedValue.SCE[cellKey] : {};
            
            const isSceRowSaved = Boolean(sceData.date || sceData.desc || (isMemo ? ['cap', 'sub', 'prem', 're', 'treasury', 'total'].some(c => sceData[c]) : ['auth', 'unissued', 'sub', 'prem', 're', 'treasury', 'total'].some(c => sceData[c])));
            const sceDisabledAttr = (q.isSaved && isSceRowSaved) ? 'disabled' : '';
            const sceDim = (q.isSaved && isSceRowSaved) ? 'text-gray-500' : 'text-black';
            
            const isBegRow = r === 0;
            const isEndRow = r === expectedSceRowsCount - 1;
            const rowClass = isEndRow ? "border-t-2 border-gray-400 font-bold bg-gray-50" : "border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors";

            let dateInputHtml = '';
            if (isBegRow || isEndRow) {
                dateInputHtml = `<input type="text" name="${uiId}_SCE_r${r}_date" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm text-gray-400 cursor-not-allowed" value="" readonly tabindex="-1">`;
            } else {
                const datePlaceholder = r === 1 ? "Mmm d" : "d";
                dateInputHtml = `<input type="text" name="${uiId}_SCE_r${r}_date" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${sceDim}" placeholder="${datePlaceholder}" value="${sceData.date !== undefined ? sceData.date : ''}" ${sceDisabledAttr}>`;
            }

            sceRowsHtml += `
                <tr class="${rowClass}">
                    <td class="p-0 border-r border-gray-300 w-24">
                        ${dateInputHtml}
                    </td>
                    <td class="p-0 border-r border-gray-300 w-64">
                        <select name="${uiId}_SCE_r${r}_desc" class="w-full p-2 text-left outline-none bg-transparent text-sm ${sceDim}" ${sceDisabledAttr}>
                            <option value="" disabled ${!sceData.desc ? 'selected' : ''}>Select Description...</option>
                            ${sceDescOptions.map(opt => `<option value="${opt}" ${sceData.desc === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                        </select>
                    </td>
                    ${isMemo 
                        ? `<td class="p-0 border-r border-gray-300 w-28"><input type="text" name="${uiId}_SCE_r${r}_cap" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${sceDim}" placeholder="" value="${sceData.cap !== undefined ? sceData.cap : ''}" onblur="window.evaluateMDAS(this)" ${sceDisabledAttr}></td>`
                        : `<td class="p-0 border-r border-gray-300 w-28"><input type="text" name="${uiId}_SCE_r${r}_auth" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${sceDim}" placeholder="" value="${sceData.auth !== undefined ? sceData.auth : ''}" onblur="window.evaluateMDAS(this)" ${sceDisabledAttr}></td>
                           <td class="p-0 border-r border-gray-300 w-28"><input type="text" name="${uiId}_SCE_r${r}_unissued" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${sceDim}" placeholder="" value="${sceData.unissued !== undefined ? sceData.unissued : ''}" onblur="window.evaluateMDAS(this)" ${sceDisabledAttr}></td>`
                    }
                    <td class="p-0 border-r border-gray-300 w-28"><input type="text" name="${uiId}_SCE_r${r}_sub" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${sceDim}" placeholder="" value="${sceData.sub !== undefined ? sceData.sub : ''}" onblur="window.evaluateMDAS(this)" ${sceDisabledAttr}></td>
                    <td class="p-0 border-r border-gray-300 w-28"><input type="text" name="${uiId}_SCE_r${r}_prem" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${sceDim}" placeholder="" value="${sceData.prem !== undefined ? sceData.prem : ''}" onblur="window.evaluateMDAS(this)" ${sceDisabledAttr}></td>
                    <td class="p-0 border-r border-gray-300 w-28"><input type="text" name="${uiId}_SCE_r${r}_re" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${sceDim}" placeholder="" value="${sceData.re !== undefined ? sceData.re : ''}" onblur="window.evaluateMDAS(this)" ${sceDisabledAttr}></td>
                    <td class="p-0 border-r border-gray-300 w-28"><input type="text" name="${uiId}_SCE_r${r}_ts" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${sceDim}" placeholder="" value="${sceData.ts !== undefined ? sceData.ts : ''}" onblur="window.evaluateMDAS(this)" ${sceDisabledAttr}></td>
                    <td class="p-0 w-28"><input type="text" name="${uiId}_SCE_r${r}_total" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm font-bold ${sceDim}" placeholder="" value="${sceData.total !== undefined ? sceData.total : ''}" onblur="window.evaluateMDAS(this)" ${sceDisabledAttr}></td>
                </tr>
            `;
        }

        const sceTableHtml = `
            <div class="mt-8 mb-4">
                <div class="bg-indigo-50 p-3 rounded-t border border-indigo-200 border-b-0">
                    <h3 class="text-sm font-bold text-indigo-900 uppercase tracking-wide"><i class="fas fa-table mr-2"></i>Statement of Changes in Equity</h3>
                    <p class="text-xs text-indigo-700 mt-1">Update the balances below based on the journal entries above. (You may use MDAS formulas in the amount fields!)</p>
                </div>
                <div class="w-full overflow-x-auto border border-gray-300 rounded-b shadow-sm bg-white">
                    <table class="w-full text-left whitespace-nowrap min-w-[1000px]">
                        <thead class="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200 text-xs">
                            <tr>
                                <th class="px-2 py-2 text-center border-r border-slate-300">Date</th>
                                <th class="px-2 py-2 text-left border-r border-slate-300">Transaction / Movement</th>
                                ${isMemo 
                                    ? `<th class="px-2 py-2 text-right border-r border-slate-300">Capital<br>Stock</th>`
                                    : `<th class="px-2 py-2 text-right border-r border-slate-300">Authorized<br>Capital</th>
                                       <th class="px-2 py-2 text-right border-r border-slate-300">Unissued<br>Capital</th>`
                                }
                                <th class="px-2 py-2 text-right border-r border-slate-300">Subscribed<br>Stock</th>
                                <th class="px-2 py-2 text-right border-r border-slate-300">Share<br>Premium</th>
                                <th class="px-2 py-2 text-right border-r border-slate-300">Retained<br>Earnings</th>
                                <th class="px-2 py-2 text-right border-r border-slate-300">Treasury<br>Shares</th>
                                <th class="px-2 py-2 text-right font-bold text-indigo-700 bg-indigo-50/50">Total<br>Equity</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sceRowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        return `
            <div id="${uiId}" class="question-block w-full ${jHiddenClass}" data-is-integrated="true">
                <div class="bg-white rounded shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
                     <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Part 1: Journalizing</h2>
                     ${transContent}
                     
                     <h2 class="text-xl font-bold text-gray-800 mt-10 mb-4 border-b pb-2">Part 2: Preparing Statement of Changes in Equity</h2>
                     ${sceTableHtml}
                </div>
            </div>
        `;
    },
    initInteractivity: (section) => {},
    checkCompletion: (uiId, form) => {
        const jeInputs = form.querySelectorAll(`input[name^="${uiId}_JE_"], select[name^="${uiId}_JE_"]`);
        const sceInputs = form.querySelectorAll(`input[name^="${uiId}_SCE_"], select[name^="${uiId}_SCE_"]`);
        
        let hasJeData = false;
        jeInputs.forEach(i => { if(i.value && i.value.trim() !== '') hasJeData = true; });
        
        let hasSceData = false;
        sceInputs.forEach(i => { if(i.value && i.value.trim() !== '') hasSceData = true; });

        return hasJeData && hasSceData;
    },
    extractData: (uiId, formData, form) => {
        let integratedValue = { JE: {}, SCE: {} };
        let hasIntegratedData = false;

        const jeInputs = document.querySelectorAll(`input[name^="${uiId}_JE_"], select[name^="${uiId}_JE_"]`);
        jeInputs.forEach(input => {
            if(input.value) hasIntegratedData = true;
            const parts = input.name.split('_'); 
            const tIdx = parts[3]; const rIdx = parts[4]; const field = parts[5];
            const key = `${tIdx}_${rIdx}`;
            if(!integratedValue.JE[key]) integratedValue.JE[key] = {};
            integratedValue.JE[key][field] = input.value;
        });

        const sceInputs = document.querySelectorAll(`input[name^="${uiId}_SCE_"], select[name^="${uiId}_SCE_"]`);
        sceInputs.forEach(input => {
            if(input.value) hasIntegratedData = true;
            const parts = input.name.split('_');
            const rIdx = parts[3]; const field = parts[4];
            if(!integratedValue.SCE[rIdx]) integratedValue.SCE[rIdx] = {};
            integratedValue.SCE[rIdx][field] = input.value;
        });

        return { value: integratedValue, hasValue: hasIntegratedData };
    },
    grade: (q, studentAns, liveQ) => {
        const res = gradeIntegratedSce(studentAns, liveQ);
        return { score: res.scores.score, maxScore: res.scores.maxScore, details: res };
    }
};
