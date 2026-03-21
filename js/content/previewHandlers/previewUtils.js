import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm';
import { Check, X } from 'https://esm.sh/lucide-react@0.263.1';

const html = htm.bind(React.createElement);

export const cleanAmt = (amt) => {
    if (amt === null || amt === undefined) return NaN;
    const str = String(amt).trim();
    if (str === '') return NaN;
    return Number(str.replace(/,/g, ''));
};

export const fmtNum = (v) => { 
    const n = Number(String(v || '').replace(/,/g, '')); 
    return (!isNaN(n) && String(v).trim() !== '') 
        ? (Number.isInteger(n) ? n.toLocaleString('en-US') : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) 
        : v; 
};

export const renderCell = (val, isCorrect, isExpected, colType, extraClasses = '') => {
    let icon = null;
    if (isCorrect && val) {
        icon = html`<${Check} size=${14} className="text-green-600 flex-shrink-0"/>`;
    } else if (!isCorrect && (val || isExpected)) {
        icon = html`<${X} size=${14} className="text-red-600 flex-shrink-0"/>`;
    }
    
    let textClass = isCorrect ? "text-green-700 font-bold" : "text-red-600 font-bold";
    if (!val && !isExpected) return '';
    
    if (colType === 'date' || colType === 'amount') {
        const displayVal = colType === 'amount' ? fmtNum(val) : val;
        return html`<div className="flex w-full items-center">
            <div className="w-4 flex-none flex justify-start">${icon}</div>
            <div className=${"flex-grow text-right " + textClass + " " + extraClasses}>${displayVal}</div>
        </div>`;
    } else if (colType === 'acct' || colType === 'desc') {
        return html`<div className="flex w-full items-center">
            <div className=${"flex-grow text-left whitespace-pre " + textClass + " " + extraClasses}>${val}</div>
            <div className="w-4 flex-none flex justify-end">${icon}</div>
        </div>`;
    }
};
