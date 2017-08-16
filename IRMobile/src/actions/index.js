import { CREATE_BUTTON } from '../constants/actions'

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
