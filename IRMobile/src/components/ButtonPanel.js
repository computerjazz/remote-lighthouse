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
    buttons: [
      {id: '4534', description: '', icon: 'cake-variant'},
      //{id: 'qwe', description: '', icon: 'martini'},
      //{id: '345', description: '', icon: 'music'},
      //{id: '567', description: '', icon: 'music'},
      //{id: '33', description: '', icon: 'cake-variant'},





    ]
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

  onStatusChanged = status => this.setState({ status })

  onStatusChangeEnd = () => this.setState({ status: null })


  renderButton = ({id, description, icon}, index, array) => (
    <RemoteButton
      iconName={icon}
      iconSize={array.length > 3 ? 20 : 30}
      style={array.length > 3  ? { height: 50 } : { height: 75 }}
      onPress={this.onPress}
      recording={this.props.editing && this.state.recording}
      status={this.state.status}
      onStatusChangeEnd={this.onStatusChangeEnd}
      id={id}
      key={id}
    />
  )

  render() {
    return (
      <View style={styles.container}>
        {this.state.buttons.map(this.renderButton)}
      </View>
    )
  }
}

export default connect(state => ({
  buttons: state.buttons,
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
})
