        // Content for Unit 1: Review of Accounting Cycle
// Covers the 10 Steps for a Sole Proprietorship Service Business

export const unit1Data = {
    week1: [
        {
            day: "Day 1",
            topic: "Review: The Recording Phase (Steps 1–5)",
            content: `
                <div class="space-y-8 animate-fade-in">
                    <div class="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-500 shadow-sm">
                        <h3 class="text-lg font-bold text-indigo-900 mb-2">Phase Overview</h3>
                        <p class="text-indigo-800">Focus: Capturing economic events, analyzing necessary changes, and drafting the preliminary results on a worksheet.</p>
                        
                    </div>

                    <!-- STEP 1 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 1: Analyze Business Transactions</h3>
                        <p class="mb-4 text-gray-600">Financial accounting begins with identifying economic events. Only transactions measurable in monetary terms affecting financial position are recorded. This relies on <strong>source documents</strong> (invoices, receipts) as objective evidence.</p>
                        
                            <div class="mb-6">
                              <h4 class="font-bold text-slate-700 mb-2">The Accounting Equation</h4>
                                  <p class="text-sm text-gray-600 mb-2">
                                    <strong>Assets = Liabilities + Equity</strong>. Every transaction must keep this in balance.
                                  </p>

                      <!-- Accounting Equation Visual (Balance Scale) -->
                          <div class="img-box" 
                               style="width: 100%; max-width: 450px; margin: 10px auto; display: flex; justify-content: center;">
                                <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
                          <!-- Background -->
                              <rect width="400" height="220" fill="#f8fafc" rx="8" />

                      <!-- SCALE STRUCTURE -->
                      <!-- Base -->
                          <path d="M170 190 L230 190 L200 140 Z" fill="#64748b" />
                          <rect x="140" y="190" width="120" height="10" rx="3" fill="#475569" />
                      <!-- Beam -->
                          <rect x="40" y="135" width="320" height="8" rx="4" fill="#94a3b8" />
                      <!-- Center Pivot Circle -->
                          <circle cx="200" cy="140" r="6" fill="#cbd5e0" />

                      <!-- LEFT SIDE: ASSETS (Blue) -->
                           <g transform="translate(60, 60)">
                            <line x1="50" y1="0" x2="50" y2="75" stroke="#cbd5e0" stroke-width="2" />
                            <rect x="0" y="25" width="100" height="80" rx="4" fill="#0038a8" />
                            <text x="50" y="65" font-family="Arial, sans-serif" font-weight="bold" font-size="14" text-anchor="middle" fill="#ffffff">ASSETS</text>
                            <text x="50" y="80" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#bfdbfe">Use of Funds</text>
                          </g>

                      <!-- RIGHT SIDE: LIABILITIES & EQUITY -->
                          <g transform="translate(240, 60)">
                            <line x1="50" y1="0" x2="50" y2="75" stroke="#cbd5e0" stroke-width="2" />
                            <rect x="0" y="25" width="100" height="38" rx="2" fill="#ce1126" />
                            <text x="50" y="48" font-family="Arial, sans-serif" font-weight="bold" font-size="11" text-anchor="middle" fill="#ffffff">LIABILITIES</text>
                            <rect x="0" y="67" width="100" height="38" rx="2" fill="#fbbf24" />
                            <text x="50" y="90" font-family="Arial, sans-serif" font-weight="bold" font-size="11" text-anchor="middle" fill="#78350f">EQUITY</text>

                        <!-- Bracket Label -->
                            <text x="110" y="70" font-family="Arial, sans-serif" font-size="10" fill="#64748b" font-style="italic">
                              <tspan x="110" dy="0">Source</tspan>
                              <tspan x="110" dy="12">of Funds</tspan>
                            </text>
                            <path d="M105 30 L108 30 L108 100 L105 100" fill="none" stroke="#94a3b8" stroke-width="1"/>
                          </g>

                      <!-- VISUAL EQUAL SIGN -->
                         <g transform="translate(200, 90)">
                        <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#cbd5e0" stroke-width="2"/>
                        <text x="0" y="6" font-family="Arial, sans-serif" font-weight="bold" font-size="22" text-anchor="middle" fill="#334155">=</text>
                      </g>
                    </svg>
                  </div>
                </div>

                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-bold text-blue-800 text-sm uppercase mb-2"><i class="fas fa-list-ol mr-2"></i>Step-by-Step Guide</h4>
                            <ul class="space-y-1 text-sm text-blue-900 list-disc list-inside">
                                <li><strong>Gather Source Documents:</strong> Collect receipts, invoices, checks.</li>
                                <li><strong>Identify Accounts:</strong> Ask "What did we get? What did we give up?"</li>
                                <li><strong>Classify Accounts:</strong> Asset, Liability, Equity, Revenue, or Expense?</li>
                                <li><strong>Determine Direction:</strong> Increase or Decrease?</li>
                                <li><strong>Apply Rules:</strong> Use Normal Balance rules (e.g., Asset Increase = Debit).</li>
                            </ul>
                        </div>
                    </section>

                    <!-- STEP 2 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 2: Journalize Transactions</h3>
                        <p class="mb-4 text-gray-600">
                          Journalizing transactions involves recording business activities in the <strong>General Journal</strong>, also called the Book of Original Entry. Each entry is written in chronological order to show the sequence of events. The process follows the <strong>Double-Entry System</strong>, where every debit has a corresponding credit. This ensures that the accounting equation remains balanced at all times. Journalizing provides a detailed foundation for posting to the ledger and preparing accurate financial statements.
                        </p>

                       <div class="img-box" style="display: flex; justify-content: center; width: 100%; margin: 20px 0;">
                            <svg viewBox="0 0 500 230" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width: 600px;">
                                <!-- Background: Ledger Paper -->
                                <rect width="500" height="230" fill="#ffffff" stroke="#cbd5e0" stroke-width="1" />
                                <rect x="0" y="0" width="500" height="40" fill="#0038a8" /> <!-- Header Bar -->
        
                                <!-- Header Text -->
                                    <text x="250" y="25" font-family="Arial, sans-serif" font-weight="bold" font-size="16" text-anchor="middle" fill="#ffffff">GENERAL JOURNAL</text>
                                    <text x="480" y="25" font-family="Arial, sans-serif" font-weight="bold" font-size="10" text-anchor="end" fill="#bfdbfe">Page 1</text>

                                <!-- Column Headers -->
                                    <g transform="translate(0, 40)">
                                <!-- Background strip for columns -->
                                    <rect width="500" height="25" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.5"/>
            
                                <!-- Vertical Dividers (Extended to y2=180 to cover 5 rows + header) -->
                                     <line x1="60" y1="0" x2="60" y2="180" stroke="#94a3b8" stroke-width="0.5" /> <!-- Date end -->
                                    <line x1="300" y1="0" x2="300" y2="180" stroke="#94a3b8" stroke-width="0.5" /> <!-- Title end -->
                                    <line x1="340" y1="0" x2="340" y2="180" stroke="#94a3b8" stroke-width="0.5" /> <!-- PR end -->
                                    <line x1="420" y1="0" x2="420" y2="180" stroke="#94a3b8" stroke-width="0.5" /> <!-- Debit end -->
            
                                <!-- Labels -->
                                    <text x="30" y="17" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="#334155">DATE</text>
                                    <text x="180" y="17" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="#334155">ACCOUNT TITLE & EXPLANATION</text>
                                    <text x="320" y="17" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="#334155">PR</text>
                                    <text x="380" y="17" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="#334155">DEBIT</text>
                                    <text x="460" y="17" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="#334155">CREDIT</text>
                                    </g>

                            <!-- Journal Entry Rows -->
                                 <g transform="translate(0, 65)" font-family="Courier New, monospace" font-size="12" fill="#1e293b">
                            <!-- Row 1: Year Only -->
                                <text x="30" y="20" text-anchor="middle" font-weight="bold" font-size="11">2023</text>

                            <!-- Row 2: Date and Debit Entry -->
                                <text x="30" y="50" text-anchor="middle" font-weight="bold">Dec 1</text>
                                <text x="70" y="50" font-weight="bold">Cash</text>
                                <text x="410" y="50" text-anchor="end">₱ 100,000</text>
            
                            <!-- Row 3: Credit Entry (Indented) -->
                                <text x="90" y="80" font-weight="bold">Juan, Capital</text> 
                                <text x="490" y="80" text-anchor="end">₱ 100,000</text>
            
                            <!-- Row 4: Explanation (Indented 3 spaces more than Credit) -->
                                <text x="115" y="110" font-style="italic" fill="#64748b" font-family="Arial, sans-serif" font-size="10">(To record initial investment)</text>
            
                            <!-- Row 5: Empty Row (just lines) -->
                                </g>

                            <!-- Horizontal Lines (Notebook style) -->
                                <g stroke="#cbd5e0" stroke-width="0.5" stroke-dasharray="2,2" transform="translate(0, 65)">
                                <line x1="0" y1="30" x2="500" y2="30" />  <!-- End of Row 1 (Year) -->
                                <line x1="0" y1="60" x2="500" y2="60" />  <!-- End of Row 2 (Debit) -->
                                <line x1="0" y1="90" x2="500" y2="90" />  <!-- End of Row 3 (Credit) -->
                                <line x1="0" y1="120" x2="500" y2="120" /> <!-- End of Row 4 (Explanation) -->
                                <line x1="0" y1="150" x2="500" y2="150" /> <!-- End of Row 5 (Empty) -->
                                </g>
        
                            <!-- Bottom Border Accent (Visual closure) -->
                                <rect x="0" y="225" width="500" height="5" fill="#f1f5f9" />
                            </svg>
                        </div>


                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                            <div class="bg-yellow-50 p-3 rounded border border-yellow-200">
                              <span class="font-bold text-yellow-800 block mb-1">Formatting Rules</span>
                              <ul class="list-disc list-inside text-sm text-yellow-900 space-y-1">
                                <li>Debits are listed first, left aligned.</li>
                                <li>Credits are listed below debits and <strong>indented</strong> to the right.</li>
                                <li>Each entry must include a clear <strong>date</strong> at the top.</li>
                                <li>Provide a brief <strong>description</strong> or explanation under the entry.</li>
                                <li>Ensure amounts are properly aligned under their respective Debit or Credit columns for clarity.</li>
                                <li>Total debits must always equal total credits.</li>
                              </ul>
                            </div>
                            <div class="bg-yellow-50 p-3 rounded border border-yellow-200">
                                  <span class="font-bold text-yellow-800 block mb-1">Compound Entry</span>
                                  <ul class="list-disc list-inside text-sm text-yellow-900 space-y-1">
                                  <li>Affects three or more accounts in one transaction.</li>
                                  <li>May include multiple debits and/or multiple credits.</li>
                                  <li>Total debits must equal total credits for balance.</li>
                                  <li>Used to record complex transactions (e.g., payroll, asset purchase with financing).</li>
                                <li>Provides a single, organized record instead of separate simple entries.</li>
                              </ul>
                            </div>
                        </div>
                    </section>

                    <!-- STEP 3 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 3: Post to the Ledger</h3>
    <!-- Expanded 5-Sentence Paragraph -->
    <p class="mb-4 text-gray-600">
        Posting is the official process of transferring transaction data from the General Journal to the individual accounts in the General Ledger. While the journal records financial events chronologically as they happen, the ledger reorganizes this information topically to track the history of specific items. This step is essential because it updates the running balances of accounts like Cash, Accounts Receivable, and Accounts Payable. The General Ledger is often referred to as the "Book of Final Entry" because it serves as the final destination for transaction details before financial statements are prepared. Ultimately, accurate posting provides the summarized data needed to prove the equality of debits and credits in the trial balance.
    </p>

    <!-- Visual Representation of Posting Process (Journal to Standard Ledger) -->
    <div class="img-box" style="display: flex; justify-content: center; width: 100%; margin: 20px 0;">
        <svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width: 700px;">
            <!-- Background -->
            <rect width="700" height="380" fill="#f8fafc" rx="8" />

            <!-- ================= SOURCE: GENERAL JOURNAL (Top) ================= -->
            <g transform="translate(50, 20)">
                <!-- Journal Paper -->
                <rect x="0" y="0" width="600" height="90" fill="#ffffff" stroke="#cbd5e0" stroke-width="1" />
                <rect x="0" y="0" width="600" height="25" fill="#1e293b" /> <!-- Header Bar -->
                <text x="300" y="17" font-family="Arial, sans-serif" font-weight="bold" font-size="12" text-anchor="middle" fill="#ffffff">GENERAL JOURNAL (Page 1)</text>
                
                <!-- Column Headers -->
                <g transform="translate(0, 25)">
                    <rect width="600" height="20" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.5"/>
                    <text x="30" y="14" font-size="9" font-weight="bold" fill="#475569">DATE</text>
                    <text x="150" y="14" font-size="9" font-weight="bold" fill="#475569">ACCOUNT TITLE</text>
                    <text x="350" y="14" font-size="9" font-weight="bold" fill="#475569">PR</text>
                    <text x="420" y="14" font-size="9" font-weight="bold" fill="#475569">DEBIT</text>
                    <text x="520" y="14" font-size="9" font-weight="bold" fill="#475569">CREDIT</text>
                    
                    <!-- Vertical Lines -->
                    <line x1="60" y1="0" x2="60" y2="65" stroke="#cbd5e0" stroke-width="1"/>
                    <line x1="330" y1="0" x2="330" y2="65" stroke="#cbd5e0" stroke-width="1"/>
                    <line x1="370" y1="0" x2="370" y2="65" stroke="#cbd5e0" stroke-width="1"/>
                    <line x1="470" y1="0" x2="470" y2="65" stroke="#cbd5e0" stroke-width="1"/>
                </g>

                <!-- Journal Entry Row -->
                <g transform="translate(0, 60)" font-family="Courier New, monospace" font-size="11" fill="#334155">
                    <text x="30" y="0">Dec 1</text>
                    <text x="70" y="0" font-weight="bold">Cash</text>
                    <!-- Highlighted PR field in Journal -->
                    <rect x="335" y="-10" width="30" height="15" fill="#fef08a" opacity="0.5" rx="2"/> 
                    <text x="350" y="0" text-anchor="middle" fill="#ce1126">101</text> <!-- Posted Ref -->
                    
                    <!-- Highlighted Amount in Journal -->
                    <rect x="380" y="-10" width="80" height="15" fill="#bfdbfe" opacity="0.5" rx="2"/>
                    <text x="460" y="0" text-anchor="end" font-weight="bold">100,000</text>
                </g>
            </g>

            <!-- ================= PROCESS: ARROW ================= -->
            <!-- Connecting Arrow from Journal Debit to Ledger Debit -->
            <path d="M490, 80 Q520, 140 400, 240" fill="none" stroke="#0038a8" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#arrowhead)"/>
            <circle cx="490" cy="80" r="4" fill="#0038a8" />
            <text x="530" y="150" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0038a8" font-style="italic">Posting...</text>

            <!-- ================= DESTINATION: GENERAL LEDGER (Standard Form) ================= -->
            <g transform="translate(10, 160)">
                <!-- Main Container -->
                <rect x="0" y="0" width="680" height="200" fill="#ffffff" stroke="#cbd5e0" stroke-width="1" />
                
                <!-- Account Header -->
                <rect x="0" y="0" width="680" height="30" fill="#0038a8" />
                <text x="340" y="20" font-family="Arial, sans-serif" font-weight="bold" font-size="14" text-anchor="middle" fill="#ffffff">GENERAL LEDGER</text>
                
                <!-- Account Title & Number -->
                <text x="340" y="50" font-family="Arial, sans-serif" font-weight="bold" font-size="16" text-anchor="middle" fill="#1e293b">CASH</text>
                <text x="670" y="50" font-family="Arial, sans-serif" font-weight="bold" font-size="12" text-anchor="end" fill="#64748b">Acct. No. 101</text>
                
                <!-- TABLE STRUCTURE -->
                <!-- Main Divider (Center Line) -->
                <line x1="340" y1="60" x2="340" y2="200" stroke="#0038a8" stroke-width="2" />
                
                <!-- Header Row Background -->
                <rect x="0" y="60" width="680" height="25" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.5"/>

                <!-- ============ DEBIT SIDE (LEFT - 4 Columns) ============ -->
                <line x1="60" y1="60" x2="60" y2="200" stroke="#cbd5e0" stroke-width="1" /> <!-- Date -->
                <line x1="230" y1="60" x2="230" y2="200" stroke="#cbd5e0" stroke-width="1" /> <!-- Particulars -->
                <line x1="270" y1="60" x2="270" y2="200" stroke="#cbd5e0" stroke-width="1" /> <!-- PR -->
                
                <text x="30" y="76" font-family="Arial, sans-serif" font-size="9" font-weight="bold" text-anchor="middle" fill="#475569">DATE</text>
                <text x="145" y="76" font-family="Arial, sans-serif" font-size="9" font-weight="bold" text-anchor="middle" fill="#475569">PARTICULARS</text>
                <text x="250" y="76" font-family="Arial, sans-serif" font-size="9" font-weight="bold" text-anchor="middle" fill="#475569">PR</text>
                <text x="305" y="76" font-family="Arial, sans-serif" font-size="9" font-weight="bold" text-anchor="middle" fill="#475569">DEBIT</text>

                <!-- Posted Entry (Debit) -->
                <g transform="translate(0, 95)" font-family="Courier New, monospace" font-size="11" fill="#334155">
                    <text x="30" y="0" text-anchor="middle">Dec 1</text>
                    <text x="70" y="0">Investment</text>
                    <!-- Highlighted PR field in Ledger -->
                    <rect x="235" y="-10" width="30" height="15" fill="#fef08a" opacity="0.5" rx="2"/>
                    <text x="250" y="0" text-anchor="middle">J-1</text>
                    
                    <!-- Highlighted Amount in Ledger -->
                    <rect x="275" y="-10" width="60" height="15" fill="#bfdbfe" opacity="0.5" rx="2"/>
                    <text x="330" y="0" text-anchor="end" font-weight="bold" fill="#0038a8">100,000</text>
                </g>

                <!-- ============ CREDIT SIDE (RIGHT - 4 Columns) ============ -->
                <line x1="400" y1="60" x2="400" y2="200" stroke="#cbd5e0" stroke-width="1" /> <!-- Date -->
                <line x1="570" y1="60" x2="570" y2="200" stroke="#cbd5e0" stroke-width="1" /> <!-- Particulars -->
                <line x1="610" y1="60" x2="610" y2="200" stroke="#cbd5e0" stroke-width="1" /> <!-- PR -->

                <text x="370" y="76" font-family="Arial, sans-serif" font-size="9" font-weight="bold" text-anchor="middle" fill="#475569">DATE</text>
                <text x="485" y="76" font-family="Arial, sans-serif" font-size="9" font-weight="bold" text-anchor="middle" fill="#475569">PARTICULARS</text>
                <text x="590" y="76" font-family="Arial, sans-serif" font-size="9" font-weight="bold" text-anchor="middle" fill="#475569">PR</text>
                <text x="645" y="76" font-family="Arial, sans-serif" font-size="9" font-weight="bold" text-anchor="middle" fill="#475569">CREDIT</text>

                <!-- Horizontal Lines (Rows) -->
                <line x1="0" y1="85" x2="680" y2="85" stroke="#e2e8f0" stroke-width="1" />
                <line x1="0" y1="110" x2="680" y2="110" stroke="#e2e8f0" stroke-width="1" />
                <line x1="0" y1="135" x2="680" y2="135" stroke="#e2e8f0" stroke-width="1" />
                <line x1="0" y1="160" x2="680" y2="160" stroke="#e2e8f0" stroke-width="1" />
            </g>

            <!-- Arrow Marker Definition -->
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#0038a8" />
                </marker>
            </defs>
        </svg>
    </div>

                        <div class="bg-green-50 p-4 rounded-lg mt-4">
                            <h4 class="font-bold text-green-800 text-sm uppercase mb-2">Cross-Referencing (PR)</h4>
                            <p class="text-sm text-green-900">Write the Journal Page (e.g., J1) in the Ledger, and the Account Number in the Journal's PR column. This "bookmark" prevents double-posting.</p>
                        </div>
                    </section>

                    <!-- STEP 4 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 4: Unadjusted Trial Balance</h3>
                        <!-- Expanded 5-Sentence Paragraph -->
    <p class="mb-4 text-gray-600">
        The Unadjusted Trial Balance is a crucial internal working paper prepared to test the mathematical equality of debits and credits after the posting process. It lists all open accounts from the general ledger with their ending debit or credit balances, typically arranged in financial statement order (Assets, Liabilities, Equity, Income, Expenses). This report serves as a vital preliminary checkpoint to ensure that total debits equal total credits before any adjusting entries are recorded. While a balanced trial balance proves that the books are mathematically correct, it does not guarantee the absence of errors, such as omitted transactions or entries posted to the wrong accounts. Ultimately, this summary provides the foundational data needed to analyze accounts for necessary adjustments and to proceed with the preparation of accurate financial statements.
    </p>

    <!-- Visual Representation of Unadjusted Trial Balance -->
    <div class="img-box" style="display: flex; justify-content: center; width: 100%; margin: 20px 0;">
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width: 500px;">
            <!-- Paper Background -->
            <rect width="500" height="500" fill="#ffffff" stroke="#cbd5e0" stroke-width="1" />
            <filter id="shadow"><feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#94a3b8"/></filter>
            
            <!-- HEADER SECTION -->
            <!-- 3-Line Header is standard in Accounting -->
            <text x="250" y="40" font-family="Arial, sans-serif" font-weight="bold" font-size="16" text-anchor="middle" fill="#0f172a">JUAN'S GENERAL MERCHANDISE</text>
            <text x="250" y="65" font-family="Arial, sans-serif" font-weight="bold" font-size="14" text-anchor="middle" fill="#0038a8">Unadjusted Trial Balance</text>
            <text x="250" y="85" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#64748b">December 31, 2023</text>
            
            <!-- Double Line Separator -->
            <line x1="50" y1="100" x2="450" y2="100" stroke="#0038a8" stroke-width="2"/>
            <line x1="50" y1="104" x2="450" y2="104" stroke="#0038a8" stroke-width="1"/>

            <!-- TABLE HEADERS -->
            <rect x="50" y="115" width="400" height="25" fill="#f1f5f9" />
            <text x="60" y="132" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#475569">ACCOUNT TITLE</text>
            <text x="320" y="132" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="end" fill="#475569">DEBIT</text>
            <text x="420" y="132" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="end" fill="#475569">CREDIT</text>

            <!-- ACCOUNTS LIST -->
            <g transform="translate(0, 150)" font-family="Courier New, monospace" font-size="12" fill="#334155">
                <!-- Assets -->
                <text x="60" y="15">Cash</text>
                <text x="320" y="15" text-anchor="end">100,000</text>

                <text x="60" y="40">Accounts Receivable</text>
                <text x="320" y="40" text-anchor="end">50,000</text>

                <text x="60" y="65">Merchandise Inventory</text>
                <text x="320" y="65" text-anchor="end">150,000</text>

                <text x="60" y="90">Store Equipment</text>
                <text x="320" y="90" text-anchor="end">200,000</text>

                <!-- Liabilities -->
                <text x="60" y="115">Accounts Payable</text>
                <text x="420" y="115" text-anchor="end">80,000</text>

                <!-- Equity -->
                <text x="60" y="140">Juan, Capital</text>
                <text x="420" y="140" text-anchor="end">300,000</text>

                <!-- Revenue -->
                <text x="60" y="165">Sales</text>
                <text x="420" y="165" text-anchor="end">500,000</text>

                <!-- Expenses / Cost -->
                <text x="60" y="190">Cost of Goods Sold</text>
                <text x="320" y="190" text-anchor="end">300,000</text>

                <text x="60" y="215">Operating Expenses</text>
                <text x="320" y="215" text-anchor="end">80,000</text>
            </g>

            <!-- TOTALS SECTION -->
            <line x1="250" y1="380" x2="440" y2="380" stroke="#333" stroke-width="1"/>
            
            <text x="180" y="405" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#0f172a">TOTALS</text>
            
            <!-- Debit Total -->
            <text x="320" y="405" font-family="Courier New, monospace" font-weight="bold" font-size="12" text-anchor="end" fill="#0f172a">₱ 880,000</text>
            
            <!-- Credit Total -->
            <text x="420" y="405" font-family="Courier New, monospace" font-weight="bold" font-size="12" text-anchor="end" fill="#0f172a">₱ 880,000</text>

            <!-- Double Underline (Accounting Standard for Totals) -->
            <line x1="260" y1="415" x2="330" y2="415" stroke="#0f172a" stroke-width="1"/>
            <line x1="260" y1="418" x2="330" y2="418" stroke="#0f172a" stroke-width="1"/>
            
            <line x1="360" y1="415" x2="430" y2="415" stroke="#0f172a" stroke-width="1"/>
            <line x1="360" y1="418" x2="430" y2="418" stroke="#0f172a" stroke-width="1"/>

            <!-- Visual Checkmark for Balance -->
            <circle cx="470" cy="400" r="12" fill="#10b981" />
            <path d="M464 400 L468 404 L476 396" fill="none" stroke="#fff" stroke-width="2" />
        </svg>
    </div>
                        
                        <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                            <h4 class="font-bold text-red-800 text-sm">Limitations</h4>
                            <p class="text-xs text-red-900 mt-1">A balanced TB does not guarantee accuracy. It misses errors of principle (wrong account), omission (skipped entry), or compensating errors.</p>
                        </div>
                    </section>

                    <!-- STEP 5 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 5: Adjustments & Worksheet</h3>
                        <p class="mb-4 text-gray-600">Adhering to the <strong>Accrual Basis</strong>. Adjustments update accounts for time passage (Deferrals) or unrecorded activities (Accruals) to meet the Matching Principle.</p>
                        
                        <p class="text-sm text-gray-500 mt-2">The <strong>10-Column Worksheet</strong> is a rough draft tool. It includes: Unadjusted TB, Adjustments, Adjusted TB, Income Statement, and Balance Sheet columns.</p>
                    </section>
                </div>
            `,
            exercises: [
                {
                    type: "mcq",
                    question: "Which principle is violated if a personal withdrawal is recorded as a business expense?",
                    options: ["Matching Principle", "Business Entity Principle", "Revenue Recognition", "Cost Principle"],
                    correctIndex: 1,
                    explanation: "The Business Entity Principle separates personal affairs from business affairs."
                },
                {
                    type: "mcq",
                    question: "In the General Journal, how should Credit entries be formatted?",
                    options: ["Listed first, left aligned", "Listed second, left aligned", "Listed first, indented", "Listed second, indented to the right"],
                    correctIndex: 3,
                    explanation: "Credits are always listed below debits and indented to visually distinguish them."
                }
            ]
        },
        {
            day: "Day 2",
            topic: "Review: Reporting & Closing (Steps 6–10)",
            content: `
                <div class="space-y-8 animate-fade-in">
                    <div class="bg-emerald-50 p-6 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                        <h3 class="text-lg font-bold text-emerald-900 mb-2">Phase Overview</h3>
                        <p class="text-emerald-800">Focus: Formal reporting to external parties, updating official books, and closing temporary accounts.</p>
                        [Image of financial statement preparation flow]
                    </div>

                    <!-- STEP 6 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 6: Prepare Financial Statements</h3>
                        <p class="mb-4 text-gray-600">The primary product for stakeholders, prepared directly from the Worksheet columns.</p>
                        
                        <div class="space-y-3">
                            <div class="flex items-start">
                                <div class="bg-blue-100 text-blue-700 font-bold rounded px-2 py-1 text-xs mr-3 mt-1">1</div>
                                <div><strong class="text-slate-700">Income Statement:</strong> Revenue - Expenses = Net Income.</div>
                            </div>
                            <div class="flex items-start">
                                <div class="bg-blue-100 text-blue-700 font-bold rounded px-2 py-1 text-xs mr-3 mt-1">2</div>
                                <div><strong class="text-slate-700">Statement of Changes in Equity:</strong> Beg. Capital + Net Income - Withdrawals = End. Capital.</div>
                            </div>
                            <div class="flex items-start">
                                <div class="bg-blue-100 text-blue-700 font-bold rounded px-2 py-1 text-xs mr-3 mt-1">3</div>
                                <div><strong class="text-slate-700">Balance Sheet:</strong> Assets = Liabilities + End. Equity.</div>
                            </div>
                        </div>
                    </section>

                    <!-- STEP 7 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 7: Adjusting Entries (Journalize & Post)</h3>
                        <p class="mb-4 text-gray-600">Making the Worksheet adjustments official. Without this, the Ledger would not match the Financial Statements.</p>
                        <div class="bg-gray-50 p-4 rounded text-sm font-mono text-gray-700 border-l-4 border-gray-400">
                            Example: <br>
                            Dr. Depreciation Expense<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;Cr. Accumulated Depreciation
                        </div>
                    </section>

                    <!-- STEP 8 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 8: Closing Entries</h3>
                        <p class="mb-4 text-gray-600">Resetting <strong>Temporary (Nominal)</strong> accounts to zero (Revenue, Expense, Withdrawals). Permanent (Real) accounts remain open.</p>
                        
                        
                        <div class="grid grid-cols-2 gap-4 mt-4">
                            <div class="bg-purple-50 p-3 rounded text-center">
                                <span class="block font-bold text-purple-800">R</span> Revenue -> Income Summary
                            </div>
                            <div class="bg-purple-50 p-3 rounded text-center">
                                <span class="block font-bold text-purple-800">E</span> Expenses -> Income Summary
                            </div>
                            <div class="bg-purple-50 p-3 rounded text-center">
                                <span class="block font-bold text-purple-800">I</span> Income Summary -> Capital
                            </div>
                            <div class="bg-purple-50 p-3 rounded text-center">
                                <span class="block font-bold text-purple-800">D</span> Drawings -> Capital
                            </div>
                        </div>
                    </section>

                    <!-- STEP 9 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 9: Post-Closing Trial Balance</h3>
                        <p class="mb-4 text-gray-600">Proves the ledger is balanced for the new period. Contains <strong>only Real Accounts</strong> (Assets, Liabilities, Capital). No Revenue or Expenses should appear here.</p>
                    </section>

                    <!-- STEP 10 -->
                    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Step 10: Reversing Entries (Optional)</h3>
                        <p class="mb-4 text-gray-600">Performed on Day 1 of the new period. Exact opposite of adjusting entries for Accruals. Used for convenience in recording future cash flows.</p>
                    </section>
                </div>
            `,
            exercises: [
                {
                    type: "mcq",
                    question: "Which of the following accounts appears on a Post-Closing Trial Balance?",
                    options: ["Service Revenue", "Rent Expense", "Accounts Receivable", "Owner's Withdrawals"],
                    correctIndex: 2,
                    explanation: "Only Permanent (Real) accounts appear post-closing. Revenue, Expenses, and Withdrawals are closed to zero."
                },
                {
                    type: "mcq",
                    question: "What is the correct order for closing entries (REID)?",
                    options: ["Revenue, Expenses, Income Summary, Drawings", "Revenue, Equity, Income, Debt", "Rent, Expenses, Interest, Drawings", "Revenue, Expenses, Investments, Drawings"],
                    correctIndex: 0,
                    explanation: "Close Revenue, then Expenses, then Income Summary (Net Income/Loss), then Drawings."
                }
            ]
        },
        {
            day: "Day 3",
            topic: "Practical: Journalizing to Trial Balance",
            content: `
                <div class="space-y-6">
                    <div class="bg-blue-600 text-white p-8 rounded-xl shadow-lg text-center">
                        <h2 class="text-3xl font-bold mb-2">Practical Activity 1</h2>
                        <p class="text-blue-100 text-lg">From Transactions to Unadjusted Trial Balance</p>
                    </div>

                    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-xl font-bold text-slate-800 mb-4">Activity Objectives</h3>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>Analyze source documents and determine account effects.</li>
                            <li>Record journal entries with proper formatting.</li>
                            <li>Post entries to T-accounts and calculate running balances.</li>
                            <li>Prove equality by preparing an Unadjusted Trial Balance.</li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 class="text-xl font-bold text-slate-800 mb-4">Scenario: "Speedy Tech Services"</h3>
                        <p class="mb-4 text-gray-600">You are the bookkeeper for Speedy Tech. The following transactions occurred in Jan 2024:</p>
                        <ul class="space-y-2 font-mono text-sm text-slate-700 bg-white p-4 rounded border border-gray-200">
                            <li><strong>Jan 1:</strong> Owner invested ₱50,000 cash.</li>
                            <li><strong>Jan 5:</strong> Purchased equipment for ₱20,000 on account.</li>
                            <li><strong>Jan 10:</strong> Performed services for ₱15,000 cash.</li>
                            <li><strong>Jan 15:</strong> Paid ₱5,000 for salaries.</li>
                            <li><strong>Jan 30:</strong> Owner withdrew ₱2,000 for personal use.</li>
                        </ul>
                        <p class="mt-4 text-gray-600 italic">Use the Practice Questions tab to simulate recording these entries.</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    type: "problem",
                    question: "Prepare the Journal Entry for Jan 5: Purchased equipment for ₱20,000 on account.",
                    answer: "Jan 5  Equipment           20,000\n       Accounts Payable        20,000\n       (Purchased equipment on account)",
                    explanation: "Equipment (Asset) increases, so we Debit. Accounts Payable (Liability) increases, so we Credit."
                }
            ]
        },
        {
            day: "Day 4",
            topic: "Practical: Worksheet & Statements",
            content: `
                <div class="space-y-6">
                    <div class="bg-blue-600 text-white p-8 rounded-xl shadow-lg text-center">
                        <h2 class="text-3xl font-bold mb-2">Practical Activity 2</h2>
                        <p class="text-blue-100 text-lg">The Worksheet & Financial Statements</p>
                    </div>

                    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-xl font-bold text-slate-800 mb-4">Activity Objectives</h3>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>Identify necessary adjustments (Depreciation, Accruals).</li>
                            <li>Complete a 10-Column Worksheet.</li>
                            <li>Extend balances to Income Statement and Balance Sheet columns.</li>
                            <li>Draft the formal Financial Statements.</li>
                        </ul>
                    </div>

                    <div class="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                        <h3 class="text-xl font-bold text-yellow-900 mb-2">Required Adjustments</h3>
                        <p class="text-yellow-800 mb-4">Proceeding with Speedy Tech Services (from Day 3):</p>
                        <ul class="list-disc list-inside space-y-1 text-yellow-900 text-sm">
                            <li><strong>a.</strong> Equipment depreciates at ₱500 per month.</li>
                            <li><strong>b.</strong> Unpaid salaries at month-end amount to ₱1,000.</li>
                        </ul>
                    </div>
                </div>
            `,
            exercises: [
                {
                    type: "problem",
                    question: "Calculate Net Income given: Revenue ₱15,000, Paid Salaries ₱5,000, Accrued Salaries ₱1,000, Depreciation ₱500.",
                    answer: "Net Income = ₱8,500",
                    explanation: "Revenue (15,000) - Expenses (5,000 Paid + 1,000 Accrued + 500 Depreciation) = 15,000 - 6,500 = 8,500."
                }
            ]
        },
        {
            day: "Day 5",
            topic: "Practical: Closing the Books",
            content: `
                <div class="space-y-6">
                    <div class="bg-blue-600 text-white p-8 rounded-xl shadow-lg text-center">
                        <h2 class="text-3xl font-bold mb-2">Practical Activity 3</h2>
                        <p class="text-blue-100 text-lg">Adjusting, Closing, and Reversing</p>
                    </div>

                    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 class="text-xl font-bold text-slate-800 mb-4">Activity Objectives</h3>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>Journalize and Post the adjustments from the worksheet.</li>
                            <li>Prepare and post Closing Entries (REID).</li>
                            <li>Generate a Post-Closing Trial Balance.</li>
                            <li>Determine if Reversing Entries are needed.</li>
                        </ul>
                    </div>

                     <div class="bg-purple-50 p-6 rounded-xl border border-purple-200">
                        <h3 class="text-xl font-bold text-purple-900 mb-2">Closing Challenge</h3>
                        <p class="text-purple-800">Use the T-account method to verify that the Income Summary balance equals the Net Income before closing it to Capital.</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    type: "problem",
                    question: "Prepare the entry to close the Service Revenue account (Balance: ₱15,000).",
                    answer: "Service Revenue       15,000\n       Income Summary          15,000",
                    explanation: "Revenue has a Credit balance. To close it (make it zero), we Debit it for the full amount and Credit Income Summary."
                }
            ]
        }
    ]
};
