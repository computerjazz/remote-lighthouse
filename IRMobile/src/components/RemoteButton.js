import React, { Component, PropTypes } from 'react'
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  View,
}  from 'react-native'
import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import CircleEditButton from './CircleEditButton'

import themes from '../constants/themes'

import { BUTTON_RADIUS } from '../constants/dimensions'

const PULSE_RATE = 750

class RemoteButton extends Component {

  static propTypes = {
    id: PropTypes.string,
    capturingButtonId: PropTypes.string,
    status: PropTypes.bool,
  }

  pulseAnim = new Animated.Value(0)
  statusAnim = new Animated.Value(0)

  state = {
    irCaptureStatus: null,
  }

  componentDidUpdate(prevProps) {
    const isRecording = this.props.capturingButtonId === this.props.id
    const hasNewStatus = (this.props.status !== null) && (prevProps.status !== this.props.status)
    if ((prevProps.capturingButtonId !== this.props.id) && isRecording) this.pulseBackground()
    if (isRecording && hasNewStatus) this.onStatusChanged()
  }

  pulseBackground = () => {
    if (this.props.capturingButtonId !== this.props.id) return

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
    const { iconSize = 30, id, style, title, editing, iconName, onPress = () => {}, onEditPress, capturingButtonId, status, theme, color = LIGHT_GREY } = this.props
    const isRecording = capturingButtonId === id
    const hasStatus = status !== null

    const {
      LIGHT_GREY,
      BUTTON_BACKGROUND_COLOR,
      BUTTON_ICON_COLOR,
      BUTTON_TEXT_COLOR,
      CAPTURING_IN_PROGRESS_COLOR,
      STATUS_GOOD_COLOR,
      STATUS_BAD_COLOR
    } = themes[theme]

    const flashColor = status ? STATUS_GOOD_COLOR : STATUS_BAD_COLOR

    const pulseStyle = {
        backgroundColor: this.pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [BUTTON_BACKGROUND_COLOR, CAPTURING_IN_PROGRESS_COLOR]
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
          style={[styles.animatedContainer, { backgroundColor: BUTTON_BACKGROUND_COLOR }, isRecording && pulseStyle, hasStatus && statusStyle, style]}
        >
          <TouchableHighlight
            underlayColor={BUTTON_ICON_COLOR}
            activeOpacity={0.85}
            onPress={editing ? () => onEditPress(id) :  () => onPress(id)}
            style={styles.touchable}
          >
            {/* React native bug  in TouchableHighlight -- child component must have a backgroundColor*/}
            <View style={[ styles.touchableInner, !isRecording && !hasStatus && { backgroundColor: BUTTON_BACKGROUND_COLOR }]}>
              { !!iconName && <Icon name={iconName} size={iconSize} color={BUTTON_ICON_COLOR} /> }
              { !!title && <Text style={[styles.text, { color: BUTTON_TEXT_COLOR }]} numberOfLines={1}>{title}</Text> }
            </View>

          </TouchableHighlight>
        </Animated.View>
        { editing && <CircleEditButton onPress={() => onEditPress(id)} style={styles.editButton} /> }

      </View>
      )
    }
}

const mapStateToProps = (state, ownProps) => ({
  theme: state.settings.theme,
  iconName: state.buttons[ownProps.id].icon,
  title: state.buttons[ownProps.id].title,
  editing: state.app.editing,
  capturingButtonId: state.app.capturingButtonId,
})

export default connect(mapStateToProps)(RemoteButton)

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  touchable: {
    flex: 1,
    borderRadius: BUTTON_RADIUS,
  },
  touchableInner : {
    borderRadius: BUTTON_RADIUS,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: "300",
    fontSize: 15,
    paddingHorizontal: 7,
  },
  animatedContainer: {
    margin: 15,
    flex: 1,
    height: 75,
    borderRadius: BUTTON_RADIUS,
  },
  editButton: {
    position: 'absolute',
    transform: [
      { translateX: 8 },
      { translateY: 8 }
    ],
  }
})
