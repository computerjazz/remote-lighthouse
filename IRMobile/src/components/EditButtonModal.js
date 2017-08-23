import React, { Component } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import TextButton from './TextButton'

import { LIGHT_GREY, MID_GREY, DARK_GREY } from '../constants/colors'
import { BUTTON_RADIUS } from '../constants/style'


const generalIcons = [
  'chevron-up',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'home',
  'reload',
  'wrench',
  'menu',
  'lightbulb',
  'lightbulb-on-outline',
  'cake-variant',
  'martini',
  'pencil',

]

const deviceIcons = [
  'power',
  'brightness-1',
  'brightness-2',
  'brightness-3',
  'brightness-4',
  'brightness-5',
  'brightness-6',
  'brightness-7',
  'projector',
  'printer',
  'monitor',

]

const mediaIcons = [
  'play',
  'pause',
  'play-pause',
  'stop',
  'rewind',
  'fast-forward',
  'skip-previous',
  'skip-next',
  'step-backward',
  'step-forward',
  'step-backward-2',
  'step-forward-2',
]

const audioIcons = [
  'volume-low',
  'volume-medium',
  'volume-high',
  'volume-minus',
  'volume-plus',
  'volume-mute',
  'volume-off',
  'music',
  'music-off',
]


class EditButtonModal extends Component {

  state = {
    selectedIcon: null,
  }

  renderIconButton = (iconName, index) => {
    const selected = this.state.selectedIcon === iconName
    return (
      <TouchableOpacity
        key={index}
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
          <View>
            <Text style={styles.title}>Icon</Text>
            <Text style={styles.categoryTitle}>Device</Text>
            <View style={styles.iconContainer}>
              {deviceIcons.map(this.renderIconButton)}
            </View>
            <Text style={styles.categoryTitle}>Media Playback</Text>
            <View style={styles.iconContainer}>
              {mediaIcons.map(this.renderIconButton)}
            </View>
            <Text style={styles.categoryTitle}>Audio</Text>
            <View style={styles.iconContainer}>
              {audioIcons.map(this.renderIconButton)}
            </View>
            <Text style={styles.categoryTitle}>General</Text>
            <View style={styles.iconContainer}>
              {generalIcons.map(this.renderIconButton)}
            </View>
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
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: DARK_GREY,
  },
  categoryTitle: {
    fontSize: 15,
    color: DARK_GREY,
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
    borderTopColor: DARK_GREY,
    borderTopWidth: 0.5,
    paddingTop: 10,
    marginBottom: 20,
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
