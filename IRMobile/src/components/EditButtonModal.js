import React, { Component } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import _ from 'lodash'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import TextButton from './TextButton'
import { editButton } from '../actions'
import { ICON_SELECTED_BACKGROUND_COLOR, TEXT_COLOR_DARK, MODAL_BACKGROUND_COLOR } from '../constants/colors'
import { BUTTON_RADIUS } from '../constants/style'
import buttonCategories from '../dictionaries/buttons'

class EditButtonModal extends Component {

  state = {
    selectedIcon: null,
  }

  componentDidMount() {
    this.setState({ selectedIcon: this.props.button.icon })
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
    }
    this.props.editButton(updatedButton)
    this.props.onAccept()
  }

  render() {
    const { onAccept = () => {}, onCancel = () => {}, button } = this.props
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>

          <ScrollView style={styles.scrollView}>
            <Text style={styles.title}>Icon</Text>
            { _.map(buttonCategories, this.renderIconCategory) }
          </ScrollView>

          <View style={styles.confirmButtonContainer}>
            <TextButton
              text="Cancel"
              buttonStyle={styles.confirmButton}
              onPress={onCancel}
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
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: TEXT_COLOR_DARK,
    alignSelf: 'center',
  },
  categoryTitle: {
    fontSize: 15,
    color: TEXT_COLOR_DARK,
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
    borderTopColor: TEXT_COLOR_DARK,
    borderTopWidth: 0.5,
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
  }
})
