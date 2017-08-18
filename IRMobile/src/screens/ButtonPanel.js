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

  record = async () => {
    const { baseUrl } = this.props
    try {
      const response = await fetch(`${baseUrl}/rec`)
      console.log(response)
      const json = await response.json()
      console.log('JSON', json.message)
      if (response.ok) {
        console.log('RESPONSE OK')
        const pollInterval = setInterval(async () => {
          try {
            console.log('CHecking...')
            const response = await fetch(`${baseUrl}/check`)
            const json = await response.json()
            if (json && json.value) {
              this.props.createButton(json)
              clearInterval(pollInterval)
            }
          } catch (err) {
            console.log('# check ir code error', err)
          }
        }, 1000)
      }
    } catch (err) {
      console.log('#record err', err)
    }
  }

  render() {
    console.log('PROPS', this.props)

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
  buttons: state.buttons,
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
