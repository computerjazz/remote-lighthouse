import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import themes from '../constants/themes'

class CirclePlusButton extends Component {

  static propTypes = {
    onPress: PropTypes.func,
    dragging: PropTypes.bool,
  }

  static contextTypes = {
    theme: PropTypes.string,
  }

  render() {
    const { dragging, onPress } = this.props
    const { LIGHT_GREY, CIRCLE_PLUS_BUTTON_COLOR, BUTTON_TRASH_COLOR } = themes[this.context.theme]
    return (
      <TouchableOpacity style={[styles.container, { backgroundColor: CIRCLE_PLUS_BUTTON_COLOR }, dragging && {backgroundColor: BUTTON_TRASH_COLOR}]} onPress={onPress}>
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
