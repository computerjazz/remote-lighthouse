import { combineReducers } from 'redux'

import app from './app'
import network from './network'
import remotes from './remotes'
import panels from './panels'
import buttons from './buttons'

const reducers = {
  app,
  buttons,
  network,
  panels,
  remotes,
}

export default combineReducers(reducers)
