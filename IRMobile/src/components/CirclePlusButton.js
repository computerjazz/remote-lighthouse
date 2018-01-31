import React, { Component } from 'react' 
import PropTypes from 'prop-types'
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
    theme: PropTypes.string.isRequired,
  }

  render() {
    const { dragging, onPress, theme } = this.props
    const { CIRCLE_PLUS_ICON_COLOR, CIRCLE_PLUS_BUTTON_COLOR, BUTTON_TRASH_COLOR } = themes[theme]
    return (
      <TouchableOpacity style={[styles.container, { backgroundColor: CIRCLE_PLUS_BUTTON_COLOR }, dragging && {backgroundColor: BUTTON_TRASH_COLOR}]} onPress={onPress}>
        <Icon
          color={CIRCLE_PLUS_ICON_COLOR}
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
  theme: state.settings.theme,
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
