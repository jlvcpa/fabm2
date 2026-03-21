import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm';
import { Check, X } from 'https://esm.sh/lucide-react@0.263.1';

const html = htm.bind(React.createElement);

export function evaluateMultipleChoice(liveQ, studentAns) {
    const correctKey = (liveQ.answer !== undefined) ? liveQ.answer : liveQ.correctAnswer;
    const isCorrect = (String(studentAns) === String(correctKey));
    return { maxScore: 1, score: isCorrect ? 1 : 0 };
}

export function renderMultipleChoicePreview(q, qIdx, liveQ, studentAns) {
    const correctKey = (liveQ.answer !== undefined) ? liveQ.answer : liveQ.correctAnswer;
    return html`
        <div key=${q.uiId} className="border rounded p-4 bg-white">
            <div className="font-bold text-gray-800 mb-2">${qIdx + 1}. ${liveQ.question}</div>
            <div className="flex flex-col gap-1">
                ${(liveQ.options || []).map((opt, oIdx) => {
                    const isSelected = String(studentAns) === String(oIdx);
                    const isOptCorrect = String(correctKey) === String(oIdx);
                    let style = "border-gray-200";
                    let icon = null;
                    if (isSelected && isOptCorrect) { style = "bg-green-100 border-green-500 text-green-900 font-bold"; icon = html`<${Check} size=${16} className="text-green-700"/>`; }
                    else if (isSelected && !isOptCorrect) { style = "bg-red-100 border-red-500 text-red-900"; icon = html`<${X} size=${16} className="text-red-700"/>`; }
                    else if (!isSelected && isOptCorrect) { style = "bg-green-50 border-green-300 border-dashed text-green-800"; icon = html`<${Check} size=${16} className="text-green-700 opacity-50"/>`; }
                    return html`<div className=${`p-2 border rounded text-sm flex justify-between items-center ${style}`}>${opt} ${icon}</div>`;
                })}
            </div>
        </div>
    `;
}
