import {
  ModuleProgress,
  DifficultyLevel,
  LEVEL_REQUIREMENTS,
} from "../types/progress";

export function useModuleAccess() {
  const canAccessModule = (
    userProgress: ModuleProgress[],
    moduleId: string,
    difficulty: DifficultyLevel
  ): boolean => {
    // Always show but enable only beginner modules initially
    if (difficulty === "BEGINNER") {
      return true;
    }

    // For Intermediate, check if ALL beginner modules are completed with required score
    if (difficulty === "INTERMEDIATE") {
      const beginnerModules = userProgress.filter(
        (module) => module.difficulty === "BEGINNER"
      );

      const allBeginnersCompleted = beginnerModules.every(
        (module) =>
          module.completed &&
          module.score >= LEVEL_REQUIREMENTS.BEGINNER.minimumScore
      );

      return allBeginnersCompleted;
    }

    // For Advanced, check if ALL intermediate modules are completed with required score
    if (difficulty === "ADVANCED") {
      const intermediateModules = userProgress.filter(
        (module) => module.difficulty === "INTERMEDIATE"
      );

      const allIntermediateCompleted = intermediateModules.every(
        (module) =>
          module.completed &&
          module.score >= LEVEL_REQUIREMENTS.INTERMEDIATE.minimumScore
      );

      return allIntermediateCompleted;
    }

    return false;
  };

  const getModuleStatus = (
    userProgress: ModuleProgress[],
    moduleId: string,
    difficulty: DifficultyLevel
  ) => {
    const isAccessible = canAccessModule(userProgress, moduleId, difficulty);
    const progress = userProgress.find((p) => p.id === moduleId);
    const requirements = LEVEL_REQUIREMENTS[difficulty];

    let lockMessage = "";
    if (!isAccessible) {
      if (difficulty === "INTERMEDIATE") {
        lockMessage = "Complete all beginner modules first";
      } else if (difficulty === "ADVANCED") {
        lockMessage = "Complete all intermediate modules first";
      }
    }

    return {
      isAccessible,
      isCompleted: progress?.completed || false,
      score: progress?.score || 0,
      attempts: progress?.attempts || 0,
      requirementsMet: isAccessible,
      minimumScoreRequired: requirements.minimumScore,
      lockMessage,
    };
  };

  return {
    canAccessModule,
    getModuleStatus,
  };
}
