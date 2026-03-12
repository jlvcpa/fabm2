export const JournalizingHandler = {
    hasTracker: false,
    renderQuestion: (q, qIdx, uiId, savedValue, disabledAttr, dimClass, hiddenClass) => {
        const transactions = q.transactions || [];
        const jHiddenClass = qIdx === 0 ? '' : 'hidden'; 
        
        let transTrackerList = '';
        let transContent = '';

        transactions.forEach((trans, tIdx) => {
            const transUiId = `${uiId}_t${tIdx}`;
            const tHidden = tIdx === 0 ? '' : 'hidden';
            const tActive = tIdx === 0 ? 'bg-blue-100 border-l-4 border-blue-600 text-blue-800' : 'bg-white border-l-4 border-transparent text-gray-600 hover:bg-gray-50';

            transTrackerList += `
                <button type="button" class="trans-tracker-btn w-full text-left p-3 border-b border-gray-100 text-xs md:text-sm font-medium transition-colors focus:outline-none ${tActive}" data-target-trans="${transUiId}" data-t-index="${tIdx}">
                    <div class="font-bold whitespace-nowrap">${trans.date}</div>
                    <div class="whitespace-normal opacity-80 text-xs">${trans.description}</div>
                </button>
            `;

            const rowCount = trans.rows || 2;
            let rows = '';
            for(let r=0; r < rowCount; r++) {
                const cellKey = `t${tIdx}_r${r}`;
                const cellData = (savedValue && savedValue[cellKey]) ? savedValue[cellKey] : { date:'', acct:'', dr:'', cr:'' };
                
                const isRowSaved = Boolean(cellData.date || cellData.acct || cellData.dr || cellData.cr);
                const rowDisabledAttr = (q.isSaved && isRowSaved) ? 'disabled' : '';
                const inputDim = (q.isSaved && isRowSaved) ? 'text-gray-500' : 'text-black';

                rows += `
                <tr class="border-b border-gray-200 bg-white">
                    <td class="p-0 border-r border-gray-300 w-24"><input type="text" name="${transUiId}_r${r}_date" class="input-checker w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${inputDim}" placeholder="" value="${cellData.date}" ${rowDisabledAttr}></td>
                    <td class="p-0 border-r border-gray-300 w-auto"><input type="text" name="${transUiId}_r${r}_acct" id="acct-${transUiId}-${r}" class="input-checker w-full p-2 text-left outline-none bg-transparent font-mono text-sm ${inputDim}" placeholder="" value="${cellData.acct}" ${rowDisabledAttr}></td>
                    <td class="p-0 border-r border-gray-300 w-28"><input type="text" name="${transUiId}_r${r}_dr" id="dr-${transUiId}-${r}" class="input-checker w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${inputDim}" placeholder="" value="${cellData.dr}" oninput="window.handleJournalIndent('${transUiId}', ${r})" onblur="window.evaluateMDAS(this)" ${rowDisabledAttr}></td>
                    <td class="p-0 w-28"><input type="text" name="${transUiId}_r${r}_cr" id="cr-${transUiId}-${r}" class="input-checker w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${inputDim}" placeholder="" value="${cellData.cr}" oninput="window.handleJournalIndent('${transUiId}', ${r})" onblur="window.evaluateMDAS(this)" ${rowDisabledAttr}></td>
                </tr>`;
            }

            transContent += `
                <div id="${transUiId}" class="journal-trans-block w-full ${tHidden}">
                    <div class="bg-blue-50 p-3 rounded mb-3 border border-blue-100">
                        <span class="text-xs text-blue-500 font-bold uppercase">Transaction Details</span>
                        <p class="text-md font-bold text-gray-800">${trans.date} ${trans.description}</p>
                    </div>
                    <div class="w-full overflow-x-auto border border-gray-300 rounded shadow-sm bg-white mb-2">
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
                    <div class="flex justify-between items-center mt-4 mb-2">
                        <div>
                            ${tIdx > 0 ? `<button type="button" class="btn-prev-trans px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium border border-gray-300" data-target-idx="${tIdx - 1}"><i class="fas fa-chevron-left mr-1"></i> Previous Transaction</button>` : ''}
                        </div>
                        <div>
                            ${tIdx < transactions.length - 1 ? `<button type="button" class="btn-next-trans px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium shadow-sm" data-target-idx="${tIdx + 1}">Next Transaction <i class="fas fa-chevron-right ml-1"></i></button>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        return `
            <div id="${uiId}" class="question-block w-full ${jHiddenClass}" data-is-journal="true">
                <div class="bg-white rounded shadow-sm border border-gray-200 flex flex-col md:flex-row overflow-hidden">
                     <div class="flex-1 p-0 md:p-0 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col">
                         <div class="p-4 md:p-2 flex-1">
                             ${transContent}
                             <div class="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                                  <button type="button" class="nav-prev-btn px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">Previous Question</button>
                                  <button type="button" class="nav-next-btn px-3 py-1 bg-blue-800 text-white rounded text-sm hover:bg-blue-900">Next Question</button>
                             </div>
                         </div>
                     </div>
                     <div class="w-full md:w-64 bg-gray-50 flex flex-col max-h-64 md:max-h-full overflow-y-auto">
                        <div class="p-2 bg-gray-100 font-bold text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 sticky top-0">
                            Transactions
                        </div>
                        <div class="flex-1">
                            ${transTrackerList}
                        </div>
                     </div>
                </div>
            </div>
        `;
    },
    initInteractivity: (section) => {
        const questions = section.querySelectorAll('.question-block');
        const prevQuestionBtns = section.querySelectorAll('.nav-prev-btn');
        const nextQuestionBtns = section.querySelectorAll('.nav-next-btn');
        let currentJournalIndex = 0;

        function showJournalQuestion(index) {
            questions.forEach((q, i) => {
                if (i === index) q.classList.remove('hidden');
                else q.classList.add('hidden');
            });
            currentJournalIndex = index;
        }

        prevQuestionBtns.forEach(btn => btn.addEventListener('click', () => { if (currentJournalIndex > 0) showJournalQuestion(currentJournalIndex - 1); }));
        nextQuestionBtns.forEach(btn => btn.addEventListener('click', () => { if (currentJournalIndex < questions.length - 1) showJournalQuestion(currentJournalIndex + 1); }));
        
        questions.forEach(qBlock => {
            const transBtns = qBlock.querySelectorAll('.trans-tracker-btn');
            const transBlocks = qBlock.querySelectorAll('.journal-trans-block');
            const internalPrevBtns = qBlock.querySelectorAll('.btn-prev-trans');
            const internalNextBtns = qBlock.querySelectorAll('.btn-next-trans');

            const switchTransaction = (idx) => {
                  transBlocks.forEach(b => b.classList.add('hidden'));
                  if(transBlocks[idx]) transBlocks[idx].classList.remove('hidden');

                  transBtns.forEach((b, bIdx) => {
                      if (bIdx === idx) {
                          b.className = 'trans-tracker-btn w-full text-left p-3 border-b border-gray-100 text-xs md:text-sm font-medium transition-colors focus:outline-none bg-blue-100 border-l-4 border-blue-600 text-blue-800';
                      } else {
                          if (b.dataset.isAnswered === "true") {
                              b.className = 'trans-tracker-btn w-full text-left p-3 border-b border-gray-100 text-xs md:text-sm font-medium transition-colors focus:outline-none bg-green-50 border-l-4 border-green-500 text-green-700 hover:bg-green-100';
                          } else {
                              b.className = 'trans-tracker-btn w-full text-left p-3 border-b border-gray-100 text-xs md:text-sm font-medium transition-colors focus:outline-none bg-white border-l-4 border-transparent text-gray-600 hover:bg-gray-50';
                          }
                      }
                  });
            };
            
            transBtns.forEach((btn, idx) => btn.addEventListener('click', () => switchTransaction(idx)));
            internalPrevBtns.forEach(btn => btn.addEventListener('click', () => switchTransaction(parseInt(btn.dataset.targetIdx))));
            internalNextBtns.forEach(btn => btn.addEventListener('click', () => switchTransaction(parseInt(btn.dataset.targetIdx))));
        });
    },
    checkCompletion: (uiId, form) => {
        const transBtns = document.querySelectorAll(`button[data-target-trans^="${uiId}_t"]`);
        let allTransAnswered = true; 
        if (transBtns.length === 0) allTransAnswered = false;

        transBtns.forEach(btn => {
            const transUiId = btn.dataset.targetTrans;
            const inputs = form.querySelectorAll(`input[name^="${transUiId}"]`);
            
            let transHasData = false;
            inputs.forEach(i => { if(i.value && i.value.trim() !== '') transHasData = true; }); 
            
            btn.dataset.isAnswered = transHasData ? "true" : "false";
            if (!transHasData) allTransAnswered = false; 
            
            if (!btn.classList.contains('bg-blue-100')) {
                btn.className = transHasData
                    ? 'trans-tracker-btn w-full text-left p-3 border-b border-gray-100 text-xs md:text-sm font-medium transition-colors focus:outline-none bg-green-50 border-l-4 border-green-500 text-green-700 hover:bg-green-100'
                    : 'trans-tracker-btn w-full text-left p-3 border-b border-gray-100 text-xs md:text-sm font-medium transition-colors focus:outline-none bg-white border-l-4 border-transparent text-gray-600 hover:bg-gray-50';
            }
        });
        return allTransAnswered;
    },
    extractData: (uiId, formData, form) => {
        const inputs = document.querySelectorAll(`input[name^="${uiId}"]`);
        let currentRow = {};
        let hasValue = false;
        inputs.forEach(input => {
            if(input.value && input.value.trim() !== '') hasValue = true;
            const name = input.name;
            const parts = name.split('_'); 
            const tIdx = parts[2];
            const rIdx = parts[3];
            const field = parts[4];
            const key = `${tIdx}_${rIdx}`;
            if(!currentRow[key]) currentRow[key] = {};
            currentRow[key][field] = input.value;
        });
        return { value: currentRow, hasValue };
    }
};
