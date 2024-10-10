import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/store'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Inter_500Medium } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import GameStack from '@/navigation/GameStack';

SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
  });

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GameStack />
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App