"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Volume2, VolumeX, ChevronDown, Phone } from "lucide-react";
import { startListening, speakText } from "@/lib/speechUtils";
import { config } from "@/lib/config";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function InteractiveSession() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Number of messages to show in collapsed view
  const VISIBLE_MESSAGES = 3;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInitialMessage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content:
                "Start an inbound final expense insurance sales call simulation. You are the customer calling in response to one of our advertisements. Begin with a realistic scenario explaining which ad you saw and why you're calling.",
            },
          ],
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to start conversation");

      setMessages([{ role: "assistant", content: data.content }]);
      setIsCallActive(true);

      if (isSpeaking && data.content) {
        await handleSpeech(data.content);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = async (text: string) => {
    if (!config.elevenlabs.apiKey) {
      console.error("ElevenLabs API key not found");
      return;
    }

    try {
      const voiceId = "ThT5KcBeYPX3keUQqHPh"; // ElevenLabs "Grace" voice (elderly female)
      await speakText(text, config.elevenlabs.apiKey, voiceId);
    } catch (error) {
      console.error("Speech error:", error);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = startListening(
      async (text) => {
        setIsListening(false);
        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [
                ...messages.map((message) => ({
                  role: message.role,
                  content: message.content,
                })),
                { role: "user", content: text },
              ],
            }),
          });

          const data = await response.json();
          if (data.error) throw new Error(data.error);

          setMessages((prevMessages) => [
            ...prevMessages,
            { role: "user", content: text },
            { role: "assistant", content: data.content },
            { role: "user", content: data.speech },
          ]);
          if (isSpeaking && data.speech) {
            await handleSpeech(data.speech);
          }
        } catch (error) {
          console.error("Chat error:", error);
          setError(
            error instanceof Error
              ? error.message
              : "Failed to process response"
          );
        }
      },
      (error) => {
        console.error(error);
        setIsListening(false);
        setError(error);
      }
    );

    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const visibleMessages = isExpanded
    ? messages
    : messages.slice(-VISIBLE_MESSAGES);

  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-950 p-4 md:p-6 rounded-lg border border-blue-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-bold text-white">
          Call Training
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsSpeaking(!isSpeaking)}
            variant="outline"
            size="sm"
            className="border-blue-700"
          >
            {isSpeaking ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 p-3 rounded-lg mb-4">
          <p className="text-red-200 text-sm">{error}</p>
          <Button
            variant="link"
            className="text-red-300 p-0 h-auto text-sm"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {!isCallActive ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-blue-200 mb-4 text-center">
            Ready to practice your sales call skills? Start a simulated inbound
            call.
          </p>
          <Button
            onClick={handleInitialMessage}
            disabled={isLoading}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Phone className="w-4 h-4 mr-2" />
            {isLoading ? "Starting Call..." : "Start Call"}
          </Button>
        </div>
      ) : (
        <>
          {/* Chat Container with Fixed Height */}
          <div
            ref={chatContainerRef}
            className="space-y-4 mb-4 overflow-y-auto max-h-[60vh] md:max-h-[400px] scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-900"
          >
            {messages.length > VISIBLE_MESSAGES && !isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="w-full text-center text-sm text-blue-400 hover:text-blue-300 py-2"
              >
                Show Previous Messages{" "}
                <ChevronDown className="inline w-4 h-4" />
              </button>
            )}

            {visibleMessages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === "assistant"
                    ? "bg-blue-800/30 border border-blue-700"
                    : "bg-blue-900/50 border border-blue-600"
                }`}
              >
                <p className="text-sm md:text-base text-blue-200">
                  {message.content}
                </p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-2 sticky bottom-0 bg-gradient-to-br from-blue-900 to-blue-950 pt-2">
            <Button
              onClick={toggleListening}
              disabled={isLoading}
              className={`flex-1 ${
                isListening
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-blue-700 hover:bg-blue-600"
              }`}
            >
              <Mic
                className={`w-4 h-4 mr-2 ${isListening ? "animate-pulse" : ""}`}
              />
              <span className="hidden md:inline">
                {isListening ? "Listening..." : "Start Speaking"}
              </span>
              <span className="md:hidden">{isListening ? "..." : "Speak"}</span>
            </Button>
            <Button
              onClick={() => {
                setIsCallActive(false);
                setMessages([]);
              }}
              variant="outline"
              className="border-blue-700"
            >
              End Call
            </Button>
          </div>

          {messages.length > VISIBLE_MESSAGES && isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="w-full text-center text-sm text-blue-400 hover:text-blue-300 mt-4"
            >
              Show Recent Messages Only
            </button>
          )}
        </>
      )}
    </div>
  );
}
