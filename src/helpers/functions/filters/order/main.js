import {get} from 'lodash'
import uuid from 'uuid/v4'
import {map} from 'lodash'
const show = {
  key: 'GetDataSelector',
  show: 'name',
}
export const getDetailData = (params, data, state, props) => {
  return props.applyFilters({
    key: 'multiApply',
    apps: {
      size: {
        key: 'chain',
        selectors: {
          items__prices: 'item',
          dropdowns__units_of_measure: 'sales_unit',
        },
      },
      price: {
        key: 'chain',
        selectors: {
          items__prices: 'item',
        },
      },
      item: {
        key: 'chain',
        selectors: {
          items__prices: 'item',
          items__sales_items: 'sales_item',
        },
      },
      course: {
        key: 'chain',
        selectors: {
          dropdowns__courses: 'course',
        },
      },
    },
  }, data, state, props)
}
export const getDetailDataNames = (params, data, state, props) => {
  return props.applyFilters({
    key: 'multiApply',
    apps: {
      size: {
        key: 'chain',
        selectors: {
          items__prices: 'item',
          dropdowns__units_of_measure: 'sales_unit',
        },
        then: show,
      },
      attribute2: {
        key: 'chain',
        selectors: {
          items__prices: 'item',
          dropdowns__second_attribute: 'second_attribute',
        },
        then: show,
      },
      price: {
        key: 'chain',
        selectors: {
          items__prices: 'item',
        },
      },
      item: {
        key: 'chain',
        selectors: {
          items__prices: 'item',
          items__sales_items: 'sales_item',
        },
        then: show,
      },
      course: {
        key: 'chain',
        selectors: {
          dropdowns__courses: 'course',
        },
      },
    },
  }, data, state, props)
}
export const reload = (params, data, state, props)=>{
  if (!get(state, 'orders__main.active')) {
    window.location.reload()
  }
  setTimeout(props.applyFilters, 10000, params)
}

export const PrintItems = (params, data, state, props)=>{
  return {
    type: 'set_main_Printing',
    data: {
      bulkPrints: {
        kitchen: {
          active: 'Kitchen',
          id: uuid(),
          get timestamp() {
            return this.id
          },
          order: params.order,
          items: map(data, (d)=>(d.id || d)),
        },
      },
    },
  }
}
const fields = {
  floor: {f: 'floor_name', l: 'Floor'},
  apartment: {f: 'apartment_name', l: 'Apartment'},
  add: {f: 'full_address', l: ''},
  notes: {f: 'delivery_notes', l: 'Note'},
  land: {f: 'delivery_landmark', l: 'LandMark'},
}
export const showAddress = (params, data, state, props)=>{
  const translate = params.translate || function(d) {
    return d
  };
  return map(fields, (d)=>{
    const val = get(data, d.f)
    if (val) {
      return [translate(d.l), val].join(' ')
    }
  }).filter(Boolean).join(', ')
}
