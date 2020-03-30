import {
    CHANGE_MOOD, UPDATE_TABLES, REPLACE_CUSTOM_MENU, REPLACE_BASE_SALESCAT, CHANGE_BUSINESS_DAY,
    CHANGE_SHIFT, UPDATE_TABLE_DATA , SET_CURRENT_PAYMENT , APPEND_ACTIVE_ORDER
} from "./types";
import { callApi } from './../../api/item-calls'

export const changeAppMode = (data, ) => {
    return function (dispatch) {

        dispatch({
            type: CHANGE_MOOD,
            payload: data,
        })

    }
}
export const fetchApp = (data, ) => {
    return function (dispatch) {

        dispatch({
            type: 'Fetching',
            payload: data,
        })

    }
}

export const getFromApi = (obj) => {

    let { model, api, name, filters } = obj

    return function (dispatch) {
        callApi(model, api, filters).then(result => {

            dispatch({
                type: name,
                payload: result,
            })
        })
    }
}
export const saveFromDB = (name, result) => {
    return function (dispatch) {
        dispatch({
            type: name,
            payload: result
        })
    }
}
export const updateTables = (list) => {

    return function (dispatch) {

        dispatch({
            type: UPDATE_TABLES,
            payload: list,
        })

    }
}

export const updateTableData = (id, data) => {

    return function (dispatch) {

        dispatch({
            type: UPDATE_TABLE_DATA,
            data,
            id
        })

    }
}

export const replaceCustomMenu = (array, first, second) => {
    return function (dispatch) {
        dispatch({
            type: REPLACE_CUSTOM_MENU,
            payload: { array: array, first: first, second: second }
        })
    }
}

export const replaceBaseSalesCat = (array, first, second) => {
    return function (dispatch) {
        dispatch({
            type: REPLACE_BASE_SALESCAT,
            payload: { array: array, first: first, second: second }
        })
    }
}

export const changeBusinessDay = (data) => {
    return function (dispatch) {
        dispatch({
            type: CHANGE_BUSINESS_DAY,
            payload: data
        })
    }
}

export const changeShift = (data) => {

    return function (dispatch) {
        dispatch({
            type: CHANGE_SHIFT,
            payload: data
        })
    }
}


export const setCurrentPayment = (data) => {

    return function (dispatch) {
        dispatch({
            type: SET_CURRENT_PAYMENT,
            data: data
        })
    }
}

export const appendActiveOrder = (data) => {

    return function (dispatch) {
        dispatch({
            type: APPEND_ACTIVE_ORDER,
            data: data
        })
    }
}


export const handelUser = (data) => {

    return function (dispatch) {
        dispatch({
            type: "Current",
            data: data
        })
    }
}
