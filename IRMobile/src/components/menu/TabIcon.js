import React, { Component, PropTypes } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import themes from '../../constants/themes'

class TabIcon extends Component {
  render() {
    const { id, currentRemoteId, remote, theme } = this.props
    if (!remote) return null
    const { TAB_LABEL_COLOR_ACTIVE, TAB_LABEL_COLOR_INACTIVE } = themes[theme]
    const color = id === currentRemoteId ? TAB_LABEL_COLOR_ACTIVE : TAB_LABEL_COLOR_INACTIVE
    return (
      <View style={{flex: 1, padding: 5 }}>
        <Icon name={remote.icon} color={color} size={25} />
      </View>)
  }
}

const mapStateToProps = (state, ownProps) => ({
  theme: state.settings.theme,
  currentRemoteId: state.app.currentRemoteId,
  remote: state.remotes[ownProps.id],
})

export default connect(mapStateToProps)(TabIcon)
