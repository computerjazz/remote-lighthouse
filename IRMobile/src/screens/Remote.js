import React, { Component, PropTypes } from 'react'
import {
  Animated,
  PanResponder,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import tinycolor from 'tinycolor2'

import { setBaseUrl, stopRecord, createButtonPanel, setHeaderMenu } from '../actions'

import {
  HEADER_TITLE_COLOR,
  HEADER_TITLE_EDITING_COLOR,
  HEADER_BACKGROUND_EDITING_COLOR,
  HEADER_BACKGROUND_COLOR,
  REMOTE_BACKGROUND_COLOR,
} from '../constants/colors'

import { STATUS_BAR_HEIGHT } from '../constants/dimensions'

import ButtonPanel from '../components/ButtonPanel'
import HeaderMenu from '../components/HeaderMenu'
import CirclePlusButton from '../components/CirclePlusButton'
import AddPanelModal from '../components/AddPanelModal'
import EditButtonModal from '../components/EditButtonModal'

class Remote extends Component {

  static propTypes = {
    editing: PropTypes.bool.isRequired,
    setBaseUrl: PropTypes.func.isRequired,
    stopRecord: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    remote: PropTypes.object.isRequired,
  }

  state = {
    addPanelModalVisible: false,
    editButtonModalVisible: false,
  }

  backgroundAnim = new Animated.Value(0)

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    const menuVisible = params && params.menuVisible
    const editing = params && params.editing
    const recording = params && params.recording
    const modalVisible = params && params.modalVisible
    const remoteTitle = params && params.title


    const title = editing ? recording ? 'Listening...' : 'Ready to capture' : remoteTitle
    return {
        title,
        headerStyle: {
          backgroundColor: editing ? HEADER_BACKGROUND_EDITING_COLOR : HEADER_BACKGROUND_COLOR,
          paddingTop: STATUS_BAR_HEIGHT,
          height: 75,
        },
        headerTitleStyle: {
          color: editing ? HEADER_TITLE_EDITING_COLOR : HEADER_TITLE_COLOR,
        },
        headerRight: !modalVisible && <HeaderMenu
          menuVisible={menuVisible}
          setParams={navigation.setParams}
        />,
      }
    }

  componentWillMount() {
    this.props.setBaseUrl('http://192.168.86.99')
    this.props.navigation.setParams({ title: this.props.remote.title })
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
   const prevEditing = prevProps.editing && prevProps.editing
   const thisEditing = this.props.editing && this.props.editing
   if (prevEditing !== thisEditing) this.props.navigation.setParams({ editing: this.props.editing })
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
    this.props.setHeaderMenu(false)
  }

  showAddPanelModal = () => {
    this.setState({ addPanelModalVisible: true })
    this.props.navigation.setParams({ modalVisible: true })
  }

  dismissAddPanelModal = () => {
    this.setState({ addPanelModalVisible: false })
    this.props.navigation.setParams({ modalVisible: false })
  }

  submitAddPanelModal = type => {
    this.props.createButtonPanel(type)
    this.setState({ addPanelModalVisible: false })
    this.props.navigation.setParams({ modalVisible: false })
  }

  onEditPress = buttonId => {
    this.props.navigation.setParams({ modalVisible: true })
    this.setState({ editButtonModalVisible: true, editingButtonId: buttonId })
  }

  dismissEditButtonModal = () => {
    this.setState({ editButtonModalVisible: false })
    this.props.navigation.setParams({ modalVisible: false })
  }

  dismissAll = () => {
    this.dismissMenu()
    this.dismissRecording()
    this.dismissEditButtonModal()
    this.dismissAddPanelModal()
  }

  renderButtonPanel = id => {
    const { navigation } = this.props

    return (
      <ButtonPanel
        key={id}
        id={id}
        onEditPress={this.onEditPress}
        setParams={navigation.setParams}
      />
    )
  }

  render() {
    const { editing } = this.props
    const { addPanelModalVisible, editButtonModalVisible, editingButtonId } = this.state

    return (
      <View style={{flex: 1}}>
      <Animated.View
        {...this._panResponder.panHandlers}
        style={[styles.container, editing && { backgroundColor: this.backgroundAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [REMOTE_BACKGROUND_COLOR, tinycolor(REMOTE_BACKGROUND_COLOR).lighten(8).toString()]
        })}]}
      >
        <ScrollView style={styles.scrollView}>
          { this.props.remote && this.props.remote.panels.map(this.renderButtonPanel)}
        </ScrollView>

        { editing && <CirclePlusButton onPress={this.showAddPanelModal} />}

      </Animated.View>
      { addPanelModalVisible &&
        <AddPanelModal
          onAccept={this.submitAddPanelModal}
          onCancel={this.dismissAddPanelModal}
        /> }

      { editButtonModalVisible &&
        <EditButtonModal
          buttonId={editingButtonId}
          onAccept={this.dismissEditButtonModal}
          onCancel={this.dismissEditButtonModal}
        /> }
    </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  remote: state.remotes[ownProps.navigation.state.params.id],
  editing: state.app.editing,
  editingButtonId: state.app.editingButtonId,
  editButtonModalVisible: state.app.editButtonModalVisible,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  createButtonPanel: type => dispatch(createButtonPanel(type, ownProps.navigation.state.params.id)),
  setBaseUrl: url => dispatch(setBaseUrl(url)),
  stopRecord: () => dispatch(stopRecord()),
  setHeaderMenu: visible => dispatch(setHeaderMenu(visible)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Remote)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: REMOTE_BACKGROUND_COLOR,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  menu: {
    padding: 10,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    right: 0,
    transform: [{ translateY: -20 }]
  }
})
