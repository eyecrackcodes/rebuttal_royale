import { Level, levels } from '@/config/levels';
import { OBJECTIONS, ObjectionType } from '@/config/objections';
import { trainingConfig } from '@/config/training-config';

interface GameState {
  currentLevel: Level;
  score: number;
  consecutiveWins: number;
  objectionHistory: ObjectionType[];
  emotionalIntensity: number;
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

export class GameStateManager {
  private readonly OBJECTIONS_PER_LEVEL = 3;
  private state: GameState;

  constructor(initialScore: number = 0) {
    this.state = {
      currentLevel: levels.find(level => level.minScore <= initialScore) || levels[0],
      score: initialScore,
      consecutiveWins: 0,
      objectionHistory: [],
      emotionalIntensity: 0.3,
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
      }
    };
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public updateScore(points: number): void {
    this.state.score += points;
    this.checkLevelProgression();
    this.checkBadges();
  }

  public handleResponse(response: string): {
    points: number;
    feedback: string;
    levelUp?: boolean;
    levelComplete?: boolean;
  } {
    // Get the current objection type
    const currentObjType = this.state.objectionHistory[this.state.objectionHistory.length - 1] || 'VALUE';
    const objection = OBJECTIONS[currentObjType];
    
    // Get the training config for this objection type
    const training = trainingConfig.objectionHandling[currentObjType];
    
    if (!training) {
      console.error('No training config found for objection type:', currentObjType);
      return {
        points: 0,
        feedback: "System error: Invalid objection type",
        levelComplete: false
      };
    }

    let points = 0;
    let feedback = '';

    // Calculate points based on approved phrases
    const approvedPhrases = training.approvedPhrases;
    const forbiddenPhrases = training.forbiddenPhrases;

    // Check for forbidden phrases first
    if (forbiddenPhrases.some(phrase => response.toLowerCase().includes(phrase.toLowerCase()))) {
      points = -50;
      feedback = "Be careful with your phrasing. Try a more positive approach.";
      this.resetConsecutiveWins();
    } else if (approvedPhrases.some(phrase => response.toLowerCase().includes(phrase.toLowerCase()))) {
      points = objection.points;
      feedback = "Excellent response! You addressed the objection effectively.";
      this.incrementConsecutiveWins();
    } else {
      points = Math.floor(objection.points * 0.3);
      feedback = "Good attempt, but try incorporating some key phrases for better results.";
      this.resetConsecutiveWins();
    }

    // Update state
    this.state.score += points;
    const oldLevel = this.state.currentLevel;
    this.checkLevelProgression();

    // Add to objection history
    this.state.objectionHistory.push(currentObjType);
    
    // Track stats
    this.state.objectionsCompleted++;
    this.updateLevelStats(response, points);

    // Check if level is complete
    const levelComplete = this.state.objectionsCompleted >= this.OBJECTIONS_PER_LEVEL;

    return {
      points,
      feedback,
      levelUp: oldLevel.id !== this.state.currentLevel.id,
      levelComplete
    };
  }

  private checkLevelProgression(): void {
    const newLevel = levels.find(level => 
      this.state.score >= level.minScore && 
      level.id > this.state.currentLevel.id &&
      this.meetsLevelRequirements(level)
    );
    
    if (newLevel) {
      this.state.currentLevel = newLevel;
      this.state.emotionalIntensity = newLevel.emotionRange.min;
    }
  }

  private meetsLevelRequirements(level: Level): boolean {
    switch (level.id) {
      case 2: // Trust Builder
        return this.state.objectionHistory.filter(obj => obj === 'PRICE').length >= 3;
      case 3: // Timing Tactician
        return this.state.badges.trustbuilder;
      case 4: // Competition Conqueror
        return this.state.consecutiveWins >= 3;
      case 5: // Master Negotiator
        return this.state.badges.pricemaster && 
               this.state.badges.trustbuilder && 
               this.state.consecutiveWins >= 5;
      default:
        return true;
    }
  }

  private checkBadges(): void {
    // Price master badge
    if (!this.state.badges.pricemaster && 
        this.state.objectionHistory.filter(obj => obj === 'PRICE').length >= 3) {
      this.state.badges.pricemaster = true;
    }

    // Trust builder badge
    if (!this.state.badges.trustbuilder && 
        this.state.objectionHistory.filter(obj => obj === 'TRUST').length >= 3) {
      this.state.badges.trustbuilder = true;
    }

    // Closing champ badge
    if (!this.state.badges.closingchamp && this.state.consecutiveWins >= 5) {
      this.state.badges.closingchamp = true;
    }
  }

  public increaseEmotionalIntensity(): void {
    const maxIntensity = this.state.currentLevel.emotionRange.max;
    this.state.emotionalIntensity = Math.min(
      maxIntensity,
      this.state.emotionalIntensity + 0.15
    );
  }

  public resetConsecutiveWins(): void {
    this.state.consecutiveWins = 0;
  }

  public incrementConsecutiveWins(): void {
    this.state.consecutiveWins++;
  }

  private evaluateResponse(response: string, objectionType: ObjectionType): {
    points: number;
    feedback: string;
    qualityScore: number;
  } {
    const training = trainingConfig.objectionHandling[objectionType];
    const scoring = trainingConfig.scoring;
    let points = 0;
    let feedback = [];
    let qualityScore = 0;

    // Check for key phrases
    Object.entries(training.keyPhrases).forEach(([phrase, value]) => {
      if (response.toLowerCase().includes(phrase.toLowerCase())) {
        points += value;
        qualityScore += 0.2;
        feedback.push(`Great use of "${phrase}"`);
      }
    });

    // Check for forbidden phrases
    const usedForbiddenPhrase = training.forbiddenPhrases.some(phrase => 
      response.toLowerCase().includes(phrase.toLowerCase())
    );

    if (usedForbiddenPhrase) {
      points += scoring.penalties.forbidden;
      qualityScore -= 0.3;
      feedback.push("Be careful with negative phrasing");
    }

    // Length validation
    if (response.length < trainingConfig.validation.minimumLength) {
      points += scoring.penalties.tooShort;
      feedback.push("Try to provide a more complete response");
    }

    // Apply bonuses
    const uniqueApprovedPhrases = new Set(
      training.approvedPhrases.filter(phrase => 
        response.toLowerCase().includes(phrase.toLowerCase())
      )
    );

    if (uniqueApprovedPhrases.size > 1) {
      points *= scoring.bonuses.multiPhrase;
      feedback.push("Excellent use of multiple key phrases!");
    }

    return {
      points,
      feedback: feedback.join(". "),
      qualityScore: Math.min(1, Math.max(0, qualityScore))
    };
  }

  private updateLevelStats(response: string, points: number) {
    const stats = this.state.levelStats;
    stats.totalResponses++;
    stats.averageScore = (stats.averageScore * (stats.totalResponses - 1) + points) / stats.totalResponses;
    
    if (points > 0) {
      stats.usedPhrases.push(...this.findUsedPhrases(response));
    }
    
    const missedPhrases = this.findMissedOpportunities(response);
    if (missedPhrases.length > 0) {
      stats.missedOpportunities.push(...missedPhrases);
    }

    if (points > stats.bestScore) {
      stats.bestResponse = response;
    }
  }
} 