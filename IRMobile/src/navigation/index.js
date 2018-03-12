import React from 'react'
import { StackNavigator, TabNavigator } from 'react-navigation'
import { connect } from 'react-redux'

import TabBar from '../components/nav/TabBar'
import { setCurrentRemoteId, setModalVisible, setHeaderModal, setEditMode, setCaptureMode } from '../actions'
import themes from '../constants/themes'

import RemoteContainer from '../components/RemoteContainer'

const Navigator = StackNavigator({
  Remote: { screen: RemoteContainer },
  }, {
  initialRouteName: 'Remote',
  headerMode: 'float',
})

export const createTabNavigator = (remotes, Screen, initialRouteName) => {
  const keys = remotes.list
  const routeConfig = {}
  keys.forEach(key => {
    routeConfig[key] = {
      screen: Screen,
      // Providing navigationOptions seems to mess with setting them dynamically
      // navigationOptions: { title: remotes[key].title }
    }
  })

  const navigatorConfig = {
    initialRouteName: initialRouteName || keys[keys.length-1],
    swipeEnabled: true,
    animationEnabled: true,
    order: keys,
    tabBarComponent: TabBar,
    tabBarPosition: 'bottom',
    lazy: false,
  }

  const onNavigationStateChange = function(prevState, newState){
    const routeHasChanged = prevState.index !== newState.index
    if (routeHasChanged) {
      this.setCurrentRemoteId && this.setCurrentRemoteId(newState.routes[newState.index].routeName)
      this.setHeaderModal && this.setHeaderModal(null)
      // this.setEditMode && this.setEditMode(false)
      // this.setCaptureMode && this.setCaptureMode(false)
    }
    if (!this.currentRemoteId) this.setCurrentRemoteId(newState.routes[newState.index].routeName)
  }

  const mapDispatchToProps = function(dispatch){
    return {
      setCurrentRemoteId: remoteId => dispatch(setCurrentRemoteId(remoteId)),
      setHeaderModal: modal => dispatch(setHeaderModal(modal)),
      setEditMode: editing => dispatch(setEditMode(editing)),
      setCaptureMode: capturing => dispatch(setCaptureMode(capturing))
    }
  }

  const Navigator = connect(state => ({ currentRemoteId: state.app.currentRemoteId }), mapDispatchToProps)(TabNavigator(routeConfig, navigatorConfig))
  return <Navigator onNavigationStateChange={onNavigationStateChange} />

}

export default Navigator
