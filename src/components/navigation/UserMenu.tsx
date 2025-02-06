"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User, LogOut, LogIn } from "lucide-react";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="animate-pulse bg-blue-800/50 h-8 w-24 rounded" />;
  }

  if (!session) {
    return (
      <Button
        onClick={() => signIn("google")}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <User className="w-8 h-8 p-1 rounded-full bg-blue-800" />
        )}
        <div className="hidden md:block">
          <p className="text-sm font-medium text-white">{session.user?.name}</p>
          <p className="text-xs text-blue-300">
            {session.user?.role?.level || "beginner"} level
          </p>
        </div>
      </div>
      <Button
        onClick={() => signOut()}
        variant="ghost"
        size="sm"
        className="text-blue-300 hover:text-white hover:bg-blue-800"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
}
