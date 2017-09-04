import React, { Component, PropTypes } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'

import themes from '../constants/themes'

class LoadingScreen extends Component {

  static contextTypes = {
    theme: PropTypes.string,
  }

  render() {
    const { REMOTE_BACKGROUND_COLOR, BUTTON_BACKGROUND_COLOR } = themes[this.context.theme]
    return (
      <View style={[styles.container, { backgroundColor: REMOTE_BACKGROUND_COLOR }]}>
        <ActivityIndicator color={BUTTON_BACKGROUND_COLOR} size="large" />
      </View>
    )
  }
}

export default LoadingScreen

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
