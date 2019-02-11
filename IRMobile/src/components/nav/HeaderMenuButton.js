import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { stopRecord, setHeaderMenu, setEditMode, setCaptureMode, setHeaderModal } from '../../actions'

import themes from '../../constants/themes'
import { REMOTE_OPTIONS } from '../../constants/ui'

class HeaderMenuButton extends Component {

  static propTypes = {
    capturing: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
    headerMenuVisible: PropTypes.bool.isRequired,
    instructionStep: PropTypes.number.isRequired,
    setCaptureMode: PropTypes.func.isRequired,
    setEditMode: PropTypes.func.isRequired,
    setHeaderMenu: PropTypes.func.isRequired,
    stopRecord: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
  }

  state = {
    editing: false,
  }

  renderDots() {
    const { theme, setHeaderMenu, headerMenuVisible } = this.props
    const { HEADER_ICON_COLOR } = themes[theme]
    return (
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => setHeaderMenu(!headerMenuVisible)}
      >
        <Icon
          name="dots-vertical"
          size={30}
          color={HEADER_ICON_COLOR}
        />
      </TouchableOpacity>
    )
  }

  renderDoneButton() {
    const { HEADER_TITLE_EDITING_COLOR } = themes[this.props.theme]
    const { instructionStep } = this.props
    // Prevent users from toggling out of tutorial
    if (instructionStep !== -1 && instructionStep < 7) return

    return (
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => {
          this.props.onPressDone()
          this.props.stopRecord()
          this.props.setCaptureMode(false)
          this.props.setEditMode(false)
        }}
      >
        <Text style={[styles.text, { color: HEADER_TITLE_EDITING_COLOR }]}>Done</Text>
      </TouchableOpacity>
    )
  }

  renderIcon = () => {
    const { remote, editing, capturing, theme } = this.props
    const {
      HEADER_ICON_COLOR,
      HEADER_ICON_EDITING,
      HEADER_ICON_EDITING_BACKGROUND,
    } = themes[theme]

    return (
      <TouchableOpacity
        disabled={!editing}
        onPress={() => this.props.setHeaderModal(REMOTE_OPTIONS)}
        style={[styles.icon, (editing || capturing) && { backgroundColor: HEADER_ICON_EDITING_BACKGROUND }]}
      >
      {remote && (
          <Icon
            name={remote.icon || "pencil"}
            color={(editing || capturing) ? HEADER_ICON_EDITING : HEADER_ICON_COLOR}
            size={25}
          />
      )}

      </TouchableOpacity>
    )
  }

  render() {
    const { editing, capturing, style, modalVisible, right, left } = this.props
    const shouldRenderDoneButton = (editing || capturing)
    return (
        <View style={[styles.container, right ? styles.right : styles.left, style]}>
          { left && this.renderIcon() }
          { right && (shouldRenderDoneButton ? this.renderDoneButton() : this.renderDots()) }
        </View>
    )
  }
}

const mapStateToProps = state => ({
  theme: state.settings.theme,
  editing: state.app.editing,
  capturing: state.app.capturing,
  instructionStep: state.settings.instructionStep,
  modalVisible: state.app.modalVisible,
  currentRemoteId: state.app.currentRemoteId,
  headerMenuVisible: state.app.headerMenuVisible,
  remote: state.remotes[state.app.currentRemoteId],
})

const mapDispatchToProps = dispatch => ({
  stopRecord: () => dispatch(stopRecord()),
  setHeaderMenu: visible => dispatch(setHeaderMenu(visible)),
  setEditMode: editing => dispatch(setEditMode(editing)),
  setCaptureMode: capturing => dispatch(setCaptureMode(capturing)),
  setHeaderModal: modal => dispatch(setHeaderModal(modal))
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMenuButton)

const styles = StyleSheet.create({
  right: {
    marginRight: 20,
    right: 0,
  },
  left: {
    marginLeft: 20,
    left: 0,
  },
  container: {
    flex: 1,
  },
  text: {
    fontSize: 18,
  },
  touchable: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  icon: {
    borderRadius: 100,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
