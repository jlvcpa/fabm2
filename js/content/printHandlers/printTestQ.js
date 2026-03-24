/**
 * Clones the active quiz container, strips out all answers, backgrounds, and validation marks,
 * replaces student info with directions, formats it into Times New Roman 12pt (Garamond 9pt for rubrics),
 * applies dynamic CSS Grid layouts for options, and prints it safely.
 */
export const handlePrintTQ = () => {
    // 1. Target the main runner container
    const originalContainer = document.getElementById('qa-runner-container');
    if (!originalContainer) {
        alert("Could not find the activity content to print.");
        return;
    }

    // 2. Make a hidden "photocopy" of the container
    const clone = originalContainer.cloneNode(true);

    // 3. AGGRESSIVE CLEANUP & TEXT REPLACEMENT
    
    // A. Replace the student info block with the Instructions Box
    const studentInfo = clone.querySelector('#student-print-info');
    if (studentInfo) {
        studentInfo.outerHTML = `
            <div style="border: 2px solid black; padding: 6px; text-align: center; font-size: 12pt; font-weight: bold; margin-bottom: 20px; font-family: 'Times New Roman', Times, serif; text-transform: uppercase; color: black;">
                WRITE ALL THE ANSWERS IN THE ANSWER SHEET.
            </div>
        `;
    }

    // B. Completely REMOVE screen headers 
    clone.querySelectorAll('.bg-blue-900.text-white, .bg-slate-800.text-white, .print\\:hidden, .hide-in-print').forEach(el => el.remove());

    // C. Remove Explanation Boxes entirely (Targeting the exact class from your React component)
    clone.querySelectorAll('.explanation-section').forEach(el => el.remove());
    // Fallback: Also remove any standalone "Explanation" headers just in case
    clone.querySelectorAll('h4').forEach(h4 => {
        if (h4.textContent.trim().toLowerCase() === 'explanation' && h4.parentElement) {
            h4.parentElement.remove();
        }
    });

    // D. Remove basic validation items & sticky headers
    clone.querySelectorAll('[id^="ans-"], [id^="msg-"], .sticky, .btn-reveal-set, svg:not(.mx-auto)').forEach(el => el.remove());

    // E. Clean the Multiple Choice Options
    clone.querySelectorAll('.flex.justify-between.items-start').forEach(opt => {
        // Strip all Tailwind classes and assign our clean class
        opt.className = "tq-option"; 
        opt.removeAttribute("style"); // Wipe any inline colors/borders
        
        // Remove the validation icon container (the check/X mark at the end)
        if (opt.children.length > 1) {
            opt.lastElementChild.remove();
        }
    });

    // F. Process the Question Cards & Apply Dynamic Grid Layouts
    // We look for the parents of the options we just cleaned
    const optionContainers = new Set();
    clone.querySelectorAll('.tq-option').forEach(opt => {
        if (opt.parentElement) optionContainers.add(opt.parentElement);
    });

    optionContainers.forEach(parent => {
        // 1. Strip Tailwind classes (like flex-col) from the options wrapper
        parent.className = "tq-options-container";
        
        // 2. Identify the main Question Card wrapper to ensure it paginates correctly
        // Structure: <div px-4 flex-col> -> <div> -> <div tq-options-container>
        if (parent.parentElement && parent.parentElement.parentElement) {
            parent.parentElement.parentElement.classList.add('tq-question-block');
        }

        // 3. Dynamic Grid Logic based on character length
        const options = Array.from(parent.querySelectorAll('.tq-option'));
        let maxLen = 0;
        options.forEach(opt => {
            const textLen = opt.textContent.trim().length;
            if (textLen > maxLen) maxLen = textLen;
        });
        
        if (maxLen <= 15) {
            parent.classList.add('cols-4');
        } else if (maxLen <= 35) {
            parent.classList.add('cols-2');
        } else {
            parent.classList.add('cols-1');
        }
    });

    // G. Clear all text areas and inputs
    clone.querySelectorAll('textarea, input[type="text"], input[type="number"]').forEach(input => {
        if (!input.readOnly) {
            input.value = '';
            input.removeAttribute('value');
            input.textContent = ''; 
        }
    });

    // Strip "Question X" blue badges to make them look like normal text
    clone.querySelectorAll('span.bg-blue-100').forEach(span => {
        span.className = "";
        span.style.fontWeight = "bold";
        span.style.marginRight = "8px";
    });

    clone.querySelectorAll('.hidden, .test-section-panel').forEach(el => el.classList.remove('hidden'));

    // H. Identify the cloned Rubric Tables so we can target them with Garamond 9pt
    clone.querySelectorAll('.font-serif table').forEach(tbl => tbl.classList.add('rubric-table'));

    // --- FEATURE 1: CONTINUOUS QUESTION NUMBERING (1 to X) ---
    let globalQNum = 1;
    
    // Target the specific class you provided that holds the question text
    clone.querySelectorAll('.font-bold.text-gray-800').forEach(qHeader => {
        // First, check if you are using the flex-span approach
        const numSpan = qHeader.querySelector('.mr-2');
        if (numSpan && /^\d+\./.test(numSpan.textContent.trim())) {
            numSpan.textContent = `${globalQNum}.`;
            globalQNum++;
        } 
        // Second, check the direct text approach you pasted above
        else if (/^\s*\d+\./.test(qHeader.textContent)) {
            qHeader.innerHTML = qHeader.innerHTML.replace(/^\s*\d+\./, `${globalQNum}.`);
            globalQNum++;
        }
    });
    
    // 4. Build the Master Wrapper
    const tqWrapper = document.createElement('div');
    tqWrapper.id = 'tq-print-wrapper';
    tqWrapper.innerHTML = `<div id="tq-content"></div>`;

    tqWrapper.querySelector('#tq-content').appendChild(clone);
    document.body.appendChild(tqWrapper);

    // 5. Temporarily clear the native browser title and URL
    const originalTitle = document.title;
    const originalUrl = window.location.href;
    document.title = " "; 
    window.history.replaceState({}, '', '/FABM-2 . . . . . . . . . 4Cs: Christ-centeredness, Competence, Character, Compassion . . . . . . . . . . . . . . . . . . . . . . ');

    // 6. Create the Print CSS
    const printStyle = document.createElement('style');
    printStyle.id = 'tq-print-styles';
    printStyle.innerHTML = `
        #tq-print-wrapper { display: none; }

        @media print {
            @page {
                size: 8.5in 13in; 
                /* Strict margins as requested: Top 0.5, Right 0.4, Bottom 04, Left 0.4 */
                margin: 0.5in 0.4in 0.4in 0.4in; 
            }

            body > *:not(#tq-print-wrapper) { display: none !important; }

            #tq-print-wrapper {
                display: block !important;
                width: 100% !important;
                background-color: white !important;
            }

            /* Global Typography: 12pt Times New Roman, Compressed line-height */
            #tq-print-wrapper, #tq-print-wrapper *:not(.rubric-table):not(.rubric-table *) {
                font-family: "Times New Roman", Times, serif !important;
                font-size: 12pt !important;
                color: black !important;
                line-height: 1.15 !important;
            }

            /* Garamond 9pt Rubric */
            #tq-print-wrapper .rubric-table, #tq-print-wrapper .rubric-table * {
                font-family: "Garamond", serif !important;
                font-size: 9pt !important;
                color: black !important;
                line-height: 1.1 !important;
            }

            #tq-print-wrapper header { border-bottom: none !important; }
            #tq-print-wrapper header img { display: block !important; margin: 0 auto 5px auto !important; }

            /* --- DYNAMIC OPTION GRID CSS --- */
            .tq-question-block {
                display: block !important; /* Defeat Chrome Flexbox bug */
                margin-bottom: 0.01rem !important; /* Reduced from 1.5rem */
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }

            .tq-options-container {
                width: 100% !important;
                margin-top: 0.1rem !important;
            }

            .tq-options-container.cols-4 {
                display: grid !important;
                grid-template-columns: repeat(4, 1fr) !important;
                grid-template-rows: auto !important;
                grid-auto-flow: column !important;
                gap: 0.1rem 0.5rem !important;
            }

            .tq-options-container.cols-2 {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                /* Force 2 rows so A,B are in Col 1, and C,D are in Col 2 */
                grid-template-rows: repeat(2, auto) !important;
                grid-auto-flow: column !important;
                gap: 0.1rem 1rem !important;
            }

            .tq-options-container.cols-1 {
                display: flex !important;
                flex-direction: column !important;
                gap: 0.1rem !important;
            }

            .tq-option {
                display: flex !important;
                align-items: flex-start !important;
                margin-bottom: 0.01rem !important; /* Reduced from 0.25rem */
                padding-left: 1.9rem !important;
                padding-right: 1rem !important;
                border: none !important;
                background: transparent !important;
            }

            /* Maintains the 'A.' letter alignment next to the option text */
            .tq-option > div {
                display: flex !important;
                width: 100% !important;
            }
            /* ------------------------------- */

            /* ANTI-ORPHANING LOGIC: Keep headers/tables together */
            .test-section-panel, .tq-section-header {
                display: block !important;
                overflow: visible !important;
                position: static !important;
            }

            tr, .tq-section-header {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }

            #tq-print-wrapper button { display: none !important; }

            #tq-print-wrapper input[type="text"], #tq-print-wrapper input[type="number"] {
                border-bottom: 1px solid black !important;
                border-top: none !important; border-left: none !important; border-right: none !important;
                border-radius: 0 !important; background: transparent !important; color: transparent !important;
            }

            #tq-print-wrapper textarea {
                border: 1px solid black !important; background: transparent !important;
                min-height: 100px !important; color: transparent !important;
            }
        }
    `;
    document.head.appendChild(printStyle);

    // 7. Trigger Print and Cleanup
    setTimeout(() => {
        window.print();
        setTimeout(() => {
            document.title = originalTitle;
            window.history.replaceState({}, '', originalUrl);
            const styleEl = document.getElementById('tq-print-styles');
            if (styleEl) styleEl.remove();
            const wrapperEl = document.getElementById('tq-print-wrapper');
            if (wrapperEl) wrapperEl.remove();
        }, 500);
    }, 200);
};
