import { ModuleProgress } from "@/types/progress";

const REQUIRED_BEGINNER_SCORE = 70;
const REQUIRED_INTERMEDIATE_SCORE = 80;

export const progressService = {
  // Check if user can unlock intermediate level
  canUnlockIntermediate(progress: ModuleProgress[]): boolean {
    const beginnerModules = progress.filter(
      (module) => module.difficulty === "BEGINNER"
    );

    // All beginner modules must be completed with minimum score
    return (
      beginnerModules.length > 0 &&
      beginnerModules.every(
        (module) => module.completed && module.score >= REQUIRED_BEGINNER_SCORE
      )
    );
  },

  // Check if user can unlock advanced level
  canUnlockAdvanced(progress: ModuleProgress[]): boolean {
    const intermediateModules = progress.filter(
      (module) => module.difficulty === "INTERMEDIATE"
    );

    // All intermediate modules must be completed with minimum score
    return (
      intermediateModules.length > 0 &&
      intermediateModules.every(
        (module) =>
          module.completed && module.score >= REQUIRED_INTERMEDIATE_SCORE
      )
    );
  },

  // Update module progress
  updateProgress(
    currentProgress: ModuleProgress[],
    moduleId: string,
    score: number
  ): ModuleProgress[] {
    return currentProgress.map((module) => {
      if (module.id === moduleId) {
        return {
          ...module,
          score: Math.max(module.score, score), // Keep highest score
          completed: score >= REQUIRED_BEGINNER_SCORE,
          attempts: module.attempts + 1,
          lastAttempted: new Date(),
          dateCompleted:
            score >= REQUIRED_BEGINNER_SCORE
              ? new Date()
              : module.dateCompleted,
        };
      }
      return module;
    });
  },
};
