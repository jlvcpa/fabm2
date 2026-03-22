/**
 * Clones the active quiz container, strips out all answers/explanations, 
 * formats it into a formal Times New Roman test questionnaire, 
 * and prints it safely without affecting the live UI.
 */
export const handlePrintTQ = () => {
    // 1. Target the container that holds the questions
    const originalContainer = document.getElementById('qa-runner-container');
    if (!originalContainer) {
        alert("Could not find the activity content to print.");
        return;
    }

    // 2. Make a hidden "photocopy" of the container
    const clone = originalContainer.cloneNode(true);

    // 3. CLEANUP: Strip out all answers, feedback, and scores from the clone
    // Uncheck all radio buttons for MCQs
    clone.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    
    // Clear all text areas and inputs (Problem Solving & Journalizing)
    clone.querySelectorAll('textarea, input[type="text"], input[type="number"]').forEach(input => {
        // Keep readonly fields intact (like pre-filled dates in journals)
        if (!input.readOnly) {
            input.value = '';
            input.removeAttribute('value');
            input.textContent = ''; 
        }
    });

    // Delete all Explanation boxes and Warning Messages
    clone.querySelectorAll('[id^="ans-"], [id^="msg-"]').forEach(el => el.remove());
    
    // Delete all checkmarks, cross marks, and score badges
    clone.querySelectorAll('.fa-check, .fa-times, .fa-check-circle, .fa-times-circle, .text-green-500, .text-red-500, .text-green-600, .text-red-600').forEach(el => el.remove());

    // Strip background colors from question cards to make them plain white
    clone.querySelectorAll('.exercise-item, .bg-green-50, .bg-red-50, .bg-slate-50, .border-green-200, .border-red-200').forEach(el => {
        el.classList.remove('bg-green-50', 'bg-red-50', 'bg-slate-50', 'border-green-200', 'border-red-200', 'border-green-500', 'border-red-500');
        el.style.backgroundColor = 'transparent';
    });

    // Remove the sticky top header from the web view (so it doesn't print awkwardly)
    const stickyHeader = clone.querySelector('.sticky');
    if (stickyHeader) stickyHeader.remove();

    // 4. Build the custom TQ Wrapper with your Header
    const tqWrapper = document.createElement('div');
    tqWrapper.id = 'tq-print-wrapper';
    
    // You can customize the text inside the brackets [ ] below later!
    tqWrapper.innerHTML = `
        <div class="tq-header" style="text-align: center; margin-bottom: 2rem; font-family: 'Times New Roman', Times, serif; color: black;">
            <h2 style="font-size: 18px; font-weight: bold; margin: 0; text-transform: uppercase;">[INSERT SCHOOL NAME]</h2>
            <h3 style="font-size: 14px; margin: 4px 0;">School Year 202X - 202X | [INSERT TERM / SEMESTER]</h3>
            <h1 style="font-size: 20px; font-weight: bold; margin: 16px 0; text-transform: uppercase;">[INSERT ACTIVITY TITLE]</h1>
            
            <div style="display: flex; justify-content: space-between; text-align: left; margin-top: 30px; font-size: 14px; border-bottom: 2px solid black; padding-bottom: 8px;">
                <span style="flex: 2;"><strong>Name:</strong> _________________________________________________</span>
                <span style="flex: 1;"><strong>Section:</strong> _________________</span>
                <span style="flex: 1;"><strong>Date:</strong> ___________</span>
                <span style="flex: 1; text-align: right;"><strong>Score:</strong> _______</span>
            </div>
        </div>
        <div id="tq-content"></div>
    `;

    // Inject the cleaned clone into our wrapper, and put the wrapper on the page
    tqWrapper.querySelector('#tq-content').appendChild(clone);
    document.body.appendChild(tqWrapper);

    // 5. Temporarily clear the native browser title to clean up the print header
    const originalTitle = document.title;
    document.title = " "; 

    // 6. Create the Print CSS
    const printStyle = document.createElement('style');
    printStyle.id = 'tq-print-styles';
    printStyle.innerHTML = `
        /* Hide this wrapper completely on the screen */
        #tq-print-wrapper {
            display: none;
        }

        @media print {
            @page {
                size: 8.5in 13in; /* Folio Size */
                margin: 0.75in; /* Standard paper margins */
            }

            /* --- THE MAGIC TRICK --- */
            /* Hide the ENTIRE web app, and ONLY show our custom TQ Wrapper */
            body > *:not(#tq-print-wrapper) {
                display: none !important;
            }

            #tq-print-wrapper {
                display: block !important;
                width: 100% !important;
                background-color: white !important;
            }

            /* Force EVERYTHING inside the TQ to be Times New Roman and Black */
            #tq-print-wrapper, #tq-print-wrapper * {
                font-family: "Times New Roman", Times, serif !important;
                color: black !important;
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
            .exercise-item, tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                margin-bottom: 24px !important;
            }

            /* Hide buttons inside the clone */
            #tq-print-wrapper button { 
                display: none !important; 
            }

            /* Make text inputs printable as empty underlines */
            #tq-print-wrapper input[type="text"], 
            #tq-print-wrapper input[type="number"] {
                border-bottom: 1px solid black !important;
                border-top: none !important;
                border-left: none !important;
                border-right: none !important;
                border-radius: 0 !important;
                background: transparent !important;
            }

            /* Make textareas printable as empty boxes */
            #tq-print-wrapper textarea {
                border: 1px solid black !important;
                background: transparent !important;
                min-height: 100px !important;
            }

            /* Format Tables for Paper */
            #tq-print-wrapper table { 
                width: 100% !important; 
                border-collapse: collapse !important; 
            }
            #tq-print-wrapper th, #tq-print-wrapper td { 
                border: 1px solid black !important; 
                padding: 6px !important; 
            }
            
            /* Put a neat black border around each question */
            #tq-print-wrapper .exercise-item {
                border: 1px solid black !important;
                border-radius: 0 !important;
                padding: 15px !important;
                margin-bottom: 20px !important;
            }
        }
    `;
    document.head.appendChild(printStyle);

    // 7. Trigger Print and Cleanup
    setTimeout(() => {
        window.print();
        
        setTimeout(() => {
            // Restore native title
            document.title = originalTitle;
            
            // Delete the styles and the clone. The original app was never touched!
            const styleEl = document.getElementById('tq-print-styles');
            if (styleEl) styleEl.remove();
            
            const wrapperEl = document.getElementById('tq-print-wrapper');
            if (wrapperEl) wrapperEl.remove();
        }, 500);
    }, 200);
};
