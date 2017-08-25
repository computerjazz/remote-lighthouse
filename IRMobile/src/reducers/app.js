import {
  SET_HEADER_MENU,
  SET_EDIT_MODE,
  SET_RECORDING_BUTTON_ID,
  SET_ADD_PANEL_MODAL_VISIBLE,
  SET_EDIT_BUTTON_MODAL_VISIBLE,
  SET_EDIT_BUTTON_ID,
} from '../constants/actions'

const initialState = {
  headerMenuVisible: false,
  editing: false,
  recordingButtonId: null,
  addPanelModalVisible: false,
  editButtonModalVisible: false,
  editButtonId: null,
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
    case SET_ADD_PANEL_MODAL_VISIBLE:
      return {
        ...state,
        addPanelModalVisible: action.payload.visible,
      }
    case SET_EDIT_BUTTON_MODAL_VISIBLE:
      return {
        ...state,
        editButtonModalVisible: action.payload.visible,
      }
    case SET_EDIT_BUTTON_ID:
      return {
        ...state,
        editButtonId: action.payload.buttonId,
      }
    default:
      return state
  }
}
