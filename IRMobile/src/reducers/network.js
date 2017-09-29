import { SET_DEVICE_URLS, SET_SCANNING } from '../constants/actions'

const initialState = {
  baseUrls: [],
  scanning: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DEVICE_URLS:
      return { ...state, baseUrls: action.payload.urls }
    case SET_SCANNING:
      return { ...state, scanning: action.payload.scanning }
    default:
      return state
  }
}
