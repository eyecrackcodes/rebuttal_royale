"use client";

import { motion } from "framer-motion";
import { Lock, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionProgressProps {
  section: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    requiredScore: number;
  };
  progress: {
    completed: boolean;
    score: number;
    moduleScores: Record<string, number>;
  };
  isLocked?: boolean;
  isAdvancedUnlocked?: boolean;
  onModuleSelect: (moduleId: string) => void;
}

export function SectionProgress({
  section,
  progress,
  isLocked,
  isAdvancedUnlocked,
  onModuleSelect,
}: SectionProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-900/30 p-4 rounded-lg border border-blue-700"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-orange-400">{section.icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-white">{section.title}</h3>
          <p className="text-sm text-blue-200">{section.description}</p>
        </div>
        {progress.completed && (
          <div className="ml-auto">
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between bg-blue-950/50 p-3 rounded">
          <div className="flex items-center gap-2">
            {progress.score > 0 ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <div className="w-4 h-4" />
            )}
            <span className="text-blue-100">Score: {progress.score}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs ${
                !isAdvancedUnlocked || section.difficulty === "BEGINNER"
                  ? "text-green-400"
                  : section.difficulty === "INTERMEDIATE"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {!isAdvancedUnlocked ? "BEGINNER" : section.difficulty}
            </span>
            {isLocked ? (
              <Lock className="w-4 h-4 text-gray-500" />
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onModuleSelect(section.id)}
                className="text-blue-200 hover:text-blue-100"
              >
                Start
              </Button>
            )}
          </div>
        </div>
      </div>

      {progress.completed && (
        <div className="mt-4 flex justify-between items-center text-sm">
          <span className="text-blue-200">
            Required Score: {section.requiredScore}%
          </span>
          <span className="text-yellow-400 font-semibold">
            {progress.score}%
          </span>
        </div>
      )}
    </motion.div>
  );
}
