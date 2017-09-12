import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { TabBarBottom } from 'react-navigation'
import themes from '../../constants/themes'

class TabBar extends Component {
  render(){
    const {
      TAB_BACKGROUND_COLOR_ACTIVE,
      TAB_BACKGROUND_COLOR_INACTIVE,
      TAB_LABEL_COLOR_ACTIVE,
      TAB_LABEL_COLOR_INACTIVE,
    } = themes[this.props.theme]
    return (
      <TabBarBottom
        {...this.props}
        activeBackgroundColor={TAB_BACKGROUND_COLOR_ACTIVE}
        inactiveBackgroundColor={TAB_BACKGROUND_COLOR_INACTIVE}
        activeTintColor={TAB_LABEL_COLOR_ACTIVE}
        inactiveTintColor={TAB_LABEL_COLOR_INACTIVE}
      />
    )
  }
}

const mapStateToProps = state => ({
  theme: state.settings.theme
})

export default connect(mapStateToProps)(TabBar)
