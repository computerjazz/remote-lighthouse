import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'

import { createButton } from '../actions'
import Button from '../components/Button'

class ButtonPanel extends Component {

  static PropTypes = {
    navigation: PropTypes.object,
    createButton: PropTypes.func,
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Remote Control',
    headerStyle: {
      backgroundColor: '#534bae',
    },
    headerTitleStyle: {
      color: 'white'
    }
  })

  parseResponse = res => {
    if(res && res.length > 10) {
      console.log('GOT A CODE!', res)
      const parts = res.split('::')
      let code = parts[parts.length - 1].split('&')
      console.log(code)
      let button = {
        value: code[2],
        length: code[1],
        type: code[0],
      }
      this.props.createButton(button)
      return button
    }
  }

  record = async () => {
    const { baseUrl } = this.props
    try {
      const response = await fetch(`${baseUrl}/rec`)
      console.log(response)
      if (response.ok) {
        console.log('RESPONSE OK')
        const pollInterval = setInterval(async () => {
          try {
            console.log('CHecking...')
            const response = await fetch(`${baseUrl}/check`)
            const text = await response.text()
            const irCode = this.parseResponse(text)
            if (irCode) clearInterval(pollInterval)
          } catch (err) {
            console.log('# check ir code error', err)
          }
        }, 1000)
      }
      const txt = await response.text()
      console.log(txt)
    } catch (err) {
      console.log('#record err', err)
    }
  }

  render() {
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
          onPress={this.record}
          color="#c0392b"
        />
      </View>
    )
  }
}

export default connect(state => ({
  baseUrl: state.network.baseUrl,
  }), dispatch => ({
  createButton: button => dispatch(createButton(button))
}))(ButtonPanel)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18227c'
  },
  upDownContainer: {
    flexDirection: 'row',
  },
  upDownButton: {
    width: '40%'
  }
})
