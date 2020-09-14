import {get, mapValues, omit, range, flatten, pick, merge} from 'lodash';
import uuid from 'uuid/v4';
import store from 'store'
import moment from 'moment'
// import {mode as c_mode} from 'config'
export const SavingPayment = (params, data, state, props, receipt) => {
  const id = uuid();
  const out = {
    orders__payment: [{
      id,
      ...params.payment,
      receipt: receipt.id,
      order: receipt.order,
      currency: state.dropdowns__currencies.active,
    }],
  }
  const fired_time = moment()
  if (props.paid && props.print) {
    const details = props.applyFilters({
      key: 'Filter',
      path: 'orders__details',
      params: {
        fired_time: null,
        parent: null,
        order: receipt.order,
      },
      then: {
        key: 'Reject',
        params: {
          deleted: true,
        },
      },
    })
    out.orders__details = details.map((d) => ({id: d.id, fired_time}))
  }
  if (params.end_order) {
    out.orders__main = [{
      id: receipt.order,
      end_time: fired_time,
    }]
  }
  return out
}
export const syncReceipt = (params, data, state, props) => {
  const receipt = params.receipt;
  const order = get(state.orders__main.data, receipt.order);
  const ord_loc = props.applyFilters({
    key: 'chain',
    display: 'location',
    selectors: {
      licensing__station: 'station',
    },
  }, order, state)
  if (ord_loc != state.licensing__location.active) {
    const apps = props.applyFilters({
      key: 'multiApply',
      apps: mapValues(data, (d) => ({
        key: 'keys',
        levels: ['id'],
      })),
    }, data, state)
    props.applyFilters({
      key: 'sendToHq',
    }, {data: apps, send: ord_loc})
  }
}
export const syncOrder = (params, data, state, props) => {
  const order = get(state.orders__main.data, params.order, {})
  const datas = props.applyFilters({
    key: 'multiApply',
    apps: {
      ord_loc: {
        key: 'chain',
        display: 'location',
        selectors: {
          licensing__station: 'station',
        },
      },
      delivery_main: {
        key: 'StateSelector',
        path: `orders__delivery_main.groups.first.${params.order}`,
      },
      current: {
        key: 'StateSelector',
        path: 'licensing__location.active',
      },
    },
  }, order, state)
  const apps = props.applyFilters({
    key: 'multiApply',
    apps: mapValues(data, (d) => ({
      key: 'keys',
      levels: ['id'],
    })),
  }, data, state)
  if (datas.current != datas.delivery_main?.cc_location) {
    props.applyFilters({
      key: 'sendToHq',
    }, {data: apps, send: datas.delivery_main?.cc_location})
  }
  if (!datas.current != datas.ord_loc) {
    props.applyFilters({
      key: 'sendToHq',
    }, {data: apps, send: datas.ord_loc})
  }
  if (props.location) {
    props.applyFilters({
      key: 'sendToHq',
    }, {data: apps, send: props.location})
  }
}
export const calcReceiptOrder = (params, data, state, props) => {
  return merge({
    id: data.id,
    receipt: data.id,
  },
  pick(data, ['sold', 'void', 'cancel']))
}
export const SavingReceipt = (params, data, state, props) => {
  const time = new Date();
  const order = props.applyFilters({path: `orders__main.data.${data.order}`})
  const mode = props.applyFilters({path: `settings__mode.data.${order.mode}`})
  const settings = get(state, `settings__chain_customer_receipt.groups.chain.${state.licensing__chain.active}`)
  const takawayTrail = get(settings, 'takeaway_trail', false)
  // console.log('sett',settings,'moooddee',mode , 'takeawat  ',takawayTrail)
  const id = state.orders__receipt.active || uuid()
  let receiptOrder = null
  // const extra_data = {}
  const receipt = {
    id,
    ...omit(data, ['items']),
  }
  if (props.paid) {
    const datas = props.applyFilters({
      key: 'multiApply',
      apps: {
        calc: {
          path: `orders__details.groups.order.${data.order}`,
          key: 'Reject',
          params: {
            deleted: true,
          },
          then: {
            key: 'calculateOrderReceipt',
          },
        },
        receipts: {
          path: `orders__receipt.groups.order.${data.order}`,
          key: 'Filter',
          params: {
            invoice: null,
          },
        },
      },
    }, undefined, undefined, {
      seatsNum: range(0, (order.guests_num + 1)),
    })
    if ((datas.calc.balance_due-.02) <= get(params, 'payment.paid', 0) && get(datas, 'receipts.length', 0)==1) {
      params.end_order = params.end_order || true
    }
    receipt.paid_time = time
    receiptOrder = calcReceiptOrder({}, receipt, state, props)
  }
  if (props.print) {
    receipt.print_time = time
  }
  const s_data = {
    orders__receipt: [receipt],
    // orders__receipt_sold_items: [receiptOrder],
    orders__receipt_items: data.items.map((d) => ({...d, receipt: id})),
    ...SavingPayment(params, data, state, props, receipt),
  }
  store.dispatch([{
    type: 'UpdatingModels',
    data: s_data,
    onSuccess(res) {
      const receipt = get(res, 'orders__receipt[0]', {})
      syncReceipt({
        receipt,
      }, res, state, props)
      const items = get(res, 'orders__details', [])
      const bulkPrints = {}
      const dis = [];
      if (receiptOrder && receipt.customer) {
        dis.push({
          type: 'append_path_with_analysis',
          path: `data.customer.${receipt.customer}`,
          data: {
            lengths: {receipts: 1, orders: 1},
            items: {
              items_sales: {
                qty: receiptOrder.sold.qty-receiptOrder.cancel.qty-receiptOrder.void.qty,
                val: receiptOrder.sold.val-receiptOrder.cancel.val-receiptOrder.void.val,
              },
            },
            orders: {
              items: receiptOrder.sold,
              canceled: receiptOrder.cancel,
              voided: receiptOrder.void,
              payments: {total: receipt.total},
              totals: {
                grant: receipt.total,
                gross: {val: receipt.total-receipt.tax},
                net: {val: receipt.total-receipt.tax-receipt.service},
              },
            },
          },
        })
      }
      if (get(res, 'orders__receipt.length', 0) == 1) {
        dis.push({
          type: 'set_main_orders__receipt',
          data: {active: receipt.id},
        })
      }
      if (props.paid && props.print) {
        // const {print_count = 2} = params;
        bulkPrints.receipt = {
          active: 'Receipt',
          id: uuid(),
          get timestamp() {
            return this.id
          },
          receipts: [receipt.id],
        }
      }
      if (props.paid && props.print && mode.key == 'TW' && takawayTrail) {
        // const {print_count = 1} = params;
        bulkPrints.takawayTrail = {
          active: 'TakeawayTrail',
          id: uuid(),
          get timestamp() {
            return this.id
          },
          order,
          receipts: [receipt.id],

        }
      }
      if (items.length) {
        bulkPrints.items = {
          active: 'Kitchen',
          order: receipt.order,
          id: uuid(),
          get timestamp() {
            return this.id
          },
          items: items.map((d) => d.id),
        }
      }
      const station = props.applyFilters({
        // path: '',
        key: 'chain',
        selectors: {
          licensing__station: 'licensing__station.active',
        },
      }, null)
      // console.log('station', station)
      if (!station.printing) {
        setTimeout(() => {
          props.finish(receipt)
        })
      }

      return [{
        type: 'set_main_Printing',
        data: {
          bulkPrints,
          afterPrint() {
            // console.log('finish printing')
            props.finish(receipt)
          },
        },
      }, ...dis]
    },
  }, {
    type: 'set_main_items__sales_items',
    data: {active: ''},
  }])
}

export const SavingReceipts = (params, data, state, props) => {
  const time = new Date();
  store.dispatch({
    type: 'UpdatingModels',
    data: {
      orders__receipt: data.map((d) => ({...omit(d, ['items']), print_time: props.print ? time : undefined})),
      orders__receipt_items: flatten(data.map((d) => d.items)),
    },
    onSuccess(res) {
      syncReceipt({
        receipt: get(res, 'orders__receipt[0]', {}),
      }, res, state, props)
      props.finish(res.orders__receipt)
      return [{
        type: 'set_main_Printing',
        data: {
          bulkPrints: {
            receipt: {
              id: uuid(),
              get timestamp() {
                return this.id
              },
              active: 'Receipt', receipts: res.orders__receipt.map((d) => d.id), afterPrint() {
                return Promise.resolve()
              },
            },
          },
        },
      }]
    },
  })
}
