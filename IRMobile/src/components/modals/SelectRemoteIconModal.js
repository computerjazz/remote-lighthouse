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

import TextButton from '../TextButton'
import { updateRemote, setHeaderModalVisible } from '../../actions'
import { isAndroid } from '../../utils'

import buttonCategories from '../../dictionaries/buttons'
import { BUTTON_RADIUS } from '../../constants/dimensions'
import { ICON_SELECTED_BACKGROUND_COLOR, TEXT_COLOR_DARK, MODAL_BACKGROUND_COLOR, PRIMARY_DARK, LIGHT_GREY } from '../../constants/colors'

class SelectRemoteIconModal extends Component {

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
    const { icon, title } = this.props.remote
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
      ...this.props.remote,
      icon: this.state.selectedIcon,
    }
    this.props.updateRemote(this.props.currentRemoteId, updatedButton)
    this.props.setHeaderModalVisible(false)
    this.props.onSubmit()
  }

  onCancelPress = () => {
    this.props.setHeaderModalVisible(false)
    this.props.onSubmit()
  }

  render() {
    const { onSubmit } = this.props
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>

          <ScrollView style={styles.scrollView}>
            { _.map(buttonCategories, this.renderIconCategory) }
          </ScrollView>

          <View style={styles.confirmButtonContainer}>
            <TextButton
              text="Cancel"
              buttonStyle={styles.confirmButton}
              onPress={this.onCancelPress}
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

SelectRemoteIconModal.defaultProps = {
  onSubmit: () => {},
}

const mapStateToProps = state => ({
  currentRemoteId: state.app.currentRemoteId,
  remote: state.remotes[state.app.currentRemoteId],
})

const mapDispatchToProps = (dispatch) => ({
  updateRemote: (remoteId, updatedRemote) => dispatch(updateRemote(remoteId, updatedRemote)),
  setHeaderModalVisible: visible => dispatch(setHeaderModalVisible(visible)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectRemoteIconModal)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MODAL_BACKGROUND_COLOR,
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
    marginTop: 10,
    fontSize: 15,
    color: TEXT_COLOR_DARK,
    borderBottomColor: TEXT_COLOR_DARK,
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
