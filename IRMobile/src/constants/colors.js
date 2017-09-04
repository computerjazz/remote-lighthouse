import tinycolor from 'tinycolor2'

// Palette
// Add all colors here
export const LIGHT_PURPLE = '#534bae'
export const LIGHT_PURPLE_ANALOGOUS = tinycolor(LIGHT_PURPLE).analogous().toString()
export const DARK_BLUE = '#18227c'
export const DARK_BLUE_ANALOGOUS = tinycolor(DARK_BLUE).analogous().toString()
export const LIGHT_GREY = '#EEE'
export const MID_GREY = '#CCC'
export const DARK_GREY = '#333'
export const ORANGE = '#d35400'
export const EMERALD = '#27ae60'
export const POMEGRANATE = '#c0392b'
export const POMEGRANATE_ANALOGOUS = tinycolor(POMEGRANATE).complement().toString()
export const WHITE = 'white'
export const WHITE_TRANSLUCENT = 'rgba(255, 255, 255, 0.9)'
