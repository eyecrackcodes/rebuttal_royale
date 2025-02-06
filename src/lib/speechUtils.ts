import { voiceConfig } from "@/config/voice-config";

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

// @ts-expect-error Web Speech API types not fully supported
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export const startListening = (
  onResult: (text: string) => void,
  onError: (error: string) => void
) => {
  try {
    // Check if browser supports speech recognition
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      onError("Speech recognition is not supported in this browser");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("Speech recognition started");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = "Speech recognition error";

      switch (event.error) {
        case "no-speech":
          errorMessage =
            "No speech detected. Please speak into your microphone.";
          break;
        case "aborted":
          errorMessage = "Speech recognition was aborted. Please try again.";
          break;
        case "audio-capture":
          errorMessage =
            "No microphone detected. Please check your microphone settings.";
          break;
        case "not-allowed":
          errorMessage =
            "Microphone access denied. Please allow microphone access in your browser settings.";
          break;
        case "network":
          errorMessage =
            "Network error occurred. Please check your internet connection.";
          break;
      }

      onError(errorMessage);
    };

    recognition.start();
    return recognition;
  } catch (error) {
    onError("Failed to initialize speech recognition");
    return null;
  }
};

export const speakText = async (text: string): Promise<void> => {
  console.log("Speaking text with ElevenLabs:", text);

  const ELEVEN_LABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  // Using a default voice ID - replace with your preferred one
  const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

  if (!ELEVEN_LABS_API_KEY) {
    console.error("ElevenLabs API key not found");
    return;
  }

  try {
    // Using the direct API endpoint instead of environment variable
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error(`ElevenLabs API error status: ${response.status}`);
      const errorText = await response.text();
      console.error(`ElevenLabs API error details:`, errorText);
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        reject(error);
      };
      audio.play();
    });
  } catch (error) {
    console.error("Error with ElevenLabs TTS:", error);
    // Fallback to browser TTS if ElevenLabs fails
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);
      window.speechSynthesis.speak(utterance);
    });
  }
};

// Export SpeechRecognition for use in other files
export type { SpeechRecognition };

// Add type declaration for window
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    speechRecognition?: SpeechRecognition;
  }
}

let currentVoiceId: string | null = null;

export const initializeVoice = () => {
  const voice = voiceConfig.getRandomVoice();
  currentVoiceId = voice.id;
  return voice;
};

export const getCurrentVoice = () => {
  if (!currentVoiceId) {
    return initializeVoice();
  }
  return (
    voiceConfig.voices.find((v) => v.id === currentVoiceId) || initializeVoice()
  );
};
