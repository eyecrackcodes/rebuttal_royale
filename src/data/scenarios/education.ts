import { Module } from "@/types/training";
import { defaultScoringCriteria, defaultPenalties } from "@/utils/scoring";

const beginnerScenarios = {
  id: "education-beginner",
  title: "Product Education (Beginner)",
  description: "Learn to explain basic product features",
  difficulty: "BEGINNER" as const,
  type: "EDUCATION" as const,
  requiredScore: 70,
  unlockCriteria: {
    requiredModules: ["underwriting-beginner"],
    requiredScore: 70,
  },
  scenarios: [
    {
      agentScript:
        "Let me explain how our term life insurance works. It provides a guaranteed death benefit for a specific period, and the premium stays level for the entire term.",
      expectedResponse: "Clear explanation of basic product features",
      prospectResponse:
        "So the price never changes? What happens after the term ends?",
      emotionalContext: {
        mood: "curious",
        intensity: "low",
        pacing: "steady",
        naturalPauses: [
          { after: "never changes", durationMs: 800 },
          { after: "term ends", durationMs: 600 },
        ],
        voiceModulation: {
          baseline: "interested",
          questioning_tone: "at both questions",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 30,
          keyPhrases: ["let me explain", "guaranteed", "stays level"],
          forbiddenPhrases: ["complicated", "complex", "difficult"],
        },
        phrasing: {
          weight: 40,
          keyPhrases: [
            "how it works",
            "specific period",
            "premium stays level",
          ],
          forbiddenPhrases: ["have to", "must", "required"],
        },
        empathy: {
          weight: 30,
          keyPhrases: [
            "help you understand",
            "clear explanation",
            "important features",
          ],
          forbiddenPhrases: ["just", "only", "simply"],
        },
      },
    },
  ],
};

const intermediateScenarios = {
  id: "education-intermediate",
  title: "Product Education (Intermediate)",
  description: "Handle common product questions and concerns",
  difficulty: "INTERMEDIATE" as const,
  type: "EDUCATION" as const,
  requiredScore: 75,
  unlockCriteria: {
    requiredModules: ["education-beginner"],
    requiredScore: 70,
  },
  scenarios: [
    {
      agentScript:
        "Your policy includes valuable features like the terminal illness benefit, which allows early access to your death benefit if diagnosed with a terminal illness.",
      expectedResponse:
        "Explain additional benefits while maintaining sensitivity",
      prospectResponse:
        "My friend had cancer and couldn't work for months. Would this help in that kind of situation?",
      emotionalContext: {
        mood: "concerned",
        intensity: "medium",
        pacing: "thoughtful",
        naturalPauses: [
          { after: "had cancer", durationMs: 1500 },
          { after: "couldn't work", durationMs: 1000 },
        ],
        voiceModulation: {
          baseline: "concerned",
          personal_connection: "at 'my friend'",
          seeking_clarity: "at question",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 35,
          keyPhrases: [
            "let me clarify",
            "important to understand",
            "specific benefit",
          ],
          forbiddenPhrases: ["unfortunately", "sadly", "bad news"],
        },
        phrasing: {
          weight: 35,
          keyPhrases: [
            "help you understand",
            "specific situation",
            "how it works",
          ],
          forbiddenPhrases: ["deny", "reject", "won't cover"],
        },
        empathy: {
          weight: 30,
          keyPhrases: [
            "understand your concern",
            "important question",
            "clear explanation",
          ],
          forbiddenPhrases: ["but", "however", "although"],
        },
      },
    },
  ],
};

const advancedScenarios = {
  id: "education-advanced",
  title: "Product Education (Advanced)",
  description: "Master complex product explanations",
  difficulty: "ADVANCED" as const,
  type: "EDUCATION" as const,
  requiredScore: 80,
  unlockCriteria: {
    requiredModules: ["education-intermediate"],
    requiredScore: 75,
  },
  scenarios: [
    {
      agentScript:
        "Let me explain how our conversion privilege works. It's an important feature that gives you future flexibility without requiring new medical underwriting.",
      expectedResponse:
        "Explain complex features while addressing emotional concerns",
      prospectResponse:
        "My sister's cancer came back after 5 years. She couldn't get new coverage, and her term policy was ending. I'm scared of being in that situation.",
      emotionalContext: {
        mood: "deeply_concerned",
        intensity: "very_high",
        pacing: "emotional",
        naturalPauses: [
          { after: "cancer came back", durationMs: 2000 },
          { after: "couldn't get new coverage", durationMs: 1800 },
          { after: "policy was ending", durationMs: 1500 },
        ],
        voiceModulation: {
          baseline: "worried",
          emotional_peak: "at 'scared'",
          personal_pain: "discussing sister",
          fear_evident: "throughout",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 40,
          keyPhrases: [
            "important feature",
            "understand your concern",
            "future protection",
          ],
          forbiddenPhrases: ["don't worry", "no problem", "relax"],
        },
        phrasing: {
          weight: 30,
          keyPhrases: [
            "let me explain",
            "gives you control",
            "future flexibility",
          ],
          forbiddenPhrases: ["technical term", "fine print", "complicated"],
        },
        empathy: {
          weight: 30,
          keyPhrases: [
            "understand your experience",
            "protect against uncertainty",
            "future security",
          ],
          forbiddenPhrases: ["anyway", "moving on", "regardless"],
        },
      },
    },
  ],
};

export const educationScenarios: Module[] = [
  beginnerScenarios,
  intermediateScenarios,
  advancedScenarios,
];
