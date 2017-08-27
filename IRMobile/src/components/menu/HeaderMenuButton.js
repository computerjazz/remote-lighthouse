import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { stopRecord, setHeaderMenu, setEditMode, setCaptureMode } from '../../actions'

import { LIGHT_GREY, PRIMARY_DARK_ANALOGOUS, MENU_BACKGROUND_COLOR } from '../../constants/colors'
import { BUTTON_RADIUS, STATUS_BAR_HEIGHT } from '../../constants/dimensions'

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
    return (
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => this.props.setHeaderMenu(true)}
      >
        <Icon
          name="dots-vertical"
          size={30}
          color={PRIMARY_DARK_ANALOGOUS}
        />
      </TouchableOpacity>
    )
  }

  renderDoneButton() {
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
        <Text style={[styles.text, { color: this.props.capturing ? PRIMARY_DARK_ANALOGOUS : LIGHT_GREY }]}>Done</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { editing, capturing, style, modalVisible } = this.props
    if (modalVisible) return null
    return (
        <View style={[styles.container, style]}>
          { editing || capturing ? this.renderDoneButton() : this.renderDots() }
        </View>
    )
  }
}

const mapStateToProps = state => ({
  editing: state.app.editing,
  capturing: state.app.capturing,
  modalVisible: state.app.modalVisible,
})

const mapDispatchToProps = dispatch => ({
  stopRecord: () => dispatch(stopRecord()),
  setHeaderMenu: visible => dispatch(setHeaderMenu(visible)),
  setEditMode: editing => dispatch(setEditMode(editing)),
  setCaptureMode: capturing => dispatch(setCaptureMode(capturing)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMenuButton)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 20,
    position: 'absolute',
    right: 0,
    top: 0,
    marginTop: STATUS_BAR_HEIGHT * 1.5,
  },
  text: {
    fontSize: 18,
  },
  touchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    position: 'absolute',
    zIndex: 999,
    top: 15,
    width: 50,
    right: 5,
    padding: 15,
    backgroundColor: MENU_BACKGROUND_COLOR,
    borderRadius: BUTTON_RADIUS,
  }
})
