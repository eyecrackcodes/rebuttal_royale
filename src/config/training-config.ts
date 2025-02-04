import { ObjectionType } from './objections';

interface ObjectionHandling {
  approvedPhrases: string[];
  forbiddenPhrases: string[];
  keyPhrases: Record<string, number>;
  sampleRebuttals: string[];
}

export const trainingConfig = {
  objectionHandling: {
    WORKING_WITH_AGENT: {
      approvedPhrases: [
        "I understand",
        "let me share what makes us unique",
        "we specialize in final expense",
        "no obligation to compare"
      ],
      forbiddenPhrases: [
        "they're not as good",
        "switch to us",
        "cancel that agent"
      ],
      keyPhrases: {
        "specialized coverage": 50,
        "unique benefits": 40,
        "no obligation": 40,
        "compare options": 30
      },
      sampleRebuttals: [
        "I respect your relationship with your agent. I specialize in final expense and would be happy to show you some unique benefits, no obligation."
      ]
    },
    WONT_PAY: {
      approvedPhrases: [
        "state-regulated company",
        "years of successful claims",
        "guaranteed coverage",
        "immediate payout"
      ],
      forbiddenPhrases: [
        "other companies",
        "not like them",
        "trust me"
      ],
      keyPhrases: {
        "state regulated": 50,
        "guaranteed coverage": 40,
        "immediate payout": 40,
        "successful claims": 30
      },
      sampleRebuttals: [
        "We're a state-regulated company with years of successful claims. Your coverage is guaranteed and pays out immediately to your family."
      ]
    },
    CHILDREN_CARE: {
      approvedPhrases: [
        "protect them from burden",
        "guaranteed acceptance",
        "peace of mind",
        "financial security"
      ],
      forbiddenPhrases: [
        "burden to children",
        "they can't afford",
        "don't trust them"
      ],
      keyPhrases: {
        "protect from burden": 50,
        "peace of mind": 40,
        "financial security": 40,
        "guaranteed acceptance": 30
      },
      sampleRebuttals: [
        "While your children are wonderful, this gives you peace of mind knowing they won't face any financial burden during a difficult time."
      ]
    },
    SPOUSE_CONSULT: {
      approvedPhrases: [
        "include them now",
        "three-way call",
        "protect together",
        "family decision"
      ],
      forbiddenPhrases: [
        "decide without them",
        "don't need permission",
        "just sign now"
      ],
      keyPhrases: {
        "protect together": 50,
        "family decision": 40,
        "include now": 40,
        "three-way call": 30
      },
      sampleRebuttals: [
        "I'd be happy to include your spouse in our conversation right now. We can do a quick three-way call to discuss protecting your family together."
      ]
    },
    EXISTING_COVERAGE: {
      approvedPhrases: [
        "let's review together",
        "supplement current coverage",
        "fill any gaps",
        "additional protection"
      ],
      forbiddenPhrases: [
        "cancel that policy",
        "not enough coverage",
        "waste of money"
      ],
      keyPhrases: {
        "review together": 50,
        "supplement coverage": 40,
        "fill gaps": 40,
        "additional protection": 30
      },
      sampleRebuttals: [
        "That's great you have some coverage! Let's review it together to make sure there aren't any gaps we need to fill for your family's protection."
      ]
    },
    AFFORDABILITY: {
      approvedPhrases: [
        "flexible payment options",
        "customize to your budget",
        "affordable monthly terms",
        "protect for dollars a day"
      ],
      forbiddenPhrases: [
        "can't afford",
        "too expensive",
        "cheap coverage"
      ],
      keyPhrases: {
        "flexible payments": 50,
        "customize budget": 40,
        "affordable terms": 40,
        "dollars a day": 30
      },
      sampleRebuttals: [
        "I understand cost is important. We have flexible payment options and can customize a plan to fit your budget, often for just dollars a day."
      ]
    },
    NOT_INTERESTED: {
      approvedPhrases: [
        "quick overview",
        "important benefits",
        "just 2 minutes",
        "valuable coverage"
      ],
      forbiddenPhrases: [
        "you need this",
        "don't be hasty",
        "big mistake"
      ],
      keyPhrases: {
        "quick overview": 30,
        "important benefits": 40,
        "2 minutes": 30,
        "valuable coverage": 40
      },
      sampleRebuttals: [
        "I understand. Could I take just 2 minutes to share some important benefits? Then you can decide if it's worth learning more."
      ]
    },
    SEND_INFO: {
      approvedPhrases: [
        "personalized review",
        "quick qualification",
        "immediate coverage",
        "better to discuss"
      ],
      forbiddenPhrases: [
        "no mailings",
        "won't send",
        "must decide now"
      ],
      keyPhrases: {
        "personalized review": 50,
        "quick qualification": 40,
        "immediate coverage": 40,
        "better discuss": 30
      },
      sampleRebuttals: [
        "I can actually give you a personalized review right now and see if you qualify. It only takes a few minutes and provides immediate coverage."
      ]
    },
    CALL_BACK: {
      approvedPhrases: [
        "rates may increase",
        "quick review now",
        "immediate protection",
        "better time today"
      ],
      forbiddenPhrases: [
        "won't call back",
        "now or never",
        "don't delay"
      ],
      keyPhrases: {
        "rates increase": 50,
        "quick review": 40,
        "immediate protection": 40,
        "today's rates": 30
      },
      sampleRebuttals: [
        "I understand you're busy. The challenge is rates can increase with age. Could we do a quick review now to lock in today's best rates?"
      ]
    },
    AGE_CONCERN: {
      approvedPhrases: [
        "perfect timing",
        "guaranteed acceptance",
        "designed for seniors",
        "protect loved ones"
      ],
      forbiddenPhrases: [
        "too old",
        "too young",
        "wrong age"
      ],
      keyPhrases: {
        "perfect timing": 50,
        "guaranteed acceptance": 40,
        "designed for you": 40,
        "protect loved ones": 30
      },
      sampleRebuttals: [
        "Actually, this is perfect timing. This coverage is specifically designed for seniors and comes with guaranteed acceptance."
      ]
    }
  } as Record<ObjectionType, ObjectionHandling>,

  // Voice settings for different personas
  voiceProfiles: {
    elderlyMale: {
      voiceId: "XrExE9yKIg1WjnnlVkGX", // Example ElevenLabs voice ID
      settings: {
        stability: 0.7,
        similarity_boost: 0.7,
        style: 0.65,
        use_speaker_boost: true,
      },
    },
    elderlyFemale: {
      voiceId: "ThT5KcBeYPX3keUQqHPh",
      settings: {
        stability: 0.8,
        similarity_boost: 0.7,
        style: 0.6,
        use_speaker_boost: true,
      },
    },
  },

  // Tutorial content
  tutorial: {
    steps: [
      {
        title: "Welcome to Rebuttal Royale",
        content:
          "Learn how to master objection handling through interactive training.",
        videoUrl: null, // Set to null until we have the video
        thumbnail: "/tutorials/welcome-thumb.jpg", // Optional thumbnail
      },
      {
        title: "Understanding Objections",
        content:
          "Learn about different types of objections and effective strategies to handle them.",
        videoUrl: null,
        thumbnail: "/tutorials/objections-thumb.jpg",
      },
      {
        title: "Voice Controls",
        content:
          "Use your voice to respond to objections and get real-time feedback.",
        videoUrl: null,
        thumbnail: "/tutorials/voice-thumb.jpg",
      },
      {
        title: "Scoring & Progression",
        content:
          "Understand how scoring works and how to level up your objection handling skills.",
        videoUrl: null,
        thumbnail: "/tutorials/scoring-thumb.jpg",
      },
    ],
  },

  // Scoring configuration
  scoring: {
    phraseMatching: {
      exact: 1.0,      // 100% of points for exact match
      partial: 0.7,    // 70% of points for partial match
      contextual: 0.5  // 50% of points for contextual match
    },
    bonuses: {
      multiPhrase: 1.2,        // 20% bonus for using multiple approved phrases
      personalizedResponse: 1.3 // 30% bonus for personalizing the response
    },
    penalties: {
      forbidden: -50,          // Points deducted for forbidden phrases
      repetition: 0.8,         // 20% penalty for repeating the same phrase
      tooShort: -20,          // Penalty for very short responses
      tooGeneric: -10         // Penalty for generic responses
    }
  },

  // Response validation rules
  validation: {
    minimumLength: 20,        // Minimum characters for a valid response
    maximumLength: 200,       // Maximum characters for a valid response
    requiredElements: {
      greeting: false,        // Whether response needs a greeting
      acknowledgment: true,   // Whether response should acknowledge the objection
      solution: true,         // Whether response should offer a solution
      callToAction: false    // Whether response needs a call to action
    }
  }
};
