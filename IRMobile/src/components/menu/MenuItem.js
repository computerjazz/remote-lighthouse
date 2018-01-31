import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import themes from '../../constants/themes'

class HeaderMenuItem extends Component {

  static propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
  }

  render() {
    const { icon, text, onPress, theme } = this.props
    const { MENU_ICON_COLOR } = themes[theme]
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

const mapStateToProps = state => ({
  theme: state.settings.theme,
})

export default connect(mapStateToProps)(HeaderMenuItem)

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
