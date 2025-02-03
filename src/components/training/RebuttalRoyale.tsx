"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Shield, Target, Mic, Volume2, VolumeX } from "lucide-react";
import { startListening, speakText } from "@/lib/speechUtils";
import { config } from "@/lib/config";
import { trainingConfig } from "@/config/training-config";
import { Tutorial } from "@/components/training/Tutorial";

interface GameState {
  isActive: boolean;
  currentObjection: string;
  objectionType: string;
  level: number;
  score: number;
  streak: number;
  feedback: string;
  history: Array<{
    objection: string;
    response: string;
    points: number;
  }>;
  emotion: string;
  emotionIntensity: number;
}

export default function RebuttalRoyale() {
  const [gameState, setGameState] = useState<GameState>({
    isActive: false,
    currentObjection: "",
    objectionType: "",
    level: 1,
    score: 0,
    streak: 0,
    feedback: "",
    history: [],
    emotion: "",
    emotionIntensity: 0.5,
  });

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [badges, setBadges] = useState({
    pricemaster: false,
    trustbuilder: false,
    closingchamp: false,
  });

  const startGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/rebuttal-royale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: gameState.level,
          currentScore: gameState.score,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setGameState(prev => ({
        ...prev,
        isActive: true,
        currentObjection: data.content,
        objectionType: data.objectionType,
        emotion: data.emotion,
        emotionIntensity: data.intensity,
      }));

      if (isSpeaking) {
        await handleSpeech(data.content, data.emotion, data.intensity);
      }
    } catch (error) {
      console.error("Game start error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = async (response: string) => {
    setIsLoading(true);
    try {
      const result = await fetch("/api/rebuttal-royale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: gameState.level,
          currentScore: gameState.score,
          lastResponse: response,
        }),
      });

      const data = await result.json();
      if (!result.ok) throw new Error(data.error);

      setGameState(prev => ({
        ...prev,
        score: data.score,
        feedback: data.feedback,
        currentObjection: data.content,
        objectionType: data.objectionType,
        streak: data.score > prev.score ? prev.streak + 1 : 0,
        history: [...prev.history, {
          objection: prev.currentObjection,
          response,
          points: data.score - prev.score,
        }],
        emotion: data.emotion,
        emotionIntensity: data.intensity,
      }));

      setBadges(data.badges);

      if (data.score > gameState.score && gameState.streak >= 2) {
        // Level up after 3 successful responses
        setGameState(prev => ({
          ...prev,
          level: Math.min(prev.level + 1, 5),
        }));
      }

      if (isSpeaking) {
        await handleSpeech(data.content, data.emotion, data.intensity);
      }
    } catch (error) {
      console.error("Response error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = async (text: string, emotion: string, intensity: number) => {
    if (!config.elevenlabs.apiKey) return;
    try {
      const cleanText = text
        .replace(/Customer:/g, '')
        .replace(/\*([^*]+)\*/g, '')
        .replace(/\([^)]+\)/g, '')
        .replace(/\[[^\]]+\]/g, '')
        .replace(/[.,!?;](?=\s|$)/g, match => `${match} `)
        .trim();

      const voiceProfile = Math.random() > 0.5 
        ? trainingConfig.voiceProfiles.elderlyMale 
        : trainingConfig.voiceProfiles.elderlyFemale;

      // Map emotions to voice settings
      const emotionSettings = {
        frustrated: { stability: 0.3, similarity_boost: 0.8, style: 0.8 },
        concerned: { stability: 0.6, similarity_boost: 0.7, style: 0.6 },
        skeptical: { stability: 0.5, similarity_boost: 0.6, style: 0.7 },
        interested: { stability: 0.8, similarity_boost: 0.6, style: 0.4 },
        resistant: { stability: 0.4, similarity_boost: 0.8, style: 0.8 },
      };

      const emotionalSSML = `
        <speak>
          <prosody rate="${85 + (intensity * 10)}%" pitch="${-2 + (intensity * 2)}%">
            ${emotion === 'frustrated' || emotion === 'resistant' ? '<emphasis level="strong">' : ''}
            ${cleanText}
            ${emotion === 'frustrated' || emotion === 'resistant' ? '</emphasis>' : ''}
          </prosody>
        </speak>
      `;

      await speakText(
        emotionalSSML,
        config.elevenlabs.apiKey,
        voiceProfile.voiceId,
        {
          ...voiceProfile.settings,
          ...emotionSettings[emotion as keyof typeof emotionSettings],
          speaking_rate: 0.85 + (intensity * 0.15),
          speaking_pause: 0.5 - (intensity * 0.2),
        }
      );
    } catch (error) {
      console.error("Speech error:", error);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      window.speechRecognition?.stop();
      setIsListening(false);
      return;
    }

    const recognition = startListening(
      async (text) => {
        setIsListening(false);
        await handleResponse(text);
      },
      (error) => {
        console.error(error);
        setIsListening(false);
      }
    );

    window.speechRecognition = recognition;
    setIsListening(true);
  };

  return (
    <div className="relative">
      <Tutorial />
      <div className="bg-gradient-to-br from-purple-900 to-blue-900 dark:from-gray-800 dark:to-gray-900 p-4 md:p-6 rounded-lg border border-purple-500 dark:border-gray-700">
        {/* Header - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl md:text-2xl font-bold text-white">Rebuttal Royale</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-center">
              <p className="text-xs text-blue-300">LEVEL</p>
              <p className="text-lg font-bold text-blue-200">{gameState.level}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-yellow-300">SCORE</p>
              <p className="text-lg font-bold text-yellow-400">{gameState.score}</p>
            </div>
            {gameState.streak > 0 && (
              <div className="text-center">
                <p className="text-xs text-orange-300">STREAK</p>
                <p className="text-lg font-bold text-orange-400">
                  {gameState.streak}🔥
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Badges - Scrollable on Mobile */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {badges.pricemaster && (
            <div className="bg-yellow-500/20 px-2 py-1 rounded-full text-xs text-yellow-300 flex items-center gap-1">
              <Star className="w-3 h-3" /> Price Master
            </div>
          )}
          {badges.trustbuilder && (
            <div className="bg-blue-500/20 px-2 py-1 rounded-full text-xs text-blue-300 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Trust Builder
            </div>
          )}
          {badges.closingchamp && (
            <div className="bg-green-500/20 px-2 py-1 rounded-full text-xs text-green-300 flex items-center gap-1">
              <Target className="w-3 h-3" /> Closing Champ
            </div>
          )}
        </div>

        {/* Game Content - Mobile Optimized */}
        {!gameState.isActive ? (
          <div className="text-center py-4 md:py-8">
            <p className="text-blue-200 mb-4">
              Master the art of handling objections in this fast-paced training game!
            </p>
            <Button
              onClick={startGame}
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? "Loading..." : "Start Game"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Objection */}
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-blue-400">
                  {gameState.objectionType} OBJECTION
                </span>
              </div>
              <p className="text-blue-100">{gameState.currentObjection}</p>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <Button
                onClick={toggleListening}
                disabled={isLoading}
                variant="outline"
                className={`border-blue-700 ${
                  isListening ? "bg-orange-500" : "hover:bg-blue-800"
                }`}
              >
                <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
              </Button>
              <Button
                onClick={() => setIsSpeaking(!isSpeaking)}
                variant="outline"
                className="border-blue-700 hover:bg-blue-800"
              >
                {isSpeaking ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </Button>
              <Button
                onClick={() => {
                  setGameState(prev => ({ ...prev, isActive: false }));
                  setIsListening(false);
                }}
                variant="outline"
                className="border-blue-700 text-blue-200 hover:bg-blue-800"
              >
                End Game
              </Button>
            </div>

            {/* Feedback */}
            {gameState.feedback && (
              <div className="bg-blue-900/20 p-3 rounded border border-blue-800">
                <p className="text-blue-200 text-sm">{gameState.feedback}</p>
              </div>
            )}

            {/* History */}
            <div className="mt-4 space-y-2">
              {gameState.history.slice(-3).map((item, index) => (
                <div
                  key={index}
                  className="text-sm bg-blue-900/10 p-2 rounded border border-blue-800/50"
                >
                  <p className="text-blue-300">{item.objection}</p>
                  <p className="text-blue-100">↳ {item.response}</p>
                  <p className="text-yellow-400 text-xs">+{item.points} points</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 