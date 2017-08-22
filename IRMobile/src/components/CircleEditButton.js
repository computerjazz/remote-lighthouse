import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { LIGHT_GREY, RECORDING_IN_PROGRESS_COLOR } from '../constants/colors'

class CircleEditButton extends Component {

  static propTypes = {
    onPress: PropTypes.func,
    style: ViewPropTypes.style,
  }

  render() {
    const { onPress, style } = this.props
    return (
      <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
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
    backgroundColor: RECORDING_IN_PROGRESS_COLOR,
    width: 35,
    height: 35,
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
