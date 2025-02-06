"use client";

import { motion } from "framer-motion";
import { Lock, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionProgressProps {
  section: TrainingSection;
  progress: {
    completed: boolean;
    score: number;
    moduleScores: Record<string, number>;
  };
  isLocked: boolean;
  onModuleSelect: (moduleId: string) => void;
}

export function SectionProgress({
  section,
  progress,
  isLocked,
  onModuleSelect,
}: SectionProgressProps) {
  return (
    <div className="bg-blue-800/20 p-6 rounded-lg border border-blue-700">
      <div className="flex items-center gap-3 mb-3">
        {section.icon}
        <div>
          <h2 className="text-xl font-semibold text-white">{section.title}</h2>
          <p className="text-blue-200 text-sm">{section.description}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-300">Score:</span>
          <span className="text-sm text-yellow-400">{progress.score || 0}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-300">Difficulty:</span>
          <span className={`text-sm ${
            section.modules[0].difficulty === "BEGINNER"
              ? "text-green-400"
              : section.modules[0].difficulty === "INTERMEDIATE"
              ? "text-yellow-400"
              : "text-red-400"
          }`}>
            {section.modules[0].difficulty}
          </span>
        </div>
      </div>

      <Button
        onClick={() => onModuleSelect(section.id)}
        className={`w-full mt-4 ${
          isLocked
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
        disabled={isLocked}
      >
        {isLocked ? "Locked" : "Start"}
      </Button>
    </div>
  );
}
