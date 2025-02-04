export const voiceConfig = {
  voices: [
    {
      id: "21m00Tcm4TlvDq8ikWAM", // Rachel
      settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        speaking_rate: 1
      }
    },
    {
      id: "AZnzlk1XvdvUeBnXmlld", // Domi
      settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        speaking_rate: 1
      }
    },
    {
      id: "EXAVITQu4vr4xnSDxMaL", // Bella
      settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        speaking_rate: 1
      }
    }
  ],
  getRandomVoice() {
    return this.voices[Math.floor(Math.random() * this.voices.length)];
  }
}; 