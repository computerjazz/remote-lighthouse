import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { TAB_LABEL_COLOR_ACTIVE, TAB_LABEL_COLOR_INACTIVE } from '../../constants/colors'

class TabIcon extends Component {
  render() {
    const { id, currentRemoteId, remote } = this.props
    const color = id === currentRemoteId ? TAB_LABEL_COLOR_ACTIVE : TAB_LABEL_COLOR_INACTIVE
    return <Icon name={remote.icon} color={color} size={30} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  currentRemoteId: state.app.currentRemoteId,
  remote: state.remotes[ownProps.id],
})

export default connect(mapStateToProps)(TabIcon)
