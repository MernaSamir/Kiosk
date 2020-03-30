import { SET_CURRENT_MODIFIER, CHANGE_EDIT_BTN } from './types'

export const setCurrentModifier = (modifier) => {
    return function (dispatch) {
        dispatch({
            type: SET_CURRENT_MODIFIER,
            payload: modifier,
        })
    }
}

export const changeEditBtn = (status) => {
    return function (dispatch) {
        dispatch({
            type: CHANGE_EDIT_BTN,
            payload: status,
        })
    }
}
