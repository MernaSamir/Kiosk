import { bindActionCreators } from "redux";
import * as fetch from './fetch';
import asyncActions from './async/';
import Actions from './actions';
export const appActions =  (app) =>(dispatch)=>({...bindActionCreators({
    ...Actions(app),
    ...asyncActions(app),
}, dispatch)})
export const setMain = (app, data)=>{
    return ({
        type: `set_main_${app}`, data
    })
}
export const setData = (app, data) => ({
    type: `set_data_${app}`, data
})
export const resetAll = (app, data)=>({
    type: `reset_all_${app}`, data
})
const omitData = (app, data) => ({
    type: `omit_data_${app}`, data
})
const setPath = (app, path, data) => ({
    type: `set_path_${app}`, data, path
})

export const appendPath = (app, path, data, action="merge")=>({
    type: `append_path_${app}`, path, data, action
})
const assignPath = (app, path, data)=>({
    type: `append_path_${app}`, path, data
})
export default (dispatch)=>({
    fetchAll: fetch.fetchAll(dispatch),
    setAll: fetch.dispatchMulti(dispatch),
    ...bindActionCreators({setMain, appendPath, assignPath, resetAll, omitData, setPath, setData, ...asyncActions({})}, dispatch)
})
