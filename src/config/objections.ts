export type ObjectionType = 
  // Very Difficult
  'WORKING_WITH_AGENT' | 
  'WONT_PAY' | 
  'CHILDREN_CARE' |
  // Moderate
  'SPOUSE_CONSULT' |
  'EXISTING_COVERAGE' |
  'AFFORDABILITY' |
  // Easier
  'NOT_INTERESTED' |
  'SEND_INFO' |
  'CALL_BACK' |
  'AGE_CONCERN';

interface Objection {
  level: 'EASY' | 'MODERATE' | 'DIFFICULT';
  scenarios: string[];
  points: number;
  tips: string;
}

export const OBJECTIONS: Record<ObjectionType, Objection> = {
  WORKING_WITH_AGENT: {
    level: 'DIFFICULT',
    scenarios: [
      "I'm already working with another agent",
      "Someone else is handling my insurance",
      "I have an agent I trust"
    ],
    points: 300,
    tips: "Build value, focus on unique benefits, acknowledge loyalty concerns"
  },
  WONT_PAY: {
    level: 'DIFFICULT',
    scenarios: [
      "Insurance companies never pay claims",
      "I've heard these companies are all scams",
      "They'll find any reason not to pay"
    ],
    points: 300,
    tips: "Share company history, claims statistics, state regulations"
  },
  SPOUSE_CONSULT: {
    level: 'MODERATE',
    scenarios: [
      "I need to talk to my spouse before making any decisions",
      "My children handle all my financial decisions",
      "Let me discuss this with my family first",
    ],
    points: 150,
    tips: "Emphasize urgency, offer to include family in conversation, discuss rate increases"
  },
  EXISTING_COVERAGE: {
    level: 'MODERATE',
    scenarios: [
      "I already have life insurance through my old job",
      "I have a small policy with AARP",
      "Social Security will cover my funeral",
    ],
    points: 250,
    tips: "Explain coverage gaps, discuss benefit amounts, highlight guaranteed acceptance"
  },
  AFFORDABILITY: {
    level: 'MODERATE',
    scenarios: [
      "That's way too expensive for me, I'm on a fixed income",
      "I can't afford another bill right now",
      "The other company offered me something cheaper",
    ],
    points: 100,
    tips: "Focus on value over price, monthly payment flexibility, and protecting family"
  },
  NOT_INTERESTED: {
    level: 'EASY',
    scenarios: [
      "I don't see the value in this",
      "What makes this worth the money?",
      "I'm not sure this is worth the investment",
    ],
    points: 100,
    tips: "Highlight benefits, demonstrate ROI, share success stories"
  },
  SEND_INFO: {
    level: 'EASY',
    scenarios: [
      "I want to think about it",
      "Call me back next month",
      "I'm not ready to make a decision today",
    ],
    points: 300,
    tips: "Create urgency, discuss rate increases, share stories of procrastination consequences"
  },
  CALL_BACK: {
    level: 'EASY',
    scenarios: [
      "I want to think about it",
      "Call me back next month",
      "I'm not ready to make a decision today",
    ],
    points: 300,
    tips: "Create urgency, discuss rate increases, share stories of procrastination consequences"
  },
  AGE_CONCERN: {
    level: 'EASY',
    scenarios: [
      "I'm not sure this is right for me",
      "I'm too old for this",
      "I'm not ready to think about this now",
    ],
    points: 100,
    tips: "Emphasize the benefits of early planning, discuss age-appropriate options"
  },
  CHILDREN_CARE: {
    level: 'DIFFICULT',
    scenarios: [
      "I'm concerned about leaving my children without financial support",
      "I'm not sure my children are ready for this",
      "I'm not sure this is the best use of my money",
    ],
    points: 200,
    tips: "Emphasize the importance of financial security, discuss age-appropriate planning"
  }
};

// Helper function to get objections by difficulty
export const getObjectionsByDifficulty = (level: 'EASY' | 'MODERATE' | 'DIFFICULT'): ObjectionType[] => {
  return Object.entries(OBJECTIONS)
    .filter(([_, obj]) => obj.level === level)
    .map(([type, _]) => type as ObjectionType);
};

// This file should contain our objection types and scenarios 