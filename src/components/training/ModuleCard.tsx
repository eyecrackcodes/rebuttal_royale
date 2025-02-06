import { useModuleAccess } from "@/hooks/useModuleAccess";
import { ModuleProgress } from "@/types/progress";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";

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
  const { getModuleStatus } = useModuleAccess();
  const status = getModuleStatus(userProgress, moduleId, difficulty);

  // Define difficulty colors and labels
  const difficultyConfig = {
    BEGINNER: {
      color: 'text-green-500',
      label: 'BEGINNER',
      bgColor: 'bg-green-500/10'
    },
    INTERMEDIATE: {
      color: 'text-yellow-500',
      label: 'INTERMEDIATE',
      bgColor: 'bg-yellow-500/10'
    },
    ADVANCED: {
      color: 'text-red-500',
      label: 'ADVANCED',
      bgColor: 'bg-red-500/10'
    }
  };

  return (
    <div className={`p-4 rounded-lg ${
      !status.isAccessible 
        ? 'bg-blue-900/20 opacity-60 cursor-not-allowed' 
        : 'bg-blue-900/40'
    }`}>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium">{title}</h3>
          {!status.isAccessible && (
            <Lock className="w-4 h-4 text-gray-400" />
          )}
        </div>
        
        <div className={`inline-flex items-center px-2 py-1 rounded-md ${difficultyConfig[difficulty].bgColor}`}>
          <span className={`text-sm ${difficultyConfig[difficulty].color}`}>
            {difficultyConfig[difficulty].label}
          </span>
        </div>

        <p className="text-sm text-blue-100/80">{description}</p>

        <div className="mt-4">
          {!status.isAccessible ? (
            <div className="flex items-center text-sm text-gray-400 gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{status.lockMessage}</span>
            </div>
          ) : (
            <button
              onClick={onStart}
              className={`px-3 py-1 text-sm rounded-md ${
                status.isCompleted 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {status.isCompleted ? 'Retry' : 'Start'}
            </button>
          )}
        </div>

        {status.isCompleted && (
          <div className="text-sm text-green-400 mt-2">
            Best Score: {status.score}%
          </div>
        )}
      </div>
    </div>
  );
}
