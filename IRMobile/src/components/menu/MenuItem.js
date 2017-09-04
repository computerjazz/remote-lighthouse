import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import themes from '../../constants/themes'

class HeaderMenuItem extends Component {

  static propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
  }

  static contextTypes = {
    theme: PropTypes.string,
  }

  render() {
    const { icon, text, onPress } = this.props
    const { MENU_ICON_COLOR } = themes[this.context.theme]
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress && onPress()}
      >
        <Icon
          name={icon}
          size={20}
          color={MENU_ICON_COLOR}
        />
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    )
  }
}

export default HeaderMenuItem

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
  }
})
