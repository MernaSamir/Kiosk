import { get, map, isArray} from 'lodash';
import store from 'store';
import mapName, {syncData } from  './name'
// import {message} from 'antd'
export function pushToRedux(app_data,axios_method, url, data){
    return (() => {
        axios_method(url, data)
        .then(resp => app_data.bulk ? afterBulkReq(app_data,get(resp, 'data')) : afterReq(app_data,get(resp, 'data')))
        .catch(error => {
            // let error_message = get(error,'response.request.response')
            // error_message && message.error(error_message)
            if (get(app_data, "action.onError")) {
                app_data.action.onError(error)
            }})
    })
}

export function afterBulkReq(app_data, data){
    const db_ids = map(data, (val) => val.id)
    const new_data = [...data, ...get(app_data, 'action.data.data', []).filter(val => !db_ids.includes(val.id))]
    afterReq(app_data, new_data)
}

export function afterReq(app_data, data){
    const {name, action, req_id, bulk, update_models} = app_data
    
    if(req_id) {
        store.dispatch([{type: 'remove_data_req_line', data: [req_id] }])
    }
    if(name) {
        let dis = [
            { type: mapName('set_data', name), data: isArray(data)? data : [data] },
        ]
        if(bulk) {
            dis = [...dis,{ type: mapName('remove_data', name), data: action.data.data.filter(d => d.remove).map(d => d.id) }]
        }
        if (action.onSuccess) {
            dis = [...dis, ...action.onSuccess(data)]
        }
        store.dispatch(syncData(dis, true))
    }
    if(update_models) {
        let dis = map(data.data, (redux_data, app_key)=>({
            type: `set_data_${app_key}`,
            data: redux_data
        }))
        if (action.onSuccess) {
            dis = [...dis, ...action.onSuccess(data)]
        }
        if(update_models.gun){
            store.dispatch(syncData(dis, true))
        } else {
            store.dispatch(dis)
        }
    }
}