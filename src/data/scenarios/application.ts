import { Module } from "@/types/training";
import { defaultScoringCriteria } from "@/utils/scoring";
import { validationPatterns } from "@/utils/validation";

const beginnerScenarios = {
  id: "application-beginner",
  title: "Application Process (Beginner)",
  description: "Practice basic application completion",
  difficulty: "BEGINNER" as const,
  type: "APPLICATION" as const,
  requiredScore: 70,
  unlockCriteria: {
    requiredModules: ["coverage-levels-beginner"],
    requiredScore: 70,
  },
  scenarios: [
    {
      agentScript:
        "OK, based on everything you've shared with me, I have most of the application completed through Guarantee Trust Life's secure online portal. They just need a little more information to verify you are who you say you are, like your driver's license, social, contact info, and payment details. Within a few minutes, we'll have confirmation of coverage and a policy number.",
      expectedResponse: "Clear explanation of next steps",
      prospectResponse: "Okay, that sounds good.",
      emotionalContext: {
        mood: "cooperative",
        intensity: "low",
        pacing: "steady",
        naturalPauses: [{ after: "online portal", durationMs: 800 }],
        voiceModulation: {
          baseline: "professional",
          slight_emphasis: "at verification points",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 35,
          keyPhrases: ["secure", "verify", "confirmation"],
          forbiddenPhrases: ["just need", "real quick", "um"],
        },
        phrasing: {
          weight: 35,
          keyPhrases: ["based on what you've shared", "secure online portal"],
          forbiddenPhrases: ["gonna", "kinda", "sort of"],
        },
        accuracy: {
          weight: 30,
          keyPhrases: ["driver's license", "social", "payment details"],
          forbiddenPhrases: ["probably", "maybe", "I think"],
        },
      },
    },
    {
      agentScript:
        "Is the [ADDRESS] the same one that is on your driver's license?",
      expectedResponse: "Verify address matches ID",
      prospectResponse: "Yes, that's correct",
      validationPattern: validationPatterns.address.pattern,
      scoringCriteria: {
        ...defaultScoringCriteria,
        accuracy: {
          weight: 40,
          keyPhrases: ["driver's license", "verify", "confirm"],
          forbiddenPhrases: ["probably", "maybe", "I think"],
        },
      },
    },
    {
      agentScript:
        "Excellent, I am going to send you a text now and when you receive it, it will say it's from Luminary Life and GTL. It will have a 5-digit code that you'll need to read back to me. Did you receive it?",
      expectedResponse: "Clear explanation of verification process",
      prospectResponse: "Yes, I got it. The code is 12345",
      scoringCriteria: {
        ...defaultScoringCriteria,
        clarity: {
          weight: 40,
          keyPhrases: ["text message", "5-digit code", "read back to me"],
          forbiddenPhrases: ["um", "uh", "like"],
        },
      },
    },
    {
      agentScript:
        "This insurance company accepts payments 3 different ways: We'll draft it from your bank account today and this day every month going forward, or we can draft it from your bank account when you get paid your Social Security, or if you get your Social Security on a direct express credit card, we can also accept that.",
      expectedResponse: "Clear presentation of payment options",
      prospectResponse: "I'd prefer to use my bank account",
      scoringCriteria: {
        ...defaultScoringCriteria,
        clarity: {
          weight: 40,
          keyPhrases: [
            "three payment options",
            "bank account",
            "Social Security",
          ],
          forbiddenPhrases: ["um", "uh", "like"],
        },
      },
    },
  ],
};

const intermediateScenarios = {
  id: "application-intermediate",
  title: "Application Process (Intermediate)",
  description: "Handle common application concerns",
  difficulty: "INTERMEDIATE" as const,
  type: "APPLICATION" as const,
  requiredScore: 75,
  unlockCriteria: {
    requiredModules: ["application-beginner"],
    requiredScore: 70,
  },
  scenarios: [
    {
      agentScript:
        "I'll need your social security number to complete the application. This is used to verify your identity and ensure accurate processing of your policy.",
      expectedResponse:
        "Professional handling of sensitive information request",
      prospectResponse:
        "I'm not comfortable giving that over the phone. Is there another way?",
      scoringCriteria: {
        ...defaultScoringCriteria,
        trustBuilding: {
          weight: 40,
          keyPhrases: [
            "secure portal",
            "required for verification",
            "protect your identity",
          ],
          forbiddenPhrases: ["have to", "must", "required"],
        },
      },
    },
    {
      agentScript:
        "Let me explain how we protect your information and why this is necessary for your coverage...",
      expectedResponse: "Address security concerns professionally",
      prospectResponse: "Well, okay, if you're sure it's secure...",
      scoringCriteria: {
        ...defaultScoringCriteria,
        empathy: {
          weight: 40,
          keyPhrases: [
            "understand your concern",
            "protect your information",
            "security measures",
          ],
          forbiddenPhrases: ["just", "only", "quick"],
        },
      },
    },
  ],
};

const advancedScenarios = {
  id: "application-advanced",
  title: "Application Process (Advanced)",
  description: "Handle complex application situations and strong objections",
  difficulty: "ADVANCED" as const,
  type: "APPLICATION" as const,
  requiredScore: 80,
  unlockCriteria: {
    requiredModules: ["application-intermediate"],
    requiredScore: 75,
  },
  scenarios: [
    {
      agentScript:
        "Let's complete your application to secure this coverage for your family...",
      expectedResponse:
        "Handle complex emotional and financial concerns during application",
      prospectResponse:
        "I've been burned before by insurance companies. My husband had a policy but they refused to pay when he passed. How do I know this is different?",
      emotionalContext: {
        mood: "distrustful",
        intensity: "high",
        pacing: "guarded",
        naturalPauses: [
          { after: "burned before", durationMs: 1500 },
          { after: "refused to pay", durationMs: 2000 },
        ],
        voiceModulation: {
          baseline: "skeptical",
          emotional_pain: "when mentioning husband",
          anger: "discussing previous insurance experience",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 35,
          keyPhrases: [
            "understand your experience",
            "let me explain",
            "guarantee trust life",
          ],
          forbiddenPhrases: ["don't worry", "trust me", "you have to"],
        },
        empathy: {
          weight: 35,
          keyPhrases: [
            "that must have been devastating",
            "valid concern",
            "here's how we're different",
          ],
          forbiddenPhrases: ["but", "however", "just"],
        },
        trustBuilding: {
          weight: 30,
          keyPhrases: [
            "proven track record",
            "clear terms",
            "written guarantee",
          ],
          forbiddenPhrases: ["unlike them", "better than", "they were wrong"],
        },
      },
    },
    {
      agentScript:
        "I need to collect your banking information to set up the payments...",
      expectedResponse: "Handle strong payment security concerns",
      prospectResponse:
        "Last time I gave my banking info over the phone, someone tried to steal from my account. I'm really nervous about this.",
      emotionalContext: {
        mood: "anxious",
        intensity: "high",
        pacing: "hesitant",
        naturalPauses: [
          { after: "steal from my account", durationMs: 1500 },
          { after: "really nervous", durationMs: 1000 },
        ],
        voiceModulation: {
          baseline: "worried",
          stress: "when mentioning previous fraud",
          uncertainty: "throughout",
        },
      },
      scoringCriteria: {
        ...defaultScoringCriteria,
        securityAssurance: {
          weight: 40,
          keyPhrases: [
            "secure encrypted system",
            "licensed and regulated",
            "protection guarantees",
          ],
          forbiddenPhrases: [
            "nothing to worry about",
            "perfectly safe",
            "trust us",
          ],
        },
      },
    },
    {
      agentScript:
        "Before we complete the application, let me verify all your information...",
      expectedResponse: "Handle last-minute doubts and concerns",
      prospectResponse:
        "Wait, I'm having second thoughts. Maybe I should talk to my children first before signing anything.",
      emotionalContext: {
        mood: "uncertain",
        intensity: "medium",
        pacing: "slowing",
        naturalPauses: [
          { after: "second thoughts", durationMs: 1500 },
          { after: "signing anything", durationMs: 1000 },
        ],
        voiceModulation: {
          baseline: "hesitant",
          uncertainty: "increasing throughout",
          concern: "when mentioning children",
        },
      },
      scoringCriteria: {
        ...defaultScoringCriteria,
        closingSkills: {
          weight: 40,
          keyPhrases: [
            "protect your family today",
            "rates may increase",
            "secure your coverage now",
          ],
          forbiddenPhrases: ["take your time", "think it over", "call me back"],
        },
      },
    },
  ],
};

export const applicationScenarios: Module[] = [
  beginnerScenarios,
  intermediateScenarios,
  advancedScenarios,
];
