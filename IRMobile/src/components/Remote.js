import React, { Component, PropTypes } from 'react'
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native'

import { connect } from 'react-redux'
import SortableListView from 'react-native-sortable-listview'

import {
  createButtonPanel,
  setDragging,
  setHeaderMenu,
  setModalVisible,
  stopRecord,
  updateRemote,
} from '../actions'

import themes from '../constants/themes'
import modals from './modals'

import ButtonPanel from './ButtonPanel'
import CirclePlusButton from './CirclePlusButton'
import AddPanelModal from './modals/AddPanelModal'
import EditButtonModal from './modals/EditButtonModal'
import TabIcon from './nav/TabIcon'
import TabLabel from './nav/TabLabel'

class Remote extends Component {

  static navigationOptions = ({ navigation }) => {

    const title = navigation.state.params && navigation.state.params.title || ' '
    return {
      title,
      tabBarLabel: ({ focused }) => <TabLabel focused={focused} title={title} id={navigation.state.routeName} />,
      tabBarIcon: ({ focused }) => <TabIcon focused={focused} id={navigation.state.routeName}  />
    }
  }

  static propTypes = {
    editing: PropTypes.bool.isRequired,
    stopRecord: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    remote: PropTypes.object.isRequired,
  }

  state = {
    addPanelModalVisible: false,
    editButtonModalVisible: false,
  }

  backgroundAnim = new Animated.Value(0)

  componentWillMount() {
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
       if (this.props.headerMenuVisible) this.dismissMenu()
       return false
     }
   });
 }

 componentWillReceiveProps(nextProps) {
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
    this.props.setModalVisible(true)
  }

  submitAddPanelModal = type => {
    if (type) this.props.createButtonPanel(type)
    this.setState({ addPanelModalVisible: false })
    this.props.setModalVisible(false)
  }

  onEditPress = buttonId => {
    this.setState({ editButtonModalVisible: true, editingButtonId: buttonId })
    this.props.setModalVisible(true)
  }

  dismissEditButtonModal = () => {
    this.setState({ editButtonModalVisible: false })
    this.props.setModalVisible(false)
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
        id={id}
        remoteId={navigation.state.routeName}
        onEditPress={this.onEditPress}
        setParams={navigation.setParams}
      />
    )
  }

  onRowMoved = ({ from, to, row }) => {
    const panels = this.props.remote.panels.filter(panelId => panelId !== row.data)
    panels.splice(to, 0, row.data)

    this.props.updateRemote({
      ...this.props.remote,
      panels,
    })
  }

  render() {
    const { editing, dragging, remote, headerModal, theme } = this.props
    const { addPanelModalVisible, editButtonModalVisible, editingButtonId } = this.state
    const GeneralModal = modals[headerModal]
    if (!remote) return null
    const { REMOTE_BACKGROUND_COLOR } = themes[theme]

    return (
      <View style={{flex: 1}}>
        <View
          {...this._panResponder.panHandlers}
          style={[styles.container, { backgroundColor: REMOTE_BACKGROUND_COLOR }]}
        >
          <SortableListView
            style={styles.buttonPanelList}
            data={this.props.remote.panels.reduce((acc, cur) => {
              acc[cur] = cur
              return acc
            }, {})}
            order={this.props.remote.panels}
            renderRow={this.renderButtonPanel}
            onRowMoved={this.onRowMoved}
            sortRowStyle={styles.sortRow}
          />

          { editing && !dragging && <CirclePlusButton onPress={this.showAddPanelModal} />}

        </View>
        { addPanelModalVisible &&
          <AddPanelModal
            onSubmit={this.submitAddPanelModal}
          /> }

        { editButtonModalVisible &&
          <EditButtonModal
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
  remote: state.remotes[ownProps.navigation.state.routeName],
  currentRemoteId: state.app.currentRemoteId,
  dragging: state.app.dragging,
  editing: state.app.editing,
  editingButtonId: state.app.editingButtonId,
  editButtonModalVisible: state.app.editButtonModalVisible,
  headerMenuVisible: state.app.headerMenuVisible,
  headerModal: state.app.headerModal,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    createButtonPanel: type => dispatch(createButtonPanel(type, ownProps.navigation.state.routeName)),
    setDragging: dragging => dispatch(setDragging(dragging)),
    stopRecord: () => dispatch(stopRecord()),
    setHeaderMenu: visible => dispatch(setHeaderMenu(visible)),
    setModalVisible: visible => dispatch(setModalVisible(visible)),
    updateRemote: updatedRemote => dispatch(updateRemote(ownProps.navigation.state.routeName, updatedRemote)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Remote)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonPanelList: {
    // flex: 1,
  },
  sortRow: {
      opacity: 1.0,
      elevation: 5,
      shadowColor: 'black',
      shadowOpacity: 0.4,
      shadowOffset: {
        width: 3,
        height: 3,
      },
      shadowRadius: 3,
    }
})
