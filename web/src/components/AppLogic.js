import React, { Component } from 'react'
import { connect } from 'react-redux'

const BREAKPOINT = 650

class AppLogic extends Component {

  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.props.dispatch({
      type: 'SET_WIDTH',
      payload: window.innerWidth,
    })

    this.props.dispatch({
      type: 'SET_IS_MOBILE',
      payload: window.innerWidth < BREAKPOINT,
    })
  }

  render() {
    return null
  }
}

export default connect()(AppLogic)
