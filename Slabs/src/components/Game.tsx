import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { GameStackParamList } from '@/navigation/GameStack';
import { StackNavigationProp } from '@react-navigation/stack';
import { move } from '../Features/gameSlice';
import Animated, { Easing, useSharedValue, withTiming, interpolate } from 'react-native-reanimated';

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

  useEffect(() => {
    if (game.gameOver) {
      navigation.navigate('GameOver', { score: game.score });
    }
  }, [game.gameOver, navigation]);

  const boardSize: BoardSize = game.board.length as BoardSize; 
  const screenWidth = Dimensions.get('window').width;
  const margin = 35;
  const cellMargin = 15;
  const totalMargin = margin + (cellMargin * (boardSize - 1));
  const cellSize = (screenWidth - totalMargin) / boardSize;

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

  const getSwipeDirection = (dx: number, dy: number): SwipeDirection => {
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'RIGHT' : 'LEFT') : (dy > 0 ? 'DOWN' : 'UP');
  };

  const moveTiles = (direction: SwipeDirection) => {
    dispatch(move({ direction }));

    game.board.forEach((row: number[], rowIndex: number) => {
      row.forEach((cell: number, cellIndex: number) => {
        if (cell) {
          animatedBoard[rowIndex][cellIndex].value = withTiming(1, { duration: 40000, easing: Easing.inOut(Easing.ease) });
          animatedBoard[rowIndex][cellIndex].value = 0; 
        }
      });
    });
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      return Math.abs(dx) > 10 || Math.abs(dy) > 10;
    },
    onPanResponderRelease: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      const direction = getSwipeDirection(dx, dy);
      setCurrentDirection(direction);
      moveTiles(direction);
    },
  });

  const logoText = boardSize === 4 ? '2048' : (boardSize === 5 ? '4096' : '8192');

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.header}>
        <View></View>
        <View style={styles.logo}>
          <Text style={styles.logoText}>{logoText}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score</Text>
          <Text style={styles.bestScoreText}>{game.score}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Best</Text>
          <Text style={styles.bestScoreText}>{game.bestScores[boardSize] || 0}</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate('Menu');
        }}>
          <Text style={styles.menuText}>MENU</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.gameBoard, { width: screenWidth - 20, height: screenWidth - 20 }]}>
        {game.board.map((row: number[], rowIndex: number) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell: number, cellIndex: number) => {
              const animatedValue = animatedBoard[rowIndex][cellIndex];

              return (
                <Animated.View
                  key={cellIndex}
                  style={[
                    styles.cell,
                    { width: cellSize, height: cellSize, transform: [{ 
                      translateX: interpolate(animatedValue.value, [0, 1], [
                        0, 
                        currentDirection === 'RIGHT' ? cellSize : (currentDirection === 'LEFT' ? -cellSize : 0)
                      ])
                    }] },
                    getCellStyles(cell)
                  ]}
                >
                  <Text style={[styles.cellText, { color: getCellStyles(cell).color }]}>
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
  },
  bestScoreText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  logo: {
    backgroundColor: '#FFC96F',
    padding: 15,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 35,
    color: '#fff',
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: "#BBADA2",
    borderRadius: 5,
    padding: 15,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#d7cdcd',
  },
  gameBoard: {
    backgroundColor: '#BBADA0',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#BBADA0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 5,
  },
  cellText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 200,
  },
  menuButton: {
    backgroundColor: "#F19856",
    width: 180,
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: "800",
  },
});

export default Game;
