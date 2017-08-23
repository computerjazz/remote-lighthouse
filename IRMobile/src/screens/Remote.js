import React, { Component, PropTypes } from 'react'
import {
  Animated,
  PanResponder,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import { connect } from 'react-redux'
import tinycolor from 'tinycolor2'

import { setBaseUrl, stopRecord, createButtonPanel } from '../actions'

import {
  LIGHT_GREY,
  PRIMARY_DARK_ANALOGOUS,
  PRIMARY_DARK,
  PRIMARY_LIGHT_ANALOGOUS,
  RECORDING_IN_PROGRESS_COLOR,
} from '../constants/colors'

import AddPanelModal from '../components/AddPanelModal'
import ButtonPanel from '../components/ButtonPanel'
import EditButtonModal from '../components/EditButtonModal'
import HeaderMenu from '../components/HeaderMenu'
import CirclePlusButton from '../components/CirclePlusButton'

class Remote extends Component {

  static propTypes = {
    setBaseUrl: PropTypes.func.isRequired,
    stopRecord: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  state = {
    addPanelModalVisible: false,
  }

  backgroundAnim = new Animated.Value(0)

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    const menuVisible = params && params.menuVisible
    const editing = params && params.editing
    const recording = params && params.recording
    const addPanelModalVisible = params && params.addPanelModalVisible
    const editButtonModalVisible = params && params.editButtonModalVisible
    const modalVisible = addPanelModalVisible || editButtonModalVisible
    const remoteTitle = params && params.title


    const title = editing ? recording ? 'Listening...' : 'Ready to Capture' : remoteTitle
    return {
        title,
        headerStyle: {
          backgroundColor: editing ? RECORDING_IN_PROGRESS_COLOR : PRIMARY_LIGHT_ANALOGOUS,
        },
        headerTitleStyle: {
          color: editing ? LIGHT_GREY : PRIMARY_DARK_ANALOGOUS,
        },
        headerRight: !modalVisible && <HeaderMenu
          menuVisible={menuVisible}
          setParams={navigation.setParams}
          editing={editing}
        />,
      }
    }

  componentWillMount() {
    this.props.setBaseUrl('http://192.168.86.99')
    this.props.navigation.setParams({ title: this.props.title })
    this._panResponder = PanResponder.create({
     onStartShouldSetPanResponder: () => false,
     onStartShouldSetPanResponderCapture: () => false,
     onMoveShouldSetPanResponder: () => false ,
     onMoveShouldSetPanResponderCapture: () => {
       // @TODO: setting recording button id to null
       // here is messing up button logic b/c this onPress
       // is called before button onPress.

       // this.dismissRecording()
       this.dismissMenu()
       return false
     }
   });
 }

 componentDidUpdate(prevProps) {
   const prevEditing = prevProps.navigation.state.params && prevProps.navigation.state.params.editing
   const thisEditing = this.props.navigation.state.params && this.props.navigation.state.params.editing
   if (!prevEditing && thisEditing) this.pulseBackground()
 }

 pulseBackground = () => {
   if (this.props.navigation.state.params && this.props.navigation.state.params.editing) {
     Animated.timing(this.backgroundAnim, {
       toValue: 1,
       duration: 1000,
     }).start(() => {
       Animated.timing(this.backgroundAnim, {
         toValue: 0,
         duration: 1000,
       }).start(() => {
         this.pulseBackground()
       })
     })
   }
 }

  dismissRecording = () => {
    const { navigation } = this.props
    const isRecording = navigation.state.params && navigation.state.params.recording
    if (isRecording) {
      this.props.stopRecord()
      navigation.setParams({ recording: null })
    }
  }

  dismissMenu = () => {
    const { navigation } = this.props
    const menuVisible = navigation.state.params && navigation.state.params.menuVisible
    if (menuVisible) navigation.setParams({ menuVisible: false })
    return true
  }

  showAddPanelModal = () => {
    this.props.navigation.setParams({ addPanelModalVisible: true })
  }

  dismissAddPanelModal = () => {
    this.props.navigation.setParams({ addPanelModalVisible: false })
  }

  submitAddPanelModal = type => {
    this.props.createButtonPanel(type)
    this.props.navigation.setParams({ addPanelModalVisible: false })
  }

  submitEditButtonModal = ({ title, icon }) => {
    this.props.navigation.setParams({ editButtonModalVisible: false })
  }

  dismissEditButtonModal = () => {
    this.props.navigation.setParams({ editButtonModalVisible: false })
  }

  dismissAll = () => {
    this.dismissMenu()
    this.dismissRecording()
    this.dismissEditButtonModal()
    this.dismissAddPanelModal()
  }

  renderButtonPanel = ({ id, type, buttons }) => {
    const { navigation } = this.props
    const { params } = navigation.state
    const editing = params && params.editing
    const recording = params && params.recording

    return (
      <ButtonPanel
        key={id}
        id={id}
        type={type}
        buttons={buttons}
        editing={editing}
        recording={recording}
        setParams={navigation.setParams}
      />
    )
  }

  render() {
    const { navigation } = this.props
    const { params } = navigation.state
    const editing = params && params.editing
    const addPanelModalVisible = params && params.addPanelModalVisible
    const editButtonModalVisible = params && params.editButtonModalVisible



    console.log('PROPS!!', this.props)
    return (
      <TouchableWithoutFeedback onPress={this.dismissAll}>
        <Animated.View
          {...this._panResponder.panHandlers}
          style={[styles.container, editing && { backgroundColor: this.backgroundAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [PRIMARY_DARK, tinycolor(PRIMARY_DARK).lighten(8).toString()]
          })}]}
        >
          <ScrollView style={styles.scrollView}>
            { this.props.remote.panels.map(panelId => {
              const panel = this.props.panels[panelId]
              const buttons = panel.buttons.map(buttonId => this.props.buttons[buttonId])
              return this.renderButtonPanel({ type: panel.type, buttons, id: panelId})
            })}
          </ScrollView>
          { editing && <CirclePlusButton onPress={this.showAddPanelModal} /> }
          { addPanelModalVisible &&
            <AddPanelModal
              onAccept={this.submitAddPanelModal}
              onCancel={this.dismissAddPanelModal}
            /> }

          { editButtonModalVisible &&
            <EditButtonModal
              onAccept={this.submitEditButtonModal}
              onCancel={this.dismissEditButtonModal}
            /> }

        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  remote: state.remotes[ownProps.navigation.state.params.id],
  buttons: state.buttons,
  panels: state.panels,
  title: state.remotes[ownProps.navigation.state.params.id].title
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  createButtonPanel: type => dispatch(createButtonPanel(type, ownProps.navigation.state.params.id)),
  setBaseUrl: url => dispatch(setBaseUrl(url)),
  stopRecord: () => dispatch(stopRecord())
})

export default connect(mapStateToProps, mapDispatchToProps)(Remote)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_DARK,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  }
})
