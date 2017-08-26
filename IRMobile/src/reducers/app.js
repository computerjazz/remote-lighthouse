import {
  SET_HEADER_MENU,
  SET_EDIT_MODE,
  SET_RECORDING_BUTTON_ID,
  SET_DRAGGING,
} from '../constants/actions'

const initialState = {
  headerMenuVisible: false,
  editing: false,
  dragging: false,
  recordingButtonId: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_HEADER_MENU:
      return {
        ...state,
        headerMenuVisible: action.payload.visible,
      }

    case SET_EDIT_MODE:
      return {
        ...state,
        editing: action.payload.editing,
      }

    case SET_RECORDING_BUTTON_ID:
      return {
        ...state,
        recordingButtonId: action.payload.buttonId,
      }

    case SET_DRAGGING:
      return {
        ...state,
        dragging: action.payload.dragging,
      }

    default:
      return state
  }
}
