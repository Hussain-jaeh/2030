import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Inter_500Medium } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import GameStack from '@/navigation/GameStack';
import mobileAds from 'react-native-google-mobile-ads';
import { StyleSheet } from 'react-native';


SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    const prepare = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Request tracking permissions
        const { status: trackingStatus } = await requestTrackingPermissionsAsync();
        
        // You can handle the tracking status here
        if (trackingStatus !== 'granted') {
          console.log('Tracking permission not granted');
          // Add your tracking-related logic here
        }

        // Initialize mobile ads
        await mobileAds().initialize();
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={styles.container}>
          <GameStack />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;