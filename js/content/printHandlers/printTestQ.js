/**
 * Clones the active quiz container, strips out all answers, backgrounds, and validation marks,
 * replaces student info with directions, formats it into Times New Roman 12pt (Garamond 9pt for rubrics),
 * and prints it safely.
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

    // B. Completely REMOVE screen headers (e.g., "Test 1: Multiple Choice" blue bar)
    clone.querySelectorAll('.bg-blue-900.text-white, .bg-slate-800.text-white, .print\\:hidden, .hide-in-print').forEach(el => el.remove());

    // C. Remove Explanation Boxes
    clone.querySelectorAll('div').forEach(div => {
        if (div.textContent.trim() === 'EXPLANATION' || div.innerHTML.includes('EXPLANATION')) {
            if (div.textContent.trim() === 'EXPLANATION' && div.parentElement) {
                div.parentElement.remove();
            }
        }
    });

    // D. Remove basic validation items & sticky headers
    clone.querySelectorAll('[id^="ans-"], [id^="msg-"], .sticky, .btn-reveal-set, svg:not(.mx-auto)').forEach(el => el.remove());

    // E. Strip borders, backgrounds, and icons from the Options
    clone.querySelectorAll('.exercise-item .flex.justify-between.items-start').forEach(opt => {
        opt.className = "flex justify-start items-start mb-1"; 
        opt.style.border = "none";
        opt.style.background = "transparent";
        opt.style.color = "black";
        
        if (opt.children.length > 1) {
            opt.lastElementChild.remove();
        }
    });

    // F. Clear all text areas and inputs
    clone.querySelectorAll('textarea, input[type="text"], input[type="number"]').forEach(input => {
        if (!input.readOnly) {
            input.value = '';
            input.removeAttribute('value');
            input.textContent = ''; 
        }
    });

    // G. Strip borders and padding from the main Question Cards
    clone.querySelectorAll('.exercise-item').forEach(item => {
        item.className = "exercise-item"; 
        item.style.border = "none";
        item.style.background = "transparent";
        item.style.padding = "0";
        item.style.marginBottom = "24px";
    });

    clone.querySelectorAll('span.bg-blue-100').forEach(span => {
        span.className = "";
        span.style.fontWeight = "bold";
        span.style.marginRight = "8px";
    });

    clone.querySelectorAll('.hidden, .test-section-panel').forEach(el => el.classList.remove('hidden'));

    // H. Identify the cloned Rubric Tables so we can target them with Garamond 9pt later
    clone.querySelectorAll('.font-serif table').forEach(tbl => tbl.classList.add('rubric-table'));

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
    window.history.replaceState({}, '', '/');

    // 6. Create the Print CSS
    const printStyle = document.createElement('style');
    printStyle.id = 'tq-print-styles';
    printStyle.innerHTML = `
        #tq-print-wrapper { display: none; }

        @media print {
            @page {
                size: 8.5in 13in; 
                /* Top Right Bottom Left Margins */
                margin: 0.5in 0.4in 0.5in 0.4in; 
            }

            body > *:not(#tq-print-wrapper) { display: none !important; }

            #tq-print-wrapper {
                display: block !important;
                width: 100% !important;
                background-color: white !important;
            }

            /* Force EVERYTHING to be Times New Roman 12pt */
            #tq-print-wrapper, #tq-print-wrapper *:not(.rubric-table):not(.rubric-table *) {
                font-family: "Times New Roman", Times, serif !important;
                font-size: 12pt !important;
                color: black !important;
            }

            /* Except the Rubric Table, which is Garamond 9pt */
            #tq-print-wrapper .rubric-table, #tq-print-wrapper .rubric-table * {
                font-family: "Garamond", serif !important;
                font-size: 9pt !important;
                color: black !important;
            }

            #tq-print-wrapper header { border-bottom: none !important; }
            #tq-print-wrapper header img { display: block !important; margin: 0 auto 5px auto !important; }

            /* Disable Chrome Flexbox */
            #tq-print-wrapper div, #tq-print-wrapper form, .exercise-item, .test-section-panel {
                display: block !important;
                height: auto !important;
                min-height: auto !important;
                max-height: none !important;
                overflow: visible !important;
                position: static !important;
            }

            /* Pagination */
            .exercise-item, tr, .test-section-panel > div:first-child {
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
