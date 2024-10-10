import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Game from '@/src/components/Game'; 
import Menu from '@/src/page/Menu'; 
import Colors from '@/constants/Colors';
import Challenges from '@/src/page/Challenges'; 
import GameOver from '@/src/components/GameOver';
import HowToPlay from '@/src/components/HowToPlay';

export type GameStackParamList = {
  Game: { gameState: string };
  Menu: undefined;
  Challenges: undefined;
  GameOver: { score: number }; 
  HowToPlay: { howToPlayParams: undefined };
};

const Stack = createNativeStackNavigator<GameStackParamList>();

const GameStack: React.FC = () => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || 'light'];



  return (
    <Stack.Navigator
      initialRouteName="Challenges"
      screenOptions={{
        headerStyle: { backgroundColor: themeColors.TopTab },
        headerTintColor: themeColors.headerTintColor,
        headerTitleStyle: { fontWeight: 'bold', fontFamily: 'Inter_500Medium' },
      }}
    >
      <Stack.Screen name="Game" component={Game} options={{ headerShown: false }} />
      <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
      <Stack.Screen name="Challenges" component={Challenges} options={{ headerShown: false }} />
      <Stack.Screen name="GameOver" component={GameOver} options={{ headerShown: false }} />
      <Stack.Screen name="HowToPlay" component={HowToPlay} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default GameStack;