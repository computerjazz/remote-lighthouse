import React, { Component, PropTypes } from 'react'
import {
  Text,
  TouchableHighlight,
} from 'react-native'

import tinycolor from 'tinycolor2'

import { PRIMARY_DARK, MID_GREY } from '../constants/colors'

class TextButton extends Component {

  static propTypes = {
      onPress: PropTypes.func,
  }

  render() {
    const { text, color = tinycolor(PRIMARY_DARK).analogous().toString(), onPress, textStyle, buttonStyle } = this.props
    return (
      <TouchableHighlight
        onPress={onPress}
        style={buttonStyle}
        activeOpacity={0.5}
        underlayColor={MID_GREY}
      >
        <Text style={[{color}, textStyle]}>{text}</Text>
      </TouchableHighlight>

    )
  }
}

TextButton.defaultProps = {
  onPress: () => {},
}

export default TextButton
