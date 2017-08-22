import { ASSIGN_IR_CODE, EDIT_BUTTON } from '../constants/actions'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case ASSIGN_IR_CODE:
      return {
        ...state,
        [action.payload.id]: {
          type: action.payload.type,
          value: action.payload.value,
          length: action.payload.length,
        }
      }

    case EDIT_BUTTON:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          title: action.payload.title,
          icon: action.payload.icon,
        }
      }
    default:
      return state
  }
}
