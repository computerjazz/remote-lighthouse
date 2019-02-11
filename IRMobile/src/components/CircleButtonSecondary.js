import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native'
import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import themes from '../constants/themes'

class CircleButtonSecondary extends Component {

  static propTypes = {
    onPress: PropTypes.func,
    style: ViewPropTypes.style,
    theme: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["edit", "delete"])
  }

  render() {
    const { onPress, style, theme, type } = this.props
    const { 
      BUTTON_EDIT_ICON_COLOR, 
      BUTTON_EDIT_COLOR, 
      BUTTON_DELETE_COLOR,
    }  = themes[theme]
    const config = {
      edit: {
        iconColor: BUTTON_EDIT_ICON_COLOR,
        backgroundColor: BUTTON_EDIT_COLOR,
        icon: "pencil",
      },
      delete: {
        iconColor: BUTTON_EDIT_ICON_COLOR,
        backgroundColor: BUTTON_DELETE_COLOR,
        icon: "minus",
      }
    }
    return (
      <TouchableOpacity style={[styles.container, { backgroundColor: config[type].backgroundColor }, style]} onPress={onPress}>
        <Icon
          name={config[type].icon}
          color={config[type].iconColor}
          size={20}
        />
      </TouchableOpacity>
    )
  }
}

CircleButtonSecondary.defaultProps = {
  onPress: () => {},
  style: {},
  type: "edit",
}

const mapStateToProps = state => ({
  theme: state.settings.theme,
})

export default connect(mapStateToProps)(CircleButtonSecondary)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 100,
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
