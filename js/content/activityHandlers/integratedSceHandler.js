const sceDescOptions = [
    "Beginning Balance",
    "Authorization of common shares",
    "Authorization of Preferred shares",
    "Subscription of common shares",
    "Subscription of preferred shares",
    "Issuance of common shares",
    "Issuance of preferred shares",
    "Acquisition of treasury shares",
    "Reissuance of treasury shares",
    "Ending Balance"
];

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

export const IntegratedSceHandler = {
    hasTracker: false,
    renderQuestion: (q, qIdx, uiId, savedValue, disabledAttr, dimClass, hiddenClass) => {
        const transactions = q.transactions || [];
        const jHiddenClass = qIdx === 0 ? '' : 'hidden'; 
        
        let transContent = '';
        
        // 1. Journal Entries Section
        transactions.forEach((trans, tIdx) => {
            const transUiId = `${uiId}_JE_t${tIdx}`;
            
            const rowCount = trans.rows || 2;
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

                rows += `
                <tr class="border-b border-gray-200 bg-white hover:bg-gray-50">
                    <td class="p-0 border-r border-gray-300 w-24"><input type="text" name="${transUiId}_r${r}_date" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${inputDim}" placeholder="" value="${cellData.date}" ${rowDisabledAttr}></td>
                    <td class="p-0 border-r border-gray-300 w-auto relative align-top"><input type="text" name="${transUiId}_r${r}_acct" id="acct-${transUiId}-${r}" class="w-full h-full p-2 text-left outline-none bg-transparent font-mono text-sm transition-all duration-200 ${inputDim} ${acctClass}" style="${indentStyle}" placeholder="" value="${cellData.acct}" ${rowDisabledAttr}></td>
                    <td class="p-0 border-r border-gray-300 w-28"><input type="text" name="${transUiId}_r${r}_dr" id="dr-${transUiId}-${r}" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${inputDim}" placeholder="" value="${cellData.dr}" oninput="window.handleJournalIndent('${transUiId}', ${r})" onblur="window.evaluateMDAS(this)" ${rowDisabledAttr}></td>
                    <td class="p-0 w-28"><input type="text" name="${transUiId}_r${r}_cr" id="cr-${transUiId}-${r}" class="w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${inputDim}" placeholder="" value="${cellData.cr}" oninput="window.handleJournalIndent('${transUiId}', ${r})" onblur="window.evaluateMDAS(this)" ${rowDisabledAttr}></td>
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
        const descOptionsHtml = sceDescOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('');

        for (let r=0; r < expectedSceRowsCount; r++) {
            const cellKey = `r${r}`;
            const sceData = (savedValue && savedValue.SCE && savedValue.SCE[cellKey]) ? savedValue.SCE[cellKey] : {};
            
            const isSceRowSaved = Object.keys(sceData).length > 0;
            const sceDisabledAttr = (q.isSaved && isSceRowSaved) ? 'disabled' : '';
            const sceDim = (q.isSaved && isSceRowSaved) ? 'text-gray-500' : 'text-black';
            
            const isEndRow = r === expectedSceRowsCount - 1;
            const rowClass = isEndRow ? "border-t-2 border-gray-400 font-bold bg-gray-50" : "border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors";

            sceRowsHtml += `
                <tr class="${rowClass}">
                    <td class="p-0 border-r border-gray-300 w-24">
                        <input type="text" name="${uiId}_SCE_r${r}_date" class="w-full p-2 text-center outline-none bg-transparent font-mono text-sm ${sceDim}" placeholder="Mmm d" value="${sceData.date !== undefined ? sceData.date : ''}" ${sceDisabledAttr}>
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
    initInteractivity: (section) => {
        // Interactivity handling is managed directly via the question buttons for this specific integrated format
    },
    checkCompletion: (uiId, form) => {
        const jeInputs = form.querySelectorAll(`input[name^="${uiId}_JE_"]`);
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

        const jeInputs = document.querySelectorAll(`input[name^="${uiId}_JE_"]`);
        jeInputs.forEach(input => {
            if(input.value) hasIntegratedData = true;
            const parts = input.name.split('_'); 
            const tIdx = parts[3];
            const rIdx = parts[4];
            const field = parts[5];
            const key = `${tIdx}_${rIdx}`;
            if(!integratedValue.JE[key]) integratedValue.JE[key] = {};
            integratedValue.JE[key][field] = input.value;
        });

        const sceInputs = document.querySelectorAll(`input[name^="${uiId}_SCE_"], select[name^="${uiId}_SCE_"]`);
        sceInputs.forEach(input => {
            if(input.value) hasIntegratedData = true;
            const parts = input.name.split('_');
            const rIdx = parts[3];
            const field = parts[4];
            if(!integratedValue.SCE[rIdx]) integratedValue.SCE[rIdx] = {};
            integratedValue.SCE[rIdx][field] = input.value;
        });

        return { value: integratedValue, hasValue: hasIntegratedData };
    },
    grade: (q, studentAns, liveQ) => {
        const expectedSce = buildExpectedSce(liveQ);
        const isMemo = liveQ.topic && liveQ.topic.toLowerCase().includes('memorandum');
        const numericCols = isMemo ? ['Cap', 'Sub', 'Prem', 'RE', 'Treasury', 'Total'] : ['Auth', 'Unissued', 'Sub', 'Prem', 'RE', 'Treasury', 'Total'];

        let jeScore = 0; let jeMax = 0;
        let sceScore = 0; let sceMax = 0;
        
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

        return { 
            score: jeScore + sceScore, 
            maxScore: jeMax + sceMax, 
            details: { jeScore, jeMax, sceScore, sceMax } 
        };
    }
};
