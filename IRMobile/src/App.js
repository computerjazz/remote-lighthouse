import React, { Component } from 'react'
import {AsyncStorage} from 'react-native'
import { compose, applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import { persistStore, autoRehydrate } from 'redux-persist'


import Navigator from './navigation'
import reducers from './reducers'

const store = createStore(
  reducers,
  undefined,
  compose(
    applyMiddleware(),
    autoRehydrate()
  )
)

persistStore(store, { storage: AsyncStorage })

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigator />
      </Provider>)
  }
}

export default App
