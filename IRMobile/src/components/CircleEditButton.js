import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native'
import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import themes from '../constants/themes'

class CircleEditButton extends Component {

  static propTypes = {
    onPress: PropTypes.func,
    style: ViewPropTypes.style,
    theme: PropTypes.string.isRequired,
  }

  render() {
    const { onPress, style, theme } = this.props
    const { BUTTON_EDIT_ICON_COLOR, BUTTON_EDIT_COLOR }  = themes[theme]
    return (
      <TouchableOpacity style={[styles.container, { backgroundColor: BUTTON_EDIT_COLOR }, style]} onPress={onPress}>
        <Icon
          color={BUTTON_EDIT_ICON_COLOR}
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

const mapStateToProps = state => ({
  theme: state.settings.theme,
})

export default connect(mapStateToProps)(CircleEditButton)

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
