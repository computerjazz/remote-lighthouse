import { SET_BASE_URL } from '../constants/actions'

const initialState = {
  baseUrl: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_BASE_URL:
      return { ...state, baseUrl: action.payload }
    default:
      return state
  }
}
