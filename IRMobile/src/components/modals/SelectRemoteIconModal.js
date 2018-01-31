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
import { updateRemote, setHeaderModal } from '../../actions'
import { isAndroid } from '../../utils'

import buttonCategories from '../../dictionaries/buttons'
import { BUTTON_RADIUS } from '../../constants/dimensions'
import themes from '../../constants/themes'

class SelectRemoteIconModal extends Component {

  state = {
    selectedIcon: null,
    newTitle: '',
  }

  static propTypes = {
    currentRemoteId: PropTypes.string.isRequired,
    remote: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
    updateRemote: PropTypes.func.isRequired,
    setHeaderModal: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { icon, title } = this.props.remote
    this.setState({ selectedIcon: icon,  newTitle: title})
    if (isAndroid) BackHandler.addEventListener('hardwareBackPress', this.captureAndroidBackPress)
  }

  captureAndroidBackPress = () => {
    this.props.onSubmit()
    BackHandler.removeEventListener('hardwareBackPress', this.captureAndroidBackPress)
    return true
  }

  renderIconButton = (iconName, index) => {
    const selected = this.state.selectedIcon === iconName
    const { MODAL_BACKGROUND_COLOR, MODAL_TEXT_COLOR, ICON_SELECTED_BACKGROUND_COLOR } = themes[this.props.theme]
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
    const { MODAL_TEXT_COLOR } = themes[this.props.theme]
    return (
      <View key={key}>
        <Text
          style={[styles.categoryTitle, { color: MODAL_TEXT_COLOR, borderBottomColor: MODAL_TEXT_COLOR }]}
        >
          {title}
        </Text>
        <View style={styles.iconContainer}>
          { icons.map(this.renderIconButton) }
        </View>
      </View>
    )
  }

  onOkPress = () => {
    const updatedButton = {
      ...this.props.remote,
      icon: this.state.selectedIcon,
    }
    this.props.updateRemote(this.props.currentRemoteId, updatedButton)
    this.props.setHeaderModal(null)
    this.props.onSubmit()
  }

  onCancelPress = () => {
    this.props.setHeaderModal(null)
    this.props.onSubmit()
  }

  render() {
    const { theme } = this.props
    const { MODAL_BACKGROUND_COLOR } = themes[theme]
    return (
      <View style={styles.wrapper}>
        <View style={[styles.container, { backgroundColor: MODAL_BACKGROUND_COLOR }]}>

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
  theme: state.settings.theme,
  currentRemoteId: state.app.currentRemoteId,
  remote: state.remotes[state.app.currentRemoteId],
})

const mapDispatchToProps = (dispatch) => ({
  updateRemote: (remoteId, updatedRemote) => dispatch(updateRemote(remoteId, updatedRemote)),
  setHeaderModal: modal => dispatch(setHeaderModal(modal)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectRemoteIconModal)

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
