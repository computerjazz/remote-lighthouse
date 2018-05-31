import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import Header from '../components/header'
import Footer from '../components/footer'
import AppLogic from '../components/AppLogic'
import './index.css'

const initialState = {
  isMobile: false,
  width: 0,
}

const appReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_IS_MOBILE':
      return {
        ...state,
        isMobile: action.payload,
      }
    case 'SET_WIDTH':
      return {
        ...state,
        width: action.payload,
      }
    default:
      return state
  }
}

const reducers = {
  app: appReducer,
}

const reducer = combineReducers(reducers)
const store = createStore(reducer)

const BREAKPOINT = 650

class Layout extends Component {

  render() {
    const { children, data } = this.props
    return (
      <Provider store={store}>
      <div>
        <AppLogic />
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
          ]}
        />
        <Header siteTitle={data.site.siteMetadata.title} />
        <div
          style={{
            margin: '0 auto',
            maxWidth: 960,
            padding: '0px 1.0875rem 1.45rem',
            paddingTop: 0,
          }}
        >
          {children()}
        </div>
        <Footer />
      </div>
    </Provider>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.func,
}

export default Layout

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
