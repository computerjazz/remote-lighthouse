import { combineReducers } from 'redux'

import buttons from './buttons'
import network from './network'
import panels from './panels'

const reducers = {
  buttons,
  network,
  panels,
}

export default combineReducers(reducers)
