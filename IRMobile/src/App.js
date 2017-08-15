import { StackNavigator } from 'react-navigation'

import ButtonPanel from './screens/ButtonPanel'

const App = StackNavigator({
  Home: { screen: ButtonPanel },
}, {
  initialRouteName: 'Home',
})

export default App
