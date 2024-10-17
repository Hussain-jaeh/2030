import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { GameStackParamList } from '@/navigation/GameStack';
import { StackNavigationProp } from '@react-navigation/stack';
import { move } from '../Features/gameSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';


import Animated, { 
  Easing, 
  useSharedValue, 
  withTiming, 
  interpolate,
  useAnimatedStyle 
} from 'react-native-reanimated';

type GameScreenNavigationProp = StackNavigationProp<GameStackParamList, 'Game'>;

interface GameState {
  board: number[][]; 
  score: number; 
  bestScores: Record<number, number>; 
  gameOver: boolean; 
}

type BoardSize = 4 | 5 | 6; 
type SwipeDirection = "RIGHT" | "LEFT" | "DOWN" | "UP";


const Game: React.FC = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const dispatch = useDispatch();
  const game = useSelector((state: { game: GameState }) => state.game);
  const [currentDirection, setCurrentDirection] = useState<SwipeDirection | null>(null);
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });
  const [bestScore, setBestScore] = useState<number>(0);
  const boardSize: BoardSize = game.board.length as BoardSize;

  // Load best score from AsyncStorage
  useEffect(() => {
    const loadBestScore = async () => {
      try {
        const storedBestScore = await AsyncStorage.getItem(`bestScore_${boardSize}`);
        if (storedBestScore) {
          setBestScore(Number(storedBestScore));
        }
      } catch (error) {
        console.error("Failed to load best score", error);
      }
    };

    loadBestScore();
  }, [boardSize]);

  // Handle screen dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (game.score > bestScore) {
      setBestScore(game.score);
      AsyncStorage.setItem(`bestScore_${boardSize}`, String(game.score));
    }
  }, [game.score, bestScore]);


  const screenWidth = dimensions.width;
  const screenHeight = dimensions.height;
  const isLandscape = screenWidth > screenHeight;

  const margin = screenWidth * 0.05;
  const cellMargin = screenWidth * 0.015;
  const totalMargin = margin + (cellMargin * (boardSize - 1));

  const maxBoardSize = isLandscape ? screenHeight * 0.8 : screenWidth * 0.9;
  const cellSize = Math.min(
    (maxBoardSize - totalMargin) / boardSize,
    (screenWidth - totalMargin) / boardSize
  );

  const fontSize = cellSize * 0.4;

  const animatedBoard = game.board.map((row: number[]) =>
    row.map(() => useSharedValue(0))
  );

  const getCellStyles = (cell: number) => {
    let styles = { backgroundColor: '#CDC1B5', color: '#776E65' };
    if (cell) {
      switch (cell) {
        case 2: styles = { backgroundColor: '#EEE4DA', color: '#776E65' }; break;
        case 4: styles = { backgroundColor: '#EDE0C8', color: '#776E65' }; break;
        case 8: styles = { backgroundColor: '#F2B179', color: '#F9F6F2' }; break;
        case 16: styles = { backgroundColor: '#F59563', color: '#F9F6F2' }; break;
        case 32: styles = { backgroundColor: '#F67C5F', color: '#F9F6F2' }; break;
        default: styles = { backgroundColor: '#EDCF72', color: '#F9F6F2' }; break;
      }
    }
    return styles;
  };

  const getSwipeDirection = (dx: number, dy: number): SwipeDirection | undefined => {
    const minSwipeDistance = 10;
    if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) {
      return undefined;
    }
    return Math.abs(dx) > Math.abs(dy) 
      ? (dx > 0 ? 'RIGHT' : 'LEFT') 
      : (dy > 0 ? 'DOWN' : 'UP');
  };

  const moveTiles = (direction: SwipeDirection) => {
    const previousScore = game.score; // Store previous score
    dispatch(move({ direction }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  
    // Check if the score has changed after the move
    const newScore = game.score; // Get the new score after dispatch

    if (newScore > bestScore) {
        setBestScore(newScore); // Update the best score in the component state
        AsyncStorage.setItem(`bestScore_${boardSize}`, String(newScore))
            .catch(error => console.error("Failed to save best score", error));
    }

    // Animate the tiles after the move
    game.board.forEach((row: number[], rowIndex: number) => {
        row.forEach((cell: number, cellIndex: number) => {
            if (cell) {
                animatedBoard[rowIndex][cellIndex].value = withTiming(1, {
                    duration: 150,
                    easing: Easing.inOut(Easing.ease),
                });
            }
        });
    });
};



  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return Math.abs(dx) > 5 || Math.abs(dy) > 5;
    },
    onPanResponderRelease: (_, gestureState) => {
      const { dx, dy } = gestureState;
      const direction = getSwipeDirection(dx, dy);
      if (direction) {
        setCurrentDirection(direction);
        moveTiles(direction);
      }
    },
  });

  const logoText = boardSize === 4 ? '2048' : (boardSize === 5 ? '4096' : '8192');

  return (
    <View style={[styles.container, { padding: margin / 2 }]} {...panResponder.panHandlers} >
      <View style={[styles.header, { marginBottom: margin }]}>
        <View style={styles.logo}>
          <Text style={[styles.logoText, { fontSize: fontSize * 1.2 }]}>{logoText}</Text>
        </View>
        <View style={styles.scoresContainer}>
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, { fontSize: fontSize * 0.5 }]}>Score</Text>
            <Text style={[styles.bestScoreText, { fontSize: fontSize * 0.6 }]}>{game.score}</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, { fontSize: fontSize * 0.5 }]}>Best</Text>
            <Text style={[styles.bestScoreText, { fontSize: fontSize * 0.6 }]}>{bestScore}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.menuButton, { width: screenWidth * 0.4 }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate('Menu');
        }}>
        <Text style={[styles.menuText, { fontSize: fontSize * 0.5 }]}>MENU</Text>
      </TouchableOpacity>

      <View style={[styles.gameBoard, { 
        width: cellSize * boardSize + totalMargin,
        height: cellSize * boardSize + totalMargin,
        padding: margin / 2
      }]}>
        {game.board.map((row: number[], rowIndex: number) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell: number, cellIndex: number) => {
              const animatedValue = animatedBoard[rowIndex][cellIndex];
              
              const animatedStyle = useAnimatedStyle(() => ({
                transform: [{
                  scale: interpolate(animatedValue.value, [0, 0.5, 1], [1, 1.1, 1]),
                }]
              }));

              return (
                <Animated.View
                  key={cellIndex}
                  style={[
                    styles.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                      margin: cellMargin / 2,
                    },
                    getCellStyles(cell),
                    animatedStyle,
                  ]}
                >
                  <Text style={[
                    styles.cellText,
                    {
                      fontSize: cell >= 100 ? fontSize * 0.7 : fontSize,
                      color: getCellStyles(cell).color,
                    }
                  ]}>
                    {cell !== 0 ? cell : ''}
                  </Text>
                </Animated.View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
    marginTop:20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
      marginTop:20,
  },
  logo: {
    backgroundColor: '#FFC96F',
    padding: 15,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scoresContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  scoreContainer: {
    backgroundColor: "#BBADA2",
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  scoreText: {
    fontWeight: '800',
    color: '#d7cdcd',
  },
  bestScoreText: {
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  gameBoard: {
    backgroundColor: '#BBADA0',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    backgroundColor: '#CDC1B5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  cellText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuButton: {
    backgroundColor: "#F19856",
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  menuText: {
    color: '#fff',
    fontWeight: "800",
  },
});

export default Game;
