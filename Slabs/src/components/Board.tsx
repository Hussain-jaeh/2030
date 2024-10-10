
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Tile from '../components/Tile';
import EmptyTile from '../components/EmptyTile';

interface BoardProps {
  board: (number | undefined)[][];
}

const Board: React.FC<BoardProps> = ({ board }) => {
  return (
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((value, colIndex) => (
            value ? (
              <Tile key={`${rowIndex}-${colIndex}`} value={value} />
            ) : (
              <EmptyTile key={`${rowIndex}-${colIndex}`} />
            )
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    padding: 20,
    backgroundColor: '#bbada0',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
  },
});

export default Board;
   