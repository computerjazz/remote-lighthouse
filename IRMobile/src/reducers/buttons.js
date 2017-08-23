import { ASSIGN_IR_CODE, CREATE_BUTTON, DELETE_BUTTON, EDIT_BUTTON } from '../constants/actions'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {

    case CREATE_BUTTON:
      return {
        ...state,
        [action.payload.buttonId]: {
          icon: action.payload.icon,
          title: '',
        }
      }

    case DELETE_BUTTON: {
      const keys = Object.keys(state)
      let newState = {}
      keys.forEach(key => {
        if (key !== action.payload.buttonId) newState[key] = state[key]
      })
      return newState
    }

    case ASSIGN_IR_CODE:
      return {
        ...state,
        [action.payload.buttonId]: {
          ...state[action.payload.buttonId],
          type: action.payload.type,
          value: action.payload.value,
          length: action.payload.length,
        }
      }

    case EDIT_BUTTON:
      return {
        ...state,
        [action.payload.buttonId]: {
          ...state[action.payload.buttonId],
          title: action.payload.title,
          icon: action.payload.icon,
        }
      }

    default:
      return state
  }
}
