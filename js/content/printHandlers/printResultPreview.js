/**
 * Injects print-specific styles, injects the custom footer, 
 * flattens the DOM for printing, triggers the print dialog, and cleans up.
 */
export const handlePrint = (mode, setPrintMode) => {
    setPrintMode(mode);

    // 1. Create Custom Footer
    const footer = document.createElement('div');
    footer.id = 'dynamic-print-footer';
    footer.innerHTML = `
        <div style="flex: 1; text-align: left; font-weight: bold; font-size: 11px; padding-left: 8px;">FABM 2</div>
        <div style="flex: 2; text-align: center;">
            <span style="border: 1px solid black; padding: 0.25rem;">4Cs: Christ-centeredness, Competence, Character, Compassion</span>
        </div>
        <div style="flex: 1; text-align: right; font-weight: bold; font-size: 11px; padding-right: 8px;"></div>
    `;
    document.body.appendChild(footer);

    // 2. Create Print CSS
    const printStyle = document.createElement('style');
    printStyle.id = 'dynamic-print-styles';
    printStyle.innerHTML = `
        #dynamic-print-footer {
            display: none;
        }
        
        @media print {
            @page {
                /* Set exact Folio paper dimensions */
                size: 8.5in 13in;
                /* A 1-inch bottom margin ensures text never touches the footer */
                margin: 0.4in 0.4in 1.0in 0.4in; 
            }

            /* --- HIDE ALL SIDEBARS AND NAVIGATION --- */
            #sidebar, #qa-sidebar, #student-sidebar, header, nav, 
            #qa-toggle-sidebar, #qa-desktop-expand, button, 
            .print\\:hidden, .hide-in-print { 
                display: none !important; 
            }

            /* --- THE CHROME FLEXBOX & SCROLL BUG FIX --- */
            /* We MUST force all parent wrappers to be basic 'block' elements with no restricted heights. 
               This stops the final page from cutting off and allows page-breaks to work! */
            html, body, #app-content, #content-area, #qa-runner-container, 
            #qa-runner-container > div, #quiz-form, #quiz-form > div, 
            .test-section-panel, .test-section-panel > div, .flex-1.min-w-0 {
                display: block !important;
                height: auto !important;
                min-height: auto !important;
                max-height: none !important;
                overflow: visible !important;
                position: static !important;
                background-color: white !important;
            }

            /* Custom Footer Layout */
            #dynamic-print-footer {
                display: flex !important;
                position: fixed !important;
                bottom: 0 !important; /* Anchored safely at the bottom */
                left: 0 !important;
                width: 100% !important;
                font-size: 10px;
                font-family: sans-serif;
                background: white;
                padding: 0 0.05in 0.05in 0.05in;
                box-sizing: border-box;
                z-index: 9999;
                align-items: flex-end;
            }

            /* --- BULLETPROOF PAGINATION RULES --- */
            /* Now that the parents are 'block', Chrome will finally respect this! */
            .exercise-item, tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                margin-bottom: 24px !important; /* Gives breathing room between questions */
            }

            /* Standardized Table & Formatting */
            table { width: 100% !important; border-collapse: collapse !important; font-size: 10px !important; }
            td, th { padding: 3px !important; }
            thead { display: table-header-group !important; }
            
            input, textarea {
                border: none !important;
                background: transparent !important;
                font-size: 10px !important;
                padding: 0 !important;
                margin: 0 !important;
                resize: none !important;
            }
            
            .bg-slate-800, .bg-blue-900 {
                background-color: transparent !important;
                color: black !important;
                border-bottom: 2px solid black !important;
            }
            .text-yellow-400, .text-yellow-300, .text-white { color: black !important; }
        }
    `;
    document.head.appendChild(printStyle);

    // 3. Trigger Print and Cleanup after completion
    setTimeout(() => {
        window.print();
        
        setTimeout(() => {
            setPrintMode('all');
            
            // Cleanup Styles and Footer to return to normal web view
            const styleElement = document.getElementById('dynamic-print-styles');
            if (styleElement) styleElement.remove();
            
            const footerElement = document.getElementById('dynamic-print-footer');
            if (footerElement) footerElement.remove();
            
        }, 500); 
    }, 100);
};
