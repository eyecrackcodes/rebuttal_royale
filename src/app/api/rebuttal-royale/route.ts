import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { trainingConfig } from "@/config/training-config";

interface Objection {
  level: number;
  scenarios: string[];
  points: number;
  tips: string;
}

type ObjectionType = {
  [key: string]: Objection;
}

const OBJECTIONS: ObjectionType = {
  PRICE: {
    level: 1,
    scenarios: [
      "That's way too expensive for me, I'm on a fixed income",
      "I can't afford another bill right now",
      "The other company offered me something cheaper",
    ],
    points: 100,
    tips: "Focus on value over price, monthly payment flexibility, and protecting family"
  },
  SPOUSE: {
    level: 2,
    scenarios: [
      "I need to talk to my spouse before making any decisions",
      "My children handle all my financial decisions",
      "Let me discuss this with my family first",
    ],
    points: 150,
    tips: "Emphasize urgency, offer to include family in conversation, discuss rate increases"
  },
  TRUST: {
    level: 3,
    scenarios: [
      "How do I know this isn't a scam?",
      "I've heard bad things about insurance companies",
      "I don't know if I can trust this...",
    ],
    points: 200,
    tips: "Build credibility, mention state regulations, share company history"
  },
  EXISTING_COVERAGE: {
    level: 4,
    scenarios: [
      "I already have life insurance through my old job",
      "I have a small policy with AARP",
      "Social Security will cover my funeral",
    ],
    points: 250,
    tips: "Explain coverage gaps, discuss benefit amounts, highlight guaranteed acceptance"
  },
  PROCRASTINATION: {
    level: 5,
    scenarios: [
      "I want to think about it",
      "Call me back next month",
      "I'm not ready to make a decision today",
    ],
    points: 300,
    tips: "Create urgency, discuss rate increases, share stories of procrastination consequences"
  },
};

// Add emotion types
type Emotion = 'frustrated' | 'concerned' | 'skeptical' | 'interested' | 'resistant';

interface AIResponse {
  content: string;
  emotion: Emotion;
  intensity: number; // 0-1 scale
}

export async function POST(req: Request) {
  try {
    const { level, currentScore, lastResponse } = await req.json();

    const availableObjections = Object.entries(OBJECTIONS)
      .filter(([, obj]) => obj.level <= level);
    
    const [objectionType, objectionData] = availableObjections[
      Math.floor(Math.random() * availableObjections.length)
    ];

    const scenario = objectionData.scenarios[
      Math.floor(Math.random() * objectionData.scenarios.length)
    ];

    // Analyze agent's rebuttal effectiveness
    const analyzeRebuttal = (response: string, objectionType: keyof typeof OBJECTIONS) => {
      const guidelines = trainingConfig.objectionHandling[objectionType];
      let effectiveness = 0;

      // Check for approved phrases
      guidelines.approvedPhrases.forEach(phrase => {
        if (response.toLowerCase().includes(phrase.toLowerCase())) {
          effectiveness += 25;
        }
      });

      // Check for forbidden phrases
      guidelines.forbiddenPhrases.forEach(phrase => {
        if (response.toLowerCase().includes(phrase.toLowerCase())) {
          effectiveness -= 30;
        }
      });

      // Check for required points
      guidelines.requiredPoints.forEach(point => {
        if (response.toLowerCase().includes(point.toLowerCase())) {
          effectiveness += 20;
        }
      });

      return Math.min(Math.max(effectiveness, 0), 100);
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.anthropic.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        messages: [{ role: "user", content: lastResponse || "Start simulation" }],
        system: `You are an elderly prospect (aged 50-85) concerned about final expense insurance.
                Current objection: ${scenario}
                Objection type: ${objectionType}
                Level: ${level}

                Speaking style:
                - You are ALWAYS the prospect, never the agent
                - Speak naturally as a senior citizen
                - Use simple, clear sentences
                - Express genuine emotions based on the agent's approach
                - Never acknowledge this is a simulation
                - Never say you're "playing a part"
                
                Response format:
                {
                  "content": "Your response as the prospect",
                  "emotion": "frustrated|concerned|skeptical|interested|resistant",
                  "intensity": 0.1-1.0
                }
                
                Example response:
                {
                  "content": "I just don't know if I can afford another bill right now. My social security check only goes so far...",
                  "emotion": "concerned",
                  "intensity": 0.7
                }
                
                Format your response as valid JSON.`,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    let parsedResponse: AIResponse;
    
    try {
      parsedResponse = JSON.parse(aiResponse.content[0].text);
    } catch (error) {
      // Fallback if response isn't valid JSON
      parsedResponse = {
        content: aiResponse.content[0].text,
        emotion: 'skeptical',
        intensity: 0.5
      };
    }

    // Calculate score and feedback
    let newScore = currentScore || 0;
    let feedback = "";
    
    if (lastResponse) {
      const effectiveness = analyzeRebuttal(lastResponse, objectionType as keyof typeof OBJECTIONS);
      const pointsEarned = Math.floor((effectiveness / 100) * objectionData.points);
      newScore += pointsEarned;
      
      feedback = effectiveness > 70 
        ? `Excellent rebuttal! You effectively addressed the ${objectionType.toLowerCase()} objection. Tip: ${objectionData.tips}` 
        : effectiveness > 40 
          ? `Good attempt. Remember to: ${objectionData.tips}`
          : `Try a different approach. Key tip: ${objectionData.tips}`;
    }

    return NextResponse.json({
      content: parsedResponse.content,
      emotion: parsedResponse.emotion,
      intensity: parsedResponse.intensity,
      score: newScore,
      level,
      objectionType,
      feedback,
      nextMilestone: (Math.floor(newScore / 1000) + 1) * 1000,
      badges: {
        pricemaster: newScore > 1000,
        trustbuilder: newScore > 2000,
        closingchamp: newScore > 3000,
      }
    });

  } catch (error: unknown) {
    console.error("Rebuttal Royale error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process rebuttal" },
      { status: 500 }
    );
  }
} 