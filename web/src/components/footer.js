import React, { Component } from 'react'

const icon = require('../img/icon.png')

class Footer extends Component {
  render() {
    return (
      <div
        style={{
          flex: 1,
          backgroundColor: '#333',
          color: '#aaa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 50,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            minWidth: 200,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ height: 125, width: 125 }}>
            <img
              src={icon}
              style={{
                width: 125,
                height: 125,
              }}
            />
          </div>
        </div>

        <div
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            textAlign: 'center',
            minWidth: 200,
          }}
        >
          <span style={{ fontWeight: '700', fontSize: 24 }}>
            Throw away your other remotes.
          </span>
          <br />
          <span>If you can find them.</span>
        </div>

        <div
          style={{
            minWidth: 200,
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {`© ${new Date().getFullYear()} Daniel Merrill `}
        </div>
      </div>
    )
  }
}

export default Footer
