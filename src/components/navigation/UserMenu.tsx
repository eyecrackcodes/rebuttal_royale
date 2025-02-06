"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-white">
        {session.user?.name} ({session.user?.role?.level} level)
      </span>
      <Button variant="outline" size="sm" onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );
}
