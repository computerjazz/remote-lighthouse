import React, { Component } from 'react'
import { connect } from 'react-redux'
import { POWER } from '../constants/ui'

import CircleButton from './CircleButton'

import {
  createButtonPanel,
  setEditMode,
  createRemote,
} from '../actions'


class NoRemotes extends Component {

  addRemote = () => {
    const newRemote = this.props.createRemote()
    const { remoteId } = newRemote.payload
    this.props.createButtonPanel(POWER, remoteId)
    this.props.setEditMode(true)
  }
  render() {
    const { numRemotes } = this.props
    return numRemotes ? null : <CircleButton icon="plus" onPress={this.addRemote} />
  }
}

const mapStateToProps = state => ({
  numRemotes: state.remotes.list.length,
})

const mapDispatchToProps = dispatch => ({
  createRemote: () => dispatch(createRemote()),
  setEditMode: editing => dispatch(setEditMode(editing)),
  createButtonPanel: (type, remoteId) => dispatch(createButtonPanel(type, remoteId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoRemotes)