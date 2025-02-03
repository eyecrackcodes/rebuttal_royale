"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Star, Phone, Shield, Target, Users, Sun, Moon } from "lucide-react";
import InteractiveSession from "@/components/training/InteractiveSession";
import RebuttalRoyale from "@/components/training/RebuttalRoyale";
import { useTheme } from "next-themes";

export default function Home() {
  const [activeMode, setActiveMode] = React.useState<"call" | "rebuttal">(
    "call"
  );
  const { theme, setTheme } = useTheme();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 dark:from-gray-900 dark:to-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section with Theme Toggle */}
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
        <div className="max-w-4xl mx-auto">
          {activeMode === "call" ? <InteractiveSession /> : <RebuttalRoyale />}
        </div>

        {/* Training Modules Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {/* Customer-Centric Sales Module */}
          <div className="bg-blue-800/20 p-6 rounded-lg border border-blue-700 hover:border-orange-400 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-6 h-6 text-orange-400" />
              <h2 className="text-xl font-semibold">
                5-Star Experience Training
              </h2>
            </div>
            <p className="text-blue-200 mb-4">
              Master the art of delivering exceptional customer experiences
            </p>
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              Start Training
            </Button>
          </div>

          {/* Cold Calling Excellence */}
          <div className="bg-blue-800/20 p-6 rounded-lg border border-blue-700 hover:border-orange-400 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-6 h-6 text-orange-400" />
              <h2 className="text-xl font-semibold">Cold Calling Mastery</h2>
            </div>
            <p className="text-blue-200 mb-4">
              Perfect your opening lines with our proven methodology
            </p>
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              Practice Now
            </Button>
          </div>

          {/* Performance Training */}
          <div className="bg-blue-800/20 p-6 rounded-lg border border-blue-700 hover:border-orange-400 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-orange-400" />
              <h2 className="text-xl font-semibold">Performance Simulator</h2>
            </div>
            <p className="text-blue-200 mb-4">
              Practice real-world scenarios and track your progress
            </p>
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              Start Simulation
            </Button>
          </div>
        </div>

        {/* Progress Dashboard */}
        <div className="mt-12 bg-blue-800/20 p-6 rounded-lg border border-blue-700">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-semibold">Your Growth Journey</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-orange-400" />
                <span>Customer Experience Score</span>
              </div>
              <span className="text-orange-400">85%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-400" />
                <span>Engagement Effectiveness</span>
              </div>
              <span className="text-orange-400">70%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-orange-400" />
                <span>Positive Interaction Rate</span>
              </div>
              <span className="text-orange-400">90%</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
