import React from 'react'
import Link from 'gatsby-link'
import { connect } from 'react-redux'

import { compose, withState } from 'recompose'

const Header = ({
  siteTitle,
  buyHover,
  setBuyHover,
  hiwHover,
  setHiwHover,
  isMobile,
}) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 99999,
      background: 'transparent',
    }}
  >
    <div
      style={{
        margin: '0 auto',
        padding: '1.45rem 1.0875rem',
        display: 'flex',
        flex: 1,
      }}
    >
      {isMobile ? (
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0 }}>
            <Link
              to="/"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: 30,
              }}
            >
              Remote Lighthouse
            </Link>
          </h1>
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0 }}>
            <Link
              to="/"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: 50,
              }}
            >
              Remote<br />
              Lighthouse
            </Link>
          </h1>
        </div>
      )}
      {!isMobile && (
        <Link
          onMouseOver={() => setHiwHover(true)}
          onMouseOut={() => setHiwHover(false)}
          to="/how-it-works"
          style={{
            color: 'white',
            textDecoration: hiwHover ? 'underline' : 'none',
            display: 'flex',
            padding: '5px 10px',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: 1,
            marginRight: 50,
            height: 60,
          }}
        >
          How it works
        </Link>
      )}

      {!isMobile && (
        <Link
          onMouseOver={() => setBuyHover(true)}
          onMouseOut={() => setBuyHover(false)}
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            padding: '5px 50px',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
            borderRadius: 10,
            marginRight: 50,
            height: 60,
            backgroundColor: buyHover ? 'rgba(230,126,34, 0.3)' : 'transparent',
          }}
        >
          Coming soon
        </Link>
      )}
    </div>
  </div>
)

export default compose(
  connect(state => ({ isMobile: state.app.isMobile })),
  withState('buyHover', 'setBuyHover', false),
  withState('hiwHover', 'setHiwHover', false)
)(Header)
