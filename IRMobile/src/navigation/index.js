import { StackNavigator } from 'react-navigation'

import ButtonPanel from '../screens/ButtonPanel'


const navigator = StackNavigator({
  Home: { screen: ButtonPanel },
  }, {
  initialRouteName: 'Home',
})

export default navigator
