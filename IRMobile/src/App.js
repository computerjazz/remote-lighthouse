import React, { Component } from 'react'
import { StackNavigator } from 'react-navigation'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import Navigator from './navigation'
import reducers from './reducers'

let store = createStore(reducers)


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigator />
      </Provider>)
  }
}

export default App
