import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

function TouchableOpacit({text, onPress = () => {}, loading, ...props}) {
  return (
    <TouchableOpacity style={styles.w1001} onPress={onPress} {...props}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  w1001: {
    height: 40,
    fontWeight: '500',
    fontSize: 14,
    backgroundColor: 'rgb(70,85,31)',
    textTransform: 'uppercase',
    width: 200,
    marginTop: 4,
    marginRight: 'auto',
    marginBottom: 4,
    marginLeft: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgb(70,85,31)',
  },
  text: {
    color: 'rgb(255,255,255)',
    fontSize: 20,
    fontWeight: '500',
  },
});
export default TouchableOpacit;
