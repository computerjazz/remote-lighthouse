import React, {Component} from 'react'
import { LayoutAnimation, UIManager  } from 'react-native'
import { StackNavigator, TabNavigator, addNavigationHelpers, NavigationActions} from 'react-navigation'
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'
import { connect } from 'react-redux'

import { POWER } from '../constants/ui'

import Header from '../components/nav/Header'
import TabBar from '../components/nav/TabBar'
import LoadingScreen from '../components/LoadingScreen'
import RemoteContainer from '../components/RemoteContainer'
import Remote from '../components/Remote'

import {
  createRemote,
  setEditMode,
  createButtonPanel,
  findDevicesOnNetwork,
  pingKnownDevices
} from '../actions'
import { isAndroid } from '../utils'
import { CustomLayoutLinear, CustomLayoutSpring } from '../dictionaries/animations'

let RootNav
export function getNavigator() {
  return RootNav
}

class Navigator extends Component {

  state = {

  }

  componentWillMount() {
    if (isAndroid) UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
  }

  componentDidMount() {
    const { dispatch, remotes, createRemote, createButtonPanel, setEditMode } = this.props
    if (!remotes.list.length) {
      // First time in, create a remote
      const newRemote = createRemote()
      const { remoteId } = newRemote.payload

      createButtonPanel(POWER, remoteId)
      setEditMode(true)
    } else this.createNavigator(remotes.list)
  }

  componentWillReceiveProps(nextProps) {
    const { navigation, remotes, dispatch } = this.props
    // const { setParams } = navigation
    //
    // if(!navigation.state.params || !navigation.state.params.theme || this.props.theme !== nextProps.theme) {
    //   // setParams({ theme: nextProps.theme })
    // }

    const thisRemote = this.props.remotes[this.props.currentRemoteId]
    const nextRemote = nextProps.remotes[nextProps.currentRemoteId]

    if (nextProps.editing !== this.props.editing) {
      LayoutAnimation.configureNext(CustomLayoutSpring)
      // setParams({ editing: nextProps.editing })
    }
    // if (nextProps.capturing !== this.props.capturing) setParams({ capturing: nextProps.capturing })
    // if (nextProps.capturingButtonId !== this.props.capturingButtonId) setParams({ recording: !!nextProps.capturingButtonId })
    if (thisRemote && nextRemote && this.props.currentRemoteId === nextProps.currentRemoteId && nextRemote.panels.length !== thisRemote.panels.length) {
      // Button panels were added/deleted
      if (nextRemote.panels.length > thisRemote.panels.length) LayoutAnimation.configureNext(CustomLayoutLinear)
      else LayoutAnimation.configureNext(CustomLayoutSpring)
    } else if (this.props.modalVisible !== nextProps.modalVisible) LayoutAnimation.configureNext(CustomLayoutLinear)
    if (this.props.remotes.list.length !== nextProps.remotes.list.length) {
      this.createNavigator(nextProps.remotes.list)
    }
  }

  createNavigator = remoteList => {
    const keys = remoteList
    const routeConfig = {}
    keys.forEach(key => {
      routeConfig[key] = {
        screen: Remote,
      }
    })

    const navigatorConfig = {
      initialRouteName: keys[keys.length-1],
      swipeEnabled: true,
      animationEnabled: true,
      order: keys,
      tabBarComponent: TabBar,
      tabBarPosition: 'bottom',
    }

    const TabNav = TabNavigator(routeConfig, navigatorConfig)
    const Nav = StackNavigator({
      Remote: { screen: TabNav },
    }, {
      initialRouteName: 'Remote',
      headerMode: 'float',
    })

    const initialState = Nav.router.getStateForAction(NavigationActions.init())
    this.props.dispatch({ type: 'SET_NAVIGATOR', payload: Nav})
    this.props.dispatch(NavigationActions.init())
    const middleware = createReactNavigationReduxMiddleware(
      "root",
      state => {
        return state.nav
      },
    )
    const addListener = createReduxBoundAddListener("root")
    this.setState({ RootNav: Nav, addListener, initialState })
  }


  async checkLighthouseStatus() {
    const deviceUrls = await this.props.pingKnownDevices()
    if (!deviceUrls.length) this.props.findDevicesOnNetwork()
  }

  render() {
    console.log('NEW NAV', this.props)
    if (!this.state.RootNav) return null
    return (
      <this.state.RootNav
        // navigation={addNavigationHelpers({
        //   state: this.props.nav || this.state.initialState,
        //   dispatch: this.props.dispatch,
        //   addListener: this.state.addListener,
        // })}
      />
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
  findDevicesOnNetwork: () => dispatch(findDevicesOnNetwork()),
  pingKnownDevices: () => dispatch(pingKnownDevices()),
  setEditMode: editing => dispatch(setEditMode(editing)),
  setCurrentRemoteId: id => dispatch(setCurrentRemoteId(id)),
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigator)
