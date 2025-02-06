import { Module } from "@/types/training";
import { defaultScoringCriteria } from "@/utils/scoring";
import { validationPatterns } from "@/utils/validation";

const beginnerScenarios = {
  id: "coverage-levels-beginner",
  title: "Coverage Levels & Pricing (Beginner)",
  description: "Practice presenting coverage options clearly",
  difficulty: "BEGINNER" as const,
  type: "COVERAGE" as const,
  requiredScore: 70,
  unlockCriteria: {
    requiredModules: [],
    requiredScore: 0,
  },
  scenarios: [
    {
      agentScript:
        "So, let's take a look at the different coverage levels and see what makes most sense for your needs and budget.",
      expectedResponse: "Clear introduction to coverage options",
      prospectResponse: "Okay, what are my options?",
      emotionalContext: {
        mood: "neutral",
        intensity: "low",
        pacing: "regular",
        naturalPauses: [{ after: "options", durationMs: 800 }],
        voiceModulation: {
          baseline: "attentive",
          slight_interest: "throughout",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 35,
          keyPhrases: ["let's take a look", "makes sense", "your needs"],
          forbiddenPhrases: ["have to", "must", "required"],
        },
        phrasing: {
          weight: 35,
          keyPhrases: ["different coverage levels", "needs and budget"],
          forbiddenPhrases: ["um", "uh", "like"],
        },
        empathy: {
          weight: 30,
          keyPhrases: ["what makes sense for you", "your needs"],
          forbiddenPhrases: ["cheap", "expensive", "just"],
        },
      },
    },
    {
      agentScript:
        "Option 1 is $10,000 coverage. This will cover the average cost of a funeral in {state}, which is about $9,800...",
      expectedResponse: "Present first option clearly with context",
      prospectResponse: "That doesn't seem like much extra...",
      scoringCriteria: {
        ...defaultScoringCriteria,
        accuracy: {
          weight: 40,
          keyPhrases: [
            "$10,000 coverage",
            "funeral costs",
            "dignified service",
          ],
          forbiddenPhrases: ["basic", "minimal", "cheap"],
        },
      },
    },
    {
      agentScript: "Option 2 is our most popular choice at $20,000 coverage...",
      expectedResponse: "Present middle option with benefits",
      prospectResponse: "Why is that one the most popular?",
      scoringCriteria: {
        ...defaultScoringCriteria,
        persuasion: {
          weight: 40,
          keyPhrases: ["most popular option", "extra coverage", "flexibility"],
          forbiddenPhrases: ["better than", "should", "have to"],
        },
      },
    },
  ],
};

const intermediateScenarios = {
  id: "coverage-levels-intermediate",
  title: "Coverage Levels & Pricing (Intermediate)",
  description: "Handle pricing objections and concerns",
  difficulty: "INTERMEDIATE" as const,
  type: "COVERAGE" as const,
  requiredScore: 75,
  unlockCriteria: {
    requiredModules: ["coverage-levels-beginner"],
    requiredScore: 70,
  },
  scenarios: [
    {
      agentScript:
        "Which coverage option do you think you'd feel most comfortable with?",
      expectedResponse: "Guide decision process professionally",
      prospectResponse:
        "These all seem expensive. Do you have anything cheaper?",
      scoringCriteria: {
        ...defaultScoringCriteria,
        objectionHandling: {
          weight: 40,
          keyPhrases: [
            "understand your concern",
            "flexible options",
            "work with your budget",
          ],
          forbiddenPhrases: ["cheap", "can't afford", "too expensive"],
        },
      },
    },
  ],
};

const advancedScenarios = {
  id: "coverage-levels-advanced",
  title: "Coverage Levels & Pricing (Advanced)",
  description: "Handle complex pricing discussions and emotional situations",
  difficulty: "ADVANCED" as const,
  type: "COVERAGE" as const,
  requiredScore: 80,
  unlockCriteria: {
    requiredModules: ["coverage-levels-intermediate"],
    requiredScore: 75,
  },
  scenarios: [
    {
      agentScript:
        "Let's review these coverage options to find what works best for your situation...",
      expectedResponse: "Navigate complex financial and emotional needs",
      prospectResponse:
        "I lost my spouse last year without insurance. I can't let my kids go through that again, but I'm on a fixed income.",
      emotionalContext: {
        mood: "conflicted",
        intensity: "high",
        pacing: "hesitant",
        naturalPauses: [
          { after: "lost my spouse", durationMs: 2000 },
          { after: "fixed income", durationMs: 1500 },
        ],
        voiceModulation: {
          baseline: "emotional",
          voice_breaking: "at mention of spouse",
          concern: "when discussing children",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 35,
          keyPhrases: [
            "understand your concern",
            "protect your family",
            "work within your budget",
          ],
          forbiddenPhrases: ["cheap", "expensive", "can't afford"],
        },
        empathy: {
          weight: 35,
          keyPhrases: [
            "I hear how important this is",
            "let's find a solution",
            "balance protection and affordability",
          ],
          forbiddenPhrases: ["just", "only", "have to"],
        },
        problemSolving: {
          weight: 30,
          keyPhrases: [
            "explore options",
            "flexible payment plans",
            "adjust coverage",
          ],
          forbiddenPhrases: ["nothing we can do", "impossible", "can't help"],
        },
      },
    },
    {
      agentScript:
        "The $20,000 coverage option provides a balance between protection and monthly cost...",
      expectedResponse: "Present value proposition for hesitant client",
      prospectResponse:
        "That's more than I was planning to spend. My neighbor got something for half that price.",
      scoringCriteria: {
        ...defaultScoringCriteria,
        valueProposition: {
          weight: 40,
          keyPhrases: [
            "investment in peace of mind",
            "guaranteed protection",
            "tailored to your needs",
          ],
          forbiddenPhrases: [
            "cheaper options",
            "basic coverage",
            "minimum protection",
          ],
        },
      },
    },
    {
      agentScript:
        "Let me explain how we can structure this to work within your monthly budget...",
      expectedResponse: "Creative solution presentation",
      prospectResponse:
        "I need to think about it and talk to my children first.",
      scoringCriteria: {
        ...defaultScoringCriteria,
        closingSkills: {
          weight: 40,
          keyPhrases: [
            "protect your family today",
            "peace of mind",
            "lock in your rate",
          ],
          forbiddenPhrases: ["take your time", "think it over", "call me back"],
        },
      },
    },
  ],
};

export const coverageLevelsScenarios: Module[] = [
  beginnerScenarios,
  intermediateScenarios,
  advancedScenarios,
];
