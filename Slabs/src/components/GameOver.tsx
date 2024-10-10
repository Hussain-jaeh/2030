import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { GameStackParamList } from '@/navigation/GameStack';
import { resetGameState } from '../Features/gameSlice';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../store';
import { StackNavigationProp } from '@react-navigation/stack';

type GameOverProps = StackScreenProps<GameStackParamList, 'GameOver'>;

const GameOver: React.FC<GameOverProps> = ({ route }) => {
  const { score } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<GameStackParamList>>();

  const { winningScore } = useSelector((state: RootState) => state.game);

  const hasWon = score >= winningScore;

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        {hasWon ? 'Yayyy you have won!' : 'Game Over!'}
      </Text>

      <TouchableOpacity style={styles.menuContainer_btn}>
        <Text style={styles.menuContainer_btn_text}>Score</Text>
        <Text style={styles.score}>{score}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuContainer_btnR}
        onPress={() => {
          dispatch(resetGameState());
           // @ts-ignore

          navigation.navigate('Game'); 
        }}
      >
        <Text style={styles.menuContainer_btn_text}>
          {hasWon ? 'Play Again' : 'Try Again'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuContainer_challenges}
        onPress={() => navigation.navigate('Challenges')}
      >
        <Text style={styles.menuContainer_btn_text}>Levels</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginBottom: 60,
    color: '#64554a',
    fontSize: 40,
    fontWeight: 'bold',
    alignItems: 'center',
    display: 'flex',
    justifyContent: "center"
  },
  menuContainer_btn: {
    width: 300,
    paddingVertical: 20,
    margin: '3.5%',
    borderRadius: 5,
    backgroundColor: "#BBADA2",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer_btnR: {
    width: 300,
    paddingVertical: 20,
    margin: '3.5%',
    borderRadius: 5,
    backgroundColor: "#1cae54",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer_challenges: {
    width: 300,
    paddingVertical: 20,
    margin: '3.5%',
    borderRadius: 5,
    backgroundColor: "#60A2F6",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer_btn_text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  score: {
    color: "#fff",
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default GameOver;
