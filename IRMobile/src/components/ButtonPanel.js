import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'

import { PRIMARY_DARK } from '../constants/colors'

import {
  captureIRCode,
  stopRecord,
  transmitIRCode,
  setRecordingButtonId ,
  setEditButtonModalVisible,
  setEditButtonId,
} from '../actions'
import RemoteButton from './RemoteButton'

class ButtonPanel extends Component {

  static propTypes = {
    buttons: PropTypes.array,
    captureIRCode: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired,
    onPress: PropTypes.func,
    recordingButtonId: PropTypes.string,
    stopRecord: PropTypes.func.isRequired,
    transmitIRCode: PropTypes.func.isRequired,
  }


  state = {
    status: null,
    editButtonModalVisible: false,
  }

  onPress = buttonId => {
    if (this.props.editing) {
      if (this.props.recordingButtonId === buttonId) {
        this.props.stopRecord()
        this.props.setRecordingButtonId(null)
      } else {
        this.setRecordButtonId(buttonId)
        this.props.captureIRCode(buttonId, this.setRecordButtonId, this.onStatusChanged)
      }
    }
    else this.props.transmitIRCode(buttonId)
    this.props.onPress()
  }

  setRecordButtonId = buttonId => {
      this.props.setRecordingButtonId(buttonId)
  }

  onStatusChanged = status => this.setState({ status })

  onStatusChangeEnd = () => this.setState({ status: null })


  renderButton = (buttonId, index, array) => {
    return (
      <RemoteButton
        iconSize={array.length > 3 ? 20 : 30}
        style={array.length > 3  ? { height: 50 } : { height: 75 }}
        onPress={this.onPress}
        color={PRIMARY_DARK}
        onEditPress={this.props.onEditPress}
        status={this.state.status}
        onStatusChangeEnd={this.onStatusChangeEnd}
        id={buttonId}
        key={buttonId}
      />
    )
  }

  render() {
    const { buttons = [] } = this.props
    return (
      <View style={styles.container}>
        {buttons.map(this.renderButton)}
      </View>
    )
  }
}

ButtonPanel.defaultProps = {
  buttons: [],
  onPress: () => {},
  recordingButtonId: null,
}

const mapStateToProps = (state, ownProps) => ({
    editing: state.app.editing,
    buttons: state.panels[ownProps.id].buttons,
    type: state.panels[ownProps.id].type,
    recordingButtonId: state.app.recordingButtonId,
})

const mapDispatchToProps = dispatch => ({
  captureIRCode: (buttonId, setRecordButton, onStatusChanged) => dispatch(captureIRCode(buttonId, setRecordButton, onStatusChanged)),
  stopRecord: () => dispatch(stopRecord()),
  transmitIRCode: buttonId => dispatch(transmitIRCode(buttonId)),
  setRecordingButtonId: buttonId => dispatch(setRecordingButtonId(buttonId)),
  setEditButtonModalVisible: visible => dispatch(setEditButtonModalVisible(visible)),
  setEditButtonId: buttonId => dispatch(setEditButtonId(buttonId))
})

export default connect(mapStateToProps, mapDispatchToProps)(ButtonPanel)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
