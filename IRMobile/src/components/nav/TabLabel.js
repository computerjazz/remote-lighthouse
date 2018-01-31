import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import {
  Text,
  StyleSheet,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import themes from '../../constants/themes'

class TabLabel extends Component {
  render() {
    const { title = ' ', theme, focused, remote } = this.props
    const {
      TAB_LABEL_COLOR_ACTIVE,
      TAB_LABEL_COLOR_INACTIVE,
    } = themes[theme]

    return (
      <View style={[styles.container]}>
        <Text style={[styles.text, { color: focused ? TAB_LABEL_COLOR_ACTIVE : TAB_LABEL_COLOR_INACTIVE }]}>{remote.title}</Text>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  theme: state.settings.theme,
  remote: state.remotes[ownProps.id]
})

export default connect(mapStateToProps)(TabLabel)

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
    padding: 3,
  },
  text: {
    fontSize: 10,
  }
})
