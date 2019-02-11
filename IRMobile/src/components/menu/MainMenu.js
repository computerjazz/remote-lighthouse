import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  LayoutAnimation,
  Share,
  StyleSheet,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import {
  setHeaderMenu,
  setHeaderModal,
  setCaptureMode,
  setEditMode,
  deleteRemote,
  exportRemote,
  getShareRemoteUrl,
} from '../../actions'
import MenuItem from './MenuItem'

import { iPhoneXOffset, HEIGHT, WIDTH } from '../../utils'
import { CustomLayoutLinear } from '../../dictionaries/animations'

import themes from '../../constants/themes'
import { BUTTON_RADIUS } from '../../constants/dimensions'
import { GENERAL_SETTINGS } from '../../constants/ui'

class MainMenu extends Component {

  static propTypes = {
    setEditMode: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
    setHeaderMenu: PropTypes.func.isRequired,
    exportRemote: PropTypes.func.isRequired,
    getShareRemoteUrl: PropTypes.func.isRequired,
    currentRemoteId: PropTypes.string,
    numberOfRemotes: PropTypes.number.isRequired,
    deleteRemote: PropTypes.func.isRequired,
    setHeaderModal: PropTypes.func.isRequired,
    headerMenuVisible: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    currentRemoteId: null,
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.headerMenuVisible !== nextProps.headerMenuVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear)
    }
  }

  renderMainMenu = () => {
    const { MENU_BACKGROUND_COLOR } = themes[this.props.theme]
    const { headerMenuVisible } = this.props

    const style = headerMenuVisible ? {} : { right: -WIDTH / 2 }

    return (
      <View style={[styles.menu, style, { backgroundColor: MENU_BACKGROUND_COLOR }]}>
        <MenuItem
          icon="arrange-bring-forward"
          text="Layout"
          onPress={() => {
            this.props.setEditMode(true)
            this.props.setHeaderMenu(false)
          }}
        />
        <MenuItem
          icon="remote"
          text="Capture"
          onPress={() => {
            this.props.setEditMode(false)
            this.props.setCaptureMode(true)
            this.props.setHeaderMenu(false)
          }}
        />
        <MenuItem
          icon="share-variant"
          text="Share"
          onPress={async () => {
            this.props.setHeaderMenu(false)
            const nestedRemote = this.props.exportRemote(this.props.currentRemoteId)
            const url = await this.props.getShareRemoteUrl(nestedRemote)
            Share.share({
              title: 'A remote has been shared with you!',
              message: url,
            })
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
      </View>
    )
  }

  render() {
    return this.renderMainMenu()
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
  deleteRemote: remoteId => dispatch(deleteRemote(remoteId)),
  exportRemote: remoteId => dispatch(exportRemote(remoteId)),
  getShareRemoteUrl: nestedRemote => dispatch(getShareRemoteUrl(nestedRemote)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu)

const styles = StyleSheet.create({
  menu: {
    paddingHorizontal: 10,
    borderRadius: BUTTON_RADIUS,
    position: 'absolute',
    top: 80 + iPhoneXOffset,
    right: 10,
  }
})
