import uuid from 'react-native-uuid'
import branch from 'react-native-branch'
import Zeroconf from 'react-native-zeroconf'
import _ from 'lodash'

import panelDefs from '../dictionaries/panels'
import { isAndroid } from '../utils'

import {
  ADD_DEVICE_URL,
  APP_FOREGROUND,
  SET_IS_CONNECTED,
  SET_CONNECTION_TYPE,
  ASSIGN_IR_CODE,
  CREATE_BUTTON_PANEL,
  CREATE_BUTTON,
  CREATE_REMOTE,
  DELETE_BUTTON_PANEL,
  DELETE_BUTTON,
  DELETE_REMOTE,
  GOTO_INSTRUCTIONS_STEP,
  REMOVE_DEVICE_URL,
  SET_CAPTURE_MODE,
  SET_CURRENT_REMOTE_ID,
  SET_DEVICE_URLS,
  SET_DRAGGING,
  SET_EDIT_MODE,
  SET_HEADER_MENU_VISIBLE,
  SET_HEADER_MODAL,
  SET_MODAL_VISIBLE,
  SET_RECORDING_BUTTON_ID,
  SET_SCANNING,
  SET_TESTING,
  SET_THEME,
  SET_REMOTE_ORDER,
  UPDATE_BUTTON,
  UPDATE_REMOTE,
} from '../constants/actions'

const zeroconf = new Zeroconf()

export function setIsForeground(isForeground) {
  return {
    type: APP_FOREGROUND,
    payload: {
      isForeground,
    }
  }
}

export function setIsConnected(isConnected) {
  return {
    type: SET_IS_CONNECTED,
    payload: {
      isConnected,
    }
  }
}

export function setConnectionType(connectionType) {
  return {
    type: SET_CONNECTION_TYPE,
    payload: {
      connectionType,
    }
  }
}

export function gotoInstructionStep(step) {
  return {
    type: GOTO_INSTRUCTIONS_STEP,
    payload: {
      step,
    }
  }
}

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

export function setRemoteOrder(list) {
  return {
    type: SET_REMOTE_ORDER,
    payload: {
      list,
    }
  }
}

export function importRemote(nestedRemote) {
  return dispatch => {
    try {
      const remoteAction = dispatch(createRemote())
      const { remoteId } = remoteAction.payload
      dispatch(updateRemote(remoteId, {title: nestedRemote.title, icon: nestedRemote.icon }))

      nestedRemote.panels.forEach(panel => {
        const panelId = uuid.v1()
        dispatch(createButtonPanelAction(remoteId, panelId, panel.type))

        panel.buttons.forEach(button => {
          const buttonAction = dispatch(createButton(button.icon, panelId))
          const { buttonId } = buttonAction.payload
          dispatch(editButton(buttonId, { title: button.title, icon: button.icon }))
          if (button.type && button.value && button.length) {
            dispatch(assignIRCode(buttonId, {
              type: button.type,
              value: button.value,
              length: button.length,
            }))

          }
        })
      })

      return {
        type: 'xxx',
        payload: nestedRemote,
      }
    } catch (err) {
      console.log('## importRemote error,', err)
    }
  }
}

export function exportRemote(remoteId) {
  return (dispatch, getState) => {
    const { remotes, panels, buttons } = getState()
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

export function getShareRemoteUrl(nestedRemote) {
  return async () => {
    const remote = isAndroid ? JSON.stringify(nestedRemote) : nestedRemote
    let branchUniversalObject = await branch.createBranchUniversalObject(
        `RemoteLighthouse-link-${Math.floor(Math.random() * 100000)}`, // canonical identifier
        {
          contentDescription: 'New shared remote!',
          contentMetadata: {
            customMetadata: { remote },
          }
        }
      )

    let linkProperties = {
      channel: 'internal',
    }

    let controlParams = {
      '$fallback_url': 'http://www.remotelighthouse.com',
      '$desktop_url': 'http://www.remotelighthouse.com',
      '$android_url': 'irmobile://',
    }
    let { url } = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
    return url
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

export function setScanning(scanning) {
  return {
    type: SET_SCANNING,
    payload: {
      scanning,
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
    if (!panelDefs[type]) return

    const panelId = uuid.v1()
    dispatch(createButtonPanelAction(remoteId, panelId, type))
    const icons = _.flatten(panelDefs[type].icons)
    icons.forEach(iconName => {
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

export function setDeviceUrls(urls) {
  return {
    type: SET_DEVICE_URLS,
    payload: {
      urls
    },
  }
}

export function addDeviceUrl(url) {
  return {
    type: ADD_DEVICE_URL,
    payload: {
      url,
    },
  }
}

export function removeDeviceUrl(url) {
  return {
    type: REMOVE_DEVICE_URL,
    payload: {
      url,
    }
  }
}

export function pingKnownDevices() {
  return async (dispatch, getState) => {
    const { ipAddresses, testing } = getState().network
    try {
      const responses = await Promise.all(ipAddresses.map(ipAddress => new Promise(res => {
        setTimeout(() => res({ ok: false, status: 400 }), 2000)
        fetch(`http://${ipAddress}/marco?blink=${testing ? 1 : 0}`).then(res).catch(res)
      })))
      const results = responses.map((result, i) => {
        if (result.ok && result.status === 200) {
          return ipAddresses[i]
        } else dispatch(removeDeviceUrl(ipAddresses[i]))
      })
      return results
    } catch (err) {
      console.log('## pingKnownDevices error', err)
    }
  }
}


let _zeroconfSetup = false
let _foundLighthouses = []

export function findDevicesOnNetwork() {
  return async dispatch => {
    zeroconf.stop()
    _foundLighthouses = []

    if (!_zeroconfSetup) {

      zeroconf.on('resolved', data => {
        if (data.txt && data.txt.app === 'remotelighthouse') {
          const lighthouseIp = data.addresses[0]
          if (!_foundLighthouses.includes(lighthouseIp)) _foundLighthouses.push(lighthouseIp)
        }
      })

      zeroconf.on('stop', () => {
        dispatch(setScanning(false))
        dispatch(setDeviceUrls(_foundLighthouses))
      })

      _zeroconfSetup = true
    }

    zeroconf.scan('http', 'tcp', 'local.')
    setTimeout(() => zeroconf.stop(), 2000)
    dispatch(setScanning(true))
  }
}

let pollInterval

export function captureIRCode(buttonId, onStatusChanged) {
  return async dispatch => {
    try {
      const response = await dispatch(startRecord(buttonId))
      if (response.ok) {
        dispatch(checkForCapturedCode(buttonId, onStatusChanged))
      }
    } catch (err) {
      console.log('## caputreIRCode err', err)
      if (pollInterval) clearInterval(pollInterval)
    }
  }
}

export function startRecord(buttonId) {
  return async (dispatch, getState) => {
    const { ipAddresses } = getState().network
    dispatch(setcapturingButtonId(buttonId))
    try {
      const response = await Promise.race(ipAddresses.map(ipAddress => fetch(`http://${ipAddress}/rec`)))
      return response
    } catch (err) {
      console.log('## startRecord error', err)
    }
  }
}

export function stopRecord() {
  return async (dispatch, getState) => {
    const { ipAddresses } = getState().network
    try {
      dispatch(setcapturingButtonId(null))
      ipAddresses.forEach(ipAddress => fetch(`http://${ipAddress}/stop`))
      if (pollInterval) clearInterval(pollInterval)
    } catch (err) {
      console.log('## stopRecord err', err)
    }
  }
}

export function setTestingMode(testing) {
  return {
    type: SET_TESTING,
    payload: {
      testing
    }
  }
}

export function clearRecordingState() {
  return async (dispatch, getState) => {
    const { ipAddresses } = getState().network
    try {
      ipAddresses.forEach(url => fetch(url + '/clear'))
    } catch (err) {
      console.log('## clearRecordingState err', err)
    }
  }
}

// Check for IR code every second
const POLL_INTERVAL = 1000
const MAX_TIMES_TO_CHECK_FOR_NEW_CODE = 10

export function checkForCapturedCode(buttonId, onStatusChanged = () => {}) {
  return async (dispatch, getState) => {
    const { ipAddresses } = getState().network
    try {

      if (pollInterval) clearInterval(pollInterval)

      let pollCounter = 0
      pollInterval = setInterval(async () => {

        const responses = await Promise.all(ipAddresses.map(ipAddress => fetch(`http://${ipAddress}/check`)))
        const parsedResponses = await Promise.all(responses.map(response => response.json()))
        const codeData = parsedResponses.find(item => item.value)
        if (codeData && codeData.value) {
          clearInterval(pollInterval)
          dispatch(assignIRCode(buttonId, codeData))
          onStatusChanged(true)
          dispatch(stopRecord())
        } else if (pollCounter > MAX_TIMES_TO_CHECK_FOR_NEW_CODE) {
          // Too much time has passed, give up
          clearInterval(pollInterval)
          onStatusChanged(false)
          dispatch(stopRecord())
        }
        pollCounter++
      }, POLL_INTERVAL)
    } catch (err) {
      pollInterval && clearInterval(pollInterval)
      console.log('## checkForCapturedCode err', err)
      onStatusChanged(false)
      dispatch(stopRecord())
    }
  }
}

export function transmitIRCode(buttonId) {
  return async (dispatch, getState) => {
    const { ipAddresses, testing } = getState().network
    const { type, value, length } = getState().buttons[buttonId]
    try {
      const responses = await Promise.all(ipAddresses.map(ipAddress => {
        const endpoint = `http://${ipAddress}/send?length=${length}&value=${value}&type=${type}&blink=${testing ? 1 : 0}`
        return fetch(endpoint)
      }))

      const text = await Promise.all(responses.map(response => response.text()))
      return text
    } catch (err) {
      console.log('## transmitIRCode err', err)
    }

  }
}
