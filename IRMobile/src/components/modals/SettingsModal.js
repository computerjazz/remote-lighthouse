import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation,
} from 'react-native'
import { connect } from 'react-redux'
import packageJson from '../../../package.json';

import DraggableFlatlist from 'react-native-draggable-flatlist'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import CircleButtonSecondary from '../CircleButtonSecondary'
import TextButton from '../TextButton'
import {
  findDevicesOnNetwork,
  setHeaderModal,
  setTheme,
  setTestingMode,
  gotoInstructionStep,
  setRemoteOrder,
  deleteRemote,
  createRemote,
  createButtonPanel,
  setEditMode,
} from '../../actions'
import { isAndroid } from '../../utils'

import { BUTTON_RADIUS } from '../../constants/dimensions'
import { BLANK_SPACE, POWER } from '../../constants/ui'
import themes, { list as themeList } from '../../constants/themes'

class SelectRemoteIconModal extends Component {

  static propTypes = {
    ipAddresses: PropTypes.array.isRequired,
    findDevicesOnNetwork: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    scanning: PropTypes.bool.isRequired,
    setHeaderModal: PropTypes.func.isRequired,
    setTheme: PropTypes.func.isRequired,
    testing: PropTypes.bool.isRequired,
    setTestingMode: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    if (isAndroid) BackHandler.addEventListener('hardwareBackPress', this.captureAndroidBackPress)
    this.state = {
      selectedTheme: this.props.theme,
      deletable: false,
      counter: 0,
    }
  }

  captureAndroidBackPress = () => {
    this.props.onSubmit()
    BackHandler.removeEventListener('hardwareBackPress', this.captureAndroidBackPress)
    return true
  }

  onDonePress = () => {
    this.props.setHeaderModal(null)
    this.props.onSubmit()
  }

  renderThemeDemoButton = (themeName, index) => (
    <View key={index} style={[styles.themeDemoButton, { backgroundColor: themes[themeName].BUTTON_BACKGROUND_COLOR }]}>
      <View style={[styles.themeDemoButtonInner, { backgroundColor: themes[themeName].BUTTON_ICON_COLOR }]} />
    </View>
  )

  renderThemeOption = themeName => {
    const { OPTION_SELECTED_BACKGROUND_COLOR } = themes[this.props.theme]
    return (
      <TouchableOpacity
        key={themeName}
        onPress={() => {
          this.setState({ selectedTheme: themeName })
          this.props.setTheme(themeName)
        }}
        style={[styles.option, { backgroundColor: this.state.selectedTheme === themeName ? OPTION_SELECTED_BACKGROUND_COLOR : 'transparent' }]}
      >
        <View style={[styles.themeDemoButtonRow, { backgroundColor: themes[themeName].REMOTE_BACKGROUND_COLOR }]}>
          {[0, 0, 0].map((item, i) => this.renderThemeDemoButton(themeName, i))}
        </View>
      </TouchableOpacity>
    )
  }

  startTutorial = () => {
    this.onDonePress()
    this.props.gotoInstructionStep(0)
  }

  renderRemoteItem = ({ move, item }) => {
    const { icon, title, id } = item
    const { theme } = this.props

    const {
      HEADER_TITLE_COLOR,
      HEADER_BACKGROUND_COLOR,
      TEXT_COLOR_DARK,
    } = themes[theme]

    return (
      <View style={{ padding: 10, alignItems: 'center', width: 70 }}>
        <TouchableOpacity
          style={{
            backgroundColor: HEADER_BACKGROUND_COLOR,
            height: 50,
            width: 50,
            borderRadius: BUTTON_RADIUS,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            this.setState(state => ({ deletable: false, counter: state.counter + 1 }))
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
          }}
          onLongPress={() => {
            this.setState({ deletable: true })
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            move()
          }}
        >
          {!!icon && <Icon name={icon === BLANK_SPACE ? 'checkbox-blank-outline' : icon} size={30} color={HEADER_TITLE_COLOR} />}

        </TouchableOpacity>
        {this.state.deletable && (
          <CircleButtonSecondary
            type="delete"
            style={styles.deleteRemoteButton}
            onPress={() => {
              Alert.alert(
                `Delete Remote`,
                `Are you sure you want to delete ${title ? title : "this remote"}?`,
                [
                  { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                  { text: 'Delete', onPress: () => this.props.deleteRemote(id), style: 'destructive' },
                ],
              )
            }}
          />
        )}
        <Text
          numberOfLines={1}
          style={{
            color: TEXT_COLOR_DARK,
            fontWeight: '200',
            fontSize: 12,
            marginTop: 5,
          }}
          ellipsizeMode="tail"
        >{title}</Text>
      </View>

    )
  }

  onBackgroundTap = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    this.setState(state => ({ deletable: false, counter: state.counter + 1 }))
  }

  renderCategory = (title, color) => (
    <View>
      <Text style={{ color, fontWeight: '200', fontSize: 16, marginTop: 20, }}>{title}</Text>
      <View style={{ width: '100%', borderBottomColor: color, borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: 10, }} />
    </View>
  )

  render() {
    const { ipAddresses, scanning, theme } = this.props
    const { MODAL_BACKGROUND_COLOR, CIRCLE_PLUS_BUTTON_COLOR, TEXT_COLOR_DARK, TEXT_COLOR_LIGHT, BUTTON_ICON_COLOR, CIRCLE_PLUS_ICON_COLOR } = themes[theme]
    return (
      <View style={styles.wrapper} onStartShouldSetResponder={this.onBackgroundTap}>
        <View style={[styles.container, { backgroundColor: MODAL_BACKGROUND_COLOR }]}>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={{ padding: 20 }}
          >
            {this.renderCategory("Status", TEXT_COLOR_DARK)}

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>

              <Text style={{ color: TEXT_COLOR_DARK, fontWeight: '200', fontSize: 15, }}>{`${ipAddresses.length} lighthouse${ipAddresses.length === 1 ? '' : 's'} connected:`}</Text>
              {ipAddresses.map(url => <Text key={url} style={{ fontWeight: '200', fontSize: 13, color: TEXT_COLOR_DARK }}>{url}</Text>)}
            </View>


            <TouchableOpacity
              style={[styles.scanButton]}
              onPress={this.props.findDevicesOnNetwork}
            >
              {scanning ?
                <ActivityIndicator small color={TEXT_COLOR_DARK} /> :
                <Text style={{ color: TEXT_COLOR_DARK }}>Scan Network</Text>
              }
            </TouchableOpacity>

            {this.renderCategory("Order", TEXT_COLOR_DARK)}

            <View style={{
              marginVertical: 10,
              flexDirection: 'row',
            }}>
              <DraggableFlatlist
                horizontal
                data={this.props.remotes}
                renderItem={this.renderRemoteItem}
                keyExtractor={(item) => `${item.id}-${this.state.counter}`}
                stickyHeaderIndices={[0]}
                ListHeaderComponent={() => <View style={{ width: 50, alignItems: 'center', padding: 10, marginRight: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      const newRemote = this.props.createRemote()
                      const { remoteId } = newRemote.payload
                      this.props.createButtonPanel(POWER, remoteId)
                      this.props.setEditMode(true)
                    }}
                    style={{
                      backgroundColor: CIRCLE_PLUS_BUTTON_COLOR,
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 100,
                      elevation: 5,
                      shadowColor: 'black',
                      shadowOpacity: 0.2,
                      shadowOffset: {
                        width: 2,
                        height: 2,
                      },
                      shadowRadius: 3,
                    }}
                  >
                    <Icon name={"plus"} size={35} color={CIRCLE_PLUS_ICON_COLOR} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: TEXT_COLOR_DARK,
                      fontWeight: '200',
                      fontSize: 12,
                      marginTop: 5,
                    }}
                    ellipsizeMode="tail"
                  >{`New`}</Text>
                </View>}
                onMoveEnd={({ data, to, from, row }) => {
                  this.setState(state => ({ counter: state.counter + 1 }))
                  if (to !== from) {
                    this.props.setRemoteOrder(data.map(({ id }) => id))
                  }
                }}
              />

            </View>



            {this.renderCategory("Theme", TEXT_COLOR_DARK)}

            {themeList.map(this.renderThemeOption)}

            {this.renderCategory("Options", TEXT_COLOR_DARK)}

            <View style={{ paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ color: TEXT_COLOR_DARK, fontWeight: '200', fontSize: 16 }}>Testing Mode</Text>
                <Text style={{ color: TEXT_COLOR_DARK, fontSize: 12, fontWeight: '200' }}>Blink LED on transmit & discovery</Text>
              </View>
              <Switch
                thumbTintColor={isAndroid ? "#fff" : undefined}
                onValueChange={() => {
                  this.props.setTestingMode(!this.props.testing)
                }}
                onTintColor={BUTTON_ICON_COLOR}
                value={this.props.testing}
              />
            </View>
            <TouchableOpacity
              onPress={this.startTutorial}
              style={[styles.tutorialButton]}
            >
              <Text style={{ color: TEXT_COLOR_DARK }}>Redo Tutorial</Text>
            </TouchableOpacity>
            <Text style={{ alignSelf: 'center', marginTop: 20 }}>{`v${packageJson.version}`}</Text>
          </ScrollView>

          <View style={styles.confirmButtonContainer}>
            <TextButton
              text="Done"
              buttonStyle={styles.confirmButton}
              onPress={this.onDonePress}
            />
          </View>
        </View>
      </View>
    )
  }
}

SelectRemoteIconModal.defaultProps = {
  onSubmit: () => { },
}

const mapStateToProps = state => ({
  ipAddresses: state.network.ipAddresses,
  scanning: state.network.scanning,
  theme: state.settings.theme,
  testing: state.network.testing,
  remotes: state.remotes.list.map(id => ({
    ...state.remotes[id],
    id,
  })),
})

const mapDispatchToProps = (dispatch) => ({
  setRemoteOrder: order => dispatch(setRemoteOrder(order)),
  findDevicesOnNetwork: () => dispatch(findDevicesOnNetwork()),
  setHeaderModal: modal => dispatch(setHeaderModal(modal)),
  setTheme: theme => dispatch(setTheme(theme)),
  setTestingMode: isTesting => dispatch(setTestingMode(isTesting)),
  gotoInstructionStep: step => dispatch(gotoInstructionStep(step)),
  deleteRemote: remoteId => dispatch(deleteRemote(remoteId)),
  createRemote: () => dispatch(createRemote()),
  setEditMode: editing => dispatch(setEditMode(editing)),
  createButtonPanel: (type, remoteId) => dispatch(createButtonPanel(type, remoteId)),

})

export default connect(mapStateToProps, mapDispatchToProps)(SelectRemoteIconModal)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: BUTTON_RADIUS,
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 10,
    paddingVertical: 40,
  },
  categoryTitle: {
    marginTop: 10,
    fontSize: 15,
    borderBottomWidth: 0.5,
  },
  confirmButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    height: 60,
  },
  confirmButton: {
    padding: 20,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: BUTTON_RADIUS,
  },
  scanButton: {
    height: 40,
    padding: 10,
    margin: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BUTTON_RADIUS,
    borderWidth: 1,
    borderColor: '#333'
  },
  tutorialButton: {
    height: 40,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 40,
    marginBottom: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BUTTON_RADIUS,
    borderWidth: 1,
    borderColor: '#333'
  },
  scrollView: {
    flex: 6,
  },
  option: {
    padding: 10,
  },
  textInput: {
    flex: 1,
    height: 45,
    padding: 5,
    marginBottom: 13,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: 'rgba(0, 0, 0, .1)',
  },
  themeDemoButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: BUTTON_RADIUS
  },
  themeDemoButton: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    flex: 1,
    margin: 10,
    borderRadius: BUTTON_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30
  },
  themeDemoButtonInner: {
    padding: 10,
    borderRadius: 30
  },
  deleteRemoteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 15,
    width: 30,
    height: 30,
  }
})
