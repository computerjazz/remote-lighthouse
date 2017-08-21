import { ASSIGN_IR_CODE } from '../constants/actions'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case ASSIGN_IR_CODE:
      return {
        ...state,
        [action.payload.buttonId]: {
          type: action.payload.type,
          value: action.payload.value,
          length: action.payload.length,
        }
      }
    default:
      return state
  }
}
