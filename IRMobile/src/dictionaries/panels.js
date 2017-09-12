import {
  CUSTOM_1,
  CUSTOM_2,
  CUSTOM_3,
  CUSTOM_4,
  MEDIA_PLAYBACK,
  UP_DOWN,
  VOLUME,
  POWER,
} from '../constants/ui'

export default {
  [CUSTOM_1]: {
      title: 'Custom (1)',
      icons: ['cat'],
  },
  [CUSTOM_2]: {
    title: 'Custom (2)',
    icons: ['cat', 'cat'],
  },
  [CUSTOM_3]: {
    title: 'Custom (3)',
    icons: ['cat', 'cat', 'cat'],
  },
  [CUSTOM_4]: {
    title: 'Custom (4)',
    icons: ['cat', 'cat', 'cat', 'cat'],
  },
  [MEDIA_PLAYBACK]: {
    title: 'Media Playback',
    icons: ['rewind', 'play', 'pause', 'fast-forward'],
  },
  [UP_DOWN]: {
    title: 'Down/Up',
    icons: ['chevron-down','chevron-up']
  },
  [VOLUME]: {
    title: 'Volume',
    icons: ['volume-medium', 'volume-high']
  },
  [POWER]: {
    title: 'Power',
    icons: ['power'],
  }
}
