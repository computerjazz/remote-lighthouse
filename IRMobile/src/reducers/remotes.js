import { CREATE_REMOTE, CREATE_BUTTON_PANEL } from '../constants/actions'

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
          title: '',
          panels: [],
        }
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
    default:
      return state
  }
}
