import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'



class HeaderMenuItem extends Component {
  render() {
    const { icon, text, onPress } = this.props
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress && onPress()}
      >
        <Icon
          name={icon}
          size={20}
          color="#666"
        />
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    )
  }
}

export default HeaderMenuItem

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
  }
})
