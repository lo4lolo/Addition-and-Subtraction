import React, { useState } from 'react';
import type { Operation } from '../types';

interface ProblemSetupProps {
    onStartRandom: () => void;
    onStartManual: (num1: number, num2: number) => string | null;
    onBack: () => void;
    operation: Operation;
}

export const ProblemSetup: React.FC<ProblemSetupProps> = ({ onStartRandom, onStartManual, onBack, operation }) => {
    const [mode, setMode] = useState<'select' | 'manual'>('select');
    const [num1, setNum1] = useState('');
    const [num2, setNum2] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const n1 = parseInt(num1, 10);
        const n2 = parseInt(num2, 10);
        const errorMessage = onStartManual(n1, n2);
        if (errorMessage) {
           setError(errorMessage);
        }
    };
    
    const opText = operation === 'addition' ? '덧셈' : '뺄셈';

    if (mode === 'manual') {
        return (
            <div className="text-center p-4">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">문제 직접 입력하기</h2>
                <form onSubmit={handleManualSubmit} className="space-y-4 max-w-sm mx-auto">
                    <p className="text-gray-500">두 자리 수 이하의 {opText} 문제를 입력하세요.</p>
                    <div className="flex items-center justify-center gap-4 text-5xl font-display">
                        <input 
                            type="number"
                            value={num1}
                            onChange={(e) => setNum1(e.target.value)}
                            className="w-24 h-24 text-center border-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            placeholder="예) 28"
                        />
                        <span>{operation === 'addition' ? '+' : '-'}</span>
                        <input 
                            type="number"
                            value={num2}
                            onChange={(e) => setNum2(e.target.value)}
                            className="w-24 h-24 text-center border-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            placeholder="예) 34"
                        />
                    </div>
                    {error && <p className="text-red-500 font-semibold">{error}</p>}
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setMode('select')} className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-xl text-lg shadow-md transition-transform transform hover:scale-105">
                            뒤로가기
                        </button>
                        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-lg shadow-md transition-transform transform hover:scale-105">
                            문제 풀기!
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">어떤 <span className={operation === 'addition' ? 'text-blue-600' : 'text-red-600'}>{opText}</span> 문제를 풀어볼까요?</h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button 
                    onClick={onStartRandom}
                    className="w-full sm:w-64 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl text-xl shadow-lg transition-transform transform hover:scale-105"
                >
                    🎲 랜덤 문제
                </button>
                <button 
                    onClick={() => setMode('manual')}
                    className="w-full sm:w-64 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl text-xl shadow-lg transition-transform transform hover:scale-105"
                >
                    ✏️ 직접 입력
                </button>
            </div>
             <div className="mt-8 text-center">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-700 font-semibold transition-colors">
                    &larr; 연산 종류 다시 선택하기
                </button>
            </div>
        </div>
    );
}
