import {
  CHANNEL_VOLUME,
  CUSTOM_1,
  CUSTOM_2,
  CUSTOM_3,
  CUSTOM_4,
  MEDIA_PLAYBACK,
  UP_DOWN,
  VOLUME,
  POWER,
  NUMBER_PAD,
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
    icons: [
      ['record', 'play', 'pause', 'stop'],
      ['skip-backward', 'fast-forward', 'rewind', 'skip-forward'],
    ]
  },
  [CHANNEL_VOLUME]: {
    title: 'Channel/Volume',
    icons: [
      ['chevron-up', 'volume-high'],
      ['chevron-down', 'volume-medium'],
    ]
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
  },
  [NUMBER_PAD]: {
    title: 'Number pad',
    icons: [
      ['numeric-1-box', 'numeric-2-box', 'numeric-3-box'],
      ['numeric-4-box', 'numeric-5-box', 'numeric-6-box'],
      ['numeric-7-box', 'numeric-8-box', 'numeric-9-box'],
      ['cat', 'numeric-0-box', 'cat'],
    ]
  }
}
