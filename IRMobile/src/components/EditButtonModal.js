import React, { Component } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import TextButton from './TextButton'

import { LIGHT_GREY } from '../constants/colors'
import { BUTTON_RADIUS } from '../constants/style'

class EditButtonModal extends Component {
  render() {
    const { onAccept = () => {}, onCancel = () => {} } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.confirmButtonContainer}>
          <TextButton
            text="Cancel"
            buttonStyle={styles.confirmButton}
            onPress={onCancel}
          />
          <TextButton
            text="Ok"
            buttonStyle={styles.confirmButton}
            onPress={onAccept}
          />
        </View>
      </View>
    )
  }
}

export default EditButtonModal

const styles = StyleSheet.create({
  container: {
    backgroundColor: LIGHT_GREY,
    opacity: 0.9,
    position: 'absolute',
    top: 50,
    bottom: 50,
    left: 20,
    right: 20,
    borderRadius: BUTTON_RADIUS,
  },
  confirmButtonContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  confirmButton: {
    padding: 20,
  }
})
