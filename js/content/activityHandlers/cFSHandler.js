// Helper function to turn raw string data into beautiful financial tables
const formatQuestionText = (text) => {
    if (!text.includes("ASSETS") && !text.includes("Liabilities")) return `<p class="whitespace-pre-wrap">${text}</p>`;
    
    let htmlStr = '';
    const sections = text.split(/\n\s*\n/);
    
    sections.forEach(sec => {
        const lines = sec.trim().split('\n').map(l => l.trim()).filter(l => l);
        if (!lines.length) return;
        
        const header = lines[0];
        
        // Render Balance Sheet Sections
        if (header === "ASSETS" || header.includes("Liabilities and Equity")) {
            htmlStr += `<div class="mb-4"><h4 class="font-bold text-center border-b-2 border-gray-800 pb-1 mb-1 uppercase text-gray-800 tracking-wider">${header}</h4><table class="w-full text-sm font-mono max-w-2xl mx-auto">`;
            
            let y1 = "Current", y2 = "Prior";
            if(lines[1] && lines[1].includes('=')) {
                const matches = lines[1].match(/\d{4}/g);
                if(matches && matches.length >= 2) {
                    y1 = matches[0]; y2 = matches[1];
                }
            }
            
            htmlStr += `<thead><tr class="border-b border-gray-400 text-gray-700"><th class="text-left pb-1 pt-1 font-bold">Account</th><th class="text-right w-28 pb-1 pt-1 font-bold">${y1}</th><th class="text-right w-28 pb-1 pt-1 font-bold">${y2}</th></tr></thead><tbody>`;
            
            for(let i=1; i<lines.length; i++) {
                if(lines[i].includes(':')) {
                    let [acct, vals] = lines[i].split(':');
                    let v1 = "-", v2 = "-";
                    let valParts = vals.split(';');
                    if(valParts.length > 0) v1 = valParts[0].split('=')[1] || valParts[0];
                    if(valParts.length > 1) v2 = valParts[1].split('=')[1] || valParts[1];
                    
                    const formatVal = (v) => {
                        let n = parseFloat((v||'').replace(/,/g,'').trim());
                        if(isNaN(n)) return v;
                        return n < 0 ? `(${Math.abs(n).toLocaleString('en-US')})` : n.toLocaleString('en-US');
                    };
                    
                    const isTotal = acct.toLowerCase().includes('total');
                    const rowClass = isTotal ? "font-bold text-gray-900 border-t-2 border-b-4 border-double border-gray-800" : "hover:bg-gray-50 border-b border-gray-100 text-gray-700";
                    
                    // Reduced py-1.5 to py-0.5 for tighter row spacing
                    htmlStr += `<tr class="${rowClass}"><td class="text-left py-0.5">${acct.trim()}</td><td class="text-right py-0.5">${formatVal(v1)}</td><td class="text-right py-0.5">${formatVal(v2)}</td></tr>`;
                } else {
                    htmlStr += `<tr><td colspan="3" class="text-left pt-2 pb-0.5 font-bold text-gray-800">${lines[i]}</td></tr>`;
                }
            }
            htmlStr += `</tbody></table></div>`;
        } 
        // Render Income Statement Section
        else if (header === "Income Statement") {
            htmlStr += `<div class="mb-4"><h4 class="font-bold text-center border-b-2 border-gray-800 pb-1 mb-1 uppercase text-gray-800 tracking-wider">${header}</h4><table class="w-full text-sm font-mono max-w-lg mx-auto"><tbody>`;
            for(let i=1; i<lines.length; i++) {
                if(lines[i].includes(':')) {
                    let [acct, val] = lines[i].split(':');
                    let num = parseFloat((val||'').replace(/,/g,'').trim());
                    let fmtVal = isNaN(num) ? val : (num < 0 ? `(${Math.abs(num).toLocaleString('en-US')})` : num.toLocaleString('en-US'));
                    let isTotal = acct.toLowerCase().includes('income') || acct.toLowerCase().includes('gross');
                    
                    // Reduced py-1.5 to py-0.5 for tighter row spacing
                    htmlStr += `<tr class="hover:bg-gray-50 border-b border-gray-100 ${isTotal ? 'font-bold text-gray-900 border-t-2' : 'text-gray-700'}"><td class="text-left py-0.5">${acct.trim()}</td><td class="text-right py-0.5 w-32">${fmtVal}</td></tr>`;
                }
            }
            htmlStr += `</tbody></table></div>`;
        } 
        // Render Text/List Info
        else {
            if (header.includes("Additional information")) {
                htmlStr += `<div class="mt-4 bg-blue-50 p-3 rounded border border-blue-100"><h4 class="font-bold text-blue-900 border-b border-blue-200 pb-1 mb-2 uppercase tracking-wide">${header}</h4><ul class="list-none space-y-1 text-sm text-blue-800">`;
                for(let i=1; i<lines.length; i++) {
                    htmlStr += `<li>${lines[i]}</li>`;
                }
                htmlStr += `</ul></div>`;
            } else {
                htmlStr += `<div class="mb-3 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">${sec}</div>`;
            }
        }
    });
    return htmlStr;
};

export const CFSHandler = {
    hasTracker: true,
    renderTracker: (q, qIdx, uiId) => {
        const trackerClass = q.isSaved 
            ? "tracker-btn w-9 h-9 m-0.5 rounded-full border border-green-500 bg-green-100 text-green-700 font-bold flex items-center justify-center"
            : (qIdx === 0 ? 'tracker-btn w-9 h-9 m-0.5 rounded-full border bg-blue-600 text-white border-blue-600 font-bold flex items-center justify-center ring-2 ring-blue-300' : 'tracker-btn w-9 h-9 m-0.5 rounded-full border bg-white text-gray-700 border-gray-300 font-bold flex items-center justify-center hover:bg-blue-100');
        return `<button type="button" class="${trackerClass}" data-target-question="${uiId}" ${q.isSaved ? 'data-is-answered="true"' : ''}>${qIdx + 1}</button>`;
    },
    
    renderQuestion: (q, qIdx, uiId, savedValue, disabledAttr, dimClass, hiddenClass) => {
        let saved = { headers: ["", "", ""], body: [] };
        if (savedValue && typeof savedValue === 'string') {
            try { saved = JSON.parse(savedValue); } catch(e){}
        } else if (savedValue && typeof savedValue === 'object') {
            saved = savedValue;
        }
        
        if(!saved.headers || saved.headers.length < 3) saved.headers = ["", "", ""];
        if(!saved.body || saved.body.length === 0) saved.body = [{desc: '', amt: ''}, {desc: '', amt: ''}, {desc: '', amt: ''}];

        const optionsHtml = (q.options || []).map(opt => `<option value="${opt}">${opt}</option>`).join('');
        const noAmountHeaders = ["Cash flow from Operating Activities:", "Cash flow from Investing Activities:", "Cash flow from Financing Activities:"];

        // Apply lock/dim only if the specific input HAS a value when saved
        const getLock = (val) => (disabledAttr && val.toString().trim() !== '') ? 'disabled' : '';
        const getDim = (val) => (disabledAttr && val.toString().trim() !== '') ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent';

        const headerHtml = `
            <div class="mb-5 flex flex-col items-center w-full max-w-lg mx-auto gap-2">
                <input type="text" class="cfs-head text-center w-full font-bold border-b-2 border-gray-400 outline-none focus:border-blue-500 ${getDim(saved.headers[0])}" placeholder="Company Name" value="${saved.headers[0]}" ${getLock(saved.headers[0])}>
                <input type="text" class="cfs-head text-center w-full font-bold border-b border-gray-400 outline-none focus:border-blue-500 ${getDim(saved.headers[1])}" placeholder="Statement of Cash Flows" value="${saved.headers[1]}" ${getLock(saved.headers[1])}>
                <input type="text" class="cfs-head text-center w-full border-b border-gray-400 outline-none focus:border-blue-500 text-sm ${getDim(saved.headers[2])}" placeholder="For the year ended..." value="${saved.headers[2]}" ${getLock(saved.headers[2])}>
            </div>
        `;

        const rowHtml = saved.body.map(row => `
            <div class="cfs-row flex items-end gap-2 w-full mb-1">
                <select class="cfs-desc flex-1 border-b border-gray-400 outline-none text-sm py-1 ${getDim(row.desc)}" ${getLock(row.desc)} data-saved="${row.desc}">
                    <option value="">-- Select Line Description --</option>
                    ${optionsHtml}
                </select>
                <input type="text" class="cfs-amt w-40 text-right border-b border-gray-400 outline-none text-sm py-1 font-mono ${getDim(row.amt)} ${noAmountHeaders.includes(row.desc) ? 'hidden' : ''}" placeholder="Amount" value="${row.amt}" onblur="window.evaluateMDAS(this)" ${getLock(row.amt)}>
                ${(!disabledAttr || (!row.desc && !row.amt)) ? `<button type="button" class="cfs-del-row text-red-400 hover:text-red-600 px-2"><i class="fas fa-times"></i></button>` : `<div class="px-2 w-7 shrink-0"></div>`}
            </div>
        `).join('');

        const formattedQuestionData = formatQuestionText(q.questionText || q.question);

        const innerContent = `
            <div class="w-full mt-6 mb-4">
                <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Answerspace</h4>
                <div class="w-full overflow-x-auto bg-white border border-gray-300 rounded shadow-inner pb-4 pt-4 px-4">
                    <div class="min-w-[600px]">
                        ${headerHtml}
                        <div class="cfs-body-container flex flex-col w-full max-w-3xl mx-auto">
                            ${rowHtml}
                        </div>
                        <button type="button" class="cfs-add-row mt-6 px-4 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold rounded shadow-sm hover:bg-blue-50 hover:text-blue-700 transition">+ Add Empty Line</button>
                    </div>
                </div>
            </div>
            
            <template class="cfs-row-template">
                <div class="cfs-row flex items-end gap-3 w-full mb-1 mt-2 animate-fade-in">
                    <select class="cfs-desc flex-1 border-b border-gray-400 outline-none text-sm py-1 bg-transparent">
                        <option value="">-- Select Line Description --</option>
                        ${optionsHtml}
                    </select>
                    <input type="text" class="cfs-amt w-40 text-right border-b border-gray-400 outline-none text-sm py-1 bg-transparent font-mono" placeholder="Amount" onblur="window.evaluateMDAS(this)">
                    <button type="button" class="cfs-del-row text-red-400 hover:text-red-600 px-2"><i class="fas fa-times"></i></button>
                </div>
            </template>
        `;

        return `
            <div id="${uiId}" class="question-block w-full ${hiddenClass}">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div class="p-5 md:p-8">
                        <div class="mb-6">
                            <span class="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded mb-3">Question ${qIdx+1}</span>
                            <div class="text-base text-gray-800 mt-1 leading-snug">${formattedQuestionData}</div>
                        </div>
                        
                        ${innerContent}
                        
                        <div class="mt-8 pt-5 border-t border-gray-100 flex justify-between">
                            <button type="button" class="nav-prev-btn text-gray-600 hover:text-blue-800 text-sm font-medium px-4 py-2 rounded hover:bg-gray-100 transition"><i class="fas fa-arrow-left mr-2"></i> Previous</button>
                            <button type="button" class="nav-next-btn bg-blue-800 text-white text-sm font-medium px-6 py-2 rounded hover:bg-blue-900 shadow transition">Next <i class="fas fa-arrow-right ml-2"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    initInteractivity: (section) => {
        const questions = section.querySelectorAll('.question-block');
        const trackers = section.querySelectorAll('.tracker-btn');
        const prevBtns = section.querySelectorAll('.nav-prev-btn');
        const nextBtns = section.querySelectorAll('.nav-next-btn');
        
        let currentIndex = 0;
        for (let i = 0; i < trackers.length; i++) {
            if (trackers[i].dataset.isAnswered !== "true") { currentIndex = i; break; }
        }

        function showQuestion(index) {
            questions.forEach((q, i) => {
                if (i === index) q.classList.remove('hidden');
                else q.classList.add('hidden');
            });
            trackers.forEach((t, i) => {
                t.className = "tracker-btn w-9 h-9 m-0.5 rounded-full border font-bold flex items-center justify-center focus:outline-none transition-colors";
                if (i === index) t.classList.add('bg-blue-600', 'text-white', 'border-blue-600', 'ring-2', 'ring-blue-300');
                else if (t.dataset.isAnswered === "true") t.classList.add('bg-green-100', 'text-green-700', 'border-green-500');
                else t.classList.add('bg-white', 'text-gray-700', 'border-gray-300', 'hover:bg-blue-100');
            });
            currentIndex = index;
        }
        
        if (questions.length > 0) showQuestion(currentIndex); 
        trackers.forEach((t, idx) => t.addEventListener('click', () => showQuestion(idx)));
        prevBtns.forEach(btn => btn.addEventListener('click', () => { if (currentIndex > 0) showQuestion(currentIndex - 1); }));
        nextBtns.forEach(btn => btn.addEventListener('click', () => { if (currentIndex < questions.length - 1) showQuestion(currentIndex + 1); }));

        // Dynamic Formatting Logic for Dropdowns
        const noIndent = ["Cash flow from Operating Activities:", "Cash flow from Investing Activities:", "Cash flow from Financing Activities:", "Net cash increase during the year", "Net cash decrease during the year", "Cash Balance Beginning", "Cash Balance ending"];
        const doubleTopSingleBot = ["Net Cash inflow from Operating Activities", "Net Cash outflow from Operating Activities", "Net Cash inflow from Investing Activities", "Net Cash outflow from Investing Activities", "Net Cash inflow from Financing Activities", "Net Cash outflow from Financing Activities"];
        const singleTopDoubleBot = ["Cash Balance ending"];
        
        // Items that should NOT have an amount input
        const noAmountHeaders = ["Cash flow from Operating Activities:", "Cash flow from Investing Activities:", "Cash flow from Financing Activities:"];

        const applyFormatting = (selectEl, amtEl) => {
            const val = selectEl.value;
            
            // Handle Indentation
            if(noIndent.includes(val)) {
                selectEl.style.paddingLeft = '0';
                selectEl.style.fontWeight = 'bold';
            } else if (val) {
                selectEl.style.paddingLeft = '24px';
                selectEl.style.fontWeight = 'normal';
            }

            // Save the base classes to reapply safely
            const baseAmtClasses = "cfs-amt w-40 text-right outline-none text-sm py-1 font-mono ";
            const colorClass = amtEl.classList.contains('bg-gray-100') ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent';
            
            amtEl.className = baseAmtClasses + colorClass;
            
            // Hide amount input for headers completely
            if(noAmountHeaders.includes(val)) {
                amtEl.classList.add('hidden');
                amtEl.value = ''; 
            } else {
                amtEl.classList.remove('hidden');
                // Apply specific border styles when visible
                if(doubleTopSingleBot.includes(val)) {
                    amtEl.classList.add('border-t-4', 'border-double', 'border-b', 'border-gray-800', 'mt-2');
                } else if(singleTopDoubleBot.includes(val)) {
                    amtEl.classList.add('border-t', 'border-gray-800', 'border-b-4', 'border-double', 'mt-2');
                } else {
                    amtEl.classList.add('border-b', 'border-gray-400');
                }
            }
        };

        // Attach listeners for dynamic rows
        section.addEventListener('change', (e) => {
            if(e.target.classList.contains('cfs-desc')) {
                const amtEl = e.target.closest('.cfs-row').querySelector('.cfs-amt');
                applyFormatting(e.target, amtEl);
            }
        });

        // Add/Delete Row Logic
        section.addEventListener('click', (e) => {
            if(e.target.closest('.cfs-add-row')) {
                const container = e.target.closest('.question-block').querySelector('.cfs-body-container');
                const tmpl = e.target.closest('.question-block').querySelector('.cfs-row-template');
                const clone = tmpl.content.cloneNode(true);
                container.appendChild(clone);
            }
            if(e.target.closest('.cfs-del-row')) {
                e.target.closest('.cfs-row').remove();
            }
        });

        // Initialize saved dropdown formatting on load
        section.querySelectorAll('.cfs-desc').forEach(selectEl => {
            if(selectEl.dataset.saved) selectEl.value = selectEl.dataset.saved;
            const amtEl = selectEl.closest('.cfs-row').querySelector('.cfs-amt');
            applyFormatting(selectEl, amtEl);
        });
    },
    
    checkCompletion: (uiId, form) => {
        const container = form.querySelector(`#${uiId}`);
        if(!container) return false;
        
        let isAnswered = false;
        container.querySelectorAll('.cfs-head').forEach(input => { if(input.value.trim() !== '') isAnswered = true; });
        container.querySelectorAll('.cfs-row').forEach(row => {
            if(row.querySelector('.cfs-desc').value !== '' || row.querySelector('.cfs-amt').value.trim() !== '') isAnswered = true;
        });

        const trackerBtn = form.closest('.flex-col')?.querySelector(`button[data-target-question="${uiId}"]`);
        if (trackerBtn) {
            trackerBtn.dataset.isAnswered = isAnswered ? "true" : "false";
            if (!trackerBtn.classList.contains('bg-blue-600')) {
                trackerBtn.className = isAnswered 
                    ? "tracker-btn w-9 h-9 m-0.5 rounded-full border border-green-500 bg-green-100 text-green-700 font-bold flex items-center justify-center"
                    : "tracker-btn w-9 h-9 m-0.5 rounded-full border border-gray-300 bg-white text-gray-700 font-bold flex items-center justify-center hover:bg-blue-100";
            }
        }
        return isAnswered;
    },
    
    extractData: (uiId, formData, form) => {
        const container = form.querySelector(`#${uiId}`);
        if(!container) return { value: null, hasValue: false };

        const headers = Array.from(container.querySelectorAll('.cfs-head')).map(input => input.value.trim());
        const body = [];
        
        container.querySelectorAll('.cfs-row').forEach(row => {
            const desc = row.querySelector('.cfs-desc').value;
            const amt = row.querySelector('.cfs-amt').value.trim();
            if(desc !== '' || amt !== '') {
                body.push({ desc, amt });
            }
        });

        const hasValue = headers.some(h => h !== '') || body.length > 0;
        return { value: { headers, body }, hasValue };
    },
    
    grade: (q, val, liveQ) => {
        const solHeaders = liveQ.solution[0].header || [];
        const solBody = liveQ.solution[0].body || [];
        
        let score = 0;
        let maxScore = 0; 
        let details = { headers: [], body: [] };

        // 1. Grade Headers
        (val.headers || []).forEach((h, i) => {
            const expected = solHeaders[i] || '';
            const isCorr = h.trim().toLowerCase() === expected.trim().toLowerCase();
            if (expected !== '') {
                maxScore++;
                if (isCorr) score++;
            }
            details.headers.push({ text: h, isCorrect: isCorr, expected });
        });

        // 2. Grade Body (Strict Line-by-Line Match)
        const studentBody = val.body || [];
        const maxRows = Math.max(studentBody.length, solBody.length);

        for(let i = 0; i < maxRows; i++) {
            const sRow = studentBody[i] || { desc: '', amt: '' };
            const solLine = solBody[i] ? solBody[i].split(',') : [];
            const expDesc = (solLine[0] || '').trim();
            const expAmt = (solLine[1] || '').trim();

            let descCorr = false;
            let amtCorr = false;

            if(solBody[i]) {
                if (expDesc !== '') {
                    maxScore++;
                    if(sRow.desc.trim() === expDesc) { descCorr = true; score++; }
                }
                
                if (expAmt !== '') {
                    maxScore++;
                    const sAmtClean = sRow.amt.replace(/,/g, '').trim();
                    if(sAmtClean === expAmt) { amtCorr = true; score++; }
                } else {
                    amtCorr = true; 
                }
            }

            details.body.push({ 
                desc: sRow.desc, 
                amt: sRow.amt, 
                descCorrect: descCorr, 
                amtCorrect: amtCorr,
                expDesc,
                expAmt
            });
        }

        return { score, maxScore, details };
    }
};
