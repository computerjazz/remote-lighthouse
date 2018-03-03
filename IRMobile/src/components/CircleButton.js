import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import themes from '../constants/themes'

class CircleButton extends Component {

  static propTypes = {
    onPress: PropTypes.func,
    theme: PropTypes.string.isRequired,
    style: PropTypes.object,
    icon: PropTypes.string,
    iconColor: PropTypes.string,
    buttonColor: PropTypes.string,
  }

  render() {
    let { onPress, theme, style, icon, iconColor, buttonColor } = this.props
    const { CIRCLE_PLUS_ICON_COLOR, CIRCLE_PLUS_BUTTON_COLOR } = themes[theme]
    if (!iconColor) iconColor = CIRCLE_PLUS_ICON_COLOR
    if (!buttonColor) buttonColor = CIRCLE_PLUS_BUTTON_COLOR
    return (
      <TouchableOpacity style={[styles.container, { backgroundColor: buttonColor }, style]} onPress={onPress}>
        <Icon
          color={iconColor}
          name={icon}
          size={35}
        />
      </TouchableOpacity>
    )
  }
}

CircleButton.defaultProps = {
  onPress: () => {},
}

const mapStateToProps = state => ({
  theme: state.settings.theme,
})

export default connect(
  mapStateToProps,
)(CircleButton)

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 100,
    bottom: 20,
    right: 20,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 3,
  },
})
