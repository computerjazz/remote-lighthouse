import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { LIGHT_GREY, RECORDING_IN_PROGRESS_COLOR } from '../constants/colors'

class CirclePlusButton extends Component {

  static propTypes = {
    onPress: PropTypes.func,
  }

  render() {
    const { onPress } = this.props
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Icon
          color={LIGHT_GREY}
          name="plus"
          size={35}
        />
      </TouchableOpacity>
    )
  }
}

CirclePlusButton.defaultProps = {
  onPress: () => {},
}

export default CirclePlusButton

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RECORDING_IN_PROGRESS_COLOR,
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 100,
    bottom: 20,
    right: 20,
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
