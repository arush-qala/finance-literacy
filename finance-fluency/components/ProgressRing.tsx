import React from 'react';

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number;
  color?: string;
  trackColor?: string;
  textColor?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ 
  radius, 
  stroke, 
  progress,
  color = "text-indigo-600",
  trackColor = "text-slate-200",
  textColor = "text-slate-800"
}) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="rotate-[-90deg]"
      >
        <circle
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={trackColor}
        />
        <circle
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={`${color} transition-all duration-500 ease-in-out`}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`text-sm font-bold ${textColor}`}>{progress}%</span>
        <span className="text-[9px] text-slate-500 uppercase font-semibold tracking-wider">Complete</span>
      </div>
    </div>
  );
};