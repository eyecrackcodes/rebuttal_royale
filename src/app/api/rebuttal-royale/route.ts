import { NextRequest, NextResponse } from 'next/server';
import { config, hasValidAnthropicKey } from '@/lib/config';
import { GameStateManager } from '@/lib/game-state';
import { OBJECTIONS, ObjectionType } from '@/config/objections';
import { trainingConfig } from '@/config/training-config';

interface RequestBody {
  currentScore?: number;
  response?: string;
  objectionType?: ObjectionType;
  objectionsCompleted?: number;
}

const OBJECTIONS_PER_LEVEL = 3;
const PASSING_SCORE_PER_LEVEL = 200;

export async function POST(request: NextRequest) {
  try {
    // Add debug logging
    console.log('API Request received:', {
      hasAnthropicKey: hasValidAnthropicKey(),
      config: {
        anthropicKey: config.anthropic.apiKey?.substring(0, 10),
        hasKey: !!config.anthropic.apiKey
      }
    });

    if (!hasValidAnthropicKey()) {
      console.error('Invalid Anthropic key configuration');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json() as RequestBody;
    console.log('Request body:', body);

    const gameState = new GameStateManager(body.currentScore || 0);
    const state = gameState.getState();

    // Handle response to objection
    if (body.response && body.objectionType) {
      const currentObjType = body.objectionType;
      const training = trainingConfig.objectionHandling[currentObjType];
      const response = body.response as string;  // Add type assertion
      
      let points = 0;
      let feedback = '';

      // Calculate points based on approved and key phrases
      const usedApprovedPhrases = training.approvedPhrases.filter(phrase => 
        response.toLowerCase().includes(phrase.toLowerCase())
      );

      const usedKeyPhrases = Object.entries(training.keyPhrases).filter(([phrase, _]) => 
        response.toLowerCase().includes(phrase.toLowerCase())
      );

      // Award points
      if (usedApprovedPhrases.length > 0) {
        points += 50 * usedApprovedPhrases.length;
      }

      usedKeyPhrases.forEach(([_, value]) => {
        points += value;
      });

      // Check forbidden phrases
      if (training.forbiddenPhrases.some(phrase => 
        response.toLowerCase().includes(phrase.toLowerCase())
      )) {
        points = Math.max(0, points - 50);
        feedback = "Be careful with your phrasing. Try a more positive approach.";
      } else if (points > 0) {
        feedback = `Great job! You earned ${points} points. ${usedApprovedPhrases.length > 1 ? 'Excellent use of multiple key phrases!' : ''}`;
      } else {
        // Get first 2 key phrases from the object's keys
        const suggestedPhrases = Object.keys(training.keyPhrases).slice(0, 2);
        feedback = "Try incorporating some of the suggested phrases: " + 
          suggestedPhrases.join(", ");
      }

      // Check if level is complete
      const objectionsCompleted = (body.objectionsCompleted || 0) + 1;
      const levelComplete = objectionsCompleted >= OBJECTIONS_PER_LEVEL;
      const totalScore = (state.score || 0) + points;
      const passedLevel = totalScore >= PASSING_SCORE_PER_LEVEL;

      return NextResponse.json({
        success: true,
        points,
        feedback,
        levelComplete,
        passedLevel,
        totalScore
      });
    }

    // Handle request for next objection
    const objectionTypes = state.currentLevel.objectionTypes as ObjectionType[];
    const usedObjections = state.objectionHistory || [];
    
    // Get unused objections first
    const unusedTypes = objectionTypes.filter(type => !usedObjections.includes(type));
    const objectionType = unusedTypes.length > 0 
      ? unusedTypes[Math.floor(Math.random() * unusedTypes.length)]
      : objectionTypes[Math.floor(Math.random() * objectionTypes.length)];

    const scenarios = OBJECTIONS[objectionType].scenarios;
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    const handleScenario = (scenario: any) => {
      const response = Array.isArray(scenario.prospectResponse) 
        ? scenario.prospectResponse[Math.floor(Math.random() * scenario.prospectResponse.length)]
        : scenario.prospectResponse;

      return {
        success: true,
        content: response,
        nextPrompt: scenario.nextPrompt,
        objectionType,
        emotion: determineEmotion(state.currentLevel.id),
        intensity: state.emotionalIntensity,
        score: state.score,
        level: state.currentLevel,
        badges: state.badges,
        tips: OBJECTIONS[objectionType].tips
      };
    };

    return NextResponse.json(handleScenario(scenario));

  } catch (error) {
    // Improved error logging
    console.error('API Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    });

    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

function determineEmotion(level: number): string {
  switch (level) {
    case 1: return 'concerned';
    case 2: return 'skeptical';
    case 3: return 'frustrated';
    default: return 'concerned';
  }
} 