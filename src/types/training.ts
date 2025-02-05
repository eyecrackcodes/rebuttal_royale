export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type ModuleType = "INTAKE" | "ELIGIBILITY";

export interface ScoringCriteria {
  weight: number;
  keyPhrases: string[];
  forbiddenPhrases: string[];
}

export interface EmotionalContext {
  mood: string;
  intensity: string;
  pacing: string;
  naturalPauses: Array<{
    after: string;
    durationMs: number;
  }>;
  voiceModulation: {
    baseline: string;
    [key: string]: string;
  };
}

export interface Scenario {
  agentScript: string;
  expectedResponse: string;
  prospectResponse: string;
  emotionalContext: EmotionalContext;
  scoringCriteria: {
    tonality: ScoringCriteria;
    phrasing: ScoringCriteria;
    empathy: ScoringCriteria;
  };
  keyPhrases: string[];
  forbiddenPhrases: string[];
}

export interface TrainingSection {
  id: string;
  title: string;
  description: string;
  type: ModuleType;
  difficulty: Difficulty;
  requiredScore: number;
  scenarios: Scenario[];
  unlockCriteria: {
    requiredModules: string[];
    requiredScore: number;
  };
}

export interface Module extends TrainingSection {
  // Additional module-specific properties can go here
}

export type TrainingModule = Module;
export type TrainingScenario = Scenario;

export interface AISettings {
  speechDetection: {
    minSilenceBeforeResponse: number;
    endOfUtteranceThreshold: number;
    interruptionPrevention: boolean;
    continuousSpeechDetection: boolean;
  };
  responseDelay: {
    default: number;
    afterEmotionalContent: number;
    afterQuestion: number;
  };
  turnTaking: {
    waitForCompleteStop: boolean;
    detectUserResuming: boolean;
    backoffOnOverlap: boolean;
  };
}

export interface ModuleProgress {
  score: number;
  totalResponses: number;
  averageScore: number;
  bestResponse: string;
  usedPhrases: string[];
  missedOpportunities: string[];
  areasToImprove: string[];
}

export interface CallState {
  currentStep: number;
  isComplete: boolean;
  feedback: string;
  isProspectSpeaking: boolean;
}
