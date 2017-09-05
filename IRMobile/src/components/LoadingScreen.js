import React, { Component, PropTypes } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import themes from '../constants/themes'

class LoadingScreen extends Component {

  render() {
    const { REMOTE_BACKGROUND_COLOR, BUTTON_BACKGROUND_COLOR } = themes[this.props.theme]
    return (
      <View style={[styles.container, { backgroundColor: REMOTE_BACKGROUND_COLOR }]}>
        <ActivityIndicator color={BUTTON_BACKGROUND_COLOR} size="large" />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  theme: state.settings.theme,
})

export default connect(mapStateToProps)(LoadingScreen)

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
