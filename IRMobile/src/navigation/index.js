import { StackNavigator } from 'react-navigation'

import RemoteContainer from '../components/RemoteContainer'


const Navigator = StackNavigator({
  Remote: { screen: RemoteContainer },
  }, {
  initialRouteName: 'Remote',
  headerMode: 'float',
})

export default Navigator
