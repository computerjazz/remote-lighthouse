import uuid from 'react-native-uuid'

import panelDefs from '../dictionaries/panels'

import {
  ASSIGN_IR_CODE,
  CREATE_BUTTON,
  CREATE_BUTTON_PANEL,
  DELETE_BUTTON,
  EDIT_BUTTON,
  SET_BASE_URL,
  SET_HEADER_MENU,
  SET_EDIT_MODE,
  SET_RECORDING_BUTTON_ID,
  SET_ADD_PANEL_MODAL_VISIBLE,
  SET_EDIT_BUTTON_MODAL_VISIBLE,
  SET_EDIT_BUTTON_ID,
} from '../constants/actions'

export function setHeaderMenu(visible) {
  return {
    type: SET_HEADER_MENU,
    payload: {
      visible
    }
  }
}

export function setEditMode(editing) {
  return {
    type: SET_EDIT_MODE,
    payload: {
      editing,
    }
  }
}

export function setRecordingButtonId(buttonId) {
  return {
    type: SET_RECORDING_BUTTON_ID,
    payload: {
      buttonId,
    }
  }
}

export function setAddPanelModalVisible(visible) {
  return {
    type: SET_ADD_PANEL_MODAL_VISIBLE,
    payload: {
      visible,
    }
  }
}

export function setEditButtonModalVisible(visible) {
  return {
    type: SET_EDIT_BUTTON_MODAL_VISIBLE,
    payload: {
      visible,
    }
  }
}

export function setEditButtonId(buttonId) {
  return {
    type: SET_EDIT_BUTTON_ID,
    payload: {
      buttonId,
    }
  }
}

export function assignIRCode(buttonId, codeData) {
  console.log('ASSIGNING IR CODE TO BUTTON', buttonId, codeData)
  const { type, value, length } = codeData
  return {
    type: ASSIGN_IR_CODE,
    payload: {
      buttonId,
      type,
      value,
      length,
    },
  }
}

export function createButton(icon, panelId) {
  const buttonId = uuid.v1()
  return {
    type: CREATE_BUTTON,
    payload: {
       buttonId,
       icon,
       panelId,
      }
    }
}

export function deleteButton(buttonId) {
  return {
    type: DELETE_BUTTON,
    payload: {
      buttonId,
    }
  }
}

export function editButton(buttonId, { title, icon }) {
  return {
    type: EDIT_BUTTON,
    payload: {
      buttonId,
      title,
      icon,
    }
  }
}

const createButtonPanelAction = (remoteId, panelId, type) => ({
    type: CREATE_BUTTON_PANEL,
    payload: {
      remoteId,
      panelId,
      type,
    }
  })

export function createButtonPanel(type, remoteId) {
  return async (dispatch) => {
    const panelId = uuid.v1()
    if (!panelDefs[type]) return
    await dispatch(createButtonPanelAction(remoteId, panelId, type))
    panelDefs[type].icons.forEach(iconName => {
      console.log('CREATING BUTTON!!!!', iconName, panelId)
      dispatch(createButton(iconName, panelId))
    })
  }
}

export function setBaseUrl(url) {
  return {
    type: SET_BASE_URL,
    payload: url,
  }
}

let pollInterval

export function captureIRCode(buttonId, setRecordButton, onStatusChanged) {
  return async (dispatch, getState) => {
    console.log('CAPTURING!!', buttonId)
    try {
      const response = await dispatch(startRecord())
      if (response.ok) {
        dispatch(checkForCapturedCode(buttonId, setRecordButton, onStatusChanged))
      }
    } catch (err) {
      console.log('## startRecord err', err)
      if (pollInterval) clearInterval(pollInterval)
    }
  }
}

export function startRecord() {
  return async (dispatch, getState) => {
    console.log('START RECORD')
    const { baseUrl } = getState().network
    const response = await fetch(`${baseUrl}/rec`)
    return response
  }
}

export function stopRecord() {
  return async (dispatch, getState) => {
    const { baseUrl } = getState().network
    try {
      fetch(`${baseUrl}/stop`)
      if (pollInterval) clearInterval(pollInterval)
    } catch (err) {
      console.log('## stopRecord err', err)
    }
  }
}

export function clearRecordingState() {
  return async (dispatch, getState) => {
    const { baseUrl } = getState().network
    try {
      fetch(`${baseUrl}/clear`)
    } catch (err) {
      console.log('## clearRecordingState err', err)
    }
  }
}

const MAX_TIMES_TO_CHECK_FOR_NEW_CODE = 10

export function checkForCapturedCode(buttonId, setRecordButton = () => {}, onStatusChanged = () => {}) {
  return async (dispatch, getState) => {
    const { baseUrl } = getState().network
    try {

      if (pollInterval) clearInterval(pollInterval)

      // Check for IR code every second
      let pollCounter = 0
      pollInterval = setInterval(async () => {

        console.log('Checking...', pollCounter)

        const response = await fetch(`${baseUrl}/check`)
        const codeData = await response.json()
        if (codeData && codeData.value) {
          console.log('GOT A CODE!', codeData)
          clearInterval(pollInterval)
          dispatch(assignIRCode(buttonId, codeData))
          onStatusChanged(true)
          setRecordButton(null)
          console.log('GOT CODE')
        } else if (pollCounter > MAX_TIMES_TO_CHECK_FOR_NEW_CODE) {
          // Too much time has passed, give up
          dispatch(stopRecord())
          clearInterval(pollInterval)
          onStatusChanged(false)
          setRecordButton(null)
          console.log('MAX REACTHED')
        }
        pollCounter++
      }, 1000)
    } catch (err) {
      pollInterval && clearInterval(pollInterval)
      console.log('ERR!!!')
      onStatusChanged(false)
      setRecordButton(null)
    }
  }
}

export function transmitIRCode(buttonId) {
  return async (dispatch, getState) => {
    const { baseUrl } = getState().network
    console.log(getState().buttons)
    const { type, value, length } = getState().buttons[buttonId]
    console.log('TRANSMITTING CODE', value)

    const response = await fetch(`${baseUrl}/send?len=${length}&val=${value}&type=${type}`)
    const text = await response.text()
    console.log(text)
  }
}
