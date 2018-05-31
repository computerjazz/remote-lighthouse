import React, { Component } from 'react'

const icon = require('../img/icon.png')

class Footer extends Component {
  render() {
    return (
      <div style={{
          height: 200,
          backgroundColor: '#333',
          color: 'white',
          display: 'flex',
          justifyContent: "space-between",
          alignItems: 'center',
          padding: 50,
      }}>
      <div style={{ width: 125, height: 125}}>
      <img src={icon}  
      style={{
          width: 125,
          height: 125,
      }}/>
      </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
            {`© ${new Date().getFullYear()} Daniel Merrill `}
            </div>

      </div>
    )
  }
}

export default Footer