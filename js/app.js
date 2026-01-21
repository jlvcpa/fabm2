import { loginUser } from './auth.js';
import { courseData } from './content/syllabus.js';
import { formatRanges } from './utils.js';

// --- STATE MANAGEMENT ---
let currentUser = null; 
let calendarAssignments = JSON.parse(localStorage.getItem('fabm2_calendar')) || {};
let flatTopics = []; 
let currentCalendarYear, currentCalendarMonth;

// --- DOM ELEMENTS ---
const elements = {
    loginId: () => document.getElementById('login-id'),
    loginPass: () => document.getElementById('login-pass'),
    loginError: () => document.getElementById('login-error'),
    btnLogin: () => document.getElementById('btn-login'),
    loginSpinner: () => document.getElementById('login-spinner'),
    loginScreen: () => document.getElementById('login-screen'),
    appContent: () => document.getElementById('app-content'),
    userDisplayName: () => document.getElementById('user-display-name'),
    navContainer: () => document.getElementById('nav-container'),
    contentArea: () => document.getElementById('content-area'),
    pageTitle: () => document.getElementById('page-title'),
    sidebar: () => document.getElementById('sidebar'),
    sidebarOverlay: () => document.getElementById('sidebar-overlay'),
    // hoverMenu: () => document.getElementById('hover-menu'), // No longer needed
    mobileMenuBtn: () => document.getElementById('mobile-menu-btn'),
    desktopSidebarToggle: () => document.getElementById('desktop-sidebar-toggle'),
    btnLogout: () => document.getElementById('btn-logout')
};

// --- INITIALIZATION ---

function init() {
    setupEventListeners();
    setPhilippineTimeDefaults();
    generateFlatTopics();
    
    // Expose updateSchedule to window for HTML onchange attributes
    window.updateSchedule = updateSchedule;
}

function setupEventListeners() {
    // Auth
    elements.btnLogin().addEventListener('click', handleLogin);
    elements.btnLogout().addEventListener('click', handleLogout);
    
    // Sidebar
    elements.desktopSidebarToggle().addEventListener('click', () => {
        elements.sidebar().classList.toggle('collapsed');
        
        // If collapsing, we might want to close all submenus, 
        // but keeping them open state is usually better UX until clicked.
    });
    
    elements.mobileMenuBtn().addEventListener('click', () => {
        elements.sidebar().classList.remove('-translate-x-full');
        elements.sidebarOverlay().classList.remove('hidden');
    });

    elements.sidebarOverlay().addEventListener('click', closeMobileSidebar);

    // Hover Menu listeners removed as we are now using click-accordion
}

// --- AUTH LOGIC ---

async function handleLogin() {
    const id = elements.loginId().value.trim();
    const pass = elements.loginPass().value.trim();
    const errorDiv = elements.loginError();
    const btn = elements.btnLogin();
    const spinner = elements.loginSpinner();

    if (!id || !pass) {
        errorDiv.querySelector('span').textContent = "Please enter ID and Password";
        errorDiv.classList.remove('hidden');
        return;
    }

    btn.disabled = true;
    btn.classList.add('opacity-75');
    spinner.classList.remove('hidden');
    errorDiv.classList.add('hidden');

    try {
        const user = await loginUser(id, pass);
        
        if (user) {
            currentUser = user;
            
            elements.loginScreen().classList.add('hidden');
            elements.appContent().classList.remove('hidden');
            
            const name = currentUser.role === 'teacher' 
                ? `Teacher ${currentUser.firstName} ${currentUser.lastName}`
                : `${currentUser.FirstName} ${currentUser.LastName}`;
            
            elements.userDisplayName().textContent = name;
            
            initAppInterface(currentUser.role);
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        console.error("Login failed:", error);
        errorDiv.querySelector('span').textContent = "Invalid ID or Password";
        errorDiv.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.classList.remove('opacity-75');
        spinner.classList.add('hidden');
    }
}

function handleLogout() {
    currentUser = null;
    elements.appContent().classList.add('hidden');
    elements.loginScreen().classList.remove('hidden');
    elements.loginId().value = '';
    elements.loginPass().value = '';
    elements.navContainer().innerHTML = '';
}

// --- APP INTERFACE LOGIC ---

function initAppInterface(role) {
    renderSidebar(role);
    renderLandingPage(); 
}

function renderSidebar(role) {
    const container = elements.navContainer();
    container.innerHTML = ''; 

    // Course Outline Button
    const outlineBtn = document.createElement('button');
    outlineBtn.className = "w-full text-left px-6 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-l-4 border-transparent hover:border-blue-500 focus:outline-none whitespace-nowrap overflow-hidden";
    outlineBtn.innerHTML = '<i class="fas fa-home w-6"></i> <span class="sidebar-text-detail">Course Outline</span>';
    outlineBtn.onclick = () => {
        renderLandingPage();
        closeMobileSidebar();
    };
    container.appendChild(outlineBtn);

    // Calendar Button (Teachers Only)
    if (role === 'teacher') {
        const calendarBtn = document.createElement('button');
        calendarBtn.className = "w-full text-left px-6 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-l-4 border-transparent hover:border-purple-500 focus:outline-none whitespace-nowrap overflow-hidden";
        calendarBtn.innerHTML = '<i class="fas fa-calendar-alt w-6"></i> <span class="sidebar-text-detail">Course Schedule</span>';
        calendarBtn.onclick = () => {
            renderCalendarPage();
            closeMobileSidebar();
        };
        container.appendChild(calendarBtn);
    }

    // Dynamic Terms/Units
    courseData.terms.forEach(term => {
        const termHeader = document.createElement('div');
        termHeader.className = "px-6 py-2 mt-4 text-xs font-bold text-slate-500 uppercase tracking-wider sidebar-text-detail whitespace-nowrap overflow-hidden";
        termHeader.textContent = term.title;
        container.appendChild(termHeader);

        term.units.forEach(unit => {
            const unitParts = unit.title.split(':');
            const unitPrefix = unitParts[0];
            const unitSuffix = unitParts.slice(1).join(':');

            // --- UNIT BUTTON ---
            const unitBtn = document.createElement('button');
            unitBtn.className = "w-full text-left px-6 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex justify-between items-center group whitespace-nowrap overflow-hidden";
            unitBtn.innerHTML = `
                <div class="truncate pr-2">
                    <span class="font-bold text-sm">${unitPrefix}</span>
                    <span class="font-medium text-sm sidebar-text-detail">:${unitSuffix}</span>
                </div>
                <i class="fas fa-chevron-down text-xs transform transition-transform duration-300 group-hover:text-blue-400"></i>
            `;
            
            const unitSubmenu = document.createElement('div');
            unitSubmenu.className = "unit-submenu bg-slate-950 hidden"; // Hidden by default
            
            unitBtn.onclick = () => {
                const icon = unitBtn.querySelector('.fa-chevron-down');
                
                // Toggle this unit
                if (unitSubmenu.classList.contains('hidden')) {
                    // Open
                    unitSubmenu.classList.remove('hidden');
                    icon.classList.add('rotate-180');
                } else {
                    // Close
                    unitSubmenu.classList.add('hidden');
                    icon.classList.remove('rotate-180');
                }
            };

            // --- WEEK RENDERER ---
            unit.weeks.forEach(week => {
                const weekParts = week.title.split(':');
                const weekPrefix = weekParts[0];
                const weekSuffix = weekParts.slice(1).join(':');

                // 1. Week Button (Parent)
                const weekBtn = document.createElement('button');
                // Added flex and group for chevron positioning
                weekBtn.className = "w-full text-left pl-10 pr-6 py-2 text-sm text-slate-400 hover:text-blue-300 hover:bg-slate-900 transition-colors border-l-2 border-transparent hover:border-blue-500 relative whitespace-nowrap overflow-hidden flex justify-between items-center group";
                
                // Added chevron icon for the week
                weekBtn.innerHTML = `
                    <div class="truncate">
                        <span>${weekPrefix}</span><span class="sidebar-text-detail">:${weekSuffix}</span>
                    </div>
                    ${(week.days && week.days.length > 0) ? '<i class="fas fa-chevron-down text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>' : ''}
                `;
                
                // 2. Day Submenu (Child Container)
                const daySubmenu = document.createElement('div');
                daySubmenu.className = "day-submenu hidden bg-slate-950 border-l border-slate-800 ml-10"; // Indented submenu

                // 3. Populate Days
                if (week.days && week.days.length > 0) {
                    week.days.forEach((day, index) => {
                        const dayBtn = document.createElement('button');
                        dayBtn.className = "w-full text-left pl-6 pr-4 py-2 text-xs text-slate-500 hover:text-blue-400 hover:bg-slate-900 transition-colors flex items-center gap-2";
                        dayBtn.innerHTML = `<i class="fas fa-circle text-[6px]"></i> <span>${day.day}: ${day.topic}</span>`;
                        
                        dayBtn.onclick = () => {
                            renderDayContent(unit, week, index);
                            closeMobileSidebar();
                            highlightActiveDay(dayBtn);
                        };
                        daySubmenu.appendChild(dayBtn);
                    });

                    // 4. Logic to Toggle Week and Show Days
                    weekBtn.onclick = () => {
                        const icon = weekBtn.querySelector('.fa-chevron-down');
                        const isClosed = daySubmenu.classList.contains('hidden');

                        // A. Close ALL other open Day Submenus in the entire sidebar
                        document.querySelectorAll('.day-submenu').forEach(el => el.classList.add('hidden'));
                        document.querySelectorAll('.day-submenu').forEach(el => {
                            // Reset chevrons of other weeks
                            const prevBtn = el.previousElementSibling; 
                            if(prevBtn) {
                                const prevIcon = prevBtn.querySelector('.fa-chevron-down');
                                if(prevIcon) {
                                    prevIcon.classList.remove('rotate-180', 'opacity-100', 'text-blue-400');
                                    prevIcon.classList.add('opacity-0');
                                }
                            }
                        });

                        // B. If it was closed, open THIS one
                        if (isClosed) {
                            daySubmenu.classList.remove('hidden');
                            if(icon) {
                                icon.classList.add('rotate-180', 'opacity-100', 'text-blue-400');
                                icon.classList.remove('opacity-0');
                            }
                            
                            // *** IMPORTANT: FORCE SIDEBAR EXPANSION ***
                            // If sidebar is collapsed (icons only), we must expand it so the user can see the "Day 1" text
                            if (elements.sidebar().classList.contains('collapsed')) {
                                elements.sidebar().classList.remove('collapsed');
                            }
                        }
                    };
                } else {
                    // If no days, just do nothing or show toast
                    weekBtn.classList.add('opacity-50', 'cursor-not-allowed');
                }

                unitSubmenu.appendChild(weekBtn);
                unitSubmenu.appendChild(daySubmenu);
            });

            container.appendChild(unitBtn);
            container.appendChild(unitSubmenu);
        });
    });
}

function renderLandingPage() {
    elements.pageTitle().innerText = "Course Outline";
    const content = elements.contentArea();
    content.innerHTML = '';

    const container = document.createElement('div');
    container.className = "max-w-4xl mx-auto pb-12";

    const tabsContainer = document.createElement('div');
    tabsContainer.className = "flex border-b border-gray-200 mb-6 bg-white rounded-t-lg shadow-sm";
    tabsContainer.innerHTML = `
        <button id="tab-landing-summary" class="flex-1 py-4 text-center text-sm font-semibold transition-colors tab-active rounded-tl-lg">
            <i class="fas fa-list-alt mr-2"></i>Summary
        </button>
        <button id="tab-landing-full" class="flex-1 py-4 text-center text-sm font-semibold transition-colors tab-inactive rounded-tr-lg">
            <i class="fas fa-file-alt mr-2"></i>Full Course Outline
        </button>
    `;
    container.appendChild(tabsContainer);

    const summaryDiv = document.createElement('div');
    summaryDiv.id = "content-landing-summary";
    summaryDiv.innerHTML = courseData.outline.summary;
    container.appendChild(summaryDiv);

    const fullDiv = document.createElement('div');
    fullDiv.id = "content-landing-full";
    fullDiv.className = "hidden";
    fullDiv.innerHTML = courseData.outline.full;
    container.appendChild(fullDiv);

    content.appendChild(container);

    // Landing Page Event Listeners
    container.querySelector('#tab-landing-summary').onclick = () => {
        summaryDiv.classList.remove('hidden', 'fade-in');
        summaryDiv.classList.add('fade-in');
        fullDiv.classList.add('hidden');
        document.getElementById('tab-landing-summary').className = document.getElementById('tab-landing-summary').className.replace('tab-inactive', 'tab-active');
        document.getElementById('tab-landing-full').className = document.getElementById('tab-landing-full').className.replace('tab-active', 'tab-inactive');
    };
    container.querySelector('#tab-landing-full').onclick = () => {
        fullDiv.classList.remove('hidden', 'fade-in');
        fullDiv.classList.add('fade-in');
        summaryDiv.classList.add('hidden');
        document.getElementById('tab-landing-full').className = document.getElementById('tab-landing-full').className.replace('tab-inactive', 'tab-active');
        document.getElementById('tab-landing-summary').className = document.getElementById('tab-landing-summary').className.replace('tab-active', 'tab-inactive');
    };
}

// --- DAY RENDERER (The Core Content Logic) ---

function renderDayContent(unit, week, dayIndex) {
    // Update document title for browser history/tab
    elements.pageTitle().innerText = `${unit.title} - ${week.title}`;
    
    const content = elements.contentArea();
    content.innerHTML = ''; 

    // Main Container: W-full to maximize width, flex-col to manage height
    const container = document.createElement('div');
    container.className = "w-full max-w-[1600px] mx-auto h-full flex flex-col";

    // 1. Prepare Date Badge Logic
    const scheduledDateStr = getDateForTopic(unit.id, week.id, dayIndex);
    const dateBadgeHtml = scheduledDateStr 
        ? `<div class="shrink-0 bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded border border-purple-200 shadow-sm whitespace-nowrap">
             <i class="far fa-calendar-check mr-1"></i>Scheduled: ${scheduledDateStr}
           </div>`
        : `<div class="shrink-0 text-gray-400 text-xs italic whitespace-nowrap">
             <i class="far fa-calendar mr-1"></i>Not scheduled
           </div>`;

    if (!week.days || week.days.length === 0) {
        container.innerHTML = `<div class="p-8 text-center text-gray-400 bg-white rounded-lg border border-dashed border-gray-300">Content for this week is being updated.</div>`;
        content.appendChild(container);
        return;
    }

    const day = week.days[dayIndex];

    // 2. Main Card Container
    const card = document.createElement('div');
    // Added flex-1 to make card fill all available vertical space
    card.className = "bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden fade-in";

    // 3. Compact Header (Day + Topic Left | Date Right)
    // Reduced vertical padding (py-3) to half height. Flex-wrap allows text to wrap if needed.
    const headerDiv = document.createElement('div');
    headerDiv.className = "bg-gray-50 px-6 py-3 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4";
    headerDiv.innerHTML = `
        <div class="flex items-center gap-3 overflow-hidden">
            <span class="shrink-0 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase">${day.day}</span>
            <h1 class="text-lg md:text-xl font-bold text-slate-800 leading-tight truncate-multiline">${day.topic}</h1>
        </div>
        ${dateBadgeHtml}
    `;
    card.appendChild(headerDiv);

    // 4. Combined Tabs & Navigation Bar
    const navBar = document.createElement('div');
    navBar.className = "flex flex-wrap items-center justify-between border-b border-gray-200 bg-white pl-0 pr-4 min-h-[50px]";

    // Left Side: Tabs (Left Aligned, Fixed Width/Padding instead of flex-1)
    const tabsContainer = document.createElement('div');
    tabsContainer.className = "flex";
    
    // Tab Button Helper
    const createTabBtn = (id, icon, label, isActive) => {
        const btn = document.createElement('button');
        btn.id = id;
        // px-6 for width, py-3 for comfortable touch target but compact
        btn.className = `px-6 py-3 text-sm font-semibold transition-colors border-b-2 flex items-center whitespace-nowrap ${
            isActive 
            ? 'border-blue-600 text-blue-900 bg-blue-50' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`;
        btn.innerHTML = `<i class="fas ${icon} mr-2"></i>${label}`;
        return btn;
    };

    const tabConcepts = createTabBtn('tab-btn-concepts', 'fa-book-reader', 'Topic & Concepts', true);
    const tabPractice = createTabBtn('tab-btn-practice', 'fa-pencil-alt', 'Practice Questions', false);

    tabsContainer.appendChild(tabConcepts);
    tabsContainer.appendChild(tabPractice);
    navBar.appendChild(tabsContainer);

    // Right Side: Navigation Buttons (Injected here instead of bottom footer)
    const navButtonsGroup = document.createElement('div');
    navButtonsGroup.className = "flex items-center gap-2 py-2 ml-auto"; // ml-auto pushes to right

    // Previous Button
    if (dayIndex > 0) {
        const prevBtn = document.createElement('button');
        // Reduced height by ~20% (py-1.5 vs py-2), text-xs
        prevBtn.className = "px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center";
        prevBtn.innerHTML = `<i class="fas fa-chevron-left mr-1"></i> Prev`;
        prevBtn.onclick = () => {
            renderDayContent(unit, week, dayIndex - 1);
            // Auto open the submenu if needed (UX enhancement)
            const activeWeekBtn = document.querySelector('.day-submenu:not(.hidden)')?.previousElementSibling;
            if (activeWeekBtn) activeWeekBtn.click();
        };
        navButtonsGroup.appendChild(prevBtn);
    }

    // Next Button
    if (dayIndex < week.days.length - 1) {
        const nextBtn = document.createElement('button');
        nextBtn.className = "px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-transparent rounded shadow-sm hover:bg-blue-700 transition-colors flex items-center";
        nextBtn.innerHTML = `Next <i class="fas fa-chevron-right ml-1"></i>`;
        nextBtn.onclick = () => renderDayContent(unit, week, dayIndex + 1);
        navButtonsGroup.appendChild(nextBtn);
    }

    navBar.appendChild(navButtonsGroup);
    card.appendChild(navBar);

    // 5. Content Area (Fills remaining height)
    const tabContentWrapper = document.createElement('div');
    tabContentWrapper.className = "p-8 flex-1 overflow-y-auto bg-white"; // Added bg-white explicitly

    const conceptsDiv = document.createElement('div');
    conceptsDiv.id = "tab-content-concepts";
    conceptsDiv.className = "prose prose-blue max-w-none text-gray-600";
    conceptsDiv.innerHTML = day.content;
    tabContentWrapper.appendChild(conceptsDiv);

    const practiceDiv = document.createElement('div');
    practiceDiv.id = "tab-content-practice";
    practiceDiv.className = "hidden space-y-6";
    
    if (day.exercises && day.exercises.length > 0) {
        practiceDiv.innerHTML = renderExercises(day.exercises, dayIndex);
    } else {
        practiceDiv.innerHTML = `<div class="text-center py-12"><p class="text-gray-500">No practice questions available for this day.</p></div>`;
    }
    tabContentWrapper.appendChild(practiceDiv);
    card.appendChild(tabContentWrapper);
    
    container.appendChild(card);
    content.appendChild(container);

    // 6. Tab Switching Logic
    const switchTab = (tab) => {
        if(tab === 'concepts') {
            conceptsDiv.classList.remove('hidden');
            practiceDiv.classList.add('hidden');
            
            // Update styles manually since we aren't using the old HTML string method
            tabConcepts.className = tabConcepts.className.replace('border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50', 'border-blue-600 text-blue-900 bg-blue-50');
            tabPractice.className = tabPractice.className.replace('border-blue-600 text-blue-900 bg-blue-50', 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50');
        } else {
            practiceDiv.classList.remove('hidden');
            conceptsDiv.classList.add('hidden');

            tabPractice.className = tabPractice.className.replace('border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50', 'border-blue-600 text-blue-900 bg-blue-50');
            tabConcepts.className = tabConcepts.className.replace('border-blue-600 text-blue-900 bg-blue-50', 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50');
        }
    }
    
    tabConcepts.onclick = () => switchTab('concepts');
    tabPractice.onclick = () => switchTab('practice');

    // Attach Logic AFTER rendering
    attachExerciseListeners();
    executeExerciseMounts(day.exercises);
}

function executeExerciseMounts(exercises) {
    if (!exercises) return;
    exercises.forEach(ex => {
        if (ex.type === 'custom-mount' && typeof ex.mountLogic === 'function') {
            // Execute the mount logic which typically imports and runs a module
            setTimeout(() => {
                ex.mountLogic();
            }, 0);
        }
    });
}

function renderExercises(exercises, dayIndex) {
    const CHUNK_SIZE = 20;

    // Helper to chunk arrays
    const chunkArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    // Filter exercises by type
    const mcqs = exercises.filter(ex => ex.type === 'mcq');
    const problems = exercises.filter(ex => ex.type === 'problem');
    const journals = exercises.filter(ex => ex.type === 'journalizing');
    const customs = exercises.filter(ex => ex.type === 'custom-mount');

    let html = '';

    // --- RENDER MCQS ---
    if (mcqs.length > 0) {
        const mcqSets = chunkArray(mcqs, CHUNK_SIZE);
        
        mcqSets.forEach((set, setIndex) => {
            const setContainerId = `mcq-set-${dayIndex}-${setIndex}`;
            
            html += `
                <div class="mb-10 bg-white rounded-lg border border-gray-200 shadow-sm p-1" id="${setContainerId}">
                    <div class="bg-blue-50 px-6 py-4 border-b border-blue-100 rounded-t-lg">
                        <h3 class="text-lg font-bold text-blue-800">MC Questions Set ${setIndex + 1}</h3>
                    </div>
                    <div class="p-6 space-y-8">
            `;

            // Render Questions in Set
            set.forEach((ex, i) => {
                // Determine the original index relative to the type array for labels like "Question 1"
                const globalIndex = (setIndex * CHUNK_SIZE) + i + 1;
                // Unique ID based on original data structure index finding would be complex, 
                // so we rely on a unique ID generation strategy: type-day-set-index
                const exId = `mcq-${dayIndex}-${setIndex}-${i}`;

                const optionsHtml = ex.options.map((opt, optIndex) => `
                    <label class="flex items-start p-3 rounded border border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors bg-white">
                        <input type="radio" name="${exId}" value="${optIndex}" class="mt-1 mr-3 text-blue-600 focus:ring-blue-500" data-qid="${exId}">
                        <span class="text-sm text-gray-700">${opt}</span>
                    </label>
                `).join('');

                html += `
                    <div class="question-block" data-qid="${exId}" data-type="mcq">
                        <p class="font-semibold text-gray-800 mb-4 text-base"><span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs mr-2">Question ${globalIndex}</span>${ex.question}</p>
                        <div class="space-y-3 mb-4">${optionsHtml}</div>
                        
                        <div class="validation-msg hidden mt-2 text-sm text-amber-600 font-medium italic"><i class="fas fa-exclamation-triangle mr-1"></i> Please answer this question to see the answer key.</div>

                        <div id="ans-${exId}" class="hidden mt-4 p-4 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                            <p class="font-bold mb-1"><i class="fas fa-check-circle mr-1"></i> Correct Answer: ${ex.options[ex.correctIndex]}</p>
                            <p>${ex.explanation}</p>
                        </div>
                    </div>
                `;
            });

            // Set Footer with Toggle Button
            html += `
                    </div>
                    <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg flex justify-end">
                        <button onclick="toggleExerciseSet('${setContainerId}', 'mcq', this)" 
                            class="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 shadow-md transition-colors w-full sm:w-auto">
                            Reveal Answer Key
                        </button>
                    </div>
                </div>
            `;
        });
    }

    // --- RENDER PROBLEMS ---
    if (problems.length > 0) {
        const problemSets = chunkArray(problems, CHUNK_SIZE);

        problemSets.forEach((set, setIndex) => {
            const setContainerId = `prob-set-${dayIndex}-${setIndex}`;
            
            html += `
                <div class="mb-10 bg-white rounded-lg border border-gray-200 shadow-sm p-1" id="${setContainerId}">
                    <div class="bg-purple-50 px-6 py-4 border-b border-purple-100 rounded-t-lg">
                        <h3 class="text-lg font-bold text-purple-800">Problem Questions Set ${setIndex + 1}</h3>
                    </div>
                    <div class="p-6 space-y-8">
            `;

            set.forEach((ex, i) => {
                const globalIndex = (setIndex * CHUNK_SIZE) + i + 1;
                const exId = `prob-${dayIndex}-${setIndex}-${i}`;

                html += `
                    <div class="question-block" data-qid="${exId}" data-type="problem">
                        <p class="font-semibold text-gray-800 mb-4 text-base"><span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs mr-2">Problem ${globalIndex}</span>${ex.question}</p>
                        
                        <textarea id="input-${exId}" class="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white" rows="4" placeholder="Type your solution here..." data-qid="${exId}"></textarea>
                        
                        <div class="validation-msg hidden mt-2 text-sm text-amber-600 font-medium italic"><i class="fas fa-exclamation-triangle mr-1"></i> Please answer this question to see the answer key.</div>

                        <div id="ans-${exId}" class="hidden mt-4 p-4 bg-green-50 border border-green-200 rounded text-sm text-green-800 font-mono whitespace-pre-wrap">
                            <strong><i class="fas fa-key mr-1"></i> Answer Key:</strong>
                            <div class="mt-1">${ex.answer}</div>
                            <div class="mt-3"><strong><i class="fas fa-info-circle mr-1"></i> Explanation:</strong></div>
                            <div class="mt-1">${ex.explanation}</div>
                        </div>
                    </div>
                `;
            });

             html += `
                    </div>
                    <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg flex justify-end">
                        <button onclick="toggleExerciseSet('${setContainerId}', 'problem', this)" 
                            class="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 shadow-md transition-colors w-full sm:w-auto">
                            Reveal Answer Key
                        </button>
                    </div>
                </div>
            `;
        });
    }

    // --- RENDER JOURNALIZING (Per Question Logic) ---
    if (journals.length > 0) {
        journals.forEach((ex, i) => {
            const exId = `journal-${dayIndex}-${i}`;
            
            // Helper to generate rows
            const generateRows = (txId, rowCount, isReadOnly = false, solutionData = []) => {
                let rowsHtml = '';
                for (let r = 0; r < rowCount; r++) {
                    const rowData = isReadOnly && solutionData[r] ? solutionData[r] : { date: '', account: '', debit: '', credit: '' };
                    let indentStyle = "padding-left: 0.5rem;"; 
                    let acctClass = "";
                    if (isReadOnly) {
                        if (rowData.isExplanation) {
                            indentStyle = "padding-left: 2rem;"; 
                            acctClass = "italic text-gray-500";
                        } else if (rowData.credit) {
                            indentStyle = "padding-left: 1.25rem;"; 
                        }
                    }

                    rowsHtml += `
                    <tr class="border-b border-gray-200 hover:bg-gray-50 bg-white">
                        <td class="border-r border-gray-300 p-0 w-16 align-top">
                            <input type="text" class="journal-input w-full h-full p-2 bg-transparent outline-none text-xs text-right font-mono text-gray-600" 
                                value="${rowData.date || ''}" ${isReadOnly ? 'readonly disabled' : ''}>
                        </td>
                        <td class="border-r border-gray-300 p-0 relative align-top">
                            <input type="text" id="acct-${txId}-${r}" class="journal-input w-full h-full p-2 bg-transparent outline-none text-sm font-mono transition-all duration-200 ${acctClass}"
                                style="${indentStyle}" value="${rowData.account || ''}" ${isReadOnly ? 'readonly disabled' : ''}>
                        </td>
                        <td class="border-r border-gray-300 p-0 w-28 align-top">
                            <input type="number" id="dr-${txId}-${r}" class="journal-input w-full h-full p-2 bg-transparent outline-none text-sm text-right font-mono"
                                step="0.01" value="${rowData.debit !== '' && rowData.debit !== undefined ? Number(rowData.debit).toFixed(2) : ''}"
                                ${isReadOnly ? 'readonly disabled' : 'oninput="handleJournalIndent(\'' + txId + '\', ' + r + ')"'}>
                        </td>
                        <td class="p-0 w-28 align-top">
                            <input type="number" id="cr-${txId}-${r}" class="journal-input w-full h-full p-2 bg-transparent outline-none text-sm text-right font-mono"
                                step="0.01" value="${rowData.credit !== '' && rowData.credit !== undefined ? Number(rowData.credit).toFixed(2) : ''}"
                                ${isReadOnly ? 'readonly disabled' : 'oninput="handleJournalIndent(\'' + txId + '\', ' + r + ')"'}>
                        </td>
                    </tr>`;
                }
                return rowsHtml;
            };

            const transactionsHtml = ex.transactions.map((tx, txIndex) => {
                const txId = `${exId}-tx-${txIndex}`;
                
                return `
                    <div class="mb-6 question-block" data-qid="${txId}" data-type="journal-tx">
                        <div class="border border-gray-300 shadow-sm rounded-lg overflow-hidden">
                            <div class="bg-gray-100 px-4 py-2 border-b border-gray-300 flex justify-between items-center">
                                <span class="font-bold text-gray-700 text-sm">${tx.date} - ${tx.description}</span>
                            </div>
                            <table class="w-full border-collapse">
                                <thead>
                                    <tr class="bg-gray-200 text-xs text-gray-600 font-bold uppercase border-b border-gray-300">
                                        <th class="py-2 border-r border-gray-300">Date</th>
                                        <th class="py-2 border-r border-gray-300 text-left pl-2">Account Titles</th>
                                        <th class="py-2 border-r border-gray-300">Debit</th>
                                        <th class="py-2">Credit</th>
                                    </tr>
                                </thead>
                                <tbody class="input-rows-container">
                                    ${generateRows(txId, tx.rows)}
                                </tbody>
                            </table>
                        </div>

                        <div class="validation-msg hidden mt-2 mb-4 text-sm text-amber-600 font-medium italic"><i class="fas fa-exclamation-triangle mr-1"></i> Please enter data for this transaction to see the answer key.</div>

                        <div id="ans-table-${txId}" class="hidden mt-4 mb-4 border-2 border-green-400 shadow-md rounded-lg overflow-hidden ring-4 ring-green-50">
                            <div class="bg-green-100 px-4 py-2 border-b border-green-300 text-green-800 font-bold text-sm">
                                <i class="fas fa-check-circle mr-2"></i> Correct Entry: ${tx.date}
                            </div>
                            <table class="w-full border-collapse bg-green-50">
                                <thead>
                                    <tr class="bg-green-200 text-xs text-green-800 font-bold uppercase border-b border-green-300">
                                        <th class="py-2 border-r border-green-300 w-16">Date</th>
                                        <th class="py-2 border-r border-green-300 text-left pl-2">Account Titles</th>
                                        <th class="py-2 border-r border-green-300 w-28">Debit</th>
                                        <th class="py-2 w-28">Credit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${generateRows(txId, tx.rows, true, tx.solution)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            }).join('');

            html += `
                <div class="bg-slate-50 p-6 rounded-lg border border-slate-100 mb-10" id="${exId}-container">
                    <h3 class="font-bold text-xl text-gray-900 mb-2 border-b pb-2">${ex.title}</h3>
                    <p class="text-gray-600 mb-6 text-sm">${ex.instructions}</p>
                    
                    ${transactionsHtml}

                    <div class="mt-6">
                         <button onclick="toggleJournalKey('${exId}-container', this)" 
                            class="px-6 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 shadow-md transition-colors w-full sm:w-auto">
                            Reveal Solution
                        </button>
                    </div>
                </div>
            `;
        });
    }

    return html;
}

// --- REQUIRED HELPER FUNCTIONs ---

// 1. Toggle Handler for Sets (MCQ & Problem)
window.toggleExerciseSet = function(containerId, type, btn) {
    const container = document.getElementById(containerId);
    const questions = container.querySelectorAll('.question-block');
    const isRevealing = btn.textContent.trim().includes('Reveal');

    if (isRevealing) {
        // --- REVEAL MODE ---
        questions.forEach(q => {
            const qid = q.getAttribute('data-qid');
            const inputs = q.querySelectorAll('input, textarea');
            let isAnswered = false;

            // Check if answered
            if (type === 'mcq') {
                const checked = q.querySelector('input:checked');
                if (checked) isAnswered = true;
            } else if (type === 'problem') {
                const val = q.querySelector('textarea').value.trim();
                if (val.length > 0) isAnswered = true;
            }

            // Lock inputs
            inputs.forEach(input => input.disabled = true);

            // Show Result or Warning
            const ansDiv = document.getElementById(`ans-${qid}`);
            const msgDiv = q.querySelector('.validation-msg');

            if (isAnswered) {
                ansDiv.classList.remove('hidden');
                ansDiv.classList.add('fade-in');
                msgDiv.classList.add('hidden');
            } else {
                ansDiv.classList.add('hidden');
                msgDiv.classList.remove('hidden');
            }
        });

        // Update Button
        btn.textContent = "Hide Answer Key";
        btn.classList.replace('bg-blue-600', 'bg-gray-600');
        btn.classList.replace('hover:bg-blue-700', 'hover:bg-gray-700');

    } else {
        // --- HIDE MODE ---
        questions.forEach(q => {
            const qid = q.getAttribute('data-qid');
            const inputs = q.querySelectorAll('input, textarea');

            // Unlock inputs
            inputs.forEach(input => input.disabled = false);

            // Hide Result and Warning
            const ansDiv = document.getElementById(`ans-${qid}`);
            const msgDiv = q.querySelector('.validation-msg');
            
            ansDiv.classList.add('hidden');
            msgDiv.classList.add('hidden');
        });

        // Update Button
        btn.textContent = "Reveal Answer Key";
        btn.classList.replace('bg-gray-600', 'bg-blue-600');
        btn.classList.replace('hover:bg-gray-700', 'hover:bg-blue-700');
    }
};

// 2. Toggle Handler for Journalizing
window.toggleJournalKey = function(containerId, btn) {
    const container = document.getElementById(containerId);
    const txBlocks = container.querySelectorAll('.question-block');
    const isRevealing = btn.textContent.trim().includes('Reveal');

    if (isRevealing) {
        // Reveal
        txBlocks.forEach(block => {
            const qid = block.getAttribute('data-qid');
            const inputs = block.querySelectorAll('input.journal-input');
            const ansDiv = document.getElementById(`ans-table-${qid}`);
            const msgDiv = block.querySelector('.validation-msg');

            // Check if user entered ANY data in this transaction block
            let hasData = false;
            inputs.forEach(inp => {
                if(inp.value.trim() !== "") hasData = true;
                inp.disabled = true; // Lock
            });

            if (hasData) {
                ansDiv.classList.remove('hidden');
                ansDiv.classList.add('fade-in');
                msgDiv.classList.add('hidden');
            } else {
                ansDiv.classList.add('hidden');
                msgDiv.classList.remove('hidden');
            }
        });

        btn.textContent = "Hide Solution";
        btn.classList.replace('bg-green-600', 'bg-gray-600');
        btn.classList.replace('hover:bg-green-700', 'hover:bg-gray-700');
    } else {
        // Hide
        txBlocks.forEach(block => {
            const qid = block.getAttribute('data-qid');
            const inputs = block.querySelectorAll('input.journal-input');
            const ansDiv = document.getElementById(`ans-table-${qid}`);
            const msgDiv = block.querySelector('.validation-msg');

            inputs.forEach(inp => inp.disabled = false); // Unlock
            ansDiv.classList.add('hidden');
            msgDiv.classList.add('hidden');
        });

        btn.textContent = "Reveal Solution";
        btn.classList.replace('bg-gray-600', 'bg-green-600');
        btn.classList.replace('hover:bg-gray-700', 'hover:bg-green-700');
    }
};

window.handleJournalIndent = function(txId, row) {
    const acctInput = document.getElementById(`acct-${txId}-${row}`);
    const drInput = document.getElementById(`dr-${txId}-${row}`);
    const crInput = document.getElementById(`cr-${txId}-${row}`);

    if (!acctInput) return;

    const drVal = drInput ? drInput.value.trim() : '';
    const crVal = crInput ? crInput.value.trim() : '';

    // Logic:
    // 1. If Credit has value -> Indent 5 spaces (~1.25rem)
    // 2. If Both Empty -> Assume Explanation -> Indent 8 spaces (~2rem)
    // 3. Else (Debit has value or typing) -> No Indent (0.5rem default padding)

    if (crVal !== '') {
        acctInput.style.paddingLeft = '1.25rem'; // ~5 spaces
        acctInput.classList.remove('italic', 'text-gray-500');
    } else if (drVal === '' && crVal === '') {
        acctInput.style.paddingLeft = '2rem'; // ~8 spaces
        acctInput.classList.add('italic', 'text-gray-500'); // Optional: make explanation italic
    } else {
        acctInput.style.paddingLeft = '0.5rem'; // Default
        acctInput.classList.remove('italic', 'text-gray-500');
    }
};

function attachExerciseListeners() {
    // Basic listeners can stay for UX (like highlighting radio selection), 
    // but the Reveal logic is now handled by the Set/Parent buttons.
    
    // Listen for radio changes (Optional visual feedback)
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            // No specific action needed immediately, handled by Reveal button
        });
    });
}

// --- HELPER / UI UTILS ---

function closeMobileSidebar() {
    elements.sidebar().classList.add('-translate-x-full');
    elements.sidebarOverlay().classList.add('hidden');
}

function highlightActiveDay(activeLink) {
    // Clear all highlights
    document.querySelectorAll('.day-submenu button').forEach(b => {
        b.classList.remove('text-blue-300', 'font-bold');
        b.querySelector('.fa-circle').classList.remove('text-blue-500');
        b.querySelector('.fa-circle').classList.add('text-[6px]'); // Reset size
    });
    
    // Add highlight
    activeLink.classList.add('text-blue-300', 'font-bold');
    const dot = activeLink.querySelector('.fa-circle');
    dot.classList.add('text-blue-500');
    dot.classList.remove('text-[6px]');
    dot.classList.add('text-[8px]');
}

// --- CALENDAR LOGIC (Full Implementation) ---

function setPhilippineTimeDefaults() {
    const phDateStr = new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"});
    const phDate = new Date(phDateStr);
    currentCalendarYear = phDate.getFullYear();
    currentCalendarMonth = phDate.getMonth();
}

function generateFlatTopics() {
    flatTopics = [];
    courseData.terms.forEach(term => {
        term.units.forEach(unit => {
            unit.weeks.forEach(week => {
                if (week.days && week.days.length > 0) {
                    week.days.forEach((day, index) => {
                        flatTopics.push({
                            id: `${unit.id}|${week.id}|${index}`,
                            label: `${unit.title.split(':')[0]} - ${week.title.split(':')[0]} - ${day.day}`,
                            fullTitle: `${day.topic}`
                        });
                    });
                }
            });
        });
    });
}

function getDateForTopic(unitId, weekId, dayIndex) {
    const topicKey = `${unitId}|${weekId}|${dayIndex}`;
    const dates = [];
    
    // Find all matching dates
    for (const [date, assignedTopic] of Object.entries(calendarAssignments)) {
        if (assignedTopic === topicKey) {
            dates.push(date);
        }
    }

    if (dates.length === 0) return null;

    // Sort dates
    dates.sort();

    // Format into ranges using updated Util
    return formatRanges(dates);
}

function updateSchedule(dateStr, topicId) {
    if (topicId === "") {
        delete calendarAssignments[dateStr];
    } else {
        calendarAssignments[dateStr] = topicId;
    }
    localStorage.setItem('fabm2_calendar', JSON.stringify(calendarAssignments));
    
    const select = document.getElementById(`sel-${dateStr}`);
    if (select) {
        if (topicId) {
            select.classList.add('border-purple-300', 'bg-purple-50', 'text-purple-900', 'font-medium');
            select.classList.remove('text-gray-500');
        } else {
            select.classList.remove('border-purple-300', 'bg-purple-50', 'text-purple-900', 'font-medium');
            select.classList.add('text-gray-500');
        }
    }
}

function renderCalendarPage() {
    elements.pageTitle().innerText = "Course Schedule Settings";
    const content = elements.contentArea();
    content.innerHTML = '';

    const container = document.createElement('div');
    container.className = "w-full max-w-7xl mx-auto pb-12 fade-in relative";

    const infoBox = document.createElement('div');
    infoBox.className = "mb-6 bg-purple-50 border border-purple-200 p-4 rounded-lg text-sm text-purple-800";
    infoBox.innerHTML = "<i class='fas fa-info-circle mr-2'></i> Select Year and Month to view the calendar. Assign topics to dates to build your schedule (PH Time).";
    container.appendChild(infoBox);

    const controls = document.createElement('div');
    controls.className = "flex flex-col md:flex-row gap-4 mb-6 calendar-controls bg-white p-4 rounded-lg border border-gray-200 shadow-sm";

    const yearSelect = document.createElement('select');
    yearSelect.className = "flex-1 border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 p-2 border";
    const currentYear = new Date().getFullYear();
    for(let y = 2024; y <= 2030; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.text = y;
        if(y === currentCalendarYear) opt.selected = true;
        yearSelect.appendChild(opt);
    }
    
    const monthSelect = document.createElement('select');
    monthSelect.className = "flex-1 border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 p-2 border";
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    months.forEach((m, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.text = m;
        if(idx === currentCalendarMonth) opt.selected = true;
        monthSelect.appendChild(opt);
    });

    const calendarContainer = document.createElement('div');
    
    // Event Listeners for controls
    yearSelect.onchange = (e) => {
        currentCalendarYear = parseInt(e.target.value);
        renderMonthView(calendarContainer);
    };
    monthSelect.onchange = (e) => {
        currentCalendarMonth = parseInt(e.target.value);
        renderMonthView(calendarContainer);
    };

    controls.appendChild(yearSelect);
    controls.appendChild(monthSelect);
    container.appendChild(controls);

    renderMonthView(calendarContainer); 
    container.appendChild(calendarContainer);

    content.appendChild(container);
    
    // Auto-scroll to today if present in current view
    setTimeout(() => {
        const todayRow = document.getElementById('today-row');
        if (todayRow) {
            todayRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            todayRow.classList.add('bg-purple-100'); // Highlight effect
            setTimeout(() => todayRow.classList.remove('bg-purple-100'), 2000);
        }
    }, 100);
}

function renderMonthView(container) {
    container.innerHTML = ''; 

    const monthDiv = document.createElement('div');
    monthDiv.className = "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden fade-in";
    
    const monthName = new Date(currentCalendarYear, currentCalendarMonth).toLocaleString('default', { month: 'long' });
    const monthHeader = document.createElement('div');
    monthHeader.className = "bg-slate-800 text-white px-6 py-3 font-bold text-lg flex justify-between items-center";
    monthHeader.innerHTML = `<span>${monthName} ${currentCalendarYear}</span> <span class="text-xs bg-slate-700 px-2 py-1 rounded">PH Time</span>`;
    monthDiv.appendChild(monthHeader);

    const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
    
    // Get today's info for highlighting
    const now = new Date();
    const todayStr = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Manila"}));
    const todayDay = todayStr.getDate();
    const todayMonth = todayStr.getMonth();
    const todayYear = todayStr.getFullYear();

    if (daysInMonth > 0) {
        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(currentCalendarYear, currentCalendarMonth, d);
            
            const yyyy = currentCalendarYear;
            const mm = String(currentCalendarMonth + 1).padStart(2, '0');
            const dd = String(d).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`; 

            const dayName = dateObj.toLocaleDateString('default', { weekday: 'short' });
            const isWeekend = dayName === 'Sat' || dayName === 'Sun';
            const currentAssignment = calendarAssignments[dateStr] || "";

            // Check if it's today
            const isToday = (d === todayDay && currentCalendarMonth === todayMonth && currentCalendarYear === todayYear);

            const row = document.createElement('div');
            if (isToday) row.id = "today-row";
            
            // Style adjustments for Today
            const rowClass = `flex items-center border-b border-gray-100 last:border-0 p-3 hover:bg-gray-50 transition-colors duration-500 ${isWeekend ? 'bg-gray-50' : ''} ${isToday ? 'border-l-4 border-l-purple-500' : ''}`;
            row.className = rowClass;
            
            const todayBadge = isToday ? '<span class="ml-2 text-xs bg-purple-600 text-white px-1.5 py-0.5 rounded font-bold">TODAY</span>' : '';

            row.innerHTML = `
                <div class="w-32 flex-shrink-0">
                    <div class="font-bold text-slate-700 flex items-center">
                        ${d} <span class="text-xs text-gray-400 font-normal uppercase ml-1">${dayName}</span>
                        ${todayBadge}
                    </div>
                </div>
                <div class="flex-1">
                    <select id="sel-${dateStr}" class="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 p-2 border bg-white ${currentAssignment ? 'border-purple-300 bg-purple-50 text-purple-900 font-medium' : 'text-gray-500'}" onchange="updateSchedule('${dateStr}', this.value)">
                        <option value="">-- No Class / Free Day --</option>
                        ${generateOptionsHtml(currentAssignment)}
                    </select>
                </div>
            `;
            monthDiv.appendChild(row);
        }
    }
    container.appendChild(monthDiv);
}

function generateOptionsHtml(selectedValue) {
    return flatTopics.map(t => {
        const isSelected = t.id === selectedValue ? 'selected' : '';
        return `<option value="${t.id}" ${isSelected}>${t.label}: ${t.fullTitle}</option>`;
    }).join('');
}

// Start the app
init();
