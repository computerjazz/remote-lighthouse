import React, { Component, PropTypes } from 'react'
import {
  Text,
  TouchableHighlight,
} from 'react-native'
import { connect } from 'react-redux'

import themes from '../constants/themes'

class TextButton extends Component {

  static propTypes = {
      onPress: PropTypes.func,
  }

  render() {
    const { color, text, onPress, textStyle, buttonStyle, theme } = this.props
    const { MID_GREY } = themes[theme]
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

const mapStateToProps = state => ({
  theme: state.settings.theme,
})

export default connect(mapStateToProps)(TextButton)
