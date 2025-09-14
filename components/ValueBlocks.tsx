import React from 'react';

interface ValueBlocksProps {
  count: number;
  type: 'ones' | 'tens';
  isAnimating?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
  hasCarry?: boolean;
  strikethrough?: boolean;
}

export const ValueBlocks: React.FC<ValueBlocksProps> = ({ count, type, isAnimating, isClickable, onClick, hasCarry, strikethrough }) => {
  const placeholder = <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center" />;

  if (count === 0 && type === 'ones') {
    return placeholder;
  }
  
  if (type === 'ones' && isAnimating && hasCarry) {
    // Hide the blocks that are being animated into the tens bar
    return placeholder;
  }

  if (type === 'ones') {
    return (
      <div 
        className={`grid grid-cols-5 gap-0.5 p-1 w-14 h-14 sm:w-16 sm:h-16 justify-center content-center transition-colors duration-200 ${isClickable ? 'cursor-pointer hover:bg-blue-200/50 rounded-lg' : ''}`}
        onClick={isClickable ? onClick : undefined}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div 
            key={i} 
            className={`w-2 h-2 bg-blue-500 rounded-sm pop-in`}
            style={{ animationDelay: `${i * 20}ms` }}
          ></div>
        ))}
      </div>
    );
  }

  if (type === 'tens') {
     if (count === 0 && !strikethrough) return null;
    return (
      <div className="flex gap-1 w-auto h-14 sm:h-16 items-center justify-center relative">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`relative transition-opacity duration-300 ${strikethrough && i === count - 1 ? 'opacity-30' : ''}`}>
            <div className="w-2.5 h-12 bg-yellow-400 rounded-sm pop-in flex flex-col justify-around p-0.5" style={{ animationDelay: `${i * 50}ms` }}>
               {Array.from({ length: 10 }).map((_, j) => (
                <div key={j} className="w-1 h-[2px] bg-yellow-600/50 rounded-full"></div>
              ))}
            </div>
            {strikethrough && i === count - 1 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-14 bg-red-500 transform rotate-12"></div>
                </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
};
