import React, { Component } from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { setBaseUrl } from '../actions'

import { PRIMARY_DARK } from '../constants/colors'

import ButtonPanel from '../components/ButtonPanel'

class Remote extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Remote Control',
    headerStyle: {
      backgroundColor: '#534bae',
    },
    headerTitleStyle: {
      color: 'white'
    }
  })

  componentWillMount() {
    this.props.setBaseUrl('http://192.168.86.99')
  }

  render() {
    console.log('REMOTE PROPS', this.props)
    return (
      <View style={styles.container}>
        <ButtonPanel />
      </View>
    )
  }
}

export default connect(null, dispatch => ({
  setBaseUrl: url => dispatch(setBaseUrl(url))
}))(Remote)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_DARK,
  },
})
