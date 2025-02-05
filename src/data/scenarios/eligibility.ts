import { Module } from "@/types/training";
import { defaultScoringCriteria, defaultPenalties } from "@/utils/scoring";
import { validationPatterns } from "@/utils/validation";

const beginnerScenarios = {
  id: "eligibility-beginner",
  title: "Eligibility Process",
  description: "Learn the basics of eligibility verification",
  difficulty: "BEGINNER" as const,
  requiredScore: 70,
  scenarios: [
    {
      agentScript:
        "Here's what we'll do over the next few minutes. I need to ask you some questions to determine what you might qualify for, I'll let you know exactly how these plans work, answer any questions you have, and then YOU decide if this is something you want to move forward with. Fair enough?",
      expectedResponse:
        "Let me explain our process and get some basic information to find the best plan for you.",
      prospectResponse:
        "Okay, that sounds good. I just want to make sure I understand everything before making a decision.",
      emotionalContext: {
        mood: "neutral",
        intensity: "low",
        pacing: "steady",
        naturalPauses: [{ after: "sounds good", durationMs: 1000 }],
        voiceModulation: {
          baseline: "calm",
          slight_uncertainty: "at 'make sure I understand'",
        },
      },
    },
    {
      agentScript: "What's your date of birth?",
      expectedResponse: "Begin qualification questions with date of birth",
      prospectResponse:
        "It's March 15th, 1955. I hope that's not too old for coverage.",
      emotionalContext: {
        mood: "slightly concerned",
        intensity: "low",
        pacing: "normal",
        naturalPauses: [{ after: "1955", durationMs: 1000 }],
        voiceModulation: {
          baseline: "neutral",
          slight_worry: "at 'hope that's not too old'",
        },
      },
    },
    {
      agentScript: "Do you have an active Checking or Savings Account?",
      expectedResponse: "Verify banking information professionally",
      prospectResponse: "Yes, I have a checking account",
      keyPhrases: ["active account", "checking", "savings"],
      forbiddenPhrases: ["bank", "money", "must"],
      scoringCriteria: defaultScoringCriteria,
    },
    {
      agentScript:
        "Do you get it deposited on a Direct Express card or bank account?",
      expectedResponse: "Confirm deposit method",
      prospectResponse: "It goes into my bank account",
      keyPhrases: ["deposited", "Direct Express", "bank account"],
      forbiddenPhrases: ["have to", "required", "must"],
      scoringCriteria: defaultScoringCriteria,
    },
  ],
};

const intermediateScenarios = {
  id: "eligibility-intermediate",
  title: "Eligibility Process",
  description: "Handle common eligibility objections",
  difficulty: "INTERMEDIATE" as const,
  requiredScore: 75,
  scenarios: [
    {
      agentScript: "Here's what we'll do over the next few minutes...",
      expectedResponse:
        "Let me explain our process and get some basic information to find the best plan for you.",
      prospectResponse:
        "I've had some bad experiences with insurance before. I need to know this isn't going to be a waste of my time.",
      emotionalContext: {
        mood: "guarded",
        intensity: "medium",
        pacing: "measured",
        naturalPauses: [
          { after: "insurance before", durationMs: 1500 },
          { after: "waste of my time", durationMs: 2000 },
        ],
        voiceModulation: {
          baseline: "skeptical",
          emphasis: "at 'waste of my time'",
          undertone: "past disappointment",
        },
      },
    },
    {
      agentScript:
        "I understand your concern. To find the best options for you, could you share your date of birth?",
      expectedResponse:
        "Transition to qualification questions after addressing concern",
      prospectResponse:
        "It's March 15th, 1955. My last agent said that was too old, so I'm not getting my hopes up.",
      emotionalContext: {
        mood: "resigned",
        intensity: "medium",
        pacing: "hesitant",
        naturalPauses: [
          { after: "1955", durationMs: 1500 },
          { after: "too old", durationMs: 1000 },
        ],
        voiceModulation: {
          baseline: "defeated",
          bitter_note: "at 'last agent'",
          trailing_off: "at 'hopes up'",
        },
      },
    },
    {
      agentScript:
        "OK, I'm starting a quote for you, but while I do that, what's got you thinking about buying life insurance today?",
      expectedResponse:
        "Transition to motivation question while processing information",
      prospectResponse:
        "My sister recently passed away and it was hard on the family financially",
      keyPhrases: ["quote", "thinking about", "today"],
      forbiddenPhrases: ["have to", "required", "must"],
      bestPractices: [
        "Allow customer to tell their full story without interruption",
        "This is an emotional question - give extra time for response",
        "Use supportive silence to encourage sharing",
        "Wait for complete silence before responding",
      ],
      scoringPenalties: {
        ...defaultPenalties,
        emotionalInterruption: -60,
      },
      scoringCriteria: defaultScoringCriteria,
    },
  ],
};

const advancedScenarios = {
  id: "eligibility-advanced",
  title: "Eligibility Process",
  description:
    "Master complex eligibility scenarios with high emotional intelligence",
  difficulty: "ADVANCED" as const,
  requiredScore: 80,
  scenarios: [
    {
      agentScript: "Here's what we'll do over the next few minutes...",
      expectedResponse:
        "Let me explain our process and get some basic information to find the best plan for you.",
      prospectResponse:
        "Look, I lost ten thousand dollars to an insurance scam last year. Ten thousand! My kids won't even talk to me anymore because of it. So don't think for a second I'm just going to trust you.",
      emotionalContext: {
        mood: "traumatized",
        intensity: "very high",
        pacing: "agitated",
        naturalPauses: [
          { after: "ten thousand dollars", durationMs: 2000 },
          { after: "talk to me anymore", durationMs: 2500 },
        ],
        voiceModulation: {
          baseline: "defensive",
          emotional_peak: "at 'kids won't even talk'",
          building_intensity: "throughout entire response",
          voice_crack: "at 'trust you'",
        },
      },
    },
    {
      agentScript: "I hear how devastating that experience was...",
      expectedResponse:
        "Show deep empathy while maintaining professional boundaries",
      prospectResponse:
        "My wife passed away three months ago and I just... I can't leave my kids with nothing like she did. But I'm terrified of making another mistake. I couldn't handle losing more money right now.",
      emotionalContext: {
        mood: "grief_stricken",
        intensity: "extreme",
        pacing: "uneven",
        naturalPauses: [
          { after: "three months ago", durationMs: 3000 },
          { after: "like she did", durationMs: 2500 },
          { after: "another mistake", durationMs: 2000 },
        ],
        voiceModulation: {
          baseline: "vulnerable",
          emotional_breaks: ["at 'I just'", "at 'terrified'"],
          voice_trembling: "throughout",
          near_tears: "at 'losing more money'",
        },
      },
    },
    {
      agentScript:
        "[warm, confident tone] That's exactly why I'm here to help. We work with multiple carriers that specialize in coverage regardless of age or health. [genuine, conversational pause] In fact, I just helped someone in a similar situation last week get approved. [encouraging tone] What's your date of birth so I can find the best options for you?",
      expectedResponse:
        "Build confidence with specific example and return to question",
      prospectResponse:
        "[quiet, hesitant] Well... okay. March 15th, 1955. [tone hardening] But I'm still skeptical about giving my banking information. [defensive] Last time, they just took the money and ran.",
      emotionalContext: {
        mood: "mixed",
        intensity: "fluctuating",
        pacing: "uneven",
        voiceModulation: "varying",
        keyEmotions: ["cautious-hope", "suspicion", "past-trauma"],
      },
      bestPractices: [
        "Acknowledge both the cooperation and the remaining concern",
        "Use a steady, reassuring pace when handling sensitive information",
        "Keep tone warm but professional when discussing past fraud",
        "Allow anger without becoming defensive",
        "Use strategic pauses to let emotions settle",
      ],
      scoringCriteria: {
        ...defaultScoringCriteria,
        trustBuilding: {
          weight: 45,
          keyPhrases: [
            "thank you for trusting me with that",
            "let me explain how we protect you",
            "everything is verified and secured",
          ],
          forbiddenPhrases: [
            "nothing to worry about",
            "you'll be fine",
            "trust me",
          ],
        },
      },
    },
  ],
};

export const eligibilityScenarios: Module[] = [
  beginnerScenarios,
  intermediateScenarios,
  advancedScenarios,
];
