import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
}  from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { PRIMARY_LIGHT } from '../constants/colors'

const Button = ({ irCode, style, text, iconName, onPress, color }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(irCode)}
      style={[styles.button, style]}
    >
      <Icon name={iconName} size={30} color={color || "#fff"} />
      { text &&
        <Text style={styles.text}>
          {text}
        </Text>
      }
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
    height: 75,
    padding: 15,
    margin: 15,
    borderRadius: 3,
    backgroundColor: PRIMARY_LIGHT,
  },
  text: {
    color: '#ddd',
    fontWeight: 'bold',
    fontSize: 20,
  }
})
