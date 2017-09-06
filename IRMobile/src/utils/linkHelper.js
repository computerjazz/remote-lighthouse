import branch from 'react-native-branch'

import { importRemote, setEditMode } from '../actions'

export default dispatch => {
  branch.subscribe(bundle => {
    if (bundle && bundle.params && !bundle.error) {
      // grab deep link data and route appropriately.
      console.log('GOT A BUNDLE!!!!', bundle)
      if (bundle.params.remote) {
        dispatch(setEditMode(false))
        dispatch(importRemote(bundle.params.remote))
      }
    }
  })
}
