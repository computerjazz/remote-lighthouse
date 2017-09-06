import { connect } from 'react-redux'

import linkHelper from '../utils/linkHelper'

const LinkHandler = props => {
  linkHelper(props.dispatch)
  return null
}

export default connect()(LinkHandler)
