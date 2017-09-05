import React, { Component, PropTypes } from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'

import { connect } from 'react-redux'

import { updateRemote } from '../../actions'

import HeaderTitle from './HeaderTitle'
import HeaderMenuButton from './HeaderMenuButton'

import themes from '../../constants/themes'

import { STATUS_BAR_HEIGHT } from '../../constants/dimensions'

class Header extends Component {

  static propTypes = {
      remote: PropTypes.object,
      theme: PropTypes.string,
  }

  state = {
    title: '',
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.remote && nextProps.remote && this.props.remote.title !== nextProps.remote.title) {
      this.setState({ title: nextProps.remote.title })
    }
  }

  onTitleUpdate = () => {
    if (this.props.remote && this.props.remote.title !== this.state.title) {
      const newRemote = {
        ...this.props.remote,
        title: this.state.title,
      }
      this.props.updateRemote(this.props.currentRemoteId, newRemote)
    }
  }

  onChangeText = text => {
    this.setState({ title: text }, this.onTitleUpdate)

  }

  render() {
    const { remote, headerStyle, titleStyle, editing, capturing, recording, modalVisible, rehydrated } = this.props

    const {
      HEADER_TITLE_COLOR,
      HEADER_TITLE_EDITING_COLOR ,
      HEADER_BACKGROUND_COLOR,
      HEADER_BACKGROUND_EDITING_COLOR,
    } = themes[this.props.theme]

    const headerBackgroundColor = editing ? HEADER_BACKGROUND_EDITING_COLOR : HEADER_BACKGROUND_COLOR
    const headerTitleColor = editing ? HEADER_TITLE_EDITING_COLOR : HEADER_TITLE_COLOR
    const remoteTitle = remote && remote.title || ' '
    const headerTitle = capturing ? recording ? 'Listening...' : 'Ready to capture' : remoteTitle
    return (
      <View style={[styles.container, { backgroundColor: headerBackgroundColor }, headerStyle]}>
        {!modalVisible && rehydrated &&  <View style={styles.inner}>
            <HeaderMenuButton left />
            <HeaderTitle
              style={[{ color: headerTitleColor }, titleStyle]}
              title={this.state.title}
              onChangeText={this.onChangeText}
              onBlur={this.onTitleUpdate}
            />
            <HeaderMenuButton right onPressDone={this.onTitleUpdate} />
          </View>
        }

      </View>
    )
  }
}

const mapStateToProps = state => ({
  theme: state.settings.theme,
  currentRemoteId: state.app.currentRemoteId,
  remote: state.remotes[state.app.currentRemoteId],
  editing: state.app.editing,
  capturing: state.app.capturing,
  recording: state.app.capturingButtonId !== null,
  modalVisible: state.app.modalVisible,
  rehydrated: state.app.rehydrated,
})

const mapDispatchToProps = dispatch => ({
  updateRemote: (remoteId, updatedRemote) => dispatch(updateRemote(remoteId, updatedRemote)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)

const styles = StyleSheet.create({
  container: {
    paddingTop: STATUS_BAR_HEIGHT,
    height: 75,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
})
