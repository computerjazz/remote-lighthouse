import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dimensions, View, Platform, StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import themes from '../../constants/themes'
const { height } = Dimensions.get('window')


class TabIcon extends Component {
  render() {
    const { id, currentRemoteId, hasTitle, remote, theme } = this.props
    if (!remote) return null
    const { TAB_LABEL_COLOR_ACTIVE, TAB_LABEL_COLOR_INACTIVE } = themes[theme]
    const color = id === currentRemoteId ? TAB_LABEL_COLOR_ACTIVE : TAB_LABEL_COLOR_INACTIVE
    const iconSize = hasTitle ? 23 : 35
    const iconContainerSize = height < 600 ? 35 : 40

    return (
      <View style={[
        { flex: 1 },
        Platform.OS === 'ios' && {
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 5,
          height: iconContainerSize,
          width: iconContainerSize
        }]}
      >
        <Icon name={remote.icon} color={color} size={iconSize} />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  theme: state.settings.theme,
  currentRemoteId: state.app.currentRemoteId,
  remote: state.remotes[ownProps.id],
})

export default connect(mapStateToProps)(TabIcon)
