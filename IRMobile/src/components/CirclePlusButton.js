import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { LIGHT_GREY, CIRCLE_PLUS_BUTTON_COLOR, BUTTON_TRASH_COLOR } from '../constants/colors'

class CirclePlusButton extends Component {

  static propTypes = {
    onPress: PropTypes.func,
    dragging: PropTypes.bool,
  }

  render() {
    const { dragging, onPress } = this.props
    return (
      <TouchableOpacity style={[styles.container, dragging && {backgroundColor: BUTTON_TRASH_COLOR}]} onPress={onPress}>
        <Icon
          color={LIGHT_GREY}
          name={'plus'}
          size={35}
        />
      </TouchableOpacity>
    )
  }
}

CirclePlusButton.defaultProps = {
  onPress: () => {},
  dragging: false,
}

const mapStateToProps = state => ({
  dragging: state.app.dragging,
})

export default connect(
  mapStateToProps,
)(CirclePlusButton)

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CIRCLE_PLUS_BUTTON_COLOR,
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 100,
    bottom: 20,
    right: 20,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 3,
  },
})
