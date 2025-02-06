import { Module } from "@/types/training";
import { defaultScoringCriteria, defaultPenalties } from "@/utils/scoring";

const beginnerScenarios = {
  id: "situation-beginner",
  title: "Understanding the Situation (Beginner)",
  description: "Learn to gather and understand client situations",
  difficulty: "BEGINNER" as const,
  type: "SITUATION" as const,
  requiredScore: 70,
  unlockCriteria: {
    requiredModules: ["eligibility-beginner"],
    requiredScore: 70,
  },
  scenarios: [
    {
      agentScript:
        "Now that we've confirmed your eligibility, could you tell me what made you interested in life insurance at this time?",
      expectedResponse: "Open-ended question to understand motivation",
      prospectResponse:
        "Well, I just want to make sure my family is taken care of if something happens to me.",
      emotionalContext: {
        mood: "contemplative",
        intensity: "low",
        pacing: "steady",
        naturalPauses: [
          { after: "well", durationMs: 1000 },
          { after: "taken care of", durationMs: 800 },
        ],
        voiceModulation: {
          baseline: "thoughtful",
          slight_concern: "at 'if something happens'",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 30,
          keyPhrases: ["tell me more", "understand", "interested"],
          forbiddenPhrases: ["have to", "must", "required"],
        },
        phrasing: {
          weight: 40,
          keyPhrases: ["what made you", "at this time", "could you tell me"],
          forbiddenPhrases: [
            "why do you",
            "what do you want",
            "quick question",
          ],
        },
        empathy: {
          weight: 30,
          keyPhrases: ["I understand", "that's important", "family protection"],
          forbiddenPhrases: ["just", "only", "basically"],
        },
      },
    },
  ],
};

const intermediateScenarios = {
  id: "situation-intermediate",
  title: "Understanding the Situation (Intermediate)",
  description: "Handle complex client situations and concerns",
  difficulty: "INTERMEDIATE" as const,
  type: "SITUATION" as const,
  requiredScore: 75,
  unlockCriteria: {
    requiredModules: ["situation-beginner"],
    requiredScore: 70,
  },
  scenarios: [
    {
      agentScript:
        "What specific concerns do you have about your current situation?",
      expectedResponse: "Probe deeper into client's specific concerns",
      prospectResponse:
        "I'm worried about the mortgage. My wife doesn't work, and I don't know how she'd manage if I wasn't here.",
      emotionalContext: {
        mood: "concerned",
        intensity: "medium",
        pacing: "thoughtful",
        naturalPauses: [
          { after: "about the mortgage", durationMs: 1500 },
          { after: "doesn't work", durationMs: 1000 },
        ],
        voiceModulation: {
          baseline: "worried",
          increasing_concern: "at 'how she'd manage'",
          emotional_weight: "throughout",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 35,
          keyPhrases: ["I understand", "let's discuss", "specific concerns"],
          forbiddenPhrases: ["don't worry", "no problem", "relax"],
        },
        phrasing: {
          weight: 35,
          keyPhrases: [
            "tell me more",
            "how would that affect",
            "what concerns you most",
          ],
          forbiddenPhrases: ["that's bad", "you should", "you need to"],
        },
        empathy: {
          weight: 30,
          keyPhrases: [
            "that's a valid concern",
            "I hear your concern",
            "let's address this",
          ],
          forbiddenPhrases: ["but", "however", "anyway"],
        },
      },
    },
  ],
};

const advancedScenarios = {
  id: "situation-advanced",
  title: "Understanding the Situation (Advanced)",
  description: "Master complex emotional situations",
  difficulty: "ADVANCED" as const,
  type: "SITUATION" as const,
  requiredScore: 80,
  unlockCriteria: {
    requiredModules: ["situation-intermediate"],
    requiredScore: 75,
  },
  scenarios: [
    {
      agentScript:
        "What made you start thinking about life insurance recently?",
      expectedResponse: "Uncover deeper emotional motivations",
      prospectResponse:
        "My brother passed away last month. No insurance. His kids... they had to move schools, leave their friends. His wife is working two jobs now. I can't let that happen to my family.",
      emotionalContext: {
        mood: "deeply_emotional",
        intensity: "very_high",
        pacing: "uneven",
        naturalPauses: [
          { after: "passed away last month", durationMs: 2500 },
          { after: "No insurance", durationMs: 2000 },
          { after: "leave their friends", durationMs: 1800 },
        ],
        voiceModulation: {
          baseline: "heavy_hearted",
          voice_breaking: "at 'His kids'",
          emotional_peak: "at 'can't let that happen'",
          personal_determination: "in final statement",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 40,
          keyPhrases: ["I'm so sorry", "take your time", "I understand"],
          forbiddenPhrases: ["cheer up", "look on bright side", "at least"],
        },
        phrasing: {
          weight: 30,
          keyPhrases: [
            "that must be difficult",
            "I hear you",
            "thank you for sharing",
          ],
          forbiddenPhrases: ["get over it", "move on", "forget about"],
        },
        empathy: {
          weight: 30,
          keyPhrases: [
            "I hear how important this is",
            "protecting your family",
            "preventing hardship",
          ],
          forbiddenPhrases: ["anyway", "however", "regardless"],
        },
      },
    },
  ],
};

export const situationScenarios: Module[] = [
  beginnerScenarios,
  intermediateScenarios,
  advancedScenarios,
];
