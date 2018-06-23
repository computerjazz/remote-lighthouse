import { REHYDRATE } from 'redux-persist'
import {
  APP_FOREGROUND,
  SET_HEADER_MENU_VISIBLE,
  SET_EDIT_MODE,
  SET_CAPTURE_MODE,
  SET_RECORDING_BUTTON_ID,
  SET_DRAGGING,
  SET_CURRENT_REMOTE_ID,
  SET_MODAL_VISIBLE,
  SET_HEADER_MODAL,
  DELETE_REMOTE,
  CREATE_REMOTE,
} from '../constants/actions'

const initialState = {
  capturing: false,
  capturingButtonId: null,
  currentRemoteId: null,
  dragging: false,
  editing: false,
  headerMenuVisible: false,
  headerModal: null,
  modalVisible: null,
  isForeground: true,
  isConnected: true,
  connectionType: null,
}

export default (state = initialState, action) => {
  switch (action.type) {

    case REHYDRATE: {
      const app = (action.payload && action.payload.app) ? action.payload.app : {}
      return {
        ...state,
        ...app,
        editing: false,
        capturing: false,
        headerModal: null,
        modalVisible: null,
      }
    }

    case APP_FOREGROUND:
      return {
        ...state,
        isForeground: action.payload.isForeground,
      }

    case CREATE_REMOTE:
      return {
        ...state,
        currentRemoteId: action.payload.remoteId,
      }

    case DELETE_REMOTE:
      return {
        ...state,
        currentRemoteId: null,
      }

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

    case SET_HEADER_MODAL:
      return {
        ...state,
        modalVisible: action.payload.modal,
        headerModal: action.payload.modal,
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
