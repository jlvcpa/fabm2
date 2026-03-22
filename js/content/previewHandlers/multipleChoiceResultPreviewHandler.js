import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm';
import { Check, X } from 'https://esm.sh/lucide-react@0.263.1';
import { fmtNum } from './previewUtils.js';

const html = htm.bind(React.createElement);

export function evaluateMultipleChoice(liveQ, studentAns) {
    const correctKey = (liveQ.answer !== undefined) ? liveQ.answer : liveQ.correctAnswer;
    const isCorrect = (String(studentAns) === String(correctKey));
    return { maxScore: 1, score: isCorrect ? 1 : 0 };
}

export function renderMultipleChoicePreview(q, qIdx, liveQ, studentAns) {
    const correctKey = (liveQ.answer !== undefined) ? liveQ.answer : liveQ.correctAnswer;
    
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
                    <div key=${sIdx} className="w-full font-mono text-sm ml-0 mb-1 mt-2">
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
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Explanation</h4>
                ${elementsHtml}
            </div>
        `;
    }

    return html`
        <div key=${q.uiId} className="border rounded p-4 bg-white flex flex-col gap-4">
            <div>
                <div className="font-bold text-gray-800 mb-3">${qIdx + 1}. ${liveQ.question}</div>
                <div className="flex flex-col gap-1.5">
                    ${(liveQ.options || []).map((opt, oIdx) => {
                        const isSelected = String(studentAns) === String(oIdx);
                        const isOptCorrect = String(correctKey) === String(oIdx);
                        let style = "border-gray-200 bg-gray-50";
                        let icon = null;
                        if (isSelected && isOptCorrect) { 
                            style = "bg-green-100 border-green-500 text-green-900 font-bold"; 
                            icon = html`<${Check} size=${16} className="text-green-700"/>`; 
                        }
                        else if (isSelected && !isOptCorrect) { 
                            style = "bg-red-100 border-red-500 text-red-900"; 
                            icon = html`<${X} size=${16} className="text-red-700"/>`; 
                        }
                        else if (!isSelected && isOptCorrect) { 
                            style = "bg-green-50 border-green-300 border-dashed text-green-800"; 
                            icon = html`<${Check} size=${16} className="text-green-700 opacity-50"/>`; 
                        }
                        const letter = String.fromCharCode(97 + oIdx);
                        return html`<div key=${oIdx} className=${`px-4 py-.05 border rounded text-sm flex justify-between items-center ${style}`}>
                            <span><span className="font-bold mr-2">${letter}.</span>${opt}</span>
                            ${icon}
                        </div>`;
                    })}
                </div>
            </div>
            ${explanationHtml}
        </div>
    `;
}
