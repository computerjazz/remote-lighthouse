import React, { Component, PropTypes } from 'react'
import {
  View,
  UIManager,
  LayoutAnimation,
  StyleSheet,
} from 'react-native'

import { connect } from 'react-redux'
import Remote from './Remote'
import Header from './menu/Header'
import LoadingScreen from './LoadingScreen'
import { createTabNavigator } from '../navigation'
import { createRemote, setBaseUrl, setEditMode } from '../actions'
import { isAndroid } from '../utils'
import { CustomLayoutLinear, CustomLayoutSpring } from '../dictionaries/animations'

import { REMOTE_BACKGROUND_COLOR } from '../constants/colors'

class RemoteContainer extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
        header: <Header />,
      }
    }

  static propTypes = {
    remotes: PropTypes.object.isRequired,
    createRemote: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    setEditMode: PropTypes.func.isRequired,
    setBaseUrl: PropTypes.func.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    // Only update the container when a remote has been added or deleted
    const shouldUpdate = nextProps.remotes.list.length !== this.props.remotes.list.length
    return shouldUpdate

  }

  componentWillMount() {
    this.props.setBaseUrl('http://192.168.86.125')
    if (isAndroid) UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentWillReceiveProps(nextProps) {
    const { setParams } = this.props.navigation

    if (!this.props.rehydrated && nextProps.rehydrated) {
      if (!nextProps.remotes.list.length) {
        // First time in, create a remote
        this.props.createRemote()
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
    const { remotes } = this.props
    if (!remotes || !remotes.list || !remotes.list.length) return <LoadingScreen />

    return (
      <View style={styles.container}>
        {createTabNavigator(remotes.list, Remote)}
      </View>
    )

  }
}

const mapStateToProps = state => ({
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
  setBaseUrl: url => dispatch(setBaseUrl(url)),
  setEditMode: editing => dispatch(setEditMode(editing)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RemoteContainer)

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: REMOTE_BACKGROUND_COLOR,
  }
})
