<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FABM 2 - Interactive Courseware</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1; 
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1; 
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8; 
        }

        .fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Sidebar Submenu Transition */
        .submenu {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }
        .submenu.open {
            max-height: 1000px; /* Arbitrary large height for transition */
            transition: max-height 0.5s ease-in;
        }

        /* Popover Menu Styling */
        #hover-menu {
            transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
        }

        /* Tab Active State Styling */
        .tab-active {
            border-bottom: 2px solid #2563eb; /* blue-600 */
            color: #1e3a8a; /* blue-900 */
            background-color: #eff6ff; /* blue-50 */
        }
        .tab-inactive {
            color: #64748b; /* slate-500 */
            border-bottom: 2px solid transparent;
        }
        .tab-inactive:hover {
            color: #334155; /* slate-700 */
            background-color: #f8fafc; /* slate-50 */
        }
        
        /* Calendar Controls */
        .calendar-controls select {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 0.5rem center;
            background-repeat: no-repeat;
            background-size: 1.5em 1.5em;
            padding-right: 2.5rem;
            -webkit-appearance: none;
            appearance: none;
        }

        /* Login Screen */
        #login-screen {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
        }

        /* --- SIDEBAR COLLAPSED STATE STYLES --- */
        #sidebar.collapsed {
            width: 4rem; /* Reduced to 4rem */
        }
        
        /* Hide detail text (topic titles) in collapsed mode */
        #sidebar.collapsed .sidebar-text-detail {
            display: none;
        }
        
        /* Hide main header text */
        #sidebar.collapsed .sidebar-header-text {
            display: none;
        }
        
        /* Center and resize icon in collapsed header */
        #sidebar.collapsed .sidebar-header-icon {
            margin-right: 0;
            font-size: 1.5rem;
        }
        
        /* Hide user name */
        #sidebar.collapsed #user-display-name {
            display: none;
        }
        
        /* Hide chevron arrows */
        #sidebar.collapsed .fa-chevron-down {
            display: none; 
        }
        
        /* Adjust padding for collapsed state buttons to center content */
        #sidebar.collapsed button {
            padding-left: 0;
            padding-right: 0;
            display: flex; /* Added flex to force centering on all buttons */
            justify-content: center;
            align-items: center;
        }
        
        /* Specific override for submenu buttons (Weeks) in collapsed state */
        #sidebar.collapsed .submenu button {
            padding-left: 0;
            padding-right: 0;
            text-align: center;
            font-size: 0.70rem; /* Slightly smaller font for weeks */
            justify-content: center;
        }

        /* Ensure truncation containers don't force left align in collapsed mode */
        #sidebar.collapsed .truncate {
            padding-right: 0;
            text-align: center;
        }
    </style>
</head>
<body class="bg-gray-50 text-slate-800 h-screen overflow-hidden font-sans">

    <!-- LOGIN SCREEN -->
    <div id="login-screen" class="fixed inset-0 z-[100] flex items-center justify-center">
        <div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md mx-4 fade-in">
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <i class="fas fa-book-reader text-blue-600 text-3xl"></i>
                </div>
                <h1 class="text-2xl font-bold text-slate-800">FABM 2 Courseware</h1>
                <p class="text-slate-500 text-sm mt-1">Please sign in to continue</p>
            </div>

            <div class="space-y-5">
                <!-- Unified Login: Single Interface for Student & Teacher -->
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">ID Number</label>
                    <div class="relative">
                        <i class="fas fa-id-card absolute left-3 top-3 text-slate-400"></i>
                        <input type="text" id="login-id" class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="Enter your ID Number">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <div class="relative">
                        <i class="fas fa-lock absolute left-3 top-3 text-slate-400"></i>
                        <input type="password" id="login-pass" class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="••••••••">
                    </div>
                </div>

                <div id="login-error" class="hidden p-3 bg-red-50 text-red-600 text-xs rounded-md border border-red-100 flex items-center">
                    <i class="fas fa-exclamation-circle mr-2"></i> <span>Invalid credentials</span>
                </div>

                <button id="btn-login" onclick="handleLogin()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex justify-center items-center">
                    <span>Sign In</span>
                    <i id="login-spinner" class="fas fa-circle-notch fa-spin ml-2 hidden"></i>
                </button>
            </div>
            
            <div class="mt-6 text-center text-xs text-slate-400">
                &copy; 2025 FABM Department
                <br>
                <span class="text-[10px] opacity-70 mt-1 block">[Version 2025-12-10 14:15:00 HTML Revision]</span>
            </div>
        </div>
    </div>

    <!-- APP CONTENT (Hidden initially) -->
    <div id="app-content" class="hidden flex h-full">
        <!-- Mobile Menu Button -->
        <button id="mobile-menu-btn" class="fixed top-4 left-4 z-50 md:hidden bg-blue-900 text-white p-2 rounded shadow-lg">
            <i class="fas fa-bars"></i>
        </button>

        <!-- Sidebar Navigation -->
        <aside id="sidebar" class="w-72 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col h-full transform -translate-x-full md:translate-x-0 transition-all duration-300 fixed md:relative z-40">
            <!-- Header -->
            <div class="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-center md:justify-start">
                <i class="fas fa-book-open text-blue-400 sidebar-header-icon mr-2"></i>
                <div class="overflow-hidden">
                    <h1 class="text-xl font-bold text-white tracking-wide sidebar-header-text">FABM 2</h1>
                    <p id="user-display-name" class="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold truncate">Guest</p>
                </div>
            </div>

            <!-- Navigation Links -->
            <nav class="flex-1 overflow-y-auto py-4" id="nav-container">
                <!-- Dynamic Nav Items will be injected here -->
            </nav>

            <!-- Footer -->
            <div class="p-4 bg-slate-950 border-t border-slate-800 text-xs text-center text-slate-600">
                <button onclick="handleLogout()" class="w-full py-2 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-slate-900 rounded transition-colors" title="Logout">
                    <i class="fas fa-sign-out-alt mr-0 md:mr-2"></i> <span class="sidebar-text-detail">Logout</span>
                </button>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 flex flex-col h-full relative w-full bg-gray-50">
            <!-- Top Bar -->
            <header class="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-8">
                <div class="flex items-center">
                    <!-- Desktop Sidebar Toggle Button -->
                    <button id="desktop-sidebar-toggle" class="hidden md:block mr-4 text-slate-600 hover:text-blue-600 transition-colors focus:outline-none" title="Toggle Sidebar">
                        <i class="fas fa-bars text-lg"></i>
                    </button>
                    <h2 id="page-title" class="text-lg font-semibold text-slate-800">Course Outline</h2>
                </div>
                <div class="text-sm text-slate-500">
                    Grade 12 <span class="mx-2">|</span> ABM Strand
                </div>
            </header>

            <!-- Content Scroll Area -->
            <div id="content-area" class="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
                <!-- Dynamic Content Injected Here -->
            </div>
        </main>

        <!-- Sidebar Overlay for mobile -->
        <div id="sidebar-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-30 hidden md:hidden"></div>

        <!-- HOVER MENU CONTAINER (Fixed Position) -->
        <div id="hover-menu" class="fixed hidden bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-64 overflow-hidden py-1">
            <!-- Dynamic Items -->
        </div>
    </div>

    <!-- JAVASCRIPT LOGIC -->
    <script type="module">
        // Import Firebase
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
        import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

        // --- FIREBASE SETUP ---
        const firebaseConfig = {
            apiKey: "AIzaSyAgOsKAZWwExUzupxSNytsfOo9BOppF0ng",
            authDomain: "jlvcpa-quizzes.firebaseapp.com",
            projectId: "jlvcpa-quizzes",
            storageBucket: "jlvcpa-quizzes.appspot.com",
            messagingSenderId: "629158256557",
            appId: "1:629158256557:web:b3d1a424b32e28cd578b24"
        };

        let db;
        try {
            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
        } catch (e) {
            console.error("Firebase Init Error:", e);
        }

        // --- AUTH STATE ---
        let currentUser = null; 
        
        // --- AUTH FUNCTIONS ---
        
        window.handleLogin = async () => {
            const idInput = document.getElementById('login-id').value.trim();
            const passInput = document.getElementById('login-pass').value.trim();
            const errorDiv = document.getElementById('login-error');
            const btn = document.getElementById('btn-login');
            const spinner = document.getElementById('login-spinner');

            if (!idInput || !passInput) {
                errorDiv.querySelector('span').textContent = "Please enter ID and Password";
                errorDiv.classList.remove('hidden');
                return;
            }

            // UI Loading State
            btn.disabled = true;
            btn.classList.add('opacity-75');
            spinner.classList.remove('hidden');
            errorDiv.classList.add('hidden');

            try {
                // Unified Login Logic: Check Students first, then Teachers if necessary
                let authenticatedUser = null;

                // 1. Attempt Student Login
                const studentQuery = query(collection(db, 'students'), where('Idnumber', "==", idInput));
                const studentSnapshot = await getDocs(studentQuery);

                if (!studentSnapshot.empty) {
                    studentSnapshot.forEach((doc) => {
                        const data = doc.data();
                        // Basic password check
                        if (String(data.passWord) === passInput) {
                            authenticatedUser = { role: 'student', ...data };
                        }
                    });
                }

                // 2. If not authenticated as student, Attempt Teacher Login
                // This covers cases where ID exists in 'students' but password didn't match,
                // or ID didn't exist in 'students' at all.
                if (!authenticatedUser) {
                    const teacherQuery = query(collection(db, 'teachers'), where('idNumber', "==", idInput));
                    const teacherSnapshot = await getDocs(teacherQuery);

                    if (!teacherSnapshot.empty) {
                        teacherSnapshot.forEach((doc) => {
                            const data = doc.data();
                            // Basic password check
                            if (String(data.passWord) === passInput) {
                                authenticatedUser = { role: 'teacher', ...data };
                            }
                        });
                    }
                }

                if (authenticatedUser) {
                    // Success
                    currentUser = authenticatedUser;
                    const role = currentUser.role;
                    
                    // Update UI
                    document.getElementById('login-screen').classList.add('hidden');
                    document.getElementById('app-content').classList.remove('hidden');
                    
                    // Display formatting differs by role
                    const name = role === 'teacher' 
                        ? `Teacher ${currentUser.firstName} ${currentUser.lastName}`
                        : `${currentUser.FirstName} ${currentUser.LastName}`;
                    
                    document.getElementById('user-display-name').textContent = name;

                    // Initialize App with Detected Role
                    initApp(role);

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
        };

        window.handleLogout = () => {
            currentUser = null;
            document.getElementById('app-content').classList.add('hidden');
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('login-id').value = '';
            document.getElementById('login-pass').value = '';
            // Reset Sidebar to prevent stale data
            document.getElementById('nav-container').innerHTML = '';
        };


        // --- DATA STRUCTURE ---
        
        function createPlaceholderDays(topics) {
            const days = topics.map((t, i) => ({
                day: `Day ${i + 1}`,
                topic: t,
                content: `
                    <h3 class="text-xl font-bold mb-4">Topic Focus</h3>
                    <p class="mb-4 text-gray-600">Content for <strong>${t}</strong> goes here. Edit the source code to update the lesson materials.</p>
                    <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p class="font-bold text-blue-900">Learning Goal</p>
                        <p class="text-blue-800">Define the specific learning objective for this day.</p>
                    </div>
                `,
                exercises: [
                    {
                        type: "mcq",
                        question: "Placeholder Question: Update this with a relevant question for the topic.",
                        options: ["Option A", "Option B", "Option C", "Option D"],
                        correctIndex: 0,
                        explanation: "Add explanation here."
                    }
                ]
            }));

            // Add Day 5 Quiz
            days.push({
                day: "Day 5",
                topic: "Recorded Summary Quiz",
                content: `
                    <h3 class="text-xl font-bold mb-4">Assessment Activity</h3>
                    <div class="space-y-4 text-gray-700">
                        <p><strong>Format:</strong> Short recorded quiz (video or audio submission).</p>
                        <p><strong>Content Coverage:</strong></p>
                        <ul class="list-disc pl-5">
                            <li>Review of concepts covered in Days 1-4</li>
                            <li>Practical application exercises</li>
                            <li>Oral explanation of key terms</li>
                        </ul>
                    </div>
                    <div class="mt-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p class="font-bold text-blue-900">Purpose</p>
                        <p class="text-blue-800">Reinforce weekly learning, check comprehension, and encourage students to articulate concepts clearly.</p>
                    </div>
                `,
                exercises: []
            });

            return days;
        }

        const courseData = {
            outline: {
                title: "Course Syllabus",
                summary: `
                    <div class="max-w-4xl mx-auto space-y-8 fade-in">
                        <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h3 class="text-2xl font-bold text-blue-900 mb-4">Course Description</h3>
                            <p class="text-gray-600 leading-relaxed">The course deals with the preparation and analysis of financial statements of a merchandising business and practice of simple taxation. It introduces the nature of accounting for corporations, focusing on the basic structure of equity and shareholder transactions. It also covers the principles of taxation and the preparation of basic income tax returns for individuals and corporations.</p>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                                <h4 class="font-bold text-blue-900 mb-2">Grading System</h4>
                                <ul class="space-y-2 text-sm text-blue-800">
                                    <li class="flex justify-between"><span>Written Work</span> <span class="font-bold">30%</span></li>
                                    <li class="flex justify-between"><span>Performance Tasks</span> <span class="font-bold">50%</span></li>
                                    <li class="flex justify-between"><span>Term Exams</span> <span class="font-bold">20%</span></li>
                                </ul>
                            </div>
                            <div class="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-600">
                                <h4 class="font-bold text-emerald-900 mb-2">Core Competencies</h4>
                                <ul class="list-disc list-inside text-sm text-emerald-800 space-y-1">
                                    <li>Merchandising Accounting Cycle</li>
                                    <li>Statement of Comprehensive Income</li>
                                    <li>Corporate Equity & Dividends</li>
                                    <li>Income Tax Returns (1701/1702)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `,
                full: `
                    <div class="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 fade-in prose prose-blue max-w-none">
                        <h2 class="text-2xl font-bold text-slate-800 mb-4">Fundamentals of Accountancy, Business, and Management 2 (FABM 2)</h2>
                        <p><strong>Grade Level:</strong> 12 | <strong>Strand:</strong> ABM | <strong>Prerequisite:</strong> FABM 1</p>
                        
                        <hr class="my-6">

                        <h3 class="text-xl font-bold text-slate-700 mt-6 mb-3">I. Course Description</h3>
                        <p class="text-gray-600">The course deals with the preparation and analysis of financial statements of a merchandising business and practice of simple taxation. It introduces the nature of accounting for corporations, focusing on the basic structure of equity and shareholder transactions. It also covers the principles of taxation and the preparation of basic income tax returns for individuals and corporations.</p>

                        <h3 class="text-xl font-bold text-slate-700 mt-8 mb-3">II. Course Learning Objectives</h3>
                        <ul class="list-disc pl-5 text-gray-600 space-y-1">
                            <li>Complete the accounting cycle for a service and merchandising business.</li>
                            <li>Prepare and analyze the Statement of Comprehensive Income for a merchandising business.</li>
                            <li>Understand the unique features of a Corporation and record basic equity transactions.</li>
                            <li>Comprehend the principles of taxation and prepare basic Income Tax Returns (BIR Forms 1701 and 1702).</li>
                        </ul>

                        <h3 class="text-xl font-bold text-slate-700 mt-8 mb-3">III. Detailed Learning Plan</h3>
                        <p class="italic text-gray-500">Refer to the weekly modules in the sidebar for daily breakdown.</p>
                    </div>
                `
            },
            terms: [
                {
                    title: "Term 1 (Midterm)",
                    units: [
                        {
                            id: "u1",
                            title: "Unit 1: Review of Accounting Cycle",
                            weeks: [
                                {
                                    id: "u1w1",
                                    title: "Week 1: Service Business Review",
                                    days: createPlaceholderDays([
                                        "The 10 Steps of Accounting Cycle",
                                        "Journalizing Transactions",
                                        "Posting & Trial Balance",
                                        "Adjusting Entries & Financial Statements"
                                    ])
                                }
                            ]
                        },
                        {
                            id: "u2",
                            title: "Unit 2: Merchandising Business",
                            weeks: [
                                { 
                                    id: "u2w1", 
                                    title: "Week 1: Intro to Merchandising", 
                                    days: [
                                        {
                                            day: "Day 1",
                                            topic: "Foundations of Merchandising",
                                            content: `
                                                <h3 class="text-xl font-bold mb-4">Topic Focus</h3>
                                                <ul class="list-disc pl-5 space-y-2 mb-6">
                                                    <li><strong>Definition:</strong> Merchandising businesses buy and sell goods without changing their form.</li>
                                                    <li><strong>Comparison:</strong> Service (sells time/skills) vs. Merchandising (sells tangible goods).</li>
                                                    <li><strong>Inventory:</strong> The lifeblood of merchandising; the primary asset for generating revenue.</li>
                                                    <li><strong>Flow:</strong> Purchase &rarr; Storage &rarr; Sale</li>
                                                </ul>
                                                <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                                    <p class="font-bold text-blue-900">Learning Goal</p>
                                                    <p class="text-blue-800">Students understand why inventory systems are critical in merchandising operations.</p>
                                                </div>
                                            `,
                                            exercises: [{ type: "mcq", question: "Primary source of revenue?", options: ["Service Fees", "Sales", "Interest", "Rent"], correctIndex: 1, explanation: "Merchandising = Sales of goods." }]
                                        },
                                        {
                                            day: "Day 2",
                                            topic: "The Periodic Inventory System",
                                            content: `<h3 class="text-xl font-bold mb-4">Topic Focus</h3><p>Mechanisms of periodic updates and physical counts.</p>`,
                                            exercises: [{ type: "mcq", question: "COGS is determined when?", options: ["Daily", "End of Period", "Never", "Hourly"], correctIndex: 1, explanation: "Periodic system updates at period end." }]
                                        },
                                        {
                                            day: "Day 3",
                                            topic: "The Perpetual Inventory System",
                                            content: `<h3 class="text-xl font-bold mb-4">Topic Focus</h3><p>Continuous updates and real-time tracking.</p>`,
                                            exercises: [{ type: "mcq", question: "Records COGS at time of sale?", options: ["Periodic", "Perpetual", "Both", "Neither"], correctIndex: 1, explanation: "Perpetual tracks cost immediately." }]
                                        },
                                        {
                                            day: "Day 4",
                                            topic: "Comparison & Applications",
                                            content: `<h3 class="text-xl font-bold mb-4">Topic Focus</h3><p>Choosing the right system for business size/type.</p>`,
                                            exercises: []
                                        },
                                        {
                                            day: "Day 5",
                                            topic: "Recorded Summary Quiz",
                                            content: `<h3 class="text-xl font-bold mb-4">Assessment Activity</h3><p>Video/Audio submission.</p>`,
                                            exercises: []
                                        }
                                    ]
                                },
                                {
                                    id: "u2w2",
                                    title: "Week 2: Purchases & Accounts",
                                    days: createPlaceholderDays([
                                        "Recording Purchases",
                                        "Purchase Discounts (2/10, n/30)",
                                        "Purchase Returns and Allowances",
                                        "Freight-In (FOB Destination/Shipping)"
                                    ])
                                },
                                { 
                                    id: "u2w3", title: "Week 3: Sales Transactions", 
                                    days: createPlaceholderDays(["Recording Sales", "Sales Discounts", "Sales Returns & Allowances", "Net Sales Calculation"]) 
                                },
                                { 
                                    id: "u2w4", title: "Week 4: COGS & Gross Profit", 
                                    days: createPlaceholderDays(["COGS Formula", "Beginning/Ending Inventory", "Gross Profit Calculation", "Shrinkage Adjustments"]) 
                                },
                                { 
                                    id: "u2w5", title: "Week 5: Operating Expenses", 
                                    days: createPlaceholderDays(["Selling Expenses", "Administrative Expenses", "Freight-Out", "Opex vs COGS"]) 
                                },
                                { 
                                    id: "u2w6", title: "Week 6: Income Statement", 
                                    days: createPlaceholderDays(["Single-step Format", "Multi-step Format Structure", "Analyzing Margins", "Statement Preparation"]) 
                                },
                                { 
                                    id: "u2w7", title: "Week 7: Performance Task", 
                                    days: createPlaceholderDays(["Case Study Intro", "Transaction Recording", "Financial Statement Gen", "Final Review"]) 
                                }
                            ]
                        }
                    ]
                },
                {
                    title: "Term 2 (Final Term)",
                    units: [
                        {
                            id: "u3",
                            title: "Unit 3: Corporation Accounting",
                            weeks: [
                                {
                                    id: "u3w8",
                                    title: "Week 8: Intro to Corps & Equity",
                                    days: createPlaceholderDays([
                                        "Nature of Corporations",
                                        "Classes of Shares (Common/Preferred)",
                                        "Par vs No-Par Value",
                                        "Issuance of Share Capital"
                                    ])
                                },
                                { 
                                    id: "u3w9", title: "Week 9: Dividends & RE", 
                                    days: createPlaceholderDays(["Dividend Dates", "Cash Dividends", "Stock Dividends", "Retained Earnings"]) 
                                },
                                { 
                                    id: "u3w10", title: "Week 10: Formation & Legal", 
                                    days: createPlaceholderDays(["Incorporation Process", "Articles of Incorporation", "By-Laws", "SEC Requirements"]) 
                                },
                                { 
                                    id: "u3w11", title: "Week 11: Early Operations", 
                                    days: createPlaceholderDays(["Initial Contributions", "Corporate Books", "Equity Section Presentation", "Statement of Changes in Equity"]) 
                                }
                            ]
                        },
                        {
                            id: "u4",
                            title: "Unit 4: Income Taxation",
                            weeks: [
                                { 
                                    id: "u4w12", title: "Week 12: Foundations of Tax", 
                                    days: createPlaceholderDays(["Purpose of Taxation", "Principles of Sound Tax System", "Direct vs Indirect Taxes", "Taxpayer Classification"]) 
                                },
                                {
                                    id: "u4w13",
                                    title: "Week 13: Computation & Compliance",
                                    days: createPlaceholderDays([
                                        "Gross Income & Exclusions",
                                        "Allowable Deductions",
                                        "Individual Tax Computation",
                                        "Corporate Tax Overview"
                                    ])
                                },
                                { 
                                    id: "u4w14", title: "Week 14: Tax Returns (Forms)", 
                                    days: createPlaceholderDays(["BIR Forms Overview", "Form 1701 Walkthrough", "Form 1702 Walkthrough", "Filing & Payment Deadlines"]) 
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        // --- CALENDAR STATE MANAGEMENT ---
        let calendarAssignments = JSON.parse(localStorage.getItem('fabm2_calendar')) || {};
        let flatTopics = []; 
        let currentCalendarYear, currentCalendarMonth;

        // --- DOM ELEMENTS ---
        const navContainer = document.getElementById('nav-container');
        const contentArea = document.getElementById('content-area');
        const pageTitle = document.getElementById('page-title');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const hoverMenu = document.getElementById('hover-menu');

        let hoverTimeout;

        // --- RENDER FUNCTIONS ---

        function initApp(role) {
            setPhilippineTimeDefaults();
            generateFlatTopics();
            renderSidebar(role);
            renderLandingPage(); 
            setupMobileMenu();
            setupHoverMenuEvents();
            setupDesktopSidebarToggle();
        }

        // --- DESKTOP SIDEBAR TOGGLE ---
        function setupDesktopSidebarToggle() {
            const toggleBtn = document.getElementById('desktop-sidebar-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => {
                    const sb = document.getElementById('sidebar');
                    // Toggle the 'collapsed' class which controls width and visibility of details
                    sb.classList.toggle('collapsed');
                });
            }
        }

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

        function renderSidebar(role) {
            navContainer.innerHTML = ''; 

            const outlineBtn = document.createElement('button');
            outlineBtn.className = "w-full text-left px-6 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-l-4 border-transparent hover:border-blue-500 focus:outline-none whitespace-nowrap overflow-hidden";
            outlineBtn.innerHTML = '<i class="fas fa-home w-6"></i> <span class="sidebar-text-detail">Course Outline</span>';
            outlineBtn.onclick = () => {
                renderLandingPage();
                closeMobileSidebar();
            };
            navContainer.appendChild(outlineBtn);

            // Show Calendar ONLY for teachers
            if (role === 'teacher') {
                const calendarBtn = document.createElement('button');
                calendarBtn.className = "w-full text-left px-6 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-l-4 border-transparent hover:border-purple-500 focus:outline-none whitespace-nowrap overflow-hidden";
                calendarBtn.innerHTML = '<i class="fas fa-calendar-alt w-6"></i> <span class="sidebar-text-detail">Course Schedule</span>';
                calendarBtn.onclick = () => {
                    renderCalendarPage();
                    closeMobileSidebar();
                };
                navContainer.appendChild(calendarBtn);
            }

            courseData.terms.forEach(term => {
                const termHeader = document.createElement('div');
                termHeader.className = "px-6 py-2 mt-4 text-xs font-bold text-slate-500 uppercase tracking-wider sidebar-text-detail whitespace-nowrap overflow-hidden";
                termHeader.textContent = term.title;
                navContainer.appendChild(termHeader);

                term.units.forEach(unit => {
                    // Split Title for Sidebar: "Unit 1: Review..." -> "Unit 1" and ": Review..."
                    const unitParts = unit.title.split(':');
                    const unitPrefix = unitParts[0];
                    const unitSuffix = unitParts.slice(1).join(':');

                    const unitBtn = document.createElement('button');
                    unitBtn.className = "w-full text-left px-6 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex justify-between items-center group whitespace-nowrap overflow-hidden";
                    // Using a div for the text allows truncation, but we remove padding-right in collapsed mode via CSS
                    unitBtn.innerHTML = `
                        <div class="truncate pr-2">
                            <span class="font-bold text-sm">${unitPrefix}</span>
                            <span class="font-medium text-sm sidebar-text-detail">:${unitSuffix}</span>
                        </div>
                        <i class="fas fa-chevron-down text-xs transform transition-transform duration-300 group-hover:text-blue-400"></i>
                    `;
                    
                    const submenu = document.createElement('div');
                    submenu.className = "submenu bg-slate-950";
                    
                    unitBtn.onclick = () => {
                        const icon = unitBtn.querySelector('.fa-chevron-down');
                        if (submenu.classList.contains('open')) {
                            submenu.classList.remove('open');
                            icon.classList.remove('rotate-180');
                        } else {
                            document.querySelectorAll('.submenu').forEach(el => {
                                el.classList.remove('open');
                                el.previousElementSibling.querySelector('.fa-chevron-down')?.classList.remove('rotate-180');
                            });
                            submenu.classList.add('open');
                            icon.classList.add('rotate-180');
                        }
                    };

                    unit.weeks.forEach(week => {
                        // Split Title for Week
                        const weekParts = week.title.split(':');
                        const weekPrefix = weekParts[0];
                        const weekSuffix = weekParts.slice(1).join(':');

                        const weekLink = document.createElement('button');
                        weekLink.className = "w-full text-left pl-10 pr-6 py-2 text-sm text-slate-400 hover:text-blue-300 hover:bg-slate-900 transition-colors border-l-2 border-transparent hover:border-blue-500 relative whitespace-nowrap overflow-hidden";
                        weekLink.innerHTML = `
                            <span>${weekPrefix}</span>
                            <span class="sidebar-text-detail">:${weekSuffix}</span>
                        `;
                        
                        weekLink.onclick = () => {
                            renderDayContent(unit, week, 0); 
                            closeMobileSidebar();
                            highlightActiveLink(weekLink);
                        };

                        weekLink.addEventListener('mouseenter', (e) => showHoverMenu(e, unit, week));
                        weekLink.addEventListener('mouseleave', () => hideHoverMenu());

                        submenu.appendChild(weekLink);
                    });

                    navContainer.appendChild(unitBtn);
                    navContainer.appendChild(submenu);
                });
            });
        }

        // --- LANDING PAGE (TABBED) ---
        function renderLandingPage() {
            pageTitle.innerText = "Course Outline";
            contentArea.innerHTML = '';

            const container = document.createElement('div');
            container.className = "max-w-4xl mx-auto pb-12";

            // Tabs Header
            const tabsContainer = document.createElement('div');
            tabsContainer.className = "flex border-b border-gray-200 mb-6 bg-white rounded-t-lg shadow-sm";
            tabsContainer.innerHTML = `
                <button onclick="switchLandingTab('summary')" id="tab-landing-summary" class="flex-1 py-4 text-center text-sm font-semibold transition-colors tab-active rounded-tl-lg">
                    <i class="fas fa-list-alt mr-2"></i>Summary
                </button>
                <button onclick="switchLandingTab('full')" id="tab-landing-full" class="flex-1 py-4 text-center text-sm font-semibold transition-colors tab-inactive rounded-tr-lg">
                    <i class="fas fa-file-alt mr-2"></i>Full Course Outline
                </button>
            `;
            container.appendChild(tabsContainer);

            // Summary Content
            const summaryDiv = document.createElement('div');
            summaryDiv.id = "content-landing-summary";
            summaryDiv.innerHTML = courseData.outline.summary;
            container.appendChild(summaryDiv);

            // Full Outline Content
            const fullDiv = document.createElement('div');
            fullDiv.id = "content-landing-full";
            fullDiv.className = "hidden";
            fullDiv.innerHTML = courseData.outline.full;
            container.appendChild(fullDiv);

            contentArea.appendChild(container);
        }

        window.switchLandingTab = (tabName) => {
            const summaryBtn = document.getElementById('tab-landing-summary');
            const fullBtn = document.getElementById('tab-landing-full');
            const summaryContent = document.getElementById('content-landing-summary');
            const fullContent = document.getElementById('content-landing-full');

            if (tabName === 'summary') {
                summaryBtn.className = summaryBtn.className.replace('tab-inactive', 'tab-active');
                fullBtn.className = fullBtn.className.replace('tab-active', 'tab-inactive');
                
                summaryContent.classList.remove('hidden');
                summaryContent.classList.add('fade-in');
                fullContent.classList.add('hidden');
            } else {
                fullBtn.className = fullBtn.className.replace('tab-inactive', 'tab-active');
                summaryBtn.className = summaryBtn.className.replace('tab-active', 'tab-inactive');
                
                fullContent.classList.remove('hidden');
                fullContent.classList.add('fade-in');
                summaryContent.classList.add('hidden');
            }
        };


        // --- REST OF APP LOGIC (Calendar, Day Content, etc.) ---
        
        function showHoverMenu(e, unit, week) {
            clearTimeout(hoverTimeout);
            if(!week.days || week.days.length === 0) {
                hoverMenu.classList.add('hidden');
                return;
            }
            hoverMenu.innerHTML = '';
            const header = document.createElement('div');
            header.className = "px-4 py-2 bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase";
            header.innerText = "Jump to Day";
            hoverMenu.appendChild(header);

            week.days.forEach((day, index) => {
                const dayBtn = document.createElement('button');
                dayBtn.className = "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors";
                dayBtn.innerHTML = `<span class="font-bold text-xs mr-1">${day.day}:</span> ${day.topic}`;
                dayBtn.onclick = () => {
                    renderDayContent(unit, week, index);
                    hoverMenu.classList.add('hidden');
                    closeMobileSidebar();
                };
                hoverMenu.appendChild(dayBtn);
            });

            const rect = e.target.getBoundingClientRect();
            hoverMenu.style.top = `${rect.top}px`;
            hoverMenu.style.left = `${rect.right}px`;
            hoverMenu.classList.remove('hidden');
        }

        function hideHoverMenu() {
            hoverTimeout = setTimeout(() => {
                hoverMenu.classList.add('hidden');
            }, 200);
        }

        function setupHoverMenuEvents() {
            hoverMenu.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
            hoverMenu.addEventListener('mouseleave', () => hideHoverMenu());
        }

        function highlightActiveLink(activeLink) {
            document.querySelectorAll('.submenu button').forEach(b => b.classList.remove('text-blue-300', 'bg-slate-900', 'border-blue-500'));
            activeLink.classList.add('text-blue-300', 'bg-slate-900', 'border-blue-500');
        }

        function renderCalendarPage() {
            pageTitle.innerText = "Course Schedule Settings";
            contentArea.innerHTML = '';

            const container = document.createElement('div');
            container.className = "max-w-4xl mx-auto pb-12 fade-in relative";

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
            yearSelect.onchange = (e) => {
                currentCalendarYear = parseInt(e.target.value);
                renderMonthView(calendarContainer);
            };

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
            monthSelect.onchange = (e) => {
                currentCalendarMonth = parseInt(e.target.value);
                renderMonthView(calendarContainer);
            };

            controls.appendChild(yearSelect);
            controls.appendChild(monthSelect);
            container.appendChild(controls);

            const calendarContainer = document.createElement('div');
            renderMonthView(calendarContainer); 
            container.appendChild(calendarContainer);

            contentArea.appendChild(container);
            
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

        window.updateSchedule = (dateStr, topicId) => {
            if (topicId === "") {
                delete calendarAssignments[dateStr];
            } else {
                calendarAssignments[dateStr] = topicId;
            }
            localStorage.setItem('fabm2_calendar', JSON.stringify(calendarAssignments));
            
            const select = document.getElementById(`sel-${dateStr}`);
            if (topicId) {
                select.classList.add('border-purple-300', 'bg-purple-50', 'text-purple-900', 'font-medium');
                select.classList.remove('text-gray-500');
            } else {
                select.classList.remove('border-purple-300', 'bg-purple-50', 'text-purple-900', 'font-medium');
                select.classList.add('text-gray-500');
            }
        };

        function getDateForTopic(unitId, weekId, dayIndex) {
            const topicKey = `${unitId}|${weekId}|${dayIndex}`;
            const dates = [];

            // 1. Find all matching dates
            for (const [date, assignedTopic] of Object.entries(calendarAssignments)) {
                if (assignedTopic === topicKey) {
                    dates.push(date);
                }
            }

            if (dates.length === 0) return null;

            // 2. Sort dates
            dates.sort();

            // 3. Format into ranges
            return formatRanges(dates);
        }

        function formatRanges(dates) {
            if (dates.length === 0) return "";

            // Convert to Date objects for math
            const dateObjs = dates.map(d => {
                const [y, m, da] = d.split('-').map(Number);
                return new Date(y, m - 1, da);
            });

            const ranges = [];
            let start = dateObjs[0];
            let end = dateObjs[0];

            for (let i = 1; i < dateObjs.length; i++) {
                const current = dateObjs[i];
                const diffTime = Math.abs(current - end);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                if (diffDays === 1) {
                    end = current;
                } else {
                    ranges.push(formatRange(start, end));
                    start = current;
                    end = current;
                }
            }
            ranges.push(formatRange(start, end));

            return ranges.join(', ');
        }

        function formatRange(start, end) {
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            const startStr = start.toLocaleDateString('default', options);
            
            if (start.getTime() === end.getTime()) {
                return startStr;
            } else {
                // Check if same month and year for cleaner display: "Dec 9 - 10, 2025"
                if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
                    return `${start.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${end.getDate()}, ${end.getFullYear()}`;
                }
                return `${startStr} - ${end.toLocaleDateString('default', options)}`;
            }
        }

        function renderDayContent(unit, week, dayIndex) {
            pageTitle.innerText = `${unit.title} - ${week.title}`;
            contentArea.innerHTML = ''; 

            const container = document.createElement('div');
            container.className = "max-w-4xl mx-auto pb-12 h-full flex flex-col";

            const scheduledDateStr = getDateForTopic(unit.id, week.id, dayIndex);
            
            // Allow wrapping for long date lists
            const dateBadge = scheduledDateStr 
                ? `<div class="ml-auto bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-lg border border-purple-200 shadow-sm text-right max-w-xs"><i class="far fa-calendar-check mr-2"></i>Scheduled: <br>${scheduledDateStr}</div>`
                : `<div class="ml-auto text-gray-400 text-xs italic"><i class="far fa-calendar mr-1"></i>Not scheduled</div>`;

            const header = document.createElement('div');
            header.className = "mb-4 fade-in flex items-start justify-between"; // Changed to items-start for multiline badges
            header.innerHTML = `
                <div class="flex items-center text-sm text-gray-500 space-x-2 mt-1">
                    <span>${unit.title}</span>
                    <i class="fas fa-chevron-right text-xs"></i>
                    <span>${week.title}</span>
                </div>
                ${dateBadge}
            `;
            container.appendChild(header);

            if (!week.days || week.days.length === 0) {
                container.innerHTML += `<div class="p-8 text-center text-gray-400 bg-white rounded-lg border border-dashed border-gray-300">Content for this week is being updated. Check back soon.</div>`;
                contentArea.appendChild(container);
                return;
            }

            const day = week.days[dayIndex];

            const card = document.createElement('div');
            card.className = "bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden fade-in";

            card.innerHTML = `
                <div class="bg-gray-50 px-8 py-6 border-b border-gray-100">
                    <span class="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase mb-2">${day.day}</span>
                    <h1 class="text-2xl font-bold text-slate-800">${day.topic}</h1>
                </div>
            `;

            const tabsNav = document.createElement('div');
            tabsNav.className = "flex border-b border-gray-200";
            tabsNav.innerHTML = `
                <button onclick="switchTab('concepts')" id="tab-btn-concepts" class="flex-1 py-4 text-center text-sm font-semibold transition-colors tab-active">
                    <i class="fas fa-book-reader mr-2"></i>Topic & Concepts
                </button>
                <button onclick="switchTab('practice')" id="tab-btn-practice" class="flex-1 py-4 text-center text-sm font-semibold transition-colors tab-inactive">
                    <i class="fas fa-pencil-alt mr-2"></i>Practice Questions
                </button>
            `;
            card.appendChild(tabsNav);

            const tabContentWrapper = document.createElement('div');
            tabContentWrapper.className = "p-8 flex-1 overflow-y-auto";

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
                practiceDiv.innerHTML = `
                    <div class="text-center py-12">
                        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <i class="fas fa-check-circle text-gray-300 text-2xl"></i>
                        </div>
                        <p class="text-gray-500">No practice questions available for this day.</p>
                    </div>
                `;
            }
            tabContentWrapper.appendChild(practiceDiv);

            card.appendChild(tabContentWrapper);
            container.appendChild(card);

            const navFooter = document.createElement('div');
            navFooter.className = "mt-6 flex justify-between items-center fade-in";
            
            if (dayIndex > 0) {
                const prevBtn = document.createElement('button');
                prevBtn.className = "px-4 py-2 bg-white text-slate-600 rounded shadow-sm border border-gray-200 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center";
                prevBtn.innerHTML = `<i class="fas fa-arrow-left mr-2"></i> Previous Day`;
                prevBtn.onclick = () => renderDayContent(unit, week, dayIndex - 1);
                navFooter.appendChild(prevBtn);
            } else {
                navFooter.appendChild(document.createElement('div')); 
            }

            if (dayIndex < week.days.length - 1) {
                const nextBtn = document.createElement('button');
                nextBtn.className = "px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 transition-colors flex items-center";
                nextBtn.innerHTML = `Next Day <i class="fas fa-arrow-right ml-2"></i>`;
                nextBtn.onclick = () => renderDayContent(unit, week, dayIndex + 1);
                navFooter.appendChild(nextBtn);
            } else {
                navFooter.appendChild(document.createElement('div')); 
            }

            container.appendChild(navFooter);
            contentArea.appendChild(container);
        }

        // --- ADDED MISSING FUNCTION ---
        window.switchTab = (tabName) => {
            const conceptsBtn = document.getElementById('tab-btn-concepts');
            const practiceBtn = document.getElementById('tab-btn-practice');
            const conceptsContent = document.getElementById('tab-content-concepts');
            const practiceContent = document.getElementById('tab-content-practice');

            if (tabName === 'concepts') {
                conceptsBtn.className = conceptsBtn.className.replace('tab-inactive', 'tab-active');
                practiceBtn.className = practiceBtn.className.replace('tab-active', 'tab-inactive');
                
                conceptsContent.classList.remove('hidden');
                conceptsContent.classList.add('fade-in');
                practiceContent.classList.add('hidden');
            } else {
                practiceBtn.className = practiceBtn.className.replace('tab-inactive', 'tab-active');
                conceptsBtn.className = conceptsBtn.className.replace('tab-active', 'tab-inactive');
                
                practiceContent.classList.remove('hidden');
                practiceContent.classList.add('fade-in');
                conceptsContent.classList.add('hidden');
            }
        };

        function renderExercises(exercises, dayIndex) {
            return exercises.map((ex, i) => {
                const exId = `ex-${dayIndex}-${i}`;
                
                if (ex.type === 'mcq') {
                    const optionsHtml = ex.options.map((opt, optIndex) => `
                        <label class="flex items-start p-3 rounded border border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors bg-white">
                            <input type="radio" name="${exId}" value="${optIndex}" class="mt-1 mr-3 text-blue-600 focus:ring-blue-500" onchange="enableShowAnswer('${exId}')">
                            <span class="text-sm text-gray-700">${opt}</span>
                        </label>
                    `).join('');

                    return `
                        <div class="bg-slate-50 p-6 rounded-lg border border-slate-100">
                            <p class="font-semibold text-gray-800 mb-4 text-base"><span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs mr-2">Question ${i+1}</span>${ex.question}</p>
                            <div class="space-y-3 mb-4">${optionsHtml}</div>
                            
                            <div class="flex items-center gap-3">
                                <button id="btn-${exId}" class="hidden px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-all shadow-sm" onclick="toggleAnswer('${exId}')">Check Answer</button>
                            </div>

                            <div id="ans-${exId}" class="hidden mt-4 p-4 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                                <p class="font-bold mb-1"><i class="fas fa-check-circle mr-1"></i> Correct Answer: ${ex.options[ex.correctIndex]}</p>
                                <p>${ex.explanation}</p>
                            </div>
                        </div>
                    `;
                } else if (ex.type === 'problem') {
                    return `
                        <div class="bg-slate-50 p-6 rounded-lg border border-slate-100">
                            <p class="font-semibold text-gray-800 mb-4 text-base"><span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs mr-2">Problem ${i+1}</span>${ex.question}</p>
                            
                            <textarea id="input-${exId}" class="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white" rows="4" placeholder="Type your solution here..." oninput="checkInputLength('${exId}')"></textarea>
                            
                            <div class="mt-4">
                                <button id="btn-${exId}" class="hidden px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-all shadow-sm" onclick="toggleAnswer('${exId}')">Show Answer Key</button>
                            </div>

                            <div id="ans-${exId}" class="hidden mt-4 p-4 bg-green-50 border border-green-200 rounded text-sm text-green-800 font-mono whitespace-pre-wrap">
<strong><i class="fas fa-key mr-1"></i> Answer Key:</strong>
${ex.answer}

<strong><i class="fas fa-info-circle mr-1"></i> Explanation:</strong>
${ex.explanation}
                            </div>
                        </div>
                    `;
                }
            }).join('');
        }

        window.enableShowAnswer = (id) => {
            const btn = document.getElementById(`btn-${id}`);
            if (btn) {
                btn.classList.remove('hidden');
                btn.classList.add('fade-in');
            }
        };

        window.checkInputLength = (id) => {
            const input = document.getElementById(`input-${id}`);
            const btn = document.getElementById(`btn-${id}`);
            if (input.value.trim().length > 0) {
                btn.classList.remove('hidden');
                btn.classList.add('fade-in');
            } else {
                btn.classList.add('hidden');
            }
        };

        window.toggleAnswer = (id) => {
            const ans = document.getElementById(`ans-${id}`);
            const btn = document.getElementById(`btn-${id}`);
            
            if (ans.classList.contains('hidden')) {
                ans.classList.remove('hidden');
                ans.classList.add('fade-in');
                btn.textContent = "Hide Answer";
                btn.classList.replace('bg-blue-600', 'bg-gray-500');
                btn.classList.replace('hover:bg-blue-700', 'hover:bg-gray-600');
            } else {
                ans.classList.add('hidden');
                btn.textContent = "Show Answer"; 
                btn.classList.replace('bg-gray-500', 'bg-blue-600');
                btn.classList.replace('hover:bg-gray-600', 'hover:bg-blue-700');
            }
        };

        function setupMobileMenu() {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.remove('-translate-x-full');
                sidebarOverlay.classList.remove('hidden');
            });

            sidebarOverlay.addEventListener('click', closeMobileSidebar);
        }

        function closeMobileSidebar() {
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
        }

        function attachExerciseListeners() {
        }

        // Initialize App is triggered after login now
        // init(); 

    </script>
</body>
</html>
