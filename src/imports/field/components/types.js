import {lazy} from 'react'
export const TextBox = lazy(()=>import('./text_box'))
export const SelectBox = lazy(()=>import('./select_box'))
export const TextArea = lazy(()=>import('./text_area'))
export const MultiText = lazy(()=>import('./mult_input'))
export const RowForm = lazy(()=>import('./form_row/index'))
export const Calc = lazy(()=>import('./calc'))
export const ButtonPopup = lazy(()=>import( './popup_button'))
export const selectButtons = lazy(()=>import( './select_buttons'))
export const MultiSelect = lazy(()=>import( './multi_select_button'))
export const MultiSelectQuantity = lazy(()=>import( './multi_select'))
export const SelectQuantity = lazy(()=>import( './select_quantity'))
export const MultiSelectRemoved = lazy(()=>import( './multi_select_removed'))
export const Alters = lazy(()=>import( './alters'))
export const KeyBoard = lazy(()=>import( './keyboard'))
export const MultiCheckbox = lazy(()=>import( './multi_checkbox'))
export const Checkbox = lazy(()=>import( './checkbox'))
export const SelectShape = lazy(()=>import( './select_shape'))
export const Slider = lazy(()=>import( './slider'))
export const MultiCheck = lazy(()=>import( './multi_check'))
export const TreeSelect = lazy(()=>import( './tree_select'))
export const Calendar = lazy(()=>import( './calendar'))
export const TimePicker = lazy(()=>import( './time_picker'))
export const SelectA = lazy(()=>import('./select_ant'))
export const Table_Add = lazy(()=>import('./table_add'))
export const SetMenu = lazy(()=>import('./event_menu'))
// // export {default as SetMenu} from './event_menu'
export const TableShow = lazy(()=>import('./table_show'))
export const SelectSearch = lazy(()=>import('./select_with_search'))
export const Drawer = lazy(()=>import('../../../components/drawer'))
export const NumberField = lazy(()=>import('./number_field'))


export * from './check_box';
export * from './labels';
