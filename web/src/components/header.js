import React from 'react'
import Link from 'gatsby-link'

import { compose, withState } from 'recompose'

const Header = ({ siteTitle, buyHover, setBuyHover, hiwHover, setHiwHover }) => (
  <div
    style={{
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
            Remote<br/>
            Lighthouse
          </Link>
        </h1>
      </div>


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

          <Link
            onMouseOver={() => setBuyHover(true)}
            onMouseOut={() => setBuyHover(false)}
            to="/buy"
            style={{
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              padding: '5px 50px',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 0,
              border: '2px solid white',
              borderRadius: 10,
              marginRight: 50,
              height: 60,
              backgroundColor: buyHover ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
            }}

          >
            Buy
          </Link>
    </div>
  </div>
)

export default compose(
  withState('buyHover', 'setBuyHover', false),
  withState('hiwHover', 'setHiwHover', false)
)(Header)
