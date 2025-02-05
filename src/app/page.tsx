"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, Shield, Sun, Moon } from "lucide-react";
import CallTraining from "@/components/training/CallTraining";
import RebuttalRoyale from "@/components/training/RebuttalRoyale";
import { useTheme } from "next-themes";

export default function Home() {
  const [activeMode, setActiveMode] = React.useState<"call" | "rebuttal">(
    "call"
  );
  const { theme, setTheme } = useTheme();

  return (
    <main className="min-h-screen theme-transition bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:to-gray-950">
      {/* Header Section */}
      <header className="text-center mb-12 relative p-8 theme-transition">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 theme-transition hover:bg-blue-100 dark:hover:bg-gray-800"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-500 transition-all duration-300 hover:rotate-45" />
          ) : (
            <Moon className="h-5 w-5 text-blue-500 transition-all duration-300 hover:-rotate-45" />
          )}
        </Button>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-400 dark:to-yellow-300 bg-clip-text text-transparent animate-gradient">
          Luminary Life Academy
        </h1>
        <p className="text-blue-600 dark:text-blue-200 mt-2 transition-colors duration-300">
          Elevating Excellence in Sales Performance
        </p>
      </header>

      {/* Mode Selection with enhanced styling */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          onClick={() => setActiveMode("call")}
          className={`theme-transition ${
            activeMode === "call"
              ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 lightsaber-effect"
              : "bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100"
          }`}
        >
          <Phone className="w-4 h-4 mr-2" />
          Call Training
        </Button>
        <Button
          onClick={() => setActiveMode("rebuttal")}
          className={`theme-transition ${
            activeMode === "rebuttal"
              ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 lightsaber-effect"
              : "bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100"
          }`}
        >
          <Shield className="w-4 h-4 mr-2" />
          Rebuttal Royale
        </Button>
      </div>

      {/* Active Training Mode */}
      <div className="max-w-6xl mx-auto px-4">
        {activeMode === "call" ? (
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-700 theme-transition">
            <CallTraining />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-700 theme-transition">
            <RebuttalRoyale />
          </div>
        )}
      </div>
    </main>
  );
}
