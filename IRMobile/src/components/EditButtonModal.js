import React, { Component } from 'react'
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

import TextButton from './TextButton'
import { editButton } from '../actions'
import { isAndroid } from '../utils'

import buttonCategories from '../dictionaries/buttons'
import { BUTTON_RADIUS } from '../constants/dimensions'
import { ICON_SELECTED_BACKGROUND_COLOR, TEXT_COLOR_DARK, MODAL_BACKGROUND_COLOR, PRIMARY_DARK } from '../constants/colors'

class EditButtonModal extends Component {

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
          color={selected ? MODAL_BACKGROUND_COLOR : TEXT_COLOR_DARK}
        />
      </TouchableOpacity>
    )
  }

  renderIconCategory = ({ title, icons }, key) => (
    <View key={key}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <View style={styles.iconContainer}>
        { icons.map(this.renderIconButton) }
      </View>
    </View>
  )

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
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>

          <ScrollView style={styles.scrollView}>
            <Text style={styles.title}>Label</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={text => this.setState({ newTitle: text })}
              value={this.state.newTitle}
              autoCorrect={false}
              underlineColorAndroid={PRIMARY_DARK}
            />
            <Text style={styles.title}>Icon</Text>
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
    backgroundColor: MODAL_BACKGROUND_COLOR,
    opacity: 0.9,
    borderRadius: BUTTON_RADIUS,
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    padding: 10,
  },
  title: {
    fontSize: 25,
    color: TEXT_COLOR_DARK,
  },
  categoryTitle: {
    marginTop: 15,
    fontSize: 15,
    color: TEXT_COLOR_DARK,
    borderBottomColor: TEXT_COLOR_DARK,
    borderBottomWidth: 0.5,
    alignSelf: 'flex-end',
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
    paddingTop: 10,
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
  }
})
