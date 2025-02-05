import React from "react";
import { Phone, Shield, Star, Target, ClipboardCheck } from "lucide-react";
import { TrainingSection } from "@/types/training";
import { defaultScoringCriteria, defaultPenalties } from "@/utils/scoring";
import { intakeScenarios } from "./scenarios/intake";
import { eligibilityScenarios } from "./scenarios/eligibility";

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
];
