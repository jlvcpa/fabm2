export const ProblemSolvingHandler = {
    hasTracker: true,
    renderTracker: (q, qIdx, uiId) => {
        const trackerClass = q.isSaved 
            ? "tracker-btn w-9 h-9 m-0.5 rounded-full border border-green-500 bg-green-100 text-green-700 font-bold flex items-center justify-center"
            : (qIdx === 0 ? 'tracker-btn w-9 h-9 m-0.5 rounded-full border bg-blue-600 text-white border-blue-600 font-bold flex items-center justify-center ring-2 ring-blue-300' : 'tracker-btn w-9 h-9 m-0.5 rounded-full border bg-white text-gray-700 border-gray-300 font-bold flex items-center justify-center hover:bg-blue-100');
        return `<button type="button" class="${trackerClass}" data-target-question="${uiId}" ${q.isSaved ? 'data-is-answered="true"' : ''}>${qIdx + 1}</button>`;
    },
    renderQuestion: (q, qIdx, uiId, savedValue, disabledAttr, dimClass, hiddenClass) => {
        const val = savedValue || '';
        const innerContent = `<textarea name="${uiId}" class="input-checker w-full mt-2 p-3 border border-gray-300 rounded h-32 md:h-48 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm resize-y ${dimClass}" placeholder="Type your answer here..." ${disabledAttr}>${val}</textarea>`;

        let explanationHtml = '';
        if (q.explanation) {
            explanationHtml += '<div class="mt-5 pt-4 border-t border-gray-100 explanation-section">';
            explanationHtml += '<h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Explanation</h4>';
            explanationHtml += '<p class="text-sm text-gray-700 mb-3">' + q.explanation + '</p>';

            const tokens = [];
            const r = /\(([^)]+):\s*([\d.,]+)\)|([+\-*/=])/g;
            let match;
            
            while ((match = r.exec(q.explanation)) !== null) {
                if (match[1]) {
                    tokens.push({ type: 'factor', desc: match[1].trim(), amt: match[2].trim() });
                } else if (match[3]) {
                    tokens.push({ type: 'op', value: match[3] });
                }
            }

            const factorsCount = tokens.filter(t => t.type === 'factor').length;
            if (factorsCount > 0) {
                explanationHtml += '<div class="bg-gray-50 border border-gray-200 rounded-md p-4 w-full md:max-w-md font-mono text-sm shadow-sm ml-0">';
                let currentOp = '+';
                
                for (let i = 0; i < tokens.length; i++) {
                    const token = tokens[i];
                    
                    if (token.type === 'op') {
                        currentOp = token.value;
                    } else if (token.type === 'factor') {
                        let desc = token.desc;
                        let amt = token.amt;
                        let rowClass = "flex justify-between py-1.5 items-center w-full";
                        let amtClass = "text-right pr-2 whitespace-nowrap flex-shrink-0 text-gray-800";
                        let descClass = "text-left pl-2 flex-grow pr-4 break-words text-gray-700";
                        let displayAmt = amt;

                        if (currentOp === '=') {
                            explanationHtml += '<div class="w-full border-b border-gray-300 my-2"></div>';
                            desc = "FINAL ANSWER";
                            descClass = "text-left pl-2 flex-grow pr-4 break-words font-bold text-gray-900";
                            amtClass = "text-right pr-2 whitespace-nowrap flex-shrink-0 font-bold text-gray-900";
                        } else if (currentOp === '-') {
                            displayAmt = "-" + amt;
                            rowClass += " text-red-600";
                            descClass = "text-left pl-2 flex-grow pr-4 break-words text-red-600 font-medium";
                            amtClass = "text-right pr-2 whitespace-nowrap flex-shrink-0 text-red-600 font-medium";
                        } else if (currentOp === '*') {
                            desc = "multiply by " + desc;
                        } else if (currentOp === '/') {
                            desc = "divided by " + desc;
                        }

                        explanationHtml += '<div class="' + rowClass + '">';
                        explanationHtml += '<div class="' + descClass + '">' + desc + '</div>';
                        explanationHtml += '<div class="' + amtClass + '">' + displayAmt + '</div>';
                        explanationHtml += '</div>';

                        currentOp = '+'; 
                    }
                }
                explanationHtml += '</div>';
            }
            explanationHtml += '</div>';
        }

        return `
            <div id="${uiId}" class="question-block w-full ${hiddenClass}">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
                    <div class="p-4 md:p-6">
                        <div class="mb-2">
                            <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">Question ${qIdx+1}</span>
                            <p class="text-base md:text-lg font-bold text-gray-800 mt-1 leading-snug">${q.questionText || q.question}</p>
                        </div>
                        ${innerContent}
                        ${explanationHtml}
                        <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                            <button type="button" class="nav-prev-btn text-gray-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-gray-100">
                                <i class="fas fa-arrow-left mr-1"></i> Previous
                            </button>
                            <button type="button" class="nav-next-btn bg-blue-800 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-blue-900 shadow">
                                Next <i class="fas fa-arrow-right ml-1"></i>
                            </button>
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
            if (trackers[i].dataset.isAnswered !== "true") {
                currentIndex = i; break;
            }
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
    },
    checkCompletion: (uiId, form) => {
        let textarea = form.querySelector(`textarea[name="${uiId}"]`);
        if (!textarea) textarea = form.querySelector(`textarea[name="${uiId}"][disabled]`);
        const isAnswered = !!(textarea && textarea.value && textarea.value.trim() !== '');
        
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
        let value = formData.get(uiId);
        let hasValue = value && value.trim() !== '';
        if (!hasValue) {
            const disabledInput = form.querySelector(`textarea[name="${uiId}"][disabled]`);
            if (disabledInput) {
                value = disabledInput.value;
                hasValue = value && value.trim() !== '';
            }
        }
        return { value, hasValue };
    }
};
