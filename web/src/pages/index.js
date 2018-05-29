import React from 'react'
import Link from 'gatsby-link'

import hero from '../img/hero-2.jpg'
import phones from '../img/phones.png'

const IndexPage = () => (
  <div>
    <img src={hero} alt="hero" style={{
      position: 'absolute',
      top: 0, left: 0, bottom: 0, right: 0,
      zIndex: -999
    }} />
    <img src={phones} alt="phones" style={{
      pointerEvents: 'none',
      position: 'absolute',
      right: -30,
      top: 50,
      zIndex: 1,
    }}/>
    <div style={{
      backgroundColor: 'white',
      boxShadow: '1px 0px 4px #ccc',
      marginTop: 390,
      padding: '80px 50px',
      opacity: 0.9,
    }}>
    <h1>The only remote you need.</h1>
    <p>Remote Lighthouse controls your TV, stereo, air conditioner, and anything else that came with a remote. Build your own button configurations or combine multiple remotes in the button editor. Share your remotes with family and friends with a single link!</p>
    <p>So throw away all your other remotes. If you can find them.</p>

  </div>
  </div>
)

export default IndexPage
