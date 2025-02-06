import { Module } from "@/types/training";
import { defaultScoringCriteria, defaultPenalties } from "@/utils/scoring";

const beginnerScenarios = {
  id: "underwriting-beginner",
  title: "Underwriting Factors (Beginner)",
  description: "Learn to explain the 4 key underwriting factors",
  difficulty: "BEGINNER" as const,
  type: "UNDERWRITING" as const,
  requiredScore: 70,
  unlockCriteria: {
    requiredModules: ["luminary-index-beginner"],
    requiredScore: 70,
  },
  scenarios: [
    {
      agentScript:
        "There are 4 main factors that determine your rate: age, tobacco use, health conditions, and family history. Let's go through these one at a time.",
      expectedResponse: "Clear introduction to underwriting factors",
      prospectResponse:
        "Okay, I'm 45 and don't smoke, but I do have high blood pressure.",
      emotionalContext: {
        mood: "neutral",
        intensity: "low",
        pacing: "steady",
        naturalPauses: [
          { after: "don't smoke", durationMs: 800 },
          { after: "but", durationMs: 500 },
        ],
        voiceModulation: {
          baseline: "matter_of_fact",
          slight_concern: "at 'high blood pressure'",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 30,
          keyPhrases: [
            "let's go through",
            "determine your rate",
            "main factors",
          ],
          forbiddenPhrases: ["complicated", "complex", "difficult"],
        },
        phrasing: {
          weight: 40,
          keyPhrases: ["one at a time", "help you understand", "these factors"],
          forbiddenPhrases: ["have to", "must", "required"],
        },
        empathy: {
          weight: 30,
          keyPhrases: [
            "let me explain",
            "understand each factor",
            "your situation",
          ],
          forbiddenPhrases: ["just", "only", "simply"],
        },
      },
    },
  ],
};

const intermediateScenarios = {
  id: "underwriting-intermediate",
  title: "Underwriting Factors (Intermediate)",
  description: "Handle common health and lifestyle concerns",
  difficulty: "INTERMEDIATE" as const,
  type: "UNDERWRITING" as const,
  requiredScore: 75,
  unlockCriteria: {
    requiredModules: ["underwriting-beginner"],
    requiredScore: 70,
  },
  scenarios: [
    {
      agentScript:
        "I notice you mentioned high blood pressure. Is it controlled with medication? This helps us determine the best rate category for you.",
      expectedResponse: "Professional inquiry about health conditions",
      prospectResponse:
        "Yes, I take medication, but I'm worried this will make my rates too high. My doctor says it's well controlled though.",
      emotionalContext: {
        mood: "concerned",
        intensity: "medium",
        pacing: "measured",
        naturalPauses: [
          { after: "take medication", durationMs: 1200 },
          { after: "well controlled", durationMs: 1000 },
        ],
        voiceModulation: {
          baseline: "concerned",
          reassuring_tone: "at 'well controlled'",
          worry: "at 'rates too high'",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 35,
          keyPhrases: [
            "helps us determine",
            "best rate",
            "understand your situation",
          ],
          forbiddenPhrases: ["problem", "issue", "bad"],
        },
        phrasing: {
          weight: 35,
          keyPhrases: [
            "controlled with medication",
            "determine the best",
            "tell me more",
          ],
          forbiddenPhrases: ["sick", "unhealthy", "risky"],
        },
        empathy: {
          weight: 30,
          keyPhrases: [
            "understand your concern",
            "well managed",
            "good control",
          ],
          forbiddenPhrases: ["but", "however", "although"],
        },
      },
    },
  ],
};

const advancedScenarios = {
  id: "underwriting-advanced",
  title: "Underwriting Factors (Advanced)",
  description: "Handle complex medical and family history situations",
  difficulty: "ADVANCED" as const,
  type: "UNDERWRITING" as const,
  requiredScore: 80,
  unlockCriteria: {
    requiredModules: ["underwriting-intermediate"],
    requiredScore: 75,
  },
  scenarios: [
    {
      agentScript:
        "Let's discuss your family history. This helps us understand your unique situation and find the best coverage options.",
      expectedResponse: "Tactfully gather sensitive family history information",
      prospectResponse:
        "My father died of a heart attack at 45, and my sister had breast cancer at 38. I'm terrified of leaving my kids without protection, but I'm also scared I won't qualify.",
      emotionalContext: {
        mood: "anxious_vulnerable",
        intensity: "very_high",
        pacing: "emotional",
        naturalPauses: [
          { after: "heart attack at 45", durationMs: 2000 },
          { after: "breast cancer at 38", durationMs: 2500 },
          { after: "terrified", durationMs: 1500 },
        ],
        voiceModulation: {
          baseline: "worried",
          emotional_peak: "at 'terrified'",
          voice_breaking: "at 'leaving my kids'",
          fear_evident: "throughout",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 40,
          keyPhrases: [
            "understand your concern",
            "let's explore options",
            "thank you for sharing",
          ],
          forbiddenPhrases: ["don't worry", "no problem", "relax"],
        },
        phrasing: {
          weight: 30,
          keyPhrases: [
            "find the right coverage",
            "explore all options",
            "protect your family",
          ],
          forbiddenPhrases: ["unfortunately", "sadly", "bad news"],
        },
        empathy: {
          weight: 30,
          keyPhrases: [
            "I hear your concern",
            "protecting your children",
            "explore together",
          ],
          forbiddenPhrases: ["anyway", "moving on", "regardless"],
        },
      },
    },
  ],
};

export const underwritingScenarios: Module[] = [
  beginnerScenarios,
  intermediateScenarios,
  advancedScenarios,
];
