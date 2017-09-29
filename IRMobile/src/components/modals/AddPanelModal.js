import React, { Component, PropTypes } from 'react'
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import TextButton from '../TextButton'

import { BUTTON_RADIUS } from '../../constants/dimensions'
import themes from '../../constants/themes'
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

  renderButton = (name, i) => {
    const { BUTTON_BACKGROUND_COLOR, BUTTON_ICON_COLOR } = themes[this.props.theme]
    return (
      <View
        key={i}
        style={[styles.button, { backgroundColor: BUTTON_BACKGROUND_COLOR }]}
      >
        <Icon
          name={name}
          color={BUTTON_ICON_COLOR}
          size={20}
        />
      </View>
    )
  }

  renderAddPanelOption = ({ title, icons }, key) => {
    return (
      <TouchableOpacity
        key={key}
        onPress={() => this.props.onSubmit(key)}
      >
        <TextButton
          text={title}
          buttonStyle={styles.confirmButton}
          // onPress={}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
          {icons.map(this.renderButton)}
        </View>

      </TouchableOpacity>
    )
  }

  render() {
    const { onSubmit, remoteId, theme } = this.props
    const { MODAL_BACKGROUND_COLOR } = themes[theme]
    return (
      <View style={styles.wrapper}>
        <View style={[styles.container, { backgroundColor: MODAL_BACKGROUND_COLOR }]}>
          <ScrollView
            style={{flex: 1}}
          >
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
  button: {
    flex: 1,
    borderRadius: BUTTON_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 10,
  },
  container: {
    flex: 1,
    width: '90%',
    borderRadius: BUTTON_RADIUS,
  },
  confirmButtonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  confirmButton: {
    paddingTop: 15,
  },
})
