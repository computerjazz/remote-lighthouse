import { combineReducers } from 'redux'

import buttons from './buttons'
import network from './network'

const reducers = {
  buttons,
  network,
}

export default combineReducers(reducers)
