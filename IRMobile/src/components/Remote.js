import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Animated,
  LayoutAnimation,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native'

import { connect } from 'react-redux'
import SortableFlatList from 'react-native-draggable-flatlist'

import {
  createButtonPanel,
  gotoInstructionStep,
  setCaptureMode,
  setDragging,
  setEditMode,
  setHeaderMenu,
  setModalVisible,
  stopRecord,
  updateRemote,
} from '../actions'

import instructions from '../dictionaries/instructions'
import themes from '../constants/themes'
import modals from './modals'

import ButtonPanel from './ButtonPanel'
import CircleButton from './CircleButton'
import AddPanelModal from './modals/AddPanelModal'
import EditButtonModal from './modals/EditButtonModal'
import TabIcon from './nav/TabIcon'
import TabLabel from './nav/TabLabel'
import ManualCodeEnterModal from './modals/ManualCodeEnter';

class Remote extends Component {

  static navigationOptions = (props) => {
    const { navigation } = props

    const title = navigation.state.params && navigation.state.params.title
    const swipeEnabled = navigation.state.params && navigation.state.params.swipeEnabled
    return {
      title,
      tabBarLabel: ({ focused }) => <TabLabel focused={focused} title={title} id={navigation.state.routeName} />,
      tabBarIcon: ({ focused }) => <TabIcon hasTitle={!!title} focused={focused} id={navigation.state.routeName}  />,
      swipeEnabled,

    }
  }

  static propTypes = {
    editing: PropTypes.bool.isRequired,
    gotoInstructionStep: PropTypes.func.isRequired,
    headerMenuVisible: PropTypes.bool.isRequired,
    instructionStep: PropTypes.number.isRequired,
    navigation: PropTypes.object.isRequired,
    remote: PropTypes.object.isRequired,
    setDragging: PropTypes.func.isRequired,
    stopRecord: PropTypes.func.isRequired,
    dragging: PropTypes.bool.isRequired,
  }

  state = {
    addPanelModalVisible: false,
    editButtonModalVisible: false,
  }

  backgroundAnim = new Animated.Value(0)

  constructor(props) {
    super(props)
    props.navigation.setParams({ title: props.remote.title, swipeEnabled: !props.dragging })
    this._panResponder = PanResponder.create({
     onStartShouldSetPanResponder: () => {
       this.dismissAll()
       return false;
     },
     onStartShouldSetPanResponderCapture: () => {
       this.dismissAll()
       return false
     },
     onMoveShouldSetPanResponder: () => false,
     onMoveShouldSetPanResponderCapture: () => false,
   })
  }

  dismissAll = () => {
    if (this.props.headerMenuVisible) this.dismissMenu()
    if (this.props.instructionStep === instructions.length - 1) {
      // User is on last step of instructions
      // any gesture dismisses
      this.props.gotoInstructionStep(-1)
    }
  }


 UNSAFE_componentWillReceiveProps(nextProps) {
   const { navigation, remote } = this.props
   if (!nextProps.remote) return
   const titleHasChanged = remote.title !== nextProps.remote.title
   const paramsNotSet = !this.props.navigation.state.params && !nextProps.navigation.state.params

   if (titleHasChanged || paramsNotSet) {
     navigation.setParams({ title: nextProps.remote.title })
   }

   if (nextProps.currentRemoteId !== this.props.navigation.state.routeName) {
     this.setState({ addPanelModalVisible: false, editButtonModalVisible: false })
   }

   if (this.props.dragging !== nextProps.dragging) {
     LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
   }
 }

 componentDidUpdate(prevProps) {
   if (prevProps.dragging !== this.props.dragging) {
     this.props.navigation.setParams({ swipeEnabled: !this.props.dragging })
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

  dismissMenu = () => this.props.setHeaderMenu(false)

  showAddPanelModal = () => {
    this.setState({ addPanelModalVisible: true })
    this.props.setModalVisible('addPanel')
  }

  submitAddPanelModal = type => {
    if (type) this.props.createButtonPanel(type)
    this.setState({ addPanelModalVisible: false })
    this.props.setModalVisible(null)
  }

  onEditPress = buttonId => {
    this.setState({ editButtonModalVisible: true, editingButtonId: buttonId })
    this.props.setModalVisible('editButton')
  }

  dismissEditButtonModal = () => {
    this.setState({ editButtonModalVisible: false })
    this.props.setModalVisible(null)
  }

  setCaptureMode = () => {
    this.props.setEditMode(false)
    this.props.setCaptureMode(true)
  }
  setEditMode = () => {
    this.props.setCaptureMode(false)
    this.props.setEditMode(true)
  }

  renderButtonPanel = ({ item, index, isActive, move, moveEnd }) => {
    const { navigation } = this.props
    return (
      <ButtonPanel
        key={`list-item-${item}`} 
        id={item}
        remoteId={navigation.state.routeName}
        onEditPress={this.onEditPress}
        setParams={navigation.setParams}
        isActive={isActive}
        move={move}
        moveEnd={moveEnd}
      />
    )
  }

  onMoveEnd = ({ data, from, to, row }) => {
    if (to !== from) {
      this.props.updateRemote({
        ...this.props.remote,
        panels: data,
      })
    }
    // Prevent LayoutAnimation from animating list
    setTimeout(() => this.props.setDragging(false), 500)
  }

  render() {
    const { capturing, editing, dragging, remote, headerModal, theme } = this.props
    const { addPanelModalVisible, editButtonModalVisible, editingButtonId, listViewKey } = this.state
    const GeneralModal = modals[headerModal]
    const EditModal = capturing ? ManualCodeEnterModal : EditButtonModal
    if (!remote) return null
    const { REMOTE_BACKGROUND_COLOR } = themes[theme]
    return (
      <View style={{ flex: 1 }}>
        <View
          {...this._panResponder.panHandlers}
          style={[styles.container, { backgroundColor: REMOTE_BACKGROUND_COLOR }]}
        >
          <SortableFlatList
            scrollPercent={5}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyExtractor={(item, index) => item} 
            data={this.props.remote.panels}
            renderItem={this.renderButtonPanel}
            onMoveEnd={this.onMoveEnd}
            onMoveBegin={() => this.props.setDragging(true)}
          />

          { editing && !dragging && <CircleButton icon="remote" onPress={this.setCaptureMode} />}
          { editing && !dragging && <CircleButton icon="plus" style={{ right: 100 }} onPress={this.showAddPanelModal} />}
          { capturing && <CircleButton icon="arrange-bring-forward" onPress={this.setEditMode} />}

        </View>

        { addPanelModalVisible && 
          <AddPanelModal
            onSubmit={this.submitAddPanelModal}
          /> }

        { editButtonModalVisible && 
          <EditModal
            buttonId={editingButtonId}
            onSubmit={this.dismissEditButtonModal}
          /> }

        { !!headerModal && <GeneralModal />}
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  theme: state.settings.theme,
  instructionStep: state.settings.instructionStep,
  remote: state.remotes[ownProps.navigation.state.routeName],
  currentRemoteId: state.app.currentRemoteId,
  dragging: state.app.dragging,
  editing: state.app.editing,
  capturing: state.app.capturing,
  editingButtonId: state.app.editingButtonId,
  editButtonModalVisible: state.app.editButtonModalVisible,
  headerMenuVisible: state.app.headerMenuVisible,
  headerModal: state.app.headerModal,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    createButtonPanel: type => dispatch(createButtonPanel(type, ownProps.navigation.state.routeName)),
    gotoInstructionStep: step => dispatch(gotoInstructionStep(step)),
    setCaptureMode: captureMode => dispatch(setCaptureMode(captureMode)),
    setDragging: dragging => dispatch(setDragging(dragging)),
    setEditMode: editMode => dispatch(setEditMode(editMode)),
    setHeaderMenu: visible => dispatch(setHeaderMenu(visible)),
    setModalVisible: visible => dispatch(setModalVisible(visible)),
    stopRecord: () => dispatch(stopRecord()),
    updateRemote: updatedRemote => dispatch(updateRemote(ownProps.navigation.state.routeName, updatedRemote)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Remote)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})
