
import { useState, useCallback } from 'react';
import type { Problem, UserInput, CalculationStep, BlockDistribution } from '../types';

export const useAdditionProblem = () => {
  const [problem, setProblem] = useState<Problem>({ num1: 0, num2: 0, answer: 0 });
  const [userInput, setUserInput] = useState<UserInput>({ ones: '', tens: '' });
  const [step, setStep] = useState<CalculationStep>('makeTen');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showCarry, setShowCarry] = useState(false);
  const [triggerCarryAnimation, setTriggerCarryAnimation] = useState(false);
  const [blockDistribution, setBlockDistribution] = useState<BlockDistribution>({ top: 0, bottom: 0 });
  const [hasCarry, setHasCarry] = useState(true);

  const resetProblemState = (num1: number, num2: number) => {
    const newProblem = {
      num1,
      num2,
      answer: num1 + num2,
    };
    setProblem(newProblem);
    setBlockDistribution({ top: num1 % 10, bottom: num2 % 10 });
    setUserInput({ ones: '', tens: '' });
    setStep('makeTen');
    setIsCorrect(null);
    setIsWrong(false);
    setFeedbackMessage('');
    setShowCarry(false);
    setTriggerCarryAnimation(false);
    setHasCarry((num1 % 10) + (num2 % 10) >= 10);
  };

  const generateNewProblem = useCallback(() => {
    let num1, num2;
    do {
      num1 = Math.floor(Math.random() * 90) + 10; // 10-99
      num2 = Math.floor(Math.random() * 90) + 10; // 10-99
    } while (
        (num1 % 10 === 0 && num2 % 10 === 0) || // Avoid both ones being 0
        (num1 + num2) >= 100 // Ensure sum is less than 100
    );
    resetProblemState(num1, num2);
  }, []);

  const startManualProblem = ({ num1, num2 }: { num1: number; num2: number }): string | null => {
    if (isNaN(num1) || isNaN(num2) || num1 < 0 || num1 > 99 || num2 < 0 || num2 > 99) {
      return "0부터 99까지의 숫자를 입력해주세요.";
    }
    if (num1 + num2 >= 100) {
      return "합이 100 미만인 문제를 입력해주세요.";
    }

    resetProblemState(num1, num2);
    return null; // Success
  };
  
  const handleBlockDrop = () => {
    if (blockDistribution.bottom > 0) {
      const newDistribution = {
        top: blockDistribution.top + 1,
        bottom: blockDistribution.bottom - 1,
      };
      setBlockDistribution(newDistribution);

      if (hasCarry) {
        if (newDistribution.top === 10) {
          setTriggerCarryAnimation(true);
        }
      } else {
        if (newDistribution.bottom === 0) {
           // All blocks moved, no carry animation
           // Update block distribution to show combined total
           setBlockDistribution({ top: problem.num1 % 10 + problem.num2 % 10, bottom: 0 });
           setStep('ones');
        }
      }
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
      setTimeout(() => setIsWrong(false), 500); // Reset shake animation
    }
  };
  
  const validateOnes = (onesValue: string) => {
    if (!onesValue) return;

    const onesSum = (problem.num1 % 10) + (problem.num2 % 10);
    const correctOnesDigit = onesSum % 10;

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
    setShowCarry(true);
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
    showCarry,
    validateOnes,
    triggerCarryAnimation,
    completeCarryAnimation,
    blockDistribution,
    handleBlockDrop,
    hasCarry,
  };
};
