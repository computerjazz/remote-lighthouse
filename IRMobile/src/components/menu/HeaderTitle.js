import React, { Component, PropTypes } from 'react'
import {
  Text,
  TextInput,
  View,
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'

class HeaderTitleButton extends Component {

  static propTypes = {
    title: PropTypes.string,
  }

  renderTitleAsInput() {
    return (
      <TextInput value={this.props.title} onChangeText={this.props.onChangeText} />
    )
  }

  renderTitleAsText() {
    const { title, style } = this.props
    return <Text style={[styles.text, style]}>{title}</Text>
  }


  render() {
    const { editing } = this.props
    return (
      <View style={{ flex: 1 }}>
        {editing ? this.renderTitleAsInput() : this.renderTitleAsText()}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  editing: state.app.editing,
})

export default connect(mapStateToProps)(HeaderTitleButton)

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  }
})
