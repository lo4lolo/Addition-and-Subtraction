import React from 'react';
import type { Operation } from '../types';

interface OperationSelectionProps {
  onSelect: (operation: Operation) => void;
}

export const OperationSelection: React.FC<OperationSelectionProps> = ({ onSelect }) => {
  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">무엇을 배워볼까요?</h2>
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <button
          onClick={() => onSelect('addition')}
          className="w-full sm:w-64 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl text-xl shadow-lg transition-transform transform hover:scale-105"
        >
          ➕ 덧셈 (받아올림)
        </button>
        <button
          onClick={() => onSelect('subtraction')}
          className="w-full sm:w-64 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-xl text-xl shadow-lg transition-transform transform hover:scale-105"
        >
          ➖ 뺄셈 (받아내림)
        </button>
      </div>
    </div>
  );
};
