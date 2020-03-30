import { delay, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import moment from 'moment'
import {post} from 'axios'
import {API_URL} from 'config';
import { MINIMUM_MS } from 'config'
import { syncData } from './mapping/name'
import {map} from 'lodash'
import store from 'store'
import uuid from 'uuid/v4';
import {pushToRedux, afterReq} from './mapping/requests_func'

function* runClockForwards () {
    while (true) {
      yield put({type: "set_main_main", data: {time: moment()}})
      yield call(delay, MINIMUM_MS)
    }
}
function* runUploadModels (action) {
    try {
      let req_id = uuid()
      yield call(store.dispatch, [{type: 'set_data_req_line', data: {
          [req_id]: pushToRedux({action, req_id, update_models:{gun:true}}, post, API_URL + 'update_models/', {data: action.data}) 
      } }])
      // const data = yield call(post, API_URL + 'update_models/', {data: action.data})
      // let dis = map(data.data, (val, key)=>({
      //   type: `set_data_${key}`,
      //   data: val
      // }))
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

export function *clock() {
    yield takeLatest("Clock", runClockForwards.bind(this))
}
export function *uploadModels(){
  yield takeLatest("UpdatingModels", runUploadModels.bind(this))
}