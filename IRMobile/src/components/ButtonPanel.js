import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import themes from '../constants/themes'
import panelDefs from '../dictionaries/panels'

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
    capturing: PropTypes.bool.isRequired,
    captureIRCode: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired,
    onPress: PropTypes.func,
    theme: PropTypes.string.isRequired,
    capturingButtonId: PropTypes.string,
    stopRecord: PropTypes.func.isRequired,
    transmitIRCode: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
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

  renderButton = (buttonId, index, row) => {
    const { PRIMARY_DARK } = themes[this.props.theme]
    return (
      <RemoteButton
        key={buttonId}
        iconSize={row.length > 3 ? 20 : 30}
        style={row.length > 3  ? styles.smallButton : styles.bigButton}
        onPress={this.onPress}
        color={PRIMARY_DARK}
        onEditPress={this.props.onEditPress}
        status={this.state.status}
        onStatusChangeEnd={this.onStatusChangeEnd}
        id={buttonId}
      />
    )
  }

  renderPanel(type, buttons) {
    const panelDef = panelDefs[type]
    if (buttons.length !== _.flatten(panelDef.icons).length) return
    const isMultiPane = typeof panelDef.icons[0] === 'object'
    if (isMultiPane) {
      let buttonIndex = 0
      return (
        <View style={[panelDef.style, { flexDirection: 'column', flex: 1 }]} key={`buttonPanel-${buttons[0]}`}>
          { panelDef.icons.map((paneDef) => (
            <View key={`buttonPanel-${buttons[buttonIndex]}`} style={{flex: 1, flexDirection: 'row'}}>
              { paneDef.map((defaultButtonType, j, arr) => this.renderButton(buttons[buttonIndex++], j, arr)) }
            </View>
          ))
          }
        </View>
      )
    } else return buttons.map(this.renderButton)
  }

  render() {
    const { buttons, type, editing, theme } = this.props
    console.log('PANEL PROPS', this.props)
    const { PRIMARY_LIGHT, BUTTON_DELETE_COLOR } = themes[theme]
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

        {this.renderPanel(type, buttons)}

        {editing &&
          <TouchableOpacity
            style={{ marginRight: 10 }}
            {...this.props.sortHandlers}
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
    theme: state.settings.theme,
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
