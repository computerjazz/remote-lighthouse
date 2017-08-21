import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { RECORDING_IN_PROGRESS_COLOR } from '../constants/colors'

class PlusButton extends Component {
  render() {
    const { onPress = () => {} } = this.props
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>

        <Icon
          color={RECORDING_IN_PROGRESS_COLOR}
          name="plus-circle"
          size={75}
        />
      </TouchableOpacity>
    )
  }
}

export default PlusButton

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
})
