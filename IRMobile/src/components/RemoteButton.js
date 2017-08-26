import React, { Component, PropTypes } from 'react'
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
}  from 'react-native'
import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import CircleEditButton from './CircleEditButton'

import {
  LIGHT_GREY,
  BUTTON_BACKGROUND_COLOR,
  BUTTON_TEXT_COLOR,
  RECORDING_IN_PROGRESS_COLOR,
  STATUS_GOOD_COLOR,
  STATUS_BAD_COLOR
} from '../constants/colors'
import { BUTTON_RADIUS } from '../constants/dimensions'

const PULSE_RATE = 750

class RemoteButton extends Component {

  static propTypes = {
    id: PropTypes.string,
    recordingButtonId: PropTypes.string,
    status: PropTypes.bool,
  }

  pulseAnim = new Animated.Value(0)
  statusAnim = new Animated.Value(0)

  state = {
    irCaptureStatus: null,
  }

  componentDidUpdate(prevProps) {
    const isRecording = this.props.recordingButtonId === this.props.id
    const hasNewStatus = (this.props.status !== null) && (prevProps.status !== this.props.status)
    if ((prevProps.recordingButtonId !== this.props.id) && isRecording) this.pulseBackground()
    if (isRecording && hasNewStatus) this.onStatusChanged()
  }

  pulseBackground = () => {
    if (this.props.recordingButtonId !== this.props.id) return

    Animated.timing(this.pulseAnim, {
      toValue: 1,
      duration: PULSE_RATE,
    }).start(() => {
      Animated.timing(this.pulseAnim, {
        toValue: 0,
        duration: PULSE_RATE,
      }).start(() => this.pulseBackground())
    })
  }

  onStatusChanged = () => {
    Animated.timing(this.statusAnim, {
      toValue: 1,
      duration: 250,
    }).start(() => {
      Animated.timing(this.statusAnim, {
        toValue: 0,
        duration: 250,
      }).start(() => {
        this.props.onStatusChangeEnd()
      })
    })
  }



  render() {
    const { iconSize = 30, id, style, title, editing, iconName, onPress = () => {}, onEditPress, recordingButtonId, status, color = LIGHT_GREY } = this.props
    const isRecording = recordingButtonId === id
    const hasStatus = status !== null
    const flashColor = status ? STATUS_GOOD_COLOR : STATUS_BAD_COLOR

    const pulseStyle = {
        backgroundColor: this.pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [BUTTON_BACKGROUND_COLOR, RECORDING_IN_PROGRESS_COLOR]
        })
      }

    const statusStyle = {
      backgroundColor: this.statusAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [BUTTON_BACKGROUND_COLOR, BUTTON_BACKGROUND_COLOR, flashColor]
      })
    }

    return (
      <View style={styles.wrapper}>
      <Animated.View
        style={[styles.animatedContainer, isRecording && pulseStyle, hasStatus && statusStyle, style]}
      >
        <TouchableOpacity
          onPress={() => onPress(id)}
          style={styles.touchable}
        >
          { !!iconName && <Icon name={iconName} size={iconSize} color={color} /> }
          { !!title && <Text style={styles.text} numberOfLines={1}>{title}</Text> }

        </TouchableOpacity>

      </Animated.View>
      { editing && <CircleEditButton onPress={() => onEditPress(id)} style={styles.editButton} /> }

    </View>
      )
    }
}


export default connect((state, ownProps) => ({
  iconName: state.buttons[ownProps.id].icon,
  title: state.buttons[ownProps.id].title,
  editing: state.app.editing,
  recordingButtonId: state.app.recordingButtonId,
}), null)(RemoteButton)

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  touchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: BUTTON_TEXT_COLOR,
    fontWeight: "300",
    fontSize: 15,
    paddingHorizontal: 7,
  },
  animatedContainer: {
    flex: 1,
    margin: 15,
    height: 75,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: BUTTON_BACKGROUND_COLOR,
  },
  editButton: {
    position: 'absolute',
    transform: [
      { translateX: 8 },
      { translateY: 8 }
    ],
  }
})
