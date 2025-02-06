import { ModuleProgress } from "@/types/progress";
import { getModuleCompletion } from "@/utils/progress";

interface ProgressOverviewProps {
  progress: ModuleProgress[];
}

export function ProgressOverview({ progress }: ProgressOverviewProps) {
  const completion = getModuleCompletion(progress);

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-semibold">Training Progress</h2>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Beginner Modules</span>
            <span>{completion.beginner}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${completion.beginner}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Intermediate Modules</span>
            <span>{completion.intermediate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${completion.intermediate}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Advanced Modules</span>
            <span>{completion.advanced}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${completion.advanced}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
