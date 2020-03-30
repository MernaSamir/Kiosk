import { array_to_obj } from "helpers/functions";
import {omit, set, cloneDeep, assign, get, merge} from 'lodash';
const actions = {
    merge, assign
}
export const set_data = (state, action)=>{
    const data = Array.isArray(action.data) ? array_to_obj(action.data):action.data
    return {...state, data: {...state.data, ...data}}
}
export const set_main = (state, action) => {
    return { ...state, ...action.data }
}
export const set_path = (state, action)=>{
    if(!action.path){
        return state
    }
    let newState = cloneDeep(state)
    set(newState, action.path, action.data);
    return newState
}
export const append_path = (state, action)=>{
    if(!action.path){
        return state
    }
    let newState = cloneDeep(state)
    const data = Array.isArray(action.data) ? array_to_obj(action.data):action.data
    const mainAction = get(actions, action.action, actions.merge);
    set(newState, action.path, mainAction({}, get(newState, action.path, {}), data));
    return newState
}
export const reset_data = (state, action)=>{
    const data = Array.isArray(action.data) ? array_to_obj(action.data):action.data
    return {...state, data}
}
export const remove_main = (state, action)=>{
    return {...omit(state, action.data)}
}
export const remove_data = (state, action)=>{
    return {...state, data: {...omit(state.data, action.data)}}
}
