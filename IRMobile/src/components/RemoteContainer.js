import React, { Component, PropTypes } from 'react'
import {
  View,
  UIManager,
} from 'react-native'

import { TabNavigator } from 'react-navigation'

import { connect } from 'react-redux'
import Remote from './Remote'
import HeaderMenuButton from './menu/HeaderMenuButton'
import { createRemote } from '../actions'
import { isAndroid } from '../utils'

import {
  HEADER_TITLE_COLOR,
  HEADER_TITLE_EDITING_COLOR,
  HEADER_BACKGROUND_EDITING_COLOR,
  HEADER_BACKGROUND_COLOR,
} from '../constants/colors'

import { STATUS_BAR_HEIGHT } from '../constants/dimensions'

const Tabs = ({screen1, screen2, screen3}) => {
  const Navigator = TabNavigator({
      tab1: { screen: screen1 },
      tab2: { screen: screen2 },
      tab3: { screen: screen3 }
  })
  return <Navigator />
}


class RemoteContainer extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    const menuVisible = params && params.menuVisible
    const editing = params && params.editing
    const recording = params && params.recording
    const modalVisible = params && params.modalVisible
    const remoteTitle = params && params.title


    const title = editing ? recording ? 'Listening...' : 'Ready to capture' : remoteTitle
    return {
        title,
        headerStyle: {
          backgroundColor: editing ? HEADER_BACKGROUND_EDITING_COLOR : HEADER_BACKGROUND_COLOR,
          paddingTop: STATUS_BAR_HEIGHT,
          height: 75,
        },
        headerTitleStyle: {
          color: editing ? HEADER_TITLE_EDITING_COLOR : HEADER_TITLE_COLOR,
        },
        headerRight: !modalVisible && <HeaderMenuButton
          menuVisible={menuVisible}
          setParams={navigation.setParams}
        />,
      }
    }

  componentWillMount() {
      if (this.props.remotes && !this.props.remotes.length) this.props.createRemote()
      if (isAndroid) UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.editing !== this.props.editing) this.props.navigation.setParams({ editing: nextProps.editing })
  }

  createTabNavigator = (remotes) => {
    const routeConfig = { }
    remotes.list.forEach(remoteId => {
      routeConfig[remoteId] = { screen: Remote, params: { id: remoteId } }
    })
    const navigatorConfig = {
      swipeEnabled: true,
      animationEnabled: true,
      order: this.props.remotes.list
    }
    const Navigator = TabNavigator(routeConfig, navigatorConfig)
    return <Navigator />
  }

  render() {
    const { remotes } = this.props
    if (!remotes || !remotes.list || !remotes.list.length) return <View />
    //if (remotes.list.length === 1) return <Remote navigation={this.props.navigation} id={remotes.list[0]} />

    return this.createTabNavigator(remotes)
  }
}

const mapStateToProps = state => ({
  remotes: state.remotes,
  editing: state.app.editing,
})

const mapDispatchToProps = dispatch => ({
  createRemote: () => dispatch(createRemote()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RemoteContainer)
