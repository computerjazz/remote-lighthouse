import React, { Component, PropTypes } from 'react'
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import HeaderMenuItem from './HeaderMenuItem'

import { stopRecord } from '../actions'

import { LIGHT_GREY, PRIMARY_DARK_ANALOGOUS } from '../constants/colors'
import { BUTTON_RADIUS } from '../constants/style'

class HeaderMenu extends Component {

  static propTypes = {
    editing: PropTypes.bool,
    setParams: PropTypes.func,
    menuVisible: PropTypes.bool,
  }

  state = {
    editing: false,
    forceShowMenu: false
  }

  animVal = new Animated.Value(0)

  componentDidUpdate(prevProps) {
    if (prevProps.menuVisible && !this.props.menuVisible) {
      this.setMenu(false)
    }
  }

  renderMenu = () => {
    return (
      <Animated.View style={[styles.menu, { opacity: this.animVal }]}>

        <HeaderMenuItem
          icon="remote"
          text="Capture/Edit"
          onPress={() => {
            this.setMenu(false)
            this.props.setParams({editing: true, menuVisible: false})
          }}
        />
        <HeaderMenuItem
          icon="plus"
          text="Add Remote"
          onPress={() => {}}
        />
        <HeaderMenuItem
          icon="delete"
          text="Delete"
          onPress={() => {}}
        />
      </Animated.View>
    )
  }

  setMenu = menuVisible => {
    this.props.setParams({ menuVisible })
    const toValue = menuVisible ? 1 : 0
    this.setState({ forceShowMenu: true })
    Animated.timing(this.animVal, {
      toValue,
      duration: 250,
    }).start(() => {
      this.setState({ forceShowMenu: false })
    })
  }

  renderDots() {
    return (
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => this.setMenu(true)}
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
          this.props.setParams({ editing: false, recording: null })
        }}
      >
        <Text style={styles.text}>Done</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { menuVisible, editing } = this.props
    const { forceShowMenu } = this.state
    const shouldDisplayMenu = menuVisible || forceShowMenu

    return (
      <View style={styles.container}>
        { editing ? this.renderDoneButton() : this.renderDots() }
        { shouldDisplayMenu && this.renderMenu() }
      </View>
    )
  }
}

export default connect(null, dispatch => ({
  stopRecord: () => dispatch(stopRecord()),
}))(HeaderMenu)

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
    width: 50,
    height: 50,
    flex: 1,

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
    top: 15,
    right: 5,
    width: 150,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: BUTTON_RADIUS,
  }
})
