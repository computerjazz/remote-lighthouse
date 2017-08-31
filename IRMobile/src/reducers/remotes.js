import {
  CREATE_REMOTE,
  UPDATE_REMOTE,
  DELETE_REMOTE,
  CREATE_BUTTON_PANEL,
  DELETE_BUTTON_PANEL,
} from '../constants/actions'

const initialState = {
  list: [],
}

export default (state = initialState, action) => {
  switch(action.type) {
    case CREATE_REMOTE: {
      const newList = state.list.slice()
      newList.push(action.payload.remoteId)
      return {
        ...state,
        list: newList,
        [action.payload.remoteId]: {
          title: ' ',
          icon: 'cat',
          panels: [],
        }
      }
    }

    case UPDATE_REMOTE:
      return {
        ...state,
        [action.payload.remoteId]: {
          ...action.payload.updatedRemote,
        }
      }

    case DELETE_REMOTE: {
      const newState = {}
      Object.keys(state).forEach(key => {
        if (key !== action.payload.remoteId) newState[key] = state[key]
      })
      newState.list = state.list.filter(id => id !== action.payload.remoteId)
      return newState
    }


    case CREATE_BUTTON_PANEL:
      return {
        ...state,
        [action.payload.remoteId]: {
          ...state[action.payload.remoteId],
          panels: [
            ...state[action.payload.remoteId].panels,
            action.payload.panelId
          ]
        }
      }
    case DELETE_BUTTON_PANEL:
      return {
        ...state,
        [action.payload.remoteId]: {
          ...state[action.payload.remoteId],
          panels: state[action.payload.remoteId].panels.filter(id => id !== action.payload.panelId)
        }
      }
    default:
      return state
  }
}
