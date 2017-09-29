import {
  SET_THEME,
} from '../constants/actions'

const initialState = {
  theme: 'retro',
}

export default (state = initialState, action) => {
  switch(action.type) {
    case SET_THEME:
      return {
        ...state,
        theme: action.payload.theme,
      }
    default:
      return state
  }
}
