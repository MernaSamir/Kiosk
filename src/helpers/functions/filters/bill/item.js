import store from 'store';
import {applyPermissions} from 'helpers/permissions'
import {message} from 'antd'
import {defaults, pick, find, get, range, map, max} from 'lodash';
import uuid from 'uuid/v4'
import {pos_settings} from 'config/defaults'
import moment from 'moment'
import {Items as urls} from 'config';

const shareItem = (item, props) => {
  const {activeOrder, modeKey} = props
  if (item.parent || activeOrder.guests_num <= 1) {
    return []
  }
  const {receipts} = props;
  if (item.seat_num == 0 && modeKey == 'DI') {
    return range(1, activeOrder.guests_num + 1).filter((i) =>
      applyPermissions({seat_num: i}, {'not_included_list': {key: 'seat_num', list: 'receipts'}}, {receipts})
    ).map((i) => ({seat_num: i, details: item.id}))
  }
  return []
}

const goModifires = (params, detail, state, props) => {
  const {price} = params;
  const {history, pos_settings} = props
  // let active = item.has_doneness ? 'Doneness' : '';
  const data = get(state, `items__assign_modifier_items.groups.item.${price.id}`, {})
  const min = max(map(data, (d) => d._min))
  if (price.has_modifiers && (history.location.pathname == '/home'||history.location.pathname == '/home/search') ) {
    // console.log('iam in hffg')
    setTimeout(() => {
      req = false
      store.dispatch([{
        type: 'set_main_orders__details',
        data: {active: detail.id},
      }]);
      (eval(pos_settings.modifiers) || min > 0) && history.push('/Home/modifires')
    })
  }
  return []
}

const chechcourse = (props) => {
  const {pos_settings, modeKey} = props
  if (eval(pos_settings.course) && modeKey == 'DI') {
    return [{
      type: 'set_main_popup',
      data: {
        popup: {
          type: 'CoursePopup', visable: true, width: '50%',

        },
      },
    }]
  }
  return []
}
export const calculateBalance =(price, props)=>{
  let avail = true
  const store_id = props.applyFilters({path: `licensing__store.active`})
  const locationSettings = props.applyFilters({
    key: 'FindFromState',
    path: 'settings__location_settings',
    params: {
      location: 'licensing__location.active',
      key: 'salesFromStock',
    },
  })
  if (get(locationSettings, 'value')=='true') {
    const recipeItems = props.applyFilters({
      key: 'Filter',
      path: 'items__recipe',
      params: {
        sales_item: price.id,
      },
    })
    map(recipeItems, (d)=>{
      const variants = props.applyFilters({
        path: `stock__balance.groups.item.${store_id}.${d.stock_item}`,
      })
      let balance = 0
      map(variants, (v, i)=>{
        map(v, (b) =>{
          const item_variant = props.applyFilters({path: `stock__item_variants.data.${i}`})

          balance += (b.quantity * item_variant.recipe_unit_ratio)
        })
      })
      if (d.unit_qty > balance) {
        avail = false
      }
    })
  }
  return avail
}

export const addPrice = (params, new_data, state, props) => {
  const {history} = props
  const {doneness, price, pieces} = params


  const avail = calculateBalance(price, props)

  const item = props.applyFilters({path: `items__sales_items.data.${price.sales_item}`})
  if ( avail) {
    if (item.has_doneness && !doneness) {
      return store.dispatch([{
        type: 'set_main_popup', data: {
          popup: {},
          active: 'Doneness', params, position: params.position,
        },
      }])
    }
    const dis = [
      {type: 'set_main_dropdowns__doneness', data: {active: doneness}},
      {type: 'set_main_popup', data: {active: ''}},
      {type: 'set_main_items__prices', data: {active: price.id}},
      {type: 'set_main_popup', data: {popup: {}}},
    ]
    if (item._type != 'di' && item._type != 'go') {
      store.dispatch(dis)
      return history.push(urls[item._type]);
    }

    if (item.is_pieces && !pieces) {
      const popup = {
        type: 'Pieces', visable: true,
        childProps: {
          params,
        },
      }
      return store.dispatch([{
        type: 'set_main_popup', data: {popup, active: ''},
      }])
    }
    AddingDetails({
      key: 'AddingDetails',
      ...params,
    }, {}, state, props)
  } else {
    message.error('Out Of Stock')
  }
}

export const CkeckIfAvailable = (price, state, props) => {
  const location = get(state.licensing__location, 'active', '');
  const store = props.applyFilters({
    key: 'Find',
    path: 'licensing__store',
    params: {
      main_loc: location,
    },
  })
  const recipe = props.applyFilters({
    key: 'Filter',
    path: 'items__recipe',
    params: {
      sales_item: price.id,
    },
  })
  const stockItem = map(recipe, (r) => (
    props.applyFilters({
      path: `stock__items.data.${r.stock_item}`,
    })
  ))
  const stockItemVar = map(stockItem, (s) => (
    props.applyFilters({
      key: 'Filter',
      path: 'stock__item_variants',
      params: {
        item: s.id,
      },
    })
  ))
  const balance = map(stockItemVar, (svarr) => (map(
      svarr, (sv) => {
        const res = props.applyFilters({
          key: 'Find',
          path: 'stock__balance',
          params: {
            store: store.id,
            item_variant: sv.id,
          },
        })
        if (get(res, 'quantity', false)) {
          return res.quantity
        }
        return 0
      }
  )
  ))
  // console.log("Store => ", store)
  // console.log("Recipe => ", recipe)
  // console.log("StockItem => ", stockItem)
  // console.log("StockItemVar => ", stockItemVar)
  // console.log("Balance => ", [].concat.apply([], balance))
  return [...balance]
}
let req = false;
export const AddingDetails = (params, data, state, props) => {
  if (req) {
    return;
  }
  const {price = {}, pieces, quantity = 1, seat_num = get(state, 'orders__details.item.seat_num', 0), parent = '', doneness = null} = params;
  const order = params.order || state.orders__main.active
  const item = {price: price.price, quantity, item: params.item || price.id, order, parent, doneness, seat_num, pieces}
  // const activeOrder = get(state.orders__main.data, order, )
  const modeKey = get(state.settings__mode.data, `${state.settings__mode.active}.key`);
  const mainPosSettings = get(state.main.pos_settings, `${state.licensing__station.active}`, pos_settings);

  const apps = props.applyFilters({
    key: 'multiApply',
    apps: {
      details: {
        path: 'orders__details',
        key: 'Filter',
        params: {
          order,
          deleted: false,
        },
      },
      receipts: {
        path: 'orders__receipts',
        key: 'Filter',
        params: {
          order,
        },
      },
      order: {
        path: `orders__main.data.${order}`,
      },
    },
  })
  const avail = applyPermissions({seat_num: item.seat_num}, {'not_included_list': {key: 'seat_num', list: 'receipts'}}, {receipts: apps.receipts});
  if (avail) {
    if (price.has_modifiers) {
      req = true
    }
    const filters = defaults(pick(item, ['item', 'parent', 'doneness']),
        {void: null, seat_num: 0, parent: '', doneness: null, fired_time: null})
    // // const ids = map(list, (d) => d.parent).filter(d => d);
    const mainDetail = find(apps.details, filters) || {id: uuid()}
    const id = mainDetail.id
    // console.log('in adding details ')
    store.dispatch([{
      type: 'UpdatingModels',
      data: {
        orders__details: [{
          id,
          ...item,
          quantity: get(mainDetail, 'quantity', 0) + 1,
        }],
        orders__item_seats: shareItem({...item, id}, {activeOrder: apps.order, modeKey, receipts: apps.receipts}),
      },
      onSuccess: (data) => {
        const list = data.orders__item_seats.map((i) => i.seat_num)
        const added = get(data, 'orders__details[0]', '')
        let out = [
          {type: 'set_path_orders__details', path: `data.${id}.seats`, data: list},
          {
            type: 'set_main_orders__details',
            data: {
              item: {
                seat_num: added.seat_num,
              },
              active: added.parent || added.id,
            },
          },
          {
            type: 'set_main_items__sales_items',
            data: {active: ''},
          },
          {
            type: 'set_main_popup',
            data: {active: '', popup: {}},
          },
        ]
        if (!data.parent) {
          out = [...out, ...chechcourse({pos_settings: mainPosSettings, modeKey})]
        }

        out = [...out, ...goModifires(params, added, state, {...props, pos_settings: mainPosSettings})]

        return out
      },
    }])
  } else {
    message.error('You Can Not Add Items To Paid Seat')
    store.dispatch([
      {type: 'set_main', app: 'items__sales_items', data: {active: ''}},
      {type: 'set_main', app: 'orders__details', data: {item: {seat_num: item.seat_num}}},
    ])
  }
}
const AddOrder = (params, data, state, props)=>{
  return store.dispatch([{
    type: 'set_main_orders__main',
    data: {
      item: {
        ...data,
        action: 'add',
        start_time: new Date(),
        onSuccess(data) {
          props.applyFilters({
            key: 'Delayed',
            fun: {
              ...params,
            },
          }, data, undefined, props)
          return []
        },
      },
    },
  }])
}
export const AddingItem = (params, data, state, props) => {
  const {position, option, index, active} = params;
  if (option) {
    return store.dispatch([{
      type: 'set_main_popup',
      data: {active: 'Color', position, index},
    }])
  }
  const datas = props.applyFilters({
    key: 'multiApply',
    apps: {
      prices: {
        key: 'ToArray',
        path: `items__prices.groups.item.${active}`,
      },
      order: {
        path: 'orders__main.active',
      },
      seat_num: {
        path: 'orders__details.item.seat_num',
      },

    },
  })
  const business_day = get(state.orders__business_days.data, state.orders__business_days.active, {});
  if (!datas.order) {
    if (moment().diff(moment(business_day.created_at), 'day') == 0) {
      const save_data = props.applyFilters({
        key: 'mapSelect',
        select: {
          serve: 'main.current.id',
          mode: 'settings__mode.active',
          shift: 'orders__shifts.active',
          station: 'licensing__station.active',
        },
      })
      const submodes = props.applyFilters({key: 'Filter', params: {active: true}, path: `settings__sub_mode.groups.mode.${save_data.mode}`})
      let subMode = null
      if (submodes.length == 1) {
        subMode = props.applyFilters({
          key: 'First',
          display: 'id',
          default: null,
        }, submodes)
      } else if (submodes.length>1) {
        return store.dispatch({
          type: 'set_main_popup',
          data: {popup: {
            type: 'ButtonSelect',
            childProps: {
              ...params,
              list: submodes,
              onClick: (sub)=>{
                AddOrder(params, {...save_data, sub_mode: sub.id}, state, props)
              },
            },
          }},
        })
      }

      // console.log(save_data, subMode)
      return AddOrder(params, {...save_data, sub_mode: subMode}, state, props)
    }
    return message.warning('You Cannot Order in this business day please end Day First')
  }
  if (datas.prices.length == 1) {
    if (datas.order) {
      const price = datas.prices[0]
      addPrice({
        price,
        position,
        key: 'addPrice',
      }, {}, state, props)
    }
  } else {
    store.dispatch([{
      type: 'set_main_popup',
      data: {active: 'Size', position, index, popup: {}},
    }])
  }
}
