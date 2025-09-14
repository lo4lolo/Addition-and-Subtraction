import { useState, useCallback } from 'react';
import type { Problem, UserInput, CalculationStep, BlockDistribution, Operation } from '../types';

export const useCalculationProblem = () => {
  const [problem, setProblem] = useState<Problem>({ num1: 0, num2: 0, answer: 0 });
  const [userInput, setUserInput] = useState<UserInput>({ ones: '', tens: '' });
  const [step, setStep] = useState<CalculationStep>('makeTen');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  const [operation, setOperation] = useState<Operation | null>(null);

  // Addition specific state
  const [showCarryOrBorrow, setShowCarryOrBorrow] = useState(false);
  const [triggerCarryAnimation, setTriggerCarryAnimation] = useState(false);
  const [blockDistribution, setBlockDistribution] = useState<BlockDistribution>({ top: 0, bottom: 0 });
  
  // Subtraction specific state
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [triggerBorrowAnimation, setTriggerBorrowAnimation] = useState(false);
  const [num1Visual, setNum1Visual] = useState({ tens: 0, ones: 0});

  const [needsCarryOrBorrow, setNeedsCarryOrBorrow] = useState(true);

  const resetProblemState = (op: Operation, num1: number, num2: number) => {
    const answer = op === 'addition' ? num1 + num2 : num1 - num2;
    const newProblem = { num1, num2, answer };
    setProblem(newProblem);
    setUserInput({ ones: '', tens: '' });
    setIsCorrect(null);
    setIsWrong(false);
    setFeedbackMessage('');
    
    if (op === 'addition') {
      const needsCarry = (num1 % 10) + (num2 % 10) >= 10;
      setBlockDistribution({ top: num1 % 10, bottom: num2 % 10 });
      setStep(needsCarry ? 'makeTen' : 'ones');
      setShowCarryOrBorrow(false);
      setTriggerCarryAnimation(false);
      setNeedsCarryOrBorrow(needsCarry);
      // reset subtraction state
      setIsBorrowed(false);
      setTriggerBorrowAnimation(false);
    } else { // subtraction
      const needsBorrow = (num1 % 10) < (num2 % 10);
      setStep(needsBorrow ? 'borrow' : 'ones');
      setNeedsCarryOrBorrow(needsBorrow);
      setIsBorrowed(false);
      setTriggerBorrowAnimation(false);
      setNum1Visual({ tens: Math.floor(num1 / 10), ones: num1 % 10 });
      // reset addition state
      setShowCarryOrBorrow(false);
      setTriggerCarryAnimation(false);
    }
  };

  const generateNewProblem = useCallback((op: Operation) => {
    let num1, num2;
    if (op === 'addition') {
      do {
        num1 = Math.floor(Math.random() * 90) + 10;
        num2 = Math.floor(Math.random() * 90) + 10;
      } while (num1 + num2 >= 100 || (num1 % 10) + (num2 % 10) < 10); // Ensure carry is needed
    } else { // subtraction
      do {
        num1 = Math.floor(Math.random() * 90) + 10;
        num2 = Math.floor(Math.random() * 90) + 10;
      } while (num1 <= num2 || (num1 % 10) >= (num2 % 10)); // Ensure borrow is needed and num1 > num2
    }
    resetProblemState(op, num1, num2);
  }, []);

  const startManualProblem = (op: Operation, { num1, num2 }: { num1: number; num2: number }): string | null => {
    if (isNaN(num1) || isNaN(num2) || num1 < 0 || num1 > 99 || num2 < 0 || num2 > 99) {
      return "0부터 99까지의 숫자를 입력해주세요.";
    }
    if (op === 'addition') {
      if (num1 + num2 >= 100) return "합이 100 미만인 문제를 입력해주세요.";
    } else { // subtraction
      if (num1 < num2) return "첫 번째 숫자가 두 번째 숫자보다 크거나 같아야 해요.";
    }

    resetProblemState(op, num1, num2);
    return null;
  };
  
  const handleBlockDrop = () => {
    if (blockDistribution.bottom > 0) {
      const newDistribution = {
        top: blockDistribution.top + 1,
        bottom: blockDistribution.bottom - 1,
      };
      setBlockDistribution(newDistribution);
      if (needsCarryOrBorrow && newDistribution.top === 10) {
        setTriggerCarryAnimation(true);
      } else if (!needsCarryOrBorrow && newDistribution.bottom === 0) {
         setBlockDistribution({ top: problem.num1 % 10 + problem.num2 % 10, bottom: 0 });
         setStep('ones');
      }
    }
  };
  
  const handleBorrow = () => {
    if (step === 'borrow' && needsCarryOrBorrow) {
      setTriggerBorrowAnimation(true);
    }
  };

  const checkAnswer = () => {
    const userAnswer = parseInt(`${userInput.tens}${userInput.ones}`, 10);
    if (userAnswer === problem.answer) {
      setIsCorrect(true);
      setIsWrong(false);
      setStep('correct');
      setFeedbackMessage('정답이에요! 참 잘했어요!');
    } else {
      setIsCorrect(false);
      setIsWrong(true);
      setFeedbackMessage('아쉬워요, 다시 한번 생각해볼까요?');
      setTimeout(() => setIsWrong(false), 500);
    }
  };
  
  const validateOnes = (onesValue: string) => {
    if (!onesValue) return;

    let correctOnesDigit;
    if (operation === 'addition') {
        const onesSum = (problem.num1 % 10) + (problem.num2 % 10);
        correctOnesDigit = onesSum % 10;
    } else { // subtraction
        const num1Ones = problem.num1 % 10;
        const num2Ones = problem.num2 % 10;
        correctOnesDigit = isBorrowed ? (num1Ones + 10) - num2Ones : num1Ones - num2Ones;
    }

    if (parseInt(onesValue, 10) === correctOnesDigit) {
      setIsWrong(false);
      setStep('tens');
    } else {
      setIsWrong(true);
      setFeedbackMessage('일의 자리 계산이 맞는지 다시 확인해봐요!');
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const completeCarryAnimation = () => {
    const onesSum = (problem.num1 % 10) + (problem.num2 % 10);
    const remainingOnes = onesSum % 10;
    setBlockDistribution({ top: 0, bottom: remainingOnes });

    setTriggerCarryAnimation(false);
    setShowCarryOrBorrow(true);
    setStep('ones');
  };
  
  const completeBorrowAnimation = () => {
    setIsBorrowed(true);
    setNum1Visual({
        tens: Math.floor(problem.num1 / 10) - 1,
        ones: problem.num1 % 10 + 10,
    });
    setTriggerBorrowAnimation(false);
    setStep('ones');
  };

  return {
    problem,
    userInput,
    setUserInput,
    step,
    setStep,
    isCorrect,
    feedbackMessage,
    isWrong,
    checkAnswer,
    generateNewProblem,
    startManualProblem,
    showCarryOrBorrow,
    validateOnes,
    triggerCarryAnimation,
    completeCarryAnimation,
    blockDistribution,
    handleBlockDrop,
    needsCarryOrBorrow,
    operation,
    setOperation,
    isBorrowed,
    triggerBorrowAnimation,
    completeBorrowAnimation,
    handleBorrow,
    num1Visual,
  };
};
