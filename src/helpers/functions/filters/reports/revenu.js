import {last, first, sum, sumBy, get, mergeWith, isArray, isNumber, isString, max, min, range, filter, round, mapValues, groupBy, reject} from 'lodash'
import {getFilterData} from './main'
import moment from 'moment';
import {apply_front_calcs} from './front_calcs'

export const mergin = (props, o, src, key) => {
  if (isNumber(src)) {
    return (o || 0) + src
  } else if (isString(src)) {
    const {max_col = ['last'], min_col = ['first']} = props;
    if (max_col.includes(key)) {
      return max([src, o])
    }
    if (min_col.includes(key)) {
      return min([src, o])
    }
    return o
  }
}
export const MergingData = (params, data, state, props) => {
  return mergeWith({}, ...data, mergin.bind(data, props))
}


export const build_childs = (params, data, state, props) => {
  const key = props.key || 0;
  const level =(params.levels || props.levels)[key]
  let totals = mergeWith({}, ...data, mergin.bind(this, props))
  totals = apply_front_calcs(props.tableUpdates, totals)
  const f_d = first(data)
  if (!f_d) {
    return {totals}
  }
  if (!level) {
    return {
      totals,
    }
  }
  return {
    totals,
    childs: mapValues(groupBy(data, isArray(f_d.key) ? `key[${key}]` : `key`), (d, v) => ({
      id: v,
      ...build_childs(params, d, state, {...props, key: key + 1, level, mainLevels: get(state, 'apps.active.grouping', {})}),
    })),
  }
}

const getDaysRevenu = (props, bd_data, state, data, key) => {
  const bd_ids = data.map((d) => d.id)
  const {paid_items, paid_receipt} = props;
  const shifts = bd_data.orders__shifts.filter((d) => bd_ids.includes(d.date)).map((d) => d.id)
  const orders = bd_data.orders__main.filter((d) => shifts.includes(d.shift))
  const orders_ids = orders.map((d) => d.id);
  const receipts = paid_receipt.filter((d) => orders_ids.includes(d.order))
  const receipts_ids = receipts.map((d) => d.id);
  const items = paid_items.filter((d) => receipts_ids.includes(d.receipt))
  const out = {
    net_sales: round(sumBy(items, (d) => (d.item_sales - d.discount)), 2),
    receipt: receipts.length,
    key,
    guests: round(sumBy(orders, (d) => (d.guests || 1)), 2),
    get avg() {
      return round(this.net_sales / this.guests, 2)
    },
  }
  return out
}

const getReceiptRevenu = (props, bd_data, state, data, key) => {
  const {paid_items} = props;
  const orders_ids = data.map((d) => d.order);
  const orders = bd_data.orders__main.filter((d) => orders_ids.includes(d.id))
  const receipts = data;
  const receipts_ids = receipts.map((d) => d.id);
  const items = paid_items.filter((d) => receipts_ids.includes(d.receipt))
  const out = {
    net_sales: round(sumBy(items, (d) => (d.item_sales - d.discount)), 2),
    receipt: receipts.length,
    key,
    guests: round(sumBy(orders, (d) => (d.guests || 1)), 2),
    get avg() {
      return round(this.net_sales / this.guests, 2)
    },
  }
  return out
}

export const revenu_day = (params, bd_data, state, props) => {
  if (params.filters) {
    bd_data = getFilterData(params.filters, bd_data)
  }
  const paid_receipt = reject(filter(bd_data.orders__receipt, {_type: 'F'}), {invoice: null})
  const r_ids = paid_receipt.map((d) => d.id)
  const paid_items = filter(bd_data.orders__receipt_items, (d) => (r_ids.includes(d.receipt)))
  const report = mapValues(groupBy(params.business_days, (d) => (moment(d.created_at).format('DD/MM'))), getDaysRevenu.bind({}, {paid_items, paid_receipt}, bd_data, state))
  const fields = {
    'net_sales': {title: 'Net Sales'},
    'receipt': {title: 'Rcpts'},
    'guests': {title: 'Guests'},
    'avg': {title: 'Avg/G'},
  }
  const data = {
    businessDay: params.business_days,
    first_order: first(bd_data.orders__main),
    last_order: last(bd_data.orders__main),
    receipt: bd_data.orders__receipt.filter((d) => d.paid_time).length,
    guests: sum(bd_data.orders__main.map((d) => (d.guests_num || 1))),
    report,
    fields,
  }
  return data
}

export const revenu_hour = (params, bd_data, state, props) => {
  if (params.filters) {
    bd_data = getFilterData(params.filters, bd_data)
  }
  const today = moment()
  const paid_receipt = reject(filter(bd_data.orders__receipt, {_type: 'F'}), {invoice: null})
  const r_ids = paid_receipt.map((d) => d.id)
  const paid_items = filter(bd_data.orders__receipt_items, (d) => (r_ids.includes(d.receipt)))
  const report_data = mapValues(groupBy(paid_receipt, (d) => (moment(d.created_at).format('HH') + ':00')), getReceiptRevenu.bind({}, {paid_items, paid_receipt}, bd_data, state))
  const max_report = moment.max(params.business_days.map((d) => moment(d.end_time).set({year: today.year(), month: today.month(), day: today.day()}))).add(1, 'day')
  const min_report = moment.min(params.business_days.map((d) => moment(d.created_at).set({year: today.year(), month: today.month(), day: today.day()})))
  const ranges = max_report.diff(min_report, 'hours') % 24;
  const report = range(0, ranges).map((d) => (moment(min_report).add(d, 'hours').format('HH') + ':00'))
      .reduce((o, d) => ({
        ...o,
        [d]: get(report_data, d, {
          net_sales: 0,
          receipt: 0,
          key: d,
          guests: 0,
          avg: 0,
        }),
      }), {})
  const fields = {
    'net_sales': {title: 'Net Sales'},
    'receipt': {title: 'Rcpts'},
    'guests': {title: 'Guests'},
    'avg': {title: 'Avg/G'},
  }
  const data = {
    businessDay: params.business_days,
    first_order: first(bd_data.orders__main),
    last_order: last(bd_data.orders__main),
    receipt: bd_data.orders__receipt.filter((d) => d.paid_time).length,
    guests: sum(bd_data.orders__main.map((d) => (d.guests_num || 1))),
    report,
    fields,
  }
  return data
}
