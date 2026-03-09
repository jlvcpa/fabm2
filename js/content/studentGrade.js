// studentGrade.js

import { getFirestore, collection, getDocs, doc, setDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyAgOsKAZWwExUzupxSNytsfOo9BOppF0ng",
    authDomain: "jlvcpa-quizzes.firebaseapp.com",
    projectId: "jlvcpa-quizzes",
    storageBucket: "jlvcpa-quizzes.appspot.com",
    messagingSenderId: "629158256557",
    appId: "1:629158256557:web:b3d1a424b32e28cd578b24"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- GRADING CONSTANTS & UTILITIES ---
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

function getFinalLetterGrade(score) {
    if (score === 0 || isNaN(score)) return '-';
    if (score >= 94.50) return 'A';
    if (score >= 85.50) return 'P';
    if (score >= 74.50) return 'D';
    return 'IR';
}

function getMethod1LetterGrade(score) {
    if (score === 0 || isNaN(score)) return '-';
    if (score <= 1.49) return 'A';
    if (score <= 2.49) return 'P';
    if (score <= 3.49) return 'D';
    return 'IR';
}

// --- STATE MANAGEMENT ---
let currentUser = null;
let currentTerm = 'Term 1'; // Default, can be toggleable if needed
let currentSection = ''; 
let activityColumns = {
    coursework: 1,
    performance: 1,
    exam: 1
};
let studentsData = []; // Holds the active roster and their grade states

// --- MAIN ENTRY POINT ---
export async function renderGradesView(containerId, user) {
    currentUser = user;
    const container = document.getElementById(containerId);
    if (!container) return;

    if (user.role === 'teacher') {
        renderTeacherLayout(container);
        await populateSectionDropdown();
    } else {
        renderStudentLayout(container);
        await loadStudentPersonalGrades();
    }
}

// ==========================================
//              TEACHER VIEW
// ==========================================

function renderTeacherLayout(container) {
    let html = `
        <div class="flex flex-col h-full bg-gray-50 fade-in p-4 md:p-8">
            
            <div class="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800"><i class="fas fa-clipboard-list text-blue-600 mr-2"></i> Gradebook Manager</h2>
                    <p class="text-sm text-gray-500 mt-1">Select a section to input grades. Grades auto-compute but require saving to persist.</p>
                </div>
                
                <div class="flex items-center gap-3 w-full md:w-auto">
                    <select id="term-selector" class="border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm">
                        <option value="Term 1" selected>Term 1</option>
                        <option value="Term 2">Term 2</option>
                    </select>
                    
                    <select id="section-selector" class="border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm flex-1 md:w-48">
                        <option value="">Loading Sections...</option>
                    </select>

                    <button id="btn-save-grades" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow font-bold text-sm transition-colors flex items-center whitespace-nowrap hidden">
                        <i class="fas fa-save mr-2"></i> Save Grades
                    </button>
                </div>
            </div>

            <div id="gradesheet-container" class="w-full flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center text-gray-400">
                <div class="text-center">
                    <i class="fas fa-users text-4xl mb-3"></i>
                    <p>Please select a section to load the gradesheet.</p>
                </div>
            </div>

        </div>
    `;
    container.innerHTML = html;

    // Attach base event listeners
    document.getElementById('section-selector').addEventListener('change', async (e) => {
        currentSection = e.target.value;
        if (currentSection) {
            document.getElementById('gradesheet-container').innerHTML = '<div class="p-10 text-center w-full"><i class="fas fa-spinner fa-spin text-3xl text-blue-600 mb-3"></i><p>Loading Class Roster...</p></div>';
            await loadTeacherGradesheet();
            document.getElementById('btn-save-grades').classList.remove('hidden');
        } else {
            document.getElementById('gradesheet-container').innerHTML = '<div class="text-center"><i class="fas fa-users text-4xl mb-3"></i><p>Please select a section to load the gradesheet.</p></div>';
            document.getElementById('btn-save-grades').classList.add('hidden');
        }
    });

    document.getElementById('term-selector').addEventListener('change', async (e) => {
        currentTerm = e.target.value;
        if (currentSection) {
             document.getElementById('gradesheet-container').innerHTML = '<div class="p-10 text-center w-full"><i class="fas fa-spinner fa-spin text-3xl text-blue-600 mb-3"></i><p>Reloading Term Data...</p></div>';
             await loadTeacherGradesheet();
        }
    });

    document.getElementById('btn-save-grades').addEventListener('click', saveGradesToFirebase);
}

async function populateSectionDropdown() {
    const dropdown = document.getElementById('section-selector');
    try {
        const snapshot = await getDocs(collection(db, "students"));
        const sections = new Set();
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.Section) sections.add(data.Section);
        });

        const sortedSections = Array.from(sections).sort();
        dropdown.innerHTML = `<option value="">-- Select Section --</option>` + 
                             sortedSections.map(s => `<option value="${s}">${s}</option>`).join('');
    } catch (error) {
        console.error("Error fetching sections:", error);
        dropdown.innerHTML = `<option value="">Error loading sections</option>`;
    }
}

async function loadTeacherGradesheet() {
    try {
        // 1. Fetch Students for the selected section
        const studentsQuery = query(collection(db, 'students'), where('Section', '==', currentSection));
        const studentsSnap = await getDocs(studentsQuery);
        
        // 2. Fetch existing grades for this section and term
        const gradesQuery = query(collection(db, 'studentGrade'), where('section', '==', currentSection), where('gradeTerm', '==', currentTerm));
        const gradesSnap = await getDocs(gradesQuery);
        
        const existingGradesMap = new Map();
        gradesSnap.forEach(doc => {
            const data = doc.data();
            existingGradesMap.set(data.studentId, data);
        });

        studentsData = [];
        let maxCw = 1, maxPt = 1, maxEx = 1;

        studentsSnap.forEach(doc => {
            const sData = doc.data();
            const existingGrade = existingGradesMap.get(sData.Idnumber) || {};
            
            // Ensure data structure
            const cw = existingGrade.coursework || [];
            const pt = existingGrade.performance || [];
            const ex = existingGrade.exam || [];

            // Update column counts if existing data has more competencies
            if (cw.length > maxCw) maxCw = cw.length;
            if (pt.length > maxPt) maxPt = pt.length;
            if (ex.length > maxEx) maxEx = ex.length;

            studentsData.push({
                ...sData,
                grades: { coursework: cw, performance: pt, exam: ex }
            });
        });

        // Sort by CN
        studentsData.sort((a, b) => (Number(a.CN) || 999) - (Number(b.CN) || 999));

        // Update global column trackers
        activityColumns = { coursework: maxCw, performance: maxPt, exam: maxEx };

        renderGradesheetTable();

    } catch (error) {
        console.error("Error loading gradesheet:", error);
        document.getElementById('gradesheet-container').innerHTML = `<div class="p-8 text-red-500 text-center">Error loading roster: ${error.message}</div>`;
    }
}

function renderGradesheetTable() {
    const container = document.getElementById('gradesheet-container');
    
    let html = `
        <div class="w-full h-full overflow-auto">
            <table class="w-full text-sm text-left min-w-max border-collapse" id="grades-table">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b sticky top-0 z-20">
                    <tr>
                        <th class="px-4 py-3 border-r bg-gray-100 sticky left-0 z-30 w-16 text-center">CN</th>
                        <th class="px-4 py-3 border-r bg-gray-100 sticky left-16 z-30 w-48">Student Name</th>
                        
                        <th class="px-2 py-2 border-r text-center" colspan="${activityColumns.coursework}">
                            <div class="flex items-center justify-between gap-2">
                                <span>Coursework (30%)</span>
                                <button class="btn-add-col text-blue-600 hover:text-blue-800 focus:outline-none" data-cat="coursework" title="Add Competency"><i class="fas fa-plus-circle"></i></button>
                            </div>
                        </th>
                        
                        <th class="px-2 py-2 border-r text-center bg-blue-50" colspan="${activityColumns.performance}">
                            <div class="flex items-center justify-between gap-2">
                                <span>Perf. Task (50%)</span>
                                <button class="btn-add-col text-blue-600 hover:text-blue-800 focus:outline-none" data-cat="performance" title="Add Competency"><i class="fas fa-plus-circle"></i></button>
                            </div>
                        </th>
                        
                        <th class="px-2 py-2 border-r text-center" colspan="${activityColumns.exam}">
                            <div class="flex items-center justify-between gap-2">
                                <span>Term Exam (20%)</span>
                                <button class="btn-add-col text-blue-600 hover:text-blue-800 focus:outline-none" data-cat="exam" title="Add Competency"><i class="fas fa-plus-circle"></i></button>
                            </div>
                        </th>
                        
                        <th class="px-4 py-3 text-center bg-green-50 w-32 border-b">Final Grade</th>
                    </tr>
                    <tr class="bg-gray-50 border-b text-[10px] text-gray-500 tracking-wider">
                        <th class="border-r bg-gray-100 sticky left-0 z-30 border-b"></th>
                        <th class="border-r bg-gray-100 sticky left-16 z-30 border-b"></th>
                        ${generateSubHeaders('coursework', activityColumns.coursework)}
                        ${generateSubHeaders('performance', activityColumns.performance, 'bg-blue-50')}
                        ${generateSubHeaders('exam', activityColumns.exam)}
                        <th class="text-center bg-green-50 border-b p-1">Method 2</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${studentsData.map(student => generateTeacherRow(student)).join('')}
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
    attachGradesheetEvents();
}

function generateSubHeaders(category, count, bgClass = '') {
    let headers = '';
    for (let i = 0; i < count; i++) {
        headers += `<th class="px-1 py-1 border-r border-b text-center font-bold ${bgClass} w-16">C${i + 1}</th>`;
    }
    return headers;
}

function generateTeacherRow(student) {
    const computed = calculateGrades(student.grades);
    
    return `
        <tr class="hover:bg-slate-50 transition-colors group">
            <td class="px-2 py-2 border-r text-center font-bold text-gray-500 bg-white group-hover:bg-slate-50 sticky left-0 z-10">${student.CN || '-'}</td>
            <td class="px-4 py-2 border-r font-medium text-slate-800 bg-white group-hover:bg-slate-50 sticky left-16 z-10 whitespace-nowrap truncate max-w-[200px]" title="${student.LastName}, ${student.FirstName}">${student.LastName}, ${student.FirstName}</td>
            
            ${generateInputCells(student, 'coursework', activityColumns.coursework)}
            ${generateInputCells(student, 'performance', activityColumns.performance, 'bg-blue-50')}
            ${generateInputCells(student, 'exam', activityColumns.exam)}
            
            <td class="px-4 py-2 text-center bg-green-50/50 font-bold border-l" id="final-${student.Idnumber}">
                <span class="text-lg ${computed.finalM2 >= 75 ? 'text-green-700' : 'text-red-600'}">${computed.finalLetter}</span>
                <span class="text-xs text-gray-500 ml-1">(${computed.finalM2})</span>
            </td>
        </tr>
    `;
}

function generateInputCells(student, category, count, bgClass = '') {
    let cells = '';
    const grades = student.grades[category];
    for (let i = 0; i < count; i++) {
        const val = grades[i] || '';
        cells += `
            <td class="p-1 border-r text-center ${bgClass}">
                <select class="grade-input w-full min-w-[3rem] p-1.5 border border-transparent hover:border-gray-300 rounded text-center text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-bold text-gray-700 bg-transparent focus:bg-white transition-all" 
                        data-student-id="${student.Idnumber}" data-category="${category}" data-index="${i}">
                    <option value="" ${val === '' ? 'selected' : ''}>-</option>
                    <option value="A" ${val === 'A' ? 'selected' : ''} class="text-green-700">A</option>
                    <option value="P" ${val === 'P' ? 'selected' : ''} class="text-blue-700">P</option>
                    <option value="D" ${val === 'D' ? 'selected' : ''} class="text-yellow-700">D</option>
                    <option value="IR" ${val === 'IR' ? 'selected' : ''} class="text-red-700">IR</option>
                </select>
            </td>
        `;
    }
    return cells;
}

function attachGradesheetEvents() {
    // Add Column Logic
    document.querySelectorAll('.btn-add-col').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cat = e.currentTarget.getAttribute('data-cat');
            activityColumns[cat]++;
            renderGradesheetTable(); // Re-render table layout
        });
    });

    // Auto-compute Logic on Input Change
    document.querySelectorAll('.grade-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const studentId = e.target.getAttribute('data-student-id');
            const category = e.target.getAttribute('data-category');
            const index = parseInt(e.target.getAttribute('data-index'));
            const value = e.target.value.toUpperCase();

            // Find student and update local state
            const student = studentsData.find(s => s.Idnumber === studentId);
            if (student) {
                student.grades[category][index] = value;
                
                // Recalculate
                const computed = calculateGrades(student.grades);
                
                // DOM Update (Targeted update to avoid full re-render)
                const finalCell = document.getElementById(`final-${studentId}`);
                if (finalCell) {
                    const colorClass = computed.finalM2 >= 75 ? 'text-green-700' : 'text-red-600';
                    finalCell.innerHTML = `
                        <span class="text-lg ${colorClass}">${computed.finalLetter}</span>
                        <span class="text-xs text-gray-500 ml-1">(${computed.finalM2})</span>
                    `;
                    
                    // Add a subtle flash animation to indicate computation
                    finalCell.classList.add('bg-green-100');
                    setTimeout(() => finalCell.classList.remove('bg-green-100'), 500);
                }
            }
        });
    });
}

// --- CORE CALCULATION ENGINE ---
function calculateGrades(gradesObj) {
    const calcAvg = (gradesArr, method) => {
        const validGrades = gradesArr.filter(g => GRADE_VALUES[g]);
        if (validGrades.length === 0) return 0;
        const sum = validGrades.reduce((acc, g) => acc + GRADE_VALUES[g][method], 0);
        return sum / validGrades.length;
    };

    const cwM1 = calcAvg(gradesObj.coursework, 'method1');
    const cwM2 = Math.round(calcAvg(gradesObj.coursework, 'method2'));
    
    const ptM1 = calcAvg(gradesObj.performance, 'method1');
    const ptM2 = Math.round(calcAvg(gradesObj.performance, 'method2'));
    
    const teM1 = calcAvg(gradesObj.exam, 'method1');
    const teM2 = Math.round(calcAvg(gradesObj.exam, 'method2'));

    // Final is only computed if there's data in all fields, otherwise it shows progressive total
    // Modify logic here if zero blanks should be treated as 0 or ignored. 
    // Currently treating blanks as ignored (not in average).
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

// --- FIREBASE SAVE OPERATION ---
async function saveGradesToFirebase() {
    const btn = document.getElementById('btn-save-grades');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';
    btn.disabled = true;
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    try {
        const batchPromises = studentsData.map(async (student) => {
            // Clean up arrays (remove trailing blanks if needed, or save as is to preserve layout)
            const cleanGrades = {
                coursework: [...student.grades.coursework],
                performance: [...student.grades.performance],
                exam: [...student.grades.exam]
            };

            // Requirement: Document Name Format -> $[CN]-$[LastName] $[FirstName]-$[Section]
            const cnFormat = String(student.CN || '0').padStart(2, '0');
            const docId = `${cnFormat}-${student.LastName} ${student.FirstName}-${currentSection}`;
            
            const docRef = doc(db, 'studentGrade', docId);
            
            // Payload
            const payload = {
                studentId: student.Idnumber,
                CN: student.CN,
                lastName: student.LastName,
                firstName: student.FirstName,
                section: currentSection,
                gradeTerm: currentTerm,
                coursework: cleanGrades.coursework,
                performance: cleanGrades.performance,
                exam: cleanGrades.exam,
                lastUpdated: new Date().toISOString(),
                updatedBy: currentUser.Idnumber // Tracking who saved it
            };

            return setDoc(docRef, payload, { merge: true }); // Merge preserves other terms if they exist on the same doc layout in future
        });

        await Promise.all(batchPromises);

        // Success State
        btn.innerHTML = '<i class="fas fa-check mr-2"></i> Saved Successfully';
        btn.classList.replace('bg-green-600', 'bg-blue-600');
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
            btn.classList.replace('bg-blue-600', 'bg-green-600');
        }, 3000);

    } catch (error) {
        console.error("Error saving grades:", error);
        alert("Failed to save grades. Check console for details.");
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
}

// ==========================================
//              STUDENT VIEW
// ==========================================

function renderStudentLayout(container) {
    let html = `
        <div class="flex flex-col h-full bg-gray-50 fade-in p-4 md:p-8 overflow-y-auto">
            <div class="max-w-3xl mx-auto w-full flex flex-col gap-6">
                
                <div class="bg-blue-800 text-white p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden">
                    <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 class="text-3xl font-black tracking-tight">${currentUser.LastName}, ${currentUser.FirstName}</h2>
                            <p class="text-blue-200 mt-1 font-medium"><i class="fas fa-id-badge mr-2"></i>ID: ${currentUser.Idnumber} | Sec: ${currentUser.Section}</p>
                        </div>
                        <select id="student-term-selector" class="bg-blue-900 border border-blue-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none text-sm font-bold shadow-inner">
                            <option value="Term 1" selected>Term 1</option>
                            <option value="Term 2">Term 2</option>
                        </select>
                    </div>
                    <div class="absolute -right-10 -bottom-10 opacity-10 text-9xl">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                </div>

                <div id="student-grades-content" class="flex flex-col gap-6">
                    <div class="p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                        <p>Fetching your official grades...</p>
                    </div>
                </div>

            </div>
        </div>
    `;
    container.innerHTML = html;

    document.getElementById('student-term-selector').addEventListener('change', async (e) => {
        currentTerm = e.target.value;
        await loadStudentPersonalGrades();
    });
}

async function loadStudentPersonalGrades() {
    const container = document.getElementById('student-grades-content');
    
    try {
        // Construct the expected Document ID based on the format rule
        const cnFormat = String(currentUser.CN || '0').padStart(2, '0');
        const docId = `${cnFormat}-${currentUser.LastName} ${currentUser.FirstName}-${currentUser.Section}`;
        
        const docRef = doc(db, 'studentGrade', docId);
        // We use getDocs with a query instead of direct doc fetch just in case the CN format has slight variations,
        // but since we strictly build it, a query by Idnumber and gradeTerm is safer.
        const q = query(collection(db, 'studentGrade'), 
                        where('studentId', '==', currentUser.Idnumber),
                        where('gradeTerm', '==', currentTerm));
                        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            container.innerHTML = `
                <div class="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-folder-open text-2xl text-gray-400"></i>
                    </div>
                    <h3 class="text-lg font-bold text-gray-700">No Grades Yet</h3>
                    <p class="text-sm mt-1">Your teacher hasn't published grades for ${currentTerm} yet.</p>
                </div>
            `;
            return;
        }

        // Extract data (assuming only 1 document matches Term + Student ID)
        let gradeData = null;
        querySnapshot.forEach(doc => gradeData = doc.data());

        const computed = calculateGrades({
            coursework: gradeData.coursework || [],
            performance: gradeData.performance || [],
            exam: gradeData.exam || []
        });

        // Render Stacked Layout
        container.innerHTML = `
            ${generateStudentCategoryCard('Courseworks', gradeData.coursework || [], computed.cwM1, 'fa-book')}
            ${generateStudentCategoryCard('Performance Tasks', gradeData.performance || [], computed.ptM1, 'fa-tasks')}
            ${generateStudentCategoryCard('Term Examinations', gradeData.exam || [], computed.teM1, 'fa-file-signature')}

            <div class="bg-white border-l-8 border-l-green-500 rounded-xl shadow-md p-6 mt-2 flex flex-col md:flex-row items-center justify-between gap-6 transform transition-transform hover:scale-[1.01]">
                <div>
                    <h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight">Final ${currentTerm} Grade</h3>
                    <p class="text-sm text-gray-500 mt-1"><i class="fas fa-info-circle mr-1 text-blue-400"></i> Weighted using Transmutation Method 2</p>
                </div>
                
                <div class="flex items-center gap-6 bg-green-50 px-6 py-4 rounded-xl border border-green-100">
                    <div class="flex flex-col items-center">
                        <span class="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Score</span>
                        <span class="text-2xl font-bold text-gray-800">${computed.finalM2}</span>
                    </div>
                    <div class="w-px h-10 bg-green-200"></div>
                    <div class="flex flex-col items-center">
                        <span class="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Equivalent</span>
                        <span class="text-4xl font-black text-green-600 leading-none drop-shadow-sm">${computed.finalLetter}</span>
                    </div>
                </div>
            </div>
            
            <div class="text-center text-xs text-gray-400 mt-4">
                Last updated: ${new Date(gradeData.lastUpdated).toLocaleString()}
            </div>
        `;

    } catch (error) {
        console.error("Error fetching student grades:", error);
        container.innerHTML = `<div class="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-200">Failed to load grades. Check your connection.</div>`;
    }
}

function generateStudentCategoryCard(title, grades, m1Average, icon) {
    if (grades.length === 0) {
        return `
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden opacity-75">
            <div class="px-5 py-4 flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400"><i class="fas ${icon}"></i></div>
                <h3 class="font-bold text-slate-700 text-lg">${title}</h3>
            </div>
            <div class="px-5 pb-4 text-sm text-gray-400 italic">No competencies recorded for this category.</div>
        </div>`;
    }

    const gradeRows = grades.map((g, i) => {
        if (!g) return ''; // Skip empty slots
        const bg = g === 'A' ? 'bg-green-100 text-green-800 border-green-200' : 
                   g === 'P' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                   g === 'D' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                   g === 'IR' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100 text-gray-500 border-gray-200';
                   
        return `
            <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 pl-11 pr-5 hover:bg-slate-50 transition-colors">
                <span class="text-sm font-medium text-slate-600">Competency C${i + 1}</span>
                <span class="px-3 py-1 rounded border shadow-sm text-xs font-black w-12 text-center ${bg}">${g}</span>
            </div>
        `;
    }).join('');

    const letterAvg = getMethod1LetterGrade(m1Average);
    const avgColor = letterAvg === 'A' ? 'text-green-600' : letterAvg === 'P' ? 'text-blue-600' : letterAvg === 'D' ? 'text-yellow-600' : 'text-red-600';

    return `
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="bg-slate-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded bg-white border border-gray-200 shadow-sm flex items-center justify-center text-blue-600"><i class="fas ${icon}"></i></div>
                    <h3 class="font-bold text-slate-800 text-lg">${title}</h3>
                </div>
            </div>
            
            <div class="flex flex-col py-2">
                ${gradeRows}
            </div>
            
            <div class="bg-slate-800 px-5 py-3 flex justify-between items-center text-white">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-300">Category Average (Method 1)</span>
                <div class="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 shadow-inner">
                    <span class="text-xs text-slate-400 font-mono">NUM: ${m1Average.toFixed(2)}</span>
                    <div class="w-px h-4 bg-slate-600"></div>
                    <span class="text-sm font-black ${avgColor}">${letterAvg}</span>
                </div>
            </div>
        </div>
    `;
}
