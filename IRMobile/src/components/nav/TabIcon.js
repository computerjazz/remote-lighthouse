import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dimensions, View, Platform, StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import themes from '../../constants/themes'
const { height } = Dimensions.get('window')
const iconSize = height < 600 ? 30 : 40


class TabIcon extends Component {
  render() {
    const { id, currentRemoteId, hasTitle, remote, theme } = this.props
    if (!remote) return null
    const { TAB_LABEL_COLOR_ACTIVE, TAB_LABEL_COLOR_INACTIVE } = themes[theme]
    console.log('TABION', this.props)
    const color = id === currentRemoteId ? TAB_LABEL_COLOR_ACTIVE : TAB_LABEL_COLOR_INACTIVE
    return (
      <View style={[Platform.OS === 'ios' && { marginTop: 5, height: iconSize, width: iconSize }]}>
        <Icon name={remote.icon} color={color} size={hasTitle ? 23 : 30} />
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
