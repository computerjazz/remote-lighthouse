import React, { Component, PropTypes } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { TAB_LABEL_COLOR_ACTIVE, TAB_LABEL_COLOR_INACTIVE } from '../../constants/colors'

class TabIcon extends Component {
  render() {
    const { id, currentRemoteId, remote } = this.props
    if (!remote) return null
    const color = id === currentRemoteId ? TAB_LABEL_COLOR_ACTIVE : TAB_LABEL_COLOR_INACTIVE
    return (<View style={{flex: 1, padding: 5}}><Icon name={remote.icon} color={color} size={25} /></View>)
  }
}

const mapStateToProps = (state, ownProps) => ({
  currentRemoteId: state.app.currentRemoteId,
  remote: state.remotes[ownProps.id],
})

export default connect(mapStateToProps)(TabIcon)
