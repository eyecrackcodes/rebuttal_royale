"use client";

interface ProgressBarProps {
  currentScore: number;
  nextLevelScore: number;
  previousLevelScore: number;
}

export function ProgressBar({ currentScore, nextLevelScore, previousLevelScore }: ProgressBarProps) {
  const progress = ((currentScore - previousLevelScore) / (nextLevelScore - previousLevelScore)) * 100;

  return (
    <div className="w-full bg-blue-900/30 rounded-full h-2.5 mb-4">
      <div
        className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
} 