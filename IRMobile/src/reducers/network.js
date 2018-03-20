import {
  ADD_DEVICE_URL,
  REMOVE_DEVICE_URL,
  SET_DEVICE_URLS,
  SET_SCANNING,
  SET_TESTING,
  SET_IS_CONNECTED,
  SET_CONNECTION_TYPE,
} from '../constants/actions'

const initialState = {
  ipAddresses: [],
  scanning: false,
  testing: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_CONNECTED:
      return {
        ...state,
        isConnected: action.payload.isConnected,
      }

    case SET_CONNECTION_TYPE:
      return {
        ...state,
        connectionType: action.payload.connectionType,
      }
    case ADD_DEVICE_URL:
      return {...state, ipAddresses: [...state.ipAddresses, action.payload.url]}
    case SET_DEVICE_URLS:
      return { ...state, ipAddresses: action.payload.urls }
    case SET_SCANNING:
      return { ...state, scanning: action.payload.scanning }
    case SET_TESTING:
      return {...state, testing: action.payload.testing }
    case REMOVE_DEVICE_URL:
      return { ...state, ipAddresses: state.ipAddresses.filter(ipAddress => ipAddress !== action.payload.url)}
    default:
      return state
  }
}
