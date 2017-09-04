import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import themes from '../constants/themes'

class CircleEditButton extends Component {

  static propTypes = {
    onPress: PropTypes.func,
    style: ViewPropTypes.style,
  }

  static contextTypes = {
    theme: PropTypes.string,
  }

  render() {
    const { onPress, style } = this.props
    const { LIGHT_GREY, BUTTON_EDIT_COLOR }  = themes[this.context.theme]
    return (
      <TouchableOpacity style={[styles.container, { backgroundColor: BUTTON_EDIT_COLOR }, style]} onPress={onPress}>
        <Icon
          color={LIGHT_GREY}
          name="pencil"
          size={20}
        />
      </TouchableOpacity>
    )
  }
}

CircleEditButton.defaultProps = {
  onPress: () => {},
  style: {},
}

export default CircleEditButton

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 100,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 3,
  },
})
