import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'

import { PRIMARY_DARK } from '../constants/colors'

import { captureIRCode, stopRecord, transmitIRCode } from '../actions'
import RemoteButton from './RemoteButton'
import EditButtonModal from './EditButtonModal'

class ButtonPanel extends Component {

  static propTypes = {
    buttons: PropTypes.array,
    captureIRCode: PropTypes.func.isRequired,
    editing: PropTypes.bool,
    onPress: PropTypes.func,
    recording: PropTypes.string,
    setParams: PropTypes.func.isRequired,
    stopRecord: PropTypes.func.isRequired,
    transmitIRCode: PropTypes.func.isRequired,
  }


  state = {
    status: null,
    editButtonModalVisible: false,
  }

  onPress = buttonId => {
    if (this.props.editing) {
      if (this.props.recording === buttonId) {
        this.props.stopRecord()
        this.props.setParams({ recording: null })
      } else {
        this.setRecordButtonId(buttonId)
        this.props.captureIRCode(buttonId, this.setRecordButtonId, this.onStatusChanged)
      }
    }
    else this.props.transmitIRCode(buttonId)
    this.props.onPress()
  }

  onEditPress = editingButtonId  => {
    this.props.setParams({ editButtonModalVisible: true, editingButtonId })
  }

  setRecordButtonId = buttonId => {
      this.props.setParams({ recording: buttonId })
  }

  onStatusChanged = status => this.setState({ status })

  onStatusChangeEnd = () => this.setState({ status: null })


  renderButton = (buttonId, index, array) => {
    const { recording, editing } = this.props
    return (
      <RemoteButton
        iconSize={array.length > 3 ? 20 : 30}
        style={array.length > 3  ? { height: 50 } : { height: 75 }}
        onPress={this.onPress}
        color={PRIMARY_DARK}
        onEditPress={this.onEditPress}
        editing={editing}
        recording={recording}
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
  editing: false,
  buttons: [],
  onPress: () => {},
}

const mapStateToProps = (state, ownProps) => ({
    buttons: state.panels[ownProps.id].buttons,
    type: state.panels[ownProps.id].type
})

const mapDispatchToProps = dispatch => ({
  captureIRCode: (buttonId, setRecordButton, onStatusChanged) => dispatch(captureIRCode(buttonId, setRecordButton, onStatusChanged)),
  stopRecord: () => dispatch(stopRecord()),
  transmitIRCode: buttonId => dispatch(transmitIRCode(buttonId))
})

export default connect(mapStateToProps, mapDispatchToProps)(ButtonPanel)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
