/**
 * Clones the active quiz container, strips out all answers, backgrounds, and validation marks,
 * replaces student info with directions, formats it into Times New Roman, and prints it safely.
 */
export const handlePrintTQ = () => {
    const originalContainer = document.getElementById('qa-runner-container');
    if (!originalContainer) {
        alert("Could not find the activity content to print.");
        return;
    }

    const clone = originalContainer.cloneNode(true);

    // Replace the student info block with the Instructions Box
    const studentInfo = clone.querySelector('#student-print-info');
    if (studentInfo) {
        studentInfo.outerHTML = `
            <div style="border: 2px solid black; padding: 6px; text-align: center; font-size: 14px; font-weight: bold; margin-bottom: 20px; font-family: 'Times New Roman', Times, serif; text-transform: uppercase; color: black;">
                WRITE ALL THE ANSWERS IN THE ANSWER SHEET.
            </div>
        `;
    }

    // Clean up answers and validations
    clone.querySelectorAll('[id^="ans-"], [id^="msg-"], .sticky, .btn-reveal-set').forEach(el => el.remove());
    clone.querySelectorAll('svg:not(.mx-auto), i.fa-check, i.fa-times, i.fa-check-circle, i.fa-times-circle, .fa-key, .fa-info-circle').forEach(el => el.remove());

    clone.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
        radio.style.display = 'none';
    });

    clone.querySelectorAll('textarea, input[type="text"], input[type="number"]').forEach(input => {
        if (!input.readOnly) {
            input.value = '';
            input.removeAttribute('value');
            input.textContent = ''; 
        }
    });

    clone.querySelectorAll('.exercise-item').forEach(item => {
        item.className = "exercise-item"; 
        item.style.border = "none";
        item.style.background = "transparent";
        item.style.padding = "0";
        item.style.marginBottom = "24px";
    });

    clone.querySelectorAll('label').forEach(label => {
        label.className = ""; 
        label.style.display = "block";
        label.style.border = "none";
        label.style.background = "transparent";
        label.style.padding = "0";
        label.style.marginBottom = "4px";
        label.style.color = "black";
    });

    clone.querySelectorAll('span.bg-blue-100').forEach(span => {
        span.className = "";
        span.style.fontWeight = "bold";
        span.style.marginRight = "8px";
    });

    clone.querySelectorAll('.hidden, .test-section-panel').forEach(el => el.classList.remove('hidden'));

    // Inject clone directly into a basic wrapper
    const tqWrapper = document.createElement('div');
    tqWrapper.id = 'tq-print-wrapper';
    tqWrapper.innerHTML = `<div id="tq-content" style="font-family: 'Times New Roman', Times, serif; color: black;"></div>`;
    tqWrapper.querySelector('#tq-content').appendChild(clone);
    document.body.appendChild(tqWrapper);

    const originalTitle = document.title;
    const originalUrl = window.location.href;
    document.title = " "; 
    window.history.replaceState({}, '', '/');

    const printStyle = document.createElement('style');
    printStyle.id = 'tq-print-styles';
    printStyle.innerHTML = `
        #tq-print-wrapper { display: none; }
        @media print {
            @page { size: 8.5in 13in; margin: 0.75in; }
            body > *:not(#tq-print-wrapper) { display: none !important; }
            #tq-print-wrapper { display: block !important; width: 100% !important; background-color: white !important; }
            #tq-print-wrapper, #tq-print-wrapper *, #tq-print-wrapper p, #tq-print-wrapper span { font-family: "Times New Roman", Times, serif !important; color: black !important; }
            #tq-print-wrapper div, #tq-print-wrapper form, .exercise-item, .test-section-panel { display: block !important; height: auto !important; min-height: auto !important; max-height: none !important; overflow: visible !important; position: static !important; }
            .exercise-item, tr, .test-section-panel > div:first-child { page-break-inside: avoid !important; break-inside: avoid !important; }
            #tq-print-wrapper button { display: none !important; }
            #tq-print-wrapper input[type="text"], #tq-print-wrapper input[type="number"] { border-bottom: 1px solid black !important; border-top: none !important; border-left: none !important; border-right: none !important; border-radius: 0 !important; background: transparent !important; color: transparent !important; }
            #tq-print-wrapper textarea { border: 1px solid black !important; background: transparent !important; min-height: 100px !important; color: transparent !important; }
        }
    `;
    document.head.appendChild(printStyle);

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
