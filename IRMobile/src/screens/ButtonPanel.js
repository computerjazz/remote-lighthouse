import React, { Component } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'

import Button from '../components/Button'

class ButtonPanel extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Remote Control',
    headerStyle: {
      backgroundColor: '#534bae',
    },
    headerTitleStyle: {
      color: 'white'
    }
  })

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
            style={styles.upDownButton} />
        </View>
      </View>
    )
  }
}

export default ButtonPanel

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
