import tinycolor from 'tinycolor2'
import * as colors from '../colors'


export const PRIMARY_LIGHT = 'lightblue'
export const PRIMARY_LIGHT_ANALOGOUS = colors.LIGHT_PURPLE_ANALOGOUS
export const PRIMARY_DARK = 'darkblue'
export const PRIMARY_DARK_ANALOGOUS = colors.DARK_BLUE_ANALOGOUS

/*
* Function
* Assign colors & roles to specific components
*/

//Remote
export const BUTTON_EDIT_COLOR = colors.POMEGRANATE_ANALOGOUS
export const BUTTON_DELETE_COLOR = colors.POMEGRANATE
export const BUTTON_PLUS_COLOR = colors.POMEGRANATE
export const BUTTON_CAPTURE_COLOR = colors.POMEGRANATE_ANALOGOUS
export const BUTTON_ICON_COLOR = colors.PETER_RIVER
export const BUTTON_TEXT_COLOR = colors.PETER_RIVER
export const BUTTON_BACKGROUND_COLOR = 'white'
export const CAPTURING_IN_PROGRESS_COLOR = colors.POMEGRANATE
export const REMOTE_BACKGROUND_COLOR = colors.CLOUDS
export const STATUS_BAD_COLOR = colors.ORANGE
export const STATUS_GOOD_COLOR = colors.EMERALD
export const CIRCLE_PLUS_BUTTON_COLOR = colors.POMEGRANATE_ANALOGOUS
export const CIRCLE_PLUS_ICON_COLOR = colors.LIGHT_GREY
export const BUTTON_EDIT_ICON_COLOR = colors.LIGHT_GREY

//Tab bar
export const TAB_BACKGROUND_COLOR_INACTIVE = colors.SILVER
export const TAB_BACKGROUND_COLOR_ACTIVE = tinycolor(TAB_BACKGROUND_COLOR_INACTIVE).lighten(5).toString()
export const TAB_LABEL_COLOR_ACTIVE = colors.PETER_RIVER
export const TAB_LABEL_COLOR_INACTIVE = colors.CLOUDS

//Header
export const HEADER_BACKGROUND_COLOR = colors.SILVER
export const HEADER_BACKGROUND_EDITING_COLOR = colors.POMEGRANATE
export const HEADER_BACKGROUND_CAPTURING_COLOR = colors.POMEGRANATE_ANALOGOUS
export const HEADER_ICON_COLOR = colors.PETER_RIVER
export const HEADER_TITLE_COLOR = colors.PETER_RIVER
export const HEADER_TITLE_EDITING_COLOR = colors.LIGHT_GREY
export const HEADER_TITLE_BACKGROUND_EDITING = colors.WHITE_TRANSLUCENT
export const HEADER_ICON_EDITING_BACKGROUND = colors.LIGHT_GREY
export const HEADER_ICON_EDITING = colors.POMEGRANATE_ANALOGOUS

//Menu
export const MENU_ICON_COLOR = colors.DARK_GREY

//Modal
export const ICON_SELECTED_BACKGROUND_COLOR = colors.MID_GREY
export const TEXT_COLOR_LIGHT = colors.LIGHT_GREY
export const MODAL_BACKGROUND_COLOR = colors.WHITE_TRANSLUCENT
export const MENU_BACKGROUND_COLOR = colors.WHITE_TRANSLUCENT
export const CONFIRM_BUTTON_TEXT_COLOR = PRIMARY_DARK
export const TEXT_COLOR_DARK = colors.DARK_GREY
export const MODAL_TEXT_COLOR = colors.DARK_GREY
export const OPTION_SELECTED_BACKGROUND_COLOR = colors.MID_GREY
