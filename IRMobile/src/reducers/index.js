import { combineReducers } from 'redux'

import app from './app'
import buttons from './buttons'
import network from './network'
import panels from './panels'
import remotes from './remotes'
import settings from './settings'

const reducers = {
  app,
  buttons,
  network,
  panels,
  remotes,
  settings,
}

export default combineReducers(reducers)
