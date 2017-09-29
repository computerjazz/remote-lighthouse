import React, { Component, PropTypes } from 'react'
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
    editing: PropTypes.bool.isRequired,
    capturing: PropTypes.bool.isRequired,
    stopRecord: PropTypes.func.isRequired,
    setEditMode: PropTypes.func.isRequired,
    setCaptureMode: PropTypes.func.isRequired,
    setHeaderMenu: PropTypes.func.isRequired,
  }

  state = {
    editing: false,
  }

  renderDots() {
    const { HEADER_ICON_COLOR } = themes[this.props.theme]
    return (
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => this.props.setHeaderMenu(true)}
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
    const { PRIMARY_DARK_ANALOGOUS, HEADER_TITLE_EDITING_COLOR } = themes[this.props.theme]
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
      >
        <View style={[styles.icon, (editing || capturing) && { backgroundColor: HEADER_ICON_EDITING_BACKGROUND }]}>
          <Icon
            name={remote ? remote.icon : 'pencil'}
            color={(editing || capturing) ? HEADER_ICON_EDITING : HEADER_ICON_COLOR}
            size={25}
          />
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { editing, capturing, style, modalVisible, right, left } = this.props
    return (
        <View style={[styles.container, right ? styles.right : styles.left, style]}>
          { left && this.renderIcon() }
          { right && (editing || capturing ? this.renderDoneButton() : this.renderDots()) }
        </View>
    )
  }
}

const mapStateToProps = state => ({
  theme: state.settings.theme,
  editing: state.app.editing,
  capturing: state.app.capturing,
  modalVisible: state.app.modalVisible,
  currentRemoteId: state.app.currentRemoteId,
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
