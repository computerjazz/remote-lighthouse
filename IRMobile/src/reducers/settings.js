import {
  SET_THEME,
  GOTO_INSTRUCTIONS_STEP,
} from '../constants/actions'

const initialState = {
  theme: 'retro',
  instructionStep: 0,
}

export default (state = initialState, action) => {
  switch(action.type) {
    case SET_THEME:
      return {
        ...state,
        theme: action.payload.theme,
      }

    case GOTO_INSTRUCTIONS_STEP:
      return {
        ...state,
        instructionStep: action.payload.step,
      }

    default:
      return state
  }
}
