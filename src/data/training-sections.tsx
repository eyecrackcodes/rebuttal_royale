import React from "react";
import {
  Phone,
  ClipboardCheck,
  MessageCircle,
  Shield,
  BarChart,
  FileCheck,
  GraduationCap,
  RefreshCw,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { TrainingSection } from "@/types/training";
import { intakeScenarios } from "./scenarios/intake";
import { eligibilityScenarios } from "./scenarios/eligibility";
import { situationScenarios } from "./scenarios/situation";
import { credibilityScenarios } from "./scenarios/credibility";
import { luminaryIndexScenarios } from "./scenarios/luminaryIndex";
import { underwritingScenarios } from "./scenarios/underwriting";
import { educationScenarios } from "./scenarios/education";
import { recapScenarios } from "./scenarios/recap";
import { coverageLevelsScenarios } from "./scenarios/coverageLevels";
import { applicationScenarios } from "./scenarios/application";
import { TRAINING_SECTIONS } from "@/data/training-sections";
import { ModuleCard } from "@/components/training/ModuleCard";
import { ProgressOverview } from "@/components/training/ProgressOverview";
import { ModuleProgress } from "@/types/progress";
import { useState, useEffect } from "react";

export const TRAINING_SECTIONS: TrainingSection[] = [
  {
    id: "intake",
    title: "Initial Contact",
    description:
      "Master the complete intake process following the exact script",
    icon: <Phone className="w-6 h-6" />,
    modules: intakeScenarios,
    requiredScore: 70,
    completionPhrases: [
      "Here's what we'll do over the next few minutes",
      "Let me walk you through what happens next",
      "Let me explain how we'll proceed",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility Questions",
    description:
      "Practice gathering essential eligibility information effectively",
    icon: <ClipboardCheck className="w-6 h-6" />,
    modules: eligibilityScenarios,
    requiredScore: 70,
    completionPhrases: [
      "Now let's verify your eligibility",
      "Let me check your qualification",
      "Let's confirm your eligibility",
    ],
    aiSettings: {
      speechDetection: {
        minSilenceBeforeResponse: 2000,
        endOfUtteranceThreshold: 1500,
        interruptionPrevention: true,
        continuousSpeechDetection: true,
      },
      responseDelay: {
        default: 1000,
        afterEmotionalContent: 2500,
        afterQuestion: 1500,
      },
      turnTaking: {
        waitForCompleteStop: true,
        detectUserResuming: true,
        backoffOnOverlap: true,
      },
    },
  },
  {
    id: "situation",
    title: "Understanding the Situation",
    description: "Learn to gather and understand client situations effectively",
    icon: <MessageCircle className="w-6 h-6" />,
    modules: situationScenarios,
    requiredScore: 70,
    completionPhrases: [
      "Let me understand your situation better",
      "Tell me more about your needs",
      "Help me understand your concerns",
    ],
  },
  {
    id: "credibility",
    title: "Credibility",
    description: "Build trust and establish professional credibility",
    icon: <Shield className="w-6 h-6" />,
    modules: credibilityScenarios,
    requiredScore: 70,
    completionPhrases: [
      "Let me share our credentials",
      "Here's why you can trust us",
      "Let me verify my credentials",
    ],
  },
  {
    id: "luminary-index",
    title: "Luminary Life Index",
    description:
      "Master explaining our proprietary coverage calculation system",
    icon: <BarChart className="w-6 h-6" />,
    modules: luminaryIndexScenarios,
    requiredScore: 70,
    completionPhrases: [
      "Let me explain how we calculate your coverage",
      "Here's how we determine the right amount",
      "Let's review your protection needs",
    ],
  },
  {
    id: "underwriting",
    title: "Underwriting (4 Factors)",
    description:
      "Learn to explain underwriting factors clearly and professionally",
    icon: <FileCheck className="w-6 h-6" />,
    modules: underwritingScenarios,
    requiredScore: 70,
    completionPhrases: [
      "Let's review the four main factors",
      "Here's what determines your rate",
      "Let me explain how we evaluate coverage",
    ],
  },
  {
    id: "education",
    title: "Education",
    description: "Master product education and feature explanation",
    icon: <GraduationCap className="w-6 h-6" />,
    modules: educationScenarios,
    requiredScore: 70,
    completionPhrases: [
      "Let me explain how our coverage works",
      "Here's what makes our protection unique",
      "Let's review the key benefits",
    ],
  },
  {
    id: "recap",
    title: "Recap",
    description: "Master the art of summarizing and confirming understanding",
    icon: <RefreshCw className="w-6 h-6" />,
    modules: recapScenarios,
    requiredScore: 70,
    completionPhrases: [
      "Let me summarize what we've discussed",
      "To make sure I understand everything",
      "Let's review what we've covered",
    ],
  },
  {
    id: "coverage-levels",
    title: "Coverage Levels & Pricing",
    description:
      "Learn to explain coverage options and pricing structure effectively",
    icon: <DollarSign className="w-6 h-6" />,
    modules: coverageLevelsScenarios,
    requiredScore: 70,
    completionPhrases: [
      "Let me explain our coverage options",
      "Here's how our pricing works",
      "Let's review the protection levels",
    ],
  },
  {
    id: "application",
    title: "Application (Closing)",
    description: "Master the application process and closing techniques",
    icon: <CheckCircle className="w-6 h-6" />,
    modules: applicationScenarios,
    requiredScore: 70,
    completionPhrases: [
      "Let's complete your application",
      "Now we'll finalize your protection",
      "Let's secure your coverage",
    ],
  },
];

export function TrainingSections() {
  // In a real app, this would come from your backend/database
  const [userProgress, setUserProgress] = useState<ModuleProgress[]>(() => {
    // Initialize with all modules, uncompleted
    return TRAINING_SECTIONS.map((section) => ({
      id: section.id,
      moduleType: section.id.split("-")[0].toUpperCase() as any,
      difficulty: (section.id.split("-")[1] || "BEGINNER").toUpperCase() as
        | "BEGINNER"
        | "INTERMEDIATE"
        | "ADVANCED",
      completed: false,
      score: 0,
      attempts: 0,
    }));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Progress Overview */}
      <div className="mb-8">
        <ProgressOverview progress={userProgress} />
      </div>

      {/* Training Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TRAINING_SECTIONS.map((section) => (
          <ModuleCard
            key={section.id}
            moduleId={section.id}
            title={section.title}
            description={section.description}
            difficulty={
              section.id.includes("advanced")
                ? "ADVANCED"
                : section.id.includes("intermediate")
                ? "INTERMEDIATE"
                : "BEGINNER"
            }
            userProgress={userProgress}
          />
        ))}
      </div>
    </div>
  );
}
