import React, { Component } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import _ from 'lodash'
import TextButton from './TextButton'

import { LIGHT_GREY } from '../constants/colors'
import { BUTTON_RADIUS } from '../constants/style'
import panelDict from '../dictionaries/panels'

class AddPanelModal extends Component {

  renderAddPanelOption = ({ title }, key) => (
    <TextButton
      key={key}
      text={title}
      buttonStyle={styles.confirmButton}
      onPress={() => this.props.onAccept(key)}
    />
  )

  render() {
    const { onAccept = () => {}, onCancel = () => {}, remoteId } = this.props
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          { _.map(panelDict, this.renderAddPanelOption) }
          <View style={styles.confirmButtonContainer}>
            <TextButton
              text="Cancel"
              buttonStyle={styles.confirmButton}
              onPress={onCancel}
            />
          </View>
        </View>
      </View>
    )
  }
}

export default AddPanelModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    backgroundColor: LIGHT_GREY,
    opacity: 0.9,
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
  },
  wrapper: {
  ...StyleSheet.absoluteFillObject,
  padding: 20,
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  },
})
