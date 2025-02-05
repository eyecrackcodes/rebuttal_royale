import { Module } from "@/types/training";
import { defaultScoringCriteria, defaultPenalties } from "@/utils/scoring";
import { validationPatterns } from "@/utils/validation";

const beginnerScenarios = {
  id: "intake-beginner",
  title: "Intake Process (Beginner)",
  description: "Practice the standard intake flow",
  difficulty: "BEGINNER" as const,
  type: "INTAKE" as const,
  requiredScore: 70,
  unlockCriteria: {
    requiredModules: [],
    requiredScore: 0,
  },
  scenarios: [
    {
      agentScript:
        "Hello, this is [Name] with Luminary Life on a recorded line. How can I help you?",
      expectedResponse: "Exact greeting following compliance requirements",
      prospectResponse:
        "Hi, I saw your commercial about life insurance coverage up to $50,000. I wanted to get some information.",
      emotionalContext: {
        mood: "neutral",
        intensity: "low",
        pacing: "regular",
        naturalPauses: [{ after: "commercial", durationMs: 800 }],
        voiceModulation: {
          baseline: "casual",
          slight_interest: "at 'wanted to get some information'",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 30,
          keyPhrases: ["hello", "how can I help", "assist you"],
          forbiddenPhrases: ["yeah", "what", "huh"],
        },
        phrasing: {
          weight: 40,
          keyPhrases: ["with Luminary Life", "recorded line", "help you"],
          forbiddenPhrases: ["um", "uh", "hold on"],
        },
        empathy: {
          weight: 30,
          keyPhrases: ["pleased to help", "happy to assist"],
          forbiddenPhrases: ["whatever", "anyway"],
        },
      },
    },
    {
      agentScript:
        "Perfect, let me get some information from you so we can look at some options! What's your first and last name?",
      expectedResponse: "Smooth transition to name collection",
      prospectResponse:
        "Sure, my name is John Smith. I just want to know about the coverage first.",
      emotionalContext: {
        mood: "cooperative",
        intensity: "low",
        pacing: "steady",
        naturalPauses: [{ after: "John Smith", durationMs: 1000 }],
        voiceModulation: {
          baseline: "friendly",
          slight_hesitation: "at 'want to know about coverage'",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 35,
          keyPhrases: ["perfect", "let me", "options"],
          forbiddenPhrases: ["need", "must", "required"],
        },
        phrasing: {
          weight: 35,
          keyPhrases: ["look at some options", "first and last name"],
          forbiddenPhrases: ["give me", "tell me", "hurry"],
        },
        empathy: {
          weight: 30,
          keyPhrases: ["help you understand", "find the right fit"],
          forbiddenPhrases: ["just", "only", "quick"],
        },
      },
    },
    {
      agentScript:
        "And is this cell phone number I'm calling the best way to reach you?",
      expectedResponse: "Natural phone verification",
      prospectResponse: "Yes, this is my cell phone",
      keyPhrases: ["cell phone", "best way to reach you"],
      forbiddenPhrases: ["mobile", "um", "uh"],
      scoringCriteria: {
        ...defaultScoringCriteria,
        tonality: {
          weight: 30,
          keyPhrases: ["cell phone", "best number", "reach you"],
          forbiddenPhrases: ["give me", "what's your"],
        },
      },
    },
    {
      agentScript:
        "Great, I'm going to text you a link to my Bio! It has my direct contact info, my picture, my insurance license #, and if you like, you can read a little about me and the company.",
      expectedResponse: "Explain bio link purpose",
      prospectResponse: "Okay, that sounds good",
      keyPhrases: [
        "text you a link",
        "Bio",
        "direct contact info",
        "insurance license",
        "about me and the company",
      ],
      forbiddenPhrases: ["um", "uh", "yeah"],
      scoringCriteria: defaultScoringCriteria,
    },
    {
      agentScript: "What is your home address?",
      expectedResponse: "Collect full address information",
      prospectResponse: validationPatterns.address.examples,
      keyPhrases: ["home address"],
      forbiddenPhrases: ["live", "um", "uh"],
      validationPattern: validationPatterns.address.pattern,
      formatHint: validationPatterns.address.format,
      errorMessage: validationPatterns.address.errorMessage,
      scoringCriteria: {
        ...defaultScoringCriteria,
        accuracy: {
          weight: 40,
          keyPhrases: ["complete address", "verify", "confirm"],
          forbiddenPhrases: ["around", "somewhere", "about"],
        },
      },
    },
    {
      agentScript:
        "What is your email? I'd like to send you a recap after this call.",
      expectedResponse: "Request email with clear purpose",
      prospectResponse: validationPatterns.email.examples,
      keyPhrases: ["email", "send you a recap"],
      forbiddenPhrases: ["um", "uh", "yeah"],
      validationPattern: validationPatterns.email.pattern,
      formatHint: validationPatterns.email.format,
      errorMessage: validationPatterns.email.errorMessage,
      scoringCriteria: {
        ...defaultScoringCriteria,
        accuracy: {
          weight: 40,
          keyPhrases: ["valid email", "confirm", "verify"],
          forbiddenPhrases: ["whatever", "anything", "about"],
        },
      },
    },
  ],
};

const intermediateScenarios = {
  id: "intake-intermediate",
  title: "Intake Process (Intermediate)",
  description: "Handle mild objections during intake",
  difficulty: "INTERMEDIATE" as const,
  type: "INTAKE" as const,
  requiredScore: 75,
  unlockCriteria: {
    requiredModules: ["intake-beginner"],
    requiredScore: 70,
  },
  scenarios: [
    {
      agentScript:
        "Hello, this is [Name] with Luminary Life on a recorded line. How can I help you?",
      expectedResponse: "Professional greeting with objection handling",
      prospectResponse:
        "Yeah, I got something in the mail about insurance, but I need to know if this is legitimate before I give you any information.",
      emotionalContext: {
        mood: "skeptical",
        intensity: "medium",
        pacing: "cautious",
        naturalPauses: [
          { after: "about insurance", durationMs: 1500 },
          { after: "legitimate", durationMs: 1000 },
        ],
        voiceModulation: {
          baseline: "guarded",
          emphasis: "at 'before I give you any information'",
          undertone: "suspicion",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 35,
          keyPhrases: ["understand your concern", "licensed agent", "verify"],
          forbiddenPhrases: ["have to", "must", "required"],
        },
        phrasing: {
          weight: 35,
          keyPhrases: [
            "happy to provide",
            "let me explain",
            "completely understand",
          ],
          forbiddenPhrases: ["no problem", "don't worry", "relax"],
        },
        empathy: {
          weight: 30,
          keyPhrases: ["appreciate your caution", "valid concern"],
          forbiddenPhrases: ["obviously", "clearly", "just"],
        },
      },
    },
    {
      agentScript:
        "I understand your concern about privacy. I'm a licensed agent, and I'd be happy to provide my license number. Could I get your name to start?",
      expectedResponse: "Build trust while gathering information",
      prospectResponse:
        "My name is Robert, but I've had agents pressure me before. I don't want to waste time if the rates are too high.",
      emotionalContext: {
        mood: "cautious",
        intensity: "medium",
        pacing: "measured",
        naturalPauses: [
          { after: "is Robert", durationMs: 1200 },
          { after: "pressure me before", durationMs: 1500 },
        ],
        voiceModulation: {
          baseline: "firm",
          past_frustration: "at 'pressure me before'",
          assertive: "at 'don't want to waste time'",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 40,
          keyPhrases: [
            "appreciate you sharing",
            "let me assure you",
            "no pressure",
          ],
          forbiddenPhrases: ["calm down", "relax", "trust me"],
        },
        phrasing: {
          weight: 30,
          keyPhrases: ["work at your comfort level", "find what works for you"],
          forbiddenPhrases: ["should", "need to", "have to"],
        },
        empathy: {
          weight: 30,
          keyPhrases: ["understand your past experience", "respect your time"],
          forbiddenPhrases: ["but", "however", "anyway"],
        },
      },
    },
    {
      agentScript:
        "Great question! I'd like to text you a link to my Bio with my license information and picture, so you can verify who I am. Would that be helpful?",
      expectedResponse: "Explain purpose of phone verification and build trust",
      prospectResponse: "Oh, I see. Yes, this is my cell phone.",
      keyPhrases: ["Bio", "license information", "verify who I am"],
      forbiddenPhrases: ["um", "uh", "yeah"],
      scoringCriteria: defaultScoringCriteria,
    },
    {
      agentScript: "What's a good address to send the information to?",
      expectedResponse: "Ask for address with context",
      prospectResponse:
        "I'd rather not give that until I know more about the prices",
      keyPhrases: ["coverage to be based", "home address"],
      forbiddenPhrases: ["need", "must", "required"],
      validationPattern: validationPatterns.address.pattern,
      formatHint: validationPatterns.address.format,
      errorMessage: validationPatterns.address.errorMessage,
      scoringCriteria: defaultScoringCriteria,
      handleObjection: {
        response:
          "I understand your concern about privacy. The address helps us verify coverage areas and ensure you get the best rate available in your area. I can show you some general options first, and then we can confirm the exact rates once you're comfortable sharing your address.",
      },
    },
  ],
};

const advancedScenarios = {
  id: "intake-advanced",
  title: "Intake Process (Advanced)",
  description: "Master complex intake situations",
  difficulty: "ADVANCED" as const,
  type: "INTAKE" as const,
  requiredScore: 80,
  unlockCriteria: {
    requiredModules: ["intake-intermediate"],
    requiredScore: 75,
  },
  scenarios: [
    {
      agentScript:
        "Hello, this is [Name] with Luminary Life on a recorded line. How can I help you?",
      expectedResponse: "Handle emotional initial contact professionally",
      prospectResponse:
        "I got your letter right after my husband's funeral. Do you know how that feels? To be reminded that you have nothing in place? My kids keep asking what we're going to do now.",
      emotionalContext: {
        mood: "grief_and_anger",
        intensity: "very high",
        pacing: "emotional",
        naturalPauses: [
          { after: "husband's funeral", durationMs: 2500 },
          { after: "how that feels", durationMs: 2000 },
          { after: "nothing in place", durationMs: 1800 },
        ],
        voiceModulation: {
          baseline: "distraught",
          voice_breaking: "at 'husband's funeral'",
          rising_emotion: "at 'do you know how that feels'",
          vulnerable: "at 'kids keep asking'",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 35,
          keyPhrases: ["I hear you", "take your time", "I'm listening"],
          forbiddenPhrases: ["calm down", "relax", "don't worry"],
        },
        phrasing: {
          weight: 35,
          keyPhrases: ["I understand this is difficult", "here to help you"],
          forbiddenPhrases: ["but", "however", "anyway"],
        },
        empathy: {
          weight: 30,
          keyPhrases: [
            "I'm so sorry for your loss",
            "this must be overwhelming",
          ],
          forbiddenPhrases: ["at least", "look on the bright side", "just"],
        },
      },
    },
    {
      agentScript: "I hear how overwhelming this must be...",
      expectedResponse: "Show deep empathy while gathering information",
      prospectResponse:
        "The medical bills took everything we had. Everything. Now I'm 63 years old, starting over, and terrified about what happens to my children if something happens to me too.",
      emotionalContext: {
        mood: "desperation",
        intensity: "extreme",
        pacing: "uneven",
        naturalPauses: [
          { after: "everything we had", durationMs: 3000 },
          { after: "starting over", durationMs: 2000 },
          { after: "happens to me too", durationMs: 2500 },
        ],
        voiceModulation: {
          baseline: "vulnerable",
          emotional_peak: "at 'everything we had'",
          voice_trembling: "throughout",
          fear_evident: "at 'terrified'",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 40,
          keyPhrases: ["I understand", "let me help", "we can work together"],
          forbiddenPhrases: ["don't worry", "it's fine", "no problem"],
        },
        phrasing: {
          weight: 30,
          keyPhrases: ["focus on one step at a time", "here to help you"],
          forbiddenPhrases: ["should have", "must", "have to"],
        },
        empathy: {
          weight: 30,
          keyPhrases: ["that's a heavy burden", "understand your fear"],
          forbiddenPhrases: ["anyway", "however", "regardless"],
        },
      },
    },
    {
      agentScript: "Let me help you understand your options...",
      expectedResponse: "Transition to solutions while maintaining empathy",
      prospectResponse:
        "I can barely sleep at night thinking about this. The funeral home gave me some information but I just couldn't process it then. I need someone to just tell me what to do.",
      emotionalContext: {
        mood: "overwhelmed",
        intensity: "high",
        pacing: "fatigued",
        naturalPauses: [
          { after: "sleep at night", durationMs: 2000 },
          { after: "process it then", durationMs: 2500 },
        ],
        voiceModulation: {
          baseline: "exhausted",
          emotional_weight: "throughout",
          pleading: "at 'tell me what to do'",
          voice_strain: "showing emotional fatigue",
        },
      },
      scoringCriteria: {
        tonality: {
          weight: 40,
          keyPhrases: ["I can barely sleep at night thinking about this"],
          forbiddenPhrases: ["calm down", "don't worry", "just"],
        },
        phrasing: {
          weight: 30,
          keyPhrases: ["I can barely sleep at night thinking about this"],
          forbiddenPhrases: ["calm down", "don't worry", "just"],
        },
        empathy: {
          weight: 30,
          keyPhrases: ["I can barely sleep at night thinking about this"],
          forbiddenPhrases: ["calm down", "don't worry", "just"],
        },
      },
    },
  ],
};

export const intakeScenarios: Module[] = [
  beginnerScenarios,
  intermediateScenarios,
  advancedScenarios,
];
