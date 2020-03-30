import * as Filters from './main';
import {get} from 'lodash';
import store from 'store'
const getData = (params, state) => {
    return get(state, `${params.path}.data`, get(state, params.path))
}
export default function applyFilters(params={}, data, state=store.getState(), props={}){
    const action = get(Filters, params.key, (p, d)=>d);
    data = action(params, data || getData(params, state), state, {applyFilters: applyFilters, ...props});
    if(params.then){
        data = applyFilters(params.then, data, state, props);
    }
    return data;
}
