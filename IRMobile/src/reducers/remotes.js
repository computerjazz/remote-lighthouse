import { CREATE_REMOTE, CREATE_BUTTON_PANEL } from '../constants/actions'

const initialState = {
  //@TODO: delete
  testRemote: {
    title: 'test remote',
    panels: []
  }
}

export default (state = initialState, action) => {
  switch(action.type) {
    case CREATE_REMOTE:
      return {
        ...state,
        [action.payload.remoteId]: {
          title: '',
          panels: [],
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
