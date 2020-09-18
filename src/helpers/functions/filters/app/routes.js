import {Modes as Urls} from 'config';
import {get} from 'lodash'

export const posRoute = (params, data, state, props)=>{
  const mode = get(state.settings__mode.data, state.settings__mode.active, {})
  const url = get(Urls, mode.key, '/home')
  return params.history.push(url)
}

export const d_disRoute = (params, data, state, props)=>{
  return params.history.push('/dispatcher')
}

export const sma_wRoute = (...params)=>{
  return posRoute(...params)
}

export const pacRoute = (params, data, state, props)=>{
  return params.history.push('/packing')
}

export const kitRoute = (params, data, state, props)=>{
  return params.history.push('/kitchen')
}

export const stockRoute = (params, data, state, props)=>{
  return params.history.push('/stock_b')
}

export const cwhRoute = (params, data, state, props)=>{
  return params.history.push('/stock_cwh')
}
