/**
 * Injects print-specific styles, triggers the print dialog, 
 * and then cleans up the styles afterward.
 * * @param {string} mode - 'all' to print everything, or the ID of a specific section (e.g., 'test-0', 'step-1').
 * @param {function} setPrintMode - React state setter to update the component's print state (used for hiding/showing elements).
 */
export const handlePrint = (mode, setPrintMode) => {
    setPrintMode(mode);

    // Create a style element for the print CSS
    const printStyle = document.createElement('style');
    printStyle.id = 'dynamic-print-styles';
    printStyle.innerHTML = `
        @media print {
            #qa-sidebar, #student-sidebar, button, .print\\:hidden, .hide-in-print { 
                display: none !important; 
            }

            @page {
                size: auto;
                margin: 10mm;
            }

            html, body, #root, #qa-runner-container, .flex.h-full.relative.overflow-hidden, .max-w-5xl {
                height: auto !important;
                min-height: auto !important;
                max-height: none !important;
                width: 100% !important;
                max-width: 100% !important;
                overflow: visible !important;
                position: static !important;
                margin: 0 !important;
                padding: 0 !important;
                display: block !important;
                background-color: white !important;
            }
            
            .flex-col.gap-12, .flex-col.gap-8, .flex-col.gap-6 { gap: 0 !important; display: block !important; }
            .mb-8 { margin-bottom: 2rem !important; }

            .overflow-y-auto, .overflow-x-auto, .overflow-auto, .overflow-hidden,
            .absolute, .relative, .fixed, .inset-0, [class*="max-h-"], [class*="h-"], .flex-1 {
                height: auto !important;
                max-height: none !important;
                min-height: auto !important;
                overflow: visible !important;
                position: static !important;
                flex: none !important;
            }

            .border-gray-200.rounded.p-2.bg-gray-50 *, .border-gray-200.rounded.p-2.bg-gray-50 {
                position: static !important;
                overflow: visible !important;
                height: auto !important;
                max-height: none !important;
            }

            .bg-white.border.rounded-lg, .border.rounded.p-4, .break-inside-avoid, .question-block {
                page-break-inside: auto !important;
                break-inside: auto !important;
                page-break-after: auto !important;
                page-break-before: auto !important;
                margin: 0 0 20px 0 !important;
                border: none !important;
                box-shadow: none !important;
            }

            .bg-slate-800, .bg-blue-900 {
                background-color: transparent !important;
                color: black !important;
                border-bottom: 2px solid black !important;
                padding: 5px 0 !important;
            }
            .text-yellow-400, .text-yellow-300, .text-white { color: black !important; }

            table { 
                page-break-inside: auto !important; 
                width: 100% !important; 
                max-width: 100% !important;
                border-collapse: collapse !important; 
                font-size: 10px !important; 
            }
            tr { page-break-inside: avoid !important; page-break-after: auto !important; }
            td, th { page-break-inside: avoid !important; padding: 3px !important; }
            thead { display: table-header-group !important; }
            
            input, textarea {
                border: none !important;
                background: transparent !important;
                font-size: 10px !important;
                padding: 0 !important;
                margin: 0 !important;
                height: auto !important;
                resize: none !important;
            }
        }
    `;

    // Inject styles, wait for render cycle, print, then cleanup
    document.head.appendChild(printStyle);
    
    setTimeout(() => {
        window.print();
        setTimeout(() => {
            setPrintMode('all');
            const styleElement = document.getElementById('dynamic-print-styles');
            if (styleElement) {
                styleElement.remove();
            }
        }, 500); 
    }, 100);
};
