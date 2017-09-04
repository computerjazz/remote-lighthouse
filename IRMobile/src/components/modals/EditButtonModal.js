import React, { Component, PropTypes } from 'react'
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
import _ from 'lodash'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import TextButton from './../TextButton'
import { editButton } from '../../actions'
import { isAndroid } from '../../utils'

import buttonCategories from '../../dictionaries/buttons'
import { BUTTON_RADIUS } from '../../constants/dimensions'
import themes from '../../constants/themes'

class EditButtonModal extends Component {

  static contextTypes = {
    theme: PropTypes.string,
  }

  state = {
    selectedIcon: null,
    newTitle: '',
  }

  componentWillMount() {
    if (isAndroid) BackHandler.addEventListener('hardwareBackPress', this.captureAndroidBackPress)
  }

  captureAndroidBackPress = () => {
    this.props.onSubmit()
    BackHandler.removeEventListener('hardwareBackPress', this.captureAndroidBackPress)
    return true
  }

  componentDidMount() {
    const { icon, title } = this.props.button
    this.setState({ selectedIcon: icon,  newTitle: title})
  }

  renderIconButton = (iconName, index) => {
    const { ICON_SELECTED_BACKGROUND_COLOR, TEXT_COLOR_DARK, MODAL_BACKGROUND_COLOR, MODAL_TEXT_COLOR } = themes[this.context.theme]
    const selected = this.state.selectedIcon === iconName
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.setState({ selectedIcon: iconName })}
        style={[styles.icon, selected && { backgroundColor: ICON_SELECTED_BACKGROUND_COLOR}]}
      >
        <Icon
          name={iconName}
          size={30}
          color={selected ? MODAL_BACKGROUND_COLOR : MODAL_TEXT_COLOR}
        />
      </TouchableOpacity>
    )
  }

  renderIconCategory = ({ title, icons }, key) => {
    const { MODAL_TEXT_COLOR } = themes[this.context.theme]
    return (
      <View key={key}>
        <Text style={[styles.categoryTitle, { color: MODAL_TEXT_COLOR, borderBottomColor: MODAL_TEXT_COLOR }]}>{title}</Text>
        <View style={styles.iconContainer}>
          { icons.map(this.renderIconButton) }
        </View>
      </View>
    )
  }

  onOkPress = () => {
    const updatedButton = {
      ...this.props.button,
      icon: this.state.selectedIcon,
      title: this.state.newTitle,
    }
    this.props.editButton(updatedButton)
    this.props.onSubmit()
  }

  render() {
    const { onSubmit, button } = this.props
    const { PRIMARY_DARK, MODAL_BACKGROUND_COLOR } = themes[this.context.theme]
    return (
      <View style={styles.wrapper}>
        <View style={[styles.container, { backgroundColor: MODAL_BACKGROUND_COLOR }]}>

          <ScrollView style={styles.scrollView}>
            <TextInput
              style={styles.textInput}
              onChangeText={text => this.setState({ newTitle: text })}
              value={this.state.newTitle}
              autoCorrect={false}
              underlineColorAndroid={PRIMARY_DARK}
              placeholder="button label"
            />
            { _.map(buttonCategories, this.renderIconCategory) }
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

EditButtonModal.defaultProps = {
  onSubmit: () => {},
}

const mapStateToProps = (state, ownProps) => ({
  button: state.buttons[ownProps.buttonId],
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  editButton: updatedButton => dispatch(editButton(ownProps.buttonId, updatedButton))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditButtonModal)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: BUTTON_RADIUS,
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    padding: 10,
  },
  categoryTitle: {
    marginTop: 10,
    fontSize: 15,
    borderBottomWidth: 0.5,
  },
  confirmButtonContainer: {
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
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: BUTTON_RADIUS,
  },
  scrollView: {
    flex: 6,
    padding: 10,
  },
  textInput: {
    flex: 1,
    height: 45,
    padding: 5,
    marginBottom: 13,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: 'rgba(0, 0, 0, .1)',
  }
})
