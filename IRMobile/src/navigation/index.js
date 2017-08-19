import { StackNavigator } from 'react-navigation'

import Remote from '../screens/Remote'


const Navigator = StackNavigator({
  Remote: { screen: Remote },
  }, {
  initialRouteName: 'Remote',
})

export default Navigator
