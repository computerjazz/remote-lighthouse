import React, { Component, PropTypes } from 'react'
import { Animated, View, Share, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import {
  setHeaderMenu,
  setHeaderModal,
  setCaptureMode,
  setEditMode,
  createRemote,
  deleteRemote,
  exportRemote,
} from '../../actions'
import MenuItem from './MenuItem'

import themes from '../../constants/themes'
import { BUTTON_RADIUS } from '../../constants/dimensions'
import { GENERAL_SETTINGS } from '../../constants/ui'

class MainMenu extends Component {

  static childContextTypes = {
    theme: PropTypes.string,
  }

  state = {
    forceShowMenu: false,
  }

  animVal = new Animated.Value(0)

  getChildContext() {
    return { theme: this.props.theme }
  }

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
    const { MENU_BACKGROUND_COLOR } = themes[this.props.theme]

    return (
      <Animated.View style={[styles.menu, { backgroundColor: MENU_BACKGROUND_COLOR }, { opacity: this.animVal }]}>
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
          text="Arrange"
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
            const nestedRemote = this.props.exportRemote(this.props.currentRemoteId)
            console.log('SHARING REMOTE: ', JSON.stringify(nestedRemote, null, 2))
            Share.share({
              title: 'A remote has been shared with you!',
              message: JSON.stringify(nestedRemote),
            })
          }}
        />
        <MenuItem
          icon="plus"
          text="Add Remote"
          onPress={() => {
            this.props.setHeaderMenu(false)
            this.props.createRemote()
            this.props.setEditMode(true)
          }}
        />
        <MenuItem
          icon="settings"
          text="Settings"
          onPress={() => {
            this.props.setHeaderModal(GENERAL_SETTINGS)
            this.props.setHeaderMenu(false)
          }}
        />
        {
          this.props.numberOfRemotes > 1 && (
            <MenuItem
              icon="delete"
              text="Delete"
              onPress={() => {
                this.props.deleteRemote(this.props.currentRemoteId)
                this.props.setHeaderMenu(false)
              }}
            />
          )
        }
      </Animated.View>
    )
  }

  render() {
    return (this.props.headerMenuVisible || this.state.forceShowMenu) ? this.renderMainMenu() : null
  }
}

const mapStateToProps = state => ({
  theme: state.settings.theme,
  headerMenuVisible: state.app.headerMenuVisible,
  currentRemoteId: state.app.currentRemoteId,
  numberOfRemotes: state.remotes.list.length,
})

const mapDispatchToProps = dispatch => ({
  setEditMode: editing => dispatch(setEditMode(editing)),
  setCaptureMode: capturing => dispatch(setCaptureMode(capturing)),
  setHeaderMenu: visible => dispatch(setHeaderMenu(visible)),
  setHeaderModal: modal => dispatch(setHeaderModal(modal)),
  createRemote: () => dispatch(createRemote()),
  deleteRemote: remoteId => dispatch(deleteRemote(remoteId)),
  exportRemote: remoteId => dispatch(exportRemote(remoteId))
})

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu)

const styles = StyleSheet.create({
  menu: {
    paddingHorizontal: 10,
    borderRadius: BUTTON_RADIUS,
    position: 'absolute',
    top: 25,
    right: 10,
  }
})
