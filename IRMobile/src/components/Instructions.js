import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, PanResponder, Platform } from 'react-native'

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import instructions from '../dictionaries/instructions'

import { CustomLayoutLinear } from '../dictionaries/animations'
import {
  gotoInstructionStep,
  setEditMode,
  setCaptureMode,
} from '../actions'



class Instructions extends Component {
  componentWillMount() {
    const { instructionStep } = this.props
    if (instructionStep > -1) {
      this.setAction(this.props)
    }
    // End instructions if the step increments to the end
    if (instructionStep >= instructions.length) this.props.gotoInstructionStep(-1)
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
   })

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
    if (step < instructions.length && instructions[step].name!== "capture-listen") LayoutAnimation.configureNext(CustomLayoutLinear)
    this.props.gotoInstructionStep(step)
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
      <View style={styles.container} pointerEvents="box-none">
        <View style={step.style}>
          {step.arrow && step.arrow.position === "above" && this.renderArrow(step.arrow, true)}
          <View style={{ padding: 10, backgroundColor: 'white', borderRadius: 3}}>
            {step.button && this.renderButton(step.button)}
            <Text style={[styles.text]}>{step.text}</Text>
            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => this.props.gotoInstructionStep(-1)}
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
  gotoInstructionStep,
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
