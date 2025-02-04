import { ObjectionType } from './objections';

export interface Level {
  id: number;
  name: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  objectionTypes: string[];
  minScore: number;
  emotionRange: {
    min: number;
    max: number;
  };
}

export const levels: Level[] = [
  {
    id: 1,
    name: 'Rookie Responder',
    description: 'Handle basic objections',
    difficulty: 'BEGINNER',
    objectionTypes: ['NOT_INTERESTED', 'SEND_INFO', 'CALL_BACK', 'AGE_CONCERN'] as ObjectionType[],
    minScore: 0,
    emotionRange: { min: 0.3, max: 0.6 }
  },
  {
    id: 2,
    name: 'Intermediate Handler',
    description: 'Address common concerns',
    difficulty: 'INTERMEDIATE',
    objectionTypes: ['SPOUSE_CONSULT', 'EXISTING_COVERAGE', 'AFFORDABILITY'] as ObjectionType[],
    minScore: 250,
    emotionRange: { min: 0.4, max: 0.7 }
  },
  {
    id: 3,
    name: 'Expert Negotiator',
    description: 'Handle complex objections',
    difficulty: 'ADVANCED',
    objectionTypes: ['WORKING_WITH_AGENT', 'WONT_PAY', 'CHILDREN_CARE'] as ObjectionType[],
    minScore: 500,
    emotionRange: { min: 0.5, max: 0.8 }
  }
];

export const getLevel = (score: number): Level => {
  return levels.reduce((prev, curr) => {
    return score >= curr.minScore ? curr : prev;
  });
};

export const isLevelUnlocked = (level: Level, score: number): boolean => {
  return score >= level.minScore;
}; 