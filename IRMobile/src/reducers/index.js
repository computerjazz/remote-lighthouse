import { combineReducers } from 'redux'

import app from './app'
import buttons from './buttons'
import nav from './nav'
import network from './network'
import panels from './panels'
import remotes from './remotes'
import settings from './settings'

const reducers = {
  app,
  buttons,
  nav,
  network,
  panels,
  remotes,
  settings,
}

export default combineReducers(reducers)
