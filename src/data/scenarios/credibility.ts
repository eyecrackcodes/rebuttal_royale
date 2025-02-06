import { Module } from "@/types/training";
import { defaultScoringCriteria, defaultPenalties } from "@/utils/scoring";

const beginnerScenarios = {
  id: "credibility-beginner",
  title: "Building Credibility (Beginner)",
  description: "Learn to establish trust and credibility",
  difficulty: "BEGINNER" as const,
  type: "CREDIBILITY" as const,
  requiredScore: 70,
  unlockCriteria: {
    requiredModules: ["situation-beginner"],
    requiredScore: 70,
  },
  scenarios: [
    {
      agentScript:
        "I'm a licensed agent with Luminary Life, and I'll text you my license information right now so you can verify who I am. We're rated A+ by AM Best and have been helping families for over 25 years.",
      expectedResponse:
        "Establish credibility with specific facts and immediate verification",
      prospectResponse:
        "Okay, that's good to know. I've just never done this over the phone before.",
      emotionalContext: {
        mood: "cautious",
        intensity: "low",
        pacing: "measured",
        naturalPauses: [{ after: "good to know", durationMs: 1000 }],
        voiceModulation: {
          baseline: "reserved",
          slight_uncertainty: "at 'never done this'",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 30,
          keyPhrases: ["licensed agent", "verify", "helping families"],
          forbiddenPhrases: ["trust me", "believe me", "just"],
        },
        phrasing: {
          weight: 40,
          keyPhrases: ["text you my license", "rated A+", "over 25 years"],
          forbiddenPhrases: ["have to", "must", "should"],
        },
        empathy: {
          weight: 30,
          keyPhrases: ["understand your caution", "verify who I am"],
          forbiddenPhrases: ["obviously", "clearly", "simply"],
        },
      },
    },
  ],
};

const intermediateScenarios = {
  id: "credibility-intermediate",
  title: "Building Credibility (Intermediate)",
  description: "Handle credibility objections effectively",
  difficulty: "INTERMEDIATE" as const,
  type: "CREDIBILITY" as const,
  requiredScore: 75,
  unlockCriteria: {
    requiredModules: ["credibility-beginner"],
    requiredScore: 70,
  },
  scenarios: [
    {
      agentScript:
        "I understand your concern about phone transactions. That's why I'll send you my license information right now, and you can verify everything I tell you about our company's ratings and history.",
      expectedResponse: "Address skepticism while providing immediate proof",
      prospectResponse:
        "I got scammed before by someone claiming to be from an insurance company. They sounded very professional too.",
      emotionalContext: {
        mood: "skeptical",
        intensity: "medium",
        pacing: "guarded",
        naturalPauses: [
          { after: "got scammed before", durationMs: 1500 },
          { after: "insurance company", durationMs: 1000 },
        ],
        voiceModulation: {
          baseline: "defensive",
          bitter_undertone: "at 'sounded very professional'",
          past_hurt: "throughout",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 35,
          keyPhrases: [
            "verify everything",
            "completely understand",
            "let me prove",
          ],
          forbiddenPhrases: ["trust me", "believe me", "don't worry"],
        },
        phrasing: {
          weight: 35,
          keyPhrases: [
            "send you proof",
            "check my credentials",
            "verify independently",
          ],
          forbiddenPhrases: ["just trust", "take my word", "relax"],
        },
        empathy: {
          weight: 30,
          keyPhrases: [
            "understand your experience",
            "protect yourself",
            "verify first",
          ],
          forbiddenPhrases: ["but", "however", "although"],
        },
      },
    },
  ],
};

const advancedScenarios = {
  id: "credibility-advanced",
  title: "Building Credibility (Advanced)",
  description: "Master complex trust-building situations",
  difficulty: "ADVANCED" as const,
  type: "CREDIBILITY" as const,
  requiredScore: 80,
  unlockCriteria: {
    requiredModules: ["credibility-intermediate"],
    requiredScore: 75,
  },
  scenarios: [
    {
      agentScript:
        "I hear the pain in your voice about past experiences. Let me send you my license information right now, and I'll walk you through how to verify everything about me and Luminary Life while you're on the phone.",
      expectedResponse:
        "Build trust through transparency while acknowledging past trauma",
      prospectResponse:
        "My parents lost their retirement savings to a scammer last year. I had to move them in with me. I can't... I just can't risk making a mistake like that.",
      emotionalContext: {
        mood: "traumatized",
        intensity: "very_high",
        pacing: "emotional",
        naturalPauses: [
          { after: "retirement savings", durationMs: 2000 },
          { after: "move them in with me", durationMs: 2500 },
          { after: "can't", durationMs: 1800 },
        ],
        voiceModulation: {
          baseline: "vulnerable",
          voice_breaking: "at 'had to move them'",
          emotional_peak: "at final 'can't'",
          fear_evident: "throughout",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 40,
          keyPhrases: ["I understand", "let me prove", "verify everything"],
          forbiddenPhrases: ["calm down", "don't worry", "relax"],
        },
        phrasing: {
          weight: 30,
          keyPhrases: [
            "take your time",
            "verify each step",
            "protect yourself",
          ],
          forbiddenPhrases: ["trust me", "believe me", "just"],
        },
        empathy: {
          weight: 30,
          keyPhrases: [
            "that must have been devastating",
            "protect your family",
            "understand your caution",
          ],
          forbiddenPhrases: ["anyway", "moving on", "regardless"],
        },
      },
    },
  ],
};

export const credibilityScenarios: Module[] = [
  beginnerScenarios,
  intermediateScenarios,
  advancedScenarios,
];
