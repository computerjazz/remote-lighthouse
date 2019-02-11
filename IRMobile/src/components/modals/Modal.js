import React, { Component } from 'react'
import { connect } from 'react-redux'
import modals from "./"

class Modal extends Component {
  render() {
    const { headerModal } = this.props
    const GeneralModal = modals[headerModal]
    return headerModal ? <GeneralModal /> : null
  }
}

const mapStateToProps = state => ({
  headerModal: state.app.headerModal,
})

export default connect(mapStateToProps)(Modal)