import {
  CREATE_BUTTON,
  CREATE_BUTTON_PANEL,
  DELETE_BUTTON_PANEL,
} from '../constants/actions'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_BUTTON:
      return {
        ...state,
        [action.payload.panelId]: {
          ...state[action.payload.panelId],
          buttons: [
            ...state[action.payload.panelId].buttons,
            action.payload.buttonId,
          ]
        }
      }
    case CREATE_BUTTON_PANEL:
      return {
        ...state,
      [action.payload.panelId]: {
        type: action.payload.type,
        buttons: [],
        }
      }
    case DELETE_BUTTON_PANEL: {
      const keys = Object.keys(state)
      const newState = {}
      keys.forEach(key => {
        if (key !== action.payload.panelId) newState[key] = state[key]
      })
      return newState
    }
    default:
      return state
  }
}
