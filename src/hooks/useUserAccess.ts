import { useSession } from "next-auth/react";

export function useUserAccess() {
  const { data: session } = useSession();

  const userLevel = session?.user?.role?.level || "beginner";

  return {
    canAccessLevel: (level: "beginner" | "intermediate" | "advanced") => {
      const levels = ["beginner", "intermediate", "advanced"];
      const userLevelIndex = levels.indexOf(userLevel);
      const targetLevelIndex = levels.indexOf(level);
      return userLevelIndex >= targetLevelIndex;
    },

    userLevel,

    isAuthenticated: !!session,

    isAdmin: session?.user?.role?.role === "admin",
  };
}
