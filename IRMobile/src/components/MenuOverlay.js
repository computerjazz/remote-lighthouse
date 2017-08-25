import React, { Component, PropTypes } from 'react'
import { Animated, View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { setHeaderMenu, setEditMode } from '../actions'
import HeaderMenuItem from './HeaderMenuItem'

import { MENU_BACKGROUND_COLOR } from '../constants/colors'
import { BUTTON_RADIUS } from '../constants/dimensions'

class MenuOverlay extends Component {

  state = {
    forceShowMenu: false,
  }

  animVal = new Animated.Value(0)

  componentDidUpdate(prevProps) {
    if (prevProps.headerMenuVisible && !this.props.headerMenuVisible) {
      this.animateMenuVisible(false)
    }
    if (!prevProps.headerMenuVisible && this.props.headerMenuVisible) {
      this.animateMenuVisible(true)
    }
  }

  animateMenuVisible = menuVisible => {
    const toValue = menuVisible ? 1 : 0
    this.setState({ forceShowMenu: true })
    Animated.timing(this.animVal, {
      toValue,
      duration: 250,
    }).start(() => {
      this.setState({ forceShowMenu: false })
    })
  }

  renderMenu = () => {
    return (
      <Animated.View style={[styles.menu, { opacity: this.animVal }]}>
        <HeaderMenuItem
          icon="remote"
          text="Capture/Edit"
          onPress={() => {
            this.props.setHeaderMenu(false)
            this.props.setEditMode(true)
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

  render() {
    return (this.props.headerMenuVisible || this.state.forceShowMenu) ? this.renderMenu() : null
  }
}

const mapStateToProps = state => ({
  headerMenuVisible: state.app.headerMenuVisible,
})

const mapDispatchToProps = dispatch => ({
  setEditMode: editing => dispatch(setEditMode(editing)),
  setHeaderMenu: visible => dispatch(setHeaderMenu(visible))
})

export default connect(mapStateToProps, mapDispatchToProps)(MenuOverlay)

const styles = StyleSheet.create({
  menu: {
    padding: 10,
    backgroundColor: MENU_BACKGROUND_COLOR,
    borderRadius: BUTTON_RADIUS,
    position: 'absolute',
    top: 25,
    right: 10,
  }
})
