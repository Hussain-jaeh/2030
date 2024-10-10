import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Howtoplay1 from '../assets/images/howtoplay1.jpeg';
import Howtoplay2 from '../assets/images/howtoplay2.jpeg';
import Howtoplay3 from '../assets/images/howtoplay3.jpeg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HowToPlay: React.FC = () => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState<number>(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentPage(page);
  };

  const Pagination: React.FC = () => {
    return (
      <View style={styles.paginationContainer}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentPage ? styles.paginationDotActive : null
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal={true} 
        pagingEnabled={true} 
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.slide}>
          <Image source={Howtoplay1} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.slide}>
          <Image source={Howtoplay2} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.slide}>
          <Text style={styles.topText}>Join the numbers and get the 2048, 4096, 8192 </Text>
          <Image source={Howtoplay3} style={styles.image} resizeMode="contain" />
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={() => navigation.navigate('Menu' as never)}
          >
            <Text style={styles.playButtonText}>Let's Play</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Pagination />
    </View>
  );
};

export default HowToPlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5f5',
  },
  slide: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.6,
  },
  topText: {
    fontSize: 15,
    color:'#F2B179',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    position: 'absolute',
    top: 200,
    
  },
  playButton: {
    backgroundColor: '#BBADA2',
    padding: 25,
    borderRadius: 10,
    position: 'absolute',
    bottom: 180,
  },
  playButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: 8,
  },
  paginationDotActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

