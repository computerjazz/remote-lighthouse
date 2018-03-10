
let Navigator
export default function nav(state = null, action) {
  switch(action.type) {
    case "REPLACE_NAV_STATE": {
      return action.payload
    }

    case "SET_NAVIGATOR": {
      Navigator = action.payload
      return Navigator.router.getStateForAction({ type: 'Navigate/INIT'})
    }

    default:
      return Navigator ? Navigator.router.getStateForAction(action, state) : state
  }

}
