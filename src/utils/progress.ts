import { ModuleProgress, DifficultyLevel } from '@/types/progress';

export function updateModuleProgress(
  currentProgress: ModuleProgress[],
  moduleId: string,
  score: number
): ModuleProgress[] {
  const now = new Date();
  const passingScore = 70; // Basic passing score for all levels

  return currentProgress.map(module => {
    if (module.id === moduleId) {
      return {
        ...module,
        attempts: module.attempts + 1,
        score: Math.max(module.score, score), // Keep highest score
        completed: score >= passingScore,
        lastAttempted: now,
        dateCompleted: score >= passingScore ? now : module.dateCompleted,
      };
    }
    return module;
  });
}

export function isModuleAvailable(
  currentProgress: ModuleProgress[],
  moduleId: string,
  difficulty: DifficultyLevel
): boolean {
  // Beginner modules always available
  if (difficulty === 'BEGINNER') {
    return true;
  }

  // For Intermediate, check if all beginner modules are completed
  if (difficulty === 'INTERMEDIATE') {
    const beginnerModules = currentProgress.filter(
      module => module.difficulty === 'BEGINNER'
    );
    return beginnerModules.every(module => module.completed);
  }

  // For Advanced, check if all intermediate modules are completed
  if (difficulty === 'ADVANCED') {
    const intermediateModules = currentProgress.filter(
      module => module.difficulty === 'INTERMEDIATE'
    );
    return intermediateModules.every(module => module.completed);
  }

  return false;
}

export function getModuleCompletion(currentProgress: ModuleProgress[]): {
  beginner: number;
  intermediate: number;
  advanced: number;
} {
  const getCompletionRate = (difficulty: DifficultyLevel) => {
    const modules = currentProgress.filter(m => m.difficulty === difficulty);
    const completed = modules.filter(m => m.completed).length;
    return modules.length ? Math.round((completed / modules.length) * 100) : 0;
  };

  return {
    beginner: getCompletionRate('BEGINNER'),
    intermediate: getCompletionRate('INTERMEDIATE'),
    advanced: getCompletionRate('ADVANCED'),
  };
} 