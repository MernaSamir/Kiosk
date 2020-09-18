import {isArray, get, pick, find} from 'lodash'
export const sendToLoc = (params, data, state, props)=>{
  const mainData = props.applyFilters({
    key: 'multiApply',
    apps: {
      'orders__main': {key: 'keys', levels: ['id']},
      'orders__delivery_main': {key: 'keys', path: `orders__delivery_main.groups.order.${params.order}`, levels: ['id']},
      'orders__details': {
        key: 'StateSelector',
        default: {},
        path: `orders__details.groups.order.${params.order}`,
      },
      'orders__orders_discount': {
        key: 'StateSelector',
        default: {},
        path: `orders__orders_discount.groups.order.${params.order}`,
      },
    },
  }, data, state, props)
  if (isArray(params.location)) {
    const location = params.location.filter((d)=>(d!=state.licensing__location.active))
    props.applyFilters({
      key: 'sendToHq',
    }, {data: mainData, send: location}, state, props)
  } else {
    if (params.location != state.licensing__location.active) {
      props.applyFilters({
        key: 'sendToHq',
      }, {data: mainData, send: params.location}, state, props)
    }
  }
}

export const StationMode = (params, data, state, props)=>{
  const {station} = params;
  const settings = get(state, 'settings__filter.data')
  const defaultMode = find(settings, {station: station.id, key: 'default_mode'})
  const active_modes = pick(data, station.modes)
  if (station.modes.includes(defaultMode?.value)) {
    return defaultMode.value
  }
  const active = props.applyFilters({key: 'First', display: 'id'}, active_modes, state, props)
  console.log(active)
  return active
}
