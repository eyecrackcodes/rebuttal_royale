"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Shield, Target, Mic, Volume2, VolumeX } from "lucide-react";
import { startListening, speakText } from "@/lib/speechUtils";
import { config } from "@/lib/config";
import { trainingConfig } from "@/config/training-config";
import { Tutorial } from "@/components/training/Tutorial";
import { voiceConfig } from "@/config/voice-config";
import { Level } from "@/config/levels";
import { ProgressBar } from "@/components/training/ProgressBar";
import { LevelComplete } from "@/components/training/LevelComplete";
import { LevelSummary } from "@/components/training/LevelSummary";
import { ObjectionType } from '@/config/objections';
import { cleanTextForSpeech } from "@/lib/textUtils";

interface GameState {
  isActive: boolean;
  currentObjection: string;
  objectionType: string;
  level: Level;
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
  tips: string;
  badges: {
    pricemaster: boolean;
    trustbuilder: boolean;
    closingchamp: boolean;
  };
  objectionsCompleted: number;
  levelStats: {
    totalResponses: number;
    averageScore: number;
    bestResponse: string;
    areasToImprove: string[];
    usedPhrases: string[];
    missedOpportunities: string[];
  };
}

export default function RebuttalRoyale() {
  const [gameState, setGameState] = useState<GameState>({
    isActive: false,
    currentObjection: "",
    objectionType: "",
    level: {} as Level,
    score: 0,
    streak: 0,
    feedback: "",
    history: [],
    emotion: "",
    emotionIntensity: 0.3,
    tips: "",
    badges: {
      pricemaster: false,
      trustbuilder: false,
      closingchamp: false
    },
    objectionsCompleted: 0,
    levelStats: {
      totalResponses: 0,
      averageScore: 0,
      bestResponse: '',
      areasToImprove: [],
      usedPhrases: [],
      missedOpportunities: []
    },
  });

  const [isListening, setIsListening] = useState(false);
  const [autoListen, setAutoListen] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);
  const findUsedPhrases = useCallback((response: string, currentObjType: ObjectionType): string[] => {
    const training = trainingConfig.objectionHandling[currentObjType];
    if (!training) return [];
    
    return training.approvedPhrases.filter(phrase => 
      response.toLowerCase().includes(phrase.toLowerCase())
    );
  }, []);

  const findMissedOpportunities = useCallback((response: string, currentObjType: ObjectionType): string[] => {
    const training = trainingConfig.objectionHandling[currentObjType];
    if (!training) return [];
    
    return Object.keys(training.keyPhrases).filter(phrase => 
      !response.toLowerCase().includes(phrase.toLowerCase())
    );
  }, []);

  const startGame = async () => {
    setIsLoading(true);
    try {
      console.log('Starting game with score:', gameState.score);
      
      const response = await fetch("/api/rebuttal-royale", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Add any other necessary headers
        },
        body: JSON.stringify({
          currentScore: gameState.score
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start game');
      }

      const data = await response.json();
      console.log('Game start response:', data);

      if (!data.success) throw new Error(data.message);

      setGameState(prev => ({
        ...prev,
        isActive: true,
        currentObjection: data.content,
        objectionType: data.objectionType,
        level: data.level,
        emotion: data.emotion,
        emotionIntensity: data.intensity,
        tips: data.tips,
        badges: data.badges,
        objectionsCompleted: 0,
        levelStats: {
          totalResponses: 0,
          averageScore: 0,
          bestResponse: '',
          areasToImprove: [],
          usedPhrases: [],
          missedOpportunities: []
        }
      }));

      // Speak the objection if audio is enabled
      if (isSpeaking) {
        try {
          const voice = voiceConfig.getRandomVoice();
          await speakText(
            cleanTextForSpeech(data.content),
            process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
            voice.id,
            voice.settings
          );
        } catch (error) {
          console.error('Speech synthesis error:', error);
        }
      }
    } catch (error) {
      console.error("Game start error:", error);
      // Show error to user
      // You might want to add a toast or error message component
    } finally {
      setIsLoading(false);
    }
  };

  // Add a constant for required objections
  const OBJECTIONS_PER_LEVEL = 3;
  const PASSING_SCORE_PER_LEVEL = 200; // Adjust this value as needed

  // Update handleResponse function
  const handleResponse = async (response: string) => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }

      const result = await fetch("/api/rebuttal-royale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentScore: gameState.score || 0,
          response,
          objectionType: gameState.objectionType,
          objectionsCompleted: gameState.objectionsCompleted || 0
        })
      });

      const data = await result.json();
      if (!data.success) throw new Error(data.message);

      // Use a callback to ensure we have the latest state
      setGameState(prev => {
        const newObjectionsCompleted = prev.objectionsCompleted + 1;
        const newScore = prev.score + (data.points || 0);
        
        return {
          ...prev,
          score: newScore,
          objectionsCompleted: newObjectionsCompleted,
          feedback: data.feedback,
          history: [...prev.history, {
            objection: prev.currentObjection,
            response,
            points: data.points || 0
          }],
          levelStats: {
            ...prev.levelStats,
            totalResponses: prev.levelStats.totalResponses + 1,
            averageScore: (prev.levelStats.averageScore * prev.levelStats.totalResponses + (data.points || 0)) / (prev.levelStats.totalResponses + 1),
            usedPhrases: [...prev.levelStats.usedPhrases, ...findUsedPhrases(response, prev.objectionType as ObjectionType)],
            missedOpportunities: data.points > 0 ? prev.levelStats.missedOpportunities : [...prev.levelStats.missedOpportunities, ...findMissedOpportunities(response, prev.objectionType as ObjectionType)]
          }
        };
      });

      // Wait for state to update before checking completion
      await new Promise(resolve => setTimeout(resolve, 0));

      if (data.levelComplete) {
        if (data.passedLevel) {
          setShowSummary(true);
        } else {
          handleLevelFailed();
        }
      } else {
        await getNextObjection();
      }

    } catch (error) {
      console.error("Response error:", error);
    }
  };

  // Add level failed handler
  const handleLevelFailed = () => {
    setGameState(prev => ({
      ...prev,
      isActive: false,
      feedback: "You need more practice with these objections. Try again!",
      objectionsCompleted: 0,
      levelStats: {
        totalResponses: 0,
        averageScore: 0,
        bestResponse: '',
        areasToImprove: [],
        usedPhrases: [],
        missedOpportunities: []
      }
    }));
  };

  const startListeningForResponse = useCallback(() => {
    if (!autoListen) return;
    
    setTimeout(() => {
      if (!isListening) {
        startMicrophoneListening();
      }
    }, 1000);
  }, [autoListen, isListening]);

  const startMicrophoneListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = startListening(
      (text) => {
        handleResponse(text);
        setIsListening(false);
        recognitionRef.current = null;
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setGameState(prev => ({
          ...prev,
          feedback: typeof error === 'string' ? error : 'Speech recognition error. Please try again.'
        }));
        setIsListening(false);
        if (autoListen) {
          setTimeout(() => {
            startMicrophoneListening();
          }, 1000);
        }
      }
    );

    if (recognition) {
      recognitionRef.current = recognition;
      setIsListening(true);
    }
  }, [autoListen, handleResponse]);

  const stopMicrophoneListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopMicrophoneListening();
    } else {
      startMicrophoneListening();
    }
  }, [isListening, startMicrophoneListening, stopMicrophoneListening]);

  const handleAutoListenToggle = useCallback(() => {
    const newAutoListen = !autoListen;
    setAutoListen(newAutoListen);
    
    if (newAutoListen && !isListening) {
      startMicrophoneListening();
    } else if (!newAutoListen && isListening) {
      stopMicrophoneListening();
    }
  }, [autoListen, isListening, startMicrophoneListening, stopMicrophoneListening]);

  const getNextObjection = async () => {
    // Don't get next objection if we've completed the level
    if (gameState.objectionsCompleted >= OBJECTIONS_PER_LEVEL) {
      return;
    }

    try {
      const response = await fetch("/api/rebuttal-royale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentScore: gameState.score,
          getNext: true
        })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setGameState(prev => ({
        ...prev,
        currentObjection: data.content,
        objectionType: data.objectionType,
        level: data.level,
        emotion: data.emotion,
        emotionIntensity: data.intensity,
        tips: data.tips
      }));

      // Speak the new objection if audio is enabled
      if (isSpeaking) {
        try {
          const voice = voiceConfig.getRandomVoice();
          await speakText(
            cleanTextForSpeech(data.content),
            process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
            voice.id,
            voice.settings
          );
          startListeningForResponse();
        } catch (error) {
          console.error('Speech synthesis error:', error);
        }
      } else {
        startListeningForResponse();
      }
    } catch (error) {
      console.error("Failed to get next objection:", error);
    }
  };

  const handleLevelComplete = () => {
    setShowSummary(true);
    // Check for new badges
    const earnedBadges = [];
    if (!gameState.badges.pricemaster && gameState.level.id >= 2) {
      earnedBadges.push('Price Master');
    }
    setNewBadges(earnedBadges);
  };

  const handleContinue = async () => {
    setShowLevelComplete(false);
    await startGame(); // This will start the next level
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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
              <p className="text-lg font-bold text-blue-200">{gameState.level?.id || 1}</p>
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
            <div className="text-center">
              <p className="text-xs text-blue-300">PROGRESS</p>
              <p className="text-lg font-bold text-blue-200">
                {gameState.objectionsCompleted}/{OBJECTIONS_PER_LEVEL}
              </p>
            </div>
          </div>
          <ProgressBar
            currentScore={gameState.score}
            nextLevelScore={gameState.level.id * 100} // Adjust based on your level thresholds
            previousLevelScore={(gameState.level.id - 1) * 100}
          />
        </div>

        {/* Badges - Scrollable on Mobile */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {gameState.badges.pricemaster && (
            <div className="bg-yellow-500/20 px-2 py-1 rounded-full text-xs text-yellow-300 flex items-center gap-1">
              <Star className="w-3 h-3" /> Price Master
            </div>
          )}
          {gameState.badges.trustbuilder && (
            <div className="bg-blue-500/20 px-2 py-1 rounded-full text-xs text-blue-300 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Trust Builder
            </div>
          )}
          {gameState.badges.closingchamp && (
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
                onClick={handleAutoListenToggle}
                variant="outline"
                className={`border-blue-700 ${
                  autoListen ? "bg-green-500/20" : "hover:bg-blue-800"
                }`}
                title={autoListen ? "Auto-listen enabled" : "Auto-listen disabled"}
              >
                <Mic className={`w-4 h-4 ${isListening ? "animate-pulse text-green-500" : ""}`} />
                {autoListen ? "Auto" : "Manual"}
              </Button>
              {!autoListen && (
                <Button
                  onClick={toggleListening}
                  variant="outline"
                  className={`border-blue-700 ${
                    isListening ? "bg-green-500/20" : "hover:bg-blue-800"
                  }`}
                >
                  <Mic className={`w-4 h-4 ${isListening ? "animate-pulse text-green-500" : ""}`} />
                  {isListening ? "Listening..." : "Start"}
                </Button>
              )}
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

            {/* Tips */}
            {gameState.tips && (
              <div className="bg-blue-900/20 p-3 rounded border border-blue-800">
                <p className="text-blue-200 text-sm">{gameState.tips}</p>
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
      {showLevelComplete && (
        <LevelComplete
          level={gameState.level}
          score={gameState.score}
          newBadges={newBadges}
          onContinue={handleContinue}
        />
      )}
      {showSummary && (
        <LevelSummary
          stats={gameState.levelStats}
          onContinue={() => {
            setShowSummary(false);
            setShowLevelComplete(true);
          }}
        />
      )}
    </div>
  );
} 

