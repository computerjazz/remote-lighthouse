import React, { Component } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'

import { REMOTE_BACKGROUND_COLOR, BUTTON_BACKGROUND_COLOR } from '../constants/colors'

class LoadingScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
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
    backgroundColor: REMOTE_BACKGROUND_COLOR,
  }
})
