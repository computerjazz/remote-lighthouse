import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  LayoutAnimation,
  Share,
  StyleSheet,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import {
  createButtonPanel,
  setHeaderMenu,
  setHeaderModal,
  setCaptureMode,
  setEditMode,
  createRemote,
  deleteRemote,
  exportRemote,
  getShareRemoteUrl,
} from '../../actions'
import MenuItem from './MenuItem'

import { iPhoneXOffset, HEIGHT, WIDTH } from '../../utils'
import { CustomLayoutLinear } from '../../dictionaries/animations'

import themes from '../../constants/themes'
import { BUTTON_RADIUS } from '../../constants/dimensions'
import { GENERAL_SETTINGS, POWER } from '../../constants/ui'

class MainMenu extends Component {

  static propTypes = {
    setEditMode: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
    setHeaderMenu: PropTypes.func.isRequired,
    exportRemote: PropTypes.func.isRequired,
    getShareRemoteUrl: PropTypes.func.isRequired,
    currentRemoteId: PropTypes.string,
    createRemote: PropTypes.func.isRequired,
    createButtonPanel: PropTypes.func.isRequired,
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
          text="Edit"
          onPress={() => {
            this.props.setEditMode(true)
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
          icon="plus"
          text="Add Remote"
          onPress={() => {
            this.props.setHeaderMenu(false)
            const newRemote = this.props.createRemote()
            const { remoteId } = newRemote.payload
            this.props.createButtonPanel(POWER, remoteId)
            this.props.setEditMode(true)
          }}
        />
        {
          this.props.numberOfRemotes > 1 && (
            <MenuItem
              icon="delete"
              text="Delete Remote"
              onPress={() => {
                this.props.setHeaderMenu(false)
                Alert.alert(
                  'Delete Remote',
                  'Are you sure?',
                  [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'Delete', onPress: () => this.props.deleteRemote(this.props.currentRemoteId), style: 'destructive'},
                  ],
                )

              }}
            />
          )
        }
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
  createButtonPanel: (type, remoteId) => dispatch(createButtonPanel(type, remoteId)),
  setEditMode: editing => dispatch(setEditMode(editing)),
  setCaptureMode: capturing => dispatch(setCaptureMode(capturing)),
  setHeaderMenu: visible => dispatch(setHeaderMenu(visible)),
  setHeaderModal: modal => dispatch(setHeaderModal(modal)),
  createRemote: () => dispatch(createRemote()),
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
