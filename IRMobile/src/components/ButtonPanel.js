import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'

import { captureIRCode, createButton, transmitIRCode } from '../actions'
import RemoteButton from './RemoteButton'

class ButtonPanel extends Component {

  static propTypes = {
    captureIRCode: PropTypes.func,
    editing: PropTypes.bool,
    transmitIRCode: PropTypes.func,
  }

  state = {
    recording: null,
    status: null,
  }

  onPress = buttonId => {
    if (this.props.editing) {
      this.setRecordButtonId(buttonId)
      this.props.captureIRCode(buttonId, this.setRecordButtonId, this.onStatusChanged)
    }
    else this.props.transmitIRCode(buttonId)
    this.props.onPress && this.props.onPress()
  }

  setRecordButtonId = buttonId => {
      const recording = !!buttonId
      this.props.setParams({ recording })
      this.setState({ recording: buttonId })
  }

  onStatusChanged = status => {
    console.log('ON RECORD STATUS', status)
    this.setState({ status })
  }

  onStatusChangeEnd = () => {
    this.setState({ status: null })
  }

  render() {
    return (
      <View style={styles.container}>
        <RemoteButton
          iconName="arrow-down"
          style={styles.upDownButton}
          onPress={this.onPress}
          recording={this.props.editing && this.state.recording}
          status={this.state.status}
          onStatusChangeEnd={this.onStatusChangeEnd}
          id="4534"
        />
        <RemoteButton
          style={styles.upDownButton}
          iconName="arrow-up"
          onPress={this.onPress}
          recording={this.props.editing && this.state.recording}
          status={this.state.status}
          onSetCode={this.onSetCode}
          onStatusChangeEnd={this.onStatusChangeEnd}
          id="qwe"
        />
      </View>
    )
  }
}

export default connect(state => ({
  buttons: state.buttons,
  baseUrl: state.network.baseUrl
  }), dispatch => ({
  createButton: button => dispatch(createButton(button)),
  captureIRCode: (buttonId, setRecordButton, onStatusChanged) => dispatch(captureIRCode(buttonId, setRecordButton, onStatusChanged)),
  transmitIRCode: buttonId => dispatch(transmitIRCode(buttonId))
}))(ButtonPanel)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upDownContainer: {
    flexDirection: 'row',
  },
  upDownButton: {
    width: '40%'
  }
})
