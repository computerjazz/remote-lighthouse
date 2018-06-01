import React, { Component } from 'react'
import Link from 'gatsby-link'
import { connect } from 'react-redux'

import hero from '../img/hero.jpg'
import phones from '../img/phones.png'

const googlePlay = ''

class IndexPage extends Component {
  state = {
    hiwHover: false,
    buyHover: false,
  }

  render() {
    const { isMobile, width } = this.props
    return (
      <div>
        <img
          src={hero}
          alt="hero"
          style={{
            position: 'absolute',
            top: isMobile ? -width * 0.1 : -width * 0.18,
            left: 0,
            zIndex: -999,
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: isMobile ? 'flex-end' : 'flex-end',
          }}
        >
          <img
            src={phones}
            alt="phones"
            style={{
              position: isMobile ? 'relative' : 'absolute',
              right: isMobile ? 0 : 100,
              top: 120,
              height: '100%',
              alignSelf: 'center',
              pointerEvents: 'none',
              zIndex: 2,
              height: isMobile ? 200 : width * 0.4,
            }}
          />
        </div>
        <div
          style={{
            backgroundColor: 'white',
            boxShadow: '1px 0px 4px #ccc',
            padding: isMobile ? '30px 40px' : '80px 50px',
            opacity: 0.9,
            marginTop: isMobile ? width / 2 * 0.28 : width * 0.44,
          }}
        >
          <div>
            <h1>The only remote you need.</h1>
            <p>
              Remote Lighthouse controls your TV, stereo, air conditioner, and
              anything else that came with an infrared remote. Build your own
              button configurations or combine multiple remotes in the button
              editor. Share your remotes with family and friends with a single
              link!
            </p>
          </div>

          <div
            style={{
              marginTop: 40,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: 250,
              }}
            >
              <a href="https://play.google.com/store/apps/details?id=com.danielmerrill.remotelighthouse&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
                <img
                  alt="Get it on Google Play"
                  src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png"
                />
              </a>
            </div>
            <div style={{ width: 250, padding: 15 }}>
              <a
                href="https://itunes.apple.com/us/app/remote-lighthouse/id1384333664?mt=8"
                style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  background:
                    'url(https://linkmaker.itunes.apple.com/assets/shared/badges/en-us/appstore-lrg.svg) no-repeat',
                  width: 220,
                  height: 66,
                  backgroundSize: 'contain',
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Link
              onMouseOver={() => this.setState({ buyHover: true })}
              onMouseOut={() => this.setState({ buyHover: false })}
              to="/"
              style={{
                color: '#333',
                textDecoration: 'none',
                display: 'flex',
                padding: '5px 50px',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                border: '2px solid #333',
                width: 300,
                borderRadius: 10,
                height: 60,
                backgroundColor: this.state.buyHover
                  ? 'rgba(0, 0, 0, 0.1)'
                  : 'transparent',
              }}
            >
              Coming soon
            </Link>
            {isMobile && (
              <Link
                onMouseOver={() => this.setState({ hiwHover: true })}
                onMouseOut={() => this.setState({ hiwHover: false })}
                to="/how-it-works"
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  display: 'flex',
                  padding: '5px 50px',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 20,
                  marginBottom: 20,
                  justifyContent: 'center',
                  border: '2px solid #333',
                  width: 300,
                  borderRadius: 10,
                  height: 60,
                  backgroundColor: this.state.hiwHover
                    ? 'rgba(0, 0, 0, 0.1)'
                    : 'transparent',
                }}
              >
                How it works
              </Link>
            )}
          </div>
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
