/**
 * Injects print-specific styles, isolates the preview container from sidebars,
 * injects the custom footer, triggers the print dialog, and cleans up afterward.
 * * @param {string} mode - 'all' to print everything, or the ID of a specific section (e.g., 'test-0', 'step-1').
 * @param {function} setPrintMode - React state setter to update the component's print state (used for hiding/showing parts).
 */
export const handlePrint = (mode, setPrintMode) => {
    setPrintMode(mode);

    // FOOTER CODE COMPLETELY REMOVED FOR DEBUGGING

    // 2. Create Print CSS
    const printStyle = document.createElement('style');
    printStyle.id = 'dynamic-print-styles';
    printStyle.innerHTML = `
        @media print {
            @page {
                /* Set exact Folio paper dimensions */
                size: 8.5in 13in;
                /* Let's see if the browser actually leaves a 1.2-inch blank space at the bottom */
                margin: 0.4in 0.4in 0.4in 0.4in; 
            }

            html, body {
                height: auto !important;
                min-height: auto !important;
                max-height: none !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background-color: white !important;
            }
            
            .max-w-5xl {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
            }

            /* --- THE CHROME FLEXBOX FIX --- */
            /* Chrome ignores page breaks inside flex containers. We MUST force the main wrappers to 'block'. */
            #qa-runner-container, 
            #qa-runner-container > div,
            #quiz-form, 
            .test-section-panel, 
            .exercise-item {
                display: block !important;
                height: auto !important;
                overflow: visible !important;
            }

            /* --- BULLETPROOF PAGINATION RULES --- */
            .exercise-item, tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                margin-bottom: 1.5rem !important;
            }

            button, .print\\:hidden, .hide-in-print { 
                display: none !important; 
            }

            /* Standardized Table & Formatting */
            table { 
                width: 100% !important; 
                border-collapse: collapse !important; 
                font-size: 10px !important; 
            }
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

    // 3. Isolate the target container to aggressively hide sidebars
    const targetContainer = document.querySelector('.max-w-5xl');
    const hiddenElements = [];
    const modifiedAncestors = [];

    if (targetContainer) {
        let currentEl = targetContainer;
        while (currentEl && currentEl !== document.body) {
            const siblings = Array.from(currentEl.parentNode.children);
            siblings.forEach(sibling => {
                if (
                    sibling !== currentEl && 
                    sibling.tagName !== 'SCRIPT' && 
                    sibling.tagName !== 'STYLE' && 
                    sibling.id !== 'dynamic-print-footer'
                ) {
                    hiddenElements.push({ el: sibling, display: sibling.style.display });
                    sibling.style.display = 'none';
                }
            });
            
            modifiedAncestors.push({
                el: currentEl,
                width: currentEl.style.width,
                margin: currentEl.style.margin,
                padding: currentEl.style.padding,
                position: currentEl.style.position
            });
            
            currentEl.style.width = '100%';
            currentEl.style.margin = '0';
            currentEl.style.padding = '0';
            currentEl.style.position = 'static';
            
            currentEl = currentEl.parentNode;
        }
    }

    // 4. Trigger Print and Cleanup after completion
    setTimeout(() => {
        window.print();
        
        setTimeout(() => {
            setPrintMode('all');
            
            // Cleanup Styles
            const styleElement = document.getElementById('dynamic-print-styles');
            if (styleElement) styleElement.remove();
            
            // Restore hidden sidebars and containers
            hiddenElements.forEach(item => {
                item.el.style.display = item.display;
            });
            
            // Restore ancestor styles
            modifiedAncestors.forEach(item => {
                item.el.style.width = item.width;
                item.el.style.margin = item.margin;
                item.el.style.padding = item.padding;
                item.el.style.position = item.position;
            });
            
        }, 500); 
    }, 100);
};
