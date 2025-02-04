export interface ScoringCriteria {
  tonality: {
    weight: number;
    keyPhrases: string[];
    forbiddenPhrases: string[];
  };
  phrasing: {
    weight: number;
    keyPhrases: string[];
    forbiddenPhrases: string[];
  };
  empathy: {
    weight: number;
    keyPhrases: string[];
    forbiddenPhrases: string[];
  };
}

export interface TrainingScenario {
  agentScript: string;
  expectedResponse: string;
  prospectResponse: string | string[];
  keyPhrases: string[];
  forbiddenPhrases: string[];
  scoringCriteria: ScoringCriteria;
  nextPrompt?: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  scenarios: TrainingScenario[];
  requiredScore: number;
}

export interface TrainingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  modules: TrainingModule[];
  requiredScore: number;
  completionPhrases?: string[];
  unlockCriteria?: {
    sectionIds: string[];
    minScore: number;
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