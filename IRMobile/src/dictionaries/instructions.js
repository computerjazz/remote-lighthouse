import {
  REMOTE_OPTIONS
} from '../constants/ui'

const instructions = [{
  name: 'remote-title',
  text: `Hi! You're currently in 'edit' mode. Give your remote a name by tapping into this text field.`,
  style: {
    top: 60,
    left: 25,
    right: 25,
    position: 'absolute'
  },
  action: props => {
    if (!props.editing) props.setEditMode(true)
  },
  arrow: { icon: 'arrow-up-thick', position: 'above', style: { alignSelf: 'center' } },
  shouldAutoIncrement: (thisProps, nextProps) => thisProps.remote && thisProps.remote.title !== nextProps.remote.title
},{
  name: 'icon-customize',
  text: `Change this remote's icon.`,
  style: {
    top: 60,
    left: 25,
    right: 25,
    position: 'absolute'
  },
  action: props => {
    if (!props.editing) props.setEditMode(true)
  },
  arrow: { icon: 'arrow-up-thick', position: 'above', style: { alignSelf: 'flex-start' } },
  shouldAutoIncrement: (thisProps, nextProps) => nextProps.headerModal === REMOTE_OPTIONS
},{
  name: 'add-panel',
  text: `Add more buttons to this remote`,
  button: 'plus',
  style: {
    bottom: 130,
    left: 25,
    right: 25,
    position: 'absolute',
  },
  action: props => {
    if (!props.editing) {
      props.setCaptureMode(false)
      props.setEditMode(true)
    }
  },
  arrow: { icon: 'arrow-down-thick', position: 'below', style: { alignSelf: 'flex-end', marginRight: 85 } },
  shouldAutoIncrement: (thisProps, nextProps) => nextProps.editing && nextProps.modalVisible === 'addPanel' && !nextProps.headerModal
},{
  name: 'button-customize',
  text: `Press any button to customize its icon and label.`,
  action: props => {
    if (!props.editing) {
      props.setCaptureMode(false)
      props.setEditMode(true)
    }
  },
  style: {
    top: 200,
    left: 25,
    right: 25,
    position: 'absolute',
  },
  arrow: { icon: 'arrow-down-thick', position: 'below', style: { opacity: 0 } },
  shouldAutoIncrement: (thisProps, nextProps) => nextProps.editing && nextProps.modalVisible === 'editButton' && !nextProps.headerModal
},{
  name: 'capture-begin',
  text: `Go to 'capture' mode to assign buttons from a real-life remote`,
  button: 'remote',
  action: props => {
    if (!props.editing) {
      props.setCaptureMode(false)
      props.setEditMode(true)
    }
  },
  style: {
    bottom: 130,
    left: 25,
    right: 25,
    position: 'absolute',
  },
  arrow: { icon: 'arrow-down-thick', position: 'below', style: { alignSelf: 'flex-end', marginRight: 10 } },
  shouldAutoIncrement: (thisProps, nextProps) => !thisProps.capturing && nextProps.capturing
},{
  name: 'capture-listen',
  text: "Press the button you wish to assign. It'll flash red to let you know it's in listening mode. The lighthouse will flash red too.",
  action: props => {
    if (!props.capturing) {
      props.setEditMode(false)
      props.setCaptureMode(true)
    }
  },
  style: {
    top: 200,
    left: 25,
    right: 25,
    position: 'absolute',
  },
  arrow: { icon: 'arrow-down-thick', position: 'below', style: { opacity: 0 } },
  shouldAutoIncrement: (thisProps, nextProps) => !thisProps.capturingButtonId && !!nextProps.capturingButtonId
},{
  name: 'capture-point',
  text: `Now point your real-life remote at the lighthouse and press its corresponding button.

When the capture is compolete, the lighthouse and button will both flash green.`,
  action: props => {
    if (!props.capturing) {
      props.setEditMode(false)
      props.setCaptureMode(true)
    }
  },
  style: {
    top: 200,
    left: 25,
    right: 25,
    position: 'absolute',
  },
  arrow: { icon: 'arrow-down-thick', position: 'below', style: { opacity: 0 } },
  shouldAutoIncrement: (thisProps, nextProps) => !!thisProps.capturingButtonId && thisProps.buttons[thisProps.capturingButtonId].value !== nextProps.buttons[thisProps.capturingButtonId].value
},{
  name: 'done',
  text: `To leave 'edit' mode press 'Done'`,
  style: {
    opacity: 1, // Note: LayoutAnimation weirdness -- Android is hiding this if opacity is not set
    top: 60,
    left: 25,
    right: 25,
    position: 'absolute',
  },
  action: props => {
    if (!props.capturing && !props.editing) {
      props.setEditMode(false)
      props.setCaptureMode(true)
    }
  },
  arrow: { icon: 'arrow-up-thick', position: 'above', style: { alignSelf: 'flex-end' } },
  shouldAutoIncrement: (thisProps, nextProps) => (thisProps.editing && !nextProps.editing && !nextProps.capturing) || (thisProps.capturing && !nextProps.capturing && !nextProps.editing)
},{
  name: 'menu',
  text: `Your remote is ready to use! You can go back into 'edit' mode from the header menu.

You can also add and delete remotes, and easily share remotes with other people!`,
  style: {
    top: 60,
    left: 25,
    right: 25,
    position: 'absolute',
  },
  button: 'dots-vertical',
  arrow: { icon: 'arrow-up-thick', position: 'above', style: { alignSelf: 'flex-end' } },
  action: props => {
    props.setCaptureMode(false)
    props.setEditMode(false)
  },
  shouldAutoIncrement: (thisProps, nextProps) => !thisProps.headerMenuVisible && nextProps.headerMenuVisible
},
]

export default instructions
