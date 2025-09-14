
import React, { useEffect, useState } from 'react';
import { SparkleIcon } from './icons/SparkleIcon';

interface FeedbackModalProps {
  onNextProblem: () => void;
}

const ConfettiPiece: React.FC<{id: number}> = ({ id }) => {
  const colors = ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-pink-400', 'bg-purple-400'];
  const [style, setStyle] = useState({});

  useEffect(() => {
    setStyle({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
      backgroundColor: colors[id % colors.length].replace('bg-', ''),
    });
  }, [id]);

  return (
    <div
      className={`absolute top-0 w-3 h-5 rounded-sm animate-fall`}
      style={style}
    ></div>
  );
};


export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onNextProblem }) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all pop-in">
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {Array.from({ length: 50 }).map((_, i) => (
             <div
              key={i}
              className="absolute opacity-0 sparkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
              }}
            >
              <SparkleIcon className="w-8 h-8 text-yellow-400" />
            </div>
          ))}
        </div>
        
        <div className="relative z-10">
          <div className="mx-auto w-24 h-24 text-green-500 flex items-center justify-center bg-green-100 rounded-full">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="font-display text-3xl font-bold text-gray-800 mt-6">
            참 잘했어요!
          </h2>
          <p className="text-gray-500 mt-2">
            꾸준히 노력하는 모습이 멋져요!
          </p>
          <button
            onClick={onNextProblem}
            className="w-full mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-transform duration-200"
          >
            계속하기
          </button>
        </div>
      </div>
    </div>
  );
};