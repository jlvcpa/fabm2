import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, query, where, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getLetterGrade } from "../utils.js"; 
import { AntiCheatSystem } from '../antiCheat.js';

// --- QUESTION BANK IMPORTS ---
import { qbMerchMultipleChoice } from "./questionBank/qbMerchMultipleChoice.js";
import { qbMerchProblemSolving } from "./questionBank/qbMerchProblemSolving.js";
import { qbMerchJournalizing } from "./questionBank/qbMerchJournalizing.js";

// --- IMPORT THE NEW PREVIEW MODULE ---
// Ensure this matches the exported function name in activityResultPreview.js
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
let selectedSectionFilter = "All Sections"; // Default filter

// --- GLOBAL QUESTION MAP (Source of Truth) ---
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
    
    // UI Layout with Sidebar, Student List (Teacher Only), and Content Area
    contentArea.innerHTML = `
        <div class="flex h-full relative overflow-hidden bg-gray-50">
            <div id="qa-sidebar" class="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full z-10 transition-transform absolute md:relative transform -translate-x-full md:translate-x-0">
                <div class="p-1 border-b border-gray-200 bg-blue-900 text-white">
                    <div class="flex justify-between items-center mb-3">
                        <h2 class="font-bold text-sm">Activities</h2>
                        <button id="qa-close-sidebar" class="md:hidden text-white"><i class="fas fa-times"></i></button>
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

    if (toggleBtn) toggleBtn.addEventListener('click', () => sidebar.classList.remove('-translate-x-full'));
    if (closeBtn) closeBtn.addEventListener('click', () => sidebar.classList.add('-translate-x-full'));

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
        // Construct Dropdown: Sections first, "All Sections" last as requested
        dropdown.innerHTML = sortedSections.map(s => `<option value="${s}">${s}</option>`).join('') + 
                           `<option value="All Sections" selected>All Sections</option>`;

        dropdown.onchange = (e) => {
            selectedSectionFilter = e.target.value;
            // Hide student list if we change the section filter to avoid confusion
            document.getElementById('student-sidebar').classList.add('hidden');
            document.getElementById('student-sidebar').classList.remove('flex');
            loadStudentActivities(user, customRunner, filterType);
        };

        // Initial Load
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
            
            // Student Filter
            if (user.role === 'student' && data.section !== user.Section) return;
            
            // Teacher Filter
            if (user.role === 'teacher' && selectedSectionFilter !== "All Sections" && data.section !== selectedSectionFilter) return;
            
            const isPerformanceTask = (data.tasks && Array.isArray(data.tasks)) || 
                                      data.type === 'accounting_cycle' || 
                                      (data.activityname && data.activityname.includes('Task'));

            if (filterType === 'Task' || filterType === 'accounting_cycle') {
                if (!isPerformanceTask) return; 
            } else if (filterType === 'Test') { // Changed 'standard' to 'Test' to match generic usage
                if (isPerformanceTask) return;
            }

            hasItems = true;
            const expire = data.dateTimeExpire ? new Date(data.dateTimeExpire) : new Date();
            const isExpired = now > expire;
            
            // Teacher gets simple cards, Students get detailed status cards
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
                // Clear state
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

/**
 * TEACHER ONLY: Displays the list of students on the right when an activity is clicked
 */
async function showStudentSubmissions(activityDoc, teacherUser) {
    const studentSidebar = document.getElementById('student-sidebar');
    const listItems = document.getElementById('student-list-items');
    const titleEl = document.getElementById('selected-activity-title');

    studentSidebar.classList.remove('hidden');
    studentSidebar.classList.add('flex');
    titleEl.textContent = activityDoc.activityname;
    listItems.innerHTML = '<div class="p-10 text-center"><i class="fas fa-spinner fa-spin text-blue-900"></i></div>';

    const collectionName = `results_${activityDoc.activityname}_${activityDoc.section}`;
    
    try {
        const snap = await getDocs(collection(db, collectionName));
        listItems.innerHTML = '';
        
        if (snap.empty) {
            listItems.innerHTML = '<div class="p-8 text-center text-gray-400 text-xs italic">No submissions yet.</div>';
            return;
        }

        const students = [];
        snap.forEach(docSnap => {
            const data = docSnap.data();
            const docId = docSnap.id;

            // 1. Extract CN from the first part of ID
            const extractedCN = docId.split('-')[0] || data.CN || '#';

            // 2. Extract Name from the third part of ID
            // This grabs "LastName FirstName" from the end of the string
            const extractedName = docId.split('-')[2] || data.studentName || 'Unknown Student';
            
            students.push({ 
                id: docId, 
                ...data, 
                CN: extractedCN,
                studentName: extractedName // Overwrite with extracted name to fix 'undefined'
            });
        });
        
        // Sort by Class Number (CN)
        students.sort((a, b) => (Number(a.CN) || 999) - (Number(b.CN) || 999));

        students.forEach(res => {
            const btn = document.createElement('button');
            btn.className = "w-full text-left p-3 border-b border-gray-100 hover:bg-blue-50 transition-colors flex items-center gap-3 group";
            btn.innerHTML = `
                <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 group-hover:bg-blue-200 group-hover:text-blue-700">${res.CN}</div>
                <div class="truncate flex-1">
                    <div class="text-xs font-bold text-gray-800">${res.studentName}</div>
                    <div class="text-[9px] text-gray-400">${new Date(res.timestamp).toLocaleDateString()}</div>
                </div>
                <i class="fas fa-chevron-right text-[10px] text-gray-300"></i>
            `;
            
            btn.onclick = () => {
                const previewArea = document.getElementById('qa-runner-container');
                if (previewArea._reactRoot) {
                     previewArea._reactRoot.unmount();
                     delete previewArea._reactRoot;
                }
                previewArea.innerHTML = '<div class="p-20 text-center"><i class="fas fa-spinner fa-spin text-4xl text-blue-900"></i><p class="mt-4 text-sm text-gray-500">Loading Student Result...</p></div>';
                
                // Pass the data (now containing the corrected name) to the viewer
                renderStudentResultDetail(previewArea, teacherUser, activityDoc, res, collectionName, res.id);
            };
            listItems.appendChild(btn);
        });
    } catch (e) {
        listItems.innerHTML = `<div class="p-4 text-red-500 text-xs">Error: ${e.message}</div>`;
    }
}

async function renderQuizRunner(data, user, customRunner = null) {
    const container = document.getElementById('qa-runner-container');
    
    // --- SMART ROUTING LOGIC ---
    const isAccountingCycle = (data.tasks && Array.isArray(data.tasks) && data.tasks.length > 0) || 
                              data.type === 'accounting_cycle' || 
                              (data.activityname && data.activityname.includes('Task'));

    if (isAccountingCycle && customRunner && typeof customRunner === 'function') {
        if (container._reactRoot) {
             // Reuse existing root logic if needed
        } else {
             container.innerHTML = '';
        }
        
        const goBack = () => {
             if (container._reactRoot) delete container._reactRoot; 
             document.getElementById('qa-toggle-sidebar').click(); 
             loadStudentActivities(user, customRunner);
        };

        customRunner(container, data, user, goBack);
        return; 
    }
    
    // --- STANDARD QUIZ LOGIC ---
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

    // 1. Check for existing "Final" Results
    try {
        const resultDoc = await getDoc(doc(db, collectionName, docId));
        if (resultDoc.exists()) {
            const rData = resultDoc.data();
            if (rData.status === "final") {
                // IMPORTANT: Let finished students see their results even if expired
                // Clear any leftover HTML first
                container.innerHTML = '';
                renderStudentResultDetail(container, user, data, rData, collectionName, docId);
                return;
            } else {
                savedState = rData;
            }
        }
    } catch (e) { console.error(e); }

    // 2. CHECK EXPIRY (REVISED - BLOCK ENTRY)
    const now = new Date();
    // Determine the correct expiry date (from main config or the first test section)
    const expireDate = data.dateTimeExpire ? new Date(data.dateTimeExpire) : new Date(data.testQuestions?.[0]?.dateTimeExpire);
    
    // If current time is past expiry AND the student hasn't reached "final" status
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
        return; // Stop here and do not load the quiz
    }
    // --- END OF EXPIRED HANDLER ---

    container.innerHTML = '<div class="flex justify-center items-center h-full"><i class="fas fa-spinner fa-spin text-4xl text-blue-800"></i><span class="ml-3">Generating Activity...</span></div>';
    
    const generatedContent = await generateQuizContent(data, savedState);

    // Standard Anti-Cheat HTML
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
        <div class="flex flex-col h-full bg-gray-100">
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

// --- CONTENT GENERATOR ---
async function generateQuizContent(activityData, savedState = null) {
    let tabsHtml = '';
    let sectionsHtml = '';
    let questionData = []; 

    if (!activityData.testQuestions || !Array.isArray(activityData.testQuestions)) {
        return { html: '<div class="p-8 text-center text-gray-500">No test sections defined.</div>', data: [] };
    }

    // --- START TABS HTML ---
    tabsHtml = `<div class="bg-white border-b border-gray-300 flex items-center px-2 overflow-x-auto whitespace-nowrap shrink-0 z-20 sticky top-0 shadow-sm">`;
    
    // 1. Tab Buttons Left
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

    // 2. Center Info Panel (Timers & Dates)
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

    // 3. Right Save Buttons
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
    // --- END TABS HTML ---

    sectionsHtml = `<div class="w-full max-w-7xl mx-auto p-2 md:p-4">`; 

    for (const [index, section] of activityData.testQuestions.entries()) {
        const sTopics = section.topics ? section.topics.split(',').map(t => t.trim()).filter(t => t) : [];
        const sCompetencies = section.competencies ? section.competencies.split(',').map(t => t.trim()).filter(t => t) : [];
        const sSubtopics = section.subtopics ? section.subtopics.split(',').map(t => t.trim()).filter(t => t) : [];

        const isHidden = index === 0 ? '' : 'hidden'; 

        sectionsHtml += `<div id="test-section-${index}" class="test-section-panel w-full ${isHidden}" data-section-type="${section.type}">`;

        // -- STICKY HEADER IMPLEMENTATION --
        const stickyHeaderHtml = `
            <div class="sticky top-14 bg-blue-50 border-b border-blue-200 px-4 py-2 z-10 shadow-sm mb-4">
                <div class="flex flex-col gap-.5 text-xs text-gray-700">
                    <h3 class="text-lg font-semibold border-b pb-1 text-blue-900">
                        <span class="font-bold text-blue-800">Type:</span> ${section.type}
                    </h3>
                    <div class="border-b pb-1">
                        <span class="font-bold text-blue-800">Topic:</span> ${section.topics}
                    </div>
                    <div class="border-b pb-1">
                        <span class="font-bold text-blue-800">Instruction:</span> ${section.instructions}
                    </div>
                    <div class="border-b pb-1">
                        <span class="font-bold text-blue-800">Rubric:</span> ${section.gradingRubrics || 'N/A'}
                    </div>
                </div>
            </div>
        `;
        
        sectionsHtml += stickyHeaderHtml;

        let questions = [];
        const count = parseInt(section.noOfQuestions) || 5;

        // Source Selection
        let localSource = [];
        if (section.type === "Multiple Choice") localSource = qbMerchMultipleChoice;
        else if (section.type === "Problem Solving") localSource = qbMerchProblemSolving;
        else if (section.type === "Journalizing") localSource = qbMerchJournalizing;

        const flattenedCandidates = localSource.map(obj => {
            const id = Object.keys(obj)[0];
            return { id, ...obj[id] };
        });

        // Filter Candidates
        let candidates = flattenedCandidates.filter(q => {
            const subjectMatch = q.subject === "FABM1";
            const topicMatch = sTopics.length === 0 || sTopics.includes(q.topic);
            const compMatch = sCompetencies.length === 0 || sCompetencies.includes(q.competency);
            const subMatch = sSubtopics.length === 0 || sSubtopics.includes(q.subtopic);
            return subjectMatch && topicMatch && compMatch && subMatch;
        });

        candidates.sort(() => 0.5 - Math.random());
        
        // --- SELECTION & GAP FILLING LOGIC ---
        for(let i=0; i < count; i++) {
            const uiId = `s${index}_q${i}`;
            let selectedQ = null;

            // 1. Try to load SAVED question for this specific slot
            if (savedState && savedState.questionsTaken && savedState.questionsTaken[uiId]) {
                const savedRef = savedState.questionsTaken[uiId];
                
                // FORCE LOOKUP: We primarily trust the Live Source Map now
                if (savedRef.dbId && globalQuestionMap.has(savedRef.dbId)) {
                    selectedQ = { ...globalQuestionMap.get(savedRef.dbId) };
                } else {
                    // Fallback to saved ref if source is missing (e.g. deleted question)
                    selectedQ = {
                        id: savedRef.id || "legacy",
                        question: savedRef.questionText,
                        options: savedRef.options,
                        correctAnswer: savedRef.correctAnswer,
                        explanation: savedRef.explanation,
                        transactions: savedRef.transactions,
                        instructions: savedRef.instructions
                    };
                }
                selectedQ.isSaved = true; 
            } 
            
            // 2. If no saved question for this slot, pick NEW random
            if (!selectedQ) {
                if (candidates.length > 0) {
                    selectedQ = candidates.pop(); 
                    selectedQ.isSaved = false;
                }
            }

            if (selectedQ) questions.push(selectedQ);
        }
        
        let questionsHtml = '';
        let trackerHtml = '';

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
                questionText: q.question || (q.title || 'Journal Activity'),
                correctAnswer: q.correctAnswer,
                options: q.options || [],
                explanation: q.explanation || '',
                transactions: q.transactions || [],
                instructions: q.instructions || null
            });

            if (section.type !== "Journalizing") {
                const hiddenClass = qIdx === 0 ? '' : 'hidden';
                
                const trackerClass = q.isSaved 
                    ? "tracker-btn w-9 h-9 m-0.5 rounded-full border border-green-500 bg-green-100 text-green-700 font-bold flex items-center justify-center"
                    : (qIdx===0 ? 'tracker-btn w-9 h-9 m-0.5 rounded-full border bg-blue-600 text-white border-blue-600 font-bold flex items-center justify-center ring-2 ring-blue-300' : 'tracker-btn w-9 h-9 m-0.5 rounded-full border bg-white text-gray-700 border-gray-300 font-bold flex items-center justify-center hover:bg-blue-100');

                trackerHtml += `
                    <button type="button" class="${trackerClass}" data-target-question="${uiId}" ${q.isSaved ? 'data-is-answered="true"' : ''}>
                        ${qIdx + 1}
                    </button>
                `;

                let innerContent = '';
                if (section.type === "Multiple Choice") {
                    const opts = q.options ? q.options.map((opt, optIdx) => {
                        const isChecked = String(savedValue) === String(optIdx) ? 'checked' : '';
                        const optDim = q.isSaved ? 'opacity-75 cursor-not-allowed bg-gray-50' : 'hover:bg-blue-50 cursor-pointer bg-white';
                        
                        return `
                        <label class="flex items-start p-3 border border-gray-200 rounded transition-colors mb-2 shadow-sm ${optDim}">
                            <input type="radio" name="${uiId}" value="${optIdx}" class="input-checker mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 shrink-0" ${disabledAttr} ${isChecked}>
                            <span class="text-sm text-gray-700">${opt}</span>
                        </label>
                    `}).join('') : '';
                    innerContent = `<div class="flex flex-col mt-2">${opts}</div>`;
                } else {
                    const val = savedValue || '';
                    innerContent = `
                        <textarea name="${uiId}" class="input-checker w-full mt-2 p-3 border border-gray-300 rounded h-32 md:h-48 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm resize-y ${dimClass}" placeholder="Type your answer here..." ${disabledAttr}>${val}</textarea>
                    `;
                }

                questionsHtml += `
                    <div id="${uiId}" class="question-block w-full ${hiddenClass}">
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
                            <div class="p-4 md:p-6">
                                <div class="mb-2">
                                    <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">Question ${qIdx+1}</span>
                                    <p class="text-base md:text-lg font-bold text-gray-800 mt-1 leading-snug">${q.question}</p>
                                </div>
                                ${innerContent}
                                <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                                    <button type="button" class="nav-prev-btn text-gray-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-gray-100">
                                        <i class="fas fa-arrow-left mr-1"></i> Previous
                                    </button>
                                    <button type="button" class="nav-next-btn bg-blue-800 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-blue-900 shadow">
                                        Next <i class="fas fa-arrow-right ml-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } 
            else {
                const transactions = q.transactions || [];
                const jHiddenClass = qIdx === 0 ? '' : 'hidden'; 
                
                let transTrackerList = '';
                let transContent = '';

                transactions.forEach((trans, tIdx) => {
                    const transUiId = `${uiId}_t${tIdx}`;
                    const tHidden = tIdx === 0 ? '' : 'hidden';
                    const tActive = tIdx === 0 ? 'bg-blue-100 border-l-4 border-blue-600 text-blue-800' : 'bg-white border-l-4 border-transparent text-gray-600 hover:bg-gray-50';

                    transTrackerList += `
                        <button type="button" class="trans-tracker-btn w-full text-left p-3 border-b border-gray-100 text-xs md:text-sm font-medium transition-colors focus:outline-none ${tActive}" data-target-trans="${transUiId}" data-t-index="${tIdx}">
                            <div class="font-bold whitespace-nowrap">${trans.date}</div>
                            <div class="whitespace-normal opacity-80 text-xs">${trans.description}</div>
                        </button>
                    `;

                    const rowCount = trans.rows || 2;
                    let rows = '';
                    for(let r=0; r < rowCount; r++) {
                        const cellKey = `t${tIdx}_r${r}`;
                        const cellData = (savedValue && savedValue[cellKey]) ? savedValue[cellKey] : { date:'', acct:'', dr:'', cr:'' };
                        const inputDim = q.isSaved ? 'text-gray-500' : 'text-black';

                        rows += `
                        <tr class="border-b border-gray-200 bg-white">
                            <td class="p-0 border-r border-gray-300 w-24"><input type="text" name="${transUiId}_r${r}_date" class="input-checker w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${inputDim}" placeholder="" value="${cellData.date}" ${disabledAttr}></td>
                            <td class="p-0 border-r border-gray-300 w-auto"><input type="text" name="${transUiId}_r${r}_acct" class="input-checker w-full p-2 text-left outline-none bg-transparent font-mono text-sm ${inputDim}" placeholder="" value="${cellData.acct}" ${disabledAttr}></td>
                            <td class="p-0 border-r border-gray-300 w-28"><input type="number" name="${transUiId}_r${r}_dr" class="input-checker w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${inputDim}" style="appearance: textfield; -moz-appearance: textfield; -webkit-appearance: none;" placeholder="" value="${cellData.dr}" ${disabledAttr}></td>
                            <td class="p-0 w-28"><input type="number" name="${transUiId}_r${r}_cr" class="input-checker w-full p-2 text-right outline-none bg-transparent font-mono text-sm ${inputDim}" style="appearance: textfield; -moz-appearance: textfield; -webkit-appearance: none;" placeholder="" value="${cellData.cr}" ${disabledAttr}></td>
                        </tr>`;
                    }

                    transContent += `
                        <div id="${transUiId}" class="journal-trans-block w-full ${tHidden}">
                            <div class="bg-blue-50 p-3 rounded mb-3 border border-blue-100">
                                <span class="text-xs text-blue-500 font-bold uppercase">Transaction Details</span>
                                <p class="text-md font-bold text-gray-800">${trans.date} ${trans.description}</p>
                            </div>

                            <div class="w-full overflow-x-auto border border-gray-300 rounded shadow-sm bg-white mb-2">
                                <table class="w-full border-collapse table-fixed min-w-[600px]">
                                    <thead><tr class="bg-gray-100 text-xs text-gray-600 font-bold uppercase border-b border-gray-300">
                                        <th class="py-2 border-r border-gray-300 w-24">Date</th>
                                        <th class="py-2 border-r border-gray-300 text-left pl-4 w-auto">Account Titles</th>
                                        <th class="py-2 border-r border-gray-300 w-28 text-right pr-2">Debit</th>
                                        <th class="py-2 w-28 text-right pr-2">Credit</th>
                                    </tr></thead>
                                    <tbody>${rows}</tbody>
                                </table>
                            </div>

                            <div class="flex justify-between items-center mt-4 mb-2">
                                <div>
                                    ${tIdx > 0 ? `<button type="button" class="btn-prev-trans px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium border border-gray-300" data-target-idx="${tIdx - 1}"><i class="fas fa-chevron-left mr-1"></i> Previous Transaction</button>` : ''}
                                </div>
                                <div>
                                    ${tIdx < transactions.length - 1 ? `<button type="button" class="btn-next-trans px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium shadow-sm" data-target-idx="${tIdx + 1}">Next Transaction <i class="fas fa-chevron-right ml-1"></i></button>` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                });

                questionsHtml += `
                    <div id="${uiId}" class="question-block w-full ${jHiddenClass}" data-is-journal="true">
                        <div class="bg-white rounded shadow-sm border border-gray-200 flex flex-col md:flex-row overflow-hidden">
                             <div class="flex-1 p-0 md:p-0 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col">
                                 <div class="p-4 md:p-2 flex-1">
                                     ${transContent}
                                     ${questions.length > 1 ? `
                                     <div class="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                                          <button type="button" class="nav-prev-btn px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">Previous Question</button>
                                          <button type="button" class="nav-next-btn px-3 py-1 bg-blue-800 text-white rounded text-sm hover:bg-blue-900">Next Question</button>
                                     </div>` : ''}
                                 </div>
                             </div>
                             
                             <div class="w-full md:w-64 bg-gray-50 flex flex-col max-h-64 md:max-h-full overflow-y-auto">
                                <div class="p-2 bg-gray-100 font-bold text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 sticky top-0">
                                    Transactions
                                </div>
                                <div class="flex-1">
                                    ${transTrackerList}
                                </div>
                             </div>
                        </div>
                    </div>
                `;
            }
        });

        if (section.type !== "Journalizing") {
            sectionsHtml += `
                <div class="flex flex-col md:flex-row md:items-start gap-4">
                    <div class="flex-1 min-w-0">
                        ${questionsHtml}
                    </div>

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
            sectionsHtml += `
                <div class="w-full">
                    ${questionsHtml}
                </div>
            `;
        }

        sectionsHtml += `</div>`; 
    }

    sectionsHtml += `</div>`; 

    return { html: tabsHtml + sectionsHtml, data: questionData };
}

// --- QUIZ MANAGER (INTERACTIVITY) ---
function initializeQuizManager(activityData, questionData, user, savedState) {
    const submitBtn = document.getElementById('btn-submit-quiz');
    const saveBtn = document.getElementById('btn-save-progress');
    const form = document.getElementById('quiz-form');

    // Anti-Cheat
    const highStakesKeywords = ['Summative', 'Prelim', 'Midterm', 'Semi-final', 'Final', 'Performance'];
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

    // Per-Section Timers
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
                
                // EXPIRE HANDLER: NO AUTO-SUBMIT
                if (!hasSubmittedOnExpire) {
                    hasSubmittedOnExpire = true;
                    // Stop all timers
                    sectionIntervals.forEach(i => clearInterval(i));
                    // Alert the user
                    alert("Time is up! Your current progress is locked but will not be auto-submitted. Please contact your instructor.");
                    // Force refresh to trigger the "Access Denied" screen
                    window.location.reload();
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

    // Tab Logic
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

            // Switch Timer Display in Header
            timerInfos.forEach(info => info.classList.add('hidden'));
            const targetTimer = document.getElementById(`section-timer-info-${index}`);
            if(targetTimer) targetTimer.classList.remove('hidden');
        });
    });

    // Navigation & Tracker Logic
    sections.forEach(section => {
        const type = section.dataset.sectionType;
        if (type !== 'Journalizing') {
            const questions = section.querySelectorAll('.question-block');
            const trackers = section.querySelectorAll('.tracker-btn');
            const prevBtns = section.querySelectorAll('.nav-prev-btn');
            const nextBtns = section.querySelectorAll('.nav-next-btn');
            
            let currentIndex = 0;
            // Jump to first unanswered
            for (let i = 0; i < trackers.length; i++) {
                if (trackers[i].dataset.isAnswered !== "true") {
                    currentIndex = i;
                    break;
                }
            }

            function showQuestion(index) {
                questions.forEach((q, i) => {
                    if (i === index) q.classList.remove('hidden');
                    else q.classList.add('hidden');
                });
                
                // Update Tracker Styling
                trackers.forEach((t, i) => {
                    t.className = "tracker-btn w-9 h-9 m-0.5 rounded-full border font-bold flex items-center justify-center focus:outline-none transition-colors";
                    if (i === index) {
                        t.classList.add('bg-blue-600', 'text-white', 'border-blue-600', 'ring-2', 'ring-blue-300');
                    } else {
                        if (t.dataset.isAnswered === "true") {
                             t.classList.add('bg-green-100', 'text-green-700', 'border-green-500');
                        } else {
                             t.classList.add('bg-white', 'text-gray-700', 'border-gray-300', 'hover:bg-blue-100');
                        }
                    }
                });
                
                currentIndex = index;
            }
            
            showQuestion(currentIndex); 

            trackers.forEach((t, idx) => t.addEventListener('click', () => showQuestion(idx)));
            prevBtns.forEach(btn => btn.addEventListener('click', () => { if (currentIndex > 0) showQuestion(currentIndex - 1); }));
            nextBtns.forEach(btn => btn.addEventListener('click', () => { if (currentIndex < questions.length - 1) showQuestion(currentIndex + 1); }));
        } 
        else if (type === 'Journalizing') {
            const questions = section.querySelectorAll('.question-block');
            const prevQuestionBtns = section.querySelectorAll('.nav-prev-btn');
            const nextQuestionBtns = section.querySelectorAll('.nav-next-btn');
            let currentJournalIndex = 0;

            function showJournalQuestion(index) {
                questions.forEach((q, i) => {
                    if (i === index) q.classList.remove('hidden');
                    else q.classList.add('hidden');
                });
                currentJournalIndex = index;
            }

            prevQuestionBtns.forEach(btn => btn.addEventListener('click', () => { if (currentJournalIndex > 0) showJournalQuestion(currentJournalIndex - 1); }));
            nextQuestionBtns.forEach(btn => btn.addEventListener('click', () => { if (currentJournalIndex < questions.length - 1) showJournalQuestion(currentJournalIndex + 1); }));
            
            // Internal Transaction Navigation
            questions.forEach(qBlock => {
                const transBtns = qBlock.querySelectorAll('.trans-tracker-btn');
                const transBlocks = qBlock.querySelectorAll('.journal-trans-block');
                const internalPrevBtns = qBlock.querySelectorAll('.btn-prev-trans');
                const internalNextBtns = qBlock.querySelectorAll('.btn-next-trans');

                const switchTransaction = (idx) => {
                      transBlocks.forEach(b => b.classList.add('hidden'));
                      if(transBlocks[idx]) transBlocks[idx].classList.remove('hidden');

                      transBtns.forEach((b, bIdx) => {
                          if (bIdx === idx) {
                              b.className = 'trans-tracker-btn w-full text-left p-3 border-b border-gray-100 text-xs md:text-sm font-medium transition-colors focus:outline-none bg-blue-100 border-l-4 border-blue-600 text-blue-800';
                          } else {
                              if (b.dataset.isAnswered === "true") {
                                  b.className = 'trans-tracker-btn w-full text-left p-3 border-b border-gray-100 text-xs md:text-sm font-medium transition-colors focus:outline-none bg-green-50 border-l-4 border-green-500 text-green-700 hover:bg-green-100';
                              } else {
                                  b.className = 'trans-tracker-btn w-full text-left p-3 border-b border-gray-100 text-xs md:text-sm font-medium transition-colors focus:outline-none bg-white border-l-4 border-transparent text-gray-600 hover:bg-gray-50';
                              }
                          }
                      });
                };
                
                transBtns.forEach((btn, idx) => btn.addEventListener('click', () => switchTransaction(idx)));
                internalPrevBtns.forEach(btn => btn.addEventListener('click', () => switchTransaction(parseInt(btn.dataset.targetIdx))));
                internalNextBtns.forEach(btn => btn.addEventListener('click', () => switchTransaction(parseInt(btn.dataset.targetIdx))));
            });
        }
    });

    form.addEventListener('input', checkCompletion);
    
    function checkCompletion() {
        let allAnswered = true;
        for (const q of questionData) {
            let isQuestionAnswered = false;
            if (q.type === 'Multiple Choice') {
                const checked = form.querySelector(`input[name="${q.uiId}"]:checked`);
                if (checked || document.querySelector(`input[name="${q.uiId}"][disabled]:checked`)) isQuestionAnswered = true;
                else allAnswered = false;
                
                const trackerBtn = document.querySelector(`button[data-target-question="${q.uiId}"]`);
                if (trackerBtn) {
                    trackerBtn.dataset.isAnswered = isQuestionAnswered ? "true" : "false";
                    if (!trackerBtn.classList.contains('bg-blue-600')) {
                        if (isQuestionAnswered) {
                            trackerBtn.className = "tracker-btn w-9 h-9 m-0.5 rounded-full border border-green-500 bg-green-100 text-green-700 font-bold flex items-center justify-center";
                        } else {
                            trackerBtn.className = "tracker-btn w-9 h-9 m-0.5 rounded-full border border-gray-300 bg-white text-gray-700 font-bold flex items-center justify-center hover:bg-blue-100";
                        }
                    }
                }
            } else if (q.type === 'Problem Solving') {
                const val = form.querySelector(`textarea[name="${q.uiId}"]`).value;
                if (val && val.trim() !== '') isQuestionAnswered = true;
                else allAnswered = false;

                const trackerBtn = document.querySelector(`button[data-target-question="${q.uiId}"]`);
                if (trackerBtn) {
                    trackerBtn.dataset.isAnswered = isQuestionAnswered ? "true" : "false";
                    if (!trackerBtn.classList.contains('bg-blue-600')) {
                        if (isQuestionAnswered) {
                            trackerBtn.className = "tracker-btn w-9 h-9 m-0.5 rounded-full border border-green-500 bg-green-100 text-green-700 font-bold flex items-center justify-center";
                        } else {
                            trackerBtn.className = "tracker-btn w-9 h-9 m-0.5 rounded-full border border-gray-300 bg-white text-gray-700 font-bold flex items-center justify-center hover:bg-blue-100";
                        }
                    }
                }
            } else if (q.type === 'Journalizing') {
                const transBtns = document.querySelectorAll(`button[data-target-trans^="${q.uiId}_t"]`);
                let questionHasData = false;
                transBtns.forEach(btn => {
                    const transUiId = btn.dataset.targetTrans;
                    const inputs = form.querySelectorAll(`input[name^="${transUiId}"]`);
                    let transHasData = false;
                    inputs.forEach(i => { if(i.value) transHasData = true; });
                    btn.dataset.isAnswered = transHasData ? "true" : "false";
                    if(transHasData) questionHasData = true;
                    if (!btn.classList.contains('bg-blue-100')) {
                        btn.className = transHasData
                            ? 'trans-tracker-btn w-full text-left p-3 border-b border-gray-100 text-xs md:text-sm font-medium transition-colors focus:outline-none bg-green-50 border-l-4 border-green-500 text-green-700 hover:bg-green-100'
                            : 'trans-tracker-btn w-full text-left p-3 border-b border-gray-100 text-xs md:text-sm font-medium transition-colors focus:outline-none bg-white border-l-4 border-transparent text-gray-600 hover:bg-gray-50';
                    }
                });
                if(!questionHasData) allAnswered = false; 
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

// --- SAVE PROGRESS (REF-ONLY MODE) ---
async function saveProgress(activityData, questionData, user) {
    if (currentAntiCheat) {
        currentAntiCheat.stopMonitoring();
    }
    
    if(!confirm("Save progress? Saved answers cannot be edited later.")) {
        if (currentAntiCheat) currentAntiCheat.startMonitoring();
        return;
    }

    const form = document.getElementById('quiz-form');
    const formData = new FormData(form);
    const answers = {};
    const questionsTaken = {}; 

    questionData.forEach(q => {
        let hasValue = false;
        let value = null;

        if(q.type === 'Multiple Choice') { 
            value = formData.get(q.uiId);
            if (value !== null && value !== undefined) hasValue = true;
        } else if (q.type === 'Problem Solving') {
            value = formData.get(q.uiId);
            if (value && value.trim() !== '') hasValue = true;
        } else if (q.type === 'Journalizing') {
            const inputs = document.querySelectorAll(`input[name^="${q.uiId}"]`);
            let currentRow = {};
            let hasRowData = false;
            inputs.forEach(input => {
                 if(input.value) hasRowData = true;
                 const name = input.name;
                 const parts = name.split('_'); 
                 const tIdx = parts[2];
                 const rIdx = parts[3];
                 const field = parts[4];
                 const key = `${tIdx}_${rIdx}`;
                 if(!currentRow[key]) currentRow[key] = {};
                 currentRow[key][field] = input.value;
            });
            if (hasRowData) {
                value = currentRow;
                hasValue = true;
            }
        }

        // Check for already saved (disabled) values
        if (document.querySelector(`[name="${q.uiId}"][disabled]`)) {
             if (q.type === 'Multiple Choice') {
                 const chk = document.querySelector(`input[name="${q.uiId}"]:checked`);
                 if(chk) { value = chk.value; hasValue = true; }
             } else if (q.type === 'Problem Solving') {
                 const txt = document.querySelector(`textarea[name="${q.uiId}"]`);
                 if(txt) { value = txt.value; hasValue = true; }
             } else if (q.type === 'Journalizing') {
                 const inputs = document.querySelectorAll(`input[name^="${q.uiId}"]`);
                 let currentRow = {};
                 inputs.forEach(input => {
                       const name = input.name;
                       const parts = name.split('_'); 
                       const tIdx = parts[2];
                       const rIdx = parts[3];
                       const field = parts[4];
                       const key = `${tIdx}_${rIdx}`;
                       if(!currentRow[key]) currentRow[key] = {};
                       currentRow[key][field] = input.value;
                 });
                 value = currentRow; hasValue = true;
             }
        }

        if (hasValue) {
            answers[q.uiId] = value;
            questionsTaken[q.uiId] = {
                dbId: q.dbId,
                questionText: q.questionText,
                type: q.type
            };
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
        sectionScores: {} // Not scored yet
    };

    try {
        await setDoc(doc(db, collectionName, docName), payload);
        
        // Ensure this progress is registered in the list so teachers can see it
        // even if it's not "final" yet.
        const listId = `${activityData.activityname}_${activityData.section}`;
        await setDoc(doc(db, "results_list", listId), { 
            created: new Date().toISOString(),
            activityName: activityData.activityname,
            section: activityData.section
        }, { merge: true });

        alert("Progress saved! Page will reload to lock saved answers.");
        renderQuizRunner(activityData, user); // Reload to apply disabled state
    } catch (e) {
        console.error("Save Error:", e);
        alert("Error saving: " + e.message);
    }
}

// --- SUBMIT QUIZ (REF-ONLY MODE with FORCE Option) ---
// ADDED: forceSubmit parameter for timer expiry
async function submitQuiz(activityData, questionData, user, isFinal = false, forceSubmit = false) {
    // MODIFIED: Skip confirmation if forceSubmit is true
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
        questionsTaken[q.uiId] = {
            dbId: q.dbId, 
            questionText: q.questionText,
            type: q.type
        };

        let val = null;
        if(q.type === 'Multiple Choice') val = formData.get(q.uiId);
        else if(q.type === 'Problem Solving') val = formData.get(q.uiId);
        else if(q.type === 'Journalizing') {
             const inputs = document.querySelectorAll(`input[name^="${q.uiId}"]`);
             let currentRow = {};
             inputs.forEach(input => {
                 const name = input.name;
                 const parts = name.split('_'); 
                 const tIdx = parts[2];
                 const rIdx = parts[3];
                 const field = parts[4];
                 const key = `${tIdx}_${rIdx}`;
                 if(!currentRow[key]) currentRow[key] = {};
                 currentRow[key][field] = input.value;
             });
             val = currentRow;
        }

        if (!val || (typeof val === 'string' && val === '')) {
             const disabledInput = document.querySelector(`[name="${q.uiId}"][disabled]`);
             if (disabledInput) {
                 if (q.type === 'Multiple Choice') {
                      const chk = document.querySelector(`input[name="${q.uiId}"]:checked`);
                      if(chk) val = chk.value;
                 } else if (q.type === 'Problem Solving') {
                      val = disabledInput.value;
                 } else if (q.type === 'Journalizing') {
                      const inputs = document.querySelectorAll(`input[name^="${q.uiId}"]`);
                      let currentRow = {};
                      inputs.forEach(input => {
                           const name = input.name;
                           const parts = name.split('_'); 
                           const tIdx = parts[2];
                           const rIdx = parts[3];
                           const field = parts[4];
                           const key = `${tIdx}_${rIdx}`;
                           if(!currentRow[key]) currentRow[key] = {};
                           currentRow[key][field] = input.value;
                       });
                       val = currentRow;
                 }
             }
        }
        
        answers[q.uiId] = val;
    });

    const sectionScores = {};
    activityData.testQuestions.forEach((section, index) => {
        sectionScores[index] = { score: 0, maxScore: 0, percentage: 0, letterGrade: 'N/A' };
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
        
        // FIXED: Use a consistent ID generation strategy for the results_list
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
