import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
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
    const { ICON_SELECTED_BACKGROUND_COLOR } = themes[theme]
    return (
      <TouchableHighlight
        onPress={onPress}
        style={[styles.button, buttonStyle]}
        underlayColor={ICON_SELECTED_BACKGROUND_COLOR}
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

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
