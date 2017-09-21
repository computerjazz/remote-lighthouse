import React, { Component, PropTypes } from 'react'
import {
  View,
  UIManager,
  LayoutAnimation,
  StyleSheet,
} from 'react-native'

import { connect } from 'react-redux'

import { NetworkInfo } from 'react-native-network-info';

import { POWER } from '../constants/ui'

import Remote from './Remote'
import Header from './menu/Header'
import LoadingScreen from './LoadingScreen'
import themes from '../constants/themes'

import { createTabNavigator } from '../navigation'
import { createRemote, setBaseUrl, setEditMode, createButtonPanel, findDevicesOnNetwork } from '../actions'
import { isAndroid } from '../utils'
import { CustomLayoutLinear, CustomLayoutSpring } from '../dictionaries/animations'

class RemoteContainer extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
        header: <Header />,
      }
    }

  static propTypes = {
    theme: PropTypes.string.isRequired,
    remotes: PropTypes.object.isRequired,
    createRemote: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    setEditMode: PropTypes.func.isRequired,
    setBaseUrl: PropTypes.func.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    // Only update the container when a remote has been added or deleted
    return nextProps.remotes.list.length !== this.props.remotes.list.length
  }

  componentWillMount() {
    this.props.setBaseUrl('http://192.168.86.136')
    if (isAndroid) UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)

  }

  componentDidMount() {
    // Get Local IP
    NetworkInfo.getIPAddress(ip => {
      console.log('IP:', ip)
      findDevicesOnNetwork(ip)
    });

    // Get SSID
    NetworkInfo.getSSID(ssid => {
      console.log('SSID:', ssid)
    });

    // Get BSSID
    NetworkInfo.getBSSID(ssid => {
      console.log('BSSID:', ssid)
    });
  }

  componentWillReceiveProps(nextProps) {
    const { navigation } = this.props
    const { setParams } = navigation


    if(!navigation.state.params || !navigation.state.params.theme || this.props.theme !== nextProps.theme) {
      setParams({ theme: nextProps.theme })
    }

    if (!this.props.rehydrated && nextProps.rehydrated) {
      if (!nextProps.remotes.list.length) {
        // First time in, create a remote
        const newRemote = this.props.createRemote()
        const { remoteId } = newRemote.payload
        this.props.createButtonPanel(POWER, remoteId)
        this.props.setEditMode(true)
      }
    }

    const thisRemote = this.props.remotes[this.props.currentRemoteId]
    const nextRemote = nextProps.remotes[nextProps.currentRemoteId]

    if (nextProps.editing !== this.props.editing) {
      LayoutAnimation.configureNext(CustomLayoutSpring)
      setParams({ editing: nextProps.editing })
    }
    if (nextProps.capturing !== this.props.capturing) setParams({ capturing: nextProps.capturing })
    if (nextProps.capturingButtonId !== this.props.capturingButtonId) setParams({ recording: !!nextProps.capturingButtonId })
    if (thisRemote && nextRemote && this.props.currentRemoteId === nextProps.currentRemoteId && nextRemote.panels.length !== thisRemote.panels.length) {
      // Button panels were added/deleted
      if (nextRemote.panels.length > thisRemote.panels.length) LayoutAnimation.configureNext(CustomLayoutLinear)
      else LayoutAnimation.configureNext(CustomLayoutSpring)
    } else if (this.props.modalVisible !== nextProps.modalVisible) LayoutAnimation.configureNext(CustomLayoutLinear)
  }

  render() {
    const { remotes, theme } = this.props
    if (!remotes || !remotes.list || !remotes.list.length) return <LoadingScreen />
    const { REMOTE_BACKGROUND_COLOR } = themes[theme]

    return (
      <View style={[styles.container, { backgroundColor: REMOTE_BACKGROUND_COLOR }]}>
        {createTabNavigator(remotes, Remote, theme)}
      </View>
    )

  }
}

const mapStateToProps = state => ({
  dragging: state.app.dragging,
  theme: state.settings.theme,
  remotes: state.remotes,
  editing: state.app.editing,
  capturing: state.app.capturing,
  capturingButtonId: state.app.capturingButtonId,
  currentRemoteId: state.app.currentRemoteId,
  modalVisible: state.app.modalVisible,
  rehydrated: state.app.rehydrated,
})

const mapDispatchToProps = dispatch => ({
  createRemote: () => dispatch(createRemote()),
  createButtonPanel: (type, remoteId) => dispatch(createButtonPanel(type, remoteId)),
  setBaseUrl: url => dispatch(setBaseUrl(url)),
  setEditMode: editing => dispatch(setEditMode(editing)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RemoteContainer)

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  }
})
