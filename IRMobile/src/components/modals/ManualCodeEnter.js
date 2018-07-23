import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { connect } from 'react-redux'

import TextButton from './../TextButton'
import { assignIRCode } from '../../actions'
import { isAndroid } from '../../utils'

import { BUTTON_RADIUS } from '../../constants/dimensions'
import themes from '../../constants/themes'

import { generateNEC, reverseNEC } from '../../utils/irCodeUtils'

class ManualCodeEnterModal extends Component {

  state = {
    device: '',
    subDevice: '',
    devFunction: '',
  }

  static propTypes = {
    button: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
    editButton: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    const { value } = props.button
    if (isAndroid) BackHandler.addEventListener('hardwareBackPress', this.captureAndroidBackPress)
    const { device, subDevice, devFunction } = reverseNEC(value)
    this.state = { device, subDevice, devFunction }
  }

  captureAndroidBackPress = () => {
    this.props.onSubmit()
    BackHandler.removeEventListener('hardwareBackPress', this.captureAndroidBackPress)
    return true
  }




  onOkPress = () => {
    const { button } = this.props
    const { device, subDevice, devFunction } = this.state
    const value = generateNEC(Number(device), Number(subDevice), Number(devFunction))
    const irCode = {
      value,
      length: 32,
      type: 'NEC',
    }
    this.props.assignIRCode(irCode)
    this.props.onSubmit()
  }

  render() {
    const { type, onSubmit } = this.props
    const { PRIMARY_DARK, MODAL_BACKGROUND_COLOR } = themes[this.props.theme]
    const { device, subDevice, devFunction } = this.state
    return (
      <View style={styles.wrapper}>
        <View style={[styles.container, { backgroundColor: MODAL_BACKGROUND_COLOR }]}>

          <ScrollView style={styles.scrollView}>
            <Text style={styles.title}>Manual Code Entry (NEC)</Text>

            <Text>Device</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={text => this.setState({ device: text })}
              value={device}
              autoCorrect={false}
              underlineColorAndroid={PRIMARY_DARK}
              placeholder="Device"
              keyboardType="numeric"
            />
            <Text>SubDevice</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={text => this.setState({ subDevice: text })}
              value={subDevice}
              autoCorrect={false}
              underlineColorAndroid={PRIMARY_DARK}
              placeholder="SubDevice"
              keyboardType="numeric"
            />
            <Text>Function</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={text => this.setState({ devFunction: text })}
              value={devFunction}
              autoCorrect={false}
              underlineColorAndroid={PRIMARY_DARK}
              placeholder="Function"
              keyboardType="numeric"
            />
          </ScrollView>

          <View style={styles.confirmButtonContainer}>
            <TextButton
              text="Cancel"
              buttonStyle={styles.confirmButton}
              onPress={onSubmit}
            />
            <TextButton
              text="Ok"
              buttonStyle={styles.confirmButton}
              onPress={this.onOkPress}
            />
          </View>
        </View>
      </View>
    )
  }
}

ManualCodeEnterModal.defaultProps = {
  onSubmit: () => { },
}

const mapStateToProps = (state, ownProps) => ({
  theme: state.settings.theme,
  button: state.buttons[ownProps.buttonId],
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  assignIRCode: irCode => dispatch(assignIRCode(ownProps.buttonId, irCode))
})

export default connect(mapStateToProps, mapDispatchToProps)(ManualCodeEnterModal)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderRadius: BUTTON_RADIUS,
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    padding: 10,
  },
  title: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    fontWeight: 'bold',
    borderBottomWidth: 0.5,
  },
  confirmButtonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    height: 60,
  },
  confirmButton: {
    padding: 20,
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  textInput: {
    flex: 1,
    height: 45,
    padding: 5,
    marginBottom: 13,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: '#ddd',
  },
})
