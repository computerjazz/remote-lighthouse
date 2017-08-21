import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
} from 'react-native'

import tinycolor from 'tinycolor2'

import { PRIMARY_DARK } from '../constants/colors'

class TextButton extends Component {
  render() {
    const { text, color = tinycolor(PRIMARY_DARK).analogous().toString(), onPress = () => {}, textStyle, buttonStyle } = this.props
    return (
      <TouchableOpacity onPress={onPress} style={buttonStyle}>
        <Text style={[{color}, textStyle]}>{text}</Text>
      </TouchableOpacity>
    )
  }
}

export default TextButton
