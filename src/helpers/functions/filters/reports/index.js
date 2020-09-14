import {last, first, sum, sumBy, get, filter, map, groupBy, reject} from 'lodash'
export * from './revenu';
import {getFilterData, calculateDetailsItemSales} from './main'
export const getBdApps = (params, date, state, props) => {
  return {
    orders__shifts: {filter: {date__in: date}},
    orders__main: {filter: {shift__date__in: date}},
    orders__details: {filter: {order__shift__date__in: date}},
    orders__payment: {filter: {order__shift__date__in: date}},
    orders__receipt: {filter: {order__shift__date__in: date}},
    orders__receipt_items: {filter: {receipt__order__shift__date__in: date}},
  }
}

export const report_business_day = (params, bd_data, state, props)=>{
  // const {shift} = params.filter;
  // const {shifts} = params.filters
  if (params.filters) {
    bd_data = getFilterData(params.filters, bd_data)
  }
  const paid_receipt = reject(filter(bd_data.orders__receipt, {_type: 'F'}), {invoice: null})
  const r_ids = paid_receipt.map((d)=>d.id)
  const paid_items = filter(bd_data.orders__receipt_items, (d)=>(r_ids.includes(d.receipt)))
  const payments = filter(bd_data.orders__payment, (d)=>(r_ids.includes(d.receipt)))
  const details_objects = bd_data.orders__details.reduce((o, v)=>({...o, [v.id]: v}), {})

  const data = {
    businessDay: params.business_days,
    first_order: first(bd_data.orders__main),
    last_order: last(bd_data.orders__main),
    receipt: paid_receipt.length,
    guests: sum(bd_data.orders__main.map((d)=>(d.guests_num || 1))),
    orders: {
      total: calculateDetailsItemSales(reject(bd_data.orders__details, (d)=>d.void), details_objects),
      canceled: calculateDetailsItemSales(filter(bd_data.orders__details, (d)=>((d.deleted || get(state.orders__main.data, `${d.order}.canceled_time`)) && !d.void)), details_objects),
      voided: calculateDetailsItemSales(filter(bd_data.orders__details, (d)=>(d.void)), details_objects),
    },
    sales: {
      item: sumBy(paid_items, 'item_sales'),
      discount: sumBy(paid_items, 'discount'),
      item_tax: sumBy(paid_receipt, 'tax'),
      get net() {
        return this.item-this.discount
      },
      services: sumBy(paid_receipt, 'service'),
      get gross() {
        return this.net+this.services
      },
      get grand() {
        return this.gross+this.item_tax
      },
    },
    payment: {
      ...map(state.payment__types.data, (d) => ({
        key: d.name,
        value: sumBy(payments.filter((v)=>v.payment_type == d.id), 'value'),
      })).reduce((o, v)=>({...o, [v.key]: v.value}), {}),
    },
    modes: {
      ...map(state.settings__mode.data, (d) => {
        const orders = bd_data.orders__main.filter((v) => v.mode == d.id).map((d)=>d.id);
        const receipts = paid_receipt.filter((d) => orders.includes(d.order))
        return {
          key: d.name,
          value: {
            receipts: receipts.length,
            gross_sales: sumBy(receipts, 'net_total'),
            get item_sales() {
              return this.gross_sales - sumBy(receipts, 'service')
            },
          },
        }
      }).reduce((o, v) => ({...o, [v.key]: v.value}), {}),
    },

  }
  return data;
}


export const report_pm = (params, bd_data, state, props) => {
  if (params.filters) {
    bd_data = getFilterData(params.filters, bd_data)
  }
  const paid_receipt = reject(filter(bd_data.orders__receipt, {_type: 'F'}), {invoice: null})
  const r_ids = paid_receipt.map((d)=>d.id)
  const paid_items = filter(bd_data.orders__receipt_items, (d)=>(r_ids.includes(d.receipt)))
  const list = map(groupBy(paid_items.map((d)=>({
    item_sales: d.item_sales,
    item: bd_data.orders__details.find((v)=>(v.id==d.details)).item,
    quantity: d.quantity,
  })), 'item'), (d, index)=>({
    item: index,
    item_sales: sumBy(d, 'item_sales'),
    quantity: sumBy(d, 'quantity'),
  }));
  const data = {
    businessDay: params.business_days,
    first_order: first(bd_data.orders__main),
    last_order: last(bd_data.orders__main),
    receipt: bd_data.orders__receipt.filter((d)=>d.paid_time).length,
    guests: sum(bd_data.orders__main.map((d)=>(d.guests_num || 1))),
    list,
    items: list.reduce((o, v)=>({...o, [v.item]: v}), {}),
    get cats_list() {
      return map(groupBy(this.list, (d)=>{
        const price = get(state.items__prices.data, d.item, {})
        const sales_item = get(state.items__sales_items.data, price.sales_item, {})
        return sales_item.base_sales_cat
      }), (d, index)=>({
        cat: index,
        item_sales: sumBy(d, 'item_sales'),
        quantity: sumBy(d, 'quantity'),
      }))
    },
    get cats() {
      return this.cats_list.reduce((o, v)=>({...o, [v.cat]: v}), {})
    },
    get menu_list() {
      return map(groupBy(this.cats_list, (d)=>{
        const cat = get(state.items__base_sales_cat.data, d.cat, {})
        return cat.custom_menu
      }), (d, index)=>({
        menu: index,
        item_sales: sumBy(d, 'item_sales'),
        quantity: sumBy(d, 'quantity'),
      }))
    },
    get menus() {
      return this.menu_list.reduce((o, v)=>({...o, [v.menu]: v}), {})
    },
    get dep_list() {
      return map(groupBy(this.menu_list, (d)=>{
        const menu = get(state.items__custom_menu.data, d.menu, {})
        return menu.department
      }), (d, index)=>({
        dep: index,
        item_sales: sumBy(d, 'item_sales'),
        quantity: sumBy(d, 'quantity'),
      }))
    },
    get deps() {
      return this.dep_list.reduce((o, v)=>({...o, [v.dep]: v}), {})
    },
  }
  return data
}
