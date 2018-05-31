import React, { Component } from 'react'
import Link from 'gatsby-link'
import { connect } from 'react-redux'

import hero from '../img/hero-3.jpg'
import phones from '../img/phones.png'

class IndexPage extends Component {

  render() {
    const { isMobile, width } = this.props
    return (
      <div>

        <img src={hero} alt="hero" style={{
          position: 'absolute',
          top: isMobile ?  -width * .1 : -width * 0.18,
          left: 0,
          zIndex: -999,
        }} />

      <div style={{
        display: 'flex',
        justifyContent: isMobile ? 'flex-end' : 'flex-end',

      }}>
      <img src={phones} alt="phones" style={{
        position: isMobile ? 'relative' : 'absolute',
        right: isMobile ? 0 : 100,
        top: 120,
        height: '100%',
        alignSelf: 'center',
        pointerEvents: 'none',
        zIndex: 2,
        height: isMobile ? 200 : width * .4,
      }}/>
    </div>
        <div style={{
          backgroundColor: 'white',
          boxShadow: '1px 0px 4px #ccc',
          padding: isMobile ? '30px 40px' : '80px 50px',
          opacity: 0.9,
          marginTop: isMobile ? width/2 * .28 : width * .44 ,
        }}>
        <h1>The only remote you need.</h1>
        <p>Remote Lighthouse controls your TV, stereo, air conditioner, and anything else that came with an infrared remote. Build your own button configurations or combine multiple remotes in the button editor. Share your remotes with family and friends with a single link!</p>
        <p>Throw away all your other remotes. If you can find them.</p>

      </div>
      </div>
    )
  }
}

export default connect(state => {
  return {
    isMobile: state.app.isMobile,
    width: state.app.width,
  }
})(IndexPage)
