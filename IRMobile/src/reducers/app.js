import {
  SET_HEADER_MENU_VISIBLE,
  SET_EDIT_MODE,
  SET_CAPTURE_MODE,
  SET_RECORDING_BUTTON_ID,
  SET_DRAGGING,
  SET_CURRENT_REMOTE_ID,
  SET_MODAL_VISIBLE,
} from '../constants/actions'

const initialState = {
  headerMenuVisible: false,
  editing: false,
  capturing: false,
  dragging: false,
  capturingButtonId: null,
  currentRemoteId: null,
  modalVisible: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_HEADER_MENU_VISIBLE:
      return {
        ...state,
        headerMenuVisible: action.payload.visible,
      }
    case SET_MODAL_VISIBLE:
      return {
        ...state,
        modalVisible: action.payload.visible,
      }

    case SET_EDIT_MODE:
      return {
        ...state,
        editing: action.payload.editing,
      }

      case SET_CAPTURE_MODE:
        return {
          ...state,
          capturing: action.payload.capturing,
        }

    case SET_RECORDING_BUTTON_ID:
      return {
        ...state,
        capturingButtonId: action.payload.buttonId,
      }

    case SET_CURRENT_REMOTE_ID:
      return {
        ...state,
        currentRemoteId: action.payload.remoteId,
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
