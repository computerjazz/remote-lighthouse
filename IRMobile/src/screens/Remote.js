import React, { Component, PropTypes } from 'react'
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import tinycolor from 'tinycolor2'

import { setBaseUrl } from '../actions'

import { PRIMARY_DARK, PRIMARY_LIGHT, RECORDING_IN_PROGRESS_COLOR, LIGHT_GREY} from '../constants/colors'

import AddElementModal from '../components/AddElementModal'
import ButtonPanel from '../components/ButtonPanel'
import HeaderMenu from '../components/HeaderMenu'
import PlusButton from '../components/PlusButton'

class Remote extends Component {

  static propTypes = {
    setBaseUrl: PropTypes.func.isRequired,
    navigation: PropTypes.object,
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
    const title = editing ? recording ? 'Listening...' : 'Ready to Capture' : 'Remote Control'
    return {
        title,
        headerStyle: {
          backgroundColor: editing ? RECORDING_IN_PROGRESS_COLOR : PRIMARY_LIGHT,
        },
        headerTitleStyle: {
          color: editing ? LIGHT_GREY : PRIMARY_DARK,
        },
        headerRight: <HeaderMenu
          menuVisible={menuVisible}
          setParams={navigation.setParams}
          editing={editing}
        />,
        header: addElementModalVisible ? null : undefined,
      }
    }

  componentWillMount() {
    this.props.setBaseUrl('http://192.168.86.99')

    this._panResponder = PanResponder.create({
     onStartShouldSetPanResponder: () => false,
     onStartShouldSetPanResponderCapture: () => false,
     onMoveShouldSetPanResponder: () => false ,
     onMoveShouldSetPanResponderCapture: () => {
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

  render() {
    const { navigation } = this.props
    const editing = navigation.state.params && navigation.state.params.editing
    const addElementModalVisible = navigation.state.params && navigation.state.params.addElementModalVisible
    console.log('Edigin:', editing)
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={[styles.container, editing && { backgroundColor: this.backgroundAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [PRIMARY_DARK, tinycolor(PRIMARY_DARK).lighten(8).toString()]
        })}]}
      >
        <ButtonPanel
          editing={editing}
          setParams={navigation.setParams}
        />
        { editing && <PlusButton onPress={this.showAddElementModal} /> }
        { addElementModalVisible &&
          <AddElementModal
            onAccept={this.dismissAddelementModal}
            onCancel={this.dismissAddelementModal}
          /> }
      </Animated.View>
    )
  }
}

export default connect(null, dispatch => ({
  setBaseUrl: url => dispatch(setBaseUrl(url))
}))(Remote)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_DARK,
  },
})
