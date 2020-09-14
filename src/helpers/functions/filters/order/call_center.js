import store from 'store'
import {message} from 'antd'
import {get, toArray, omit, uniq} from 'lodash'
import {cuurentLoc, extraButton} from './filters'
import classes from './style.less'
import uuid from 'uuid/v4'
import moment from 'moment'
export const startSP = (params, data, state, props)=>{
  const {sub_mode={}} = params
  if (sub_mode.key == 'pickup') {
    return props.applyFilters({
      key: 'pickupOrder',
    }, data, state, props)
  } else {
    store.dispatch([{
      type: 'set_main_delivery_service',
      data: {extra: data},
    }, {
      type: 'set_main_popup',
      data: {popup: {}},
    }])
    return message.success('Please Select Your Customer')
  }
}
const selectSp = (sp, data, state, props)=>{
  const sp_data = get(state.dropdowns__delivery_service_mode, `groups.sp.${sp.id}`, {})
  const sub_mode = get(state.settings__sub_mode, `groups.sub_key.${data.mode}.${sp_data.mode}`)
  if (!sub_mode) {
    return message.error('Please Check Your License Options')
  }
  data = {...data, sp: sp.id, sub_mode: sub_mode.id, sub_mode_key: sub_mode.key};
  if (sp_data.code) {
    return store.dispatch({
      type: 'set_main_popup',
      data: {
        popup: {
          type: 'Fields',
          childProps: {
            title: `${sp.name} Code`,
            onSubmit(values) {
              startSP({sub_mode}, {...data, ...values}, state, props)
            },
            fields: {
              sp_code: {
                label: 'Code',
                type: 'TextBox',
                validates: {required: true},
              },
            },
          },
        },
      },
    })
  }
  return startSP({sub_mode}, data, state, props)
}
export const ServiceProvider = (params, data, state, props)=>{
  data = {...data, ...props.applyFilters(params.init)}
  const mode = get(state.settings__mode.data, data.mode, {})
  const station = get(state.licensing__station.data, state.licensing__station.active, {})
  data = {...data, mode_key: mode.key}
  data.is_callcenter = station.is_callcenter || data.mode_key=='CT'
  let list = props.applyFilters({
    key: 'ListFind',
    path: 'delivery_service',
    fun: {
      key: 'chain',
      display: 'mode',
      selectors: {
        sp: {path: 'dropdowns__delivery_service_mode.groups.sp.:id'},
      },
    },
  })
  if (!data.is_callcenter) {
    list = props.applyFilters({
      key: 'ListFind',
      fun: {
        key: 'chain',
        display: 'active',
        selectors: {
          loc: {path: `dropdowns__delivery_service.groups.loc.${state.licensing__location.active}.:id`},
        },
      },
    }, list, state, props)
  }
  if (!list.length) {
    return message.warning('No Supported Service Provider')
  }
  if (list.length == 1) {
    return selectSp(list[0], data, state, props)
  }
  return store.dispatch({
    type: 'set_main_popup',
    data: {popup: {
      type: 'ButtonSelect',
      childProps: {
        ...params,
        classes: {
          container: classes.sp_container,
          options_btn: classes.sp_button,
        },
        list,
        onClick: (sp)=>{
          selectSp(sp, data, state, props);
        },
      },
    }},
  })
}
export const changeOrderAddress = (params, data, state, props)=>{
  const datas = props.applyFilters({
    key: 'multiApply',
    apps: {
      address: {
        key: 'omitting',
        ids: [data.address],
        path: `parties__address.groups.customer.${data.customer}`,
        then: {
          key: 'ListFind',
          fun: {
            key: 'chain',
            display: 'active',
            selectors: {
              geographies__street: 'street',
              settings__location_by_area: {path: `settings__location_by_area.groups.area_loc.:area.${params.location}`},
            },
          },
        },
      },
      location: {
        path: `orders__delivery_main.groups.first.${data.id}.cc_location`,
      },
    },
  })
  if (!datas.address.length) {
    return message.error('not more address for this location')
  }
  const addPopup = {
    type: 'set_main_popup',
    data: {popup: {
      type: 'ButtonSelect',
      childProps: {
        list: datas.address,
        classes: {container: classes.a_container},
        onClick: (address)=>{
          props.applyFilters({
            key: 'UpdatingOrder',
            location: datas.location,
            sync: true,
            id: '',
          }, {
            orders__main: [{id: data.id, address: address.id}],
          }, state, props)
        },
      },
    }},
  }
  return store.dispatch(addPopup);
}
export const transferOrder = (params, data, state, props)=>{
  const list = props.applyFilters({key: 'ToArray', path: `settings__sub_mode.groups.mode.${data.mode}`})
  if (list.length > 1) {
    return store.dispatch({
      type: 'set_main_popup',
      data: {
        popup: {
          type: 'ButtonSelect', visable: true, width: '50%',
          childProps: {
            list,
            onClick: (sub_mode) =>{
              return changeOrderLocation(params, {...data, sub_mode: sub_mode.id}, state, props)
            },
          },
        },
      },
    })
  }
  return changeOrderLocation(params, data, state, props)
}
export const changeOrderLocation = (params, data, state, props)=>{
  const list = props.applyFilters({
    key: 'compareWithFun',
    path: `licensing__location.groups.types.sb`,
    fun: {
      key: 'GetDataSelector',
      show: 'chain',
    },
    compare: {
      fun: {
        key: 'chain',
        path: `orders__delivery_main.groups.first.${data.id}`,
        display: 'chain',
        selectors: {
          licensing__location: 'cc_location',
        },
      },
    },
  })
  if (list.length == 1) {
    return transferOrderToLoc({...params, t_location: get(list, '[0].id', '')}, data, state, props)
  }
  store.dispatch({
    type: 'set_main_popup',
    data: {
      popup: {
        type: 'ButtonSelect', visable: true, width: '50%',
        childProps: {
          list,
          onClick: (location={}) =>{
            transferOrderToLoc({...params, t_location: location.id}, data, state, props)
          },
        },
      },
    },
  })
}
export const transferOrderToLoc = (params, data, state, props)=>{
  let shift = data.shift
  if (params.t_location != params.location) {
    shift = props.applyFilters({
      location: params.t_location.id,
      key: 'checkLocationShiftBD',
    }, data, state, props);
  }
  const id = data.id
  if (!shift) {
    return null
  }
  props.applyFilters({
    key: 'UpdatingOrder',
    location: uniq([params.t_location, params.location]),
    sync: params.sync,
    id: params.active || '',
  }, {
    orders__main: [{id, ...data, shift, status: 'stl'}],
    orders__delivery_main: [{id, order: id, served_location: params.t_location, pick_location: params.t_location}],
  }, state, props)
}

export const UpdatingOrder = (params, data, state, props)=>{
  store.dispatch({
    type: 'UpdatingModels',
    data,
    onSuccess(res) {
      const order = get(res, 'orders__main[0].id')
      if (params.sync) {
        props.applyFilters({
          key: 'sendToLoc',
          order,
          location: params.location,
        }, res)
      }
      if (props.history) {
        setTimeout(()=>{
          props.history.push('/home')
        }, 100)
      }
      return [{
        type: 'set_main_popup',
        data: {popup: {}},
      }, {
        type: 'set_main_orders__main',
        data: {active: params.id, view: false, noAddr: false, noCancel: false, pathname: ''},
      }, {type: 'set_main_delivery_service', data: {extra: ''}}]
    },
  })
}

export const pickupOrder = (params, data, state, props)=>{
  const key = 'startOrder'+data.mode_key
  if (!data.is_callcenter) {
    return props.applyFilters({key, location: state.licensing__location.active}, data, state, props)
  }
  let list = toArray(get(state.licensing__location, `groups.types.sb`))
  if (data.sp) {
    list = props.applyFilters({
      key: 'ListFind',
      fun: {
        key: 'chain',
        display: 'active',
        selectors: {
          loc: {path: `dropdowns__delivery_service.groups.loc.:id.${data.sp}`},
        },
      },
    }, list)
  }
  if (list.length==1) {
    return props.applyFilters({key, location: list[0].id}, data, state, props)
  }
  return store.dispatch({
    type: 'set_main_popup',
    data: {popup: {
      type: 'ButtonSelect',
      childProps: {
        show: {key: 'GetDataSelector', show: 'full_name'},
        list,
        onClick: (location)=>(props.applyFilters({key, location: location.id}, data, state, props)),
      },
    }},
  })
}
export const checkLocationShiftBD = (params, data, state, props)=>{
  const shift = get(state.orders__shifts, `groups.location.${params.location}.id`)
  if (!shift) {
    message.warning('Location Donnot worked at this moment')
    return false
  }
  const bd = props.applyFilters({
    key: 'chain',
    selectors: {
      orders__shifts: 'id',
      orders__business_days: 'date',
    },
  }, {id: shift}, state, props)
  if (moment().diff(moment(bd.created_at), 'day') != 0) {
    message.warning('You Cannot Order in Location Business Day Please Contact Location')
    return false
  }
  return shift
}
export const startOrderCC = (params, data, state, props)=>{
  const shift = props.applyFilters({
    location: params.location,
    key: 'checkLocationShiftBD',
  }, data, state, props);
  if (!shift) {
    return null
  }
  const id = data.id || uuid()
  props.applyFilters({
    key: 'UpdatingOrder',
    id,
  }, {
    orders__main: [{id, ...data, start_time: moment(), shift}],
    orders__delivery_main: [{id, order: id, sp: data.sp, sp_code: data.sp_code, served_location: params.location, pick_location: params.location}],
  }, state, props)
}
export const startOrderCT = (params, data, state, props)=>{
  store.dispatch([{
    type: 'set_main_form',
    data: {
      extra: {
        pick_location: params.location,
        serve_location: params.location,
        ...data,
      },
    },
  }, {
    type: 'set_main_popup',
    data: {popup: {}},
  }])
  if (props.history) {
    props.history.push('/new_cat')
  }
}
export const pickAddress = (params, data, state, props)=>{
  data = {...data, address: params.id}
  const key = 'startOrder'+data.mode_key
  if (!data.is_callcenter) {
    return props.applyFilters({key, location: state.licensing__location.active}, data, state, props)
  }
  let list = props.applyFilters({
    key: 'chain',
    selectors: {
      geographies__street: 'street',
      licensing__location: {path: `licensing__location.groups.area.:area`},
    },
  }, params, state, props)
  if (data.sp) {
    list = props.applyFilters({
      key: 'ListFind',
      fun: {
        key: 'chain',
        display: 'active',
        selectors: {
          sp: {path: `dropdowns__delivery_service.groups.loc.:id.${data.sp}`},
        },
      },
    }, list, state, props)
  } else {
    list = toArray(list)
  }
  if (!list.length) {
    return message.error('No Location can serve this address')
  }
  if (list.length==1) {
    return props.applyFilters({key, location: list[0].id}, data, state, props)
  }
  return store.dispatch({
    type: 'set_main_popup',
    data: {popup: {
      type: 'ButtonSelect',
      childProps: {
        list,
        show: {key: 'GetDataSelector', show: 'full_name'},
        onClick: (location)=>(props.applyFilters({key, location: location.id}, data, state, props)),
      },
    }},
  })
}
export const deliveryOrder = (params, data, state, props)=>{
  const address = get(state.parties__address, `groups.customer.${data.customer}`)
  let list = toArray(address)
  if (!data.is_callcenter) {
    list = props.applyFilters(cuurentLoc(state.licensing__location.active), address, state, props);
  }
  // if (list.length == 1) {
  //   return pickAddress(list[0], data, state, props)
  // }
  const addPopup = {
    type: 'set_main_popup',
    data: {popup: {
      type: 'ButtonSelect',
      childProps: {
        extraButton: extraButton(data, (data, address)=>{
          pickAddress(list[0], data, state, props)
        }, ()=>{
          setTimeout(()=>{
            props.applyFilters({
              ...params,
              key: 'deliveryOrder',
            }, data, undefined, props)
          })
        }),
        show: {
          key: 'showAddress',
        },
        list: list,
        classes: {container: classes.a_container},
        onClick: (address)=>(pickAddress(address, data, state, props)),
      },
    }},
  }
  return store.dispatch(addPopup);
}
const activateMode = (params, data, state, props)=>{
  const fun = params.key+'Order';
  return props.applyFilters({
    key: fun,
  }, {...data, sub_mode: params.id, s_key: params.key}, state, props)
}
export const StartCCOrder = (params, data, state, props)=>{
  const extra = state.delivery_service.extra
  data = {...data, ...props.applyFilters(params.init)}
  const mode = get(state.settings__mode.data, data.mode, {})
  const station = get(state.licensing__station.data, state.licensing__station.active, {})
  data = {...data, mode_key: mode.key}
  data.is_callcenter = station.is_callcenter || data.mode_key=='CT'
  if (['CC', 'CT'].includes(mode.key)) {
    setTimeout(()=>{
      if (extra) {
        return activateMode({key: extra.sub_mode_key, id: extra.sub_mode}, {...data, ...extra, ...props.applyFilters(params.init)}, state, props)
      }
      const subModes = toArray(get(state.settings__sub_mode, `groups.mode.${data.mode}`))
      if (subModes.length > 1) {
        return store.dispatch({
          type: 'set_main_popup',
          data: {popup: {
            type: 'ButtonSelect',
            childProps: {
              list: subModes,
              onClick: (mode)=>(activateMode(mode, data, undefined, props)),
            },
          }},
        });
      } else {
        const subMode = subModes[0];
        if (subModes) {
          return activateMode(subMode, data, undefined, props)
        } else {
          return message.warning('Please Review Your SubModes data')
        }
      }
    })
  }
}

export const openPopup = (params, data, state, props)=>{
  store.dispatch({
    type: `set_main_popup`,
    data: {popup: params.params},
  })
}

export const CancelOrderData = (params, data, state, props) => {
  const datas = props.applyFilters({
    key: 'multiApply',
    apps: {
      details: {
        key: 'Filter',
        path: `orders__details.groups.order.${data.id}`,
        params: {
          parent: null,
          deleted: false,
          void: null,
        },
        then: {
          key: 'Reject',
          params: {fired_time: null},
        },
      },
      location: {
        path: `orders__delivery_main.groups.first.${data.id}.cc_location`,
      },
      current: {
        key: 'StateSelector',
        path: 'licensing__location.active',
      },
    },
  })
  const time = moment()
  const fired_time = (datas.location == datas.current) ? time:null

  const details = datas.details.map((d)=>{
    const voids = props.applyFilters({
      key: 'SumBy',
      path: `orders__details.groups.voids.${d.id}`,
      col: 'quantity',
    })
    return {
      ...omit(d, ['id']),
      id: uuid(),
      quantity: d.quantity - voids,
      void: d.id,
      fired_time,
      // price: d.price,
    }
  }).filter((d)=>d.quantity)
  return {
    orders__main: [{
      id: data.id,
      end_time: time,
      status: params.status,
      f_reason: params.note,
      canceled_time: time,
    }],
    orders__details: details,
  }
}
