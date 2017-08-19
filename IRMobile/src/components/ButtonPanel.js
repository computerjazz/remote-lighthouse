import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'

import { captureIRCode, createButton } from '../actions'
import Button from './Button'

class ButtonPanel extends Component {

  static PropTypes = {
    navigation: PropTypes.object,
    createButton: PropTypes.func,
  }


  render() {
    console.log('PANEL PROPS', this.props)

    return (
      <View style={styles.container}>
        <Button
          irCode="8166817E"
          iconName="power"
        />
        <View style={styles.upDownContainer}>
          <Button
            irCode="8166A15E"
            style={styles.upDownButton}
            iconName="arrow-up"
          />
          <Button
            irCode="816651AE"
            iconName="arrow-down"
            style={styles.upDownButton}
          />
        </View>
        <Button
          iconName="adjust"
          style={{width: 75}}
          onPress={this.props.captureIRCode}
          color="#c0392b"
        />
      </View>
    )
  }
}

export default connect(state => ({
  buttons: state.buttons,
  baseUrl: state.network.baseUrl
  }), dispatch => ({
  createButton: button => dispatch(createButton(button)),
  captureIRCode: () => dispatch(captureIRCode())
}))(ButtonPanel)

const styles = StyleSheet.create({

  upDownContainer: {
    flexDirection: 'row',
  },
  upDownButton: {
    width: '40%'
  }
})
