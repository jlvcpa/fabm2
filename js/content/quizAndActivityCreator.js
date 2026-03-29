import { getFirestore, collection, getDocs, doc, setDoc, query, orderBy, limit, where } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

import { qbMerchMultipleChoice } from "./questionBank/qbMerchMultipleChoice.js";
import { qbMerchProblemSolving } from "./questionBank/qbMerchProblemSolving.js";
import { qbMerchJournalizing } from "./questionBank/qbMerchJournalizing.js";
import { qbConstructedResponse } from "./questionBank/qbCFS.js"; // <-- NEW IMPORT

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

let currentSection = null;
let selectedStudents = [];

export async function renderQuizActivityCreator(container) {
    container.innerHTML = `
        <div class="flex flex-col lg:flex-row gap-6 h-full p-4 overflow-hidden">
            <div class="flex-[3] bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div class="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h2 class="font-bold text-lg text-blue-900"><i class="fas fa-magic mr-2"></i>Create/Edit Activity</h2>
                    <button id="btn-save-activity" class="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700 transition">
                        <i class="fas fa-save mr-2"></i>Save
                    </button>
                </div>
                
                <div class="flex flex-col md:flex-row h-full overflow-hidden">
                    <div class="w-full md:w-[70%] p-6 overflow-y-auto space-y-4 border-r border-gray-200">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">School Year</label>
                                <select id="qc-school-year" class="w-full p-2 border rounded bg-gray-50">
                                    <option value="25-26">25-26</option>
                                    <option value="26-27">26-27</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Activity Name</label>
                                <select id="qc-activity-name" class="w-full p-2 border rounded">
                                    <option value="">-- Select Activity --</option>
                                    <option value="S1T2 Summative Test 01">S1T2 Summative Test 01</option>
                                    <option value="S1T2 Performance Task 01">S1T2 Performance Task 01</option>
                                    <option value="S1T2 Performance Task 02">S1T2 Performance Task 02</option>
                                    <option value="S2T1 Formative Test 02">S2T1 Formative Test 02</option>
                                    <option value="S2T1 Summative Test 01">S2T1 Summative Test 01</option>
                                    <option value="S2T1 Summative Test 02">S2T1 Summative Test 02</option>
                                    <option value="S2T1 Midterm Exam">S2T1 Midterm Exam</option>
                                    <option value="S2T1 Midterm Formative Exam">S2T1 Midterm Formative Exam</option>
                                    <option value="S2T1 Midterm Formative Exam 01">S2T1 Midterm Formative Exam 01</option>
                                    <option value="S2T1 Midterm Formative Exam 02">S2T1 Midterm Formative Exam 02</option>
                                    <option value="S2T2 Formative Test 01">S2T2 Formative Test 01</option>
                                    <option value="S2T2 Formative Test 02">S2T2 Formative Test 02</option>
                                    <option value="S2T2 Formative Test 03">S2T2 Formative Test 03</option>
                                    <option value="S2T2 Formative Test 04">S2T2 Formative Test 04</option>
                                    <option value="S2T2 Formative Test 05">S2T2 Formative Test 05</option>
                                    <option value="S2T2 Formative Test 06">S2T2 Formative Test 06</option>
                                    <option value="S2T2 Formative Test 07">S2T2 Formative Test 07</option>
                                    <option value="S2T2 Formative Test 08">S2T2 Formative Test 08</option>
                                    <option value="S2T2 Formative Test 09">S2T2 Formative Test 09</option>
                                    <option value="S2T2 Formative Test 10">S2T2 Formative Test 10</option>
                                    <option value="S2T2 Coursework 01">S2T2 Coursework 01</option>
                                    <option value="S2T2 Coursework 02">S2T2 Coursework 02</option>
                                    <option value="S2T2 Summative Test 01">S2T2 Summative Test 01</option>
                                    <option value="Final Exam">Final Exam</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <label class="block text-xs font-bold text-gray-500 uppercase">Test Sections</label>
                                <button id="btn-add-section" class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                                    <i class="fas fa-plus mr-1"></i> Add
                                </button>
                            </div>
                            <div id="qc-test-sections" class="space-y-4"></div>
                        </div>
                    </div>

                    <div class="w-full md:w-[30%] p-4 bg-gray-50 flex flex-col h-full">
                        <div class="mb-2">
                            <div class="flex justify-between items-end mb-1">
                                <label class="block text-xs font-bold text-gray-500 uppercase">Section</label>
                                <button id="btn-select-all-students" class="text-xs text-blue-600 font-bold hover:underline">Select All</button>
                            </div>
                            <select id="qc-section" class="w-full p-2 border rounded bg-white text-sm">
                                <option value="">Loading Sections...</option>
                            </select>
                        </div>
                        
                        <div class="flex-1 overflow-hidden flex flex-col">
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Students</label>
                            <div id="qc-student-list" class="flex-1 overflow-y-auto border rounded p-2 bg-white text-sm">
                                <p class="text-gray-400 italic text-center mt-4">Select a section to load students.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-full lg:w-1/4 bg-gray-50 border-l border-gray-200 flex flex-col rounded-lg border">
                <div class="p-4 border-b border-gray-200 bg-white rounded-t-lg">
                    <h3 class="font-bold text-gray-700 text-sm">Saved Activities</h3>
                </div>
                <div id="qc-saved-list" class="flex-1 overflow-y-auto p-4 space-y-2">
                    <p class="text-gray-400 text-sm italic text-center mt-4">Select a section to view saved work.</p>
                </div>
            </div>
        </div>
    `;

    attachCreatorListeners();
    loadSections();
}

function attachCreatorListeners() {
    document.getElementById('qc-section').addEventListener('change', async (e) => {
        currentSection = e.target.value;
        if(currentSection) {
            await loadStudents(currentSection);
            await loadSavedQuizzes(currentSection);
        }
    });

    document.getElementById('btn-select-all-students').addEventListener('click', () => {
        document.querySelectorAll('.student-checkbox').forEach(cb => cb.checked = true);
    });

    document.getElementById('btn-add-section').addEventListener('click', () => addTestSectionUI());

    document.getElementById('btn-save-activity').addEventListener('click', saveActivityToFirebase);

    if (!window.__qcDropdownListenerAdded) {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-dropdown')) {
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.add('hidden');
                });
            }
        });
        window.__qcDropdownListenerAdded = true;
    }
}

function addTestSectionUI(existingData = null) {
    const container = document.getElementById('qc-test-sections');
    const index = container.children.length + 1;
    
    const div = document.createElement('div');
    div.className = "bg-white p-4 rounded border border-gray-300 shadow-sm relative text-sm section-card";
    
    div.innerHTML = `
        <div class="absolute top-2 right-2 cursor-pointer text-red-400 hover:text-red-600" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </div>
        <h4 class="font-bold text-gray-800 mb-3 border-b pb-1">Test Section ${index}</h4>
        
        <div class="grid grid-cols-2 gap-4 mb-3">
            <div>
                <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Type</label>
                <select class="section-type w-full p-2 border rounded bg-gray-50">
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Problem Solving">Problem Solving</option>
                    <option value="Journalizing">Journalizing</option>
                    <option value="Journalizing and Preparing SCE (Corp)">Journalizing and Preparing SCE (Corp)</option>
                    <option value="Constructed Response">Constructed Response</option> </select>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Qty</label>
                <input type="number" class="section-count w-full p-2 border rounded bg-gray-50" value="5">
            </div>
        </div>
        
        <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Filters</label>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3 bg-gray-50 p-3 rounded border border-gray-200">
            <div class="relative custom-dropdown">
                <label class="block text-[10px] text-orange-600 font-bold mb-1 uppercase">1. Subject</label>
                <button type="button" class="dropdown-toggle w-full flex items-center justify-between p-2 border border-orange-200 rounded bg-white text-xs text-left min-h-[34px] hover:border-orange-400 transition-colors">
                    <span class="dropdown-label whitespace-normal break-words text-orange-900 font-medium leading-tight">All Subjects</span>
                    <i class="fas fa-chevron-down ml-2 text-orange-400 shrink-0"></i>
                </button>
                <div class="dropdown-menu absolute hidden z-50 bg-white border border-gray-300 rounded shadow-xl mt-1 min-w-full w-max max-h-[300px] overflow-y-auto"></div>
                <input type="hidden" class="section-subject-area" value="">
            </div>

            <div class="relative custom-dropdown">
                <label class="block text-[10px] text-purple-600 font-bold mb-1 uppercase">2. Competency</label>
                <button type="button" class="dropdown-toggle w-full flex items-center justify-between p-2 border border-purple-200 rounded bg-white text-xs text-left min-h-[34px] hover:border-purple-400 transition-colors">
                    <span class="dropdown-label whitespace-normal break-words text-purple-900 font-medium leading-tight">All Competencies</span>
                    <i class="fas fa-chevron-down ml-2 text-purple-400 shrink-0"></i>
                </button>
                <div class="dropdown-menu absolute hidden z-50 bg-white border border-gray-300 rounded shadow-xl mt-1 min-w-full w-max max-h-[300px] overflow-y-auto"></div>
                <input type="hidden" class="section-competency-area" value="">
            </div>

            <div class="relative custom-dropdown">
                <label class="block text-[10px] text-blue-600 font-bold mb-1 uppercase">3. Topic</label>
                <button type="button" class="dropdown-toggle w-full flex items-center justify-between p-2 border border-blue-200 rounded bg-white text-xs text-left min-h-[34px] hover:border-blue-400 transition-colors">
                    <span class="dropdown-label whitespace-normal break-words text-blue-900 font-medium leading-tight">All Topics</span>
                    <i class="fas fa-chevron-down ml-2 text-blue-400 shrink-0"></i>
                </button>
                <div class="dropdown-menu absolute hidden z-50 bg-white border border-gray-300 rounded shadow-xl mt-1 min-w-full w-max max-h-[300px] overflow-y-auto"></div>
                <input type="hidden" class="section-topics-area" value="">
            </div>

            <div class="relative custom-dropdown">
                <label class="block text-[10px] text-green-600 font-bold mb-1 uppercase">4. Subtopic</label>
                <button type="button" class="dropdown-toggle w-full flex items-center justify-between p-2 border border-green-200 rounded bg-white text-xs text-left min-h-[34px] hover:border-green-400 transition-colors">
                    <span class="dropdown-label whitespace-normal break-words text-green-900 font-medium leading-tight">All Subtopics</span>
                    <i class="fas fa-chevron-down ml-2 text-green-400 shrink-0"></i>
                </button>
                <div class="dropdown-menu absolute hidden z-50 bg-white border border-gray-300 rounded shadow-xl mt-1 min-w-full w-max max-h-[300px] overflow-y-auto"></div>
                <input type="hidden" class="section-subtopics-area" value="">
            </div>
        </div>

        <div class="grid grid-cols-3 gap-2 mb-3 bg-blue-50 border border-blue-100 p-3 rounded">
            <div>
                <label class="block text-[10px] font-bold text-blue-800 uppercase mb-1">Start</label>
                <input type="datetime-local" class="section-start-time w-full p-1.5 border rounded text-xs">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-blue-800 uppercase mb-1">Mins</label>
                <input type="number" class="section-time-limit w-full p-1.5 border rounded text-xs" value="60">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-blue-800 uppercase mb-1">Expire</label>
                <input type="datetime-local" class="section-expire-time w-full p-1.5 border rounded text-xs">
            </div>
        </div>

        <div class="mb-3">
            <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Instructions</label>
            <input type="text" class="section-instructions w-full p-2 border rounded bg-gray-50">
        </div>

        <div>
            <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Rubrics</label>
            <textarea class="section-rubrics w-full p-2 border rounded bg-gray-50 h-12"></textarea>
        </div>
    `;
    container.appendChild(div);

    const typeSelect = div.querySelector('.section-type');
    const startInput = div.querySelector('.section-start-time');
    const limitInput = div.querySelector('.section-time-limit');
    const expireInput = div.querySelector('.section-expire-time');

    const setupCustomDropdown = (inputClass, defaultLabel) => {
        const dropdown = div.querySelector(inputClass).closest('.custom-dropdown');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        const hiddenInput = dropdown.querySelector(inputClass);
        const label = dropdown.querySelector('.dropdown-label');

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            div.querySelectorAll('.dropdown-menu').forEach(m => {
                if (m !== menu) m.classList.add('hidden');
            });
            menu.classList.toggle('hidden');
        });

        menu.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const checked = Array.from(menu.querySelectorAll('input:checked')).map(cb => cb.value);
                hiddenInput.value = checked.join(', ');
                label.textContent = checked.length > 0 ? checked.join(', ') : defaultLabel;
                refreshAllDropdowns();
            }
        });

        return { menu, hiddenInput, label, defaultLabel };
    };

    const subj = setupCustomDropdown('.section-subject-area', 'All Subjects');
    const comp = setupCustomDropdown('.section-competency-area', 'All Competencies');
    const topic = setupCustomDropdown('.section-topics-area', 'All Topics');
    const subtopic = setupCustomDropdown('.section-subtopics-area', 'All Subtopics');

    const refreshAllDropdowns = () => {
        const filters = {
            subject: subj.hiddenInput.value ? subj.hiddenInput.value.split(',').map(s => s.trim()).filter(Boolean) : [],
            competency: comp.hiddenInput.value ? comp.hiddenInput.value.split(',').map(s => s.trim()).filter(Boolean) : [],
            topic: topic.hiddenInput.value ? topic.hiddenInput.value.split(',').map(s => s.trim()).filter(Boolean) : [],
            subtopic: subtopic.hiddenInput.value ? subtopic.hiddenInput.value.split(',').map(s => s.trim()).filter(Boolean) : []
        };
        const type = typeSelect.value;

        updateDropdownOptions(subj.menu, subj.hiddenInput, type, 'subject', { competency: filters.competency, topic: filters.topic, subtopic: filters.subtopic });
        updateDropdownOptions(comp.menu, comp.hiddenInput, type, 'competency', { subject: filters.subject, topic: filters.topic, subtopic: filters.subtopic });
        updateDropdownOptions(topic.menu, topic.hiddenInput, type, 'topic', { subject: filters.subject, competency: filters.competency, subtopic: filters.subtopic });
        updateDropdownOptions(subtopic.menu, subtopic.hiddenInput, type, 'subtopic', { subject: filters.subject, competency: filters.competency, topic: filters.topic });
    };

    refreshAllDropdowns();

    typeSelect.addEventListener('change', () => {
        subj.hiddenInput.value = "";
        subj.label.textContent = subj.defaultLabel;
        
        comp.hiddenInput.value = "";
        comp.label.textContent = comp.defaultLabel;
        
        topic.hiddenInput.value = "";
        topic.label.textContent = topic.defaultLabel;
        
        subtopic.hiddenInput.value = "";
        subtopic.label.textContent = subtopic.defaultLabel;
        
        refreshAllDropdowns();
    });

    limitInput.addEventListener('input', () => {
        if(startInput.value && limitInput.value) {
            const start = new Date(startInput.value);
            const mins = parseInt(limitInput.value);
            const expire = new Date(start.getTime() + mins * 60000);
            expireInput.value = new Date(expire.getTime() - (expire.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        }
    });

    expireInput.addEventListener('change', () => {
        if(startInput.value && expireInput.value) {
            const start = new Date(startInput.value);
            const end = new Date(expireInput.value);
            const diffMs = end - start;
            const diffMins = Math.floor(diffMs / 60000);
            if(diffMins > 0) limitInput.value = diffMins;
        }
    });

    if(existingData) {
        typeSelect.value = existingData.type;
        div.querySelector('.section-count').value = existingData.noOfQuestions;
        div.querySelector('.section-instructions').value = existingData.instructions;
        div.querySelector('.section-rubrics').value = existingData.gradingRubrics;
        
        subj.hiddenInput.value = existingData.subjects || "";
        subj.label.textContent = existingData.subjects || subj.defaultLabel;

        comp.hiddenInput.value = existingData.competencies || "";
        comp.label.textContent = existingData.competencies || comp.defaultLabel;

        topic.hiddenInput.value = existingData.topics || "";
        topic.label.textContent = existingData.topics || topic.defaultLabel;

        subtopic.hiddenInput.value = existingData.subtopics || "";
        subtopic.label.textContent = existingData.subtopics || subtopic.defaultLabel;

        if(existingData.dateTimeStart) startInput.value = existingData.dateTimeStart;
        if(existingData.timeLimit) limitInput.value = existingData.timeLimit;
        if(existingData.dateTimeExpire) expireInput.value = existingData.dateTimeExpire;
        
        refreshAllDropdowns();
    }
}

function updateDropdownOptions(menuElement, hiddenInput, type, targetField, filterCriteria) {
    let sourceData = [];
    
    // UPDATED TO INCLUDE CONSTRUCTED RESPONSE MAPPING
    if (type === "Multiple Choice") sourceData = qbMerchMultipleChoice;
    else if (type === "Problem Solving") sourceData = qbMerchProblemSolving;
    else if (type === "Journalizing") sourceData = qbMerchJournalizing;
    else if (type === "Journalizing and Preparing SCE (Corp)") sourceData = qbMerchJournalizing;   
    else if (type === "Constructed Response") sourceData = qbConstructedResponse; 

    if (!sourceData || sourceData.length === 0) {
        menuElement.innerHTML = '<div class="p-3 text-xs text-gray-500 italic">No data found</div>';
        return;
    }

    try {
        const uniqueValues = new Set();

        sourceData.forEach(item => {
            const q = Object.values(item)[0]; 
            
            if (filterCriteria.subject && filterCriteria.subject.length > 0) {
                if (!q.subject || !filterCriteria.subject.includes(q.subject.trim())) return;
            }

            if (filterCriteria.competency && filterCriteria.competency.length > 0) {
                if (!q.competency || !filterCriteria.competency.includes(q.competency.trim())) return;
            }

            if (filterCriteria.topic && filterCriteria.topic.length > 0) {
                if (!q.topic || !filterCriteria.topic.includes(q.topic.trim())) return;
            }

            if (filterCriteria.subtopic && filterCriteria.subtopic.length > 0) {
                if (!q.subtopic || !filterCriteria.subtopic.includes(q.subtopic.trim())) return;
            }

            if (q[targetField]) {
                uniqueValues.add(q[targetField].trim());
            }
        });

        const sortedValues = Array.from(uniqueValues).filter(t => t).sort();
        const currentSelected = hiddenInput.value ? hiddenInput.value.split(',').map(s => s.trim()) : [];

        menuElement.innerHTML = ''; 
        if (sortedValues.length === 0) {
            menuElement.innerHTML = `<div class="p-3 text-xs text-gray-500 italic">No matching ${targetField}s</div>`;
        } else {
            sortedValues.forEach(val => {
                const isChecked = currentSelected.includes(val);
                const item = document.createElement('label');
                item.className = "flex items-start gap-2 p-2.5 hover:bg-gray-100 cursor-pointer text-xs whitespace-nowrap border-b border-gray-50 last:border-0 transition-colors";
                item.innerHTML = `
                    <input type="checkbox" class="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" value="${val}" ${isChecked ? 'checked' : ''}>
                    <span class="text-gray-800 flex-1">${val}</span>
                `;
                menuElement.appendChild(item);
            });
        }

    } catch (e) {
        console.error(`Error filtering ${targetField}:`, e);
        menuElement.innerHTML = '<div class="p-3 text-xs text-red-500 italic">Error loading</div>';
    }
}

async function loadSections() {
    const select = document.getElementById('qc-section');
    try {
        const q = query(collection(db, "students"));
        const querySnapshot = await getDocs(q);
        const sections = new Set();
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if(data.Section) sections.add(data.Section);
        });

        select.innerHTML = '<option value="">-- Select Section --</option>';
        Array.from(sections).sort().forEach(sec => {
            const option = document.createElement('option');
            option.value = sec;
            option.text = sec;
            select.appendChild(option);
        });
    } catch (e) {
        console.error("Error loading sections:", e);
        select.innerHTML = '<option value="">Error loading</option>';
    }
}

async function loadStudents(sectionName) {
    const listDiv = document.getElementById('qc-student-list');
    listDiv.innerHTML = '<p class="text-xs text-gray-500 text-center mt-4">Loading students...</p>';
    
    try {
        const q = query(collection(db, "students"), where("Section", "==", sectionName));
        const querySnapshot = await getDocs(q);
        
        listDiv.innerHTML = '';
        
        if (querySnapshot.empty) {
            listDiv.innerHTML = '<p class="text-xs text-gray-400 text-center mt-4">No students found in this section.</p>';
            return;
        }

        const students = [];
        querySnapshot.forEach((doc) => {
            students.push(doc.data());
        });

        students.sort((a, b) => a.LastName.localeCompare(b.LastName));

        students.forEach((data) => {
            const fullName = `${data.LastName}, ${data.FirstName}`;
            const id = data.Idnumber; 

            const div = document.createElement('div');
            div.className = "flex items-start gap-2 mb-2 p-1 hover:bg-blue-50 rounded transition";
            div.innerHTML = `
                <input type="checkbox" class="student-checkbox mt-1" value="${id}" id="chk-${id}">
                <label for="chk-${id}" class="text-gray-700 cursor-pointer text-xs leading-tight select-none">
                    <span class="font-bold">${fullName}</span><br>
                    <span class="text-gray-400 text-[10px]">${id}</span>
                </label>
            `;
            listDiv.appendChild(div);
        });

    } catch (e) {
        console.error("Error loading students:", e);
        listDiv.innerHTML = '<p class="text-xs text-red-500 text-center mt-4">Error loading data.</p>';
    }
}

async function loadSavedQuizzes(section) {
    const container = document.getElementById('qc-saved-list');
    container.innerHTML = '<p class="text-xs text-gray-500 text-center mt-4">Loading activities...</p>';
    
    try {
        const q = query(collection(db, "quiz_list"), where("section", "==", section));
        const snapshot = await getDocs(q);
        
        container.innerHTML = '';
        if(snapshot.empty) {
            container.innerHTML = '<p class="text-xs text-gray-400 text-center mt-4">No activities found for this section.</p>';
            return;
        }

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            let displayDate = "N/A";
            if (data.testQuestions && data.testQuestions.length > 0 && data.testQuestions[0].dateTimeStart) {
                displayDate = new Date(data.testQuestions[0].dateTimeStart).toLocaleDateString();
            }

            const btn = document.createElement('button');
            btn.className = "w-full text-left bg-white p-3 rounded border border-gray-200 shadow-sm hover:border-blue-400 transition mb-2 group";
            btn.innerHTML = `
                <div class="font-bold text-blue-900 text-xs group-hover:text-blue-600">${data.activityname}</div>
                <div class="text-[10px] text-gray-400 mt-1">
                    <i class="far fa-clock mr-1"></i>${displayDate}
                </div>
            `;
            btn.onclick = () => populateCreatorForm(data);
            container.appendChild(btn);
        });

    } catch (e) {
        console.error(e);
        container.innerHTML = '<p class="text-xs text-red-400 text-center mt-4">Error loading list.</p>';
    }
}

function populateCreatorForm(data) {
    document.getElementById('qc-school-year').value = data.schoolYear || '25-26';
    document.getElementById('qc-activity-name').value = data.activityname;
    
    const sectionContainer = document.getElementById('qc-test-sections');
    sectionContainer.innerHTML = '';

    if(data.testQuestions && Array.isArray(data.testQuestions)) {
        data.testQuestions.forEach(section => addTestSectionUI(section));
    }

    if(data.students && Array.isArray(data.students)) {
        document.querySelectorAll('.student-checkbox').forEach(cb => {
            cb.checked = data.students.includes(cb.value);
        });
    }
}

async function saveActivityToFirebase() {
    const schoolYear = document.getElementById('qc-school-year').value;
    const activityName = document.getElementById('qc-activity-name').value;
    const section = document.getElementById('qc-section').value; 

    if(!activityName || !section) {
        alert("Please fill in Activity Name and Section.");
        return;
    }

    const selectedStudents = [];
    document.querySelectorAll('.student-checkbox:checked').forEach(cb => {
        selectedStudents.push(cb.value);
    });

    const testQuestions = [];
    const sectionDivs = document.getElementById('qc-test-sections').children;
    
    let allTopics = new Set();

    for(let div of sectionDivs) {
        const subjects = div.querySelector('.section-subject-area').value;
        const topics = div.querySelector('.section-topics-area').value;
        const competencies = div.querySelector('.section-competency-area').value;
        const subtopics = div.querySelector('.section-subtopics-area').value;

        const start = div.querySelector('.section-start-time').value;
        const limit = div.querySelector('.section-time-limit').value;
        const expire = div.querySelector('.section-expire-time').value;

        if(!start || !expire) {
            alert("Please ensure all test sections have Start and Expiry times.");
            return;
        }

        if(topics) topics.split(',').forEach(t => allTopics.add(t.trim()));

        testQuestions.push({
            type: div.querySelector('.section-type').value,
            noOfQuestions: div.querySelector('.section-count').value,
            
            subjects: subjects,
            competencies: competencies,
            topics: topics,
            subtopics: subtopics,
            
            dateTimeStart: start,
            timeLimit: limit,
            dateTimeExpire: expire,

            instructions: div.querySelector('.section-instructions').value,
            gradingRubrics: div.querySelector('.section-rubrics').value
        });
    }

    const cleanActName = activityName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const cleanSection = section.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const docId = `${schoolYear}_${cleanActName}_${cleanSection}`;

    const payload = {
        id: docId,
        schoolYear,
        activityname: activityName,
        topics: Array.from(allTopics).join(', '),
        testQuestions,
        students: selectedStudents,
        section: section,
        dateTimeCreated: new Date().toISOString()
    };

    try {
        await setDoc(doc(db, "quiz_list", docId), payload);
        alert("Activity saved successfully!");
        loadSavedQuizzes(section);
    } catch (e) {
        console.error("Error saving:", e);
        alert("Error saving activity: " + e.message);
    }
}
