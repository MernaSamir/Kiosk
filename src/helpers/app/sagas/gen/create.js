import {post} from 'axios';
import {API_URL} from 'config';
import { call, takeLatest } from 'redux-saga/effects';
import mapName, {getApp, syncData} from './mapping/name'
import store from 'store';
import {pushToRedux} from './mapping/requests_func'
import uuid from 'uuid/v4';

function* create(app, name, action = {}) {
    try {
        if(!app.url){
            app = getApp(action.app)
            name = app.name;
        }
        let req_id = uuid()
        return yield call(store.dispatch, [{type: 'set_data_req_line', data: {
            [req_id]: pushToRedux({app, name, action, req_id}, post, `${API_URL}${app.url}`, action.data) 
        } }])
        // const data = yield call(post, API_URL + app.url, action.data)
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
function* create_bulk(app, name, action = {}) {
    try {
        if(!app.url){
            app = getApp(action.app)
            name = app.name;
        }
        let req_id = uuid()
        return yield call(store.dispatch, [{type: 'set_data_req_line', data: {
            [req_id]: pushToRedux({app, name, action, req_id}, post, `${API_URL}${app.url}bulk/`, action.data) 
        } }])
        // const data = yield call(post, `${API_URL}${app.url}bulk/`, action.data)
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
function* create_many(app, name, action = {}) {
    try {
        if(!app.url){
            app = getApp(action.app)
            name = app.name;
        }
        const data = yield call(post, API_URL + app.url, { data: action.data })
        let dis = [
            { type: mapName('set_data', name), data: data.data }
        ]
        if (action.onSuccess) {
            dis = [...dis, ...action.onSuccess(data.data)]
        }
        return yield call(store.dispatch, syncData(dis, true))
    } catch (error) {
        if (action.onError) {
            action.onError(error)
        }
    }
}

export function *createAll(app) {
    yield takeLatest("Creating", create.bind(this, app, undefined))
    yield takeLatest("CreatingBulk", create_bulk.bind(this, app, undefined))
    yield takeLatest("CreatingMany", create_many.bind(this, app, undefined))
}

export function *createApp(app) {
    yield takeLatest(`Creating_${app.name}`, create.bind(this, app.settings, app.name))
    yield takeLatest(`CreatingBulk_${app.name}`, create_bulk.bind(this, app.settings, app.name))
    yield takeLatest(`CreatingMany_${app.name}`, create_many.bind(this, app.settings, app.name))
}
