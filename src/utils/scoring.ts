import { ScoringCriteria } from "@/types/training";

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

export const calculateResponseScore = (
  response: string,
  criteria: ScoringCriteria,
  penalties: typeof defaultPenalties
): {
  score: number;
  feedback: string[];
  detailedScores: {
    tonality: number;
    phrasing: number;
    empathy: number;
  };
} => {
  const feedback: string[] = [];
  const normalizedResponse = response.toLowerCase();

  // Initialize component scores
  const scores = {
    tonality: 0,
    phrasing: 0,
    empathy: 0,
  };

  // Calculate tonality score
  const tonalityMatches = criteria.tonality.keyPhrases.filter((phrase) =>
    normalizedResponse.includes(phrase.toLowerCase())
  ).length;
  const tonalityViolations = criteria.tonality.forbiddenPhrases.filter(
    (phrase) => normalizedResponse.includes(phrase.toLowerCase())
  ).length;

  scores.tonality = Math.max(
    0,
    (tonalityMatches / criteria.tonality.keyPhrases.length) * 100 -
      tonalityViolations * 25
  );

  // Calculate phrasing score
  const phrasingMatches = criteria.phrasing.keyPhrases.filter((phrase) =>
    normalizedResponse.includes(phrase.toLowerCase())
  ).length;
  const phrasingViolations = criteria.phrasing.forbiddenPhrases.filter(
    (phrase) => normalizedResponse.includes(phrase.toLowerCase())
  ).length;

  scores.phrasing = Math.max(
    0,
    (phrasingMatches / criteria.phrasing.keyPhrases.length) * 100 -
      phrasingViolations * 25
  );

  // Calculate empathy score
  const empathyMatches = criteria.empathy.keyPhrases.filter((phrase) =>
    normalizedResponse.includes(phrase.toLowerCase())
  ).length;
  const empathyViolations = criteria.empathy.forbiddenPhrases.filter((phrase) =>
    normalizedResponse.includes(phrase.toLowerCase())
  ).length;

  scores.empathy = Math.max(
    0,
    (empathyMatches / criteria.empathy.keyPhrases.length) * 100 -
      empathyViolations * 25
  );

  // Generate feedback
  if (tonalityViolations > 0) {
    feedback.push("Watch your tone - avoid confrontational language");
  }
  if (phrasingViolations > 0) {
    feedback.push("Consider using more customer-friendly phrasing");
  }
  if (empathyViolations > 0) {
    feedback.push("Try to show more empathy in your response");
  }

  // Calculate weighted final score
  const finalScore =
    (scores.tonality * criteria.tonality.weight +
      scores.phrasing * criteria.phrasing.weight +
      scores.empathy * criteria.empathy.weight) /
    100;

  return {
    score: Math.round(finalScore),
    feedback,
    detailedScores: scores,
  };
};

export const saveProgress = async (
  userId: string,
  moduleId: string,
  score: number,
  feedback: string[]
): Promise<void> => {
  try {
    // First, get existing progress
    const existingProgress = localStorage.getItem(`progress_${userId}`);
    const progress = existingProgress ? JSON.parse(existingProgress) : [];

    // Update or add new progress
    const moduleIndex = progress.findIndex(
      (p: ModuleProgress) => p.id === moduleId
    );

    if (moduleIndex >= 0) {
      progress[moduleIndex] = {
        ...progress[moduleIndex],
        score: Math.max(progress[moduleIndex].score, score),
        attempts: progress[moduleIndex].attempts + 1,
        lastAttempted: new Date(),
      };
    } else {
      // Add new progress entry
      progress.push({
        id: moduleId,
        score,
        attempts: 1,
        lastAttempted: new Date(),
        completed: false,
      });
    }

    // Save updated progress
    localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving progress:", error);
    throw error;
  }
};
