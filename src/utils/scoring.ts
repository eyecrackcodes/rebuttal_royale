export const defaultScoringCriteria: ScoringCriteria = {
  tonality: {
    weight: 30,
    keyPhrases: ["understand", "help you", "find the best"],
    forbiddenPhrases: ["have to", "must", "required"],
  },
  phrasing: {
    weight: 40,
    keyPhrases: ["explain", "options", "coverage"],
    forbiddenPhrases: ["policy", "rules", "requirement"],
  },
  empathy: {
    weight: 30,
    keyPhrases: ["appreciate", "understand", "help"],
    forbiddenPhrases: ["policy", "rules", "must"],
  },
};

export const defaultPenalties = {
  interruptions: -50,
  rushingResponse: -30,
  talkingOver: -40,
};
