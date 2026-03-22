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
    // Applying inline styles here prevents a micro-second rendering glitch that can cause a blank page
    footer.style.cssText = "display: flex; position: fixed; bottom: -0.6in; left: 0; width: 100%; font-size: 10px; font-family: sans-serif; background: white; padding: 0.05in; box-sizing: border-box; z-index: 9999; align-items: flex-end;";
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
        @media print {
            @page {
                size: auto;
                /* Top, Right, BOTTOM, Left */
                /* The massive 1.0in bottom margin stops the text from printing too low on EVERY page */
                margin: 0.35in 0.35in 1.0in 0.35in;
            }

            html, body {
                /* Let the pages flow infinitely downwards */
                height: auto !important;
                min-height: auto !important;
                max-height: none !important;
                width: 100% !important;
                background-color: white !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important; /* CRITICAL for preventing blank pages */
            }

            .max-w-5xl {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
            }

            #dynamic-print-footer {
                display: flex !important;
            }

            /* --- PAGINATION RULES --- */
            .bg-white.border.rounded, 
            .border.rounded.bg-white, 
            tr {
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

    // 3. Isolate the target container and fix ALL parent constraints
    const targetContainer = document.querySelector('.max-w-5xl');
    const hiddenElements = [];
    const modifiedAncestors = [];

    if (targetContainer) {
        let currentEl = targetContainer;
        while (currentEl && currentEl !== document.body) {
            // Hide siblings (sidebars, navbars, etc.)
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
            
            // Save original styles to restore later
            modifiedAncestors.push({
                el: currentEl,
                width: currentEl.style.width,
                margin: currentEl.style.margin,
                padding: currentEl.style.padding,
                position: currentEl.style.position,
                overflow: currentEl.style.overflow, // <--- SAVED
                height: currentEl.style.height      // <--- SAVED
            });
            
            // Force this element to expand infinitely for the printer
            currentEl.style.width = '100%';
            currentEl.style.margin = '0';
            currentEl.style.padding = '0';
            currentEl.style.position = 'static';
            currentEl.style.overflow = 'visible'; // <--- STRIPS SCROLLBARS FOR PRINTING
            currentEl.style.height = 'auto';      // <--- PREVENTS BLANK NEXT PAGES
            
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
                item.el.style.overflow = item.overflow; // <--- RESTORED
                item.el.style.height = item.height;     // <--- RESTORED
            });
            
        }, 500); 
    }, 100);
};
