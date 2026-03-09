// studentGrades.js

// --- GRADING LOGIC & CONSTANTS ---
const WEIGHTS = {
    coursework: 0.30,
    performance: 0.50,
    exam: 0.20
};

const GRADE_VALUES = {
    'A': { method1: 1, method2: 100 },
    'P': { method1: 2, method2: 90 },
    'D': { method1: 3, method2: 80 },
    'IR': { method1: 4, method2: 70 }
};

// Returns Method 2 Letter Grade based on range
function getFinalLetterGrade(score) {
    if (score >= 94.50) return 'A';
    if (score >= 85.50) return 'P';
    if (score >= 74.50) return 'D';
    return 'IR';
}

// Returns Method 1 Letter Grade based on range
function getMethod1LetterGrade(score) {
    if (score === 0 || isNaN(score)) return '';
    if (score <= 1.49) return 'A';
    if (score <= 2.49) return 'P';
    if (score <= 3.49) return 'D';
    return 'IR';
}

// --- STATE MANAGEMENT (Mock Data & View State) ---
let currentSection = 'Section A';
let activityColumns = {
    coursework: 1,
    performance: 1,
    exam: 1
};

// Mock student data format
let studentsData = [
    {
        id: '101',
        name: 'Dela Cruz, Juan',
        grades: {
            coursework: ['A'],
            performance: ['P'],
            exam: ['D']
        }
    },
    {
        id: '102',
        name: 'Rizal, Jose',
        grades: {
            coursework: ['P'],
            performance: ['A'],
            exam: ['A']
        }
    }
];

// --- CALCULATION ENGINE ---
function calculateStudentGrades(student) {
    const calcAvg = (grades, method) => {
        const validGrades = grades.filter(g => GRADE_VALUES[g]);
        if (validGrades.length === 0) return 0;
        const sum = validGrades.reduce((acc, g) => acc + GRADE_VALUES[g][method], 0);
        return sum / validGrades.length;
    };

    const cwM1 = calcAvg(student.grades.coursework, 'method1');
    const cwM2 = Math.round(calcAvg(student.grades.coursework, 'method2'));
    
    const ptM1 = calcAvg(student.grades.performance, 'method1');
    const ptM2 = Math.round(calcAvg(student.grades.performance, 'method2'));
    
    const teM1 = calcAvg(student.grades.exam, 'method1');
    const teM2 = Math.round(calcAvg(student.grades.exam, 'method2'));

    const finalM2 = Math.round(
        (cwM2 * WEIGHTS.coursework) + 
        (ptM2 * WEIGHTS.performance) + 
        (teM2 * WEIGHTS.exam)
    );

    return {
        cwM1, cwM2,
        ptM1, ptM2,
        teM1, teM2,
        finalM2,
        finalLetter: getFinalLetterGrade(finalM2)
    };
}

// --- TEACHER VIEW RENDERER ---
export function renderTeacherGradesView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Header Controls (Dropdown)
    let html = `
        <div class="mb-6 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-slate-800">Gradebook Dashboard</h2>
            <select id="section-selector" class="border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm">
                <option value="Section A" ${currentSection === 'Section A' ? 'selected' : ''}>Section A</option>
                <option value="Section B" ${currentSection === 'Section B' ? 'selected' : ''}>Section B</option>
            </select>
        </div>
    `;

    // 5 Horizontal Panels using CSS Grid / Flexbox for horizontal scrolling responsiveness
    html += `
        <div class="w-full overflow-x-auto shadow-sm border border-gray-200 rounded-lg bg-white pb-4">
            <table class="w-full text-sm text-left min-w-max" id="grades-table">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                        <th class="px-4 py-3 border-r bg-gray-100 sticky left-0 z-10 w-48">Student Name</th>
                        
                        <th class="px-4 py-3 border-r text-center" colspan="${activityColumns.coursework}">
                            <div class="flex items-center justify-between">
                                <span>Coursework (30%)</span>
                                <button class="btn-add-col text-blue-600 hover:text-blue-800" data-cat="coursework"><i class="fas fa-plus-circle"></i></button>
                            </div>
                        </th>
                        
                        <th class="px-4 py-3 border-r text-center bg-blue-50" colspan="${activityColumns.performance}">
                            <div class="flex items-center justify-between">
                                <span>Performance Task (50%)</span>
                                <button class="btn-add-col text-blue-600 hover:text-blue-800" data-cat="performance"><i class="fas fa-plus-circle"></i></button>
                            </div>
                        </th>
                        
                        <th class="px-4 py-3 border-r text-center" colspan="${activityColumns.exam}">
                            <div class="flex items-center justify-between">
                                <span>Term Exam (20%)</span>
                                <button class="btn-add-col text-blue-600 hover:text-blue-800" data-cat="exam"><i class="fas fa-plus-circle"></i></button>
                            </div>
                        </th>
                        
                        <th class="px-4 py-3 text-center bg-green-50 w-32">Final Grade</th>
                    </tr>
                    <tr class="bg-gray-50 border-b">
                        <th class="border-r bg-gray-100 sticky left-0 z-10"></th>
                        ${generateSubHeaders('coursework', activityColumns.coursework)}
                        ${generateSubHeaders('performance', activityColumns.performance, 'bg-blue-50')}
                        ${generateSubHeaders('exam', activityColumns.exam)}
                        <th class="text-center text-[10px] text-gray-500 bg-green-50 border-b">Method 2</th>
                    </tr>
                </thead>
                <tbody id="grades-tbody">
                    ${generateTeacherRows()}
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
    attachTeacherEvents(containerId);
}

function generateSubHeaders(category, count, bgClass = '') {
    let headers = '';
    for (let i = 0; i < count; i++) {
        headers += `<th class="px-2 py-2 border-r text-center font-medium ${bgClass}">C${i + 1}</th>`;
    }
    return headers;
}

function generateTeacherRows() {
    return studentsData.map((student, index) => {
        const computed = calculateStudentGrades(student);
        return `
            <tr class="border-b hover:bg-slate-50 transition-colors" data-student-id="${student.id}">
                <td class="px-4 py-3 border-r font-medium text-slate-800 bg-white sticky left-0 z-10 whitespace-nowrap">${student.name}</td>
                
                ${generateInputCells(student, 'coursework', activityColumns.coursework)}
                ${generateInputCells(student, 'performance', activityColumns.performance, 'bg-blue-50')}
                ${generateInputCells(student, 'exam', activityColumns.exam)}
                
                <td class="px-4 py-3 text-center bg-green-50 font-bold">
                    <span class="text-lg text-green-700">${computed.finalLetter}</span>
                    <span class="text-xs text-gray-500 ml-1">(${computed.finalM2})</span>
                </td>
            </tr>
        `;
    }).join('');
}

function generateInputCells(student, category, count, bgClass = '') {
    let cells = '';
    const grades = student.grades[category];
    for (let i = 0; i < count; i++) {
        const val = grades[i] || '';
        cells += `
            <td class="px-2 py-2 border-r text-center ${bgClass}">
                <select class="grade-input w-14 p-1 border border-gray-300 rounded text-center focus:ring-blue-500 focus:border-blue-500 outline-none uppercase" 
                        data-student-id="${student.id}" data-category="${category}" data-index="${i}">
                    <option value="" ${val === '' ? 'selected' : ''}>-</option>
                    <option value="A" ${val === 'A' ? 'selected' : ''}>A</option>
                    <option value="P" ${val === 'P' ? 'selected' : ''}>P</option>
                    <option value="D" ${val === 'D' ? 'selected' : ''}>D</option>
                    <option value="IR" ${val === 'IR' ? 'selected' : ''}>IR</option>
                </select>
            </td>
        `;
    }
    return cells;
}

function attachTeacherEvents(containerId) {
    // Add Column Buttons
    document.querySelectorAll('.btn-add-col').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cat = e.currentTarget.getAttribute('data-cat');
            activityColumns[cat]++;
            renderTeacherGradesView(containerId); // Re-render to show new column
        });
    });

    // Grade Inputs Change Event
    document.querySelectorAll('.grade-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const studentId = e.target.getAttribute('data-student-id');
            const category = e.target.getAttribute('data-category');
            const index = parseInt(e.target.getAttribute('data-index'));
            const value = e.target.value.toUpperCase();

            // Update state
            const student = studentsData.find(s => s.id === studentId);
            if(student) {
                student.grades[category][index] = value;
                renderTeacherGradesView(containerId); // Re-render table for updated calculation
            }
        });
    });
}

// --- STUDENT VIEW RENDERER ---
export function renderStudentGradesView(containerId, studentId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const student = studentsData.find(s => s.id === studentId);
    if (!student) {
        container.innerHTML = `<div class="p-8 text-center text-gray-500">Student data not found.</div>`;
        return;
    }

    const computed = calculateStudentGrades(student);

    // Vertical Stack layout best for mobile
    let html = `
        <div class="max-w-2xl mx-auto flex flex-col gap-6 fade-in">
            <div class="bg-blue-600 text-white p-6 rounded-t-xl shadow-md">
                <h2 class="text-2xl font-bold">${student.name}</h2>
                <p class="text-blue-100 mt-1">Academic Performance Dashboard</p>
            </div>
            
            ${generateStudentCategoryCard('CourseWorks', student.grades.coursework, computed.cwM1)}
            ${generateStudentCategoryCard('Performance Tasks', student.grades.performance, computed.ptM1)}
            ${generateStudentCategoryCard('Term Exam', student.grades.exam, computed.teM1)}

            <div class="bg-white border-2 border-green-500 rounded-xl shadow-lg p-6 mt-4 flex items-center justify-between">
                <div>
                    <h3 class="text-xl font-bold text-slate-800">Final Term Grade</h3>
                    <p class="text-sm text-gray-500">Computed via Method 2 Weighting</p>
                </div>
                <div class="text-right flex items-center gap-4">
                    <div class="flex flex-col items-end">
                        <span class="text-3xl font-black text-green-600">${computed.finalLetter}</span>
                        <span class="text-sm font-semibold text-gray-600">${computed.finalM2} / 100</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function generateStudentCategoryCard(title, grades, m1Average) {
    const gradeRows = grades.map((g, i) => {
        const bg = g === 'A' ? 'bg-green-100 text-green-800' : 
                   g === 'P' ? 'bg-blue-100 text-blue-800' :
                   g === 'D' ? 'bg-yellow-100 text-yellow-800' : 
                   g === 'IR' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-500';
                   
        return `
            <div class="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
                <span class="text-sm font-medium text-slate-700">Competency C${i + 1}</span>
                <span class="px-3 py-1 rounded-full text-xs font-bold ${bg}">${g || 'N/A'}</span>
            </div>
        `;
    }).join('');

    const letterAvg = getMethod1LetterGrade(m1Average);

    return `
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="bg-slate-50 px-4 py-3 border-b border-gray-200">
                <h3 class="font-bold text-slate-800">${title}</h3>
            </div>
            <div class="flex flex-col">
                ${gradeRows || '<div class="p-4 text-sm text-gray-400 italic">No competencies recorded yet.</div>'}
            </div>
            <div class="bg-slate-100 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
                <span class="text-xs font-bold text-slate-500 uppercase">Summary Average (Method 1)</span>
                <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-slate-800">${letterAvg}</span>
                    <span class="text-xs text-slate-500">(${m1Average.toFixed(2)})</span>
                </div>
            </div>
        </div>
    `;
}
