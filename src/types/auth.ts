export interface UserRole {
  role: "trainee" | "admin" | "developer";
  level: "beginner" | "intermediate" | "advanced";
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  progress: {
    currentLevel: "beginner" | "intermediate" | "advanced";
    completedModules: string[];
    scores: Record<string, number>;
  };
}
