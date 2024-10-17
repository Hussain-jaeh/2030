import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setDifficulty, newGame } from '../Features/gameSlice';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const Challenges = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleDifficultyChange = (difficulty: string) => {
    dispatch(setDifficulty(difficulty));
    dispatch(newGame());
    navigation.navigate('Game');
  };

  
  const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8310194785589499/3796206638';
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Levels</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleDifficultyChange('EASY')}>
        <Text style={styles.buttonText}>Easy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button2} onPress={() => handleDifficultyChange('HARD')}>
        <Text style={styles.buttonText}>Medium</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button3} onPress={() => handleDifficultyChange('EXPERT')}>
        <Text style={styles.buttonText}>Hard</Text>
      </TouchableOpacity>
      <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 20,
    color: '#ffffff',
  },
  button: {
    width: '90%',
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#F2B179',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
  },
  button2: {
    width: '90%',
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#F59563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button3: {
    width: '90%',
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#c01515',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '800',
  },
  adContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
});

export default Challenges;







