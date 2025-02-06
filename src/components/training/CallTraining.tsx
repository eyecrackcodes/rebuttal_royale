"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Mic,
  Volume2,
  VolumeX,
  Phone,
  Star,
  Shield,
  Target,
} from "lucide-react";
import { startListening, speakText, initializeVoice } from "@/lib/speechUtils";
import { ProgressBar } from "./ProgressBar";
import { LevelSummary } from "./LevelSummary";
import { LevelComplete } from "./LevelComplete";
import { SectionProgress } from "./SectionProgress";
import { TRAINING_SECTIONS } from "@/data/training-sections";
import {
  TrainingModule,
  TrainingScenario,
  TrainingSection,
  ModuleProgress,
  CallState,
  ScoringCriteria,
} from "@/types/training";
import { intakeScenarios } from "@/data/scenarios/intake";
import { eligibilityScenarios } from "@/data/scenarios/eligibility";
import { situationScenarios } from "@/data/scenarios/situation";
import { credibilityScenarios } from "@/data/scenarios/credibility";
import { luminaryIndexScenarios } from "@/data/scenarios/luminaryIndex";
import { underwritingScenarios } from "@/data/scenarios/underwriting";
import { educationScenarios } from "@/data/scenarios/education";
import { calculateResponseScore, defaultPenalties } from "@/utils/scoring";

// Add console logs to check each import
console.log("Intake:", intakeScenarios);
console.log("Eligibility:", eligibilityScenarios);
console.log("Situation:", situationScenarios);
console.log("Credibility:", credibilityScenarios);
console.log("LuminaryIndex:", luminaryIndexScenarios);
console.log("Underwriting:", underwritingScenarios);
console.log("Education:", educationScenarios);

const trainingModules = [
  ...intakeScenarios,
  ...eligibilityScenarios,
  ...situationScenarios,
  ...credibilityScenarios,
  ...luminaryIndexScenarios,
  ...underwritingScenarios,
  ...educationScenarios,
];

// Log the complete modules array
console.log("All Training Modules:", trainingModules);

interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  onClick: () => void;
}

function ModuleCard({
  icon,
  title,
  description,
  difficulty,
  onClick,
}: ModuleCardProps) {
  return (
    <div className="bg-blue-800/20 p-6 rounded-lg border border-blue-700 hover:border-orange-400 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-orange-400">{icon}</div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <p className="text-blue-200 mb-2">{description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-blue-300">Difficulty:</span>
        <span
          className={`text-xs ${
            difficulty === "BEGINNER"
              ? "text-green-400"
              : difficulty === "INTERMEDIATE"
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          {difficulty}
        </span>
      </div>
      <Button
        onClick={onClick}
        className="w-full bg-orange-500 hover:bg-orange-600"
      >
        Start Training
      </Button>
    </div>
  );
}

const cleanTextForSpeech = (text: string | string[]): string => {
  if (Array.isArray(text)) {
    text = text[Math.floor(Math.random() * text.length)];
  }
  return text
    .replace(/\[.*?\]/g, "")
    .replace(/\.\.\./g, ",")
    .replace(/[^\w\s,.?!'-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const getRandomResponse = (response: string | string[]): string => {
  if (Array.isArray(response)) {
    return response[Math.floor(Math.random() * response.length)];
  }
  return response;
};

export default function CallTraining() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [callState, setCallState] = useState({
    currentStep: 0,
    isComplete: false,
    feedback: "",
    isProspectSpeaking: false,
  });

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const recognitionRef = useRef<any>(null);

  const [showSummary, setShowSummary] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [moduleProgress, setModuleProgress] = useState({
    score: 0,
    totalResponses: 0,
    averageScore: 0,
    bestResponse: "",
    usedPhrases: [] as string[],
    missedOpportunities: [] as string[],
    areasToImprove: [] as string[],
  });

  const [sectionProgress, setSectionProgress] = useState<
    Record<
      string,
      {
        completed: boolean;
        score: number;
        moduleScores: Record<string, number>;
      }
    >
  >({});

  const [currentModule, setCurrentModule] = useState<TrainingModule | null>(
    null
  );
  const [currentScenario, setCurrentScenario] =
    useState<TrainingScenario | null>(null);

  const [sessionVoice, setSessionVoice] = useState(() => initializeVoice());

  const [currentProspectResponse, setCurrentProspectResponse] =
    useState<string>("");

  const handleModuleSelect = (moduleId: string) => {
    console.log("handleModuleSelect called with moduleId:", moduleId);

    const section = TRAINING_SECTIONS.find((s) => s.id === moduleId);
    console.log("Found section:", section);

    if (!section) {
      console.warn("No section found for moduleId:", moduleId);
      return;
    }

    // Get the beginner module first (it's the first in the array)
    const firstModule = section.modules[0];
    console.log("Selected module:", firstModule);

    if (
      firstModule &&
      firstModule.scenarios &&
      firstModule.scenarios.length > 0
    ) {
      setSelectedModule(moduleId);
      setCurrentModule(firstModule);
      setCurrentScenario(firstModule.scenarios[0]);
      setCallState({
        currentStep: 0,
        isComplete: false,
        feedback: "",
        isProspectSpeaking: false,
      });
      setModuleProgress({
        score: 0,
        totalResponses: 0,
        averageScore: 0,
        bestResponse: "",
        usedPhrases: [],
        missedOpportunities: [],
        areasToImprove: [],
      });
    } else {
      console.warn("No scenarios found in module:", firstModule);
    }
  };

  const scoreResponse = (
    response: string,
    scenario: TrainingScenario
  ): number => {
    const result = calculateResponseScore(
      response,
      scenario.scoringCriteria,
      defaultPenalties
    );

    // Update module progress with feedback
    setModuleProgress((prev) => ({
      ...prev,
      areasToImprove: [...prev.areasToImprove, ...result.feedback],
      missedOpportunities:
        result.detailedScores.empathy < 50
          ? [...prev.missedOpportunities, "Missed opportunity for empathy"]
          : prev.missedOpportunities,
    }));

    return result.score;
  };

  const handleResponse = useCallback(
    async (response: string) => {
      if (!currentScenario || !currentModule || !selectedModule) return;

      console.log("Handling response:", response);
      setIsListening(false);

      const prospectResponse = getRandomResponse(
        currentScenario.prospectResponse
      );
      setCurrentProspectResponse(prospectResponse);

      const score = scoreResponse(response, currentScenario);

      // Update module progress
      setModuleProgress((prev) => {
        const newTotalResponses = prev.totalResponses + 1;
        const newAverageScore = Math.round(
          (prev.averageScore * prev.totalResponses + score) / newTotalResponses
        );

        return {
          ...prev,
          score: Math.max(prev.score, score),
          totalResponses: newTotalResponses,
          averageScore: newAverageScore,
          bestResponse: score > prev.score ? response : prev.bestResponse,
        };
      });

      // Update section progress
      setSectionProgress((prev) => {
        const section = TRAINING_SECTIONS.find((s) => s.id === selectedModule);
        if (!section) return prev;

        return {
          ...prev,
          [section.id]: {
            ...prev[section.id],
            score: Math.max(prev[section.id]?.score || 0, score),
            completed: true,
            moduleScores: {
              ...prev[section.id]?.moduleScores,
              [currentModule.id]: score,
            },
          },
        };
      });

      // Speak the prospect's response if speech is enabled
      if (isSpeaking) {
        try {
          await speakText(prospectResponse);
        } catch (error) {
          console.error("Error speaking text:", error);
        }
      }

      const nextStep = callState.currentStep + 1;
      const isComplete = nextStep >= (currentModule.scenarios?.length || 0);

      setCallState({
        ...callState,
        currentStep: nextStep,
        isComplete,
        isProspectSpeaking: !isComplete,
        feedback: isComplete
          ? "Great job completing the module!"
          : "Good response, waiting for prospect...",
      });

      // Save progress to localStorage
      try {
        const userId = "user123"; // Replace with actual user ID when available
        const progressData = {
          id: selectedModule,
          score,
          attempts: 1,
          lastAttempted: new Date(),
          completed: isComplete,
        };

        const existingProgress = localStorage.getItem(`progress_${userId}`);
        const progress = existingProgress ? JSON.parse(existingProgress) : [];

        const moduleIndex = progress.findIndex(
          (p: any) => p.id === selectedModule
        );
        if (moduleIndex >= 0) {
          progress[moduleIndex] = {
            ...progress[moduleIndex],
            score: Math.max(progress[moduleIndex].score, score),
            attempts: progress[moduleIndex].attempts + 1,
            lastAttempted: new Date(),
            completed: isComplete,
          };
        } else {
          progress.push(progressData);
        }

        localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
      } catch (error) {
        console.error("Error saving progress:", error);
      }

      if (isComplete) {
        setShowSummary(true);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCurrentScenario(currentModule.scenarios[nextStep]);
        setIsListening(true);
      }
    },
    [
      currentScenario,
      currentModule,
      selectedModule,
      callState,
      isSpeaking,
      moduleProgress.areasToImprove,
    ]
  );

  const startMicrophoneListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = startListening(handleResponse, (error) => {
      setCallState((prev) => ({
        ...prev,
        feedback: error,
      }));
      setIsListening(false);
    });

    if (recognition) {
      recognitionRef.current = recognition;
      setIsListening(true);
    }
  }, [handleResponse]);

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const isModuleUnlocked = (
    id: string,
    completedModules: string[]
  ): boolean => {
    // First check if the section exists
    const section = TRAINING_SECTIONS.find((s) => s.id === id);
    if (!section) {
      console.warn(`Section with id ${id} not found`);
      return false;
    }

    // If no unlock criteria, the section is available
    if (!section.unlockCriteria) return true;

    // Check if required modules are completed
    return section.unlockCriteria.requiredModules.every((reqId) =>
      completedModules.includes(reqId)
    );
  };

  // Update the section title lookup as well
  const getSectionTitle = (moduleId: string): string => {
    const section = TRAINING_SECTIONS.find((s) => s.id === moduleId);
    return section?.title || "Unknown Section";
  };

  return (
    <div className="space-y-6">
      {!selectedModule ? (
        <div className="bg-gradient-to-br from-blue-900 to-blue-950 p-6 rounded-lg border border-blue-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            Select a Training Module
          </h2>
          <p className="text-blue-200 mb-6">
            Choose a module to practice specific parts of the sales call.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRAINING_SECTIONS.map((section) => (
              <SectionProgress
                key={section.id}
                section={section}
                progress={
                  sectionProgress[section.id] || {
                    completed: false,
                    score: 0,
                    moduleScores: {},
                  }
                }
                isLocked={
                  section.unlockCriteria &&
                  !isModuleUnlocked(section.id, Object.keys(sectionProgress))
                }
                onModuleSelect={(moduleId) => {
                  if (
                    section.unlockCriteria &&
                    !isModuleUnlocked(section.id, Object.keys(sectionProgress))
                  ) {
                    return;
                  }
                  handleModuleSelect(moduleId);
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-blue-900 to-blue-950 p-6 rounded-lg border border-blue-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">
                {getSectionTitle(selectedModule)}
              </h2>
            </div>
            <Button
              variant="outline"
              onClick={() => setSelectedModule(null)}
              className="border-blue-700 text-blue-200"
            >
              Exit Module
            </Button>
          </div>

          <ProgressBar
            currentScore={moduleProgress.score}
            nextLevelScore={100}
            previousLevelScore={0}
          />

          {!callState.isComplete &&
          currentModule?.scenarios &&
          currentModule.scenarios[callState.currentStep] ? (
            <>
              <div className="bg-blue-900/30 p-4 rounded-lg mb-4">
                <p className="text-blue-200 mb-2">
                  Step {callState.currentStep + 1} of{" "}
                  {currentModule.scenarios.length}
                </p>
                <div className="space-y-4">
                  {callState.currentStep > 0 && (
                    <div className="bg-blue-950/50 p-3 rounded">
                      <p className="text-blue-300 text-sm">Prospect:</p>
                      <p className="text-white">{currentProspectResponse}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-blue-300 text-sm">Your Response:</p>
                    <p className="text-white text-lg">
                      {
                        currentModule.scenarios[callState.currentStep]
                          .agentScript
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <Button
                  onClick={startMicrophoneListening}
                  disabled={callState.isProspectSpeaking}
                  className={`${isListening ? "bg-green-500" : "bg-blue-600"} 
                    ${callState.isProspectSpeaking ? "opacity-50" : ""}`}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  {isListening ? "Listening..." : "Speak"}
                </Button>
                <Button
                  onClick={() => setIsSpeaking(!isSpeaking)}
                  variant="outline"
                >
                  {isSpeaking ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {callState.feedback && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded mb-4">
                  {callState.feedback}
                </div>
              )}

              <div className="bg-blue-900/20 p-3 rounded border border-blue-800">
                <p className="text-sm text-blue-200">Expected Response:</p>
                <p className="text-blue-100">
                  {
                    currentModule?.scenarios[callState.currentStep]
                      .expectedResponse
                  }
                </p>
              </div>
            </>
          ) : null}

          {showSummary && (
            <LevelSummary
              stats={moduleProgress}
              onContinue={() => {
                setShowSummary(false);
                setShowLevelComplete(true);
              }}
            />
          )}

          {showLevelComplete && (
            <LevelComplete
              level={{
                id: parseInt(selectedModule?.split("-")[1] || "0"),
                name:
                  TRAINING_SECTIONS.find((s) =>
                    s.modules.some((m) => m.id === selectedModule)
                  )?.title || "",
                description:
                  TRAINING_SECTIONS.find((s) =>
                    s.modules.some((m) => m.id === selectedModule)
                  )?.description || "",
                difficulty:
                  TRAINING_SECTIONS.find((s) =>
                    s.modules.some((m) => m.id === selectedModule)
                  )?.modules[0].difficulty || "BEGINNER",
                minScore: 0,
                objectionTypes: [],
                emotionRange: { min: 0, max: 0 },
              }}
              score={moduleProgress.score}
              newBadges={[]}
              onContinue={() => {
                setSelectedModule(null);
                setShowLevelComplete(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
