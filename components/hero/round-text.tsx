'use client';

import { cn } from '@/lib/utils';

interface RoundTextProps {
  text: string;
  className?: string;
  size?: number;
  duration?: number;
  reverse?: boolean;
}

export function RoundText({
  text,
  className,
  size = 140,
  duration = 10,
  reverse = false,
}: RoundTextProps) {
  const repeatedText = text;

  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-spin"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: !reverse ? 'reverse' : 'normal',
        }}>
        <defs>
          <path
            id="circlePath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="none"
          />
        </defs>
        <text className="fill-background text-[6px] font-sans">
          <textPath href="#circlePath" startOffset="0%" textLength="232" lengthAdjust="spacing">
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
