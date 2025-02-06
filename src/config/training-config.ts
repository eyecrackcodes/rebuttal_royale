// Keep only the necessary types
interface TutorialStep {
  title: string;
  content: string;
  videoUrl: string | null;
  thumbnail: string;
}

// Remove the objection handling interfaces and configurations
export const trainingConfig = {
  // Keep tutorial content
  tutorial: {
    steps: [
      {
        title: "Welcome to Rebuttal Royale",
        content:
          "Learn how to master objection handling through interactive training.",
        videoUrl: null,
        thumbnail: "/tutorials/welcome-thumb.jpg",
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

  // Keep voice settings if you're using them elsewhere
  voiceProfiles: {
    elderlyMale: {
      voiceId: "XrExE9yKIg1WjnnlVkGX",
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

  // Remove scoring and validation configurations as they were for rebuttal royale
};
