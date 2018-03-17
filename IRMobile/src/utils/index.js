import {
  Platform,
  DeviceInfo,
  Dimensions,
} from 'react-native'

export const isAndroid = Platform.OS === 'android'
export const isIOS = Platform.OS === 'ios'
export const isIPhoneX = DeviceInfo.isIPhoneX_deprecated
export const iPhoneXOffset = isIPhoneX ? 22 : 0
const { height, width } = Dimensions.get('window')
export const HEIGHT = height
export const WIDTH = width
