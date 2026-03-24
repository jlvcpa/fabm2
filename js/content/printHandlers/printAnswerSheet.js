/**
 * Generates a ZipGrade-style OMR Answer Sheet based on the activity data.
 * It includes corner registration markers, the official header, and a clean bubble grid.
 */
export const handlePrintAnswerSheet = (activityConfig, questionsTaken) => {
    // 1. Extract and sequence all Multiple Choice questions
    let questionsList = [];
    if (activityConfig && activityConfig.testQuestions) {
        activityConfig.testQuestions.forEach((section, idx) => {
            if (section.type === "Multiple Choice") {
                // Find all questions belonging to this section in the questionsTaken map
                const sectionQs = Object.keys(questionsTaken)
                    .filter(key => key.startsWith(`s${idx}_`))
                    .sort((a, b) => {
                        const aIdx = parseInt(a.split('_')[1].replace('q',''));
                        const bIdx = parseInt(b.split('_')[1].replace('q',''));
                        return aIdx - bIdx;
                    });
                
                sectionQs.forEach(qKey => {
                    questionsList.push({ uiId: qKey, qNum: questionsList.length + 1 });
                });
            }
        });
    }

    if (questionsList.length === 0) {
        alert("There are no Multiple Choice questions in this activity to generate an answer sheet for.");
        return;
    }

    // 2. Build the Document Wrapper
    const sheetWrapper = document.createElement('div');
    sheetWrapper.id = 'omr-print-wrapper';
    
    // 3. Build the Bubble Grid HTML (4 Columns)
    const options = ['A', 'B', 'C', 'D'];
    const gridHtml = questionsList.map(q => `
        <div class="omr-row">
            <div class="omr-num">${q.qNum}.</div>
            <div class="omr-bubbles">
                ${options.map(opt => `<div class="omr-bubble">${opt}</div>`).join('')}
            </div>
        </div>
    `).join('');

    // 4. Inject the layout (Header + Grid + Corner Markers)
    sheetWrapper.innerHTML = `
        <div class="omr-page">
            <div class="marker marker-tl"></div>
            <div class="marker marker-tr"></div>
            <div class="marker marker-bl"></div>
            <div class="marker marker-br"></div>

            <div class="omr-header text-center">
                <img src="./shs-adc-logo.png" alt="School Logo" onerror="this.style.display='none'" />
                <h2 class="text-blue-900 font-bold uppercase">Senior High School<br>Department</h2>
                <p class="font-bold">SY 2025-2026<br>Second Semester</p>
                <p class="font-bold uppercase">${activityConfig.activityname || activityConfig.title || 'Final Exam'}</p>
                <h1 class="text-xl font-bold uppercase mt-2">Answer Sheet</h1>
                <h2 class="text-lg font-bold mt-2">FABM 2</h2>
            </div>

            <div class="omr-student-info">
                <div class="info-row">
                    <div class="info-field">Class Number: <span class="line"></span></div>
                    <div class="info-field">Date: <span class="line"></span></div>
                </div>
                <div class="info-row">
                    <div class="info-field">Name: <span class="line"></span></div>
                    <div class="info-field">Subject Teacher: <span class="line"></span></div>
                </div>
                <div class="info-row">
                    <div class="info-field">Section: <span class="line"></span></div>
                    <div class="info-field">Proctor: <span class="line"></span></div>
                </div>
            </div>

            <div class="omr-grid-container">
                ${gridHtml}
            </div>
        </div>
    `;

    document.body.appendChild(sheetWrapper);

    // 5. Apply Strict Print CSS for Scanning Accuracy
    const printStyle = document.createElement('style');
    printStyle.id = 'omr-print-styles';
    printStyle.innerHTML = `
        #omr-print-wrapper { display: none; }

        @media print {
            @page { size: 8.5in 11in; margin: 0.5in; }
            body > *:not(#omr-print-wrapper) { display: none !important; }
            
            #omr-print-wrapper { 
                display: block !important; 
                width: 100% !important; 
                background: white !important; 
                font-family: "Times New Roman", Times, serif !important;
                color: black !important;
            }

            .omr-page { position: relative; width: 100%; height: 100%; padding: 40px; box-sizing: border-box; }

            /* Corner Markers for OpenCV / Scanner Apps */
            .marker { position: absolute; width: 30px; height: 30px; background: black; }
            .marker-tl { top: 0; left: 0; clip-path: polygon(0 0, 100% 0, 100% 20%, 20% 20%, 20% 100%, 0 100%); }
            .marker-tr { top: 0; right: 0; clip-path: polygon(0 0, 100% 0, 100% 100%, 80% 100%, 80% 20%, 0 20%); }
            .marker-bl { bottom: 0; left: 0; clip-path: polygon(0 0, 20% 0, 20% 80%, 100% 80%, 100% 100%, 0 100%); }
            .marker-br { bottom: 0; right: 0; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 80%, 80% 80%, 80% 0); }

            /* Header Styling */
            .omr-header img { width: 80px; height: auto; margin: 0 auto 10px auto; display: block; }
            .omr-header h2 { font-size: 14pt; margin: 0; }
            .omr-header h1 { font-size: 18pt; margin: 10px 0; letter-spacing: 2px; }
            .omr-header p { font-size: 12pt; margin: 2px 0; }
            .text-center { text-align: center; }

            /* Student Info */
            .omr-student-info { margin-top: 30px; margin-bottom: 40px; font-weight: bold; font-size: 12pt; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 15px; }
            .info-field { display: flex; width: 48%; align-items: flex-end; }
            .line { flex-grow: 1; border-bottom: 1px solid black; margin-left: 10px; }

            /* 4-Column Bubble Grid */
            .omr-grid-container {
                column-count: 4;
                column-gap: 40px;
                column-rule: 1px solid #ccc;
            }
            
            .omr-row { 
                display: flex; 
                align-items: center; 
                margin-bottom: 12px; 
                break-inside: avoid;
                page-break-inside: avoid;
            }
            .omr-num { width: 25px; text-align: right; margin-right: 12px; font-weight: bold; font-size: 12pt; }
            .omr-bubbles { display: flex; gap: 8px; }
            
            /* High-contrast thick borders for scanner thresholding */
            .omr-bubble { 
                width: 22px; 
                height: 22px; 
                border: 2px solid black; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 10px; 
                font-weight: bold;
                font-family: Arial, sans-serif;
            }
        }
    `;
    document.head.appendChild(printStyle);

    // 6. Temporarily clear title to avoid URL printing over the markers
    const originalTitle = document.title;
    document.title = " "; 

    setTimeout(() => {
        window.print();
        setTimeout(() => {
            document.title = originalTitle;
            const styleEl = document.getElementById('omr-print-styles');
            if (styleEl) styleEl.remove();
            const wrapperEl = document.getElementById('omr-print-wrapper');
            if (wrapperEl) wrapperEl.remove();
        }, 500);
    }, 200);
};
