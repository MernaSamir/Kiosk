import {get} from 'lodash';
import * as show_fun from './main';
import store from 'store';
export default (params, val, state=store.getState())=>{
    return get(show_fun, params.type || params, d=>d)(val, params, state)
}