import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getWinningScore = (difficulty: string): number => {
  switch (difficulty) {
    case 'EASY':
      return 4096;
    case 'EXPERT':
      return 8192; 
    default:
      return 2048;
  }
};

const createBoardByDifficulty = (difficulty: string): number[][] => {
  const size = difficulty === 'EASY' ? 4 : difficulty === 'EXPERT' ? 6 : 5; 
  const emptyBoard = Array(size).fill(null).map(() => Array(size).fill(0));
  addRandomTile(emptyBoard);
  addRandomTile(emptyBoard);   
  return emptyBoard;
};

const isBoardFull = (board: number[][]): boolean => {
  return board.every(row => row.every(cell => cell !== 0));
};

const canMove = (board: number[][]): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) return true; 
      if (col < board[row].length - 1 && board[row][col] === board[row][col + 1]) return true; 
      if (row < board.length - 1 && board[row][col] === board[row + 1][col]) return true; 
    }
  }
  return false;
};

const addRandomTile = (board: number[][]): void => {
  const emptyTiles = board.flatMap((row, rowIndex) =>
    row.map((value, colIndex) => (value === 0 ? { row: rowIndex, col: colIndex } : null))
  ).filter(Boolean) as { row: number; col: number }[];

  if (emptyTiles.length > 0) {
    const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[row][col] = Math.random() < 0.9 ? 2 : 4; 
  }
};

const moveTiles = (board: number[][], direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'): { newBoard: number[][], score: number, gameOver: boolean } => {
  let newBoard = board.map(row => [...row]);
  let score = 0;

  const transpose = (matrix: number[][]): number[][] => matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  const rotateLeft = (matrix: number[][]): number[][] => transpose(matrix).map(row => row.reverse());
  const rotateRight = (matrix: number[][]): number[][] => transpose(matrix.reverse());
  const flipMatrix = (matrix: number[][]): number[][] => matrix.map(row => [...row].reverse());

  const slide = (row: number[]): [number[], number] => {
    let arr = row.filter(val => val);
    let newRow: number[] = [];
    let merged = false;
    let localScore = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === arr[i + 1] && !merged) {
        newRow.push(arr[i] * 2);
        localScore += arr[i] * 2;
        i++;
        merged = true;
      } else {
        newRow.push(arr[i]);
        merged = false;
      }
    }
    while (newRow.length < row.length) {
      newRow.push(0);
    }
    return [newRow, localScore];
  };

  switch (direction) {
    case 'UP':
      newBoard = transpose(newBoard);
      for (let i = 0; i < newBoard.length; i++) {
        const [newRow, rowScore] = slide(newBoard[i]);
        newBoard[i] = newRow;
        score += rowScore;
      }
      newBoard = transpose(newBoard);
      break;

    case 'DOWN':
      newBoard = transpose(newBoard);
      newBoard = newBoard.map(row => [...row].reverse());
      for (let i = 0; i < newBoard.length; i++) {
        const [newRow, rowScore] = slide(newBoard[i]);
        newBoard[i] = newRow;
        score += rowScore;
      }
      newBoard = newBoard.map(row => [...row].reverse());
      newBoard = transpose(newBoard);
      break;

    case 'LEFT':
      for (let i = 0; i < newBoard.length; i++) {
        const [newRow, rowScore] = slide(newBoard[i]);
        newBoard[i] = newRow;
        score += rowScore;
      }
      break;

    case 'RIGHT':
      newBoard = flipMatrix(newBoard);
      for (let i = 0; i < newBoard.length; i++) {
        const [newRow, rowScore] = slide(newBoard[i]);
        newBoard[i] = newRow;
        score += rowScore;
      }
      newBoard = flipMatrix(newBoard);
      break;
  }

  addRandomTile(newBoard); 
  const gameOver = isBoardFull(newBoard) && !canMove(newBoard); 

  return { newBoard, score, gameOver };
};

const initialState = {
  board: createBoardByDifficulty('EASY'),
  score: 0,
  bestScores: {
    4: 0,
    5: 0,
    6: 0,
  } as Record<number, number>, 
  isPaused: true,
  difficulty: 'EASY',
  gameOver: false,
  winningScore: getWinningScore('EASY'),
};


const saveBestScore = async (boardSize: number, score: number) => {
  try {
    await AsyncStorage.setItem(`bestScore_${boardSize}`, score.toString());
  } catch (error) {
    console.error("Failed to save best score", error);
  }
};

const gameSlice = createSlice({
  name: 'game', 
  initialState,
  reducers: {
    move: (state, action: PayloadAction<{ direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' }>) => {
      if (state.gameOver) return;

      const { newBoard, score, gameOver } = moveTiles(state.board, action.payload.direction);

      state.board = newBoard;
      state.score += score;

      const boardSize = state.board.length;
      if (state.score > state.bestScores[boardSize]) {
        state.bestScores[boardSize] = state.score;
        saveBestScore(boardSize, state.score); 
      }
      
      state.gameOver = gameOver;
    },
    
    newGame: (state) => {
      state.board = createBoardByDifficulty(state.difficulty);
      state.score = 0;
      state.gameOver = false;
      state.winningScore = getWinningScore(state.difficulty);
    },
    
    resumeGame: (state) => {
      state.isPaused = false;
    },
    
    resetGameState: (state) => {
      state.board = createBoardByDifficulty(state.difficulty);
      state.score = 0;
      state.gameOver = false;
      state.winningScore = getWinningScore(state.difficulty);
    },
    
    setDifficulty: (state, action: PayloadAction<string>) => {
      state.difficulty = action.payload;
      state.board = createBoardByDifficulty(action.payload);
      state.score = 0;
      state.gameOver = false;
      state.winningScore = getWinningScore(action.payload); 
    },
  },
});

export const { move, newGame, resetGameState, resumeGame, setDifficulty } = gameSlice.actions;
export default gameSlice.reducer;