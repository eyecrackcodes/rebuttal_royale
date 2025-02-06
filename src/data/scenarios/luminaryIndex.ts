import { Module } from "@/types/training";
import { defaultScoringCriteria, defaultPenalties } from "@/utils/scoring";

const beginnerScenarios = {
  id: "luminary-index-beginner",
  title: "Luminary Life Index (Beginner)",
  description: "Learn to explain the Luminary Life Index",
  difficulty: "BEGINNER" as const,
  type: "LUMINARY_INDEX" as const,
  requiredScore: 70,
  unlockCriteria: {
    requiredModules: ["credibility-beginner"],
    requiredScore: 70,
  },
  scenarios: [
    {
      agentScript:
        "Let me explain how we determine the best coverage for you. We use something called the Luminary Life Index, which looks at your specific situation to find the right protection level.",
      expectedResponse: "Introduce the index concept clearly",
      prospectResponse: "Okay, what exactly does this index look at?",
      emotionalContext: {
        mood: "curious",
        intensity: "low",
        pacing: "steady",
        naturalPauses: [{ after: "okay", durationMs: 800 }],
        voiceModulation: {
          baseline: "interested",
          slight_curiosity: "at 'what exactly'",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 30,
          keyPhrases: [
            "let me explain",
            "specific situation",
            "right protection",
          ],
          forbiddenPhrases: ["complicated", "complex", "difficult"],
        },
        phrasing: {
          weight: 40,
          keyPhrases: [
            "determine best coverage",
            "looks at your situation",
            "find the right",
          ],
          forbiddenPhrases: ["have to", "must", "required"],
        },
        empathy: {
          weight: 30,
          keyPhrases: [
            "for you",
            "your specific situation",
            "right protection level",
          ],
          forbiddenPhrases: ["just", "only", "simply"],
        },
      },
    },
  ],
};

const intermediateScenarios = {
  id: "luminary-index-intermediate",
  title: "Luminary Life Index (Intermediate)",
  description: "Handle questions about the index process",
  difficulty: "INTERMEDIATE" as const,
  type: "LUMINARY_INDEX" as const,
  requiredScore: 75,
  unlockCriteria: {
    requiredModules: ["luminary-index-beginner"],
    requiredScore: 70,
  },
  scenarios: [
    {
      agentScript:
        "The Luminary Life Index considers your income, debts, family situation, and future goals to recommend the right coverage amount. It's personalized to your specific needs.",
      expectedResponse: "Explain index factors while maintaining engagement",
      prospectResponse:
        "That sounds complicated. How do I know it's actually giving me the right amount?",
      emotionalContext: {
        mood: "skeptical",
        intensity: "medium",
        pacing: "questioning",
        naturalPauses: [
          { after: "sounds complicated", durationMs: 1200 },
          { after: "right amount", durationMs: 1000 },
        ],
        voiceModulation: {
          baseline: "doubtful",
          emphasis: "at 'actually'",
          questioning_tone: "throughout",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 35,
          keyPhrases: [
            "personalized to you",
            "considers your needs",
            "recommend",
          ],
          forbiddenPhrases: ["don't worry", "trust the system", "just believe"],
        },
        phrasing: {
          weight: 35,
          keyPhrases: [
            "let me explain how",
            "tailored to your situation",
            "based on your needs",
          ],
          forbiddenPhrases: ["computer decides", "algorithm", "system"],
        },
        empathy: {
          weight: 30,
          keyPhrases: [
            "understand your concern",
            "specific to your situation",
            "your goals",
          ],
          forbiddenPhrases: [
            "everyone uses",
            "standard process",
            "always works",
          ],
        },
      },
    },
  ],
};

const advancedScenarios = {
  id: "luminary-index-advanced",
  title: "Luminary Life Index (Advanced)",
  description: "Master complex index explanations",
  difficulty: "ADVANCED" as const,
  type: "LUMINARY_INDEX" as const,
  requiredScore: 80,
  unlockCriteria: {
    requiredModules: ["luminary-index-intermediate"],
    requiredScore: 75,
  },
  scenarios: [
    {
      agentScript:
        "The Luminary Life Index helps us look at your whole financial picture - not just numbers, but your family's needs and future goals. Let me walk you through exactly how it works for your situation.",
      expectedResponse:
        "Demonstrate deep understanding while building confidence",
      prospectResponse:
        "My last advisor just pushed the highest amount possible. I ended up canceling because I felt pressured and couldn't trust the numbers. I need to really understand this.",
      emotionalContext: {
        mood: "guarded_but_hopeful",
        intensity: "high",
        pacing: "deliberate",
        naturalPauses: [
          { after: "highest amount possible", durationMs: 2000 },
          { after: "felt pressured", durationMs: 1500 },
          { after: "trust the numbers", durationMs: 1800 },
        ],
        voiceModulation: {
          baseline: "cautious",
          past_frustration: "at 'pushed the highest amount'",
          determination: "at 'need to really understand'",
          emphasis: "on 'trust'",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 40,
          keyPhrases: [
            "walk you through",
            "understand completely",
            "your situation",
          ],
          forbiddenPhrases: ["trust me", "don't worry", "simple"],
        },
        phrasing: {
          weight: 30,
          keyPhrases: [
            "explain each factor",
            "based on your needs",
            "you decide",
          ],
          forbiddenPhrases: ["push", "have to", "must"],
        },
        empathy: {
          weight: 30,
          keyPhrases: [
            "understand your concern",
            "previous experience",
            "your comfort",
          ],
          forbiddenPhrases: ["but", "however", "just"],
        },
      },
    },
  ],
};

export const luminaryIndexScenarios: Module[] = [
  beginnerScenarios,
  intermediateScenarios,
  advancedScenarios,
];
