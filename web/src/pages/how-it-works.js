import React from 'react'
import Link from 'gatsby-link'

const SecondPage = () => (
  <div>
  <div style={{
    backgroundColor: '#333',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 270,
    zIndex: -999,
  }} />
  <div style={{
    marginTop: 250,
    color: '#333',
    backgroundColor: 'white',
    opacity: 0.9,
    padding: '20px 50px',
  }}>
    <h1>How does a remote work anyway?</h1>
    <p>When you point a remote at an electronic device and press a button, a beam of infrared light flashes very quickly in a pattern that the device recognizes as a control code. This "code" is nothing more than a number that's been encoded in the flashes of light.</p>
    <p>When you point your remote at a Lighthouse and press a button, the lighthouse keeps track of those numbers and sends them back to your phone. Once your phone knows which numbers to call, it can talk to all of your devices, as if you were pressing buttons on the remote.</p>
    <div style={{
      padding: 50
    }}>
    <h3>Specs & Requirements</h3>
    <ul>
      <li>Built by hand out of walnut and mahogany</li>
      <li>8 high-powered infrared LEDs</li>
      <li>WiFi controlled</li>
      <li>Approximate 20 ft range</li>
    </ul>
  </div>
  </div>
</div>
)

export default SecondPage
