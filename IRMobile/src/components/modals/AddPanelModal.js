import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import TextButton from '../TextButton'

import { BUTTON_RADIUS } from '../../constants/dimensions'
import { BLANK_SPACE } from '../../constants/ui'

import themes from '../../constants/themes'
import panelDict from '../../dictionaries/panels'

import { isAndroid } from '../../utils'

class AddPanelModal extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
  }

  componentWillMount() {
    if (isAndroid) BackHandler.addEventListener('hardwareBackPress', this.captureAndroidBackPress)
  }

  captureAndroidBackPress = () => {
    this.props.onSubmit()
    BackHandler.removeEventListener('hardwareBackPress', this.captureAndroidBackPress)
    return true
  }

  renderButton = (item, i) => {
    // Support 2D button panel arrays
    if (typeof item === 'object') return (<View key={i} style={{flexDirection: 'row', }}>{item.map(this.renderButton)}</View>)
    const { BUTTON_BACKGROUND_COLOR, BUTTON_ICON_COLOR } = themes[this.props.theme]
    const isBlank = item === BLANK_SPACE
    return (
      <View
        key={i}
        style={[styles.button, { backgroundColor: BUTTON_BACKGROUND_COLOR }, isBlank && { opacity: 0 }]}
      >
        <Icon
          name={isBlank ? 'checkbox-blank-outline' : item}
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
        style={{ padding: 10, alignItems: 'center'}}
        onPress={() => this.props.onSubmit(key)}
      >
        <Text
          style={[styles.panelTitle]}
        >
          {title}
        </Text>
        <View style={{
          flex: 1,
          width: '100%',
          flexDirection: typeof icons[0] === 'string' ? 'row' : 'column',
          justifyContent: 'space-around'
        }}
        >
          {icons.map(this.renderButton)}
        </View>

      </TouchableOpacity>
    )
  }

  render() {
    const { onSubmit, theme } = this.props
    const { MODAL_BACKGROUND_COLOR } = themes[theme]
    return (
      <View style={styles.wrapper}>
        <View style={[styles.container, { backgroundColor: MODAL_BACKGROUND_COLOR }]}>
          <ScrollView
            style={{flex: 1}}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10, borderBottomWidth: 0.5, borderBottomColor: '#ccc' }}>
              <Text style={{ fontSize: 20, color: '#666', fontWeight: '200' }}>Add a button panel</Text>
            </View>
            { _.map(panelDict, this.renderAddPanelOption) }
          </ScrollView>

          <TextButton
            text="Cancel"
            textStyle={styles.confirmButton}
            buttonStyle={styles.confirmButtonContainer}
            onPress={onSubmit}
          />

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
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
  },
  confirmButton: {
    fontWeight: '200',
    color: '#666',
    fontSize: 16,
  },
  panelTitle: {
    fontWeight: '200',
    color: '#666',
    fontSize: 16,
    paddingTop: 15,
  },
})
