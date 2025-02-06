export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface ModuleProgress {
  id: string;
  moduleType:
    | "INTAKE"
    | "ELIGIBILITY"
    | "SITUATION"
    | "CREDIBILITY"
    | "LUMINARY_INDEX"
    | "UNDERWRITING"
    | "EDUCATION"
    | "RECAP"
    | "COVERAGE_LEVELS"
    | "APPLICATION";
  difficulty: DifficultyLevel;
  completed: boolean;
  score: number;
  attempts: number;
  dateCompleted?: Date;
  lastAttempted?: Date;
}

export interface LevelRequirements {
  minimumScore: number;
  requiredModules: string[];
}

export const LEVEL_REQUIREMENTS: Record<DifficultyLevel, LevelRequirements> = {
  BEGINNER: {
    minimumScore: 70,
    requiredModules: [], // Beginner modules are always available
  },
  INTERMEDIATE: {
    minimumScore: 75,
    requiredModules: [
      "intake-beginner",
      "eligibility-beginner",
      "situation-beginner",
      "credibility-beginner",
      "luminary-index-beginner",
      "underwriting-beginner",
      "education-beginner",
      "recap-beginner",
      "coverage-levels-beginner",
      "application-beginner",
    ],
  },
  ADVANCED: {
    minimumScore: 80,
    requiredModules: [
      "intake-intermediate",
      "eligibility-intermediate",
      "situation-intermediate",
      "credibility-intermediate",
      "luminary-index-intermediate",
      "underwriting-intermediate",
      "education-intermediate",
      "recap-intermediate",
      "coverage-levels-intermediate",
      "application-intermediate",
    ],
  },
};
