interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

// @ts-expect-error - Web Speech API types not fully supported
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export const startListening = (
  onResult: (text: string) => void,
  onError: (error: string) => void
) => {
  if (!("webkitSpeechRecognition" in window)) {
    onError("Speech recognition is not supported in this browser.");
    return null;
  }

  // @ts-ignore - webkit prefix not in types
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const text = event.results[0][0].transcript;
    onResult(text);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    onError(`Speech recognition error: ${event.error}`);
  };

  recognition.start();
  return recognition;
};

export const speakText = async (
  text: string,
  apiKey: string,
  voiceId: string = "ThT5KcBeYPX3keUQqHPh"
) => {
  try {
    console.log("Starting text-to-speech...");
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.7,
            similarity_boost: 0.7,
            style: 0.7,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("ElevenLabs API error:", errorData);
      throw new Error("Failed to generate speech");
    }

    console.log("Got audio response, creating blob...");
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    console.log("Playing audio...");
    await audio.play();

    // Cleanup
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      console.log("Audio playback completed");
    };
  } catch (error) {
    console.error("Text-to-speech error:", error);
    throw error;
  }
};
