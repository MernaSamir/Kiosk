import {get, round, isNaN} from 'lodash';
export const Divide = (params, data, state, props)=>{
  const num = get(data, params.num, get(state, params.num, 0));
  const dom = get(data, params.dom, get(state, params.dom, 0));
  const {round: r=2} = params;
  return num ? round(num/dom, r):0
}

export const Round = (params, data, state, props)=>{
  const {round: r=2, d_path} = params;
  const val = round(get(data, d_path, data || params.default), r)
  return isNaN(val) ? '':val
}
export const Subtract = (params, data, state, props)=>{
  const first = props.applyFilters(params.first, data, state, props)
  const second = props.applyFilters(params.second, data, state, props)
  return first-second
}
