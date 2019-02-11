import React, { Component } from 'react'
import { View, StatusBar, YellowBox } from 'react-native'
import { compose, applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/lib/integration/react'
import storage from 'redux-persist/lib/storage'

import thunk from 'redux-thunk'
import logger from 'redux-logger'
import codePush from "react-native-code-push";

import Instructions from './components/Instructions'
import NoRemotes from './components/NoRemotes'
import OverlayMessage from './components/OverlayMessage'
import LinkHandler from './components/LinkHandler'
import LoadingScreen from './components/LoadingScreen'
import MainMenu from './components/menu/MainMenu'
import Modal from "./components/modals/Modal"
import Navigator from './navigation'
import reducers from './reducers'

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME
}

const persistConfig = {
  key: 'root',
  storage: storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStore(
  persistedReducer,
  undefined,
  compose(
    applyMiddleware(thunk, logger),
  )
)

const persistor = persistStore(store, {
  //blacklist: ['app', 'network', 'settings'],
})
// persistor.purge()

class App extends Component {

  constructor(props) {
    super(props)
    const unsafe = ['componentWillMount', 'componentWillUpdate', 'componentWillReceiveProps']
    YellowBox.ignoreWarnings(unsafe.map(method => `Warning: ${method} is deprecated`));
  }


  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<LoadingScreen />}>
          <View style={{flex: 1}}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
            <Navigator />
            <MainMenu />
            <LinkHandler />
            <Instructions />
            <OverlayMessage />
            <NoRemotes />
            <Modal />
          </View>
        </PersistGate>
      </Provider>
    )
  }
}

export default codePush(codePushOptions)(App)
