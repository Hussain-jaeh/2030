
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TileProps {
  value: number | undefined;
}

const Tile: React.FC<TileProps> = ({ value }) => {
  const tileStyle = value ? styles.tile : styles.emptyTile; 

  return (
    <View style={tileStyle}>
      <Text style={styles.tileText}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#eee4da',
    borderRadius: 5,
  },
  emptyTile: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#ccc0b3', 
    borderRadius: 5,
  },
  tileText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Tile;
