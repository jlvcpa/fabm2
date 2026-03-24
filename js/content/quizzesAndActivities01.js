import { getFirestore, collection, getDocs, doc, getDoc, setDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getLetterGrade } from "../utils.js"; 
import { AntiCheatSystem } from '../antiCheat.js';

import { MultipleChoiceHandler } from "./activityHandlers/multipleChoiceHandler.js";
import { ProblemSolvingHandler } from "./activityHandlers/problemSolvingHandler.js";
import { JournalizingHandler } from "./activityHandlers/journalizingHandler.js";
import { IntegratedSceHandler } from "./activityHandlers/integratedSceHandler.js";

import { qbMerchMultipleChoice } from "./questionBank/qbMerchMultipleChoice.js";
import { qbMerchProblemSolving } from "./questionBank/qbMerchProblemSolving.js";
import { qbMerchJournalizing } from "./questionBank/qbMerchJournalizing.js";

import { renderStudentResultDetail } from "./activityResultPreview.js";

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

let sectionIntervals = []; 
let currentAntiCheat = null;
let selectedSectionFilter = "All Sections"; 

const Handlers = {
    "Multiple Choice": MultipleChoiceHandler,
    "Problem Solving": ProblemSolvingHandler,
    "Journalizing": JournalizingHandler,
    "Journalizing and Preparing SCE (Corp)": IntegratedSceHandler
};

// --- GLOBAL HANDLERS (MDAS & Indenting) ---
window.evaluateMDAS = function(input) {
    if (!input.value) return;
    try {
        let expr = input.value.replace(/,/g, '').trim();
        if (/^[-]?[\d+\-*/(). ]+$/.test(expr)) {
            let result = Function('"use strict";return (' + expr + ')')();
            if (result !== undefined && result !== null && !isNaN(result)) {
                input.value = Number.isInteger(result) ? result : Number(result).toFixed(2);
            }
        }
    } catch(e) {
        console.error("MDAS parsing failed for input", e);
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
};

window.handleJournalIndent = function(txId, row) {
    const acctInput = document.getElementById(`acct-${txId}-${row}`);
    const drInput = document.getElementById(`dr-${txId}-${row}`);
    const crInput = document.getElementById(`cr-${txId}-${row}`);

    if (!acctInput) return;

    const drVal = drInput ? drInput.value.trim() : '';
    const crVal = crInput ? crInput.value.trim() : '';

    if (crVal !== '') {
        acctInput.style.paddingLeft = '1.25rem'; 
        acctInput.classList.remove('italic', 'text-gray-500');
    } else if (drVal === '' && crVal === '') {
        acctInput.style.paddingLeft = '2rem'; 
        acctInput.classList.add('italic', 'text-gray-500'); 
    } else {
        acctInput.style.paddingLeft = '0.5rem'; 
        acctInput.classList.remove('italic', 'text-gray-500');
    }
};

const globalQuestionMap = new Map();
function buildQuestionMap() {
    if (globalQuestionMap.size > 0) return;
    const allSources = [qbMerchMultipleChoice, qbMerchProblemSolving, qbMerchJournalizing];
    allSources.forEach(sourceArray => {
        if(Array.isArray(sourceArray)) {
            sourceArray.forEach(item => {
                const id = Object.keys(item)[0];
                globalQuestionMap.set(id, { id, ...item[id] });
            });
        }
    });
}
buildQuestionMap();

// --- MAIN ENTRY POINT ---
export async function renderQuizzesAndActivities(containerElement, user, customRunner = null, filterType = null) {
    const contentArea = containerElement;
    
    contentArea.innerHTML = `
        <div class="flex h-full relative overflow-hidden bg-gray-50">
            <div id="qa-sidebar" class="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full z-10 transition-all duration-300 ease-in-out absolute md:relative transform -translate-x-full md:translate-x-0">
                <div class="p-1 border-b border-gray-200 bg-blue-900 text-white">
                    <div class="flex justify-between items-center mb-3">
                        <h2 class="font-bold text-sm pl-2">Activities</h2>
                        <div class="flex items-center gap-2">
                            <button id="qa-close-sidebar" class="md:hidden text-white"><i class="fas fa-times"></i></button>
                            <button id="qa-desktop-collapse" class="hidden md:block text-white hover:text-blue-200 text-xs mr-2" title="Collapse Sidebar">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div id="teacher-filter-area" class="${user.role === 'teacher' ? '' : 'hidden'}">
                        <select id="section-filter-dropdown" class="w-full p-2 rounded bg-blue-800 text-white text-xs border border-blue-700 outline-none focus:ring-1 focus:ring-blue-400">
                            <option value="All Sections">Loading Sections...</option>
                        </select>
                    </div>
                </div>
                <div id="qa-list-container" class="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin">
                    <p class="text-center text-gray-400 mt-4 text-xs">Loading activities...</p>
                </div>
            </div>

            <div id="student-sidebar" class="w-64 bg-white border-r border-gray-200 hidden flex-col h-full shrink-0 z-0">
                <div class="p-4 bg-gray-50 border-b">
                    <h3 id="selected-activity-title" class="font-bold text-xs text-blue-900 truncate">Select Activity</h3>
                    <p class="text-[10px] text-gray-500 uppercase font-bold tracking-tight mt-1">Student Submissions</p>
                </div>
                <div id="student-list-items" class="flex-1 overflow-y-auto scrollbar-thin">
                    <div class="p-8 text-center text-gray-400 text-xs italic">Select an activity to see results.</div>
                </div>
            </div>

            <button id="qa-toggle-sidebar" class="md:hidden absolute top-4 left-4 z-20 bg-blue-900 text-white p-2 rounded shadow"><i class="fas fa-bars"></i></button>
            
            <button id="qa-desktop-expand" class="hidden absolute top-14 left-0 z-20 bg-blue-900 text-white p-2 rounded-r shadow-md hover:bg-blue-800 transition-transform text-xs" title="Expand Sidebar">
                <i class="fas fa-chevron-right"></i>
            </button>
            
            <div id="qa-runner-container" class="flex-1 overflow-y-auto relative bg-gray-100 flex">
                <div id="qa-placeholder" class="flex-1 flex flex-col items-center justify-center text-gray-400 p-4 md:p-8">
                    <i class="fas fa-clipboard-check text-4xl mb-4"></i>
                    <p>Select an activity to view details.</p>
                </div>
            </div>
        </div>
    `;

    const sidebar = document.getElementById('qa-sidebar');
    const toggleBtn = document.getElementById('qa-toggle-sidebar');
    const closeBtn = document.getElementById('qa-close-sidebar');
    const collapseBtn = document.getElementById('qa-desktop-collapse');
    const expandBtn = document.getElementById('qa-desktop-expand');

    if (toggleBtn) toggleBtn.addEventListener('click', () => sidebar.classList.remove('-translate-x-full'));
    if (closeBtn) closeBtn.addEventListener('click', () => sidebar.classList.add('-translate-x-full'));

    if (collapseBtn && expandBtn) {
        collapseBtn.addEventListener('click', () => {
            sidebar.classList.remove('md:w-80');
            sidebar.classList.add('md:w-0', 'w-0', 'overflow-hidden');
            expandBtn.classList.remove('hidden');
        });

        expandBtn.addEventListener('click', () => {
            sidebar.classList.add('md:w-80');
            sidebar.classList.remove('md:w-0', 'w-0', 'overflow-hidden');
            expandBtn.classList.add('hidden');
        });
    }

    if (user.role === 'teacher') {
        setupTeacherFilters(user, customRunner, filterType);
    } else {
        await loadStudentActivities(user, customRunner, filterType);
    }
}

async function setupTeacherFilters(user, customRunner, filterType) {
    const dropdown = document.getElementById('section-filter-dropdown');
    try {
        const q = query(collection(db, "results_list"));
        const snapshot = await getDocs(q);
        const sections = new Set();
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            if (data.section) sections.add(data.section);
        });

        const sortedSections = Array.from(sections).sort();
        dropdown.innerHTML = sortedSections.map(s => `<option value="${s}">${s}</option>`).join('') + 
                           `<option value="All Sections" selected>All Sections</option>`;

        dropdown.onchange = (e) => {
            selectedSectionFilter = e.target.value;
            document.getElementById('student-sidebar').classList.add('hidden');
            document.getElementById('student-sidebar').classList.remove('flex');
            loadStudentActivities(user, customRunner, filterType);
        };

        await loadStudentActivities(user, customRunner, filterType);
    } catch (e) {
        console.error("Error loading filters:", e);
    }
}

async function loadStudentActivities(user, customRunner, filterType) {
    const listContainer = document.getElementById('qa-list-container');
    if (!listContainer) return;

    try {
        const q = query(collection(db, "quiz_list"), orderBy("dateTimeCreated", "desc"));
        const snapshot = await getDocs(q);

        listContainer.innerHTML = '';
        const now = new Date();
        let hasItems = false;

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            data.id = docSnap.id; 
            
            if (user.role === 'student' && data.section !== user.Section) return;
            if (user.role === 'teacher' && selectedSectionFilter !== "All Sections" && data.section !== selectedSectionFilter) return;
            
            const isPerformanceTask = (data.tasks && Array.isArray(data.tasks)) || 
                                      data.type === 'accounting_cycle' || 
                                      (data.activityname && data.activityname.includes('Task'));

            const activityName = (data.activityname || "").toLowerCase();
            let matchesFilter = false;

            if (filterType === 'Formative') {
                if (activityName.includes('formative')) matchesFilter = true;
            } 
            else if (filterType === 'Coursework') {
                if (activityName.includes('coursework')) matchesFilter = true;
            }
            else if (filterType === 'Summative') {
                if (activityName.includes('summative')) matchesFilter = true;
            } 
            else if (filterType === 'Performance') {
                if (activityName.includes('performance')) matchesFilter = true;
            } 
            else if (filterType === 'Exam') {
                if (activityName.includes('midterm exam') || activityName.includes('final exam')) {
                    matchesFilter = true;
                }
            }
            else if (filterType === 'Task' || filterType === 'accounting_cycle') {
                if (data.type === 'accounting_cycle' || activityName.includes('task')) matchesFilter = true;
            }
            else if (filterType === 'Test') {
                if (!activityName.includes('task')) matchesFilter = true;
            }

            if (filterType && !matchesFilter) return;

            hasItems = true;
            const expire = data.dateTimeExpire ? new Date(data.dateTimeExpire) : new Date();
            const isExpired = now > expire;
            
            const card = document.createElement('div');
            
            if (user.role === 'teacher') {
                 card.className = "p-3 rounded border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-sm transition bg-white mb-2";
                 card.innerHTML = `
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold text-gray-800 text-xs leading-tight">${data.activityname}</h3>
                        <span class="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold">${data.section}</span>
                    </div>
                    <p class="text-[9px] text-gray-400 mt-1">${isPerformanceTask ? 'Performance Task' : 'Standard Quiz'}</p>
                `;
            } else {
                let statusBadge = '';
                if(isExpired) statusBadge = '<span class="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">Expired</span>';
                else if(now < new Date(data.dateTimeStart)) statusBadge = '<span class="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded font-bold">Upcoming</span>';
                else statusBadge = '<span class="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded font-bold">Active</span>';

                card.className = `p-3 rounded border cursor-pointer hover:shadow-md transition bg-white ${isExpired ? 'border-red-200 bg-red-50 opacity-75' : 'border-blue-200'} mb-2`;
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-1">
                        <h3 class="font-bold text-gray-800 text-sm">${data.activityname}</h3>
                        ${statusBadge}
                    </div>
                    <div class="text-xs text-gray-500">
                        <p><i class="far fa-clock mr-1"></i> Due: ${expire.toLocaleString()}</p>
                    </div>
                `;
            }

            card.onclick = () => {
                sectionIntervals.forEach(int => clearInterval(int));
                if(currentAntiCheat) currentAntiCheat.stopMonitoring();
                
                if (user.role === 'teacher') {
                    showStudentSubmissions(data, user);
                } else {
                    renderQuizRunner(data, user, customRunner);
                    document.getElementById('qa-sidebar').classList.add('-translate-x-full');
                }
            };
            listContainer.appendChild(card);
        });
        
        if (!hasItems) listContainer.innerHTML = '<p class="text-center text-gray-400 mt-4 text-xs">No matching activities.</p>';

    } catch (e) {
        console.error("Error loading activities:", e);
        if (listContainer) listContainer.innerHTML = '<p class="text-center text-red-400 mt-4 text-sm">Error loading data.</p>';
    }
}

async function showStudentSubmissions(activityDoc, teacherUser) {
    const studentSidebar = document.getElementById('student-sidebar');
    const listItems = document.getElementById('student-list-items');
    const titleEl = document.getElementById('selected-activity-title');

    studentSidebar.classList.remove('hidden');
    studentSidebar.classList.add('flex');
    titleEl.textContent = activityDoc.activityname;
    listItems.innerHTML = '<div class="p-10 text-center"><i class="fas fa-spinner fa-spin text-blue-900"></i><p class="text-xs text-gray-500 mt-2">Loading Class Roster...</p></div>';

    const collectionName = `results_${activityDoc.activityname}_${activityDoc.section}`;
    
    try {
        const resultsSnap = await getDocs(collection(db, collectionName));
        const resultsMap = new Map();
        
        resultsSnap.forEach(docSnap => {
            const rData = docSnap.data();
            const sId = rData.studentId || docSnap.id.split('-')[1]; 
            resultsMap.set(sId, { id: docSnap.id, ...rData });
        });

        const studentsQuery = query(collection(db, 'students'), where('Section', '==', activityDoc.section));
        const studentsSnap = await getDocs(studentsQuery);

        listItems.innerHTML = '';
        
        if (studentsSnap.empty) {
            listItems.innerHTML = '<div class="p-8 text-center text-gray-400 text-xs italic">No students found in this section.</div>';
            return;
        }

        const roster = [];

        studentsSnap.forEach(docSnap => {
            const sData = docSnap.data();
            const resultData = resultsMap.get(sData.Idnumber); 

            roster.push({
                ...sData, 
                hasResult: !!resultData,
                resultData: resultData || null,
                timestamp: resultData ? resultData.timestamp : null 
            });
        });

        roster.sort((a, b) => (Number(a.CN) || 999) - (Number(b.CN) || 999));

        roster.forEach(student => {
            const btn = document.createElement('button');
            
            const bgClass = student.hasResult 
                ? "bg-white hover:bg-blue-50 border-gray-100" 
                : "bg-red-100 hover:bg-red-200 border-red-200";

            const statusText = student.hasResult 
                ? `<div class="text-[9px] text-gray-400">${new Date(student.timestamp).toLocaleDateString()}</div>`
                : `<div class="text-[9px] text-red-500 font-bold italic">No Submission</div>`;

            btn.className = `w-full text-left p-3 border-b transition-colors flex items-center gap-3 group ${bgClass}`;
            
            btn.innerHTML = `
                <div class="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 group-hover:text-blue-700">${student.CN}</div>
                <div class="truncate flex-1">
                    <div class="text-xs font-bold text-gray-800">${student.LastName}, ${student.FirstName}</div>
                    ${statusText}
                </div>
                <i class="fas fa-chevron-right text-[10px] text-gray-400 opacity-50"></i>
            `;
            
            btn.onclick = () => {
                const previewArea = document.getElementById('qa-runner-container');
                if (previewArea._reactRoot) {
                      previewArea._reactRoot.unmount();
                      delete previewArea._reactRoot;
                }
                
                if (student.hasResult) {
                    previewArea.innerHTML = '<div class="p-20 text-center"><i class="fas fa-spinner fa-spin text-4xl text-blue-900"></i><p class="mt-4 text-sm text-gray-500">Loading Student Result...</p></div>';
                    renderStudentResultDetail(previewArea, teacherUser, activityDoc, student.resultData, collectionName, student.resultData.id);
                } else {
                    previewArea.innerHTML = `
                        <div class="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50">
                            <div class="bg-white p-10 rounded-2xl border border-gray-200 shadow-sm max-w-md">
                                <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <i class="fas fa-user-clock text-red-400 text-4xl"></i>
                                </div>
                                <h2 class="text-2xl font-bold text-gray-800 mb-2">${student.LastName}, ${student.FirstName}</h2>
                                <p class="text-gray-500 mb-6">This student has not started or submitted this activity yet.</p>
                                <div class="p-4 bg-gray-100 text-gray-600 rounded-lg text-xs font-mono">
                                    Status: No Record Found<br>
                                    ID: ${student.Idnumber}
                                </div>
                            </div>
                        </div>
                    `;
                }
            };
            listItems.appendChild(btn);
        });

    } catch (e) {
        console.error(e);
        listItems.innerHTML = `<div class="p-4 text-red-500 text-xs">Error loading roster: ${e.message}</div>`;
    }
}

async function renderQuizRunner(data, user, customRunner = null) {
    const container = document.getElementById('qa-runner-container');
    
    const isAccountingCycle = (data.tasks && Array.isArray(data.tasks) && data.tasks.length > 0) || 
                              data.type === 'accounting_cycle' || 
                              (data.activityname && data.activityname.includes('Task'));

    if (isAccountingCycle && customRunner && typeof customRunner === 'function') {
        if (!container._reactRoot) container.innerHTML = '';
        const goBack = () => {
             if (container._reactRoot) delete container._reactRoot; 
             document.getElementById('qa-toggle-sidebar').click(); 
             loadStudentActivities(user, customRunner);
        };
        customRunner(container, data, user, goBack);
        return; 
    }
    
    if (user.role !== 'teacher' && data.students && !data.students.includes(user.Idnumber)) {
        container.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-red-600 bg-white p-8 text-center">
                <i class="fas fa-user-slash text-6xl mb-6"></i>
                <h2 class="text-3xl font-bold">Access Denied</h2>
                <p class="text-gray-500 mt-2 text-lg">You are not included in the list of students for this activity.</p>
            </div>`;
        return;
    }

    const collectionName = `results_${data.activityname}_${data.section}`;
    const docId = `${user.CN}-${user.Idnumber}-${user.LastName} ${user.FirstName}`;
    let savedState = null;

    try {
        const resultDoc = await getDoc(doc(db, collectionName, docId));
        if (resultDoc.exists()) {
            const rData = resultDoc.data();
            if (rData.status === "final") {
                container.innerHTML = '';
                renderStudentResultDetail(container, user, data, rData, collectionName, docId);
                return;
            } else {
                savedState = rData;
            }
        }
    } catch (e) { console.error(e); }

    const now = new Date();
    const expireDate = data.dateTimeExpire ? new Date(data.dateTimeExpire) : new Date(data.testQuestions?.[0]?.dateTimeExpire);
    
    if (now > expireDate && user.role !== 'teacher') {
        container.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-center p-8 bg-white">
                <div class="bg-red-50 p-10 rounded-2xl border-2 border-red-100 shadow-sm max-w-md">
                    <i class="fas fa-clock text-red-400 text-6xl mb-6"></i>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Activity Expired</h2>
                    <p class="text-gray-500 mb-6">The deadline for this activity was <strong>${expireDate.toLocaleString()}</strong>.</p>
                    <div class="p-4 bg-red-100 text-red-800 rounded-lg font-medium text-sm">
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        The activity has expired and you failed to answer or complete it.
                    </div>
                    <button onclick="document.getElementById('qa-toggle-sidebar').click()" class="mt-8 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition shadow">
                        Return to List
                    </button>
                </div>
            </div>`;
        return;
    }

    container.innerHTML = '<div class="flex justify-center items-center h-full"><i class="fas fa-spinner fa-spin text-4xl text-blue-800"></i><span class="ml-3">Generating Activity...</span></div>';
    
    const generatedContent = await generateQuizContent(data, savedState);

    const antiCheatHtml = `
        <div id="black-curtain" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background-color:black; z-index:9999;"></div>
        <div id="cheat-lockout" class="hidden fixed inset-0 bg-gray-900 z-[100] flex items-center justify-center text-white p-6 text-center">
            <div class="max-w-md w-full">
                <h1 class="text-3xl font-bold mb-4 text-red-500">Activity Paused</h1>
                <p class="text-lg mb-6">Focus lost. Navigation away is monitored.</p>
                <button id="btn-unlock" onclick="window.handleUnlockClick()" class="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xl shadow-lg">Resume Activity</button>
            </div>
        </div>
    `;

    container.innerHTML = `
        ${antiCheatHtml}
        <div class="flex flex-col h-full bg-gray-100 w-full">
            <div class="bg-blue-800 text-white p-2 flex justify-between items-center shadow-md z-30 sticky top-0">
                 <h1 class="text-xl md:text-2xl font-bold truncate pl-2">${data.activityname}</h1>
            </div>
            <form id="quiz-form" class="flex-1 flex flex-col overflow-y-auto relative scrollbar-thin">
                ${generatedContent.html}
            </form>
        </div>
    `;

    initializeQuizManager(data, generatedContent.data, user, savedState);
}

async function generateQuizContent(activityData, savedState = null) {
    let tabsHtml = '';
    let sectionsHtml = '';
    let questionData = []; 

    if (!activityData.testQuestions || !Array.isArray(activityData.testQuestions)) {
        return { html: '<div class="p-8 text-center text-gray-500">No test sections defined.</div>', data: [] };
    }

    tabsHtml = `<div class="bg-white border-b border-gray-300 flex items-center px-2 overflow-x-auto whitespace-nowrap shrink-0 z-20 sticky top-0 shadow-sm">`;
    tabsHtml += `<div class="flex items-center">`;
    activityData.testQuestions.forEach((section, index) => {
        const isActive = index === 0 ? 'border-blue-800 text-blue-800 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600';
        tabsHtml += `
            <button type="button" class="tab-btn px-4 py-3 mr-2 font-semibold text-sm border-b-2 transition-colors focus:outline-none ${isActive}" data-target="test-section-${index}">
                Test ${index + 1}
            </button>
        `;
    });
    tabsHtml += `</div>`;

    tabsHtml += `<div class="flex-1 flex justify-center items-center px-2">`;
    activityData.testQuestions.forEach((section, index) => {
        const isHidden = index === 0 ? '' : 'hidden';
        const startTime = section.dateTimeStart ? new Date(section.dateTimeStart) : new Date(activityData.dateTimeStart);
        const expireTime = section.dateTimeExpire ? new Date(section.dateTimeExpire) : new Date(activityData.dateTimeExpire);

        tabsHtml += `
            <div id="section-timer-info-${index}" class="section-timer-info bg-yellow-50 border border-yellow-200 rounded px-4 py-1 flex flex-row items-center gap-6 shadow-sm ${isHidden}">
                <div class="flex flex-col text-xs text-yellow-900">
                    <span><strong>Start:</strong> ${startTime.toLocaleString()}</span>
                    <span><strong>Due:</strong> ${expireTime.toLocaleString()}</span>
                </div>
                <div class="font-bold text-red-600 text-lg flex items-center">
                    <i class="fas fa-hourglass-half mr-2"></i>
                    <span id="timer-display-${index}">--:--:--</span>
                </div>
            </div>
        `;
    });
    tabsHtml += `</div>`;

    tabsHtml += `
        <div class="ml-auto pl-4 py-2 flex gap-2">
            <button type="button" id="btn-save-progress" class="bg-blue-600 text-white text-sm font-bold px-4 py-1.5 rounded shadow hover:bg-blue-700 transition whitespace-nowrap">
                <i class="fas fa-save mr-1"></i> Save
            </button>
            <button type="button" id="btn-submit-quiz" disabled class="bg-gray-400 cursor-not-allowed text-white text-sm font-bold px-4 py-1.5 rounded shadow transition whitespace-nowrap">
                Submit
            </button>
        </div>
    </div>`;

    sectionsHtml = `<div class="w-full max-w-7xl mx-auto p-2 md:p-4">`; 

    for (const [index, section] of activityData.testQuestions.entries()) {
        const sTopics = section.topics ? section.topics.split(',').map(t => t.trim()).filter(t => t) : [];
        const sCompetencies = section.competencies ? section.competencies.split(',').map(t => t.trim()).filter(t => t) : [];
        const sSubtopics = section.subtopics ? section.subtopics.split(',').map(t => t.trim()).filter(t => t) : [];

        const isHidden = index === 0 ? '' : 'hidden'; 
        sectionsHtml += `<div id="test-section-${index}" class="test-section-panel w-full ${isHidden}" data-section-type="${section.type}">`;

        let questions = [];
        const count = parseInt(section.noOfQuestions) || 5;

        let localSource = [];
        if (section.type === "Multiple Choice") localSource = qbMerchMultipleChoice;
        else if (section.type === "Problem Solving") localSource = qbMerchProblemSolving;
        else if (section.type === "Journalizing" || section.type === "Journalizing and Preparing SCE (Corp)") localSource = qbMerchJournalizing;

        const flattenedCandidates = localSource.map(obj => {
            const id = Object.keys(obj)[0];
            return { id, ...obj[id] };
        });

        let candidates = flattenedCandidates.filter(q => {
            const subjectMatch = q.subject === "FABM1" || q.subject === "FABM2";
            const topicMatch = sTopics.length === 0 || sTopics.includes(q.topic);
            const compMatch = sCompetencies.length === 0 || sCompetencies.includes(q.competency);
            const subMatch = sSubtopics.length === 0 || sSubtopics.includes(q.subtopic);
            return subjectMatch && topicMatch && compMatch && subMatch;
        });

        candidates.sort(() => 0.5 - Math.random());
        
        for(let i=0; i < count; i++) {
            const uiId = `s${index}_q${i}`;
            let selectedQ = null;

            if (savedState && savedState.questionsTaken && savedState.questionsTaken[uiId]) {
                const savedRef = savedState.questionsTaken[uiId];
                if (savedRef.dbId) {
                    const fullDataFound = flattenedCandidates.find(q => q.id === savedRef.dbId);
                    if (fullDataFound) selectedQ = { ...fullDataFound };
                }
                if (!selectedQ) {
                    if (savedRef.dbId && globalQuestionMap.has(savedRef.dbId)) {
                        selectedQ = { ...globalQuestionMap.get(savedRef.dbId) };
                    } else {
                        selectedQ = {
                            id: savedRef.id || savedRef.dbId || "legacy",
                            question: savedRef.questionText,
                            options: savedRef.options,
                            correctAnswer: savedRef.correctAnswer,
                            explanation: savedRef.explanation,
                            transactions: savedRef.transactions, 
                            instructions: savedRef.instructions,
                            topic: savedRef.topic
                        };
                    }
                }
                selectedQ.isSaved = true; 
            } 
            
            if (!selectedQ) {
                if (candidates.length > 0) {
                    selectedQ = candidates.pop(); 
                    selectedQ.isSaved = false;
                }
            }
            if (selectedQ) questions.push(selectedQ);
        }

        const displayInstructions = (questions.length > 0 && questions[0].instructions) 
            ? questions[0].instructions : section.instructions;

        const stickyHeaderHtml = `
            <div class="sticky top-14 bg-blue-50 border-b border-blue-200 px-4 py-2 z-10 shadow-sm mb-4">
                <div class="flex flex-col gap-.5 text-xs text-gray-700">
                    <h3 class="text-lg font-semibold border-b pb-1 text-blue-900">
                        <span class="font-bold text-blue-800">Type:</span> ${section.type}
                    </h3>
                    <div class="border-b pb-1"><span class="font-bold text-blue-800">Topic:</span> ${section.topics}</div>
                    <div class="border-b pb-1"><span class="font-bold text-blue-800">Instruction:</span> ${displayInstructions}</div>
                    <div class="border-b pb-1"><span class="font-bold text-blue-800">Rubric:</span> ${section.gradingRubrics || 'N/A'}</div>
                </div>
            </div>
        `;
        
        sectionsHtml += stickyHeaderHtml;
        
        let questionsHtml = '';
        let trackerHtml = '';
        const handler = Handlers[section.type];

        questions.forEach((q, qIdx) => {
            const uiId = `s${index}_q${qIdx}`;
            const disabledAttr = q.isSaved ? 'disabled' : '';
            const dimClass = q.isSaved ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
            
            let savedValue = null;
            if (q.isSaved && savedState && savedState.answers) {
                savedValue = savedState.answers[uiId];
            }

            questionData.push({ 
                uiId: uiId, 
                dbId: q.id, 
                type: section.type,
                questionText: q.question || (q.title || 'Activity Question'),
                correctAnswer: q.correctAnswer,
                options: q.options || [],
                explanation: q.explanation || '',
                transactions: q.transactions || [],
                instructions: q.instructions || null,
                topic: q.topic || section.topics || ''
            });

            if (handler) {
                if (handler.hasTracker) {
                    trackerHtml += handler.renderTracker(q, qIdx, uiId);
                }
                questionsHtml += handler.renderQuestion(q, qIdx, uiId, savedValue, disabledAttr, dimClass, qIdx === 0 ? '' : 'hidden');
            }
        });

        if (handler && handler.hasTracker) {
            sectionsHtml += `
                <div class="flex flex-col md:flex-row md:items-start gap-4">
                    <div class="flex-1 min-w-0">${questionsHtml}</div>
                    <div class="w-full md:w-64 shrink-0">
                        <div class="bg-white rounded shadow-sm border border-gray-200 p-3 sticky top-20">
                            <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pb-1 border-b border-gray-100">
                                Question Tracker
                            </div>
                            <div class="flex flex-wrap content-start">
                                ${trackerHtml}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            sectionsHtml += `<div class="w-full">${questionsHtml}</div>`;
        }
        sectionsHtml += `</div>`; 
    }
    sectionsHtml += `</div>`; 

    return { html: tabsHtml + sectionsHtml, data: questionData };
}

function initializeQuizManager(activityData, questionData, user, savedState) {
    const submitBtn = document.getElementById('btn-submit-quiz');
    const saveBtn = document.getElementById('btn-save-progress');
    const form = document.getElementById('quiz-form');

    const highStakesKeywords = ['Summative', 'Prelim', 'Midterm', 'Semi-final', 'Final', 'Performance', 'Coursework'];
    const isHighStakes = highStakesKeywords.some(keyword => activityData.activityname.includes(keyword));
    
    if (currentAntiCheat) {
        currentAntiCheat.stopMonitoring();
        currentAntiCheat = null;
    }

    if (isHighStakes) {
        currentAntiCheat = new AntiCheatSystem({
            onCheatDetected: () => {
                sectionIntervals.forEach(i => clearInterval(i));
                alert("Anti-Cheat Violation Detected! The activity will now reload.");
                renderQuizRunner(activityData, user);
            }
        });
        window.handleUnlockClick = () => currentAntiCheat.handleUnlockClick();
        currentAntiCheat.startMonitoring();
    }

    let hasSubmittedOnExpire = false;

    activityData.testQuestions.forEach((section, index) => {
        const timerDisplay = document.getElementById(`timer-display-${index}`);
        const exp = section.dateTimeExpire ? new Date(section.dateTimeExpire).getTime() : new Date(activityData.dateTimeExpire).getTime();

        const updateSectionTimer = () => {
            const now = new Date().getTime();
            const dist = exp - now;

            if (dist < 0) {
                if(timerDisplay) {
                    timerDisplay.innerHTML = "EXPIRED";
                    timerDisplay.parentElement.classList.add('text-red-800');
                }
                
                if (!hasSubmittedOnExpire) {
                    hasSubmittedOnExpire = true;
                    sectionIntervals.forEach(i => clearInterval(i));
                    alert("Time is up! Your progress is being auto-saved and the activity will be locked.");
                    saveProgress(activityData, questionData, user, true);
                }
            } else {
                const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((dist % (1000 * 60)) / 1000);
                if(timerDisplay) timerDisplay.innerHTML = `${h > 0 ? h + ':' : ''}${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
            }
        };
        updateSectionTimer();
        const interval = setInterval(updateSectionTimer, 1000);
        sectionIntervals.push(interval);
    });

    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.test-section-panel');
    const timerInfos = document.querySelectorAll('.section-timer-info');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('border-blue-800', 'text-blue-800', 'bg-blue-50');
                t.classList.add('border-transparent', 'text-gray-600');
            });
            tab.classList.remove('border-transparent', 'text-gray-600');
            tab.classList.add('border-blue-800', 'text-blue-800', 'bg-blue-50');

            const targetId = tab.dataset.target;
            const index = targetId.split('-')[2];

            sections.forEach(sec => sec.classList.add('hidden'));
            document.getElementById(targetId).classList.remove('hidden');

            timerInfos.forEach(info => info.classList.add('hidden'));
            const targetTimer = document.getElementById(`section-timer-info-${index}`);
            if(targetTimer) targetTimer.classList.remove('hidden');
        });
    });

    sections.forEach(section => {
        const type = section.dataset.sectionType;
        const handler = Handlers[type];
        if (handler && handler.initInteractivity) {
            handler.initInteractivity(section);
        }
    });

    form.addEventListener('input', checkCompletion);
    
    function checkCompletion() {
        let allAnswered = true;
        for (const q of questionData) {
            const handler = Handlers[q.type];
            if (handler) {
                if (!handler.checkCompletion(q.uiId, form)) {
                    allAnswered = false;
                }
            }
        }

        if (allAnswered) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
            submitBtn.classList.add('bg-green-600', 'hover:bg-green-700', 'cursor-pointer');
            submitBtn.innerHTML = "Submit Activity";
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
            submitBtn.classList.remove('bg-green-600', 'hover:bg-green-700', 'cursor-pointer');
            submitBtn.innerHTML = "Finish All Questions";
        }
    }

    checkCompletion();
    submitBtn.addEventListener('click', () => submitQuiz(activityData, questionData, user, true)); 
    saveBtn.addEventListener('click', () => saveProgress(activityData, questionData, user));
}

async function saveProgress(activityData, questionData, user, forceSave = false) {
    if (currentAntiCheat && !forceSave) currentAntiCheat.stopMonitoring();
    if(!forceSave && !confirm("Save progress? Saved answers cannot be edited later.")) {
        if (currentAntiCheat) currentAntiCheat.startMonitoring();
        return;
    }

    const form = document.getElementById('quiz-form');
    const formData = new FormData(form);
    const answers = {};
    const questionsTaken = {}; 

    questionData.forEach(q => {
        const handler = Handlers[q.type];
        if (handler) {
            const ext = handler.extractData(q.uiId, formData, form);
            if (ext.hasValue) {
                answers[q.uiId] = ext.value;
                questionsTaken[q.uiId] = {
                    dbId: q.dbId,
                    questionText: q.questionText,
                    type: q.type
                };
            }
        }
    });

    const collectionName = `results_${activityData.activityname}_${activityData.section}`;
    const docName = `${user.CN}-${user.Idnumber}-${user.LastName} ${user.FirstName}`;

    const payload = {
        status: "in_progress",
        activityId: activityData.id,
        activityName: activityData.activityname,
        studentName: `${user.LastName}, ${user.FirstName}`,
        studentId: user.Idnumber,
        CN: user.CN,
        section: activityData.section,
        timestamp: new Date().toISOString(),
        answers: JSON.parse(JSON.stringify(answers)),
        questionsTaken: JSON.parse(JSON.stringify(questionsTaken)),
        sectionScores: {}
    };

    try {
        await setDoc(doc(db, collectionName, docName), payload);
        const listId = `${activityData.activityname}_${activityData.section}`;
        await setDoc(doc(db, "results_list", listId), { 
            created: new Date().toISOString(),
            activityName: activityData.activityname,
            section: activityData.section
        }, { merge: true });

        if (!forceSave) {
            alert("Progress saved! Page will reload to lock saved answers.");
        }
        renderQuizRunner(activityData, user);
    } catch (e) {
        console.error("Save Error:", e);
        alert("Error saving: " + e.message);
    }
}

async function submitQuiz(activityData, questionData, user, isFinal = false, forceSubmit = false) {
    if(!forceSubmit && !confirm("Are you sure you want to submit? This is final.")) return;
    
    if(currentAntiCheat) {
        currentAntiCheat.stopMonitoring();
        currentAntiCheat = null;
    }

    sectionIntervals.forEach(i => clearInterval(i));

    const form = document.getElementById('quiz-form');
    const formData = new FormData(form);
    const answers = {};
    const questionsTaken = {};

    questionData.forEach(q => {
        questionsTaken[q.uiId] = { dbId: q.dbId, questionText: q.questionText, type: q.type };
        const handler = Handlers[q.type];
        if (handler) {
            const ext = handler.extractData(q.uiId, formData, form);
            answers[q.uiId] = ext.value;
        }
    });

    const sectionScores = {};
    activityData.testQuestions.forEach((section, index) => {
        sectionScores[index] = { score: 0, maxScore: 0, percentage: 0, letterGrade: 'N/A' };
    });

    questionData.forEach(q => {
        const handler = Handlers[q.type];
        if (handler && handler.grade) {
            const index = parseInt(q.uiId.split('_')[0].substring(1));
            const val = answers[q.uiId];
            const liveQ = (q.dbId && globalQuestionMap.has(q.dbId)) ? globalQuestionMap.get(q.dbId) : q;
            
            const result = handler.grade(q, val, liveQ);
            
            sectionScores[index].score += result.score;
            sectionScores[index].maxScore += result.maxScore;
            
            answers[q.uiId] = {
                ...val,
                computedScores: result.details
            };
        }
    });

    Object.keys(sectionScores).forEach(index => {
        if (sectionScores[index].maxScore > 0) {
            sectionScores[index].percentage = (sectionScores[index].score / sectionScores[index].maxScore) * 100;
            sectionScores[index].letterGrade = getLetterGrade(sectionScores[index].percentage);
        }
    });

    const collectionName = `results_${activityData.activityname}_${activityData.section}`;
    const docName = `${user.CN}-${user.Idnumber}-${user.LastName} ${user.FirstName}`;
    
    const submissionPayload = {
        status: "final",
        activityId: activityData.id,
        activityName: activityData.activityname,
        studentName: `${user.LastName}, ${user.FirstName}`,
        studentId: user.Idnumber,
        CN: user.CN,
        section: activityData.section,
        timestamp: new Date().toISOString(),
        answers: JSON.parse(JSON.stringify(answers, (k, v) => v === undefined ? null : v)),
        questionsTaken: JSON.parse(JSON.stringify(questionsTaken, (k, v) => v === undefined ? null : v)),
        sectionScores: sectionScores 
    };

    try {
        await setDoc(doc(db, collectionName, docName), submissionPayload);
        const listId = `${activityData.activityname}_${activityData.section}`;
        await setDoc(doc(db, "results_list", listId), { 
            created: new Date().toISOString(),
            activityName: activityData.activityname,
            section: activityData.section
        });

        document.getElementById('qa-runner-container').innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-green-600 bg-white">
                <i class="fas fa-check-circle text-6xl mb-6"></i>
                <h2 class="text-3xl font-bold">Submitted Successfully</h2>
                <p class="text-gray-500 mt-2 text-lg">Your response has been saved.</p>
                <div class="mt-8 flex gap-4">
                    <button onclick="document.getElementById('qa-toggle-sidebar').click()" class="px-6 py-3 bg-gray-600 text-white rounded shadow hover:bg-gray-700">Back to List</button>
                    <button onclick="window.location.reload()" class="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700">View Results</button>
                </div>
            </div>
        `;
    } catch (e) {
        console.error("Submission Error:", e);
        alert("Error saving to server: " + e.message);
    }
}
