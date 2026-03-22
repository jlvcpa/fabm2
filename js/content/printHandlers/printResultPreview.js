/**
 * Injects print-specific styles, isolates the preview container from sidebars,
 * injects the custom footer, triggers the print dialog, and cleans up afterward.
 * * @param {string} mode - 'all' to print everything, or the ID of a specific section (e.g., 'test-0', 'step-1').
 * @param {function} setPrintMode - React state setter to update the component's print state (used for hiding/showing parts).
 */
export const handlePrint = (mode, setPrintMode) => {
    setPrintMode(mode);

    // 1. Create Custom Footer
    const footer = document.createElement('div');
    footer.id = 'dynamic-print-footer';
    footer.innerHTML = `
        <div style="flex: 1; text-align: left; font-weight: bold; font-size: 11px;">FABM 2</div>
        <div style="flex: 2; text-align: center;">
            <span style="border: 0.5px solid black; padding: 0.25rem;">4Cs: Christ-centeredness, Competence, Character, Compassion</span>
        </div>
        <div style="flex: 1; text-align: right; font-weight: bold; font-size: 11px;">Page <span class="page-num"></span></div>
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
                size: auto;
                margin: 0.5in;
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
            
            body {
                padding-bottom: 1in !important; /* Spacing above bottom margin for the footer */
                counter-reset: page;
            }

            .max-w-5xl {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
            }

            /* Custom Footer Layout */
            #dynamic-print-footer {
                display: flex !important;
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                font-size: 10px;
                font-family: sans-serif;
                background: white;
                padding: 0.07in 0.15in 0 0.15in;
                box-sizing: border-box;
                z-index: 9999;
                align-items: flex-end;
            }

            .page-num::after {
                content: counter(page);
            }

            /* --- NEW PAGINATION RULES --- */
            /* Forces whole question blocks and table rows to stay intact on the same page */
            .border.rounded.p-4, tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
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
            
            // Cleanup Footer & Styles
            const styleElement = document.getElementById('dynamic-print-styles');
            if (styleElement) styleElement.remove();
            
            const footerElement = document.getElementById('dynamic-print-footer');
            if (footerElement) footerElement.remove();
            
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
