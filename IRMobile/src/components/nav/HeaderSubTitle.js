import React, { Component } from 'react'
import { Text, View } from 'react-native'
import PropTypes from 'prop-types'

class HeaderSubTitle extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
  }

  render() {
    return (
      <View><Text>{this.props.text}</Text></View>
    )
  }
}

export default HeaderSubTitle
