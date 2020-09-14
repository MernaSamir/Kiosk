import * as Filters from './main';
import {get, assign} from 'lodash';
import store from 'store'
const getData = (params, state, data) => {
  return get(state, `${params.path}.data`, get(state, params.path, data))
}
export default function applyFilters(params={}, data, state, props={}) {
  // if (state && !props.no_merge) {
  //   debugger
  // }
  if (!state) {
    state = store.getState()
  } else if (!props.no_merge) {
    state=assign({}, store.getState(), state)
  }
  const action = get(Filters, params.key, (p, d)=>d);
  data = action(params, data || getData(params, state, data), state, {applyFilters: applyFilters, no_merge: true, ...props});

  if (params.then) {
    data = applyFilters(params.then, data, state, {...props, no_merge: true});
  }
  return data;
}
