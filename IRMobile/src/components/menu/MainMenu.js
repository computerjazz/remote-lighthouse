import React, { Component, PropTypes } from 'react'
import { Animated, View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { setHeaderMenu, setCaptureMode, setEditMode, createRemote } from '../../actions'
import MenuItem from './MenuItem'

import { MENU_BACKGROUND_COLOR } from '../../constants/colors'
import { BUTTON_RADIUS } from '../../constants/dimensions'

class MainMenu extends Component {

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

  renderMainMenu = () => {
    return (
      <Animated.View style={[styles.menu, { opacity: this.animVal }]}>
        <MenuItem
          icon="remote"
          text="Capture"
          onPress={() => {
            this.props.setCaptureMode(true)
            this.props.setHeaderMenu(false)
          }}
        />
        <MenuItem
          icon="pencil"
          text="Modify"
          onPress={() => {
            this.props.setEditMode(true)
            this.props.setHeaderMenu(false)
          }}
        />
        <MenuItem
          icon="share-variant"
          text="Share"
          onPress={() => {
            this.props.setHeaderMenu(false)
            this.props.createRemote()
          }}
        />
        <MenuItem
          icon="plus"
          text="Add Remote"
          onPress={() => {
            this.props.setHeaderMenu(false)
            this.props.createRemote()
          }}
        />
        <MenuItem
          icon="delete"
          text="Delete"
          onPress={() => {
            this.props.setHeaderMenu(false)
          }}
        />
      </Animated.View>
    )
  }

  render() {
    return (this.props.headerMenuVisible || this.state.forceShowMenu) ? this.renderMainMenu() : null
  }
}

const mapStateToProps = state => ({
  headerMenuVisible: state.app.headerMenuVisible,
})

const mapDispatchToProps = dispatch => ({
  setEditMode: editing => dispatch(setEditMode(editing)),
  setCaptureMode: capturing => dispatch(setCaptureMode(capturing)),
  setHeaderMenu: visible => dispatch(setHeaderMenu(visible)),
  createRemote: () => dispatch(createRemote()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu)

const styles = StyleSheet.create({
  menu: {
    paddingHorizontal: 10,
    backgroundColor: MENU_BACKGROUND_COLOR,
    borderRadius: BUTTON_RADIUS,
    position: 'absolute',
    top: 25,
    right: 10,
  }
})
