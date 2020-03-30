import { patch } from 'axios';
import { get, reject, has, union } from 'lodash';
import { API_URL } from 'config'
import { call, takeLatest } from 'redux-saga/effects';
import store from 'store';
import mapName, { getApp, syncData } from './mapping/name'
import sync_apps from './mapping/sync_apps'
import uuid from 'uuid/v4';
import {pushToRedux, afterReq} from './mapping/requests_func'


function* update(app, name, action = {}) {

    try {
        if (!app.url) {
            app = getApp(action.app)
            name = app.name;
        }
        if(action.data.gun_sync) {
            return yield call(afterReq,{app, name, action}, get(action.data, "data", action.data) )
        }
        let req_id = uuid()
        return yield call(store.dispatch, [{type: 'set_data_req_line', data: {
            [req_id]: pushToRedux({app, name, action, req_id}, patch, `${API_URL}${app.url}${get(action, 'data.id', action.data)}/`, action.data) 
        } }])

        // const data = action.data.gun_sync ? action.data : yield call(patch, `${API_URL}${app.url}${get(action, 'data.id', action.data)}/`, action.data)
        // let dis = [
        //     { type: mapName('set_data', name), data: [data.data] }
        // ]
        // if (action.onSuccess) {
        //     dis = [...dis, ...action.onSuccess(data.data)]
        // }
        // return yield call(store.dispatch, syncData(dis, true))
    } catch (error) {
        if (action.onError) {
            action.onError(error)
        }
    }
}
function* update_bulk(app, name, action = {}) {
    try {
        if (!app.url) {
            app = getApp(action.app)
            name = app.name;
        }
        action.data = Array.isArray(action.data) ? { data: action.data } : action.data
        const filtered_data = has(sync_apps, `${name}.gun_sync`) ?  {data: reject(action.data.data,(val)=>get(val,'gun_sync'))} : action.data
        
        let req_id = uuid()
        yield call(store.dispatch, [{type: 'set_data_req_line', data: {
            [req_id]: pushToRedux({app, name, action, req_id, bulk:true}, patch, API_URL + app.url + 'bulk_edit/', filtered_data) 
        } }])

        // let data = yield call(patch, API_URL + app.url + 'bulk_edit/', filtered_data)

        // // let new_data = [...get(action, 'data.data', []), ...data.data]
        // let new_data = data.data
        // let dis = [
        //     { type: mapName('set_data', name), data: new_data },
        //     { type: mapName('remove_data', name), data: action.data.data.filter(d => d.remove).map(d => d.id) },
        // ]
        // if (action.onSuccess) {
        //     dis = [...dis, ...action.onSuccess(new_data)]
        // }

        // return yield call(store.dispatch, syncData(dis, true))
    } catch (error) {
        if (action.onError) {
            action.onError(error)
        }
    }
}
function* update_many(app, name, action = {}) {
    try {
        if (!app.url) {
            app = getApp(action.app)
            name = app.name;
        }
        let req_id = uuid()
        yield call(store.dispatch, [{type: 'set_data_req_line', data: {
            [req_id]: pushToRedux({app, name, action, req_id}, patch, `${API_URL}${app.url}many_edit/`, action.data) 
        } }])
        // const data = yield call(patch, `${API_URL}${app.url}many_edit/`, action.data)
        // let dis = [
        //     { type: mapName('set_data', name), data: data.data }
        // ]
        // if (action.onSuccess) {
        //     dis = [...dis, ...action.onSuccess(data.data)]
        // }
        // return yield call(store.dispatch, syncData(dis, true))
    } catch (error) {
        if (action.onError) {
            action.onError(error)
        }
    }
}

export function* updating(app) {
    yield takeLatest("Updating", update.bind(this, app, undefined))
    yield takeLatest("UpdatingBulk", update_bulk.bind(this, app, undefined))
    yield takeLatest("UpdatingMany", update_many.bind(this, app, undefined))
}
export function* updatingApp(app) {
    yield takeLatest(`Updating_${app.name}`, update.bind(this, app.settings, app.name))
    yield takeLatest(`UpdatingBulk_${app.name}`, update_bulk.bind(this, app.settings, app.name))
    yield takeLatest(`UpdatingMany_${app.name}`, update_many.bind(this, app.settings, app.name))
}
