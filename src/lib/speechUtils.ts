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
      onError('Speech recognition is not supported in this browser');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = 'Speech recognition error';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please speak into your microphone.';
          break;
        case 'aborted':
          errorMessage = 'Speech recognition was aborted. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone detected. Please check your microphone settings.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your internet connection.';
          break;
      }
      
      onError(errorMessage);
    };

    recognition.start();
    return recognition;
  } catch (error) {
    onError('Failed to initialize speech recognition');
    return null;
  }
};

export const speakText = async (
  text: string,
  apiKey: string,
  voiceId: string,
  settings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    speaking_rate?: number;
  }
) => {
  try {
    if (!apiKey) {
      throw new Error('ElevenLabs API key is missing');
    }

    if (!voiceId) {
      throw new Error('ElevenLabs Voice ID is missing');
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: settings?.stability ?? 0.5,
            similarity_boost: settings?.similarity_boost ?? 0.75,
            style: settings?.style ?? 0.5,
            speaking_rate: settings?.speaking_rate ?? 1,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`ElevenLabs API error: ${errorData.detail || 'Failed to generate speech'}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    return new Promise<void>((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        reject(new Error('Failed to play audio'));
      };
      audio.play().catch(reject);
    });
  } catch (error) {
    console.error('Speech synthesis error:', error);
    throw error;
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
  return voiceConfig.voices.find(v => v.id === currentVoiceId) || initializeVoice();
};
