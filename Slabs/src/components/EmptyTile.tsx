
import React from 'react';
import { View, StyleSheet } from 'react-native';

const EmptyTile: React.FC = () => {
  return <View style={styles.emptyTile} />;
};

const styles = StyleSheet.create({
  emptyTile: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#ccc0b3', 
    borderRadius: 5,
  },
});

export default EmptyTile;
