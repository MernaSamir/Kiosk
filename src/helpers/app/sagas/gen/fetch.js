import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
import {API_URL} from 'config'
import {get} from 'lodash';
import * as mappingFunctions from './mapping';
import store from 'store'
import mapName from './mapping/name'
// import { array_to_obj } from "helpers/functions";

function* fetch_data(app, name, action = {}) {
    try {
        const data = yield call(axios.get, API_URL+ app.url, { params: action.params || {} })
        yield put({ type: mapName('set_data', name), data: data.data.results })
        if (action.onSuccess) {
            action.onSuccess(data.data.results)
        }
    } catch (error) {
        if (action.onError) {
            action.onError(error)
        }
    }
}
function* fetch_relative_sync(app, name, action = {}) {
    try {
        let results = [];
        let i = 0
        while(i < action.apps.length){
            const d = action.apps[i];
            const data =  yield call(get(axios, d.method, axios.get), API_URL+d.api, get(mappingFunctions, get(d, 'fun.name'), ()=>({params: d.params}) )(results, d.fun) )
            results.push(data.data.results || data.data.data || data.data)
            i++;
        }
        action.apps.map((d, index)=>{
            store.dispatch({type: `set_data_${d.app}`, path: 'data', data: results[index]})
        })
        if (action.onSuccess) {
            action.onSuccess(results)
        }
    } catch (error) {
        if (action.onError) {
            action.onError(error)
        }
    }
}
function* fetch_relative(app, name, action = {}) {
    try {
        let results = [];
        const data = yield action.apps.map(function *(d){
            return yield call(get(axios, d.method, axios.get), API_URL+d.api, get(mappingFunctions, get(d, 'fun.name'), ()=>({params: d.params}) )(results, d.fun) )
        })
        action.apps.map((d, index)=>{
            const res = data[index]
            store.dispatch({ type: `set_data_${d.app}`, path: 'data', data: res.data.results || res.data.data || res.data})
        })
        if (action.onSuccess) {
            action.onSuccess(results)
        }
    } catch (error) {
        if (action.onError) {
            action.onError(error)
        }
    }
}

function* fetch_statistics(app, name, action={}) {
    // try{
    //     const res = yield call(axios.post, API_URL + app.url+'/post_statistics/', action.data)
    //     yield put({ type: 'set_main', data: {data: array_to_obj(res.data.data, action.data.groupby)} })
    //     if (action.onSuccess) {
    //         action.onSuccess(res.data)
    //     }
    // }catch(e){
    // }
}


export function *fetch(app) {
    yield takeLatest("Fetching", fetch_data.bind(this, app, undefined))
    yield takeLatest("FetchingAll", fetch_relative.bind(this, app, undefined))
    yield takeLatest("FetchingAllSync", fetch_relative_sync.bind(this, app, undefined))
    yield takeLatest("FetchingStatistics", fetch_statistics.bind(this, app, undefined))

}
export function *fetchApp(app) {
    yield takeLatest(`Fetching_${app.name}`, fetch_data.bind(this, app.settings, app.name))
    yield takeLatest(`FetchingAll_${app.name}`, fetch_relative.bind(this, app.settings, app.name))
    yield takeLatest(`FetchingAllSync_${app.name}`, fetch_relative_sync.bind(this, app.settings, app.name))
    yield takeLatest(`FetchingStatistics_${app.name}`, fetch_statistics.bind(this, app.settings, app.name))

}
