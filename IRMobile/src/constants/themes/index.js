import * as dark from './dark'
import * as light from './light'
import * as retro from './retro'
import * as fishing from './fishing'
import * as citrus from './citrus'

export const THEME_DARK = 'dark'
export const THEME_LIGHT = 'light'
export const THEME_RETRO = 'retro'
export const THEME_FISHING = 'fishing'
export const THEME_CITRUS = 'citrus'

export const list = [
  THEME_RETRO,
  THEME_FISHING, 
  THEME_CITRUS,
  THEME_LIGHT,
  THEME_DARK,
]

export default {
  dark,
  light,
  retro,
  fishing,
  citrus,
}
