import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm';
import { fmtNum } from './previewUtils.js';

const html = htm.bind(React.createElement);

export function evaluateProblemSolving(liveQ, studentAns) {
    const correctAnsStr = liveQ.correctAnswer !== undefined ? String(liveQ.correctAnswer) : (liveQ.solution !== undefined ? String(liveQ.solution) : '');
    const isCorrect = studentAns && correctAnsStr && studentAns.trim().toLowerCase() === correctAnsStr.trim().toLowerCase();
    return { maxScore: 1, score: isCorrect ? 1 : 0 };
}

export function renderProblemSolvingPreview(q, qIdx, liveQ, studentAns) {
    const correctAnsStr = liveQ.correctAnswer !== undefined ? String(liveQ.correctAnswer) : (liveQ.solution !== undefined ? String(liveQ.solution) : '');
    const isCorrect = studentAns && correctAnsStr && studentAns.trim().toLowerCase() === correctAnsStr.trim().toLowerCase();
    
    let explanationHtml = null;
    if (liveQ.explanation) {
        const sentences = liveQ.explanation.split(/(?<=\.)\s+/);
        
        const elementsHtml = sentences.map((sentence, sIdx) => {
            if (!sentence.trim()) return null;
            
            const hasMath = /(?![^(]*\))([+\-*/=])/.test(sentence) && /\d/.test(sentence);
            
            if (!hasMath) {
                return html`<div key=${sIdx} className="mb-2 text-sm text-gray-700 whitespace-pre-wrap">${sentence}</div>`;
            } else {
                let cleanSentence = sentence.trim();
                if (cleanSentence.endsWith('.')) cleanSentence = cleanSentence.slice(0, -1);
                
                const tokens = cleanSentence.split(/(?![^(]*\))(\s*[+\-*/=]\s*)/).filter(t => t.trim() !== '');
                
                let currentOp = '';
                let lines = [];
                
                for (let i = 0; i < tokens.length; i++) {
                    let t = tokens[i].trim();
                    if (['+', '-', '*', '/', '='].includes(t)) {
                        currentOp = t;
                        if (currentOp === '=' && lines.length > 0) {
                            lines[lines.length - 1].borderClass = 'border-b border-black pb-1 mb-1';
                        }
                    } else {
                        let desc = t;
                        let amt = '';
                        
                        let match = t.match(/^(.*?)[\s:]+([$₱€£¥]?\s*[\d.,]+)(\s*[a-zA-Z₱€£¥$]*)$/i);
                        if (match) {
                            desc = match[1].trim();
                            amt = match[2].trim() + (match[3] || '');
                        } else if (/^[$₱€£¥]?\s*[\d.,]+(\s*[a-zA-Z₱€£¥$]*)$/i.test(t)) {
                            desc = '';
                            amt = t.trim();
                        }
                        
                        let isDeduction = false;
                        let borderClass = '';
                        
                        if (currentOp === '=') {
                            if (i === tokens.length - 1) borderClass = 'border-b-4 border-double border-black pb-1';
                        } else if (currentOp === '-') {
                            isDeduction = true;
                        } else if (currentOp === '*') {
                            desc = "multiplied by " + desc;
                        } else if (currentOp === '/') {
                            desc = "divided by " + desc;
                        }
                        
                        lines.push({ desc, amt, isDeduction, borderClass, id: i });
                    }
                }
                
                return html`
                    <div key=${sIdx} className="w-full font-mono text-sm ml-0 mb-1 bg-white mt-1">
                        ${lines.map((line) => {
                            let displayAmt = line.amt;
                            let amtClass = "text-right whitespace-nowrap flex-shrink-0";
                            let descClass = "text-left flex-grow pr-4 break-words pl-4 -indent-4"; 
                            let rowClass = "flex justify-between py-.05 items-end w-full " + (line.borderClass || '');
                            
                            if (line.isDeduction) {
                                displayAmt = "(" + displayAmt + ")";
                                descClass += " text-red-600 font-medium";
                                amtClass += " text-red-600 font-medium pr-2"; 
                            } else {
                                descClass += " text-gray-700";
                                amtClass += " text-gray-800 pr-4"; 
                            }
                            
                            if (line.borderClass && line.borderClass.includes('border-double')) {
                                descClass = descClass.replace('text-gray-700', 'text-black').replace('text-red-600', 'text-black') + " font-bold";
                                amtClass = amtClass.replace('text-gray-800', 'text-black').replace('text-red-600', 'text-black') + " font-bold";
                            }

                            return html`
                                <div key=${line.id} className=${rowClass}>
                                    <div className=${descClass}>${line.desc}</div>
                                    <div className=${amtClass}>${displayAmt}</div>
                                </div>
                            `;
                        })}
                    </div>
                `;
            }
        });

        explanationHtml = html`
            <div className="mt-4 pt-4 border-t border-gray-200 explanation-section">
                ${elementsHtml}
            </div>
        `;
    }

    return html`
        <div key=${q.uiId} className="border rounded p-4 bg-white">
            <div className="font-bold text-gray-800 mb-4">${qIdx + 1}. ${liveQ.question}</div>
            
            <div className="flex flex-col gap-4">
                <div className=${`px-3 py-1 rounded border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <span className="text-xs font-bold mb-2 text-gray-500 uppercase mr-2 tracking-wide">Student Answer:</span>
                    <span className="font-mono text-base whitespace-pre-wrap text-green-800 font-bold">${fmtNum(studentAns) || '(No Answer)'}</span>
                </div>
                <div className="px-4 py-1 rounded border bg-gray-50 border-gray-200">
                    <div className="text-sm text-gray-800 mb-2">
                        <span className="font-bold uppercase text-gray-500 text-xs mr-2 tracking-wide">Correct Answer:</span> 
                        <span className="font-mono font-bold text-blue-700 text-base">${fmtNum(correctAnsStr)}</span>
                    </div>
                    ${explanationHtml}
                </div>
            </div>
        </div>
    `;
}
