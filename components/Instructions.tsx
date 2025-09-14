import React from 'react';
import type { CalculationStep, Operation } from '../types';

interface InstructionsProps {
  step: CalculationStep;
  isWrong: boolean;
  feedbackMessage: string;
  needsCarryOrBorrow: boolean;
  operation: Operation;
}

const InfoIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.042.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 0 1-.67-1.34l.042-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
    </svg>
);


export const Instructions: React.FC<InstructionsProps> = ({ step, isWrong, feedbackMessage, needsCarryOrBorrow, operation }) => {
  let message = '';
  let bgColor = 'bg-blue-100';
  let textColor = 'text-blue-800';
  
  if (isWrong) {
    message = feedbackMessage;
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  } else if (step === 'correct') {
    message = feedbackMessage;
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  } else {
    if (operation === 'addition') {
        switch (step) {
            case 'makeTen':
                if (needsCarryOrBorrow) {
                    message = '아래 숫자 블록을 위로 옮겨서, 10개를 만들어보세요!';
                } else {
                    message = '아래 숫자 블록을 위로 모두 옮겨서 더해봐요!';
                }
                break;
            case 'ones':
                message = '일의 자리 숫자의 합을 아래 칸에 적어봐요.';
                break;
            case 'tens':
                message = '좋아요! 이제 십의 자리를 계산해 보세요.';
                break;
            default:
                message = '정답을 확인해 보세요!';
        }
    } else { // Subtraction
        switch (step) {
            case 'borrow':
                if (needsCarryOrBorrow) {
                    message = '일의 자리에서 뺄 수가 없네요. 십의 자리에서 빌려와요! 위 숫자 십의 자리를 눌러보세요.';
                } else {
                    message = '이제 계산해볼까요? 일의 자리부터 계산해서 답을 적어봐요.';
                }
                break;
            case 'ones':
                message = '일의 자리를 계산해서 아래 칸에 적어봐요.';
                break;
            case 'tens':
                message = '좋아요! 이제 십의 자리를 계산해 보세요.';
                break;
            default:
                message = '정답을 확인해 보세요!';
        }
    }
  }

  return (
    <div className={`p-4 rounded-lg flex items-center space-x-3 transition-colors duration-300 ${bgColor} ${textColor}`}>
      <InfoIcon className="w-6 h-6 flex-shrink-0" />
      <p className="font-semibold text-base">{message}</p>
    </div>
  );
};
