import { CREATE_BUTTON, SET_BASE_URL } from '../constants/actions'

export function createButton({type, value, length}){
  return {
    type: CREATE_BUTTON,
    payload: {
      type,
      value,
      length,
    },
  }
}

export function setBaseUrl(url) {
  return {
    type: SET_BASE_URL,
    payload: url,
  }
}

let pollInterval

export function captureIRCode() {
  return async (dispatch, getState) => {
    try {
      const response = await dispatch(startRecord())
      if (response.ok) {
        dispatch(checkForCapturedCode())
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

export function checkForCapturedCode() {
  return async (dispatch, getState) => {
    const { baseUrl } = getState().network

    if (pollInterval) clearInterval(pollInterval)

    // Check for IR code every second
    let pollCounter = 0
    pollInterval = setInterval(async () => {
      console.log('Checking...')
      const response = await fetch(`${baseUrl}/check`)
      const codeData = await response.json()
      if (codeData && codeData.value) {
        console.log('GOT A CODE!', codeData)
        clearInterval(pollInterval)
        dispatch(createButton(codeData))

      } else if (pollCounter > 15) {
        // give up
        dispatch(stopRecord())
        clearInterval(pollCounter)
      }
      pollCounter++
    }, 1000)
  }
}
