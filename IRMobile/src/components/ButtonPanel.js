import React, { Component, PropTypes } from 'react'
import {
  Animated,
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
  UIManager
} from 'react-native'
import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { PRIMARY_DARK, PRIMARY_LIGHT, BUTTON_DELETE_COLOR } from '../constants/colors'

import {
  captureIRCode,
  stopRecord,
  transmitIRCode,
  setcapturingButtonId ,
  setEditButtonModalVisible,
  setEditButtonId,
  setDragging,
  deleteButtonPanel,
} from '../actions'
import RemoteButton from './RemoteButton'

class ButtonPanel extends Component {

  static propTypes = {
    buttons: PropTypes.array,
    captureIRCode: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired,
    onPress: PropTypes.func,
    capturingButtonId: PropTypes.string,
    stopRecord: PropTypes.func.isRequired,
    transmitIRCode: PropTypes.func.isRequired,
  }

  state = {
    status: null,
    editButtonModalVisible: false,
  }

  onPress = buttonId => {
    if (this.props.capturing) {
      if (this.props.capturingButtonId === buttonId) {
        this.props.stopRecord()
      } else {
        this.props.captureIRCode(buttonId, this.onStatusChanged)
      }
    }
    else this.props.transmitIRCode(buttonId)
    this.props.onPress()
  }

  onStatusChanged = status => this.setState({ status })

  onStatusChangeEnd = () => this.setState({ status: null })


  renderButton = (buttonId, index, array) => {
    return (
      <RemoteButton
        key={buttonId}
        iconSize={array.length > 3 ? 20 : 30}
        style={array.length > 3  ? styles.smallButton : styles.bigButton}
        onPress={this.onPress}
        color={PRIMARY_DARK}
        onEditPress={this.props.onEditPress}
        status={this.state.status}
        onStatusChangeEnd={this.onStatusChangeEnd}
        id={buttonId}
      />
    )
  }

  render() {
    const { buttons, editing } = this.props
    return (
      <View style={styles.container}>
        {editing &&
          <TouchableOpacity
            onPress={() => this.props.deleteButtonPanel(this.props.id, this.props.remoteId)}
            style={{marginLeft: 10}}
          >
            <Icon
              name="minus-box"
              color={BUTTON_DELETE_COLOR}
              size={30}
            />
          </TouchableOpacity>}

        {buttons.map(this.renderButton)}

        {editing &&
          <TouchableOpacity
            onPressIn={() => this.props.setDragging(true)}
            onPressOut={() => this.props.setDragging(false)}
            style={{marginRight: 10}}
          >
            <Icon
              name="drag-vertical"
              color={PRIMARY_LIGHT}
              size={30}
            />
          </TouchableOpacity>
        }
      </View>
    )
  }
}

ButtonPanel.defaultProps = {
  buttons: [],
  onPress: () => {},
  capturingButtonId: null,
}

const mapStateToProps = (state, ownProps) => ({
    editing: state.app.editing,
    capturing: state.app.capturing,
    buttons: state.panels[ownProps.id].buttons,
    type: state.panels[ownProps.id].type,
    capturingButtonId: state.app.capturingButtonId,
})

const mapDispatchToProps = dispatch => ({
  captureIRCode: (buttonId, onStatusChanged) => dispatch(captureIRCode(buttonId, onStatusChanged)),
  stopRecord: () => dispatch(stopRecord()),
  transmitIRCode: buttonId => dispatch(transmitIRCode(buttonId)),
  setcapturingButtonId: buttonId => dispatch(setcapturingButtonId(buttonId)),
  setEditButtonModalVisible: visible => dispatch(setEditButtonModalVisible(visible)),
  setEditButtonId: buttonId => dispatch(setEditButtonId(buttonId)),
  setDragging: dragging => dispatch(setDragging(dragging)),
  deleteButtonPanel: (panelId, remoteId) => dispatch(deleteButtonPanel(panelId, remoteId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ButtonPanel)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigButton: {
    height: 75
  },
  smallButton: {
    height: 50,
  },
})
