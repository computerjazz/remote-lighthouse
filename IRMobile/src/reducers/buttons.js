import { CREATE_BUTTON } from '../constants/actions'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_BUTTON:
      return {
        ...state,
        [action.payload.value]: action.payload
      }
    default:
      return state
  }
}
