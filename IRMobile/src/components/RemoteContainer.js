import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  AppState,
  View,
  UIManager,
  LayoutAnimation,
  StyleSheet,
  NetInfo,
} from 'react-native'

import { connect } from 'react-redux'

import { POWER } from '../constants/ui'

import Remote from './Remote'
import Header from './nav/Header'
import LoadingScreen from './LoadingScreen'
import themes from '../constants/themes'

import { createTabNavigator } from '../navigation'
import {
  createRemote,
  setEditMode,
  createButtonPanel,
  findDevicesOnNetwork,
  pingKnownDevices,
  setIsForeground,
  setIsConnected,
  setConnectionType,
} from '../actions'
import { isAndroid } from '../utils'
import { CustomLayoutLinear, CustomLayoutSpring } from '../dictionaries/animations'

class RemoteContainer extends Component {

  static navigationOptions = {
      header: <Header />,
    }

  static propTypes = {
    isForeground: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired,
    connectionType: PropTypes.string.isRequired,
    setIsForeground: PropTypes.func.isRequired,
    setIsConnected: PropTypes.func.isRequired,
    setConnectionType: PropTypes.func.isRequired,
    capturing: PropTypes.bool.isRequired,
    capturingButtonId: PropTypes.string,
    createButtonPanel: PropTypes.func.isRequired,
    createRemote: PropTypes.func.isRequired,
    currentRemoteId: PropTypes.string,
    editing: PropTypes.bool.isRequired,
    findDevicesOnNetwork: PropTypes.func.isRequired,
    pingKnownDevices: PropTypes.func.isRequired,
    modalVisible: PropTypes.string,
    navigation: PropTypes.object.isRequired,
    remotes: PropTypes.object.isRequired,
    setEditMode: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
  }

  static defaultProps = {
    capturingButtonId: null,
    currentRemoteId: null,
    modalVisible: null,
  }

  state = {
    inProgress: false
  }

  shouldComponentUpdate(nextProps) {
    // Only update the container when a remote has been added or deleted
    return nextProps.remotes.list.length !== this.props.remotes.list.length
  }

  componentDidMount() {
    if (isAndroid) UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    this.checkLighthouseStatus()
    if (!this.props.remotes.list.length) {
      // First time in, create a remote
      const newRemote = this.props.createRemote()
      const { remoteId } = newRemote.payload
      this.props.createButtonPanel(POWER, remoteId)
      this.props.setEditMode(true)
    }
    AppState.addEventListener('change', appState => {
      this.props.setIsForeground(appState === "active")
    })

    NetInfo.addEventListener('connectionChange', ({type}) => this.props.setConnectionType(type))
    NetInfo.getConnectionInfo().done(({type}) => this.props.setConnectionType(type))


    NetInfo.isConnected.fetch().done((isConnected) => {
      this.props.setIsConnected(isConnected, { calledFromComponentDidMount: true })
    })
    NetInfo.isConnected.addEventListener('connectionChange', this.props.setIsConnected)

  }

  async checkLighthouseStatus() {
    this.setState({ inProgress: true })
    const deviceUrls = await this.props.pingKnownDevices()
    if (!deviceUrls.length) this.props.findDevicesOnNetwork()
    this.setState({ inProgress: false })

  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { navigation } = this.props
    const { setParams } = navigation

    const returningFromBackground = !this.props.isForeground && nextProps.isForeground
    const connectionStatusChanged = this.props.isConnected !== nextProps.isConnected
    const connectionTypeChanged = this.props.connectionType !== nextProps.connectionType

    if (returningFromBackground || connectionStatusChanged || connectionTypeChanged) {
      if (!this.state.inProgress) this.checkLighthouseStatus()
    }

    if(!navigation.state.params || !navigation.state.params.theme || this.props.theme !== nextProps.theme) {
      setParams({ theme: nextProps.theme })
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
    const { remotes, theme, currentRemoteId } = this.props
    if (!remotes || !remotes.list || !remotes.list.length) return <LoadingScreen />
    const { REMOTE_BACKGROUND_COLOR } = themes[theme]
    const initialRouteName = remotes.list.includes(currentRemoteId) ? currentRemoteId : remotes.list[remotes.list.length - 1]
    return (
      <View style={[styles.container, { backgroundColor: REMOTE_BACKGROUND_COLOR }]}>
        {createTabNavigator(remotes, Remote, initialRouteName)}
      </View>
    )

  }
}

const mapStateToProps = state => ({
  dragging: state.app.dragging,
  isForeground: state.app.isForeground,
  isConnected: state.network.isConnected,
  connectionType: state.network.connectionType,
  theme: state.settings.theme,
  remotes: state.remotes,
  editing: state.app.editing,
  capturing: state.app.capturing,
  capturingButtonId: state.app.capturingButtonId,
  currentRemoteId: state.app.currentRemoteId,
  modalVisible: state.app.modalVisible,
})

const mapDispatchToProps = dispatch => ({
  createRemote: () => dispatch(createRemote()),
  createButtonPanel: (type, remoteId) => dispatch(createButtonPanel(type, remoteId)),
  findDevicesOnNetwork: () => dispatch(findDevicesOnNetwork()),
  pingKnownDevices: () => dispatch(pingKnownDevices()),
  setEditMode: editing => dispatch(setEditMode(editing)),
  setIsForeground: isForeground => dispatch(setIsForeground(isForeground)),
  setIsConnected: isConnected => dispatch(setIsConnected(isConnected)),
  setConnectionType: connectionType => dispatch(setConnectionType(connectionType))
})

export default connect(mapStateToProps, mapDispatchToProps)(RemoteContainer)

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  }
})
