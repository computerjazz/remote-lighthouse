import {
  CREATE_REMOTE,
  CREATE_BUTTON_PANEL,
  DELETE_BUTTON_PANEL,
  UPDATE_REMOTE,
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
