import SettingsModal from './SettingsModal'
import SelectRemoteIconModal from './SelectRemoteIconModal'

import { REMOTE_OPTIONS, GENERAL_SETTINGS } from '../../constants/ui'

export default {
  [REMOTE_OPTIONS]: SelectRemoteIconModal,
  [GENERAL_SETTINGS]: SettingsModal,
}
