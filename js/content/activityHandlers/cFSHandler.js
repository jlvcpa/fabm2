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

        const headerHtml = `
            <div class="mb-6 flex flex-col items-center w-full max-w-lg mx-auto gap-2">
                <input type="text" class="cfs-head text-center w-full font-bold border-b border-gray-400 outline-none focus:border-blue-500 bg-transparent ${dimClass}" placeholder="Company Name" value="${saved.headers[0]}" ${disabledAttr}>
                <input type="text" class="cfs-head text-center w-full font-bold border-b border-gray-400 outline-none focus:border-blue-500 bg-transparent ${dimClass}" placeholder="Statement of Cash Flows" value="${saved.headers[1]}" ${disabledAttr}>
                <input type="text" class="cfs-head text-center w-full border-b border-gray-400 outline-none focus:border-blue-500 text-sm bg-transparent ${dimClass}" placeholder="For the year ended..." value="${saved.headers[2]}" ${disabledAttr}>
            </div>
        `;

        const rowHtml = saved.body.map(row => `
            <div class="cfs-row flex items-end gap-3 w-full mb-1">
                <select class="cfs-desc flex-1 border-b border-gray-400 outline-none text-sm py-1 bg-transparent ${dimClass}" ${disabledAttr} data-saved="${row.desc}">
                    <option value="">-- Select Line Description --</option>
                    ${optionsHtml}
                </select>
                <input type="text" class="cfs-amt w-40 text-right border-b border-gray-400 outline-none text-sm py-1 bg-transparent font-mono ${dimClass}" placeholder="Amount" value="${row.amt}" onblur="window.evaluateMDAS(this)" ${disabledAttr}>
            </div>
        `).join('');

        const innerContent = `
            <div class="cfs-container w-full mt-4 p-4 border border-gray-300 rounded bg-white shadow-inner">
                ${headerHtml}
                <div class="cfs-body-container flex flex-col w-full max-w-3xl mx-auto">
                    ${rowHtml}
                </div>
                ${!disabledAttr ? `<button type="button" class="cfs-add-row mt-4 px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded hover:bg-gray-300 transition">+ Add Line</button>` : ''}
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

        let explanationHtml = '';
        if (q.explanation) {
            explanationHtml += '<div class="mt-5 pt-4 border-t border-gray-100 explanation-section">';
            explanationHtml += '<h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Explanation</h4>';
            explanationHtml += '<p class="text-sm text-gray-700 mb-3 whitespace-pre-wrap">' + q.explanation + '</p>';
            explanationHtml += '</div>';
        }

        return `
            <div id="${uiId}" class="question-block w-full ${hiddenClass}">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
                    <div class="p-4 md:p-6">
                        <div class="mb-4">
                            <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">Question ${qIdx+1}</span>
                            <p class="text-base md:text-lg font-bold text-gray-800 mt-1 leading-snug whitespace-pre-wrap">${q.questionText || q.question}</p>
                        </div>
                        ${innerContent}
                        ${explanationHtml}
                        <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                            <button type="button" class="nav-prev-btn text-gray-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-gray-100"><i class="fas fa-arrow-left mr-1"></i> Previous</button>
                            <button type="button" class="nav-next-btn bg-blue-800 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-blue-900 shadow">Next <i class="fas fa-arrow-right ml-1"></i></button>
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

        const applyFormatting = (selectEl, amtEl) => {
            const val = selectEl.value;
            if(noIndent.includes(val)) {
                selectEl.style.paddingLeft = '0';
                selectEl.style.fontWeight = 'bold';
            } else if (val) {
                selectEl.style.paddingLeft = '20px';
                selectEl.style.fontWeight = 'normal';
            }

            amtEl.className = "cfs-amt w-40 text-right outline-none text-sm py-1 bg-transparent font-mono ";
            if(doubleTopSingleBot.includes(val)) {
                amtEl.classList.add('border-t-4', 'border-double', 'border-b', 'border-gray-800');
            } else if(singleTopDoubleBot.includes(val)) {
                amtEl.classList.add('border-t', 'border-gray-800', 'border-b-4', 'border-double');
            } else {
                amtEl.classList.add('border-b', 'border-gray-400');
            }
        };

        // Attach listeners for dynamic rows
        section.addEventListener('change', (e) => {
            if(e.target.classList.contains('cfs-desc')) {
                const amtEl = e.target.closest('.cfs-row').querySelector('.cfs-amt');
                applyFormatting(e.target, amtEl);
            }
        });

        // Add Row Logic
        section.addEventListener('click', (e) => {
            if(e.target.closest('.cfs-add-row')) {
                const container = e.target.closest('.cfs-container').querySelector('.cfs-body-container');
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
        let maxScore = solHeaders.length + (solBody.length * 2);
        let details = { headers: [], body: [] };

        // 1. Grade Headers
        (val.headers || []).forEach((h, i) => {
            const expected = solHeaders[i] || '';
            const isCorr = h.trim().toLowerCase() === expected.trim().toLowerCase();
            if(isCorr && expected !== '') score++;
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
                if(sRow.desc.trim() === expDesc && expDesc !== '') { descCorr = true; score++; }
                
                // Strip commas from student amount for comparison
                const sAmtClean = sRow.amt.replace(/,/g, '').trim();
                if(sAmtClean === expAmt && expAmt !== '') { amtCorr = true; score++; }
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
