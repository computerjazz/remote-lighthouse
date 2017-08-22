import React, { Component } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import TextButton from './TextButton'

import { LIGHT_GREY, MID_GREY, DARK_GREY, RECORDING_IN_PROGRESS_COLOR } from '../constants/colors'
import { BUTTON_RADIUS } from '../constants/style'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const icons = [
  'arrow-up',
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'backspace',
  'bell-ring-outline',
  'block-helper',
  'brightness-1',
  'brightness-2',
  'brightness-3',
  'brightness-4',
  'brightness-5',
  'brightness-6',
  'brightness-7',

]


class EditButtonModal extends Component {

  state = {
    selectedIcon: null,
  }

  renderIconButton = iconName => {
    const selected = this.state.selectedIcon === iconName
    return (
      <TouchableOpacity
        onPress={() => this.setState({ selectedIcon: iconName })}
        style={[styles.icon, selected && { backgroundColor: MID_GREY}]}
      >
        <Icon
          name={iconName}
          size={30}
          color={selected ? LIGHT_GREY : DARK_GREY}
        />
      </TouchableOpacity>
    )
  }

  render() {
    const { onAccept = () => {}, onCancel = () => {} } = this.props
    return (
      <View style={styles.container}>

        <ScrollView style={styles.scrollView}>
          <View style={styles.iconContainer}>
            {icons.map(this.renderIconButton)}
          </View>
        </ScrollView>

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
    top: 5,
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
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  icon: {
    width: 40,
    height: 40,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: BUTTON_RADIUS,
  },
  scrollView: {
    flex: 1,
    padding: 10,
  }
})
