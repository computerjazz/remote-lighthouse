import {
  GENERAL,
  DEVICE,
  AUDIO,
  MEDIA,
  SCREEN,
} from '../constants/ui'

export default {
  [GENERAL]: {
    title: 'General',
    icons: [
      'check',
      'cancel',
      'checkbox-blank-outline',
      'checkbox-blank-circle-outline',
      'chevron-up',
      'chevron-down',
      'chevron-left',
      'chevron-right',
      'home',
      'pencil',
      'camera-timer',
      'wrench',
      'adjust',
      'menu',
      'lightbulb',
      'lightbulb-on-outline',
      'cake-variant',
      'martini',
      'cat',
    ]
  },
  [DEVICE]: {
    title: 'Device',
    icons: [
      'power',
      'projector',
      'printer',
      'air-conditioner',
      'camcorder',
      'camera',
      'monitor',
    ]
  },
  [MEDIA]: {
    title: 'Media',
    icons: [
      'play',
      'pause',
      'play-pause',
      'stop',
      'rewind',
      'fast-forward',
      'skip-previous',
      'skip-next',
      'step-backward',
      'step-forward',
      'step-backward-2',
      'step-forward-2',
    ]
  },
  [AUDIO]: {
    title: 'Audio',
    icons: [
      'volume-low',
      'volume-medium',
      'volume-high',
      'volume-minus',
      'volume-plus',
      'volume-mute',
      'volume-off',
      'music',
      'music-off',
    ],
  },
  [SCREEN]: {
    title: 'Screen',
    icons: [
      'brightness-1',
      'brightness-2',
      'brightness-3',
      'brightness-4',
      'brightness-5',
      'brightness-6',
      'brightness-7',
    ],
  }
}
