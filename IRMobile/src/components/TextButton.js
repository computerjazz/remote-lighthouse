import React, { Component, PropTypes } from 'react'
import {
  Text,
  TouchableHighlight,
} from 'react-native'

import themes from '../constants/themes'

class TextButton extends Component {

  static propTypes = {
      onPress: PropTypes.func,
  }

  static contextTypes = {
    theme: PropTypes.string,
  }

  render() {
    const { color, text, onPress, textStyle, buttonStyle } = this.props
    const { MID_GREY } = themes[this.context.theme]
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
