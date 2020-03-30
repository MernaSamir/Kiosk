import {delete as Delete, post} from 'axios';
import {get} from 'lodash';
import {API_URL} from 'config'
import { call, takeLatest } from 'redux-saga/effects';
import mapName, {getApp, syncData} from './mapping/name';
import store from 'store';

function* Deleting(app, name, action = {}) {
    try {
        if(!app.url){
            app = getApp(action.app)
            name = app.name;
        }
        const id = get(action, 'data.id', action.data);
        yield call(Delete, `${API_URL}${app.url}${id}`)
        let dis = [
            { type: mapName('remove_data', name), data: [id] }
        ]
        if (action.onSuccess) {
            dis = [...dis, ...action.onSuccess(action.data)]
        }
        return yield call(store.dispatch, syncData(dis))
    } catch (error) {
        if (action.onError) {
            action.onError(error)
        }
    }
}

function* DeletingMany(app, name, action = {}) {
    // app = action.app || app;
    try {
        if(!app.url){
            app = getApp(action.app)
            name = app.name;
        }
        const res = yield call(post, API_URL + `${app.url}many_delete/`, action.data)
        let dis = [
            { type: mapName('remove_data', name), data: res.data }
        ]
        if (action.onSuccess) {
            dis = [...dis, ...action.onSuccess(res.data)]
        }
        return yield call(store.dispatch, syncData(dis))
    } catch (error) {
        if (action.onError) {
            action.onError(error)
        }
    }
}

export function *deleting(app) {
    yield takeLatest("Deleting", Deleting.bind(this, app, undefined))
    yield takeLatest("DeletingMany", DeletingMany.bind(this, app, undefined))
}
export function *deletingApp(app) {
    yield takeLatest(`Deleting_${app.name}`, Deleting.bind(this, app.settings, app.name))
    yield takeLatest(`DeletingMany_${app.name}`, DeletingMany.bind(this, app.settings, app.name))
}
