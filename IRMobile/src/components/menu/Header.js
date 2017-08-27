import React, { Component, PropTypes } from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'

import { connect } from 'react-redux'

import { updateRemote } from '../../actions'

import HeaderTitle from './HeaderTitle'
import HeaderMenuButton from './HeaderMenuButton'

class Header extends Component {

  state = {
    title: '',
  }

  componentDidMount() {
    console.log('PROPS!!', {...this.props})
    this.setState({ title: this.props.remote && this.props.remote.title })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.remote && nextProps.remote) this.setState({ title: nextProps.remote.title })
  }

  onPressDone = () => {
    if (this.props.remote && this.props.remote.title !== this.state.title) {
      const newRemote = {
        ...this.props.remote,
        title: this.state.title,
      }
      this.props.updateRemote(this.props.currentRemoteId, newRemote)
    }
  }

  render() {
    console.log('EHADER PRPS', this.props)
    const { remote, headerStyle, titleStyle } = this.props
    return (
      <View style={[styles.container, headerStyle]}>
        <HeaderTitle style={titleStyle} title={this.state.title} onChangeText={text => this.setState({ title: text })} />
        <HeaderMenuButton onPressDone={this.onPressDone} />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  currentRemoteId: state.app.currentRemoteId,
  remote: state.remotes[state.app.currentRemoteId]
})

const mapDispatchToProps = dispatch => ({
  updateRemote: (remoteId, updatedRemote) => dispatch(updateRemote(remoteId, updatedRemote)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  }
})
