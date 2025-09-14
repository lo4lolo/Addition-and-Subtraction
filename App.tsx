
import React, { useState } from 'react';
import { CalculationProblem } from './components/CalculationProblem';
import { FeedbackModal } from './components/FeedbackModal';
import { Instructions } from './components/Instructions';
import { useCalculationProblem } from './hooks/useCalculationProblem';
import { ProblemSetup } from './components/ProblemSetup';
import { OperationSelection } from './components/OperationSelection';
import type { Operation } from './types';

type AppMode = 'select_op' | 'setup' | 'problem';

const App: React.FC = () => {
  const {
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
  } = useCalculationProblem();

  const [mode, setMode] = useState<AppMode>('select_op');
  const [showModal, setShowModal] = useState(false);
  const [logCopied, setLogCopied] = useState(false);
  
  const handleSelectOperation = (op: Operation) => {
    setOperation(op);
    setMode('setup');
  };

  const handleStartRandom = () => {
    if (!operation) return;
    generateNewProblem(operation);
    setMode('problem');
  };
  
  const handleStartManual = (num1: number, num2: number): string | null => {
    if (!operation) return null;
    const error = startManualProblem(operation, { num1, num2 });
    if (error) {
      return error;
    }
    setMode('problem');
    return null;
  };
  
  const handleBackToSetup = () => {
    setMode('setup');
  };
  
  const handleBackToOpSelect = () => {
    setMode('select_op');
  }

  React.useEffect(() => {
    if (isCorrect) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isCorrect]);

  const handleNextProblem = () => {
    setShowModal(false);
    handleStartRandom();
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    checkAnswer();
  };

  const handleCopyLog = () => {
    const now = new Date();
    const dateTime = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const opText = operation === 'addition' ? '덧셈' : '뺄셈';
    const operator = operation === 'addition' ? '+' : '-';
    
    const content = `[${dateTime}]\n지도 내용: 두 자리 수 ${opText}(${problem.num1} ${operator} ${problem.num2}) 학습을 진행했습니다.`;

    navigator.clipboard.writeText(content).then(() => {
      setLogCopied(true);
      setTimeout(() => setLogCopied(false), 2000);
    });
  };
  
  const getTitle = () => {
    if (mode === 'problem' && operation) {
      return operation === 'addition' ? '차근차근 덧셈박사' : '차근차근 뺄셈박사';
    }
    return '차근차근 덧셈뺄셈';
  };
  
  const getSubtitle = () => {
    if (mode === 'problem' && operation) {
        return operation === 'addition' ? '두 자리 수 덧셈을 배워봐요' : '두 자리 수 뺄셈을 배워봐요';
    }
    return '덧셈과 뺄셈을 배워봐요';
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-gray-800">
      <main className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all">
        <header className="text-center mb-6">
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-blue-600">
            {getTitle()}
          </h1>
          <p className="text-gray-500 mt-2 text-base sm:text-lg">{getSubtitle()}</p>
        </header>
        
        {mode === 'select_op' && <OperationSelection onSelect={handleSelectOperation} />}

        {mode === 'setup' && operation && (
           <ProblemSetup onStartRandom={handleStartRandom} onStartManual={handleStartManual} onBack={handleBackToOpSelect} operation={operation} />
        )}

        {mode === 'problem' && operation && (
          <div className="space-y-6">
            <Instructions step={step} isWrong={isWrong} feedbackMessage={feedbackMessage} needsCarryOrBorrow={needsCarryOrBorrow} operation={operation} />
            <form onSubmit={handleSubmit}>
              <CalculationProblem
                problem={problem}
                userInput={userInput}
                setUserInput={setUserInput}
                step={step}
                setStep={setStep}
                showCarryOrBorrow={showCarryOrBorrow}
                isWrong={isWrong}
                validateOnes={validateOnes}
                triggerCarryAnimation={triggerCarryAnimation}
                completeCarryAnimation={completeCarryAnimation}
                blockDistribution={blockDistribution}
                onBlockDrop={handleBlockDrop}
                needsCarryOrBorrow={needsCarryOrBorrow}
                operation={operation}
                isBorrowed={isBorrowed}
                triggerBorrowAnimation={triggerBorrowAnimation}
                completeBorrowAnimation={completeBorrowAnimation}
                onBorrow={handleBorrow}
                num1Visual={num1Visual}
              />

              <div className="mt-8 text-center">
                {isCorrect ? (
                  <button
                    type="button"
                    onClick={handleNextProblem}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-transform duration-200"
                  >
                    새 문제 풀기
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-transform duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={step === 'makeTen' || step === 'borrow' || userInput.tens.length === 0 || userInput.ones.length === 0 || triggerCarryAnimation || triggerBorrowAnimation}
                  >
                    정답 확인!
                  </button>
                )}
              </div>
            </form>
            <div className="mt-6 text-center border-t pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
               <button
                  type="button"
                  onClick={handleBackToSetup}
                  className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-base shadow-sm transition-colors duration-200"
                >
                  문제 선택으로
                </button>
                <button
                type="button"
                onClick={handleCopyLog}
                className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg text-base shadow-sm transition-colors duration-200"
              >
                지도 일지 기록하기 ✏️
              </button>
              {logCopied && (
                <p className="text-green-600 text-sm pop-in absolute -bottom-6">
                  클립보드에 복사되었어요!
                </p>
              )}
            </div>
          </div>
        )}
      </main>
      <footer className="text-center mt-8 text-gray-500 font-sans text-sm">
        <p>Made by 하는교사</p>
      </footer>
      {showModal && <FeedbackModal onNextProblem={handleNextProblem} />}
    </div>
  );
};

export default App;
