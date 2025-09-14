
import React, { useRef, useEffect } from 'react';
import type { UserInput, CalculationStep, BlockDistribution, Problem } from '../types';
import { ValueBlocks } from './ValueBlocks';
import { CarryAnimation } from './CarryAnimation';

interface AdditionProblemProps {
  problem: Problem;
  userInput: UserInput;
  setUserInput: React.Dispatch<React.SetStateAction<UserInput>>;
  step: CalculationStep;
  setStep: React.Dispatch<React.SetStateAction<CalculationStep>>;
  showCarry: boolean;
  isWrong: boolean;
  validateOnes: (value: string) => void;
  triggerCarryAnimation: boolean;
  completeCarryAnimation: () => void;
  blockDistribution: BlockDistribution;
  onBlockDrop: () => void;
  hasCarry: boolean;
}

const PlaceValueInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  isActive: boolean;
  isWrong: boolean;
  maxLength: number;
  inputRef?: React.RefObject<HTMLInputElement>;
  isDisabled: boolean;
}> = ({ value, onChange, onFocus, isActive, isWrong, maxLength, inputRef, isDisabled }) => (
  <input
    ref={inputRef}
    type="number"
    className={`w-24 h-16 sm:h-20 rounded-lg text-4xl sm:text-5xl font-bold font-display text-center transition-all duration-300
      ${isWrong ? 'shake border-red-500 text-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300'}
      ${isActive ? 'border-blue-500 ring-2 ring-blue-300 bg-blue-50' : 'bg-gray-100'}
      ${isDisabled ? 'cursor-not-allowed bg-gray-200 opacity-70' : ''}
    `}
    value={value}
    onChange={onChange}
    onFocus={onFocus}
    maxLength={maxLength}
    disabled={isDisabled}
    pattern="\d*"
  />
);

export const AdditionProblem: React.FC<AdditionProblemProps> = ({
  problem,
  userInput,
  setUserInput,
  step,
  setStep,
  showCarry,
  isWrong,
  validateOnes,
  triggerCarryAnimation,
  completeCarryAnimation,
  blockDistribution,
  onBlockDrop,
  hasCarry,
}) => {
  const { num1, num2 } = problem;
  const num1Tens = Math.floor(num1 / 10);
  const num1Ones = num1 % 10;
  const num2Tens = Math.floor(num2 / 10);
  const num2Ones = num2 % 10;

  const onesInputRef = useRef<HTMLInputElement>(null);
  const tensInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'ones' && !triggerCarryAnimation) {
      onesInputRef.current?.focus();
    } else if (step === 'tens') {
      tensInputRef.current?.focus();
    }
  }, [step, triggerCarryAnimation]);
  
  const handleOnesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(-1);
    setUserInput(prev => ({ ...prev, ones: value }));
    validateOnes(value);
  };

  const handleTensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(prev => ({ ...prev, tens: e.target.value.slice(-1) }));
  };
  
  return (
    <div className="relative p-2 sm:p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
      {hasCarry && <CarryAnimation 
        isAnimating={triggerCarryAnimation} 
        onAnimationEnd={completeCarryAnimation}
      />}
      
      <div className="grid grid-cols-[auto,1fr] gap-x-4 sm:gap-x-6">
        {/* PLUS SIGN COLUMN */}
        <div className="flex flex-col justify-end items-center h-full">
            <div className="h-10"></div> {/* Title space */}
            {showCarry && <div className="h-20"></div>} {/* Carry space */}
            <div className="h-20"></div> {/* Num1 space */}
            <div className="h-20 flex items-center">
              <span className="text-4xl font-bold text-gray-400">+</span>
            </div>
             <div className="h-[4.5rem]"></div> {/* Answer space */}
        </div>

        {/* NUMBERS GRID */}
        <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6">
          {/* TENS COLUMN */}
          <div className="text-center">
            <p className="h-10 flex items-center justify-center text-xl text-yellow-700 font-bold font-display">십의 자리</p>
            {showCarry && (
              <div className={`h-20 relative flex justify-center items-center gap-2 sm:gap-3 transition-opacity duration-300 ${showCarry ? 'opacity-100' : 'opacity-0'}`}>
                <ValueBlocks count={1} type="tens" />
                <span className="text-6xl font-display text-red-500">1</span>
              </div>
            )}
            {!showCarry && <div className="h-20"></div>}
            <div className="h-20 flex items-center justify-center gap-2 sm:gap-3">
              <ValueBlocks count={num1Tens} type="tens" />
              {num1Tens > 0 && <span className="text-6xl font-display text-gray-700">{num1Tens}</span>}
            </div>
            <div className="h-20 flex items-center justify-center gap-2 sm:gap-3">
              <ValueBlocks count={num2Tens} type="tens" />
              {num2Tens > 0 && <span className="text-6xl font-display text-gray-700">{num2Tens}</span>}
            </div>
          </div>

          {/* ONES COLUMN */}
          <div className={`text-center p-3 rounded-lg transition-all duration-300 ${(step === 'ones' || step === 'makeTen') ? 'bg-blue-100/80 ring-2 ring-blue-300' : ''}`}>
            <p className="h-10 flex items-center justify-center text-xl text-blue-700 font-bold font-display">일의 자리</p>
            <div className="h-20"></div> {/* Spacer for carry */}
            <div className="h-20 flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-6xl font-display text-gray-700">{num1Ones}</span>
              <ValueBlocks count={blockDistribution.top} type="ones" isAnimating={triggerCarryAnimation} hasCarry={hasCarry} />
            </div>
            <div className="h-20 flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-6xl font-display text-gray-700">{num2Ones}</span>
              <ValueBlocks 
                count={blockDistribution.bottom} 
                type="ones" 
                isClickable={step === 'makeTen'} 
                onClick={onBlockDrop} 
              />
            </div>
          </div>

          {/* HORIZONTAL LINE */}
          <div className="col-span-2 h-2 my-2 border-t-4 border-gray-700 rounded-full"></div>

          {/* TENS ANSWER */}
          <div className="flex justify-center">
             <PlaceValueInput 
                value={userInput.tens}
                onChange={handleTensChange}
                onFocus={() => setStep('tens')}
                isActive={step === 'tens'}
                isWrong={isWrong && step !== 'ones'}
                maxLength={1}
                inputRef={tensInputRef}
                isDisabled={step !== 'tens' || triggerCarryAnimation}
            />
          </div>
          
          {/* ONES ANSWER */}
          <div className="flex justify-center">
            <PlaceValueInput 
                value={userInput.ones}
                onChange={handleOnesChange}
                onFocus={() => { if(step !== 'makeTen') setStep('ones')}}
                isActive={step === 'ones'}
                isWrong={isWrong && step === 'ones'}
                maxLength={1}
                inputRef={onesInputRef}
                isDisabled={step === 'makeTen' || triggerCarryAnimation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
