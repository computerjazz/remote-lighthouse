import React, { Component, PropTypes } from 'react'
import {
  Animated,
  PanResponder,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native'
import { connect } from 'react-redux'
import tinycolor from 'tinycolor2'

import { setBaseUrl, stopRecord } from '../actions'

import { PRIMARY_DARK, PRIMARY_LIGHT, RECORDING_IN_PROGRESS_COLOR, LIGHT_GREY} from '../constants/colors'

import AddElementModal from '../components/AddElementModal'
import ButtonPanel from '../components/ButtonPanel'
import EditButtonModal from '../components/EditButtonModal'
import HeaderMenu from '../components/HeaderMenu'
import CirclePlusButton from '../components/CirclePlusButton'

// test buttons
const dummyButts = [
  {id: '4534', title: '', icon: 'cake-variant'},
  {id: 'qwe', title: '', icon: 'martini'},
  {id: '345', title: '', icon: 'music'}
  //{id: '567', title: '', icon: 'music'},
  //{id: '33', title: '', icon: 'cake-variant'},
]

const dummyPanel = {
  id: '34534543',
  type: 'custom',
  buttons: dummyButts,
}

const dummyPanels = [dummyPanel]


class Remote extends Component {

  static propTypes = {
    setBaseUrl: PropTypes.func.isRequired,
    stopRecord: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  state = {
    addElementModalVisible: false,
  }

  backgroundAnim = new Animated.Value(0)

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    const menuVisible = params && params.menuVisible
    const editing = params && params.editing
    const recording = params && params.recording
    const addElementModalVisible = params && params.addElementModalVisible
    const editButtonModalVisible = params && params.editButtonModalVisible
    const modalVisible = addElementModalVisible || editButtonModalVisible


    const title = editing ? recording ? 'Listening...' : 'Ready to Capture' : 'Remote Control'
    return {
        title,
        headerStyle: {
          backgroundColor: editing ? RECORDING_IN_PROGRESS_COLOR : PRIMARY_LIGHT,
        },
        headerTitleStyle: {
          color: editing ? LIGHT_GREY : PRIMARY_DARK,
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

  showAddElementModal = () => {
    this.props.navigation.setParams({ addElementModalVisible: true })
  }

  dismissAddelementModal = () => {
    this.props.navigation.setParams({ addElementModalVisible: false })
  }

  dismissEditButtonModal = () => {
    this.props.navigation.setParams({ editButtonModalVisible: false })
  }

  dismissAll = () => {
    this.dismissMenu()
    this.dismissRecording()
    this.dismissEditButtonModal()
    this.dismissAddelementModal()
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
    const addElementModalVisible = params && params.addElementModalVisible
    const editButtonModalVisible = params && params.editButtonModalVisible

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
            { dummyPanels.map(this.renderButtonPanel)}
          </ScrollView>
          { editing && <CirclePlusButton onPress={this.showAddElementModal} /> }
          { addElementModalVisible &&
            <AddElementModal
              onAccept={this.dismissAddelementModal}
              onCancel={this.dismissAddelementModal}
            /> }

          { editButtonModalVisible &&
            <EditButtonModal
              onAccept={this.dismissEditButtonModal}
              onCancel={this.dismissEditButtonModal}
            /> }

        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

export default connect(null, dispatch => ({
  setBaseUrl: url => dispatch(setBaseUrl(url)),
  stopRecord: () => dispatch(stopRecord())
}))(Remote)

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
