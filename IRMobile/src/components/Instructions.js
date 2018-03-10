import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform } from 'react-native'

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import {
  REMOTE_OPTIONS
} from '../constants/ui'

import { CustomLayoutLinear } from '../dictionaries/animations'
import {
  gotoinstructionStep,
  setEditMode,
  setCaptureMode,
} from '../actions'

const instructions = [{
  name: 'remote-title',
  text: `Hi! You're currently in 'edit' mode. Give your remote a name by tapping into this text field.`,
  style: {
    top: 60,
    left: 25,
    right: 25,
    position: 'absolute'
  },
  action: props => {
    if (!props.editing) props.setEditMode(true)
  },
  arrow: { icon: 'arrow-up-thick', position: 'above', style: { alignSelf: 'center' } },
  shouldAutoIncrement: (thisProps, nextProps) => thisProps.remote && thisProps.remote.title !== nextProps.remote.title
},{
  name: 'icon-customize',
  text: `Change this remote's icon.`,
  style: {
    top: 60,
    left: 25,
    right: 25,
    position: 'absolute'
  },
  action: props => {
    if (!props.editing) props.setEditMode(true)
  },
  arrow: { icon: 'arrow-up-thick', position: 'above', style: { alignSelf: 'flex-start' } },
  shouldAutoIncrement: (thisProps, nextProps) => nextProps.headerModal === REMOTE_OPTIONS
},{
  name: 'add-panel',
  text: `Add more buttons to this remote`,
  button: 'plus',
  style: {
    bottom: 130,
    left: 25,
    right: 25,
    position: 'absolute',
  },
  action: props => {
    if (!props.editing) {
      props.setCaptureMode(false)
      props.setEditMode(true)
    }
  },
  arrow: { icon: 'arrow-down-thick', position: 'below', style: { alignSelf: 'flex-end', marginRight: 85 } },
  shouldAutoIncrement: (thisProps, nextProps) => nextProps.editing && nextProps.modalVisible === 'addPanel' && !nextProps.headerModal
},{
  name: 'button-customize',
  text: `Press any button to customize its icon and label.`,
  action: props => {
    if (!props.editing) {
      props.setCaptureMode(false)
      props.setEditMode(true)
    }
  },
  style: {
    top: 200,
    left: 25,
    right: 25,
    position: 'absolute',
  },
  arrow: { icon: 'arrow-down-thick', position: 'below', style: { opacity: 0 } },
  shouldAutoIncrement: (thisProps, nextProps) => nextProps.editing && nextProps.modalVisible === 'editButton' && !nextProps.headerModal
},{
  name: 'capture-begin',
  text: `Go to 'capture' mode to assign buttons from a real-life remote`,
  button: 'remote',
  action: props => {
    if (!props.editing) {
      props.setCaptureMode(false)
      props.setEditMode(true)
    }
  },
  style: {
    bottom: 130,
    left: 25,
    right: 25,
    position: 'absolute',
  },
  arrow: { icon: 'arrow-down-thick', position: 'below', style: { alignSelf: 'flex-end', marginRight: 10 } },
  shouldAutoIncrement: (thisProps, nextProps) => !thisProps.capturing && nextProps.capturing
},{
  name: 'capture-listen',
  text: "Press the button you wish to assign. It'll flash red to let you know it's in listening mode. The lighthouse will flash red too.",
  action: props => {
    if (!props.capturing) {
      props.setEditMode(false)
      props.setCaptureMode(true)
    }
  },
  style: {
    top: 200,
    left: 25,
    right: 25,
    position: 'absolute',
  },
  arrow: { icon: 'arrow-down-thick', position: 'below', style: { opacity: 0 } },
  shouldAutoIncrement: (thisProps, nextProps) => !thisProps.capturingButtonId && !!nextProps.capturingButtonId
},{
  name: 'capture-point',
  text: `Now point your real-life remote at the lighthouse and press its corresponding button.

When the capture is compolete, the lighthouse and button will both flash green.`,
  action: props => {
    if (!props.capturing) {
      props.setEditMode(false)
      props.setCaptureMode(true)
    }
  },
  style: {
    top: 200,
    left: 25,
    right: 25,
    position: 'absolute',
  },
  arrow: { icon: 'arrow-down-thick', position: 'below', style: { opacity: 0 } },
  shouldAutoIncrement: (thisProps, nextProps) => !!thisProps.capturingButtonId && thisProps.buttons[thisProps.capturingButtonId].value !== nextProps.buttons[thisProps.capturingButtonId].value
},{
  name: 'done',
  text: `To leave 'edit' mode press 'Done'`,
  style: {
    opacity: 1, // Note: LayoutAnimation weirdness -- Android is hiding this if opacity is not set
    top: 60,
    left: 25,
    right: 25,
    position: 'absolute',
  },
  action: props => {
    if (!props.capturing && !props.editing) {
      props.setEditMode(false)
      props.setCaptureMode(true)
    }
  },
  arrow: { icon: 'arrow-up-thick', position: 'above', style: { alignSelf: 'flex-end' } },
  shouldAutoIncrement: (thisProps, nextProps) => (thisProps.editing && !nextProps.editing && !nextProps.capturing) || (thisProps.capturing && !nextProps.capturing && !nextProps.editing)
},{
  name: 'menu',
  text: `Your remote is ready to use! You can go back into 'edit' mode from the header menu.

You can also add and delete remotes, and easily share remotes with other people!`,
  style: {
    top: 60,
    left: 25,
    right: 25,
    position: 'absolute',
  },
  button: 'dots-vertical',
  arrow: { icon: 'arrow-up-thick', position: 'above', style: { alignSelf: 'flex-end' } },
  action: props => {
    props.setCaptureMode(false)
    props.setEditMode(false)
  },
  shouldAutoIncrement: (thisProps, nextProps) => !thisProps.headerMenuVisible && nextProps.headerMenuVisible
},
]

class Instructions extends Component {
  componentWillMount() {
    const { instructionStep } = this.props
    if (instructionStep > -1) {
      this.setAction(this.props)
    }
    // End instructions if the step increments to the end
    if (instructionStep >= instructions.length) this.props.gotoinstructionStep(-1)

  }

  componentWillReceiveProps(nextProps) {
    const currentInstructions = instructions[nextProps.instructionStep]
    if (!currentInstructions) return

    if (this.props.instructionStep !== nextProps.instructionStep) {
      this.setAction(nextProps)
    }

    if (currentInstructions.shouldAutoIncrement(this.props, nextProps)) {
      this.gotoStep(nextProps.instructionStep + 1)
    }
  }

  gotoStep = (step) => {
    if (step < instructions.length&& instructions[step].name!== "capture-listen") LayoutAnimation.configureNext(CustomLayoutLinear)
    this.props.gotoinstructionStep(step)
  }

  setAction(props) {
    const { instructionStep: step } = props
    instructions[step] &&
    instructions[step].action &&
    instructions[step].action(props)
  }

  renderButton(name) {
    return (
      <View key="button" style={{ flexDirection: 'row', paddingBottom: 15, justifyContent: 'center' }}>
        <View style={{ transform: [{translateX: 15}, { rotate: '45deg' }]}}>
          <Icon name="gesture-tap" color="#666" size={40} />
        </View>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 30,
          height: 30, padding: 5,
          borderRadius: 20,
          backgroundColor: '#666'
        }}
        >
          <Icon name={name} size={20} color="#fff" />
        </View>
      </View>
    )
  }

  renderArrow(arrow, isAbove) {
    return (
      <View style={[arrow.style, { transform: [{ translateY: isAbove ? Platform.OS === 'ios' ? 12 : 8 : -8 }]}]}>
        <Icon name={arrow.icon} size={40} color="#fff" />
      </View>
    )
  }

  render() {
    const { instructionStep, headerMenuVisible, modalVisible } = this.props
    const step = instructions[instructionStep]
    if (!step || modalVisible || headerMenuVisible) return null
    return (
      <View pointerEvents="box-none" style={styles.container}>
        <View style={step.style}>
          {step.arrow && step.arrow.position === "above" && this.renderArrow(step.arrow, true)}
          <View style={{ padding: 10, backgroundColor: 'white', borderRadius: 3}}>
            {step.button && this.renderButton(step.button)}
            <Text style={[styles.text]}>{step.text}</Text>
            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => this.props.gotoinstructionStep(-1)}
              >
                <Text>End</Text>
              </TouchableOpacity>
              {instructionStep < instructions.length - 1 && (
                <TouchableOpacity
                  onPress={() => this.gotoStep(instructionStep + 1)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ marginRight: 5 }}>Next</Text>
                  <Icon name="skip-next" size={20} color="#333" />
                  </TouchableOpacity>
              )}
            </View>
          </View>
          {step.arrow && step.arrow.position === "below" && this.renderArrow(step.arrow, false)}
        </View>
      </View>
    )
  }
}

export default connect(state => {
  const { currentRemoteId } = state.app
  const remote = state.remotes[currentRemoteId]

  return {
    capturingButtonId: state.app.capturingButtonId,
    headerMenuVisible: state.app.headerMenuVisible,
    modalVisible: state.app.modalVisible,
    headerModal: state.app.headerModal,
    instructionStep: state.settings.instructionStep,
    editing: state.app.editing,
    capturing: state.app.capturing,
    remote,
    buttons: state.buttons,
  }
}, {
  gotoinstructionStep,
  setEditMode,
  setCaptureMode,
})(Instructions)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.9,
  },
  text: {
    color: '#444',
    fontWeight: '200',
    fontSize: 14,
  }
})
