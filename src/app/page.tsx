"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, Shield, Sun, Moon } from "lucide-react";
import CallTraining from "@/components/training/CallTraining";
import RebuttalRoyale from "@/components/training/RebuttalRoyale";
import { useTheme } from "next-themes";

export default function Home() {
  const [activeMode, setActiveMode] = React.useState<"call" | "rebuttal">("call");
  const { theme, setTheme } = useTheme();

  return (
    <main>
      {/* Header Section */}
      <header className="text-center mb-12 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
          Luminary Life Academy
        </h1>
        <p className="text-blue-200 mt-2">
          Elevating Excellence in Sales Performance
        </p>
      </header>

      {/* Mode Selection */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          onClick={() => setActiveMode("call")}
          className={`${
            activeMode === "call"
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-blue-800/50 hover:bg-blue-800"
          }`}
        >
          <Phone className="w-4 h-4 mr-2" />
          Call Training
        </Button>
        <Button
          onClick={() => setActiveMode("rebuttal")}
          className={`${
            activeMode === "rebuttal"
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-blue-800/50 hover:bg-blue-800"
          }`}
        >
          <Shield className="w-4 h-4 mr-2" />
          Rebuttal Royale
        </Button>
      </div>

      {/* Active Training Mode */}
      <div className="max-w-6xl mx-auto">
        {activeMode === "call" ? (
          <div className="space-y-6">
            <CallTraining />
          </div>
        ) : (
          <RebuttalRoyale />
        )}
      </div>
    </main>
  );
}
