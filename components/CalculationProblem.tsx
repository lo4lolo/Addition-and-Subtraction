import React, { useRef, useEffect } from 'react';
import type { UserInput, CalculationStep, BlockDistribution, Problem, Operation } from '../types';
import { ValueBlocks } from './ValueBlocks';
import { CarryAnimation } from './CarryAnimation';
import { BorrowAnimation } from './BorrowAnimation';

interface CalculationProblemProps {
  problem: Problem;
  userInput: UserInput;
  setUserInput: React.Dispatch<React.SetStateAction<UserInput>>;
  step: CalculationStep;
  setStep: React.Dispatch<React.SetStateAction<CalculationStep>>;
  showCarryOrBorrow: boolean;
  isWrong: boolean;
  validateOnes: (value: string) => void;
  triggerCarryAnimation: boolean;
  completeCarryAnimation: () => void;
  blockDistribution: BlockDistribution;
  onBlockDrop: () => void;
  needsCarryOrBorrow: boolean;
  operation: Operation;
  isBorrowed: boolean;
  triggerBorrowAnimation: boolean;
  completeBorrowAnimation: () => void;
  onBorrow: () => void;
  num1Visual: { tens: number, ones: number };
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
  op: Operation;
}> = ({ value, onChange, onFocus, isActive, isWrong, maxLength, inputRef, isDisabled, op }) => (
  <input
    ref={inputRef}
    type="number"
    className={`w-24 h-16 sm:h-20 rounded-lg text-4xl sm:text-5xl font-bold font-display text-center transition-all duration-300
      ${isWrong ? `shake border-red-500 text-red-500` : `border-gray-300 focus:border-${op === 'addition' ? 'blue' : 'red'}-500 focus:ring-2 focus:ring-${op === 'addition' ? 'blue' : 'red'}-300`}
      ${isActive ? `border-${op === 'addition' ? 'blue' : 'red'}-500 ring-2 ring-${op === 'addition' ? 'blue' : 'red'}-300 bg-${op === 'addition' ? 'blue' : 'red'}-50` : 'bg-gray-100'}
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

export const CalculationProblem: React.FC<CalculationProblemProps> = (props) => {
  const {
    problem, userInput, setUserInput, step, setStep, showCarryOrBorrow, isWrong, validateOnes,
    triggerCarryAnimation, completeCarryAnimation, blockDistribution, onBlockDrop, needsCarryOrBorrow,
    operation, isBorrowed, triggerBorrowAnimation, completeBorrowAnimation, onBorrow, num1Visual,
  } = props;
  
  const { num1, num2 } = problem;
  const num1Tens = Math.floor(num1 / 10);
  const num1Ones = num1 % 10;
  const num2Tens = Math.floor(num2 / 10);
  const num2Ones = num2 % 10;

  const onesInputRef = useRef<HTMLInputElement>(null);
  const tensInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'ones' && !triggerCarryAnimation && !triggerBorrowAnimation) {
      onesInputRef.current?.focus();
    } else if (step === 'tens') {
      tensInputRef.current?.focus();
    }
  }, [step, triggerCarryAnimation, triggerBorrowAnimation]);
  
  const handleOnesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(-1);
    setUserInput(prev => ({ ...prev, ones: value }));
    validateOnes(value);
  };

  const handleTensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(prev => ({ ...prev, tens: e.target.value.slice(-1) }));
  };
  
  const placeColor = operation === 'addition' ? 'blue' : 'red';
  const onesActive = step === 'ones' || step === 'makeTen' || step === 'borrow';

  return (
    <div className="relative p-2 sm:p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
      {operation === 'addition' && needsCarryOrBorrow && <CarryAnimation 
        isAnimating={triggerCarryAnimation} 
        onAnimationEnd={completeCarryAnimation}
      />}
      {operation === 'subtraction' && needsCarryOrBorrow && <BorrowAnimation
        isAnimating={triggerBorrowAnimation}
        onAnimationEnd={completeBorrowAnimation}
      />}
      
      <div className="grid grid-cols-[auto,1fr] gap-x-4 sm:gap-x-6">
        {/* OPERATOR SIGN COLUMN */}
        <div className="flex flex-col justify-end items-center h-full">
            <div className="h-10"></div>
            {showCarryOrBorrow && <div className="h-20"></div>}
            <div className="h-20"></div>
            <div className="h-20 flex items-center">
              <span className="text-4xl font-bold text-gray-400">{operation === 'addition' ? '+' : '-'}</span>
            </div>
             <div className="h-[4.5rem]"></div>
        </div>

        {/* NUMBERS GRID */}
        <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6">
          {/* TENS COLUMN */}
          <div className="text-center">
            <p className="h-10 flex items-center justify-center text-xl text-yellow-700 font-bold font-display">십의 자리</p>
            {operation === 'addition' && showCarryOrBorrow && (
              <div className={`h-20 relative flex justify-center items-center gap-2 sm:gap-3 transition-opacity duration-300 ${showCarryOrBorrow ? 'opacity-100' : 'opacity-0'}`}>
                <ValueBlocks count={1} type="tens" />
                <span className="text-6xl font-display text-red-500">1</span>
              </div>
            )}
            {(operation === 'subtraction' || !showCarryOrBorrow) && <div className="h-20"></div>}
            
            <div className="h-20 flex items-center justify-center gap-2 sm:gap-3 relative">
              <div className={`${step === 'borrow' ? 'cursor-pointer hover:bg-red-200/50 rounded-lg p-2' : ''}`} onClick={onBorrow}>
                <ValueBlocks count={num1Tens} type="tens" strikethrough={isBorrowed && !triggerBorrowAnimation} />
              </div>
              {num1Tens > 0 && 
                <div className="relative">
                    <span className={`text-6xl font-display text-gray-700 ${isBorrowed ? 'opacity-30' : ''}`}>{num1Tens}</span>
                    {isBorrowed && <div className="absolute inset-0 flex items-center justify-center"><div className="w-10 h-1 bg-red-500 transform -rotate-12"></div></div>}
                    {isBorrowed && <span className="absolute -top-6 -right-2 text-4xl text-red-500 font-display">{num1Visual.tens}</span>}
                </div>
              }
            </div>
            <div className="h-20 flex items-center justify-center gap-2 sm:gap-3">
              <ValueBlocks count={num2Tens} type="tens" />
              {num2Tens > 0 && <span className="text-6xl font-display text-gray-700">{num2Tens}</span>}
            </div>
          </div>

          {/* ONES COLUMN */}
          <div className={`text-center p-3 rounded-lg transition-all duration-300 ${onesActive ? `bg-${placeColor}-100/80 ring-2 ring-${placeColor}-300` : ''}`}>
            <p className={`h-10 flex items-center justify-center text-xl text-${placeColor}-700 font-bold font-display`}>일의 자리</p>
            <div className="h-20"></div>
            <div className="h-20 flex items-center justify-center gap-2 sm:gap-3 relative">
                <span className={`text-6xl font-display text-gray-700 ${isBorrowed ? 'opacity-30' : ''}`}>{num1Ones}</span>
                {isBorrowed && <div className="absolute inset-0 flex items-center justify-center left-0"><div className="w-10 h-1 bg-red-500 transform -rotate-12"></div></div>}
                {isBorrowed && <span className="absolute -top-6 right-8 text-4xl text-red-500 font-display">{num1Visual.ones}</span>}
                <ValueBlocks count={operation === 'addition' ? blockDistribution.top : (isBorrowed ? num1Visual.ones : num1Ones) } type="ones" isAnimating={triggerCarryAnimation} hasCarry={needsCarryOrBorrow} />
            </div>
            <div className="h-20 flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-6xl font-display text-gray-700">{num2Ones}</span>
                <ValueBlocks count={operation === 'addition' ? blockDistribution.bottom : num2Ones} type="ones" isClickable={step === 'makeTen'} onClick={onBlockDrop} />
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
                isDisabled={step !== 'tens' || triggerCarryAnimation || triggerBorrowAnimation}
                op={operation}
            />
          </div>
          
          {/* ONES ANSWER */}
          <div className="flex justify-center">
            <PlaceValueInput 
                value={userInput.ones}
                onChange={handleOnesChange}
                onFocus={() => { if(step !== 'makeTen' && step !== 'borrow') setStep('ones')}}
                isActive={step === 'ones'}
                isWrong={isWrong && step === 'ones'}
                maxLength={1}
                inputRef={onesInputRef}
                isDisabled={step === 'makeTen' || step === 'borrow' || triggerCarryAnimation || triggerBorrowAnimation}
                op={operation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
