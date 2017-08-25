import { Platform, StatusBar } from 'react-native'

export const BUTTON_RADIUS = 3
export const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight
