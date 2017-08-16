import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
}  from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from 'react-redux'
import { createButton } from '../actions'


const codes = {
  power: '8166817E',
  tempUp: '8166A15E',
  tempDown: '816651AE',
}

class Button extends Component {

  async sendCode(code) {
    const { baseUrl } = this.props
    console.log('FETCHING!')
    this.props.createButton({code: 123, type: 'NEC', length: 32})
    try {
      console.log('PROPS', this.props)
      const response = await fetch(`${baseUrl}/test?name=dan`)
      const data = await response.text()
      console.log(data)
      const string = `${baseUrl}/send?type=NEC&val=${code}&len=32`
      console.log('fetching' + string)
      const res = await fetch(string)
      const txt = await res.text()
      console.log(txt)

    } catch (err) {
      console.log('#error', err)
    }
  }

  render() {
    const { irCode, style, text, iconName, onPress, color } = this.props
    console.log('PROPS', this.props)
    return (
      <TouchableOpacity
        onPress={() => onPress ? onPress() : this.sendCode(irCode)}
        style={[styles.button, style]}
      >
        <Icon name={iconName} size={30} color={color || "#fff"} />
        {text && <Text style={styles.text}>
          {text}
        </Text>}
      </TouchableOpacity>
    )
  }
}

export default connect(state => ({
  baseUrl: state.network.baseUrl,
  buttons: state.buttons,
}), dispatch => ({
  createButton: (button) => dispatch(createButton(button)),
}))(Button)

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
    height: 75,
    padding: 15,
    margin: 15,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'transparent',
  },
  text: {
    color: '#ddd',
    fontWeight: 'bold',
    fontSize: 20,
  }
})
