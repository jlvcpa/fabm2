/**
 * Injects print-specific styles, flattens the DOM for printing, 
 * temporarily rewrites the document title and URL for native headers, 
 * triggers the print dialog, and cleans up.
 */
export const handlePrint = (mode, setPrintMode) => {
    setPrintMode(mode);

    // 1. Temporarily spoof the Title and the URL for the native print dialog
    const originalTitle = document.title;
    const originalUrl = window.location.href;
    
    // Set title to a blank space to empty out the top corner
    document.title = " "; 
    
    // Temporarily rewrite the URL. We use dashes because spaces turn into ugly '%20' in URLs.
    window.history.replaceState({}, '', '/FABM-2-[4Cs-Christ-centeredness-Competence-Character-Compassion]');

    // 2. Create Print CSS (No custom footer needed, relying on native)
    const printStyle = document.createElement('style');
    printStyle.id = 'dynamic-print-styles';
    printStyle.innerHTML = `
        @media print {
            @page {
                /* Exact Folio dimensions */
                size: 8.5in 13in;
                /* Standard margins. The native footer will print inside the bottom margin. */
                margin: 0.5in; 
            }

            /* --- HIDE UNWANTED UI ELEMENTS --- */
            #sidebar, #qa-sidebar, #student-sidebar, 
            #qa-toggle-sidebar, #qa-desktop-expand, button, 
            #page-title, .breadcrumb, .page-header-title,
            .print\\:hidden, .hide-in-print { 
                display: none !important; 
            }

            /* --- THE CHROME FLEXBOX & SCROLL BUG FIX --- */
            /* Forces all parent wrappers to be basic 'block' elements so pagination works */
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

            /* --- BULLETPROOF PAGINATION RULES --- */
            .exercise-item, tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                margin-bottom: 24px !important;
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
            
            // Restore original document title and URL
            document.title = originalTitle;
            window.history.replaceState({}, '', originalUrl);
            
            // Cleanup Styles
            const styleElement = document.getElementById('dynamic-print-styles');
            if (styleElement) styleElement.remove();
            
        }, 500); 
    }, 100);
};
