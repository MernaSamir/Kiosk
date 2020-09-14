
import {array_to_obj} from 'helpers/functions/array_to_object';
import {itemsActivates, itemsSM} from './helpers'
import {map, get, isEmpty, cloneDeep, toArray} from 'lodash'
import moment from 'moment'
const reset_pirces = (params, data, state, props) => {
  // review wafaa
  const {active_redux} = params
  if (isEmpty(get(state, `${active_redux}.data`, {}))) {
    return []
  }
  const dis = []
  const l_prices = props.applyFilters({
    key: 'keys',
    path: active_redux,
    levels: params.levels,
  }, undefined, state, props)
  data.items__prices = map(data.items__prices, (d) => {
    const p = get(l_prices, `${params.select}.${d.id}`, {active: false, price: d.price, favourite: false});
    if (active_redux == 'items__price_by_location') {
      return {...d, price: p.price, active: d.active && p.active, favourite: p.favourite}
    }
    return {...d, active: d.active && p.active, favourite: p.favourite==undefined ? d.favourite:p.favourite}
  })

  return dis
}

const reset_taxes = (params, sales_items, state, props) => {
  const datas = props.applyFilters({
    key: 'keys',
    path: 'financials__tax_by_location',
    levels: ['location', 'item'],
  }, undefined, state, props)
  if (isEmpty(get(datas, params.location, {}))) {
    return toArray(sales_items)
  }
  const items = map(sales_items, (d) => {
    return {...d, tax_percent: get(datas, `${params.location}.${d.id}.tax`, d.tax)}
  })
  return items
}

const activateItems = (params, data, state, props) => {
  const dis = []
  data.items__sales_items = reset_taxes(params, data.items__sales_items, state, props)
  const datas = props.applyFilters({
    key: 'Filter',
    params: {
      active: true,
    },
    then: itemsActivates,
  }, data.items__prices, state, props)
  const fav = props.applyFilters({
    key: 'Filter',
    params: {
      active: true,
      favourite: true,
    },
    then: itemsActivates,
  }, data.items__prices, state, props)
  const sm = props.applyFilters({
    key: 'Filter',
    params: {
      is_staff_meal: true,
    },
    then: itemsSM,
  }, data.items__sales_items, state, props)
  // console.log("FAVVV ", fav)
  // console.log("DATA ", datas)
  data.items__sales_items = map(data.items__sales_items, (d) => {
    // console.log("ITEMS ", Boolean(get(fav.items, d.id)), Boolean(get(datas.items, d.id)))
    return {...d, active: Boolean(get(datas.items, d.id)), favourite: Boolean(get(fav.items, d.id))}
  })
  data.items__base_sales_cat = map(data.items__base_sales_cat, (d) => {
    return {...d, active: d.active && Boolean(get(datas.cat, d.id)), is_staff_meal: Boolean(get(sm.cat, d.id))}
  })
  data.items__custom_menu = map(data.items__custom_menu, (d) => {
    return {...d, active: d.active && Boolean(get(datas.menu, d.id)), sm: Boolean(get(sm.menu, d.id))}
  })
  const dis_data = props.applyFilters({
    key: 'multiApply',
    apps: {
      items__sales_items: {
        key: 'keys',
        levels: ['base_sales_cat', 'id'],
      },
      items__base_sales_cat: {
        key: 'keys',
        levels: ['custom_menu', 'id'],
      },
    },
  }, {
    items__sales_items: data.items__sales_items,
    items__base_sales_cat: data.items__base_sales_cat,
    items__custom_menu: data.items__custom_menu,
  }, state, props)
  return [...dis, {
    type: 'set_data_items__sales_items',
    reject: true,
    data: data.items__sales_items,
  }, {
    type: 'set_data_items__base_sales_cat',
    reject: true,
    data: data.items__base_sales_cat,
  }, {
    type: 'set_data_items__custom_menu',
    reject: true,
    data: data.items__custom_menu,
  }, {
    type: 'append_path_items__base_sales_cat',
    path: 'groups',
    data: {custom_menu: dis_data.items__base_sales_cat},
  }, {
    type: 'append_path_items__sales_items',
    path: 'groups',
    data: {base_sales_cat: dis_data.items__sales_items},
  }, {
    type: 'append_path_items__prices',
    path: 'groups',
    data: {item: datas.items},
  }]
}
export const deactivate_item = (params, data, state, props)=>{
  const deactive = get(props.applyFilters({
    key: 'keys',
    levels: ['location', 'mode', 'item'],
  }, state.settings__items_deactivation?.data, state, props), `${params.location}.${params.mode}`, '')
  if (deactive) {
    const now = moment().format('YYYY-MM-DD HH:mm')
    data.items__prices = map(data.items__prices, (d) => {
      const p = get(deactive, `${d.sales_item}`);
      let active = d.active
      if (p) {
        const time = moment([p.date, p.deactivate_until].join('-'), 'YYYY-MM-DD-HH:mm').format('YYYY-MM-DD HH:mm')
        active = now > time
      }
      return {...d, active: d.active && active}
    })
  }
  return []
}
export const ResetItems = (params, data, state, props)=>{
  let out = []
  data = cloneDeep(data);
  if (!state.main?.main_datas) {
    const main_datas = {
      data: {
        items__sales_items: array_to_obj(data.items__sales_items),
        items__prices: array_to_obj(data.items__prices),
        items__base_sales_cat: array_to_obj(data.items__base_sales_cat),
        items__custom_menu: array_to_obj(data.items__custom_menu),
      },
    }
    out = [...out, {
      type: 'set_main_main',
      data: {main_datas},
    }]
  }
  out = [
    ...out,
    ...reset_pirces({
      active_redux: 'items__price_by_location',
      select: params.location,
      levels: ['location', 'item'],
    }, data, state, props),
    ...(params.mode ? deactivate_item({
      location: params.location,
      mode: params.mode?.key,
      levels: ['station', 'item'],
    }, data, state, props):[]),
    // ...reset_pirces('items__price_by_mode', data, s),
    ...(params.station ? reset_pirces({
      active_redux: 'items__price_by_pos',
      select: params.station,
      levels: ['station', 'item'],
    }, data, state, props):[]),
  ]
  // out = [...out,...reset_pirces('items__price_by_mode',data,s)]
  // out = [...out,...reset_pirces('items__price_by_pos',data,s)]

  // if (get(data, 'items__price_by_location.length', 0)) {
  //     out = [...out, ...reset_pirces(data, s)];

  // }

  out = [...out, ...activateItems(params, data, state, props)]
  return out
}
