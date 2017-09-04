import React, { Component, PropTypes } from 'react'
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { connect } from 'react-redux'

import TextButton from '../TextButton'
import { updateRemote, setHeaderModal, setTheme } from '../../actions'
import { isAndroid } from '../../utils'

import { BUTTON_RADIUS } from '../../constants/dimensions'
import themes, { list as themeList} from '../../constants/themes'

class SelectRemoteIconModal extends Component {

  static contextTypes = {
    theme: PropTypes.string,
  }

  state = {
    selectedTheme: '',
  }

  componentWillMount() {
    if (isAndroid) BackHandler.addEventListener('hardwareBackPress', this.captureAndroidBackPress)
    this.setState({ selectedTheme: this.context.theme })
  }

  captureAndroidBackPress = () => {
    this.props.onSubmit()
    BackHandler.removeEventListener('hardwareBackPress', this.captureAndroidBackPress)
    return true
  }

  onDonePress = () => {
    if (this.state.selectedTheme !== this.context.theme) this.props.setTheme(this.state.selectedTheme)
    this.props.setHeaderModal(null)
    this.props.onSubmit()
  }

  renderThemeOption = themeName => {
    const { OPTION_SELECTED_BACKGROUND_COLOR } = themes[this.context.theme]
    return (
      <TouchableOpacity
        key={themeName}
        onPress={() => this.setState({ selectedTheme: themeName })}
        style={{ backgroundColor: this.state.selectedTheme === themeName ? OPTION_SELECTED_BACKGROUND_COLOR : 'transparent'}}
      >
        <Text>{themeName}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { onSubmit } = this.props
    const { MODAL_BACKGROUND_COLOR } = themes[this.context.theme]
    return (
      <View style={styles.wrapper}>
        <View style={[styles.container, { backgroundColor: MODAL_BACKGROUND_COLOR }]}>

          <ScrollView style={styles.scrollView}>
            {themeList.map(this.renderThemeOption)}
          </ScrollView>

          <View style={styles.confirmButtonContainer}>
            <TextButton
              text="Done"
              buttonStyle={styles.confirmButton}
              onPress={this.onDonePress}
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
  setHeaderModal: modal => dispatch(setHeaderModal(modal)),
  setTheme: theme => dispatch(setTheme(theme)),
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
