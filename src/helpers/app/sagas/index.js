import { all } from "redux-saga/effects";
import {map} from 'lodash';
import {localApp, gApp, extra} from './gen';
export const Sagas = (app = {})=>{
    return function *rootSaga(){
        yield all([map(localApp, (d, k)=>(d(app)))])
    }
}

export const ExtraSagas = (app = {})=>{
    return function *rootSaga(){
        yield all([map(extra, (d, k)=>(d(app)))])
    }
}
export const SagasApp = (app = {})=>{

    return function *rootSaga(){
        yield all([map(gApp, (d, k)=>(d(app)))])
    }
}
