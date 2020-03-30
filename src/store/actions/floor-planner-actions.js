import { SET_CURRENT_SHAPE, ADD_NEW_TABLE, CLEAR_NEW_TABLES , SET_CURRENT_ZONE,
     DELETE_TABLE, SET_LAST_TABLE, ALTER_TABLE_STATUS, SET_DRAWAREA, REMOVE_TABLE } from "./types";

export const setCurrentShape = (shapeID) => {
    return function (dispatch) {

        dispatch({
            type: SET_CURRENT_SHAPE,
            payload: shapeID,
         
        })

    }
}

export const AddNewTable = (table) => {
    return function (dispatch) {

        dispatch({
            type: ADD_NEW_TABLE,
            payload: table,
         
        })

    }
}

export const clearTables = () => {
    return function (dispatch) {

        dispatch({
            type: CLEAR_NEW_TABLES,
        
        })

    }
}

export const setCurrentZone = (zone) => {
    return function (dispatch) {

        dispatch({
            type: SET_CURRENT_ZONE,
            payload:zone
        
        })

    }

}
export const deleteTable = (id) => {
    return function (dispatch){
        dispatch({
            type: DELETE_TABLE,
            payload: id
        })
    }
}

export const alterTableStatus = (id,status) => {
    return function (dispatch){
        dispatch({
            type: ALTER_TABLE_STATUS,
            payload: {id, status}
        })
    }
}

export const setLastTable = (index) => {
    return function (dispatch){
        dispatch({
            type: SET_LAST_TABLE,
            payload: index
        })
    }
}

export const setDrawArea = (drawArea) =>{
    return function (dispatch){
        dispatch({
            type: SET_DRAWAREA,
            payload: drawArea
        })
    }
}

export const removeTable = (pos_x,pos_y, size,shape) =>{
    return function (dispatch){
        dispatch({
            type: REMOVE_TABLE,
            payload: {pos_x,pos_y,size, shape}
        })
    }
}