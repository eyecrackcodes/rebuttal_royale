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
    const section = TRAINING_SECTIONS.find((s) =>
      s.modules.some((m) => m.id === moduleId)
    );
    const module = section?.modules.find((m) => m.id === moduleId);

    if (module && module.scenarios && module.scenarios.length > 0) {
      setSelectedModule(moduleId);
      setCurrentModule(module);
      setCurrentScenario(module.scenarios[0]);
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
    }
  };

  const scoreResponse = (
    response: string,
    scenario: TrainingScenario
  ): number => {
    const scores = {
      tonality: 0,
      phrasing: 0,
      empathy: 0,
    };

    const lowerResponse = response.toLowerCase();

    Object.entries(scenario.scoringCriteria).forEach(([category, criteria]) => {
      let categoryScore = 0;

      criteria.keyPhrases.forEach((phrase: string) => {
        if (lowerResponse.includes(phrase.toLowerCase())) {
          categoryScore += 20;
        }
      });

      criteria.forbiddenPhrases.forEach((phrase: string) => {
        if (lowerResponse.includes(phrase.toLowerCase())) {
          categoryScore -= 10;
        }
      });

      scores[category as keyof typeof scores] =
        Math.max(0, Math.min(100, categoryScore)) * (criteria.weight / 100);
    });

    return Math.round(
      Object.values(scores).reduce((sum, score) => sum + score, 0)
    );
  };

  const handleResponse = useCallback(
    async (response: string) => {
      if (!currentScenario || !currentModule) return;

      setIsListening(false);

      const prospectResponse = getRandomResponse(
        currentScenario.prospectResponse
      );
      setCurrentProspectResponse(prospectResponse);

      const score = scoreResponse(response, currentScenario);

      setModuleProgress((prev) => ({
        ...prev,
        score: Math.max(prev.score, score),
        totalResponses: prev.totalResponses + 1,
        averageScore: Math.round(
          (prev.averageScore * prev.totalResponses + score) /
            (prev.totalResponses + 1)
        ),
        bestResponse: score > prev.score ? response : prev.bestResponse,
      }));

      if (isSpeaking) {
        setCallState((prev) => ({ ...prev, isProspectSpeaking: true }));
        try {
          await speakText(
            prospectResponse,
            process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || "",
            sessionVoice.id,
            sessionVoice.settings
          );
          setCallState((prev) => ({ ...prev, isProspectSpeaking: false }));
        } catch (error) {
          console.error("Speech synthesis error:", error);
          setCallState((prev) => ({ ...prev, isProspectSpeaking: false }));
        }
      }

      // Move to next step
      const nextStep = callState.currentStep + 1;
      const isComplete = nextStep >= currentModule.scenarios.length;

      setCallState((prev) => ({
        ...prev,
        currentStep: nextStep,
        isComplete,
        feedback: isComplete
          ? "Great job completing the module!"
          : "Good response, waiting for prospect...",
      }));

      if (isComplete) {
        setShowSummary(true);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCurrentScenario(currentModule.scenarios[nextStep]);
      }
    },
    [
      currentScenario,
      currentModule,
      callState.currentStep,
      isSpeaking,
      sessionVoice,
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
    const module = TRAINING_SECTIONS.find((s) =>
      s.modules.some((m) => m.id === id)
    );
    if (!module?.unlockCriteria) return true;

    return module.unlockCriteria.requiredModules.every((reqId) =>
      completedModules.includes(reqId)
    );
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
                    !isModuleUnlocked(moduleId, Object.keys(sectionProgress))
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
                {
                  TRAINING_SECTIONS.find((s) =>
                    s.modules.some((m) => m.id === selectedModule)
                  )?.title
                }
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
