import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm';
import { X, AlertCircle } from 'https://esm.sh/lucide-react@0.263.1';

const html = htm.bind(React.createElement);

export function evaluateCFS(liveQ, studentAns) {
    return { maxScore: 1, score: 0, needsReview: true }; // Grading is done in the handler directly
}

export function renderCFSPreview(q, qIdx, liveQ, studentAns) {
    const details = studentAns?.computedScores || { headers: [], body: [] };
    const hasData = details.headers.length > 0 || details.body.length > 0;

    const noIndent = ["Cash flow from Operating Activities:", "Cash flow from Investing Activities:", "Cash flow from Financing Activities:", "Net cash increase during the year", "Net cash decrease during the year", "Cash Balance Beginning", "Cash Balance ending"];
    const doubleTopSingleBot = ["Net Cash inflow from Operating Activities", "Net Cash outflow from Operating Activities", "Net Cash inflow from Investing Activities", "Net Cash outflow from Investing Activities", "Net Cash inflow from Financing Activities", "Net Cash outflow from Financing Activities"];
    const singleTopDoubleBot = ["Cash Balance ending"];

    let explanationHtml = null;
    if (liveQ.explanation) {
        explanationHtml = html`
            <div className="mt-8 pt-4 border-t border-gray-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Explanation</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">${liveQ.explanation}</p>
            </div>
        `;
    }

    return html`
        <div key=${q.uiId} className="border rounded p-4 md:p-6 bg-white mb-4 shadow-sm">
            <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div className="font-bold text-gray-800 whitespace-pre-wrap pr-4 text-base md:text-lg leading-snug">${qIdx + 1}. ${liveQ.questionText || liveQ.question}</div>
                <div className="shrink-0 flex items-center">
                    ${hasData 
                        ? html`<div className="flex items-center text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded text-sm font-bold"><i class="fas fa-tasks mr-2"></i> Graded Line-by-Line</div>`
                        : html`<div className="flex items-center text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded text-sm font-bold"><${X} size=${16} className="mr-2"/> No Answer</div>`
                    }
                </div>
            </div>
            
            <div className="flex flex-col gap-6">
                <div className="px-5 py-4 rounded border bg-blue-50 border-blue-200">
                    <span className="text-xs font-bold mb-4 text-gray-500 uppercase block tracking-wide">Student Answer & Feedback:</span>
                    
                    ${hasData ? html`
                        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded p-4 shadow-sm">
                            
                            <div className="text-center mb-6">
                                ${details.headers.map((h, i) => html`
                                    <div key=${i} className="flex items-center justify-center gap-2 mb-1">
                                        <span className="font-bold border-b border-gray-400 px-4 min-w-[250px] text-gray-800">${h.text || '\u00A0'}</span>
                                        ${h.isCorrect 
                                            ? html`<span className="text-green-500 font-bold ml-2">✓</span>` 
                                            : html`<span className="text-red-500 font-bold ml-2">X <span className="text-xs text-gray-400 block font-normal text-left max-w-[150px] leading-tight">Exp: ${h.expected}</span></span>`
                                        }
                                    </div>
                                `)}
                            </div>

                            <div className="flex flex-col w-full font-mono text-sm">
                                ${details.body.map((r, i) => {
                                    // Number formatting & Colors
                                    const isNeg = r.amt.includes('-') || r.amt.includes('(');
                                    const rawNum = parseFloat(r.amt.replace(/[^\d.-]/g, ''));
                                    const formattedNum = isNaN(rawNum) ? r.amt : Math.abs(rawNum).toLocaleString('en-US', {minimumFractionDigits: 2});
                                    const finalAmtStr = (isNeg || rawNum < 0) ? `(${formattedNum})` : formattedNum;
                                    const colorClass = (isNeg || rawNum < 0) ? 'text-red-600' : 'text-gray-800';

                                    // Dynamic Styling based on Desc
                                    let indentClass = noIndent.includes(r.desc) ? 'pl-0 font-bold text-black' : 'pl-6 text-gray-700';
                                    let borderClass = 'border-b border-gray-300';
                                    if (doubleTopSingleBot.includes(r.desc)) borderClass = 'border-t-4 border-double border-b border-gray-800';
                                    if (singleTopDoubleBot.includes(r.desc)) borderClass = 'border-t border-b-4 border-double border-gray-800';

                                    return html`
                                        <div key=${i} className="flex items-end justify-between w-full mb-1.5 hover:bg-gray-50 pr-2">
                                            
                                            <div className=${`flex-1 flex justify-between items-center ${indentClass}`}>
                                                <span>${r.desc || html`<span className="italic text-gray-400">Blank</span>`}</span>
                                                <div className="w-24 text-right pr-4 shrink-0">
                                                    ${r.descCorrect 
                                                        ? html`<span className="text-green-500 font-bold text-sm">✓</span>` 
                                                        : html`<span className="text-red-500 font-bold text-sm" title=${`Expected: ${r.expDesc}`}>X</span>`
                                                    }
                                                </div>
                                            </div>

                                            <div className="w-48 flex justify-between items-end pl-2">
                                                <div className="w-6 shrink-0 text-left pb-0.5">
                                                    ${r.amtCorrect 
                                                        ? html`<span className="text-green-500 font-bold text-sm">✓</span>` 
                                                        : html`<span className="text-red-500 font-bold text-sm" title=${`Expected: ${r.expAmt}`}>X</span>`
                                                    }
                                                </div>
                                                <span className=${`${borderClass} ${colorClass} text-right flex-1 pb-0.5`}>
                                                    ${r.amt ? finalAmtStr : '\u00A0'}
                                                </span>
                                            </div>

                                        </div>
                                    `;
                                })}
                            </div>
                        </div>
                    ` : html`<span className="italic text-red-400">No Answer Provided</span>`}
                    ${explanationHtml}
                </div>
            </div>
        </div>
    `;
}
