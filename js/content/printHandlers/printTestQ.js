/**
 * Clones the active quiz container, strips out all answers, backgrounds, and validation marks,
 * dynamically injects instructions and parsed rubric table, replaces student info with directions,
 * formats it into Times New Roman, and prints it safely.
 * * @param {object} activityConfig - The activity data containing topics, instructions, and rubrics.
 */
export const handlePrintTQ = (activityConfig) => {
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
            <div style="border: 2px solid black; padding: 6px; text-align: center; font-size: 14px; font-weight: bold; margin-bottom: 20px; font-family: 'Times New Roman', Times, serif; text-transform: uppercase; color: black;">
                WRITE ALL THE ANSWERS IN THE ANSWER SHEET.
            </div>
        `;
    }

    // B. Remove all Explanations, Warnings, Answer Keys, and Sticky Top Headers
    clone.querySelectorAll('[id^="ans-"], [id^="msg-"], .sticky, .btn-reveal-set').forEach(el => el.remove());
    
    // C. Remove all validation SVG icons (Checks and X marks)
    clone.querySelectorAll('svg:not(.mx-auto), i.fa-check, i.fa-times, i.fa-check-circle, i.fa-times-circle, .fa-key, .fa-info-circle').forEach(el => el.remove());

    // D. Uncheck all radio buttons and hide them so we only see the text options
    clone.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
        radio.style.display = 'none'; // Hide the actual clickable circle
    });

    // E. Clear all text areas and inputs (Problem Solving & Journalizing)
    clone.querySelectorAll('textarea, input[type="text"], input[type="number"]').forEach(input => {
        if (!input.readOnly) {
            input.value = '';
            input.removeAttribute('value');
            input.textContent = ''; 
        }
    });

    // F. Strip borders, background colors, and padding from Question Cards & Options
    clone.querySelectorAll('.exercise-item').forEach(item => {
        item.className = "exercise-item"; // Strip all tailwind classes
        item.style.border = "none";
        item.style.background = "transparent";
        item.style.padding = "0";
        item.style.marginBottom = "24px";
    });

    clone.querySelectorAll('label').forEach(label => {
        label.className = ""; // Strip all tailwind borders/colors
        label.style.display = "block";
        label.style.border = "none";
        label.style.background = "transparent";
        label.style.padding = "0";
        label.style.marginBottom = "4px";
        label.style.color = "black";
    });

    // Strip "Question X" blue badges to make them look like normal text
    clone.querySelectorAll('span.bg-blue-100').forEach(span => {
        span.className = "";
        span.style.fontWeight = "bold";
        span.style.marginRight = "8px";
    });

    // Ensure all hidden sections (Test 2, Test 3) are fully visible for printing
    clone.querySelectorAll('.hidden, .test-section-panel').forEach(el => el.classList.remove('hidden'));

    // 4. INJECT HEADERS & RUBRICS INTO EACH SECTION
    clone.querySelectorAll('.test-section-panel').forEach((panel, index) => {
        const sectionConfig = activityConfig?.testQuestions?.[index] || {};
        const type = sectionConfig.type || 'Test';
        const topics = sectionConfig.topics || activityConfig.topics || '';
        const instructions = sectionConfig.instructions || activityConfig.instructions || '';
        const rubricStr = sectionConfig.gradingRubrics || activityConfig.gradingRubrics || '';

        // Build the Rubric Table dynamically
        let rubricTableHtml = '';
        if (rubricStr) {
            const lines = rubricStr.split('\n').filter(l => l.trim().length > 0);
            let headers = [];
            let rowData = [];
            lines.forEach(line => {
                const colonIdx = line.indexOf(':');
                if (colonIdx > -1) {
                    headers.push(line.substring(0, colonIdx).trim());
                    rowData.push(line.substring(colonIdx + 1).trim());
                }
            });
            
            if (headers.length > 0) {
                rubricTableHtml = `
                <table style="width:100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; font-family: 'Times New Roman', Times, serif;">
                    <thead>
                        <tr>
                            ${headers.map(h => `<th style="border: 1px solid black; padding: 6px; text-align: left; font-style: italic; font-weight: bold;">${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            ${rowData.map(d => `<td style="border: 1px solid black; padding: 6px; vertical-align: top;">${d}</td>`).join('')}
                        </tr>
                    </tbody>
                </table>
                `;
            }
        }

        // Generate Roman Numeral for the Part
        const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'][index] || (index + 1);
        
        const headerHtml = `
            <div style="margin-bottom: 15px; font-family: 'Times New Roman', Times, serif; color: black;">
                <div style="font-weight: bold; font-size: 14px; text-transform: uppercase; margin-bottom: 4px;">
                    ${roman}. ${type}: ${topics}
                </div>
                <div style="font-size: 13px; margin-bottom: 10px; text-align: justify;">
                    Direction: ${instructions}
                </div>
                ${rubricTableHtml}
            </div>
        `;
        
        // Inject header at the top of this specific test section
        panel.insertAdjacentHTML('afterbegin', headerHtml);
    });

    // 5. Build the Master Wrapper (Header logic removed, relies entirely on clone)
    const tqWrapper = document.createElement('div');
    tqWrapper.id = 'tq-print-wrapper';
    
    tqWrapper.innerHTML = `
        <div id="tq-content" style="font-family: 'Times New Roman', Times, serif; color: black;"></div>
    `;

    // Inject the cleaned clone into our wrapper, and put the wrapper on the page
    tqWrapper.querySelector('#tq-content').appendChild(clone);
    document.body.appendChild(tqWrapper);

    // 6. Temporarily clear the native browser title and URL
    const originalTitle = document.title;
    const originalUrl = window.location.href;
    document.title = " "; 
    window.history.replaceState({}, '', '/');

    // 7. Create the Print CSS
    const printStyle = document.createElement('style');
    printStyle.id = 'tq-print-styles';
    printStyle.innerHTML = `
        /* Hide this wrapper completely on the screen */
        #tq-print-wrapper { display: none; }

        @media print {
            @page {
                size: 8.5in 13in; /* Folio Size */
                margin: 0.75in; /* Clean formal margins */
            }

            /* Hide the ENTIRE web app, and ONLY show our custom TQ Wrapper */
            body > *:not(#tq-print-wrapper) { display: none !important; }

            #tq-print-wrapper {
                display: block !important;
                width: 100% !important;
                background-color: white !important;
            }

            /* Force EVERYTHING inside the TQ to be Times New Roman and Black */
            #tq-print-wrapper, #tq-print-wrapper *, #tq-print-wrapper p, #tq-print-wrapper span {
                font-family: "Times New Roman", Times, serif !important;
                color: black !important;
            }

            /* Ensure the logo renders properly */
            #tq-print-wrapper header {
                border-bottom: none !important; 
            }
            #tq-print-wrapper header img {
                display: block !important;
                margin: 0 auto 5px auto !important;
            }

            /* Disable Chrome Flexbox on the clone so it paginates perfectly */
            #tq-print-wrapper div, #tq-print-wrapper form, .exercise-item, .test-section-panel {
                display: block !important;
                height: auto !important;
                min-height: auto !important;
                max-height: none !important;
                overflow: visible !important;
                position: static !important;
            }

            /* Bulletproof Pagination */
            .exercise-item, tr, .test-section-panel > div:first-child {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }

            /* Hide buttons inside the clone */
            #tq-print-wrapper button { display: none !important; }

            /* Make text inputs printable as empty underlines */
            #tq-print-wrapper input[type="text"], #tq-print-wrapper input[type="number"] {
                border-bottom: 1px solid black !important;
                border-top: none !important; border-left: none !important; border-right: none !important;
                border-radius: 0 !important; background: transparent !important; color: transparent !important;
            }

            /* Make textareas printable as empty boxes */
            #tq-print-wrapper textarea {
                border: 1px solid black !important; background: transparent !important;
                min-height: 100px !important; color: transparent !important;
            }
        }
    `;
    document.head.appendChild(printStyle);

    // 8. Trigger Print and Cleanup
    setTimeout(() => {
        window.print();
        
        setTimeout(() => {
            // Restore native title and URL
            document.title = originalTitle;
            window.history.replaceState({}, '', originalUrl);
            
            // Delete the styles and the clone
            const styleEl = document.getElementById('tq-print-styles');
            if (styleEl) styleEl.remove();
            
            const wrapperEl = document.getElementById('tq-print-wrapper');
            if (wrapperEl) wrapperEl.remove();
        }, 500);
    }, 200);
};
