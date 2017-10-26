import React, { Component } from 'react'
import { AsyncStorage, View, StatusBar } from 'react-native'
import { compose, applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import codePush from "react-native-code-push";

import Navigator from './navigation'
import LinkHandler from './components/LinkHandler'
import MainMenu from './components/menu/MainMenu'
import reducers from './reducers'

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME
}

const store = createStore(
  reducers,
  undefined,
  compose(
    applyMiddleware(thunk, logger),
    autoRehydrate()
  )
)

persistStore(store, {
  storage: AsyncStorage,
  //blacklist: ['app', 'network', 'settings'],
})
 //.purge()

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
          <Navigator />
          <MainMenu />
          <LinkHandler />
        </View>
      </Provider>
    )
  }
}

export default codePush(codePushOptions)(App)
