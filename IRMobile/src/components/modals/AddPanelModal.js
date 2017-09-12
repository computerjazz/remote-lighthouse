import React, { Component, PropTypes } from 'react'
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import _ from 'lodash'
import TextButton from '../TextButton'

import themes from '../../constants/themes'
import { BUTTON_RADIUS } from '../../constants/dimensions'
import panelDict from '../../dictionaries/panels'

import { isAndroid } from '../../utils'

class AddPanelModal extends Component {

  componentWillMount() {
    if (isAndroid) BackHandler.addEventListener('hardwareBackPress', this.captureAndroidBackPress)
  }

  captureAndroidBackPress = () => {
    this.props.onSubmit()
    BackHandler.removeEventListener('hardwareBackPress', this.captureAndroidBackPress)
    return true
  }

  renderAddPanelOption = ({ title }, key) => (
    <TextButton
      key={key}
      text={title}
      buttonStyle={styles.confirmButton}
      onPress={() => this.props.onSubmit(key)}
    />
  )

  render() {
    const { onSubmit, remoteId, theme } = this.props
    const { MODAL_BACKGROUND_COLOR } = themes[theme]
    return (
      <View style={styles.wrapper}>
        <View style={[styles.container, { backgroundColor: MODAL_BACKGROUND_COLOR }]}>
          <ScrollView>
            { _.map(panelDict, this.renderAddPanelOption) }
          </ScrollView>

          <View style={styles.confirmButtonContainer}>
            <TextButton
              text="Cancel"
              buttonStyle={styles.confirmButton}
              onPress={onSubmit}
            />
          </View>
        </View>
      </View>
    )
  }
}

AddPanelModal.defaultProps = {
  onSubmit: () => {},
}

const mapStateToProps = state => ({
  theme: state.settings.theme,
})

export default connect(mapStateToProps)(AddPanelModal)

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '90%',
    borderRadius: BUTTON_RADIUS,
  },
  confirmButtonContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  confirmButton: {
    padding: 20,
  },
})
