export const trainingConfig = {
  // Company-specific objection handling guidelines
  objectionHandling: {
    PRICE: {
      approvedPhrases: [
        "let me share how we make this affordable",
        "many of our clients are on fixed incomes",
        "we have flexible payment options",
      ],
      forbiddenPhrases: [
        "it's cheap",
        "you can afford this",
        "that's not expensive",
      ],
      requiredPoints: [
        "mention monthly payments",
        "discuss value vs cost",
        "reference family protection",
      ],
      sampleRebuttals: [
        "I understand being on a fixed income. Many of our clients are in the same situation, which is why we offer monthly payments as low as...",
        "That's exactly why we need to talk. The longer we wait, the more expensive it becomes...",
      ],
    },
    SPOUSE: {
      // ... similar structure for other objection types
    },
    // ... other objection types
  },

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
};
