import React, { Component, PropTypes } from 'react'
import {
  Animated,
  Text,
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'

import themes from '../../constants/themes'

class TabLabel extends Component {
  render() {
    const { title, theme, focused } = this.props
    const {
      TAB_LABEL_COLOR_ACTIVE,
      TAB_LABEL_COLOR_INACTIVE,
    } = themes[theme]

    return (
      <Animated.View style={[styles.container]}>
        <Text style={[styles.text, { color: focused ? TAB_LABEL_COLOR_ACTIVE : TAB_LABEL_COLOR_INACTIVE }]}>{title}</Text>
      </Animated.View>
    )
  }
}

const mapStateToProps = state => ({
  theme: state.settings.theme,
})

export default connect(mapStateToProps)(TabLabel)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 10,
  }
})
