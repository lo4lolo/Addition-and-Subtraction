
import React, { useEffect } from 'react';

interface CarryAnimationProps {
  isAnimating: boolean;
  onAnimationEnd: () => void;
}

const Block: React.FC<{ style: React.CSSProperties, className?: string }> = ({ style, className }) => (
    <div className={`absolute w-2 h-2 bg-blue-500 rounded-sm ${className}`} style={style} />
);

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

export const CarryAnimation: React.FC<CarryAnimationProps> = ({ isAnimating, onAnimationEnd }) => {
  const ANIMATION_DURATION = 2500;

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(onAnimationEnd, ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, onAnimationEnd]);

  if (!isAnimating) return null;

  const getBlockPosition = (index: number) => ({
      gridColumn: (index % 5) + 1,
      gridRow: Math.floor(index / 5) + 1,
  });

  const blocksToAnimate = Array.from({ length: 10 });
  
  // Responsive final position for the tens bar
  const tensBarFinalTranslate = {
    x: 'calc(-50vw + 18rem)',
    y: '-17vh'
  };
  const tensBarFinalTranslateMobile = {
    x: 'calc(-50vw + 9rem)',
    y: '-17vh'
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
        
        {/* Container for the 10 blocks that will gather */}
        <div className="absolute grid grid-cols-5 gap-0.5 p-1 w-14 h-14 sm:w-16 sm:h-16" style={{ top: 'calc(5.5rem + 10px)', right: 'calc(1rem + 6px)'}}>
            {blocksToAnimate.map((_, i) => (
                <Block key={`anim-${i}`} className="animate-gather" style={{
                    ...getBlockPosition(i),
                    '--gather-x': '0%',
                    '--gather-y': '200%',
                    animation: `gather-ones-top 1s ease-in-out forwards`,
                    animationDelay: `${i * 50}ms`,
                } as React.CSSProperties}/>
            ))}
        </div>

      {/* Yellow tens bar that forms and moves */}
      <div className="hidden sm:block">
        <TensBar
          style={{
            top: '55%',
            right: '25%',
            '--translateX': tensBarFinalTranslate.x,
            '--translateY': tensBarFinalTranslate.y,
            animation: `form-and-move-tens-bar 2s ease-in-out forwards`,
            animationDelay: `500ms`,
          } as React.CSSProperties}
        />
      </div>
      <div className="sm:hidden">
         <TensBar
            style={{
              top: '55%',
              right: '25%',
              '--translateX': tensBarFinalTranslateMobile.x,
              '--translateY': tensBarFinalTranslateMobile.y,
              animation: `form-and-move-tens-bar 2s ease-in-out forwards`,
              animationDelay: `500ms`,
            } as React.CSSProperties}
          />
      </div>
    </div>
  );
};
