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
import { CUSTOM, MEDIA_PLAYBACK } from '../constants/types'

class AddPanelModal extends Component {
  render() {
    const { onAccept = () => {}, onCancel = () => {}, remoteId } = this.props
    return (
      <View style={styles.container}>
        <TextButton
          text="Custom"
          buttonStyle={styles.confirmButton}
          onPress={() => onAccept(CUSTOM)}
        />
        <TextButton
          text="Media Playback"
          buttonStyle={styles.confirmButton}
          onPress={() => onAccept(MEDIA_PLAYBACK)}
        />
        <View style={styles.confirmButtonContainer}>
          <TextButton
            text="Cancel"
            buttonStyle={styles.confirmButton}
            onPress={onCancel}
          />
        </View>
      </View>
    )
  }
}

export default AddPanelModal

const styles = StyleSheet.create({
  container: {
    backgroundColor: LIGHT_GREY,
    opacity: 0.9,
    position: 'absolute',
    top: 20,
    bottom: 20,
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
