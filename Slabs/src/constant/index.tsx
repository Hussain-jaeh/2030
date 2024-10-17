export const DIFFICULTIES = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  EXPERT: 'EXPERT'
} as const;

export const BOARD_SIZES = {
  [DIFFICULTIES.EASY]: 4,
  [DIFFICULTIES.MEDIUM]: 5,
  [DIFFICULTIES.EXPERT]: 6
} as const;

export const STORAGE_KEY = '@Game2048:bestScores'