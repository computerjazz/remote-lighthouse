import branch from 'react-native-branch'
import { importRemote, setEditMode, gotoInstructionStep } from '../actions'

// Set ttl to 0 to prevent duplicates
branch.initSessionTtl = 0

let previousTimestamp = 0

export default dispatch => {
  branch.subscribe(bundle => {
    if (bundle && bundle.params && !bundle.error) {
      const timestamp = bundle.params['+click_timestamp']
      if (timestamp === previousTimestamp) {
        return
      }
      previousTimestamp = timestamp
      // grab deep link data and route appropriately.
      if (bundle.params.remote) {
        // Fix branch issue on android that double-escapes strings
        if (typeof bundle.params.remote == 'string') {
          const __unescaped = bundle.params.remote.replace(/\\/g, "");
          bundle.params.remote = JSON.parse(__unescaped);
        }
        try {
          dispatch(gotoInstructionStep(-1))
          dispatch(setEditMode(false))
          dispatch(importRemote(bundle.params.remote))
        } catch(err) {
          console.log('## branch error', err)
        }
      }
    }
  })
}
