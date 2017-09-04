import uuid from 'react-native-uuid'

import panelDefs from '../dictionaries/panels'

import {
  ASSIGN_IR_CODE,
  CREATE_BUTTON,
  UPDATE_BUTTON,
  CREATE_BUTTON_PANEL,
  DELETE_BUTTON_PANEL,
  CREATE_REMOTE,
  UPDATE_REMOTE,
  DELETE_REMOTE,
  DELETE_BUTTON,
  SET_BASE_URL,
  SET_HEADER_MENU_VISIBLE,
  SET_EDIT_MODE,
  SET_CAPTURE_MODE,
  SET_CURRENT_REMOTE_ID,
  SET_RECORDING_BUTTON_ID,
  SET_DRAGGING,
  SET_MODAL_VISIBLE,
  SET_HEADER_MODAL,
  SET_THEME,
} from '../constants/actions'

export function createRemote() {
  const remoteId = uuid.v1()
  return {
    type: CREATE_REMOTE,
    payload: {
      remoteId,
    }
  }
}

export function updateRemote(remoteId, updatedRemote) {
  return {
    type: UPDATE_REMOTE,
    payload: {
      updatedRemote,
      remoteId,
    }
  }
}

export function deleteRemote(remoteId) {
  return {
    type: DELETE_REMOTE,
    payload: {
      remoteId,
    }
  }
}

export function importRemote(nestedRemote) {

}

export function exportRemote(remoteId) {
  return (dispatch, getState) => {
    const { remotes, panels, buttons } = getState()
    console.log('remotes', remotes)
    if (!remotes[remoteId]) alert('No remote found with this id ', remoteId)
    let nestedRemote = {
      ...remotes[remoteId],
      panels: remotes[remoteId].panels.map(panelId => {
        return {
          ...panels[panelId],
          buttons: panels[panelId].buttons.map(buttonId => ({...buttons[buttonId]}))
        }
      })
    }
    return nestedRemote
  }
}


export function setCurrentRemoteId(remoteId) {
  return {
    type: SET_CURRENT_REMOTE_ID,
    payload: {
      remoteId,
    }
  }
}

export function setTheme(theme) {
  return {
    type: SET_THEME,
    payload: {
      theme,
    }
  }
}

export function setHeaderMenu(visible) {
  return {
    type: SET_HEADER_MENU_VISIBLE,
    payload: {
      visible
    }
  }
}

export function setModalVisible(visible) {
  return {
    type: SET_MODAL_VISIBLE,
    payload: {
      visible,
    }
  }
}

export function setHeaderModal(modal) {
  return {
    type: SET_HEADER_MODAL,
    payload: {
      modal,
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
export function setCaptureMode(capturing) {
  return {
    type: SET_CAPTURE_MODE,
    payload: {
      capturing,
    }
  }
}

export function setDragging(dragging) {
  return {
    type: SET_DRAGGING,
    payload: {
      dragging,
    }
  }
}

export function setcapturingButtonId(buttonId) {
  return {
    type: SET_RECORDING_BUTTON_ID,
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
    type: UPDATE_BUTTON,
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
      dispatch(createButton(iconName, panelId))
    })
  }
}

export function deleteButtonPanel(panelId, remoteId) {
  return {
    type: DELETE_BUTTON_PANEL,
    payload: {
      panelId,
      remoteId,
    }
  }
}

export function setBaseUrl(url) {
  return {
    type: SET_BASE_URL,
    payload: url,
  }
}

let pollInterval

export function captureIRCode(buttonId, onStatusChanged) {
  return async (dispatch, getState) => {
    console.log('CAPTURING!!', buttonId)
    try {
      const response = await dispatch(startRecord(buttonId))
      if (response.ok) {
        dispatch(checkForCapturedCode(buttonId, onStatusChanged))
      }
    } catch (err) {
      console.log('## startRecord err', err)
      if (pollInterval) clearInterval(pollInterval)
    }
  }
}

export function startRecord(buttonId) {
  return async (dispatch, getState) => {
    console.log('START RECORD')
    dispatch(setcapturingButtonId(buttonId))
    const { baseUrl } = getState().network
    const response = await fetch(`${baseUrl}/rec`)
    return response
  }
}

export function stopRecord() {
  return async (dispatch, getState) => {
    const { baseUrl } = getState().network
    try {
      dispatch(setcapturingButtonId(null))
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

// Check for IR code every second
const POLL_INTERVAL = 1000
const MAX_TIMES_TO_CHECK_FOR_NEW_CODE = 5

export function checkForCapturedCode(buttonId, onStatusChanged = () => {}) {
  return async (dispatch, getState) => {
    const { baseUrl } = getState().network
    try {

      if (pollInterval) clearInterval(pollInterval)

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
          dispatch(stopRecord())
        } else if (pollCounter > MAX_TIMES_TO_CHECK_FOR_NEW_CODE) {
          // Too much time has passed, give up
          clearInterval(pollInterval)
          onStatusChanged(false)
          dispatch(stopRecord())
          console.log('MAX REACTHED, GIVING UP')
        }
        pollCounter++
      }, POLL_INTERVAL)
    } catch (err) {
      pollInterval && clearInterval(pollInterval)
      console.log('ERR!!!')
      onStatusChanged(false)
      dispatch(stopRecord())
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
