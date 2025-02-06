import { useModuleAccess } from "@/hooks/useModuleAccess";
import { ModuleProgress } from "@/types/progress";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserAccess";

interface ModuleCardProps {
  moduleId: string;
  title: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  userProgress: ModuleProgress[];
  onStart: () => void;
}

export function ModuleCard({
  moduleId,
  title,
  description,
  difficulty,
  userProgress,
  onStart,
}: ModuleCardProps) {
  const { canAccessLevel } = useUserAccess();
  const { getModuleStatus } = useModuleAccess();

  const status = getModuleStatus(userProgress, moduleId, difficulty);
  const canAccess = canAccessLevel(
    difficulty.toLowerCase() as "beginner" | "intermediate" | "advanced"
  );

  const isLocked = !canAccess || !status.isAccessible;

  // Define difficulty colors
  const difficultyColors = {
    BEGINNER: "text-green-500",
    INTERMEDIATE: "text-yellow-500",
    ADVANCED: "text-red-500",
  };

  return (
    <div
      className={`p-4 rounded-lg ${
        status.isAccessible ? "bg-blue-900/40" : "bg-blue-900/20 opacity-60"
      }`}
    >
      <div className="flex flex-col space-y-2">
        <h3 className="text-white font-medium">{title}</h3>

        <div className="flex items-center justify-between">
          <span className={`text-sm ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
          {status.isCompleted && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
        </div>

        <p className="text-sm text-blue-100/80">{description}</p>

        <div className="flex items-center justify-between mt-4">
          {!status.isAccessible ? (
            <div className="flex items-center text-sm text-gray-400 gap-2">
              <Lock className="w-4 h-4" />
              <span>Complete beginner modules first</span>
            </div>
          ) : (
            <button
              onClick={onStart}
              className={`px-3 py-1 text-sm rounded-md ${
                status.isCompleted
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              Start
            </button>
          )}
        </div>

        {status.isCompleted && (
          <div className="text-sm text-green-400">Score: {status.score}%</div>
        )}
      </div>
    </div>
  );
}
