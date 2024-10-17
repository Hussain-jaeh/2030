export interface GameState {
    board: number[][];
    score: number;
    bestScores: Record<number, number>;
    isPaused: boolean;
    difficulty: string;
    gameOver: boolean;
    hasWon: boolean;
    winningScore: number;
  }
  
  export type BoardSize = 4 | 5 | 6;
  export type SwipeDirection = "RIGHT" | "LEFT" | "DOWN" | "UP";