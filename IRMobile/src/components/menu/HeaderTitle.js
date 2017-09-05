import React, { Component, PropTypes } from 'react'
import {
  Text,
  TextInput,
  View,
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'

import themes from '../../constants/themes'
import { BUTTON_RADIUS } from '../../constants/dimensions'

class HeaderTitleButton extends Component {

  static propTypes = {
    title: PropTypes.string,
  }

  renderTitleAsInput() {
    return (
      <TextInput
        autoCorrect={false}
        style={styles.textInput}
        value={this.props.title}
        onBlur={this.props.onBlur}
        onChangeText={this.props.onChangeText}
      />
    )
  }

  renderTitleAsText() {
    const { title, style } = this.props
    return (
      <Text
        style={[styles.text, style]}
        numberOfLines={1}
      >
        {title}
      </Text>
    )
  }


  render() {
    const { editing, theme } = this.props
    const { HEADER_TITLE_BACKGROUND_EDITING } = themes[theme]
    return (
      <View style={[styles.container, editing && [styles.editing, { backgroundColor: HEADER_TITLE_BACKGROUND_EDITING }]]}>
        <View style={[styles.inner, !editing && styles.center]}>
        {editing ? this.renderTitleAsInput() : this.renderTitleAsText()}
      </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  theme: state.settings.theme,
  editing: state.app.editing,
})

export default connect(mapStateToProps)(HeaderTitleButton)

const styles = StyleSheet.create({
  container: {
    flex: 3,
    justifyContent: 'center',
    height: 45
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },
  editing: {
    borderRadius: BUTTON_RADIUS,
    paddingHorizontal: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 40,
  }
})
