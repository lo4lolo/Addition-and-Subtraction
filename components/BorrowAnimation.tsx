import React, { useEffect } from 'react';

interface BorrowAnimationProps {
  isAnimating: boolean;
  onAnimationEnd: () => void;
}

const TensBar: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div
    className="absolute w-2.5 h-12 bg-yellow-400 rounded-sm flex flex-col justify-around p-0.5"
    style={style}
  >
    {Array.from({ length: 10 }).map((_, j) => (
      <div key={j} className="w-1 h-[2px] bg-yellow-600/50 rounded-full"></div>
    ))}
  </div>
);

const OnesBlock: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute w-2 h-2 bg-blue-500 rounded-sm" style={style} />
);

export const BorrowAnimation: React.FC<BorrowAnimationProps> = ({ isAnimating, onAnimationEnd }) => {
  const ANIMATION_DURATION = 2500;

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(onAnimationEnd, ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, onAnimationEnd]);

  if (!isAnimating) return null;

  const tensBarTranslate = {
    x: 'calc(50vw - 11rem)',
    y: '0'
  };
   const tensBarTranslateMobile = {
    x: 'calc(50vw - 6rem)',
    y: '0'
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
      {/* Tens bar that moves */}
      <div className="hidden sm:block">
        <TensBar
          style={{
            top: 'calc(5.5rem + 10px)',
            left: 'calc(1rem + 6px)',
            '--translateX': tensBarTranslate.x,
            '--translateY': tensBarTranslate.y,
            animation: `borrow-tens-bar 1.5s ease-in-out forwards`,
          } as React.CSSProperties}
        />
      </div>
       <div className="sm:hidden">
        <TensBar
          style={{
            top: 'calc(5.5rem + 10px)',
            left: 'calc(1rem + 6px)',
            '--translateX': tensBarTranslateMobile.x,
            '--translateY': tensBarTranslateMobile.y,
            animation: `borrow-tens-bar 1.5s ease-in-out forwards`,
          } as React.CSSProperties}
        />
      </div>

      {/* 10 ones blocks that appear */}
      <div className="absolute grid grid-cols-5 gap-0.5 p-1 w-14 h-14 sm:w-16 sm:h-16" style={{ top: 'calc(5.5rem + 10px)', right: 'calc(1rem + 6px)'}}>
        {Array.from({ length: 10 }).map((_, i) => (
          <OnesBlock key={`ones-${i}`} style={{
            gridColumn: (i % 5) + 1,
            gridRow: Math.floor(i / 5) + 1,
            animation: 'pop-in-ones 0.5s ease-out forwards',
            animationDelay: `${1000 + i * 50}ms`,
            opacity: 0,
          } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
};
