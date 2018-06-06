import React from 'react'
import Link from 'gatsby-link'

const renderItem = (title, text) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 20,
    }}
  >
    <div style={{ flex: 1, textAlign: 'right', paddingRight: 40 }}>
      <h1>{title}</h1>
    </div>
    <div style={{ flex: 2, minWidth: 230, paddingRight: 20 }}>
      <p>{text}</p>
    </div>
  </div>
)

const SecondPage = () => (
  <div>
    <div
      style={{
        backgroundColor: '#333',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 270,
        zIndex: -999,
      }}
    />
    <div
      style={{
        marginTop: 250,
        color: '#333',
        backgroundColor: 'white',
        opacity: 0.9,
        padding: '20px 50px',
      }}
    >
      <div>
        {renderItem(
          'Setup',
          'When the Lighthouse boots up for the first time it creates a WiFi network. Connect to the Lighthouse and enter your own WiFi credentials.'
        )}
        {renderItem(
          'Create',
          'Design the layout of your remote in Edit mode. Add or move buttons and assign titles and icons. Add a blank remote or delete an existing remote from the main menu.'
        )}
        {renderItem(
          'Capture',
          'Put the app in Capture mode and select a button to assign. Then, point your physical remote at the Lighthouse and press its corresponding button.'
        )}
        {renderItem(
          'Use',
          "Once your button has been assigned, it's ready to use! Anyone on your WiFi can use the Lighthouse. No user accounts or pairing required."
        )}
        {renderItem(
          'Share',
          'Any remote you create can be shared with a simple link. Set up the TV remote and then text it to mom!'
        )}
      </div>

      <hr style={{ margin: 50 }} />

      <h3>How does a remote work anyway?</h3>
      <p>
        When you point a remote at an electronic device and press a button, a
        beam of invisible infrared light flashes very quickly in a pattern that
        the device recognizes as a control code. This "code" is nothing more
        than a number that's been encoded in the flashes of light.
      </p>
      <p>
        When you point your remote at a Lighthouse and press a button, the
        Lighthouse keeps track of those numbers and sends them back to your
        phone. Once your phone knows which numbers to flash, it can control all
        of your devices, as if you were pressing buttons on the remote.
      </p>
      <div
        style={{
          padding: 50,
        }}
      >
        <h3>Specs & Requirements</h3>
        <ul>
          <li>Built by hand out of walnut and mahogany</li>
          <li>8 high-powered infrared LEDs</li>
          <li>WiFi controlled</li>
          <li>Approximate 20 ft range</li>
        </ul>
      </div>

      <hr style={{ margin: '80px 50px' }} />

      <div>
        <h3>Privacy Policy</h3>
        <p>Remote Lighthouse does not store or transmit user data.</p>
      </div>
    </div>
  </div>
)

export default SecondPage
