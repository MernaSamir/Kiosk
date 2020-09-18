export * from './routes'
import {get} from 'lodash'
export const GoHome = (params, data, state, props)=>{
  const station = get(state.licensing__station.data, state.licensing__station.active, {})
  const key = get(station, '_type', 'pos') + 'Route'
  return props.applyFilters({...params, key}, data, state, props)
}
