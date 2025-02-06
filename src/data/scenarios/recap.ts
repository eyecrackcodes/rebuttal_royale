import { Module } from "@/types/training";
import { defaultScoringCriteria, defaultPenalties } from "@/utils/scoring";

const beginnerScenarios = {
  id: "recap-beginner",
  title: "Recap Process (Beginner)",
  description: "Learn to effectively summarize the conversation",
  difficulty: "BEGINNER" as const,
  type: "RECAP" as const,
  requiredScore: 70,
  unlockCriteria: {
    requiredModules: ["education-beginner"],
    requiredScore: 70
  },
  scenarios: [
    {
      agentScript: "Let me summarize what we've discussed so far. You're looking for coverage to protect your family, particularly concerned about the mortgage, and we've found a solution that fits your budget at $75 per month. Did I capture everything correctly?",
      expectedResponse: "Clear, concise summary of key points",
      prospectResponse: "Yes, that sounds right. It's a relief to know my family would be protected.",
      emotionalContext: {
        mood: "relieved",
        intensity: "low",
        pacing: "steady",
        naturalPauses: [
          { after: "sounds right", durationMs: 800 },
          { after: "relief", durationMs: 500 }
        ],
        voiceModulation: {
          baseline: "comfortable",
          relief_evident: "at 'relief to know'"
        }
      },
      scoringCriteria: {
        tonality: {
          weight: 30,
          keyPhrases: ["let me summarize", "we've discussed", "capture everything"],
          forbiddenPhrases: ["as I said before", "like I mentioned", "remember"]
        },
        phrasing: {
          weight: 40,
          keyPhrases: ["you're looking for", "we've found", "fits your budget"],
          forbiddenPhrases: ["you have to", "you must", "you need"]
        },
        empathy: {
          weight: 30,
          keyPhrases: ["protect your family", "solution that fits", "did I capture"],
          forbiddenPhrases: ["just", "only", "basically"]
        }
      }
    }
  ]
};

const intermediateScenarios = {
  id: "recap-intermediate",
  title: "Recap Process (Intermediate)",
  description: "Handle complex recaps with multiple points",
  difficulty: "INTERMEDIATE" as const,
  type: "RECAP" as const,
  requiredScore: 75,
  unlockCriteria: {
    requiredModules: ["recap-beginner"],
    requiredScore: 70
  },
  scenarios: [
    {
      agentScript: "Let me make sure I have everything correct. You want $100,000 in coverage, we've found a rate of $75 monthly that fits your budget, and this includes the living benefits we discussed. The policy would cover your mortgage and provide additional support for your children's education. Is there anything else I should add?",
      expectedResponse: "Detailed recap with specific numbers and benefits",
      prospectResponse: "That's pretty thorough. I appreciate how you broke everything down. Just to be clear, this rate won't change, right?",
      emotionalContext: {
        mood: "attentive",
        intensity: "medium",
        pacing: "measured",
        naturalPauses: [
          { after: "that's pretty thorough", durationMs: 1200 },
          { after: "broke everything down", durationMs: 1000 }
        ],
        voiceModulation: {
          baseline: "engaged",
          seeking_confirmation: "at final question",
          appreciation: "at 'appreciate'"
        }
      },
      scoringCriteria: {
        tonality: {
          weight: 35,
          keyPhrases: ["make sure", "we've found", "would cover"],
          forbiddenPhrases: ["you said", "as mentioned", "like I said"]
        },
        phrasing: {
          weight: 35,
          keyPhrases: ["anything else to add", "includes the benefits", "fits your budget"],
          forbiddenPhrases: ["you told me", "as you mentioned", "remember when"]
        },
        empathy: {
          weight: 30,
          keyPhrases: ["support for your children", "fits your budget", "additional support"],
          forbiddenPhrases: ["obviously", "clearly", "simply"]
        }
      }
    }
  ]
};

const advancedScenarios = {
  id: "recap-advanced",
  title: "Recap Process (Advanced)",
  description: "Master complex recaps with emotional context",
  difficulty: "ADVANCED" as const,
  type: "RECAP" as const,
  requiredScore: 80,
  unlockCriteria: {
    requiredModules: ["recap-intermediate"],
    requiredScore: 75
  },
  scenarios: [
    {
      agentScript: "I want to make sure I've addressed all your concerns. You shared about your brother's passing and how that affected his family. We've designed a $100,000 policy that's guaranteed for 20 years at $75 monthly, including living benefits that would help if you became seriously ill. This gives your family the protection you want to prevent them from facing similar hardships. Have I understood everything correctly?",
      expectedResponse: "Comprehensive recap incorporating emotional context and specific details",
      prospectResponse: "Yes... yes, that's exactly it. You really listened to everything I said about my brother's family. That's why I want to make sure my kids never have to go through that.",
      emotionalContext: {
        mood: "emotionally_touched",
        intensity: "high",
        pacing: "reflective",
        naturalPauses: [
          { after: "Yes... yes", durationMs: 2000 },
          { after: "about my brother's family", durationMs: 1800 },
          { after: "go through that", durationMs: 1500 }
        ],
        voiceModulation: {
          baseline: "emotional",
          gratitude: "at 'really listened'",
          determination: "at 'never have to'",
          emotional_weight: "throughout"
        }
      },
      scoringCriteria: {
        tonality: {
          weight: 40,
          keyPhrases: ["addressed your concerns", "designed a policy", "gives your family"],
          forbiddenPhrases: ["as we discussed", "like you said", "mentioned earlier"]
        },
        phrasing: {
          weight: 30,
          keyPhrases: ["you shared", "we've designed", "prevent similar hardships"],
          forbiddenPhrases: ["you told me", "as you said", "remember when"]
        },
        empathy: {
          weight: 30,
          keyPhrases: ["protection you want", "prevent hardships", "understood everything"],
          forbiddenPhrases: ["anyway", "moving on", "regardless"]
        }
      }
    }
  ]
};

export const recapScenarios: Module[] = [
  beginnerScenarios,
  intermediateScenarios,
  advancedScenarios
]; 