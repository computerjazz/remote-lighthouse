import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { stopRecord, setHeaderMenu, setEditMode, setRecordingButtonId } from '../../actions'

import { LIGHT_GREY, PRIMARY_DARK_ANALOGOUS, MENU_BACKGROUND_COLOR } from '../../constants/colors'
import { BUTTON_RADIUS } from '../../constants/dimensions'

class HeaderMenuButton extends Component {

  static propTypes = {
    editing: PropTypes.bool.isRequired,
    setParams: PropTypes.func.isRequired,
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
          this.props.stopRecord()
          this.props.setRecordingButtonId(null)
          this.props.setEditMode(false)
        }}
      >
        <Text style={styles.text}>Done</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { editing } = this.props
    return (
      <View style={styles.container}>
        { editing ? this.renderDoneButton() : this.renderDots() }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  editing: state.app.editing,
})

const mapDispatchToProps = dispatch => ({
  stopRecord: () => dispatch(stopRecord()),
  setHeaderMenu: visible => dispatch(setHeaderMenu(visible)),
  setEditMode: editing => dispatch(setEditMode(editing)),
  setRecordingButtonId: buttonId => dispatch(setRecordingButtonId(buttonId))
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMenuButton)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 20,
  },
  text: {
    color: LIGHT_GREY,
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
