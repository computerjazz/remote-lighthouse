import { combineReducers } from 'redux'

import buttons from './buttons'
import network from './network'
import panels from './panels'
import remotes from './remotes'

const reducers = {
  buttons,
  network,
  panels,
  remotes,
}

export default combineReducers(reducers)
