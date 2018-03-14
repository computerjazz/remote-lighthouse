import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { LIGHT_ORANGE } from '../constants/colors'

class OverlayMessage extends Component {

  static propTypes = {
    numLighthouses: PropTypes.number.isRequired,
  }

  render() {
    const { numLighthouses } = this.props
    if (numLighthouses > 0) return null
    return (
      <View pointerEvents="none" style={{ ...StyleSheet.absoluteFillObject }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
          <View />
          <View style={styles.alertContainer}>
            <Icon name="alert-box" size={30} color="#fff" />
            <Text style={styles.title}>No lighthouse connected</Text>
            <Text style={styles.subTitle}>Re-scan in settings</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default connect(state => ({
  numLighthouses: state.network.ipAddresses ? state.network.ipAddresses.length : 0
}))(OverlayMessage)

const styles = StyleSheet.create({
  alertContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 3,
    backgroundColor: LIGHT_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '200'
  },
  subTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '200',
    padding: 5,
  }
})
