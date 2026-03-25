import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm';
import { X, AlertCircle } from 'https://esm.sh/lucide-react@0.263.1';

const html = htm.bind(React.createElement);

export function evaluateConstructedResponse(liveQ, studentAns) {
    const isAnswered = studentAns && studentAns.trim() !== '';
    return { maxScore: 1, score: isAnswered ? 1 : 0, needsReview: true };
}

export function renderConstructedResponsePreview(q, qIdx, liveQ, studentAns) {
    const isAnswered = studentAns && studentAns.trim() !== '';
    
    let explanationHtml = null;
    if (liveQ.explanation) {
        explanationHtml = html`
            <div className="mt-5 pt-4 border-t border-gray-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Explanation</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">${liveQ.explanation}</p>
            </div>
        `;
    }

    let solutionHtml = null;
    if (liveQ.solution && Array.isArray(liveQ.solution)) {
        solutionHtml = liveQ.solution.map((solBlock, bIdx) => {
            return html`
                <div key=${bIdx} className="mb-6 last:mb-0 bg-white border border-gray-200 rounded p-4 shadow-sm">
                    ${solBlock.header && Array.isArray(solBlock.header) ? html`
                        <div className="text-center font-bold text-gray-800 mb-4 border-b pb-3">
                            ${solBlock.header.map((h, hIdx) => html`<div key=${hIdx}>${h}</div>`)}
                        </div>
                    ` : ''}
                    ${solBlock.body && Array.isArray(solBlock.body) ? html`
                        <div className="font-mono text-sm text-gray-700">
                            ${solBlock.body.map((line, lIdx) => {
                                const isBold = line.trim().startsWith('=') || line.toLowerCase().includes('net cash') || line.toLowerCase().includes('cash balance');
                                return html`<div key=${lIdx} className=${`whitespace-pre-wrap py-0.5 ${isBold ? 'font-bold text-black mt-2 mb-1 border-b border-gray-200 pb-1' : 'pl-4'}`}>${line}</div>`;
                            })}
                        </div>
                    ` : ''}
                </div>
            `;
        });
    } else if (liveQ.solution) {
        solutionHtml = html`<div className="font-mono text-sm text-gray-700 whitespace-pre-wrap p-4 bg-white border border-gray-200 rounded">${liveQ.solution}</div>`;
    }

    return html`
        <div key=${q.uiId} className="border rounded p-4 md:p-6 bg-white mb-4 shadow-sm">
            <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div className="font-bold text-gray-800 whitespace-pre-wrap pr-4 text-base md:text-lg leading-snug">${qIdx + 1}. ${liveQ.questionText || liveQ.question}</div>
                <div className="shrink-0 flex items-center">
                    ${isAnswered 
                        ? html`<div className="flex items-center text-yellow-600 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded text-sm font-bold"><${AlertCircle} size=${16} className="mr-2"/> Needs Review</div>`
                        : html`<div className="flex items-center text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded text-sm font-bold"><${X} size=${16} className="mr-2"/> No Answer</div>`
                    }
                </div>
            </div>
            
            <div className="flex flex-col gap-6">
                <div className=${`px-5 py-4 rounded border ${isAnswered ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                    <span className="text-xs font-bold mb-3 text-gray-500 uppercase block tracking-wide">Student Answer:</span>
                    <div className="font-mono text-sm whitespace-pre-wrap text-gray-800">${studentAns || html`<span className="italic text-red-400">No Answer Provided</span>`}</div>
                </div>

                <div className="px-5 py-4 rounded border bg-gray-50 border-gray-200">
                    <span className="text-xs font-bold mb-4 text-gray-500 uppercase block tracking-wide">Suggested Solution / Key:</span> 
                    ${solutionHtml}
                    ${explanationHtml}
                </div>
            </div>
        </div>
    `;
}
