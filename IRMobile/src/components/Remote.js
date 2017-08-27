import React, { Component, PropTypes } from 'react'
import {
  Animated,
  PanResponder,
  FlatList,
  StyleSheet,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import {
  createButtonPanel,
  setBaseUrl,
  setHeaderMenu,
  setModalVisible,
  stopRecord,
} from '../actions'

import {
  REMOTE_BACKGROUND_COLOR,
} from '../constants/colors'

import ButtonPanel from './ButtonPanel'
import CirclePlusButton from './CirclePlusButton'
import AddPanelModal from './modals/AddPanelModal'
import EditButtonModal from './modals/EditButtonModal'
import SelectRemoteIconModal from './modals/SelectRemoteIconModal'
import TabIcon from './menu/TabIcon'

class Remote extends Component {

  static navigationOptions = ({ navigation }) => {
    const title = navigation.state.params && navigation.state.params.title || ' '
    return {
      tabBarLabel: title,
      tabBarIcon: <TabIcon id={navigation.state.routeName} />
    }
  }

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
   if (remote.title !== nextProps.remote.title) {
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

  renderButtonPanel = ({ item }) => {
    const { navigation } = this.props
    return (
      <ButtonPanel
        id={item}
        remoteId={navigation.state.routeName}
        onEditPress={this.onEditPress}
        setParams={navigation.setParams}
      />
    )
  }

  render() {
    const { editing, remote, headerModalVisible, navigation } = this.props
    const { addPanelModalVisible, editButtonModalVisible, editingButtonId } = this.state
    if (!remote) return null

    return (
      <View style={{flex: 1}}>
        <View
          {...this._panResponder.panHandlers}
          style={[styles.container]}
        >
          <FlatList
            style={styles.buttonPanelList}
            data={remote.panels}
            renderItem={this.renderButtonPanel}
            keyExtractor={item => item}
          />
          { editing && <CirclePlusButton onPress={this.showAddPanelModal} />}

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

        { headerModalVisible && <SelectRemoteIconModal />}
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  remote: state.remotes[ownProps.navigation.state.routeName],
  currentRemoteId: state.app.currentRemoteId,
  editing: state.app.editing,
  editingButtonId: state.app.editingButtonId,
  editButtonModalVisible: state.app.editButtonModalVisible,
  headerMenuVisible: state.app.headerMenuVisible,
  headerModalVisible: state.app.headerModalVisible,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    createButtonPanel: type => dispatch(createButtonPanel(type, ownProps.navigation.state.routeName)),
    setBaseUrl: url => dispatch(setBaseUrl(url)),
    stopRecord: () => dispatch(stopRecord()),
    setHeaderMenu: visible => dispatch(setHeaderMenu(visible)),
    setModalVisible: visible => dispatch(setModalVisible(visible)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Remote)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: REMOTE_BACKGROUND_COLOR,
  },
  buttonPanelList: {
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
